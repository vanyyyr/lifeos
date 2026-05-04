"""
LifeOS AI Core Module
AI Adapter for multiple LLM providers including Xiaomi
"""
import os
import json
import asyncio
from typing import Optional, Dict, List, Any
from openai import AsyncOpenAI


# System prompt for LifeOS
LIFEOS_SYSTEM_PROMPT = """Ты - LifeOS, персональный AI-ассистент для трекинга и развития личности.

Твои основные функции:
1. Помогать пользователю отслеживать все аспекты жизни (сон, спорт, питание, саморазвитие, продуктивность, привычки)
2. Давать персонализированные рекомендации на основе данных
3. Мотивировать и поддерживать
4. Адаптировать план развития под пользователя

Стиль общения:
- Поддерживающий, но честный
- Конкретный и практичный
- Мотивирующий без давления

Ты анализируешь данные трекинга и даёшь полезные советы по улучшению качества жизни."""


class AICore:
    """AI Core - handles multiple LLM providers"""
    
    def __init__(self):
        self.xiaomi_api_key = os.getenv("XIAOMI_API_KEY", "")
        self.xiaomi_base_url = "https://api.moonshot.cn/v1"
        self.model = "moonshot-v1-8k"
        
        # Initialize Xiaomi client
        self.client = AsyncOpenAI(
            api_key=self.xiaomi_api_key,
            base_url=self.xiaomi_base_url
        )
        
        # Conversation history
        self.conversations: Dict[str, List[Dict]] = {}
    
    async def chat(
        self, 
        user_id: str, 
        user_message: str, 
        user_data: Optional[Dict] = None,
        history_limit: int = 10
    ) -> str:
        """Get AI response"""
        
        # Build messages
        messages = [{"role": "system", "content": LIFEOS_SYSTEM_PROMPT}]
        
        # Add user context if available
        if user_data:
            context = self._build_user_context(user_data)
            if context:
                messages.append({
                    "role": "system", 
                    "content": f"Данные пользователя:\n{context}"
                })
        
        # Add conversation history
        if user_id in self.conversations:
            messages.extend(self.conversations[user_id][-history_limit:])
        
        # Add current message
        messages.append({"role": "user", "content": user_message})
        
        # Get response from Xiaomi
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.7,
                max_tokens=1000
            )
            
            ai_response = response.choices[0].message.content
            
            # Save to history
            self._add_to_history(user_id, "user", user_message)
            self._add_to_history(user_id, "assistant", ai_response)
            
            return ai_response
            
        except Exception as e:
            return f"Извини, произошла ошибка: {str(e)}. Попробуй ещё раз."
    
    async def analyze_onboarding(self, answers: Dict[str, Any]) -> Dict:
        """Analyze onboarding answers and create personalized plan"""
        
        # Build analysis prompt
        prompt = self._build_analysis_prompt(answers)
        
        messages = [
            {"role": "system", "content": LIFEOS_SYSTEM_PROMPT},
            {"role": "user", "content": prompt}
        ]
        
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.7,
                max_tokens=2000
            )
            
            analysis = response.choices[0].message.content
            
            # Parse structured response
            return self._parse_analysis(analysis)
            
        except Exception as e:
            return {
                "error": str(e),
                "fallback": self._generate_fallback_plan(answers)
            }
    
    async def generate_recommendations(
        self, 
        user_id: str, 
        user_data: Dict,
        logs: Dict
    ) -> str:
        """Generate personalized recommendations based on logs"""
        
        prompt = f"""Проанализируй данные пользователя за последнюю неделю и дай рекомендации:

Дневные оценки: {logs.get('daily_scores', 'Нет данных')}
Тренировки: {logs.get('workouts', 'Нет')}
Питание: {logs.get('nutrition', 'Нет')}
Сон: {logs.get('sleep', 'Нет')}
Продуктивность: {logs.get('productivity', 'Нет')}

Дай 3 конкретные рекомендации на следующую неделю."""
        
        messages = [
            {"role": "system", "content": LIFEOS_SYSTEM_PROMPT},
            {"role": "user", "content": prompt}
        ]
        
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.7,
                max_tokens=500
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            return "Пока нет рекомендаций. Продолжай трекинг!"
    
    async def generate_motivation(self, user_name: str = None) -> str:
        """Generate motivational message"""
        
        prompt = f"""Дай короткую мотивацию для человека, который хочет развиваться.
Имя: {user_name or 'друг'}
Тон: позитивный, вдохновляющий, короткий (1-2 предложения)
Контекст: саморазвитие, трекинг жизни"""
        
        messages = [
            {"role": "system", "content": LIFEOS_SYSTEM_PROMPT},
            {"role": "user", "content": prompt}
        ]
        
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.9,
                max_tokens=100
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            return "Каждый день - это новый шанс стать лучше! 💪"
    
    # ==================== HELPERS ====================
    
    def _build_user_context(self, user_data: Dict) -> str:
        """Build user context from profile data"""
        if not user_data:
            return ""
        
        context_parts = []
        
        # Sleep
        if user_data.get('sleep_time'):
            context_parts.append(f"Сон: ложится в {user_data['sleep_time']}, спит {user_data.get('avg_sleep_hours', '?')}ч")
        
        # Sport
        if user_data.get('sport_frequency'):
            context_parts.append(f"Спорт: {user_data['sport_frequency']} раз в неделю, {user_data.get('sport_type', 'разное')}")
        
        # Nutrition
        if user_data.get('water_intake'):
            context_parts.append(f"Вода: {user_data['water_intake']}л в день")
        
        # Habits
        if user_data.get('habits'):
            context_parts.append(f"Привычки: {user_data['habits']}")
        
        # Goals
        if user_data.get('main_goal_1year'):
            context_parts.append(f"Цель на год: {user_data['main_goal_1year']}")
        
        return "\n".join(context_parts)
    
    def _build_analysis_prompt(self, answers: Dict) -> str:
        """Build analysis prompt from onboarding answers"""
        
        prompt = """Проанализируй данные пользователя и создай персональный план развития.

ДАННЫЕ ПОЛЬЗОВАТЕЛЯ:
"""
        
        for category, data in answers.items():
            prompt += f"\n{category.upper()}:\n"
            if isinstance(data, dict):
                for key, value in data.items():
                    prompt += f"  - {key}: {value}\n"
            else:
                prompt += f"  {data}\n"
        
        prompt += """

НА ВЫХОДЕ нужно:
1. Оценка текущего уровня по каждому направлению (1-10)
2. Главные проблемные зоны (топ 3)
3. Приоритеты на ближайшие 30 дней (топ 5)
4. Недельные цели
5. Рекомендуемое расписание дня
6. Ключевые привычки для выработки

Отвечай структурированно, будь конкретен."""
        
        return prompt
    
    def _parse_analysis(self, analysis: str) -> Dict:
        """Parse AI analysis into structured data"""
        
        # Simple parsing - in production would use more robust method
        result = {
            "analysis": analysis,
            "scores": [],
            "priorities": [],
            "schedule": {},
            "habits": []
        }
        
        # Try to extract key sections
        lines = analysis.split('\n')
        current_section = None
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            if 'оценк' in line.lower():
                current_section = 'scores'
            elif 'приорит' in line.lower():
                current_section = 'priorities'
            elif 'распис' in line.lower() or 'расспис' in line.lower():
                current_section = 'schedule'
            elif 'привычк' in line.lower():
                current_section = 'habits'
            elif current_section and line and (line[0].isdigit() or line[0] in '•-*'):
                if current_section == 'scores':
                    result['scores'].append(line)
                elif current_section == 'priorities':
                    result['priorities'].append(line)
                elif current_section == 'habits':
                    result['habits'].append(line)
        
        return result
    
    def _generate_fallback_plan(self, answers: Dict) -> Dict:
        """Generate fallback plan if AI fails"""
        
        return {
            "scores": {
                "sleep": 5,
                "sport": 5,
                "nutrition": 5,
                "productivity": 5,
                "development": 5
            },
            "priorities": [
                "Наладить сон",
                "Добавить физическую активность",
                "Пить больше воды",
                "Начать читать",
                "Практиковать благодарность"
            ],
            "schedule": {
                "07:00": "Подъём",
                "08:00": "Зарядка",
                "08:30": "Завтрак",
                "12:00": "Обед",
                "19:00": "Ужин",
                "21:00": "Подготовка ко сну",
                "22:00": "Дневник"
            },
            "habits": [
                "Ранний подъём",
                "Холодный душ",
                "Вода утром",
                "Чтение перед сном",
                "Благодарность"
            ]
        }
    
    def _add_to_history(self, user_id: str, role: str, content: str):
        """Add message to conversation history"""
        if user_id not in self.conversations:
            self.conversations[user_id] = []
        
        self.conversations[user_id].append({
            "role": role,
            "content": content
        })
        
        # Keep history manageable
        if len(self.conversations[user_id]) > 50:
            self.conversations[user_id] = self.conversations[user_id][-50:]
    
    def clear_history(self, user_id: str):
        """Clear conversation history"""
        if user_id in self.conversations:
            self.conversations[user_id] = []