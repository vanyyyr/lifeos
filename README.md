# LifeOS - AI-Powered Personal Life Tracker

> Персональный AI-ассистент для трекинга и развития личности

## 🔧 Технологии

- **Frontend**: Next.js 14 + React + TypeScript + Tailwind CSS
- **Backend**: Vercel Serverless Functions (API Routes)
- **Database**: PostgreSQL (Supabase)
- **AI**: Moonshot API (Kimi)
- **Bot**: Telegram Bot (@Life0Sbot)

## 📱 Страницы

| Страница | Путь | Описание |
|----------|------|----------|
| Landing | `/` | Главная страница с описанием |
| Онбординг | `/onb` | 50+ вопросов по 11 категориям |
| Результат | `/onb/success` | Экран завершения онбординга |
| Dashboard | `/dash` | Трекинг 8 направлений |
| AI Коуч | `/dash/coach` | Чат с Moonshot AI |
| Категория | `/dash/[id]` | Детальная страница категории |
| Аналитика | `/dash/analytics` | Графики, радар, хитмэп |

## 📡 API

| Endpoint | Метод | Описание |
|----------|-------|----------|
| `/api/ai` | POST | Moonshot AI + fallback |
| `/api/bot` | POST | Telegram webhook |
| `/api/onboarding` | POST/GET | Сохранение/чтение онбординга |
| `/api/stats` | POST/GET | Статистика пользователя |

## 🚀 Запуск

```bash
# Установить зависимости
npm install

# Запустить dev-сервер
npm run dev

# Сборка
npm run build

# Деплой на Vercel
vercel deploy --prod
```

## ⚙️ Переменные окружения

Создай `.env.local` в корне проекта:

```
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
TELEGRAM_BOT_TOKEN=...
XIAOMI_API_KEY=...
NEXT_PUBLIC_APP_URL=https://lifeos-khaki-one.vercel.app
NEXT_PUBLIC_BOT_URL=https://t.me/Life0Sbot
```

**Для Vercel:** добавь эти же переменные в Settings → Environment Variables.

## 📂 Структура

```
lifeos/
├── web/                    # Next.js приложение
│   ├── app/
│   │   ├── page.tsx        # Landing page
│   │   ├── layout.tsx      # Root layout
│   │   ├── globals.css     # Глобальные стили
│   │   ├── onb/            # Онбординг
│   │   │   ├── page.tsx
│   │   │   └── success/page.tsx
│   │   ├── dash/           # Dashboard
│   │   │   ├── page.tsx
│   │   │   ├── coach/page.tsx
│   │   │   ├── analytics/page.tsx
│   │   │   └── [id]/page.tsx
│   │   └── api/            # API Routes
│   │       ├── ai/route.ts
│   │       ├── bot/route.ts
│   │       ├── onboarding/route.ts
│   │       └── stats/route.ts
│   ├── next.config.js
│   ├── tailwind.config.ts
│   ├── postcss.config.js
│   └── tsconfig.json
├── bot/                    # Telegram Bot (Python)
│   ├── main.py
│   └── database.py
├── ai/                     # AI Module
│   └── ai_core.py
├── supabase/               # Database
│   └── schema.sql
├── vercel.json             # Vercel deploy config
└── package.json
```

## ✅ Статус

- ✅ Landing page — премиальный дизайн
- ✅ Онбординг (50+ вопросов, 11 категорий)
- ✅ Dashboard с Quick Add и трекингом
- ✅ AI Коуч (Moonshot API + fallback)
- ✅ Детальные страницы категорий
- ✅ Аналитика (SVG графики, радар, хитмэп)
- ✅ Telegram Bot с Mini App
- ✅ Database schema (Supabase)
- ✅ Секреты в env vars
- ✅ Vercel deploy config

---

**Версия**: 1.2.0 (MVP Complete)