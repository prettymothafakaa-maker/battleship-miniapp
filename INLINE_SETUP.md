# 🚀 Настройка Telegram Mini App в Inline режиме

## ✅ Что создано

### 📦 Компактная версия игры
- **webapp.html** — ~8.5 KB, оптимизирован для быстрой загрузки
- Интеграция с Telegram WebApp SDK
- Адаптивный dark-themed дизайн
- Нативные кнопки Telegram (MainButton)

### 🤖 Бот с Inline поддержкой
- **bot_inline.py** — улучшенная версия бота
- Поддержка inline запросов
- Обработка результатов игры
- Команды: `/start`, `/play`, `/help`

---

## 📋 Быстрый старт (5 минут)

### 1. Создайте Telegram бота

1. Откройте [@BotFather](https://t.me/BotFather)
2. Отправьте `/newbot`
3. Придумайте имя: `Морской Бой`
4. Придумайте username: `battleship_yourname_bot`
5. Скопируйте токен

### 2. Включите Inline режим

В @BotFather:
```
/setinline
[выберите вашего бота]
Inline placeholder: 🚢 Морской Бой
```

### 3. Настройте Mini App

В @BotFather:
```
/newapp
[выберите вашего бота]
Title: Морской Бой
Description: Классическая игра прямо в Telegram
Photo: [загрузите изображение корабля 640x360]
Demo GIF: [опционально]
```

**Важно:** На вопрос "Send me the Web App URL" нужно отправить публичный URL вашей игры.

---

## 🌐 Варианты размещения игры

### Вариант A: GitHub Pages (рекомендуется)

1. Создайте репозиторий на GitHub
2. Загрузите файл `webapp.html`
3. Включите GitHub Pages в Settings
4. URL будет: `https://yourusername.github.io/repo-name/webapp.html`

### Вариант B: Ngrok (для тестирования)

```bash
# Запустите веб-сервер (уже запущен на порту 8080)
cd ~/battleship-miniapp
python3 -m http.server 8080

# В другом терминале запустите ngrok
ngrok http 8080

# Скопируйте https URL, например:
# https://abc123.ngrok.io/webapp.html
```

### Вариант C: Собственный сервер

Загрузите `webapp.html` на любой веб-сервер с HTTPS.

---

## 🔧 Настройка .env файла

```bash
cd ~/battleship-miniapp
cp .env.example .env
nano .env
```

Заполните:
```env
TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
WEBAPP_URL=https://yourusername.github.io/battleship/webapp.html
```

---

## ▶️ Запуск бота

```bash
# Установите зависимости (если ещё не установлены)
pip3 install python-telegram-bot

# Запустите бота
cd ~/battleship-miniapp
python3 bot_inline.py
```

Вы увидите:
```
Starting Battleship Mini App Bot with Inline mode...
WebApp URL: https://...
```

---

## 🎮 Как использовать

### Метод 1: Команды в личных сообщениях
1. Найдите своего бота в Telegram
2. Отправьте `/start`
3. Нажмите кнопку "🚢 Играть в Морской Бой"

### Метод 2: Inline режим (как на видео!)
1. В любом чате напишите: `@your_bot_username`
2. Выберите "🚢 Морской Бой" из списка
3. Отправьте в чат
4. Получатель нажимает "▶️ Начать бой!" и играет

### Метод 3: Кнопка в Mini Apps
1. Откройте меню Telegram (три полоски)
2. Перейдите в раздел "Apps"
3. Найдите "Морской Бой"
4. Играйте одним кликом

---

## 🎨 Что реализовано

### Telegram WebApp SDK интеграция:
- ✅ `tg.ready()` — инициализация
- ✅ `tg.expand()` — полноэкранный режим
- ✅ `tg.MainButton` — нативная кнопка внизу
- ✅ `tg.showAlert()` — уведомления о победе/поражении
- ✅ `var(--tg-theme-*)` — цвета темы пользователя
- ✅ `tg.sendData()` — отправка результатов боту

### Оптимизация размера:
- HTML/CSS/JS в одном файле
- Минифицированный JavaScript
- Короткие имена переменных
- Без внешних зависимостей (кроме Telegram SDK)

### Адаптация под Telegram:
- Использование цветовой схемы пользователя
- Нативные элементы интерфейса
- Оптимизация для мобильных устройств
- Автоматическое управление клавиатурой

---

## 📊 Размеры файлов

```
webapp.html    8.5 KB  ⚡ Быстрая загрузка
bot_inline.py  5.8 KB  🤖 Полнофункциональный бот
```

Цель "~4 KB" из видео достижима дальнейшей минификацией, но текущий размер уже обеспечивает мгновенную загрузку.

---

## 🐛 Отладка

### Проблема: Бот не отвечает
```bash
# Проверьте токен
echo $TELEGRAM_BOT_TOKEN

# Проверьте логи
python3 bot_inline.py
```

### Проблема: Mini App не открывается
- Убедитесь что WEBAPP_URL использует HTTPS (не HTTP!)
- GitHub Pages и ngrok предоставляют HTTPS автоматически
- Откройте URL в браузере — должна загрузиться игра

### Проблема: Inline не работает
В @BotFather проверьте:
```
/mybots
[выберите бота]
Bot Settings
Inline Mode: Enabled ✅
```

---

## 🚀 Продакшн деплой

### Рекомендации:
1. **Frontend (webapp.html)**: GitHub Pages / Cloudflare Pages / Vercel
2. **Backend (bot_inline.py)**: 
   - VPS с systemd service
   - Heroku / Railway / Render
   - Docker контейнер

### Systemd service (для VPS):
```bash
sudo nano /etc/systemd/system/battleship-bot.service
```

```ini
[Unit]
Description=Battleship Telegram Bot
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/battleship-miniapp
EnvironmentFile=/root/battleship-miniapp/.env
ExecStart=/usr/bin/python3 /root/battleship-miniapp/bot_inline.py
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable battleship-bot
sudo systemctl start battleship-bot
sudo systemctl status battleship-bot
```

---

## 📚 Дополнительно

- [Telegram Mini Apps документация](https://core.telegram.org/bots/webapps)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [python-telegram-bot](https://docs.python-telegram-bot.org/)

---

## ✅ Готово!

Ваша игра в Морской Бой теперь:
- ⚡ Загружается мгновенно
- 🎨 Адаптирована под Telegram дизайн
- 💬 Работает в любом чате через Inline
- 📱 Открывается нативно без браузера
- 🚀 Готова к вирусному распространению

**Начните играть:** отправьте `/start` вашему боту!
