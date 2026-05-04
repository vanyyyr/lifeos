"""
LifeOS Database for Vercel - Uses Supabase REST API
"""
import os
import requests
from typing import Optional, Dict, Any, List

class Database:
    """Database handler using Supabase REST API"""
    
    def __init__(self):
        self.url = os.getenv("SUPABASE_URL", "")
        self.key = os.getenv("SUPABASE_ANON_KEY", "")
        self.headers = {
            "apikey": self.key,
            "Authorization": f"Bearer {self.key}",
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        }
    
    def _request(self, method: str, table: str, data: Dict = None, filters: str = "") -> List[Dict]:
        """Make request to Supabase"""
        url = f"{self.url}/rest/v1/{table}"
        if filters:
            url += f"?{filters}"
        
        resp = requests.request(method, url, json=data, headers=self.headers)
        
        if resp.status_code >= 400:
            print(f"DB Error: {resp.status_code} - {resp.text}")
            return []
        
        if method == "GET":
            return resp.json() if resp.text else []
        return [resp.json()] if resp.text else []
    
    # ==================== USERS ====================
    
    def create_user(self, telegram_id: int, username: str = None, name: str = None) -> Dict:
        """Create or update user"""
        data = {"telegram_id": telegram_id, "name": name or str(telegram_id)}
        if username:
            data["username"] = username
        
        result = self._request("POST", "users", data)
        return result[0] if result else {"telegram_id": telegram_id}
    
    def get_user(self, telegram_id: int) -> Optional[Dict]:
        """Get user by telegram ID"""
        result = self._request("GET", "users", filters=f"telegram_id=eq.{telegram_id}&limit=1")
        return result[0] if result else None
    
    # ==================== PROFILES ====================
    
    def create_profile(self, user_id: str, **kwargs) -> Dict:
        """Create or update profile"""
        kwargs["user_id"] = user_id
        result = self._request("POST", "user_profiles", kwargs)
        return result[0] if result else {}
    
    def get_profile(self, user_id: str) -> Optional[Dict]:
        """Get user profile"""
        result = self._request("GET", "user_profiles", filters=f"user_id=eq.{user_id}&limit=1")
        return result[0] if result else None
    
    # ==================== DAILY STATUS ====================
    
    def get_daily_status(self, user_id: str) -> Optional[Dict]:
        """Get today's status"""
        from datetime import date
        today = date.today().isoformat()
        result = self._request("GET", "daily_status", filters=f"user_id=eq.{user_id}&date=eq.{today}&limit=1")
        return result[0] if result else None
    
    def update_daily_status(self, user_id: str, **kwargs) -> Dict:
        """Update daily status"""
        from datetime import date
        today = date.today().isoformat()
        kwargs["date"] = today
        kwargs["user_id"] = user_id
        
        # Upsert via POST (will need RLS policy)
        result = self._request("POST", "daily_status", kwargs)
        return result[0] if result else {}
    
    # ==================== STATS ====================
    
    def get_weekly_stats(self, user_id: str) -> Dict:
        """Get weekly stats"""
        # Get workouts
        workouts = self._request("GET", "workout_logs", 
            filters=f"user_id=eq.{user_id}&order=created_at.desc&limit=30")
        
        # Get nutrition
        nutrition = self._request("GET", "nutrition_logs",
            filters=f"user_id=eq.{user_id}&order=created_at.desc&limit=30")
        
        water = sum(n.get("water", 0) for n in nutrition)
        
        return {
            "workouts": len(workouts),
            "water": water,
            "pages": 0,
            "focus": 0,
            "best_day": "-"
        }
    
    # ==================== AI ====================
    
    def save_ai_message(self, user_id: str, role: str, content: str) -> Dict:
        """Save AI message"""
        data = {"user_id": user_id, "role": role, "content": content}
        result = self._request("POST", "ai_conversations", data)
        return result[0] if result else {}

# Initialize database
db = Database()