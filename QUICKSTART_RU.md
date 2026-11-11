# 🚀 Быстрый старт - Морской Бой

## Шаг 1: Локальное тестирование (прямо сейчас!)

```bash
# Сервер уже запущен на порту 8080
# Откройте в браузере:
# http://localhost:8080/test_local.html
```

🎮 Можете играть прямо сейчас без Telegram!

---

## Шаг 2: Деплой в Telegram (10 минут)

### А. Создайте бота (2 минуты)

1. Откройте Telegram
2. Найдите **@BotFather**
3. Отправьте: `/newbot`
4. Придумайте имя: `Морской Бой`
5. Придумайте username: `battleship_ваш_ник_bot`
6. **Скопируйте токен** (выглядит как `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`)

### Б. Разместите на GitHub Pages (5 минут)

```bash
cd ~/battleship-miniapp

# Инициализируйте Git
git init
git add index.html styles.css game.js
git commit -m "Battleship Mini App"

# Создайте репозиторий на github.com
# Назовите его: battleship-miniapp
# Сделайте публичным

# Загрузите код
git remote add origin https://github.com/ВАШ_USERNAME/battleship-miniapp.git
git branch -M main
git push -u origin main
```

**Включите GitHub Pages:**
1. Откройте репозиторий на GitHub
2. Settings → Pages (слева)
3. Source: **Deploy from a branch**
4. Branch: **main** → **/ (root)** → Save
5. Подождите 1-2 минуты

**Ваш URL:** `https://ВАШ_USERNAME.github.io/battleship-miniapp/`

### В. Зарегистрируйте Mini App (2 минуты)

В Telegram отправьте **@BotFather**:

```
/newapp
```

Выберите вашего бота и заполните:
- **Title:** Морской Бой
- **Description:** Классическая игра прямо в Telegram  
- **Photo:** (можно пропустить)
- **GIF:** (можно пропустить)
- **Web App URL:** `https://ВАШ_USERNAME.github.io/battleship-miniapp/`

### Г. Запустите бота (1 минута)

```bash
cd ~/battleship-miniapp

# Настройте .env
cp .env.example .env
nano .env

# Впишите (замените на свои):
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
WEBAPP_URL=https://ВАШ_USERNAME.github.io/battleship-miniapp/

# Установите зависимости
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# ЗАПУСТИТЕ!
python3 bot.py
```

### Д. ИГРАЙТЕ! 🎉

1. Найдите вашего бота в Telegram
2. Отправьте: `/start`
3. Нажмите: **🚢 Играть в Морской Бой**
4. Игра откроется прямо в Telegram!

---

## Альтернатива: Netlify (ещё проще)

```bash
# Установите Netlify CLI
npm install -g netlify-cli

# Деплой одной командой
cd ~/battleship-miniapp
netlify deploy --prod

# Следуйте инструкциям
# Ваш URL: https://случайное-имя.netlify.app/
```

Используйте этот URL в @BotFather → /newapp

---

## Помощь

**Локальное тестирование работает?**
- ✅ Откройте: http://localhost:8080/test_local.html
- ✅ Попробуйте расставить корабли и сыграть

**Проблемы с GitHub Pages?**
- Проверьте что репозиторий публичный
- Подождите 2-3 минуты после включения Pages
- URL должен быть HTTPS (не HTTP)

**Бот не отвечает?**
- Проверьте токен в .env
- Убедитесь что python3 bot.py запущен
- Посмотрите логи в терминале

**Mini App не открывается?**
- URL должен быть HTTPS
- Проверьте что файлы загружены на GitHub
- Откройте URL в браузере - должна открыться игра

---

## Команды бота

- `/start` - приветствие и запуск игры
- `/play` - прямой запуск игры
- `/help` - справка по игре

---

**Вопросы?** Смотрите полную документацию в `README.md` и `DEPLOY.md`

**Удачи! ⚓🎮**
