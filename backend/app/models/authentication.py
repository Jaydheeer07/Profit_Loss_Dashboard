"""
Pydantic models for authentication service.
"""
from pydantic import BaseModel, EmailStr, Field


class UserSignUp(BaseModel):
    """User sign up request model."""
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: str = Field(..., min_length=1)


class UserSignIn(BaseModel):
    """User sign in request model."""
    email: EmailStr
    password: str


class Organization(BaseModel):
    """Organization model."""
    name: str = Field(..., min_length=1)


class OrganizationMember(BaseModel):
    """Organization member model."""
    organization_id: str
    user_id: str
    role: str = Field(..., pattern="^(owner|admin|member)$")
