'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Send, Sparkles, Loader2 } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const SUGGESTIONS = [
  '💪 Как улучшить сон?',
  '🥗 Составь план питания',
  '🧘 Как бороться со стрессом?',
  '📚 Что почитать для развития?',
  '⚡ Как повысить продуктивность?',
  '🏋️ Программа тренировок',
]

// AI response simulation (will be replaced with real API)
const AI_RESPONSES: Record<string, string> = {
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
☕ Кофе: макс 2 чашки до 14:00

Хочешь более детальный план под твои цели?`,

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
- 1 встреча с близкими
- 1 digital detox вечер

Давай добавим это в твой трекер привычек?`,

  'читать': `📚 **Топ книг для развития:**

**Продуктивность:**
- "Atomic Habits" — James Clear
- "Deep Work" — Cal Newport

**Мышление:**
- "Думай медленно, решай быстро" — Канеман
- "Антихрупкость" — Талеб

**Здоровье:**
- "Почему мы спим" — Мэттью Уолкер
- "Transcend" — Scott Barry Kaufman

Начни с одной книги. 20 страниц в день = 1 книга в 2 недели 📖`,

  'продуктивн': `⚡ **Система продуктивности:**

1. **Утро** — 2 часа глубокой работы (без уведомлений)
2. **Pomodoro** — 25 мин работа / 5 мин отдых
3. **MIT** — 3 главных задачи на день (не больше)
4. **Вечер** — планируй завтра сегодня
5. **Weekly Review** — каждое воскресенье

**Лайфхаки:**
- Убери телефон в другую комнату
- Используй режим "Не беспокоить"
- Пей воду каждый час

Начнём трекинг фокуса? 🎯`,

  'тренировк': `🏋️ **Базовая программа 3 дня/неделю:**

**День 1 (Верх):**
- Жим лёжа 4×8
- Тяга в наклоне 4×8
- Жим плечами 3×10
- Бицепс/Трицепс 3×12

**День 2 (Ноги):**
- Приседания 4×8
- Румынская тяга 4×8
- Выпады 3×10
- Икры 3×15

**День 3 (Full Body):**
- Подтягивания 3×max
- Отжимания 3×15
- Планка 3×60с
- Кардио 20 мин

Отдых 60-90с между подходами. Прогрессия +2.5кг/неделю 📈`,
}

function getAIResponse(message: string): string {
  const lower = message.toLowerCase()
  
  for (const [key, response] of Object.entries(AI_RESPONSES)) {
    if (lower.includes(key)) {
      return response
    }
  }
  
  return `Отличный вопрос! 🤔

Я анализирую твои данные и готовлю персональные рекомендации.

В полной версии я смогу:
- 📊 Анализировать твой прогресс
- 🎯 Давать конкретные советы
- 📅 Корректировать план

А пока — попробуй задать вопрос про сон, питание, тренировки, стресс или продуктивность!`
}

export default function CoachPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '👋 Привет! Я твой AI-коуч.\n\nЗадай мне вопрос о здоровье, продуктивности или саморазвитии — и я дам персональные рекомендации.',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isTyping) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate AI thinking
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getAIResponse(userMessage.content),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 800 + Math.random() * 1200)
  }

  const handleSuggestion = (text: string) => {
    setInput(text)
    setTimeout(() => handleSend(), 100)
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50 px-4 py-3">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            id="back-btn"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-[#5641FF] to-[#764ba2] rounded-xl flex items-center justify-center text-lg shadow-lg shadow-purple-500/20">
              🤖
            </div>
            <div>
              <div className="font-bold text-sm">AI Коуч</div>
              <div className="text-green-400 text-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                Онлайн
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 max-w-lg mx-auto w-full">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                msg.role === 'user' 
                  ? 'bg-[#5641FF] text-white rounded-br-md' 
                  : 'bg-gray-800/60 border border-gray-700/40 text-gray-200 rounded-bl-md'
              }`}>
                <div className="text-sm whitespace-pre-line leading-relaxed">{msg.content}</div>
                <div className={`text-[10px] mt-1.5 ${msg.role === 'user' ? 'text-white/40' : 'text-gray-500'}`}>
                  {msg.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-800/60 border border-gray-700/40 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex items-center gap-2 text-gray-400">
                  <Loader2 size={14} className="animate-spin" />
                  <span className="text-sm">Думаю...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions (show only when few messages) */}
        {messages.length <= 2 && !isTyping && (
          <div className="mt-6">
            <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
              <Sparkles size={12} /> Попробуй спросить:
            </div>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSuggestion(suggestion)}
                  className="text-xs bg-gray-800/60 border border-gray-700/40 text-gray-300 px-3 py-1.5 rounded-full hover:bg-gray-700/60 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="sticky bottom-0 bg-gray-950/80 backdrop-blur-xl border-t border-gray-800/50 px-4 py-3">
        <div className="max-w-lg mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Напиши сообщение..."
            className="flex-1 bg-gray-800/60 border border-gray-700/40 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#5641FF]/50 focus:ring-1 focus:ring-[#5641FF]/30 transition-all"
            id="chat-input"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="bg-[#5641FF] p-3 rounded-xl hover:bg-[#3528cc] transition-all disabled:opacity-30 disabled:hover:bg-[#5641FF] active:scale-95"
            id="send-btn"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </main>
  )
}
