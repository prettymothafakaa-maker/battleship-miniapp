#!/bin/bash
set -e

echo "════════════════════════════════════════════════════════════════"
echo "🚢 МОРСКОЙ БОЙ - TELEGRAM MINI APP"
echo "Быстрый запуск с Inline режимом"
echo "════════════════════════════════════════════════════════════════"
echo ""

# Проверка зависимостей
echo "📦 Проверка зависимостей..."
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 не установлен"
    exit 1
fi

# Установка python-telegram-bot
echo "📥 Установка python-telegram-bot..."
pip3 install python-telegram-bot --quiet || {
    echo "⚠️  Не удалось установить через pip3, попробуйте вручную:"
    echo "   pip3 install python-telegram-bot"
}

# Проверка .env файла
if [ ! -f ".env" ]; then
    echo ""
    echo "⚠️  Файл .env не найден!"
    echo ""
    echo "Создайте файл .env с настройками:"
    echo "  cp .env.example .env"
    echo "  nano .env"
    echo ""
    echo "Необходимо указать:"
    echo "  1. TELEGRAM_BOT_TOKEN - токен от @BotFather"
    echo "  2. WEBAPP_URL - публичный URL webapp.html"
    echo ""
    read -p "Создать .env сейчас? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cp .env.example .env
        echo "✅ Создан .env файл"
        echo "📝 Отредактируйте его: nano .env"
        exit 0
    else
        exit 1
    fi
fi

# Загрузка .env
source .env

# Проверка токена
if [ -z "$TELEGRAM_BOT_TOKEN" ] || [ "$TELEGRAM_BOT_TOKEN" = "your_bot_token_here" ]; then
    echo "❌ TELEGRAM_BOT_TOKEN не настроен в .env файле"
    exit 1
fi

# Проверка URL
if [ -z "$WEBAPP_URL" ]; then
    echo "❌ WEBAPP_URL не настроен в .env файле"
    exit 1
fi

echo "✅ Конфигурация найдена"
echo "   🤖 Bot token: ${TELEGRAM_BOT_TOKEN:0:10}..."
echo "   🌐 WebApp URL: $WEBAPP_URL"
echo ""

# Проверка webapp.html
if [ ! -f "webapp.html" ]; then
    echo "❌ webapp.html не найден!"
    exit 1
fi

WEBAPP_SIZE=$(du -h webapp.html | cut -f1)
echo "📦 webapp.html: $WEBAPP_SIZE"
echo ""

# Запуск веб-сервера (для локального тестирования)
if [[ $WEBAPP_URL == *"localhost"* ]] || [[ $WEBAPP_URL == *"127.0.0.1"* ]]; then
    echo "🌐 Запуск локального веб-сервера на порту 8080..."
    pkill -f "python3 -m http.server 8080" 2>/dev/null || true
    python3 -m http.server 8080 > /dev/null 2>&1 &
    sleep 1
    echo "✅ Веб-сервер запущен"
    echo ""
    echo "⚠️  Для работы с Telegram нужен публичный HTTPS URL!"
    echo "   Используйте ngrok:"
    echo "     ngrok http 8080"
    echo ""
    echo "   Или разместите webapp.html на GitHub Pages"
    echo ""
fi

# Запуск бота
echo "🤖 Запуск Telegram бота..."
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "✅ Бот запущен! Откройте Telegram и:"
echo ""
echo "   1. Найдите своего бота"
echo "   2. Отправьте /start"
echo "   3. Нажмите кнопку '🚢 Играть в Морской Бой'"
echo ""
echo "   Или используйте Inline режим:"
echo "   - Напишите @your_bot в любом чате"
echo "   - Выберите 'Морской Бой'"
echo ""
echo "Нажмите Ctrl+C для остановки"
echo "════════════════════════════════════════════════════════════════"
echo ""

python3 bot_inline.py
