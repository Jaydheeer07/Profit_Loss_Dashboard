"""
Authentication service initialization.
Provides factory function for getting the appropriate auth service implementation.
"""
from typing import Optional, Dict, Any
import os
from app.services.auth.interface import AuthServiceInterface
from app.services.auth.supabase_auth import SupabaseAuthService
from app.services.auth.mock_auth import MockAuthService
from app.models.authentication import UserSignUp, UserSignIn, Organization, OrganizationMember


def get_auth_service(test_mode: bool = False) -> AuthServiceInterface:
    """
    Factory function to get the appropriate auth service implementation.
    
    Args:
        test_mode: Whether to use the mock implementation for testing.
        
    Returns:
        An instance of AuthServiceInterface.
    """
    if test_mode or os.environ.get('TESTING', 'False').lower() in ('true', '1', 't'):
        # Return the mock implementation for testing
        return MockAuthService()
    else:
        # Return the Supabase implementation for production
        from app.core.supabase_client import get_supabase_client
        return SupabaseAuthService(get_supabase_client())


def get_production_auth_service() -> AuthServiceInterface:
    """
    Factory function for API endpoints to get the auth service without exposing test_mode parameter.
    This function is used with FastAPI's Depends() to avoid exposing test_mode in the OpenAPI schema.
    
    Returns:
        An instance of AuthServiceInterface for production use.
    """
    return get_auth_service(test_mode=False)


# Export the interface, implementation classes, and models
__all__ = [
    'AuthServiceInterface',
    'SupabaseAuthService',
    'MockAuthService',
    'get_auth_service',
    'get_production_auth_service',  # Add the new function to exports
    'UserSignUp',
    'UserSignIn',
    'Organization',
    'OrganizationMember'
]
