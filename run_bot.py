#!/usr/bin/env python3
import os
import asyncio
from telegram import Update, InlineQueryResultArticle, InputTextMessageContent, WebAppInfo
from telegram.ext import Application, CommandHandler, InlineQueryHandler, ContextTypes

# Configuration
TOKEN = "9081439763:AAG93jVafchSSX-ttEa_EtGck58S1UWWzL4"
WEBAPP_URL = "http://localhost:8080/webapp.html"

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Команда /start - показывает кнопку запуска игры"""
    await update.message.reply_text(
        "🚢 Добро пожаловать в Морской Бой!\n\n"
        "Нажмите кнопку ниже, чтобы начать игру:",
        reply_markup={
            "inline_keyboard": [[
                {"text": "🎮 Играть", "web_app": {"url": WEBAPP_URL}}
            ]]
        }
    )

async def inline_query(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Обработка inline запросов"""
    query = update.inline_query.query
    
    results = [
        InlineQueryResultArticle(
            id='battleship_game',
            title='🚢 Морской Бой',
            description='Нажмите, чтобы начать игру',
            input_message_content=InputTextMessageContent(
                message_text='🎮 Играю в Морской Бой!'
            ),
            reply_markup={
                "inline_keyboard": [[
                    {"text": "🎮 Играть", "web_app": {"url": WEBAPP_URL}}
                ]]
            },
            thumbnail_url='https://telegram.org/img/t_logo.png'
        )
    ]
    
    await update.inline_query.answer(results, cache_time=1)

async def main():
    """Запуск бота"""
    print(f"🤖 Запуск бота...")
    print(f"📱 WebApp URL: {WEBAPP_URL}")
    
    app = Application.builder().token(TOKEN).build()
    
    app.add_handler(CommandHandler("start", start))
    app.add_handler(InlineQueryHandler(inline_query))
    
    print("✅ Бот запущен и готов к работе!")
    print("📝 Попробуйте:")
    print("   1. Отправить боту команду /start")
    print("   2. Написать @battleship_yourname_bot в любом чате")
    
    await app.initialize()
    await app.start()
    await app.updater.start_polling(allowed_updates=Update.ALL_TYPES)
    
    try:
        import signal
        stop = asyncio.Event()
        for sig in (signal.SIGINT, signal.SIGTERM):
            asyncio.get_event_loop().add_signal_handler(sig, stop.set)
        await stop.wait()
    except KeyboardInterrupt:
        pass
    finally:
        await app.updater.stop()
        await app.stop()
        await app.shutdown()

if __name__ == '__main__':
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n🛑 Бот остановлен")
