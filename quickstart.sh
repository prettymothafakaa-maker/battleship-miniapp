#!/bin/bash
# Quick Start Script for Battleship Mini App

echo "🚢 Морской Бой - Telegram Mini App"
echo "=================================="
echo ""

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 не найден. Установите Python 3.8+"
    exit 1
fi

echo "✅ Python 3: $(python3 --version)"

# Create virtual environment if doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Создаём виртуальное окружение..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "📥 Устанавливаем зависимости..."
pip install -q -r requirements.txt

echo ""
echo "✅ Настройка завершена!"
echo ""
echo "🚀 Следующие шаги:"
echo ""
echo "1️⃣  Локальное тестирование (без Telegram):"
echo "    python3 -m http.server 8080"
echo "    Откройте: http://localhost:8080/test_local.html"
echo ""
echo "2️⃣  Создайте бота в Telegram:"
echo "    • Найдите @BotFather"
echo "    • Отправьте: /newbot"
echo "    • Скопируйте токен"
echo ""
echo "3️⃣  Настройте .env файл:"
echo "    cp .env.example .env"
echo "    # Отредактируйте .env и добавьте TELEGRAM_BOT_TOKEN"
echo ""
echo "4️⃣  Разместите Mini App на веб-сервере с HTTPS"
echo "    Варианты:"
echo "    • GitHub Pages (бесплатно)"
echo "    • Netlify/Vercel (бесплатно)"
echo "    • Собственный сервер с nginx"
echo ""
echo "5️⃣  Зарегистрируйте Mini App:"
echo "    • @BotFather → /newapp"
echo "    • Укажите URL вашего HTTPS сайта"
echo ""
echo "6️⃣  Запустите бота:"
echo "    source venv/bin/activate"
echo "    export TELEGRAM_BOT_TOKEN=ваш_токен"
echo "    export WEBAPP_URL=https://ваш-сайт.com/"
echo "    python3 bot.py"
echo ""
