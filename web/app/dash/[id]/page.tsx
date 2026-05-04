'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Plus, TrendingUp, Calendar, Target } from 'lucide-react'

const CATEGORY_DATA: Record<string, {
  name: string
  emoji: string
  gradient: string
  metrics: { key: string; label: string; unit: string; max: number }[]
  tips: string[]
}> = {
  sleep: {
    name: 'Сон',
    emoji: '💤',
    gradient: 'from-purple-600 to-purple-400',
    metrics: [
      { key: 'hours', label: 'Часов сна', unit: 'ч', max: 10 },
      { key: 'quality', label: 'Качество', unit: '/10', max: 10 },
      { key: 'deep', label: 'Глубокий сон', unit: '%', max: 100 },
    ],
    tips: [
      'Ложись до 23:00 для лучшего восстановления',
      'Убери экраны за час до сна',
      'Температура в комнате: 18-20°C',
    ],
  },
  sport: {
    name: 'Спорт',
    emoji: '🏋️',
    gradient: 'from-orange-600 to-orange-400',
    metrics: [
      { key: 'workouts', label: 'Тренировок', unit: '', max: 7 },
      { key: 'duration', label: 'Длительность', unit: 'мин', max: 120 },
      { key: 'intensity', label: 'Интенсивность', unit: '/10', max: 10 },
    ],
    tips: [
      'Минимум 150 мин умеренной нагрузки в неделю',
      'Чередуй кардио и силовые',
      'Не забывай разминку и заминку',
    ],
  },
  nutrition: {
    name: 'Питание',
    emoji: '🥗',
    gradient: 'from-green-600 to-green-400',
    metrics: [
      { key: 'water', label: 'Вода', unit: ' ст.', max: 10 },
      { key: 'meals', label: 'Приёмов пищи', unit: '', max: 5 },
      { key: 'quality', label: 'Качество', unit: '/10', max: 10 },
    ],
    tips: [
      'Пей стакан воды сразу после пробуждения',
      'Ешь минимум 5 порций овощей/фруктов',
      'Последний приём за 3 часа до сна',
    ],
  },
  development: {
    name: 'Саморазвитие',
    emoji: '📚',
    gradient: 'from-blue-600 to-blue-400',
    metrics: [
      { key: 'pages', label: 'Страниц', unit: '', max: 50 },
      { key: 'courses', label: 'Мин. курсов', unit: 'мин', max: 120 },
      { key: 'practice', label: 'Практика', unit: 'мин', max: 60 },
    ],
    tips: [
      '20 страниц в день = 1 книга в 2 недели',
      'Применяй то, что изучил, в течение 24 часов',
      'Учи один новый навык за раз',
    ],
  },
  productivity: {
    name: 'Продуктивность',
    emoji: '⚡',
    gradient: 'from-yellow-600 to-yellow-400',
    metrics: [
      { key: 'focus', label: 'Фокус', unit: 'мин', max: 480 },
      { key: 'tasks', label: 'Задач', unit: '', max: 10 },
      { key: 'pomodoros', label: 'Помодоро', unit: '', max: 12 },
    ],
    tips: [
      'Начинай с самой важной задачи (MIT)',
      'Используй Pomodoro: 25 мин работа, 5 мин отдых',
      'Планируй завтрашний день сегодня вечером',
    ],
  },
  habits: {
    name: 'Привычки',
    emoji: '🔄',
    gradient: 'from-pink-600 to-pink-400',
    metrics: [
      { key: 'completed', label: 'Выполнено', unit: '', max: 10 },
      { key: 'streak', label: 'Лучший стрик', unit: ' дн.', max: 30 },
      { key: 'rate', label: '% выполнения', unit: '%', max: 100 },
    ],
    tips: [
      'Привязывай новую привычку к существующей',
      'Начинай с 2-минутной версии привычки',
      'Не пропускай 2 дня подряд',
    ],
  },
  mental: {
    name: 'Ментальное',
    emoji: '🧠',
    gradient: 'from-indigo-600 to-indigo-400',
    metrics: [
      { key: 'mood', label: 'Настроение', unit: '/10', max: 10 },
      { key: 'energy', label: 'Энергия', unit: '/10', max: 10 },
      { key: 'stress', label: 'Стресс', unit: '/10', max: 10 },
    ],
    tips: [
      'Практикуй благодарность каждое утро',
      'Дыхание 4-7-8 для снижения тревоги',
      'Проводи 20 мин на природе ежедневно',
    ],
  },
  spiritual: {
    name: 'Духовное',
    emoji: '🌿',
    gradient: 'from-emerald-600 to-emerald-400',
    metrics: [
      { key: 'meditation', label: 'Медитация', unit: 'мин', max: 30 },
      { key: 'gratitude', label: 'Благодарности', unit: '', max: 5 },
      { key: 'nature', label: 'На природе', unit: 'мин', max: 60 },
    ],
    tips: [
      'Начни с 5 минут медитации',
      'Запиши 3 вещи, за которые благодарен',
      'Позвони близким раз в неделю',
    ],
  },
}

// Demo week data
const DEMO_WEEK = [65, 72, 45, 80, 55, 90, 70]
const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

export default function CategoryPage() {
  const router = useRouter()
  const params = useParams()
  const categoryId = params.id as string
  const category = CATEGORY_DATA[categoryId]
  const [values, setValues] = useState<Record<string, number>>({})
  const [showInput, setShowInput] = useState(false)
  const [animateIn, setAnimateIn] = useState(false)

  useEffect(() => {
    // Load saved values
    const saved = localStorage.getItem(`lifeos_${categoryId}`)
    if (saved) {
      try { setValues(JSON.parse(saved)) } catch {}
    }
    setTimeout(() => setAnimateIn(true), 50)
  }, [categoryId])

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔍</div>
          <div className="text-gray-400">Категория не найдена</div>
          <button onClick={() => router.push('/dash')} className="mt-4 text-[#5641FF] text-sm">
            ← Вернуться
          </button>
        </div>
      </div>
    )
  }

  const handleSave = (key: string, value: number) => {
    const newValues = { ...values, [key]: value }
    setValues(newValues)
    localStorage.setItem(`lifeos_${categoryId}`, JSON.stringify(newValues))
  }

  const score = category.metrics.length > 0
    ? Math.round(
        category.metrics.reduce((acc, m) => acc + Math.min(((values[m.key] || 0) / m.max) * 10, 10), 0) / category.metrics.length
      )
    : 0

  return (
    <main className="min-h-screen bg-gray-950 text-white pb-10">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50 px-4 py-3">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{category.emoji}</span>
            <span className="font-bold">{category.name}</span>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4">
        {/* Score Card */}
        <section className={`py-5 transition-all duration-500 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className={`relative bg-gradient-to-br ${category.gradient} rounded-2xl p-6 overflow-hidden`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
            <div className="relative flex items-center justify-between">
              <div>
                <div className="text-white/70 text-sm mb-1">Сегодняшний скор</div>
                <div className="text-5xl font-bold">{score}</div>
                <div className="text-white/50 text-sm">/10</div>
              </div>
              <div className="text-6xl opacity-30">{category.emoji}</div>
            </div>
          </div>
        </section>

        {/* Week Chart */}
        <section className={`py-4 transition-all duration-500 delay-100 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h2 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
            <TrendingUp size={14} /> За неделю
          </h2>
          <div className="bg-gray-800/40 rounded-2xl p-4 border border-gray-700/30">
            <div className="flex items-end justify-between gap-1 h-24">
              {DEMO_WEEK.map((val, i) => (
                <div key={i} className="flex flex-col items-center gap-1 flex-1">
                  <div 
                    className={`w-full bg-gradient-to-t ${category.gradient} rounded-t-md transition-all duration-700 opacity-60 hover:opacity-100`}
                    style={{ height: `${val}%`, minHeight: '4px' }}
                  />
                  <span className="text-[10px] text-gray-500">{DAYS[i]}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Metrics Input */}
        <section className={`py-4 transition-all duration-500 delay-200 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
              <Calendar size={14} /> Сегодня
            </h2>
            <button 
              onClick={() => setShowInput(!showInput)}
              className="text-xs text-[#5641FF] flex items-center gap-1 hover:underline"
            >
              <Plus size={12} /> Добавить
            </button>
          </div>

          <div className="space-y-3">
            {category.metrics.map((metric) => (
              <div key={metric.key} className="bg-gray-800/40 rounded-xl p-4 border border-gray-700/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">{metric.label}</span>
                  <span className="text-sm font-bold text-white">
                    {values[metric.key] || 0}{metric.unit}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={metric.max}
                  value={values[metric.key] || 0}
                  onChange={(e) => handleSave(metric.key, parseInt(e.target.value))}
                  className="w-full accent-[#5641FF] h-1.5"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-gray-600">0</span>
                  <span className="text-[10px] text-gray-600">{metric.max}{metric.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tips */}
        <section className={`py-4 transition-all duration-500 delay-300 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h2 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
            <Target size={14} /> Рекомендации
          </h2>
          <div className="space-y-2">
            {category.tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-3 bg-gray-800/30 rounded-xl p-3 border border-gray-700/20">
                <span className="text-[#5641FF] text-lg mt-0.5">💡</span>
                <span className="text-sm text-gray-300">{tip}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
