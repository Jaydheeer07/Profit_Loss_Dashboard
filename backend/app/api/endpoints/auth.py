"""
Authentication endpoints for ProfitLens.
"""
from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Body
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.services.auth import (get_production_auth_service, UserSignUp, 
                              UserSignIn, Organization)
from app.services.auth.interface import AuthServiceInterface

router = APIRouter()
security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    auth_service: AuthServiceInterface = Depends(get_production_auth_service)
) -> Dict[str, Any]:
    """
    Get the current authenticated user.
    
    Args:
        credentials: The HTTP authorization credentials.
        auth_service: Auth service dependency.
        
    Returns:
        Dict[str, Any]: The user data.
        
    Raises:
        HTTPException: If authentication fails.
    """
    token = credentials.credentials
    return await auth_service.verify_token(token)

@router.post("/signup", response_model=Dict[str, Any])
async def sign_up(
    user_data: UserSignUp = Body(...),
    auth_service: AuthServiceInterface = Depends(get_production_auth_service)
):
    """
    Register a new user.
    
    Args:
        user_data: The user registration data.
        auth_service: Auth service dependency.
        
    Returns:
        Dict[str, Any]: The registration response.
    """
    # UserSignUp's validation handles the minimum password length
    user_data_dict = user_data.model_dump()
    return await auth_service.sign_up(user_data_dict)


@router.post("/signin", response_model=Dict[str, Any])
async def sign_in(
    user_data: UserSignIn = Body(...),
    auth_service: AuthServiceInterface = Depends(get_production_auth_service)
):
    """
    Sign in a user.
    
    Args:
        user_data: The user sign in data.
        auth_service: Auth service dependency.
        
    Returns:
        Dict[str, Any]: The sign in response with access token.
    """
    user_data_dict = user_data.model_dump()
    return await auth_service.sign_in(user_data_dict)


@router.post("/signout", response_model=Dict[str, Any])
async def sign_out(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    auth_service: AuthServiceInterface = Depends(get_production_auth_service)
):
    """
    Sign out a user.
    
    Args:
        credentials: The HTTP authorization credentials.
        auth_service: Auth service dependency.
        
    Returns:
        Dict[str, Any]: The sign out response.
    """
    token = credentials.credentials
    return await auth_service.sign_out(token)


@router.get("/me", response_model=Dict[str, Any])
async def get_me(user: Dict[str, Any] = Depends(get_current_user)):
    """
    Get the current authenticated user.
    
    Args:
        user: The authenticated user data.
        
    Returns:
        Dict[str, Any]: The user data.
    """
    return user


@router.post("/organizations/create", response_model=Dict[str, Any])
async def create_organization(
    org_data: Organization = Body(...),
    user: Dict[str, Any] = Depends(get_current_user),
    auth_service: AuthServiceInterface = Depends(get_production_auth_service)
):
    """
    Create a new organization.
    
    Args:
        org_data: The organization data.
        user: The authenticated user data.
        auth_service: Auth service dependency.
        
    Returns:
        Dict[str, Any]: The created organization data.
    """
    # Safely extract user_id handling different response structures
    if isinstance(user.get("user"), dict):
        # Dictionary format (from mock service)
        user_id = user["user"]["id"]
    elif hasattr(user.get("user"), "id"):
        # Object format (from Supabase) 
        user_id = user["user"].id
    else:
        # Direct format
        user_id = user.get("id")
    
    organization, membership = await auth_service.create_organization(org_data.name, user_id)
    return {"organization": organization, "membership": membership}


@router.get("/organizations/list", response_model=Dict[str, Any])
async def get_organizations(
    user: Dict[str, Any] = Depends(get_current_user),
    auth_service: AuthServiceInterface = Depends(get_production_auth_service)
):
    """
    Get all organizations for the current user.
    
    Args:
        user: The authenticated user data.
        auth_service: Auth service dependency.
        
    Returns:
        Dict[str, Any]: The organizations data.
    """
    # Safely extract user_id handling different response structures
    if isinstance(user.get("user"), dict):
        # Dictionary format (from mock service)
        user_id = user["user"]["id"]
    elif hasattr(user.get("user"), "id"):
        # Object format (from Supabase) 
        user_id = user["user"].id
    else:
        # Direct format
        user_id = user.get("id")
        
    return await auth_service.get_user_organizations(user_id)
