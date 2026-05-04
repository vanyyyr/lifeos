"""
LifeOS Database Module
Supabase/PostgreSQL connection
"""
import os
import asyncpg
from typing import Optional, Dict, Any, List
from datetime import datetime, date


class Database:
    """Database handler for Supabase/PostgreSQL"""
    
    def __init__(self):
        self.conn: Optional[asyncpg.Pool] = None
        self.supabase_url = os.getenv("SUPABASE_URL", "")
        self.supabase_key = os.getenv("SUPABASE_ANON_KEY", "")
    
    async def init(self):
        """Initialize database connection"""
        if not self.supabase_url:
            # Use environment variable or default
            db_url = os.getenv("DATABASE_URL")
            if db_url:
                self.conn = await asyncpg.create_pool(dsn=db_url, min_size=1, max_size=10)
    
    async def close(self):
        """Close connection"""
        if self.conn:
            await self.conn.close()
    
    # ==================== USERS ====================
    
    async def create_user(self, telegram_id: int, username: str = None, name: str = None) -> Dict:
        """Create new user"""
        if not self.conn:
            return {"id": None, "telegram_id": telegram_id}
        
        query = """
        INSERT INTO users (telegram_id, username, name)
        VALUES ($1, $2, $3)
        ON CONFLICT (telegram_id) DO UPDATE
        SET username = EXCLUDED.username, name = EXCLUDED.name
        RETURNING *
        """
        return await self.conn.fetchrow(query, telegram_id, username, name)
    
    async def get_user(self, telegram_id: int) -> Optional[Dict]:
        """Get user by telegram ID"""
        if not self.conn:
            return None
        
        query = "SELECT * FROM users WHERE telegram_id = $1"
        return await self.conn.fetchrow(query, telegram_id)
    
    async def update_user(self, telegram_id: int, **kwargs) -> Dict:
        """Update user"""
        if not self.conn:
            return None
        
        set_clause = ", ".join([f"{k} = ${i+2}" for i, k in enumerate(kwargs.keys())])
        query = f"""
        UPDATE users SET {set_clause}, updated_at = NOW()
        WHERE telegram_id = $1
        RETURNING *
        """
        return await self.conn.fetchrow(query, telegram_id, *kwargs.values())
    
    # ==================== USER PROFILES ====================
    
    async def create_profile(self, user_id: str, **kwargs) -> Dict:
        """Create user profile"""
        if not self.conn:
            return None
        
        query = """
        INSERT INTO user_profiles (user_id, {fields})
        VALUES ($1, {values})
        ON CONFLICT (user_id) DO UPDATE SET {update}
        RETURNING *
        """.format(
            fields=", ".join(kwargs.keys()),
            values=", ".join([f"${i+2}" for i in range(len(kwargs))]),
            update=", ".join([f"{k} = EXCLUDED.{k}" for k in kwargs.keys()])
        )
        return await self.conn.fetchrow(query, user_id, *kwargs.values())
    
    async def get_profile(self, user_id: str) -> Optional[Dict]:
        """Get user profile"""
        if not self.conn:
            return None
        
        query = "SELECT * FROM user_profiles WHERE user_id = $1"
        return await self.conn.fetchrow(query, user_id)
    
    # ==================== SLEEP ====================
    
    async def log_sleep(self, user_id: str, sleep_time: datetime, wake_time: datetime = None, quality: int = None) -> Dict:
        """Log sleep"""
        if not self.conn:
            return None
        
        query = """
        INSERT INTO sleep_logs (user_id, sleep_time, wake_time, quality)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        """
        return await self.conn.fetchrow(query, user_id, sleep_time, wake_time, quality)
    
    async def get_sleep_logs(self, user_id: str, days: int = 7) -> List[Dict]:
        """Get sleep logs"""
        if not self.conn:
            return []
        
        query = """
        SELECT * FROM sleep_logs 
        WHERE user_id = $1 
        ORDER BY date DESC 
        LIMIT $2
        """
        return await self.conn.fetch(query, user_id, days)
    
    # ==================== WORKOUT ====================
    
    async def log_workout(self, user_id: str, workout_type: str, duration: int = None, 
                       intensity: int = None, feeling: str = None) -> Dict:
        """Log workout"""
        if not self.conn:
            return None
        
        query = """
        INSERT INTO workout_logs (user_id, workout_type, duration_minutes, intensity, feeling)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        """
        return await self.conn.fetchrow(query, user_id, workout_type, duration, intensity, feeling)
    
    async def get_workout_logs(self, user_id: str, days: int = 7) -> List[Dict]:
        """Get workout logs"""
        if not self.conn:
            return []
        
        query = """
        SELECT * FROM workout_logs 
        WHERE user_id = $1 
        ORDER BY date DESC 
        LIMIT $2
        """
        return await self.conn.fetch(query, user_id, days)
    
    # ==================== NUTRITION ====================
    
    async def log_meal(self, user_id: str, meal_type: str, calories: int = None,
                      water: float = None, coffee: bool = False) -> Dict:
        """Log meal"""
        if not self.conn:
            return None
        
        query = """
        INSERT INTO nutrition_logs (user_id, meal_type, calories, water, coffee)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        """
        return await self.conn.fetchrow(query, user_id, meal_type, calories, water, coffee)
    
    async def get_nutrition_logs(self, user_id: str, days: int = 7) -> List[Dict]:
        """Get nutrition logs"""
        if not self.conn:
            return []
        
        query = """
        SELECT * FROM nutrition_logs 
        WHERE user_id = $1 
        ORDER BY date DESC 
        LIMIT $2
        """
        return await self.conn.fetch(query, user_id, days)
    
    # ==================== DAILY STATUS ====================
    
    async def get_daily_status(self, user_id: str) -> Optional[Dict]:
        """Get today's status"""
        if not self.conn:
            return None
        
        query = """
        SELECT * FROM daily_status 
        WHERE user_id = $1 AND date = CURRENT_DATE
        """
        return await self.conn.fetchrow(query, user_id)
    
    async def update_daily_status(self, user_id: str, **kwargs) -> Dict:
        """Update daily status"""
        if not self.conn:
            return None
        
        kwargs['updated_at'] = datetime.now()
        
        set_clause = ", ".join([f"{k} = ${i+2}" for i, k in enumerate(kwargs.keys())])
        query = f"""
        INSERT INTO daily_status (user_id, date, {set_clause})
        VALUES ($1, CURRENT_DATE, {set_clause})
        ON CONFLICT (user_id, date) DO UPDATE SET {set_clause}
        RETURNING *
        """
        return await self.conn.fetchrow(query, user_id, *kwargs.values())
    
    # ==================== STATISTICS ====================
    
    async def get_weekly_stats(self, user_id: str) -> Dict:
        """Get weekly stats"""
        if not self.conn:
            return {
                "workouts": 0,
                "water": 0,
                "pages": 0,
                "focus": 0,
                "best_day": "-"
            }
        
        # Workouts
        w_query = "SELECT COUNT(*) as count FROM workout_logs WHERE user_id = $1 AND date >= CURRENT_DATE - 7"
        workouts = await self.conn.fetchval(w_query, user_id)
        
        # Water
        n_query = "SELECT COALESCE(SUM(water), 0) as total FROM nutrition_logs WHERE user_id = $1 AND date >= CURRENT_DATE - 7"
        water = await self.conn.fetchval(n_query, user_id)
        
        # Development (pages)
        d_query = "SELECT COALESCE(SUM(pages_read), 0) as total FROM development_logs WHERE user_id = $1 AND date >= CURRENT_DATE - 7"
        pages = await self.conn.fetchval(d_query, user_id)
        
        # Focus
        p_query = "SELECT COALESCE(SUM(focus_minutes), 0) as total FROM productivity_logs WHERE user_id = $1 AND date >= CURRENT_DATE - 7"
        focus = await self.conn.fetchval(p_query, user_id)
        
        return {
            "workouts": workouts,
            "water": water,
            "pages": pages,
            "focus": round(focus / 60, 1),  # Convert to hours
            "best_day": "-"  # TODO: Calculate best day
        }
    
    # ==================== AI CONVERSATIONS ====================
    
    async def save_ai_message(self, user_id: str, role: str, content: str) -> Dict:
        """Save AI message"""
        if not self.conn:
            return None
        
        query = """
        INSERT INTO ai_conversations (user_id, role, content)
        VALUES ($1, $2, $3)
        RETURNING *
        """
        return await self.conn.fetchrow(query, user_id, role, content)
    
    async def get_ai_history(self, user_id: str, limit: int = 10) -> List[Dict]:
        """Get AI conversation history"""
        if not self.conn:
            return []
        
        query = """
        SELECT * FROM ai_conversations 
        WHERE user_id = $1 
        ORDER BY created_at DESC 
        LIMIT $2
        """
        return await self.conn.fetch(query, user_id, limit)
    
    # ==================== HABITS ====================
    
    async def create_habit(self, user_id: str, name: str, category: str = None) -> Dict:
        """Create habit"""
        if not self.conn:
            return None
        
        query = """
        INSERT INTO habits (user_id, name, category)
        VALUES ($1, $2, $3)
        RETURNING *
        """
        return await self.conn.fetchrow(query, user_id, name, category)
    
    async def log_habit(self, habit_id: str, user_id: str, completed: bool = True) -> Dict:
        """Log habit completion"""
        if not self.conn:
            return None
        
        query = """
        INSERT INTO habit_logs (habit_id, user_id, completed)
        VALUES ($1, $2, $3)
        RETURNING *
        """
        return await self.conn.fetchrow(query, habit_id, user_id, completed)
    
    async def get_habits(self, user_id: str) -> List[Dict]:
        """Get user habits"""
        if not self.conn:
            return []
        
        query = "SELECT * FROM habits WHERE user_id = $1 AND is_active = TRUE"
        return await self.conn.fetch(query, user_id)