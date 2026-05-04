# LifeOS - AI-Powered Personal Life Tracker

> Персональный AI-ассистент для трекинга и развития личности

## 🔧 Технологии

- **Frontend**: Next.js 14 + React + TypeScript + Tailwind CSS
- **Backend**: Vercel Serverless Functions (API Routes)
- **Database**: PostgreSQL (Supabase)
- **AI**: Moonshot API (Xiaomi)
- **Bot**: Telegram Bot (@Life0Sbot)

## 📱 Страницы

| Страница | Путь | Описание |
|----------|------|----------|
| Landing | `/` | Главная страница с описанием |
| Онбординг | `/onb` | 50+ вопросов по 11 категориям |
| Результат онбординга | `/onb/success` | Экран завершения онбординга |
| Dashboard | `/dash` | Трекинг 8 направлений |
| AI Коуч | `/dash/coach` | Чат с AI-ассистентом |
| Категория | `/dash/[id]` | Детальная страница категории |

## 🚀 Запуск

```bash
# Установить зависимости
npm install

# Запустить dev-сервер
npm run dev

# Сборка для продакшена
npm run build
```

## ⚙️ Переменные окружения

Создай `.env.local` в корне проекта:

```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
TELEGRAM_BOT_TOKEN=your_bot_token
XIAOMI_API_KEY=your_api_key
```

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
│   │   │   └── [id]/page.tsx
│   │   └── api/            # API Routes
│   │       ├── bot/route.ts
│   │       ├── onboarding/route.ts
│   │       └── stats/route.ts
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
└── package.json
```

## ✅ Статус

- ✅ Landing page — премиальный дизайн
- ✅ Онбординг (50+ вопросов, 11 категорий)
- ✅ Dashboard с анимациями и Quick Add
- ✅ AI Коуч (чат-интерфейс)
- ✅ Детальные страницы категорий
- ✅ Telegram Bot (базовые команды)
- ✅ Database schema (Supabase)
- 🔄 AI API интеграция (подготовлена, требует ключ)

---

**Версия**: 1.1.0 (MVP)