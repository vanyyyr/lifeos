'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Moon, Dumbbell, Utensils, Book, Zap, RefreshCw, 
  Brain, Leaf, TrendingUp, Plus, Settings, Bell,
  ChevronRight, Droplets, Coffee, PersonStanding, Flame
} from 'lucide-react'

const categories = [
  { id: 'sleep', emoji: '💤', name: 'Сон', color: 'from-purple-600 to-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  { id: 'sport', emoji: '🏋️', name: 'Спорт', color: 'from-orange-600 to-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  { id: 'nutrition', emoji: '🥗', name: 'Питание', color: 'from-green-600 to-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
  { id: 'development', emoji: '📚', name: 'Саморазвитие', color: 'from-blue-600 to-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { id: 'productivity', emoji: '⚡', name: 'Продуктивность', color: 'from-yellow-600 to-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
  { id: 'habits', emoji: '🔄', name: 'Привычки', color: 'from-pink-600 to-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
  { id: 'mental', emoji: '🧠', name: 'Ментальное', color: 'from-indigo-600 to-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
  { id: 'spiritual', emoji: '🌿', name: 'Духовное', color: 'from-emerald-600 to-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
]

// Demo scores for when no API data available
const demoScores: Record<string, number> = {
  sleep: 7, sport: 5, nutrition: 6, development: 4,
  productivity: 8, habits: 3, mental: 6, spiritual: 5,
}

export default function Dashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [scores, setScores] = useState<Record<string, number>>(demoScores)
  const [quickLogs, setQuickLogs] = useState<Record<string, number>>({
    water: 0, coffee: 0, steps: 0, meditation: 0
  })
  const [showNotification, setShowNotification] = useState('')
  const [animateIn, setAnimateIn] = useState(false)

  useEffect(() => {
    // Try to load from localStorage or just use demo data
    const saved = localStorage.getItem('lifeos_daily_scores')
    if (saved) {
      try {
        setScores(JSON.parse(saved))
      } catch {}
    }
    const savedQuick = localStorage.getItem('lifeos_quick_logs')
    if (savedQuick) {
      try {
        setQuickLogs(JSON.parse(savedQuick))
      } catch {}
    }
    setLoading(false)
    setTimeout(() => setAnimateIn(true), 50)
  }, [])

  const overallScore = Math.round(
    Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length
  )

  const today = new Date().toLocaleDateString('ru-RU', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  })

  const handleQuickAdd = (type: string) => {
    const newLogs = { ...quickLogs }
    
    switch (type) {
      case 'water':
        newLogs.water = (newLogs.water || 0) + 1
        showToast('💧 +1 стакан воды')
        break
      case 'coffee':
        newLogs.coffee = (newLogs.coffee || 0) + 1
        showToast('☕ +1 кофе')
        break
      case 'steps':
        newLogs.steps = (newLogs.steps || 0) + 1000
        showToast('🏃 +1000 шагов')
        break
      case 'meditation':
        newLogs.meditation = (newLogs.meditation || 0) + 5
        showToast('🧘 +5 мин медитации')
        break
    }
    
    setQuickLogs(newLogs)
    localStorage.setItem('lifeos_quick_logs', JSON.stringify(newLogs))
  }

  const showToast = (message: string) => {
    setShowNotification(message)
    setTimeout(() => setShowNotification(''), 2000)
  }

  const handleScoreUpdate = (categoryId: string, newScore: number) => {
    const newScores = { ...scores, [categoryId]: newScore }
    setScores(newScores)
    localStorage.setItem('lifeos_daily_scores', JSON.stringify(newScores))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#5641FF] border-t-transparent rounded-full animate-spin" />
          <div className="text-gray-400 text-sm">Загрузка...</div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white pb-24">
      {/* Toast Notification */}
      {showNotification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-gray-800 border border-gray-700 text-white px-6 py-3 rounded-xl shadow-2xl animate-fade-in text-sm font-medium">
          {showNotification}
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50 px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-[#5641FF] to-[#764ba2] rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <span className="font-bold text-sm">L</span>
            </div>
            <div>
              <div className="font-bold text-sm">LifeOS</div>
              <div className="text-gray-500 text-xs capitalize">{today}</div>
            </div>
          </div>
          <div className="flex gap-1.5">
            <button className="p-2 bg-gray-800/60 rounded-lg hover:bg-gray-700/60 transition-colors" id="notifications-btn">
              <Bell size={18} className="text-gray-400" />
            </button>
            <button className="p-2 bg-gray-800/60 rounded-lg hover:bg-gray-700/60 transition-colors" id="settings-btn">
              <Settings size={18} className="text-gray-400" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4">
        {/* Today's Score — Hero Card */}
        <section className={`pt-5 pb-2 transition-all duration-500 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl p-6 border border-gray-700/30 overflow-hidden">
            {/* Glow effect */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#5641FF]/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl" />
            
            <div className="relative text-center">
              <div className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-3">Общий счёт за сегодня</div>
              <div className="relative inline-flex items-center justify-center">
                {/* Score ring */}
                <svg className="w-28 h-28 -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(86,65,255,0.1)" strokeWidth="8" />
                  <circle cx="60" cy="60" r="52" fill="none" stroke="url(#scoreGrad)" strokeWidth="8" 
                    strokeLinecap="round" strokeDasharray={`${(overallScore / 10) * 327} 327`}
                    className="transition-all duration-1000 ease-out" />
                  <defs>
                    <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#5641FF" />
                      <stop offset="100%" stopColor="#764ba2" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {overallScore}
                  </span>
                  <span className="text-gray-500 text-xs">/10</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className={`py-4 transition-all duration-500 delay-100 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-300">Категории</h2>
            <span className="text-xs text-gray-500">Нажми для подробностей</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {categories.map((cat, i) => (
              <button
                key={cat.id}
                className={`group relative ${cat.bg} rounded-xl p-3.5 text-left border ${cat.border} 
                  hover:border-opacity-50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]`}
                onClick={() => router.push(`/dash/${cat.id}`)}
                style={{ animationDelay: `${i * 50}ms` }}
                id={`category-${cat.id}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{cat.emoji}</span>
                  <ChevronRight size={14} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
                </div>
                <div className="font-medium text-sm text-gray-200">{cat.name}</div>
                <div className="flex items-center gap-2 mt-1.5">
                  {/* Mini progress bar */}
                  <div className="flex-1 h-1.5 bg-gray-800/50 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${cat.color} rounded-full transition-all duration-1000`}
                      style={{ width: `${(scores[cat.id] || 0) * 10}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-400">
                    {scores[cat.id] || 0}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Quick Add */}
        <section className={`py-4 transition-all duration-500 delay-200 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h2 className="text-sm font-semibold text-gray-300 mb-3">Быстрый ввод</h2>
          <div className="grid grid-cols-4 gap-2">
            <QuickButton 
              emoji="💧" label="Вода" count={quickLogs.water} 
              onClick={() => handleQuickAdd('water')} 
            />
            <QuickButton 
              emoji="☕" label="Кофе" count={quickLogs.coffee} 
              onClick={() => handleQuickAdd('coffee')} 
            />
            <QuickButton 
              emoji="🏃" label="Шаги" count={quickLogs.steps ? `${quickLogs.steps/1000}k` : 0} 
              onClick={() => handleQuickAdd('steps')} 
            />
            <QuickButton 
              emoji="🧘" label="Медитация" count={quickLogs.meditation ? `${quickLogs.meditation}м` : 0} 
              onClick={() => handleQuickAdd('meditation')} 
            />
          </div>
        </section>

        {/* AI Coach Card */}
        <section className={`py-4 transition-all duration-500 delay-300 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <button 
            className="w-full relative overflow-hidden bg-gradient-to-r from-[#5641FF]/90 to-[#764ba2]/90 rounded-2xl p-5 flex items-center justify-between group hover:from-[#5641FF] hover:to-[#764ba2] transition-all active:scale-[0.98]"
            onClick={() => router.push('/dash/coach')}
            id="ai-coach-btn"
          >
            {/* Animated glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all" />
            
            <div className="flex items-center gap-4 relative">
              <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center text-2xl">
                🤖
              </div>
              <div className="text-left">
                <div className="font-bold">AI Коуч</div>
                <div className="text-sm text-white/60">Получить персональные рекомендации</div>
              </div>
            </div>
            <ChevronRight size={20} className="text-white/40 group-hover:text-white/70 relative transition-colors" />
          </button>
        </section>

        {/* Weekly Stats */}
        <section className={`py-4 transition-all duration-500 delay-[400ms] ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h2 className="text-sm font-semibold text-gray-300 mb-3">За неделю</h2>
          <div className="bg-gray-800/40 backdrop-blur rounded-2xl p-4 border border-gray-700/30 space-y-3">
            <StatRow icon="🏋️" label="Тренировок" value="3" max="5" progress={60} />
            <StatRow icon="💧" label="Воды" value={`${quickLogs.water || 8} ст.`} max="" progress={80} />
            <StatRow icon="⚡" label="Часы фокуса" value="12.5ч" max="" progress={70} />
            <StatRow icon="📖" label="Прочитано" value="45 стр." max="" progress={45} />
          </div>
        </section>

        {/* Analytics Card */}
        <section className={`py-4 transition-all duration-500 delay-500 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <button 
            className="w-full relative overflow-hidden bg-gradient-to-r from-emerald-600/80 to-teal-500/80 rounded-2xl p-5 flex items-center justify-between group hover:from-emerald-600 hover:to-teal-500 transition-all active:scale-[0.98]"
            onClick={() => router.push('/dash/analytics')}
            id="analytics-btn"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all" />
            <div className="flex items-center gap-4 relative">
              <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center text-2xl">
                📊
              </div>
              <div className="text-left">
                <div className="font-bold">Аналитика</div>
                <div className="text-sm text-white/60">Графики прогресса и статистика</div>
              </div>
            </div>
            <ChevronRight size={20} className="text-white/40 group-hover:text-white/70 relative transition-colors" />
          </button>
        </section>
      </div>
    </main>
  )
}

function QuickButton({ emoji, label, count, onClick }: { emoji: string; label: string; count: any; onClick: () => void }) {
  return (
    <button 
      className="flex flex-col items-center gap-1 p-3 bg-gray-800/40 backdrop-blur rounded-xl border border-gray-700/30 hover:bg-gray-700/40 active:scale-95 transition-all"
      onClick={onClick}
    >
      <span className="text-xl">{emoji}</span>
      <span className="text-[10px] text-gray-400 font-medium">{label}</span>
      {count !== 0 && (
        <span className="text-[10px] text-[#5641FF] font-bold">{count}</span>
      )}
    </button>
  )
}

function StatRow({ icon, label, value, max, progress }: { icon: string; label: string; value: string; max: string; progress: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-gray-400 text-sm flex items-center gap-2">
          <span>{icon}</span>{label}
        </span>
        <span className="font-semibold text-sm">{value}{max && <span className="text-gray-600 font-normal">/{max}</span>}</span>
      </div>
      <div className="h-1 bg-gray-700/50 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-[#5641FF] to-[#764ba2] rounded-full transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}