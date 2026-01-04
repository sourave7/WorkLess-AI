"""
Supabase Service
Handles all Supabase database operations
"""

from supabase import create_client, Client
from typing import Optional, Dict, Any, List, Tuple
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


class SupabaseService:
    """Supabase database service"""
    
    def __init__(self):
        if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
            raise ValueError("Supabase URL and Key must be configured")
        
        self.client: Client = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_KEY
        )
        
        # Service role client for admin operations (if needed)
        self.service_client: Optional[Client] = None
        if settings.SUPABASE_SERVICE_ROLE_KEY:
            self.service_client = create_client(
                settings.SUPABASE_URL,
                settings.SUPABASE_SERVICE_ROLE_KEY
            )
    
    def create_scan_record(
        self,
        user_id: str,
        file_name: str,
        file_size: int,
        status: str = "pending"
    ) -> Optional[Dict[str, Any]]:
        """Create a new scan record"""
        try:
            result = self.client.table("scans").insert({
                "user_id": user_id,
                "file_name": file_name,
                "file_size": file_size,
                "status": status
            }).execute()
            
            if result.data:
                return result.data[0]
            return None
        except Exception as e:
            logger.error(f"Error creating scan record: {e}")
            return None
    
    def update_scan_status(
        self,
        scan_id: str,
        status: str,
        metadata: Optional[Dict[str, Any]] = None
    ) -> bool:
        """Update scan status and metadata"""
        try:
            update_data = {"status": status}
            if metadata:
                update_data.update(metadata)
            
            result = self.client.table("scans").update(update_data).eq(
                "id", scan_id
            ).execute()
            
            return bool(result.data)
        except Exception as e:
            logger.error(f"Error updating scan record: {e}")
            return False
    
    def get_user_metadata(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get user metadata"""
        try:
            result = self.client.table("users_metadata").select("*").eq(
                "user_id", user_id
            ).single().execute()
            
            return result.data if result.data else None
        except Exception as e:
            logger.debug(f"Error fetching user metadata: {e}")
            return None
    
    def update_user_scan_stats(
        self,
        user_id: str,
        scans_today: int,
        total_scans: int,
        last_scan_date: str
    ) -> bool:
        """Update user scan statistics"""
        try:
            result = self.client.table("users_metadata").update({
                "scans_today": scans_today,
                "total_scans": total_scans,
                "last_scan_date": last_scan_date
            }).eq("user_id", user_id).execute()
            
            return bool(result.data)
        except Exception as e:
            logger.error(f"Error updating user stats: {e}")
            return False
    
    def check_scan_limit(self, user_id: str) -> Tuple[bool, Optional[Dict[str, Any]]]:
        """Check if user has reached scan limit"""
        metadata = self.get_user_metadata(user_id)
        
        if not metadata:
            return True, None  # No metadata means no limits
        
        subscription_tier = metadata.get("subscription_tier", "basic")
        scans_today = metadata.get("scans_today", 0)
        
        # Basic tier: 3 scans per day
        if subscription_tier == "basic":
            if scans_today >= 3:
                return False, metadata
        
        # Pro tier: unlimited
        return True, metadata
