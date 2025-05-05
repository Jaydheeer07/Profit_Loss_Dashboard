"""
Configuration settings for the application.

This module uses pydantic-settings to load and validate environment variables.
All environment variables should be defined and accessed through this module.
"""

from pathlib import Path
from typing import Optional, List
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

# Get backend root directory
BACKEND_ROOT = Path(__file__).parent.parent.parent


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # API settings
    API_PREFIX: str = "/api"
    API_TITLE: str = "Profit & Loss Dashboard API"
    API_DESCRIPTION: str = "API for analyzing profit and loss reports and generating insights"
    API_VERSION: str = "1.0.0"
    
    # CORS settings
    CORS_ORIGINS: List[str] = Field(default=["*"])
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_ALLOW_METHODS: List[str] = Field(default=["*"])
    CORS_ALLOW_HEADERS: List[str] = Field(default=["*"])
    
    # OpenAI API settings
    OPENAI_API_KEY: Optional[str] = None
    OPENAI_MODEL_NAME: str = "gpt-4o-mini"
    OPENAI_BASE_URL: str = "https://api.openai.com/v1"
    
    # Development mode
    DEV_MODE: bool = False
    
    # Cache settings
    CACHE_TTL_HOURS: int = 24
    
    # Configure environment variables file
    model_config = SettingsConfigDict(
        env_file=BACKEND_ROOT / ".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )
    
    @field_validator("OPENAI_API_KEY")
    @classmethod
    def validate_openai_api_key(cls, v: Optional[str]) -> Optional[str]:
        """Validate that the OpenAI API key starts with 'sk-' if provided."""
        if v is not None and v and not v.startswith("sk-"):
            raise ValueError("OpenAI API key must start with 'sk-'")
        return v
    
    @property
    def is_openai_configured(self) -> bool:
        """Check if OpenAI API is properly configured."""
        return self.OPENAI_API_KEY is not None and len(self.OPENAI_API_KEY) > 0
    
    @property
    def use_mock_responses(self) -> bool:
        """Check if mock responses should be used."""
        return self.DEV_MODE or not self.is_openai_configured


# Create a global settings object
settings = Settings()
