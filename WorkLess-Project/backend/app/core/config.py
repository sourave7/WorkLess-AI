"""
Application Configuration
Environment-based configuration management
"""

from pydantic_settings import BaseSettings
from pydantic import field_validator
from typing import List, Optional, Union
from functools import lru_cache
import os


class Settings(BaseSettings):
    """Application settings"""
    
    # Project Info
    PROJECT_NAME: str = "WorkLess AI API"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/v1"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # Server
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "change-this-secret-key-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # CORS
    # Read from environment variable (comma-separated string) or use defaults
    # Pydantic Settings will automatically read from CORS_ORIGINS env var
    CORS_ORIGINS: Union[List[str], str] = "http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173"
    
    @field_validator('CORS_ORIGINS', mode='before')
    @classmethod
    def parse_cors_origins(cls, v):
        """Parse CORS_ORIGINS from environment variable (comma-separated string)"""
        if isinstance(v, str):
            # Split by comma and strip whitespace
            origins = [origin.strip() for origin in v.split(",") if origin.strip()]
            return origins if origins else [
                "http://localhost:3000",
                "http://localhost:5173",
                "http://127.0.0.1:3000",
                "http://127.0.0.1:5173",
            ]
        # If already a list, return as-is
        return v if v else [
            "http://localhost:3000",
            "http://localhost:5173",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:5173",
        ]
    
    # Allowed Hosts (for production)
    ALLOWED_HOSTS: List[str] = ["*"]  # Configure appropriately for production
    
    # Rate Limiting
    RATE_LIMIT_CALLS: int = 100  # Number of requests
    RATE_LIMIT_PERIOD: int = 60  # Per 60 seconds
    
    # JWT Settings
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", SECRET_KEY)
    JWT_ALGORITHM: str = ALGORITHM
    
    # Supabase Configuration
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
    SUPABASE_SERVICE_ROLE_KEY: Optional[str] = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    
    # Gemini 1.5 Pro Configuration
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = "gemini-1.5-pro"
    
    # File Upload Settings
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_FILE_TYPES: List[str] = ["image/jpeg", "image/png", "application/pdf"]
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "./uploads")
    
    # Logging
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    
    # Database (if using additional database beyond Supabase)
    DATABASE_URL: Optional[str] = os.getenv("DATABASE_URL")
    
    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()


settings = get_settings()
