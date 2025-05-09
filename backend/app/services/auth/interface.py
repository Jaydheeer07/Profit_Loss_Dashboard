"""
Authentication service interface for ProfitLens.
Defines the interface for all authentication service implementations.
"""
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional, Tuple, List


class AuthServiceInterface(ABC):
    """Abstract base class defining the authentication service interface."""

    @abstractmethod
    async def sign_up(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Register a new user.
        
        Args:
            user_data: The user registration data including email, password, and full_name.
            
        Returns:
            Dict[str, Any]: The registration response with user and session data.
            
        Raises:
            HTTPException: If registration fails.
        """
        pass
        
    @abstractmethod
    async def sign_in(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Sign in a user.
        
        Args:
            user_data: The user sign in data including email and password.
            
        Returns:
            Dict[str, Any]: The sign in response with user and session data.
            
        Raises:
            HTTPException: If sign in fails.
        """
        pass
        
    @abstractmethod
    async def sign_out(self, token: str) -> Dict[str, Any]:
        """
        Sign out a user.
        
        Args:
            token: The JWT token.
            
        Returns:
            Dict[str, Any]: The sign out response.
            
        Raises:
            HTTPException: If sign out fails.
        """
        pass
        
    @abstractmethod
    async def verify_token(self, token: str) -> Dict[str, Any]:
        """
        Verify a JWT token.
        
        Args:
            token: The JWT token.
            
        Returns:
            Dict[str, Any]: The user data from the token.
            
        Raises:
            HTTPException: If token verification fails.
        """
        pass
        
    @abstractmethod
    async def create_organization(self, name: str, user_id: str) -> Tuple[Dict[str, Any], Dict[str, Any]]:
        """
        Create a new organization and add the user as owner.
        
        Args:
            name: The organization name.
            user_id: The user ID.
            
        Returns:
            Tuple[Dict[str, Any], Dict[str, Any]]: The organization and membership data.
            
        Raises:
            HTTPException: If organization creation fails.
        """
        pass
        
    @abstractmethod
    async def get_user_organizations(self, user_id: str) -> Dict[str, Any]:
        """
        Get all organizations for a user.
        
        Args:
            user_id: The user ID.
            
        Returns:
            Dict[str, Any]: The organizations data with a list of organizations.
            
        Raises:
            HTTPException: If fetching organizations fails.
        """
        pass
