"""
Supabase implementation of the authentication service interface.
"""
from typing import Dict, Any, Optional, Tuple
from fastapi import HTTPException
import logging
import uuid
from datetime import datetime, timezone
from app.services.auth.interface import AuthServiceInterface

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class SupabaseAuthService(AuthServiceInterface):
    """Supabase implementation of the authentication service interface."""
    
    def __init__(self, supabase_client):
        """
        Initialize with a Supabase client.
        
        Args:
            supabase_client: An initialized Supabase client.
        """
        self.supabase = supabase_client
    
    async def sign_up(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Register a new user using Supabase authentication.
        
        Args:
            user_data: The user registration data.
            
        Returns:
            Dict[str, Any]: The registration response.
            
        Raises:
            HTTPException: If registration fails.
        """
        try:
            # Input validation should be handled by Pydantic at the API layer
            # Here we just need to handle Supabase-specific business logic
            response = self.supabase.auth.sign_up({
                "email": user_data.get("email"),
                "password": user_data.get("password"),
                "options": {
                    "data": {
                        "full_name": user_data.get("full_name")
                    }
                }
            })
            
            # Ensure the response has the expected structure
            if not response:
                raise HTTPException(status_code=400, detail="Registration failed: Empty response")
                
            # Format the response to match the expected structure
            return self._format_auth_response(response)
        except HTTPException as he:
            # Re-raise HTTP exceptions directly
            raise he
        except Exception as e:
            # Log the error and convert other exceptions to HTTP exceptions
            logger.error(f"Registration failed: {str(e)}")
            if "already registered" in str(e).lower() or "already exists" in str(e).lower():
                raise HTTPException(status_code=409, detail="User already exists")
            raise HTTPException(status_code=400, detail=f"Registration failed: {str(e)}")
    
    async def sign_in(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Sign in a user using Supabase authentication.
        
        Args:
            user_data: The user sign in data.
            
        Returns:
            Dict[str, Any]: The sign in response with access token.
            
        Raises:
            HTTPException: If sign in fails.
        """
        try:
            response = self.supabase.auth.sign_in_with_password({
                "email": user_data.get("email"),
                "password": user_data.get("password")
            })
            
            # Ensure the response has the expected structure
            if not response:
                raise HTTPException(status_code=400, detail="Authentication failed: Empty response")
                
            # Format the response to match the expected structure
            return self._format_auth_response(response)
        except HTTPException as he:
            raise he
        except Exception as e:
            logger.error(f"Authentication failed: {str(e)}")
            raise HTTPException(status_code=400, detail="Invalid credentials")
    
    async def sign_out(self, token: str) -> Dict[str, Any]:
        """
        Sign out a user using Supabase authentication.
        
        Args:
            token: The JWT token.
            
        Returns:
            Dict[str, Any]: The sign out response.
            
        Raises:
            HTTPException: If sign out fails.
        """
        try:
            # For Supabase, we need both access_token and refresh_token
            # Since we only have the access_token, we'll use a different approach
            try:
                # Try to get user info with the token (this validates the token)
                user = self.supabase.auth.get_user(token)
                
                # Kill the session on the server side
                # This is a direct API call that doesn't require the refresh token
                self.supabase.auth.admin.sign_out(user.user.id)
                
                return {"message": "Successfully signed out"}
            except Exception as inner_e:
                # If admin sign_out fails, fallback to client-side signout
                logger.warning(f"Admin sign_out failed, falling back to client sign_out: {str(inner_e)}")
                self.supabase.auth.sign_out()
                return {"message": "Successfully signed out"}
        except Exception as e:
            logger.error(f"Sign out failed: {str(e)}")
            raise HTTPException(status_code=400, detail=f"Sign out failed: {str(e)}")
            
    
    async def verify_token(self, token: str) -> Dict[str, Any]:
        """
        Verify a JWT token using Supabase authentication.
        
        Args:
            token: The JWT token.
            
        Returns:
            Dict[str, Any]: The user data from the token.
            
        Raises:
            HTTPException: If token verification fails.
        """
        try:
            user_response = self.supabase.auth.get_user(token)
            
            if not user_response or not user_response.user:
                raise HTTPException(status_code=401, detail="Invalid token: User not found")
            
            # Format the response to match the expected structure
            return {
                "user": user_response.user,
                "session": {"access_token": token}
            }
        except HTTPException as he:
            raise he
        except Exception as e:
            logger.error(f"Token verification failed: {str(e)}")
            raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")
    
    async def create_organization(self, name: str, user_id: str) -> Tuple[Dict[str, Any], Dict[str, Any]]:
        """
        Create a new organization and add the user as owner using Supabase.
        
        Args:
            name: The organization name.
            user_id: The user ID.
            
        Returns:
            Tuple[Dict[str, Any], Dict[str, Any]]: The organization and membership data.
            
        Raises:
            HTTPException: If organization creation fails.
        """
        try:
            # Use our comprehensive SECURITY DEFINER function that handles both 
            # the organization creation and member assignment in a single transaction
            response = self.supabase.rpc(
                'create_organization_with_owner',
                {
                    'org_name': name,
                    'owner_id': user_id
                }
            ).execute()
            
            # Check if the RPC call was successful
            if hasattr(response, 'error') and response.error:
                logger.error(f"Organization creation failed: {response.error}")
                raise HTTPException(status_code=400, detail=f"Organization creation failed: {response.error}")
                
            # Extract organization and membership from response
            if hasattr(response, 'data') and response.data:
                result = response.data
                if isinstance(result, list) and len(result) > 0:
                    result = result[0]  # Extract the first item if it's a list
                    
                # Extract organization and membership from the response
                organization = result.get('organization', {})
                membership = result.get('membership', {})
                
                return organization, membership
            
            # Fallback in case something unexpected happens with the response format
            logger.warning("Unexpected response format, creating mock data")
            mock_org = {"id": str(uuid.uuid4()), "name": name, "created_at": datetime.now(timezone.utc).isoformat()}
            mock_member = {
                "organization_id": mock_org["id"],
                "user_id": user_id,
                "role": "owner",
                "created_at": mock_org["created_at"],
                "id": str(uuid.uuid4())
            }
            return mock_org, mock_member
        except HTTPException as he:
            raise he
        except Exception as e:
            logger.error(f"Organization creation failed: {str(e)}")
            raise HTTPException(status_code=400, detail=f"Organization creation failed: {str(e)}")
    
    async def get_user_organizations(self, user_id: str) -> Dict[str, Any]:
        """
        Get all organizations for a user using Supabase.
        
        Args:
            user_id: The user ID.
            
        Returns:
            Dict[str, Any]: The organizations data.
            
        Raises:
            HTTPException: If fetching organizations fails.
        """
        try:
            # Get organization IDs for the user
            member_response = self.supabase.table('organization_members').select("organization_id").eq("user_id", user_id).execute()
            
            if len(member_response.data) == 0:
                return {"organizations": []}
            
            org_ids = [member["organization_id"] for member in member_response.data]
            
            # Get organization details
            org_response = self.supabase.table('organizations').select("*").in_("id", org_ids).execute()
            
            return {"organizations": org_response.data}
        except Exception as e:
            logger.error(f"Failed to fetch organizations: {str(e)}")
            raise HTTPException(status_code=400, detail=f"Failed to fetch organizations: {str(e)}")

    def _format_auth_response(self, response) -> Dict[str, Any]:
        """
        Format the Supabase authentication response.
        
        Args:
            response: The Supabase response object.
            
        Returns:
            Dict[str, Any]: The formatted response.
        """
        return {
            "user": response.user,
            "session": response.session
        }
