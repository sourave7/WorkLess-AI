"""
Rate Limiting Middleware
Token bucket algorithm for rate limiting
"""

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse
from collections import defaultdict
from datetime import datetime, timedelta
import logging
from typing import Dict, Tuple

logger = logging.getLogger(__name__)


class RateLimitMiddleware(BaseHTTPMiddleware):
    """Rate limiting middleware using token bucket algorithm"""
    
    def __init__(self, app, calls: int = 100, period: int = 60):
        super().__init__(app)
        self.calls = calls
        self.period = period
        # Store: {client_id: (tokens, last_refill)}
        self.buckets: Dict[str, Tuple[int, datetime]] = defaultdict(
            lambda: (calls, datetime.utcnow())
        )
    
    def _get_client_id(self, request: Request) -> str:
        """Get client identifier for rate limiting"""
        # Try to get user ID from JWT token first
        user_id = getattr(request.state, "user_id", None)
        if user_id:
            return f"user:{user_id}"
        
        # Fallback to IP address
        client_ip = request.client.host if request.client else "unknown"
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            client_ip = forwarded_for.split(",")[0].strip()
        
        return f"ip:{client_ip}"
    
    def _refill_tokens(self, client_id: str) -> int:
        """Refill tokens based on time elapsed"""
        tokens, last_refill = self.buckets[client_id]
        now = datetime.utcnow()
        
        # Calculate tokens to add
        time_passed = (now - last_refill).total_seconds()
        tokens_to_add = int((time_passed / self.period) * self.calls)
        
        if tokens_to_add > 0:
            # Refill tokens
            new_tokens = min(self.calls, tokens + tokens_to_add)
            self.buckets[client_id] = (new_tokens, now)
            return new_tokens
        
        return tokens
    
    async def dispatch(self, request: Request, call_next):
        # Skip rate limiting for health checks
        if request.url.path in ["/health", "/docs", "/redoc", "/openapi.json"]:
            return await call_next(request)
        
        client_id = self._get_client_id(request)
        tokens = self._refill_tokens(client_id)
        
        if tokens <= 0:
            logger.warning(f"Rate limit exceeded for {client_id}")
            return JSONResponse(
                status_code=429,
                content={
                    "error": "Rate limit exceeded",
                    "message": f"Too many requests. Limit: {self.calls} per {self.period} seconds",
                    "retry_after": self.period
                },
                headers={
                    "X-RateLimit-Limit": str(self.calls),
                    "X-RateLimit-Remaining": "0",
                    "Retry-After": str(self.period)
                }
            )
        
        # Consume token
        tokens -= 1
        _, last_refill = self.buckets[client_id]
        self.buckets[client_id] = (tokens, last_refill)
        
        # Add rate limit headers
        response = await call_next(request)
        response.headers["X-RateLimit-Limit"] = str(self.calls)
        response.headers["X-RateLimit-Remaining"] = str(max(0, tokens))
        
        return response
