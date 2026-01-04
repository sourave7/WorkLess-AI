"""
Authentication Middleware
JWT token validation and user extraction
"""

from typing import Optional
from fastapi import Request, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.services.auth_service import AuthService
import logging

logger = logging.getLogger(__name__)

security = HTTPBearer(auto_error=False)


async def get_current_user(
    request: Request,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> Optional[dict]:
    """
    Extract and validate JWT token from request
    Returns user payload if token is valid, None otherwise
    """
    # If no credentials provided, return None (optional auth)
    if not credentials:
        # Try to extract from Authorization header manually
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
        else:
            return None
    else:
        token = credentials.credentials
    
    try:
        payload = AuthService.verify_token(token)
        
        # Store user info in request state
        request.state.user_id = payload.get("sub") or payload.get("user_id")
        request.state.user_email = payload.get("email")
        
        return payload
    except HTTPException:
        raise
    except Exception as e:
        logger.warning(f"Authentication error: {e}")
        return None


async def require_auth(
    current_user: dict = Depends(get_current_user)
) -> dict:
    """Dependency that requires authentication"""
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"}
        )
    return current_user
