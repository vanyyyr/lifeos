'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Moon, Dumbbell, Utensils, Book, Zap, RefreshCw, 
  Brain, Leaf, TrendingUp, Plus, Settings, Bell
} from 'lucide-react'

const categories = [
  { id: 'sleep', emoji: '💤', name: 'Сон', color: 'bg-purple-500' },
  { id: 'sport', emoji: '🏋️', name: 'Спорт', color: 'bg-orange-500' },
  { id: 'nutrition', emoji: '🥗', name: 'Питание', color: 'bg-green-500' },
  { id: 'development', emoji: '📚', name: 'Саморазвитие', color: 'bg-blue-500' },
  { id: 'productivity', emoji: '⚡', name: 'Продуктивность', color: 'bg-yellow-500' },
  { id: 'habits', emoji: '🔄', name: 'Привычки', color: 'bg-pink-500' },
  { id: 'mental', emoji: '🧠', name: 'Ментальное', color: 'bg-indigo-500' },
  { id: 'spiritual', emoji: '🌿', name: 'Духовное', color: 'bg-emerald-500' },
]

export default function Dashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const today = new Date().toLocaleDateString('ru-RU', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Загрузка...</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="p-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#5641FF] rounded-xl flex items-center justify-center">
            <span className="font-bold text-xl">L</span>
          </div>
          <div>
            <div className="font-bold">LifeOS</div>
            <div className="text-gray-400 text-sm capitalize">{today}</div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2 bg-gray-800 rounded-lg">
            <Bell size={20} className="text-gray-400" />
          </button>
          <button className="p-2 bg-gray-800 rounded-lg">
            <Settings size={20} className="text-gray-400" />
          </button>
        </div>
      </header>

      {/* Today's Score */}
      <section className="p-4">
        <div className="bg-gray-800 rounded-2xl p-6 text-center">
          <div className="text-gray-400 text-sm mb-2">Общий счёт за сегодня</div>
          <div className="text-5xl font-bold text-[#5641FF]">
            {stats?.today_score || '-'}
          </div>
          <div className="text-gray-500 text-sm">из 10</div>
        </div>
      </section>

      {/* Categories */}
      <section className="p-4">
        <h2 className="text-lg font-semibold mb-4">Категории</h2>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className="bg-gray-800 rounded-xl p-4 text-left hover:bg-gray-700 transition-colors"
              onClick={() => router.push(`/dash/${cat.id}`)}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 ${cat.color} rounded-lg flex items-center justify-center text-xl`}>
                  {cat.emoji}
                </div>
                <div className="font-medium">{cat.name}</div>
              </div>
              <div className="text-gray-400 text-sm">
                {stats?.[cat.id]?.score || '-'} / 10
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Quick Add */}
      <section className="p-4">
        <h2 className="text-lg font-semibold mb-4">Быстрый ввод</h2>
        <div className="grid grid-cols-4 gap-2">
          <QuickButton emoji="💧" label="Вода" />
          <QuickButton emoji="☕" label="Кофе" />
          <QuickButton emoji="🏃" label="Бег" />
          <QuickButton emoji="🧘" label="Медитация" />
        </div>
      </section>

      {/* AI Coach */}
      <section className="p-4">
        <button 
          className="w-full bg-gradient-to-r from-[#5641FF] to-[#764ba2] rounded-xl p-4 flex items-center justify-between"
          onClick={() => router.push('/dash/coach')}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              🤖
            </div>
            <div className="text-left">
              <div className="font-semibold">AI Коуч</div>
              <div className="text-sm text-white/70">Получить рекомендации</div>
            </div>
          </div>
          <div className="text-2xl">→</div>
        </button>
      </section>

      {/* Weekly Stats */}
      <section className="p-4">
        <h2 className="text-lg font-semibold mb-4">За неделю</h2>
        <div className="bg-gray-800 rounded-xl p-4 space-y-3">
          <StatRow label="Тренировок" value={`${stats?.week_workouts || 0}`} />
          <StatRow label="Воды" value={`${stats?.week_water || 0}л`} />
          <StatRow label="Часы фокуса" value={`${stats?.week_focus || 0}ч`} />
          <StatRow label="Страниц прочитано" value={`${stats?.week_pages || 0}`} />
        </div>
      </section>
    </main>
  )
}

function QuickButton({ emoji, label }: { emoji: string; label: string }) {
  return (
    <button className="flex flex-col items-center gap-1 p-3 bg-gray-800 rounded-xl hover:bg-gray-700">
      <span className="text-2xl">{emoji}</span>
      <span className="text-xs text-gray-400">{label}</span>
    </button>
  )
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-400">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  )
}