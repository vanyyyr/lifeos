"""
LifeOS Telegram Bot - Vercel Serverless Version
"""
import os
import json
from telegram import Bot, Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes

# Config
BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "8606509963:AAHQCdY4_v9RvBCUug_oiB7_lpj1cL_3EnQ")

# Initialize bot
bot = Bot(token=BOT_TOKEN)

async def handle_telegram_webhook(request):
    """Handle Telegram webhook"""
    if request.method == "POST":
        try:
            update = Update.de_json(await request.json(), bot)
            
            if update.message:
                text = update.message.text
                chat_id = update.message.chat.id
                name = update.message.chat.first_name
                
                # Process commands
                if text == "/start":
                    await bot.send_message(
                        chat_id=chat_id,
                        text=f"🎉 <b>Добро пожаловать в LifeOS!</b>\n\n"
                            f"Я твой персональный AI-ассистент.\n\n"
                            f"Начни с /help для списка команд.",
                        parse_mode="HTML"
                    )
                elif text == "/help":
                    await bot.send_message(
                        chat_id=chat_id,
                        text="""<b>Команды LifeOS:</b>

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

<b>Mini App:</b>
/app - Открыть приложение""",
                        parse_mode="HTML"
                    )
                elif text == "/menu":
                    await bot.send_message(
                        chat_id=chat_id,
                        text="""📋 <b>Главное меню</b>

Выбери категорию:"""
                    )
                elif text == "/status":
                    await bot.send_message(
                        chat_id=chat_id,
                        text="📊 Пока нет данных за сегодня.\n\nНачни трекинг в Mini App!"
                    )
                elif text == "/stats":
                    await bot.send_message(
                        chat_id=chat_id,
                        text="📈 Статистика скоро будет!\n\nЗаходи в /app"
                    )
                elif text == "/coach":
                    await bot.send_message(
                        chat_id=chat_id,
                        text="🤖 <b>AI Коуч</b>\n\n"
                            "Расскажи, как дела?\n"
                            "(AI скоро будет доступен)",
                        parse_mode="HTML"
                    )
                elif text == "/app":
                    await bot.send_message(
                        chat_id=chat_id,
                        text="📱 <b>LifeOS Mini App</b>\n\n"
                            "Открой для детального трекинга:",
                        parse_mode="HTML",
                        reply_markup={
                            "inline_keyboard": [[{"text": "🚀 Открыть LifeOS", "url": "https://lifeos-khaki-one.vercel.app/onb"}]]
                        }
                    )
                else:
                    # AI response placeholder
                    await bot.send_message(
                        chat_id=chat_id,
                        text=f"Привет, {name}! 👋\n\n"
                            "Я получил: {}\n\n"
                            "Напиши /help для списка команд.".format(text)
                    )
            
            return {"statusCode": 200, "body": json.dumps({"ok": True})}
            
        except Exception as e:
            print(f"Error: {e}")
            return {"statusCode": 200, "body": json.dumps({"error": str(e)})}
    
    return {"statusCode": 200, "body": json.dumps({"message": "LifeOS Bot"})}


# Vercel serverless handler
def handler(request):
    """Vercel serverless function"""
    return handle_telegram_webhook(request)