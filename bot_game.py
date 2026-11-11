#!/usr/bin/env python3
"""
Telegram Bot для игры Морской Бой (inline режим)
Запускает игру через Web App в любом чате
"""
import asyncio
import signal
from telegram import Update, InlineQueryResultArticle, InputTextMessageContent, WebAppInfo, InlineKeyboardMarkup, InlineKeyboardButton
from telegram.ext import Application, CommandHandler, InlineQueryHandler, ContextTypes

# Конфигурация
TOKEN = "9081439763:AAG93jVafchSSX-ttEa_EtGck58S1UWWzL4"
WEBAPP_URL = "https://prettymothafakaa-maker.github.io/battleship-miniapp/"

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Обработчик команды /start"""
    keyboard = InlineKeyboardMarkup([
        [InlineKeyboardButton("🎮 Играть в Морской Бой", web_app=WebAppInfo(url=WEBAPP_URL))]
    ])
    await update.message.reply_text(
        "🚢 *Морской Бой*\n\n"
        "Классическая игра в морской бой!\n\n"
        "Нажми кнопку ниже или набери `@battleship_yourname_bot` в любом чате, "
        "чтобы начать игру.",
        reply_markup=keyboard,
        parse_mode='Markdown'
    )

async def inline_query(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """
    Обработчик inline-запросов
    Показывает кнопку "Играть" когда пользователь набирает @bot_name в чате
    """
    results = [
        InlineQueryResultArticle(
            id='battleship_game',
            title='🚢 Морской Бой',
            description='Сыграть в морской бой',
            thumbnail_url='https://em-content.zobj.net/source/apple/391/ship_1f6a2.png',
            input_message_content=InputTextMessageContent(
                "🎮 *Морской Бой*\n\nНажми кнопку ниже, чтобы начать игру!",
                parse_mode='Markdown'
            ),
            reply_markup=InlineKeyboardMarkup([
                [InlineKeyboardButton("🎮 Играть", web_app=WebAppInfo(url=WEBAPP_URL))]
            ])
        )
    ]
    
    await update.inline_query.answer(
        results,
        cache_time=10,
        is_personal=True
    )

async def main():
    """Главная функция - запуск бота"""
    print(f"🚀 Запуск бота...")
    print(f"📱 Web App: {WEBAPP_URL}")
    
    # Создаём приложение
    app = Application.builder().token(TOKEN).build()
    
    # Регистрируем обработчики
    app.add_handler(CommandHandler("start", start))
    app.add_handler(InlineQueryHandler(inline_query))
    
    # Ручной lifecycle для background режима
    await app.initialize()
    await app.start()
    await app.updater.start_polling(allowed_updates=Update.ALL_TYPES)
    
    print("✅ Бот запущен и готов к работе!")
    print("   Попробуй набрать @battleship_yourname_bot в любом чате")
    
    # Ожидание сигнала остановки
    try:
        stop = asyncio.Event()
        loop = asyncio.get_event_loop()
        for sig in (signal.SIGINT, signal.SIGTERM):
            loop.add_signal_handler(sig, stop.set)
        await stop.wait()
    except KeyboardInterrupt:
        print("\n⏹ Остановка бота...")
    finally:
        await app.updater.stop()
        await app.stop()
        await app.shutdown()
        print("👋 Бот остановлен")

if __name__ == '__main__':
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        pass
