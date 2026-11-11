#!/usr/bin/env python3
import asyncio
import logging
from telegram import Update, InlineQueryResultArticle, InputTextMessageContent
from telegram.ext import Application, CommandHandler, InlineQueryHandler, ContextTypes

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

TOKEN = "9081439763:AAG93jVafchSSX-ttEa_EtGck58S1UWWzL4"
WEBAPP_URL = "http://localhost:8080/webapp.html"

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyboard = [[{"text": "🎮 Играть", "web_app": {"url": WEBAPP_URL}}]]
    await update.message.reply_text(
        "🚢 Добро пожаловать в Морской Бой!\n\nНажмите кнопку, чтобы начать игру:",
        reply_markup={"inline_keyboard": keyboard}
    )
    logger.info(f"Команда /start от пользователя {update.effective_user.id}")

async def inline_query(update: Update, context: ContextTypes.DEFAULT_TYPE):
    results = [
        InlineQueryResultArticle(
            id='game',
            title='🚢 Морской Бой',
            description='Классическая игра',
            input_message_content=InputTextMessageContent('🎮 Играю в Морской Бой!'),
            reply_markup={"inline_keyboard": [[{"text": "🎮 Играть", "web_app": {"url": WEBAPP_URL}}]]},
            thumbnail_url='https://telegram.org/img/t_logo.png'
        )
    ]
    await update.inline_query.answer(results, cache_time=1)
    logger.info(f"Inline запрос от {update.effective_user.id}")

async def main():
    logger.info("🚀 Запуск бота...")
    logger.info(f"📱 WebApp: {WEBAPP_URL}")
    
    app = Application.builder().token(TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(InlineQueryHandler(inline_query))
    
    logger.info("✅ Бот запущен!")
    logger.info("Попробуйте: /start или @battleship_yourname_bot")
    
    await app.run_polling(allowed_updates=Update.ALL_TYPES, drop_pending_updates=True)

if __name__ == '__main__':
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Бот остановлен")
