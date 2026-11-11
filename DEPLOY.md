## 🚀 Быстрый запуск (GitHub Pages)

Самый простой способ развернуть Mini App бесплатно:

### 1. Подготовка репозитория

```bash
cd ~/battleship-miniapp

# Инициализируйте Git (если ещё не сделано)
git init
git add index.html styles.css game.js
git commit -m "Initial commit: Battleship Mini App"

# Создайте репозиторий на GitHub
# Затем привяжите и отправьте код:
git remote add origin https://github.com/ваш-username/battleship-miniapp.git
git branch -M main
git push -u origin main
```

### 2. Включите GitHub Pages

1. Откройте репозиторий на GitHub
2. Settings → Pages
3. Source: Deploy from a branch
4. Branch: main → / (root) → Save
5. Подождите 1-2 минуты

Ваш URL будет: `https://username.github.io/battleship-miniapp/`

### 3. Создайте Telegram бота

```bash
# 1. Откройте @BotFather в Telegram
# 2. Отправьте: /newbot
# 3. Введите имя: Морской Бой
# 4. Введите username: battleship_YOUR_NAME_bot
# 5. Скопируйте токен
```

### 4. Зарегистрируйте Mini App

```bash
# В чате с @BotFather:
/newapp

# Выберите вашего бота
# Заполните:
# - Title: Морской Бой
# - Description: Классическая игра прямо в Telegram
# - Photo: загрузите иконку 640x360 (необязательно)
# - GIF: можно пропустить
# - Web App URL: https://username.github.io/battleship-miniapp/
```

### 5. Настройте бота

```bash
# Создайте .env
cp .env.example .env

# Отредактируйте .env:
nano .env

# Добавьте:
TELEGRAM_BOT_TOKEN=ваш_токен_от_BotFather
WEBAPP_URL=https://username.github.io/battleship-miniapp/
```

### 6. Запустите бота

```bash
# Установите зависимости
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Запустите
python3 bot.py

# Или используйте quickstart:
./quickstart.sh
```

### 7. Протестируйте

1. Найдите вашего бота в Telegram
2. Отправьте `/start`
3. Нажмите "🚢 Играть в Морской Бой"
4. Игра откроется прямо в Telegram!

---

## 🧪 Локальное тестирование

Перед деплоем протестируйте локально:

```bash
# Запустите веб-сервер
python3 -m http.server 8080

# Откройте в браузере:
# http://localhost:8080/test_local.html
```

Файл `test_local.html` эмулирует Telegram WebApp API, позволяя тестировать игру без реального бота.

---

## 🔧 Продвинутый деплой

### Вариант 1: Netlify (рекомендуется)

```bash
# 1. Установите Netlify CLI
npm install -g netlify-cli

# 2. Логин
netlify login

# 3. Деплой
cd ~/battleship-miniapp
netlify deploy --prod

# Следуйте инструкциям и укажите:
# - Publish directory: . (текущая директория)

# Ваш URL: https://random-name-12345.netlify.app/
```

### Вариант 2: Собственный сервер (nginx)

```bash
# 1. Скопируйте файлы на сервер
scp -r ~/battleship-miniapp user@server:/var/www/

# 2. Настройте nginx
sudo nano /etc/nginx/sites-available/battleship

# Добавьте:
server {
    listen 443 ssl http2;
    server_name battleship.your-domain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    root /var/www/battleship-miniapp;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
    
    location ~* \.(js|css)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

# 3. Активируйте конфигурацию
sudo ln -s /etc/nginx/sites-available/battleship /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Вариант 3: Vercel

```bash
# 1. Установите Vercel CLI
npm install -g vercel

# 2. Деплой
cd ~/battleship-miniapp
vercel --prod

# Ваш URL: https://battleship-miniapp.vercel.app/
```

---

## 🤖 Запуск бота в production

### Systemd Service

Создайте `/etc/systemd/system/battleship-bot.service`:

```ini
[Unit]
Description=Battleship Mini App Bot
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/home/user/battleship-miniapp
Environment="TELEGRAM_BOT_TOKEN=your_token"
Environment="WEBAPP_URL=https://your-site.com/"
ExecStart=/home/user/battleship-miniapp/venv/bin/python bot.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Запустите:

```bash
sudo systemctl daemon-reload
sudo systemctl enable battleship-bot
sudo systemctl start battleship-bot
sudo systemctl status battleship-bot
```

### Docker (опционально)

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY bot.py .

ENV TELEGRAM_BOT_TOKEN=""
ENV WEBAPP_URL=""

CMD ["python", "bot.py"]
```

Запуск:

```bash
docker build -t battleship-bot .
docker run -d \
    -e TELEGRAM_BOT_TOKEN=your_token \
    -e WEBAPP_URL=https://your-site.com/ \
    --restart=unless-stopped \
    --name battleship-bot \
    battleship-bot
```

---

## 📊 Мониторинг

### Проверка логов бота

```bash
# Systemd
sudo journalctl -u battleship-bot -f

# Docker
docker logs -f battleship-bot

# Вручную
tail -f /var/log/battleship-bot.log
```

### Проверка веб-доступности

```bash
# Проверьте, что Mini App доступен
curl -I https://your-site.com/

# Должен вернуть: HTTP/2 200
```

---

## 🎯 Checklist перед запуском

- [ ] Создан Telegram бот через @BotFather
- [ ] Mini App размещён на HTTPS URL
- [ ] Mini App зарегистрирован через @BotFather `/newapp`
- [ ] Файл .env настроен с токеном и URL
- [ ] Зависимости установлены (`pip install -r requirements.txt`)
- [ ] Бот запущен (`python3 bot.py`)
- [ ] Протестирован через Telegram (отправка `/start`)
- [ ] Mini App открывается и загружается
- [ ] Игра работает корректно (расстановка, выстрелы, победа/поражение)
- [ ] Результаты отправляются боту

---

## 🐛 Troubleshooting

**Mini App не открывается**
- Проверьте HTTPS (HTTP не поддерживается)
- Убедитесь что URL доступен публично
- Проверьте CORS headers (не нужны для Telegram)

**Бот не отвечает**
- Проверьте токен: `echo $TELEGRAM_BOT_TOKEN`
- Убедитесь что бот запущен: `ps aux | grep bot.py`
- Проверьте логи на ошибки

**Игра не работает**
- Откройте консоль браузера (F12) для ошибок JS
- Проверьте что все файлы загружаются (Network tab)
- Используйте `test_local.html` для локальной отладки

**Результаты не отправляются**
- Проверьте что WebApp SDK загружен
- Убедитесь что `tg.sendData()` вызывается
- Проверьте обработчик `handle_web_app_data` в боте

---

Готово! 🎉 Ваш Морской Бой готов к запуску в Telegram!
