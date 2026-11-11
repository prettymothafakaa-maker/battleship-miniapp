#!/usr/bin/env python3
"""
Telegram Mini App Bot - Морской Бой
"""
import os
import logging
from telegram import Update, WebAppInfo, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes

# Logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Configuration
TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
WEBAPP_URL = os.getenv('WEBAPP_URL', 'https://your-domain.com/battleship-miniapp/')

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Отправляет приветственное сообщение с кнопкой запуска игры"""
    keyboard = [
        [InlineKeyboardButton(
            "🚢 Играть в Морской Бой",
            web_app=WebAppInfo(url=WEBAPP_URL)
        )]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_text(
        "👋 Добро пожаловать в Морской Бой!\n\n"
        "⚓ Классическая игра прямо в Telegram\n"
        "🎯 Потопите все корабли противника\n"
        "🏆 Станьте адмиралом флота!\n\n"
        "Нажмите кнопку ниже, чтобы начать игру:",
        reply_markup=reply_markup
    )

async def play(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Запускает игру"""
    keyboard = [
        [InlineKeyboardButton(
            "🎮 Начать игру",
            web_app=WebAppInfo(url=WEBAPP_URL)
        )]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_text(
        "⚓ Готовы к битве?",
        reply_markup=reply_markup
    )

async def handle_web_app_data(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Обрабатывает данные от Web App"""
    data = update.effective_message.web_app_data.data
    
    # Парсим результат игры
    import json
    try:
        game_result = json.loads(data)
        result = game_result.get('result')
        hits = game_result.get('hits', 0)
        misses = game_result.get('misses', 0)
        
        if result == 'win':
            message = (
                f"🎉 *Победа!*\n\n"
                f"🎯 Попадания: {hits}\n"
                f"❌ Промахи: {misses}\n"
                f"📊 Точность: {hits/(hits+misses)*100:.1f}%\n\n"
                f"Отличная игра! Сыграем ещё?"
            )
        else:
            message = (
                f"💥 *Поражение*\n\n"
                f"🎯 Попадания: {hits}\n"
                f"❌ Промахи: {misses}\n\n"
                f"Не сдавайтесь! Попробуйте ещё раз!"
            )
        
        keyboard = [
            [InlineKeyboardButton(
                "🔄 Играть снова",
                web_app=WebAppInfo(url=WEBAPP_URL)
            )]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await update.message.reply_text(
            message,
            parse_mode='Markdown',
            reply_markup=reply_markup
        )
    except Exception as e:
        logger.error(f"Error parsing game result: {e}")
        await update.message.reply_text("❌ Ошибка обработки результата игры")

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Показывает помощь"""
    await update.message.reply_text(
        "📖 *Как играть:*\n\n"
        "1️⃣ Расставьте корабли на своём поле\n"
        "   • 1× Линкор (4 клетки)\n"
        "   • 2× Крейсер (3 клетки)\n"
        "   • 3× Эсминец (2 клетки)\n"
        "   • 4× Катер (1 клетка)\n\n"
        "2️⃣ Нажмите 'Начать игру'\n\n"
        "3️⃣ Стреляйте по полю противника\n"
        "   • 🎯 Попадание = стреляете ещё раз\n"
        "   • ❌ Промах = ход противника\n\n"
        "4️⃣ Потопите все корабли противника!\n\n"
        "*Команды:*\n"
        "/start - начать\n"
        "/play - запустить игру\n"
        "/help - эта справка",
        parse_mode='Markdown'
    )

async def error_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Обработчик ошибок"""
    logger.error(f"Update {update} caused error {context.error}")

def main():
    """Запуск бота"""
    if not TOKEN:
        logger.error("TELEGRAM_BOT_TOKEN not set!")
        return
    
    # Создаём приложение
    app = Application.builder().token(TOKEN).build()
    
    # Регистрируем обработчики
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("play", play))
    app.add_handler(CommandHandler("help", help_command))
    app.add_handler(MessageHandler(filters.StatusUpdate.WEB_APP_DATA, handle_web_app_data))
    
    # Обработчик ошибок
    app.add_error_handler(error_handler)
    
    # Запускаем бота
    logger.info("Starting Battleship Mini App Bot...")
    app.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == '__main__':
    main()
