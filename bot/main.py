"""
LifeOS Telegram Bot
AI-Powered Personal Assistant for Life Tracking
"""
import os
import asyncio
import logging
from datetime import datetime
from typing import Optional

from aiogram import Bot, Dispatcher, Router, F
from aiogram.filters import Command
from aiogram.types import Message, ReplyKeyboardMarkup, KeyboardButton, InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.fsm.storage.memory import MemoryStorage

# Database
from database import Database

# AI
from ai_core import AICore
import os

# Manual .env.local loader
try:
    with open("../.env.local", "r") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#"):
                key, val = line.split("=", 1)
                os.environ[key] = val
except Exception:
    pass

# Config
BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize
bot = Bot(token=BOT_TOKEN)
storage = MemoryStorage()
dp = Dispatcher(storage=storage)
router = Router()

# Database instance
db = Database()

# AI instance
ai = AICore()


# ==================== KEYBOARDS ====================

def get_main_keyboard() -> ReplyKeyboardMarkup:
    """Main menu keyboard"""
    return ReplyKeyboardMarkup(
        keyboard=[
            [KeyboardButton(text="📊 Статус"), KeyboardButton(text="📈 Статистика")],
            [KeyboardButton(text="💪 Тренировка"), KeyboardButton(text="🥗 Питание")],
            [KeyboardButton(text="💤 Сон"), KeyboardButton(text="🧠 Ментальное")],
            [KeyboardButton(text="🤖 AI Коуч"), KeyboardButton(text="⚙️ Настройки")]
        ],
        resize_keyboard=True,
        one_time_keyboard=False
    )


def get_onboarding_keyboard() -> ReplyKeyboardMarkup:
    """Onboarding keyboard"""
    return ReplyKeyboardMarkup(
        keyboard=[
            [KeyboardButton(text="🚀 Начать онбординг")],
            [KeyboardButton(text="❓ Помощь")]
        ],
        resize_keyboard=True
    )


def get_cancel_keyboard() -> ReplyKeyboardMarkup:
    """Cancel keyboard"""
    return ReplyKeyboardMarkup(
        keyboard=[
            [KeyboardButton(text="❌ Отмена")]
        ],
        resize_keyboard=True,
        one_time_keyboard=True
    )


# ==================== HANDLERS ====================

@router.message(Command("start"))
async def cmd_start(message: Message, state: FSMContext):
    """Handle /start command"""
    user = message.from_user
    
    # Check if user exists
    user_data = await db.get_user(user.id)
    
    if user_data:
        if user_data.get('onboarding_completed'):
            await message.answer(
                f"👋 Привет, {user.first_name}!\n\n"
                "Ты уже прошёл онбординг. Хочешь пройти заново?",
                reply_markup=ReplyKeyboardMarkup(
                    keyboard=[
                        [KeyboardButton(text="🔄 Пройти заново")],
                        [KeyboardButton(text="✅ Продолжить")]
                    ],
                    resize_keyboard=True
                )
            )
        else:
            await message.answer(
                f"👋 Привет, {user.first_name}!\n\n"
                "У тебя есть несохранённый профиль. Начнём онбординг?",
                reply_markup=get_onboarding_keyboard()
            )
    else:
        # Create new user
        await db.create_user(
            telegram_id=user.id,
            username=user.username,
            name=user.first_name
        )
        
        await message.answer(
            f"🎉 <b>Добро пожаловать в LifeOS!</b>\n\n"
            f"Я твой персональный AI-ассистент для трекинга и развития.\n\n"
            f"После короткого онбординга я построю персональный план развития.\n\n"
            f"<i>Готов начать?</i>",
            reply_markup=get_onboarding_keyboard()
        )


@router.message(Command("help"))
async def cmd_help(message: Message):
    """Handle /help command"""
    help_text = """
<b>LifeOS - Команды</b>

<b>Основные:</b>
/start - Начать
/status - Статус дня
/stats - Статистика
/coach - AI Коуч
/settings - Настройки

<b>Трекинг:</b>
/sleep 💤 - Сон
/workout 🏋️ - Тренировка  
/eat 🥗 - Питание
/focus ⚡ - Продуктивность
/habits 🔄 - Привычки

<b>Mini App:</b>
/app - Открыть приложение
/menu - Главное меню
"""
    await message.answer(help_text, parse_mode="HTML")


@router.message(Command("status"))
async def cmd_status(message: Message):
    """Show today's status"""
    user_id = message.from_user.id
    
    today_status = await db.get_daily_status(user_id)
    
    if today_status:
        await message.answer(
            f"📊 <b>Статус за сегодня</b>\n\n"
            f"💤 Сон: {today_status.get('sleep_score', '-')}/10\n"
            f"🏋️ Тренировка: {today_status.get('workout_score', '-')}/10\n"
            f"🥗 Питание: {today_status.get('nutrition_score', '-')}/10\n"
            f"📚 Саморазвитие: {today_status.get('development_score', '-')}/10\n"
            f"⚡ Продуктивность: {today_status.get('productivity_score', '-')}/10\n"
            f"🧠 Ментальное: {today_status.get('mental_score', '-')}/10\n\n"
            f"📈 Общий: <b>{today_status.get('overall_score', '-')}/10</b>",
            parse_mode="HTML",
            reply_markup=get_main_keyboard()
        )
    else:
        await message.answer(
            "📊 Пока нет данных за сегодня.\n\n"
            "Начни трекинг!",
            reply_markup=get_main_keyboard()
        )


@router.message(Command("coach"))
async def cmd_coach(message: Message):
    """AI Coach chat"""
    user_id = message.from_user.id
    
    await message.answer(
        "🤖 <b>AI Коуч</b>\n\n"
        "Расскажи, как дела? Или задай вопрос о жизни, тренировках, питании...\n\n"
        "<i>Напиши мне что угодно!</i>",
        parse_mode="HTML"
    )


@router.message(Command("menu"))
async def cmd_menu(message: Message):
    """Main menu"""
    await message.answer(
        "📋 <b>Главное меню</b>",
        parse_mode="HTML",
        reply_markup=get_main_keyboard()
    )


@router.message(Command("app"))
async def cmd_app(message: Message):
    """Open Mini App"""
    await message.answer(
        "📱 <b>LifeOS Mini App</b>\n\n"
        "Открой приложение для детального трекинга:",
        parse_mode="HTML",
        reply_markup=InlineKeyboardMarkup(
            inline_keyboard=[
                [InlineKeyboardButton(
                    text="🚀 Открыть LifeOS",
                    web_app=WebAppInfo(url="https://lifeos-khaki-one.vercel.app/dash")
                )]
            ]
        )
    )


# ==================== SLEEP HANDLERS ====================

@router.message(Command("sleep"))
async def cmd_sleep(message: Message):
    """Track sleep"""
    user_id = message.from_user.id
    
    await message.answer(
        "💤 <b>Трекинг сна</b>\n\n"
        "Во сколько лег спать? (формат: 23:30)",
        parse_mode="HTML",
        reply_markup=get_cancel_keyboard()
    )


# ==================== WORKOUT HANDLERS ====================

@router.message(Command("workout"))
async def cmd_workout(message: Message):
    """Track workout"""
    user_id = message.from_user.id
    
    await message.answer(
        "🏋️ <b>Трекинг тренировки</b>\n\n"
        "Выбери тип тренировки:",
        parse_mode="HTML",
        reply_markup=ReplyKeyboardMarkup(
            keyboard=[
                [KeyboardButton(text="🏃 Бег"), KeyboardButton(text="🏋️ Зал")],
                [KeyboardButton(text="🧘 Йога"), KeyboardButton(text="🚴 Велосипед")],
                [KeyboardButton(text="🏊 Плавание"), KeyboardButton(text="Другое")],
                [KeyboardButton(text="❌ Отмена")]
            ],
            resize_keyboard=True
        )
    )


# ==================== EAT HANDLERS ====================

@router.message(Command("eat"))
async def cmd_eat(message: Message):
    """Track nutrition"""
    user_id = message.from_user.id
    
    await message.answer(
        "🥗 <b>Трекинг питания</b>\n\n"
        "Что кушал?",
        parse_mode="HTML",
        reply_markup=ReplyKeyboardMarkup(
            keyboard=[
                [KeyboardButton(text="🌅 Завтрак"), KeyboardButton(text="☀️ Обед")],
                [KeyboardButton(text="🌆 Ужин"), KeyboardButton(text="🍿 Перекус")],
                [KeyboardButton(text="💧 Вода"), KeyboardButton(text="❌ Отмена")]
            ],
            resize_keyboard=True
        )
    )


# ==================== DEFAULT HANDLERS ====================

@router.message(F.text == "🤖 AI Коуч")
async def ai_coach_button(message: Message):
    """AI Coach button handler"""
    await cmd_coach(message)


@router.message(F.text == "📊 Статус")
async def status_button(message: Message):
    """Status button handler"""
    await cmd_status(message)


@router.message(F.text == "📈 Статистика")
async def stats_button(message: Message):
    """Stats button handler"""
    user_id = message.from_user.id
    
    stats = await db.get_weekly_stats(user_id)
    
    await message.answer(
        f"📈 <b>Статистика за неделю</b>\n\n"
        f"Тренировок: {stats.get('workouts', 0)}\n"
        f"Воды: {stats.get('water', 0)}л\n"
        f"Чтение: {stats.get('pages', 0)}стр\n"
        f"Фокус: {stats.get('focus', 0)}ч\n\n"
        f"Лучший день: {stats.get('best_day', '-')}",
        parse_mode="HTML",
        reply_markup=get_main_keyboard()
    )


@router.message(F.text == "📊 Статус")
async def main_menu_button(message: Message):
    """Main menu button"""
    await cmd_menu(message)


@router.message()
async def handle_ai_message(message: Message):
    """Handle AI chat messages"""
    user_id = message.from_user.id
    user_text = message.text
    
    # Get user data
    user_data = await db.get_user(user_id)
    
    if not user_data:
        await message.answer(
            "Начни с /start",
            reply_markup=get_onboarding_keyboard()
        )
        return
    
    # Get AI response
    response = await ai.chat(user_id, user_text, user_data)
    
    # Save conversation
    await db.save_ai_message(user_id, "user", user_text)
    await db.save_ai_message(user_id, "assistant", response)
    
    await message.answer(response)


# ==================== ERROR HANDLERS ====================

@router.message(Command("cancel"))
@router.message(F.text == "❌ Отмена")
async def cmd_cancel(message: Message, state: FSMContext):
    """Cancel current action"""
    await state.clear()
    await message.answer(
        "❌ Отменено",
        reply_markup=get_main_keyboard()
    )


# ==================== MAIN ====================

async def on_startup():
    """Startup handler"""
    logger.info("LifeOS Bot starting...")
    await db.init()
    logger.info("Database connected")
    logger.info("Bot ready!")


async def on_shutdown():
    """Shutdown handler"""
    logger.info("LifeOS Bot shutting down...")
    await db.close()
    await bot.session.close()


def main():
    """Main entry point"""
    dp.include_router(router)
    dp.startup.register(on_startup)
    dp.shutdown.register(on_shutdown)
    
    dp.run_polling(bot)


if __name__ == "__main__":
    main()