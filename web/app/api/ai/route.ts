import { NextRequest, NextResponse } from 'next/server'

const AI_API_KEY = process.env.XIAOMI_API_KEY || process.env.OPENAI_API_KEY || ''
const AI_BASE_URL = process.env.AI_BASE_URL || 'https://api.xiaomimimo.com/v1'
const MODEL = process.env.AI_MODEL || 'mimo-v2.5'

const SYSTEM_PROMPT = `Ты - LifeOS, персональный AI-коуч для трекинга и развития личности.

Твои основные функции:
1. Помогать пользователю отслеживать все аспекты жизни (сон, спорт, питание, саморазвитие, продуктивность, привычки)
2. Давать персонализированные рекомендации на основе данных
3. Мотивировать и поддерживать
4. Адаптировать план развития под пользователя

Стиль общения:
- Поддерживающий, но честный
- Конкретный и практичный  
- Мотивирующий без давления
- Используй emoji для наглядности
- Структурируй ответы списками и заголовками

Отвечай на русском языке. Будь кратким — макс 300 слов.`

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export async function POST(request: NextRequest) {
  try {
    const { message, history = [] } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    if (!AI_API_KEY) {
      // Fallback to local responses when no API key
      return NextResponse.json({
        response: getFallbackResponse(message),
        source: 'fallback'
      })
    }

    // Build messages array
    const messages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.slice(-10).map((h: any) => ({
        role: h.role as 'user' | 'assistant',
        content: h.content
      })),
      { role: 'user', content: message }
    ]

    const response = await fetch(`${AI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Moonshot API error:', response.status, errorData)
      
      // Fallback on API error
      return NextResponse.json({
        response: getFallbackResponse(message),
        source: 'fallback',
        error: `API error: ${response.status}`
      })
    }

    const data = await response.json()
    const aiResponse = data.choices?.[0]?.message?.content || 'Извини, не удалось получить ответ.'

    return NextResponse.json({
      response: aiResponse,
      source: 'ai',
      usage: data.usage
    })

  } catch (error: any) {
    console.error('AI API error:', error)
    return NextResponse.json({
      response: getFallbackResponse(''),
      source: 'fallback',
      error: error.message
    })
  }
}

// Fallback responses when API is unavailable
function getFallbackResponse(message: string): string {
  const lower = message.toLowerCase()

  const responses: Record<string, string> = {
    'сон': `💤 **Улучшение сна — 5 шагов:**

1. **Режим** — ложись и вставай в одно время (±30 мин)
2. **Экраны** — убери телефон за 1 час до сна
3. **Температура** — 18-20°C в комнате
4. **Ритуал** — чтение / дыхание / растяжка
5. **Кофеин** — последний кофе до 14:00

📊 Начни трекинг сна в LifeOS, и я буду следить за прогрессом!`,

    'питан': `🥗 **Базовый план питания:**

**Завтрак (8:00):** Овсянка + ягоды + орехи
**Перекус (11:00):** Яблоко + миндаль
**Обед (13:00):** Крупа + белок + овощи
**Перекус (16:00):** Творог + фрукт
**Ужин (19:00):** Рыба/птица + салат

💧 Вода: 8 стаканов в день
☕ Кофе: макс 2 чашки до 14:00`,

    'стресс': `🧘 **Антистресс-протокол:**

**Быстро (2 мин):**
- Дыхание 4-7-8 (вдох-задержка-выдох)
- Холодная вода на запястья

**Каждый день:**
- 10 мин медитации (утро)
- 20 мин прогулка (обед)
- Дневник благодарности (вечер)

**Еженедельно:**
- 1 выход на природу
- 1 digital detox вечер`,

    'продуктивн': `⚡ **Система продуктивности:**

1. **Утро** — 2 часа глубокой работы (без уведомлений)
2. **Pomodoro** — 25 мин работа / 5 мин отдых
3. **MIT** — 3 главных задачи на день (не больше)
4. **Вечер** — планируй завтра сегодня
5. **Weekly Review** — каждое воскресенье`,

    'тренировк': `🏋️ **Базовая программа 3 дня/неделю:**

**День 1 (Верх):** Жим лёжа, Тяга в наклоне, Жим плечами, Бицепс/Трицепс
**День 2 (Ноги):** Приседания, Румынская тяга, Выпады, Икры
**День 3 (Full Body):** Подтягивания, Отжимания, Планка, Кардио 20 мин

Отдых 60-90с между подходами. Прогрессия +2.5кг/неделю 📈`,

    'читать': `📚 **Топ книг для развития:**

**Продуктивность:** "Atomic Habits" — James Clear, "Deep Work" — Cal Newport
**Мышление:** "Думай медленно, решай быстро" — Канеман
**Здоровье:** "Почему мы спим" — Мэттью Уолкер

20 страниц в день = 1 книга в 2 недели 📖`,
  }

  for (const [key, response] of Object.entries(responses)) {
    if (lower.includes(key)) {
      return response
    }
  }

  return `Отличный вопрос! 🤔

Я анализирую твои данные и готовлю рекомендации.

Попробуй спросить про:
- 💤 Сон и восстановление
- 🥗 Питание и диету
- 🏋️ Тренировки
- ⚡ Продуктивность
- 🧘 Стресс и ментальное здоровье
- 📚 Что почитать`
}

export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    model: MODEL,
    hasApiKey: !!XIAOMI_API_KEY 
  })
}
