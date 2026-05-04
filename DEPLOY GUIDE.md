# 🚀 LifeOS - ГИД ПО ЗАПУСКУ

## ЭТАП 1: Supabase (База данных)

### Шаг 1.1: Регистрация
1. Открой [supabase.com](https://supabase.com)
2. Нажми "Start your managed project"
3. Зарегистрируйся через GitHub или почту

### Шаг 1.2: Создание проекта
1. Введи название: `lifeos`
2. Пароль базы данных: `LifeOS2024!` (запомни его)
3. Выбери регион: `EU (Frankfurt)`
4. Нажми "Create new project"

### Шаг 1.3: Настройка базы
1. Дождись загрузки (1-2 минуты)
2. Перейди в **SQL Editor** (меню слева)
3. Скопируй содержимое из файла `supabase/schema.sql`
4. Вставь в редактор и нажми **Run**
5. Должно сказать "Success. No rows returned"

### Шаг 1.4: Получить ключи
1. Перейди в **Project Settings** (шестерёнка) → **API**
2. Скопируй:
   - `Project URL` → это `SUPABASE_URL`
   - `anon public` key → это `SUPABASE_ANON_KEY`

---

## ЭТАП 2: Vercel (Веб-приложение)

### Шаг 2.1: Подготовка
1. Создай GitHub репозиторий: `lifeos`
2. Запушь код проекта туда

### Шаг 2.2: Деплой
1. Открой [vercel.com](https://vercel.com)
2. Нажми "Add New..." → "Project"
3. Выбери репозиторий `lifeos`
4. Нажми "Deploy"

### Шаг 2.3: Переменные
После деплоя добавь переменные в Settings → Environment Variables:

```
SUPABASE_URL=https://твой-проект.supabase.co
SUPABASE_ANON_KEY=твой-ключ
XIAOMI_API_KEY=sk-seqeme655ttmcxn1cglxlgwpw9t0k4987i39pxkhg9mg67p6
```

### Шаг 2.4: Проверка
1. Открой `https://lifeos-tuename.vercel.app`
2. Должен открыться лендинг

---

## ЭТАП 3: Telegram Бот

### Вариант А: Railway (рекомендуется)

#### Шаг 3.1: Регистрация
1. Открой [railway.app](https://railway.app)
2. Зарегистрируйся через GitHub

#### Шаг 3.2: Создание проекта
1. Нажми "New Project"
2. Выбери "Empty Project"
3. Назови: `lifeos-bot`

#### Шаг 3.3: Подключение GitHub
1. В проекте нажми "Deploy from GitHub repo"
2. Выбери репозиторий `lifeos`
3. Нажми "Deploy Now"

#### Шаг 3.4: Переменные
В Settings → Variables добавь:

```
TELEGRAM_BOT_TOKEN=8606509963:AAHQCdY4_v9RvBCUug_oiB7_lpj1cL_3EnQ
SUPABASE_URL=https://твой-проект.supabase.co
SUPABASE_ANON_KEY=твой-ключ
XIAOMI_API_KEY=sk-seqeme655ttmcxn1cglxlgwpw9t0k4987i39pxkhg9mg67p6
```

#### Шаг 3.5: Запуск
1. Дождись деплоя (2-3 минуты)
2. Нажми наDomains"
3. Скопируй URL (например: `lifeos-bot.up.railway.app`)

### Вариант Б: VPS/Сервер

```bash
# Подключение к серверу
ssh user@your-server

# Установка
cd /opt
git clone https://github.com/твой-репозиторий/lifeos.git
cd lifeos
pip install -r requirements.txt

# Запуск
python -m bot.main
```

---

## ЭТАП 4: Подключение Mini App к Telegram

### Шаг 4.1: Настройка Web App URL
1. В Supabase перейди в **Project Settings** → **API**
2. Добавь в **Redirect URLs**: 
   - `https://生命os-*.vercel.app`
   - `https://твой-domain.onrailway.app`

### Шаг 4.2: Проверка бота
1. Открой Telegram @Life0Sbot
2. Напиши /start
3. Должен ответить приветствием

### Шаг 4.3: Проверка Mini App
1. В боте нажми кнопку или /app
2. Должен открыться веб-интерфейс

---

## ✅ ЧЕКЛИСТ ГОТОВНОСТИ

- [ ] Supabase проект создан
- [ ] База данных настроена (schema.sql выполнена)
- [ ] Vercel деплой прошёл
- [ ] Mini App открывается
- [ ] Telegram бот запущен
- [ ] Бот отвечает на /start
- [ ] AI работает (проверь /coach)

---

## 🔧 Если что-то не работает

### Бот не отвечает?
- Проверь TOKEN в переменных
- Проверь логи на Railway

### Не сохраняются данные?
- Проверь SUPABASE_URL и ключи
- Проверь выполнился ли schema.sql

### AI не работает?
- Проверь XIAOMI_API_KEY
- Проверь лимиты API

---

## 📞 Поддержка

При проблемах пиши в консоль Railway/Vercel - там есть логи с ошибками.