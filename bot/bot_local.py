"""
LifeOS Telegram Bot - Simple Local Version
Run locally: python bot_local.py
"""
import os
import asyncio
from telegram import Bot, Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes
from database_simple import Database

# Config from environment
BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")
APP_URL = os.getenv("NEXT_PUBLIC_APP_URL", "https://lifeos-khaki-one.vercel.app")

# Database
db = Database()

async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /start"""
    user = update.message.from_user
    name = user.first_name
    
    # Create or get user
    db.create_user(user.id, user.username, name)
    
    await update.message.reply_text(
        f"🎉 <b>Добро пожаловать в LifeOS!</b>\n\n"
        f"Привет, {name}!\n\n"
        f"Я твой персональный AI-ассистент для трекинга и развития.\n\n"
        f"После онбординга я построю персональный план.\n\n"
        f"<i>Готов начать?</i>\n\n"
        f"<a href=\"{APP_URL}/onb\">🚀 Пройти онбординг</a>",
        parse_mode="HTML",
        disable_web_page_preview=True
    )

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /help"""
    await update.message.reply_text(
        """<b>LifeOS - Команды</b>

<b>Основные:</b>
/start - Начать
/menu - Главное меню
/status - Статус дня
/stats - Статистика
/coach - AI Коуч

<b>Трекинг:</b>
/sleep 💤 - Сон
/workout 🏋️ - Тренировка  
/eat 🥗 - Питание
/focus ⚡ - Продуктивность
/habits 🔄 - Привычки

<b>Mini App:</b>
/app - Открыть приложение""",
        parse_mode="HTML"
    )

async def menu_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /menu"""
    from telegram import KeyboardButton, ReplyKeyboardMarkup
    
    buttons = [
        [KeyboardButton("📊 Статус"), KeyboardButton("📈 Статистика")],
        [KeyboardButton("💪 Тренировка"), KeyboardButton("🥗 Питание")],
        [KeyboardButton("💤 Сон"), KeyboardButton("🧠 Ментальное")],
        [KeyboardButton("🤖 AI Коуч")],
    ]
    
    await update.message.reply_text(
        "📋 <b>Главное меню</b>",
        parse_mode="HTML",
        reply_markup=ReplyKeyboardMarkup(buttons, resize_keyboard=True)
    )

async def status_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /status"""
    user_id = str(update.message.from_user.id)
    status = db.get_daily_status(user_id)
    
    if status:
        await update.message.reply_text(
            f"📊 <b>Статус за сегодня</b>\n\n"
            f"💤 Сон: {status.get('sleep_score', '-')}/10\n"
            f"🏋️ Тренировка: {status.get('workout_score', '-')}/10\n"
            f"🥗 Питание: {status.get('nutrition_score', '-')}/10\n\n"
            f"📈 Общий: <b>{status.get('overall_score', '-')}/10</b>",
            parse_mode="HTML"
        )
    else:
        await update.message.reply_text(
            "📊 Пока нет данных за сегодня.\n\n"
            "<a href=\"{}/app\">Открой Mini App</a> для трекинга!".format(APP_URL),
            parse_mode="HTML",
            disable_web_page_preview=True
        )

async def stats_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /stats"""
    user_id = str(update.message.from_user.id)
    stats = db.get_weekly_stats(user_id)
    
    await update.message.reply_text(
        f"📈 <b>Статистика за неделю</b>\n\n"
        f"🏋️ Тренировок: {stats.get('workouts', 0)}\n"
        f"💧 Воды: {stats.get('water', 0)}л\n"
        f"📚 Страниц: {stats.get('pages', 0)}\n"
        f"⚡ Фокус: {stats.get('focus', 0)}ч\n\n"
        f"Лучший день: {stats.get('best_day', '-')}",
        parse_mode="HTML"
    )

async def coach_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /coach"""
    await update.message.reply_text(
        "🤖 <b>AI Коуч</b>\n\n"
        "Расскажи, как дела? Или задай вопрос.\n\n"
        "<i>AI временно недоступен - идёт настройка</i>",
        parse_mode="HTML"
    )

async def app_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /app"""
    from telegram import InlineKeyboardButton, InlineKeyboardMarkup
    
    await update.message.reply_text(
        "📱 <b>LifeOS Mini App</b>\n\n"
        "Открой для детального трекинга:",
        parse_mode="HTML",
        reply_markup=InlineKeyboardMarkup([
            [InlineKeyboardButton("🚀 Открыть LifeOS", url=f"{APP_URL}/onb")]
        ])
    )

async def echo(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle other messages"""
    user = update.message.from_user
    text = update.message.text
    
    # Simple echo for now
    await update.message.reply_text(
        f"Привет, {user.first_name}! 👋\n\n"
        f"Я получил: {text}\n\n"
        "Напиши /help для списка команд."
    )

def main():
    """Run the bot"""
    print("🚀 Starting LifeOS Bot...")
    
    app = Application.builder().token(BOT_TOKEN).build()
    
    # Commands
    app.add_handler(CommandHandler("start", start_command))
    app.add_handler(CommandHandler("help", help_command))
    app.add_handler(CommandHandler("menu", menu_command))
    app.add_handler(CommandHandler("status", status_command))
    app.add_handler(CommandHandler("stats", stats_command))
    app.add_handler(CommandHandler("coach", coach_command))
    app.add_handler(CommandHandler("app", app_command))
    
    # Messages
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, echo))
    
    print("Bot is running! Press Ctrl+C to stop")
    app.run_polling(drop_pending_updates=True)

if __name__ == "__main__":
    main()