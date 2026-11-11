# 🚢 Морской Бой - Telegram Mini App

Классическая игра "Морской бой" как Telegram Mini App с современным интерфейсом.

## 🎮 Особенности

- ⚡ Мгновенная загрузка прямо в Telegram
- 🎨 Современный dark-themed интерфейс
- 📱 Адаптивный дизайн для мобильных устройств
- 🎯 Интуитивное управление
- 🤖 ИИ-противник
- 📊 Статистика игры

## 🏗️ Структура проекта

```
battleship-miniapp/
├── index.html          # Главная страница Mini App
├── styles.css          # Стили приложения
├── game.js             # Игровая логика
├── bot.py              # Telegram бот
├── requirements.txt    # Python зависимости
├── .env.example        # Пример конфигурации
└── README.md           # Документация
```

## 🚀 Установка

### 1. Создайте Telegram бота

1. Найдите [@BotFather](https://t.me/BotFather) в Telegram
2. Отправьте `/newbot` и следуйте инструкциям
3. Скопируйте полученный токен

### 2. Настройте окружение

```bash
# Клонируйте или скопируйте проект
cd battleship-miniapp

# Создайте виртуальное окружение
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# или
venv\Scripts\activate  # Windows

# Установите зависимости
pip install -r requirements.txt

# Создайте файл .env
cp .env.example .env
# Отредактируйте .env и добавьте свой токен бота
```

### 3. Разместите Mini App

Mini App нужно разместить на веб-сервере с HTTPS. Варианты:

#### A. Локальное тестирование (ngrok)

```bash
# Запустите локальный сервер
python3 -m http.server 8000

# В другом терминале запустите ngrok
ngrok http 8000

# Используйте HTTPS URL от ngrok в .env
```

#### B. GitHub Pages

```bash
# Создайте репозиторий на GitHub
# Загрузите файлы index.html, styles.css, game.js
# Включите GitHub Pages в Settings → Pages
# URL будет: https://username.github.io/repo-name/
```

#### C. Собственный сервер

```bash
# Скопируйте файлы на сервер
scp index.html styles.css game.js user@server:/var/www/battleship/

# Настройте nginx или Apache для раздачи статики
```

### 4. Зарегистрируйте Mini App

```bash
# Отправьте @BotFather команду:
/newapp

# Выберите вашего бота
# Заполните информацию:
# - Название: Морской Бой
# - Описание: Классическая игра прямо в Telegram
# - Загрузите иконку (512x512)
# - URL: ваш HTTPS URL
```

### 5. Запустите бота

```bash
# Убедитесь что .env настроен
source .env
export TELEGRAM_BOT_TOKEN=your_token
export WEBAPP_URL=your_https_url

# Запустите бота
python3 bot.py
```

## 🎮 Как играть

1. Откройте бота в Telegram
2. Нажмите `/start`
3. Кликните "🚢 Играть в Морской Бой"
4. Расставьте корабли:
   - Выберите тип корабля
   - Кликайте по полю для размещения
   - Используйте "Повернуть" для смены ориентации
   - Или нажмите "Случайная расстановка"
5. Нажмите "Начать игру"
6. Стреляйте по полю противника
7. Попадание = ещё один ход
8. Промах = ход противника

## 🛠️ Разработка

### Локальный запуск

```bash
# Запустите веб-сервер для статики
python3 -m http.server 8000

# Откройте в браузере
http://localhost:8000

# Для тестирования Telegram API используйте ngrok
```

### Структура кода

**index.html**
- Разметка игрового интерфейса
- Подключение Telegram WebApp SDK
- Модальные окна и UI элементы

**styles.css**
- Dark-themed дизайн
- Адаптивная сетка
- Анимации и переходы
- CSS переменные для кастомизации

**game.js**
- Инициализация игры
- Логика расстановки кораблей
- Игровой цикл
- ИИ противника
- Интеграция с Telegram WebApp API

**bot.py**
- Обработчики команд
- Запуск Mini App
- Обработка результатов игры
- Статистика

## 📝 Конфигурация

### Переменные окружения

```bash
TELEGRAM_BOT_TOKEN=your_token_here
WEBAPP_URL=https://your-domain.com/battleship/
```

### Настройка игры (game.js)

```javascript
const BOARD_SIZE = 10;  // Размер поля
const SHIPS = [         // Корабли
    { size: 4, count: 1, name: 'Линкор' },
    { size: 3, count: 2, name: 'Крейсер' },
    { size: 2, count: 3, name: 'Эсминец' },
    { size: 1, count: 4, name: 'Катер' }
];
```

### Кастомизация темы (styles.css)

```css
:root {
    --bg-primary: #0B0E14;
    --accent-cool: #38BDF8;
    --accent-warm: #F97316;
    /* ... */
}
```

## 🔧 Деплой на production

### Systemd сервис

Создайте `/etc/systemd/system/battleship-bot.service`:

```ini
[Unit]
Description=Battleship Mini App Bot
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/battleship-miniapp
Environment="TELEGRAM_BOT_TOKEN=your_token"
Environment="WEBAPP_URL=https://your-domain.com/battleship/"
ExecStart=/var/www/battleship-miniapp/venv/bin/python bot.py
Restart=always

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

### Nginx конфигурация

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location /battleship/ {
        root /var/www;
        index index.html;
        try_files $uri $uri/ =404;
        
        # Cache static assets
        location ~* \.(js|css)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

## 📊 Возможные улучшения

- [ ] Мультиплеер (игра с другом)
- [ ] Рейтинговая система
- [ ] Достижения и награды
- [ ] Разные уровни сложности ИИ
- [ ] Звуковые эффекты
- [ ] Анимации взрывов
- [ ] История игр
- [ ] Таблица лидеров
- [ ] Кастомные темы оформления
- [ ] Турнирный режим

## 🐛 Отладка

### Проверка логов бота

```bash
# Если запущен через systemd
sudo journalctl -u battleship-bot -f

# Если запущен вручную
# Логи выводятся в консоль
```

### Telegram WebApp Debug

Откройте в браузере с консолью разработчика:
- Chrome DevTools
- Firefox Developer Tools
- Safari Web Inspector

### Распространённые проблемы

**Mini App не открывается**
- Проверьте что URL использует HTTPS
- Убедитесь что сервер доступен
- Проверьте URL в @BotFather

**Бот не отвечает**
- Проверьте токен в .env
- Убедитесь что бот запущен
- Проверьте логи на ошибки

**Результаты не отправляются**
- Проверьте что WebApp SDK подключен
- Откройте консоль браузера для ошибок
- Проверьте обработчик web_app_data в боте

## 📄 Лицензия

MIT License - используйте свободно для личных и коммерческих проектов.

## 🤝 Поддержка

Нашли баг? Есть идея? Создайте issue или отправьте pull request!

---

Сделано с ⚓ для Telegram
