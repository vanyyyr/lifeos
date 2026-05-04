'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, TrendingUp, Calendar, Target, Award, Flame } from 'lucide-react'

const CATEGORIES = [
  { id: 'sleep', name: 'Сон', emoji: '💤', color: '#a855f7' },
  { id: 'sport', name: 'Спорт', emoji: '🏋️', color: '#f97316' },
  { id: 'nutrition', name: 'Питание', emoji: '🥗', color: '#22c55e' },
  { id: 'development', name: 'Развитие', emoji: '📚', color: '#3b82f6' },
  { id: 'productivity', name: 'Продуктивность', emoji: '⚡', color: '#eab308' },
  { id: 'habits', name: 'Привычки', emoji: '🔄', color: '#ec4899' },
  { id: 'mental', name: 'Ментальное', emoji: '🧠', color: '#6366f1' },
  { id: 'spiritual', name: 'Духовное', emoji: '🌿', color: '#10b981' },
]

const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const MONTHS = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']

// Generate demo data
function generateWeekData() {
  return Array.from({ length: 7 }, () => Math.floor(Math.random() * 5 + 4))
}

function generateMonthData() {
  return Array.from({ length: 30 }, () => Math.floor(Math.random() * 4 + 5))
}

function generateRadarData(): number[] {
  return CATEGORIES.map(() => Math.floor(Math.random() * 4 + 4))
}

export default function AnalyticsPage() {
  const router = useRouter()
  const [period, setPeriod] = useState<'week' | 'month'>('week')
  const [weekData] = useState(generateWeekData)
  const [monthData] = useState(generateMonthData)
  const [radarData] = useState(generateRadarData)
  const [animateIn, setAnimateIn] = useState(false)
  const [streak] = useState(Math.floor(Math.random() * 15 + 3))

  useEffect(() => {
    setTimeout(() => setAnimateIn(true), 50)
  }, [])

  const chartData = period === 'week' ? weekData : monthData
  const maxVal = Math.max(...chartData, 1)
  const avgScore = (chartData.reduce((a, b) => a + b, 0) / chartData.length).toFixed(1)

  return (
    <main className="min-h-screen bg-gray-950 text-white pb-10">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50 px-4 py-3">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-[#5641FF]" />
            <span className="font-bold">Аналитика</span>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4">
        {/* Summary Cards */}
        <section className={`pt-5 pb-2 grid grid-cols-3 gap-2 transition-all duration-500 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <SummaryCard icon={<Target size={16} />} label="Ср. балл" value={avgScore} color="text-[#5641FF]" />
          <SummaryCard icon={<Flame size={16} />} label="Стрик" value={`${streak} дн.`} color="text-orange-400" />
          <SummaryCard icon={<Award size={16} />} label="Лучший" value="8.5" color="text-green-400" />
        </section>

        {/* Period Toggle */}
        <section className={`py-4 transition-all duration-500 delay-100 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex bg-gray-800/40 rounded-xl p-1 border border-gray-700/30">
            <button
              onClick={() => setPeriod('week')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                period === 'week' ? 'bg-[#5641FF] text-white shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              Неделя
            </button>
            <button
              onClick={() => setPeriod('month')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                period === 'month' ? 'bg-[#5641FF] text-white shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              Месяц
            </button>
          </div>
        </section>

        {/* Bar Chart */}
        <section className={`py-2 transition-all duration-500 delay-200 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h2 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
            <Calendar size={14} /> Общий балл по дням
          </h2>
          <div className="bg-gray-800/40 rounded-2xl p-4 border border-gray-700/30">
            <svg viewBox={`0 0 ${chartData.length * 24 + 10} 120`} className="w-full h-32">
              {/* Grid lines */}
              {[0, 2.5, 5, 7.5, 10].map((val, i) => (
                <g key={i}>
                  <line
                    x1="0" x2={chartData.length * 24 + 10}
                    y1={100 - val * 10} y2={100 - val * 10}
                    stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"
                  />
                  <text x="2" y={100 - val * 10 - 2} fill="rgba(255,255,255,0.2)" fontSize="6">{val}</text>
                </g>
              ))}
              {/* Bars */}
              {chartData.map((val, i) => {
                const barHeight = (val / 10) * 85
                const x = i * 24 + 15
                return (
                  <g key={i}>
                    <defs>
                      <linearGradient id={`bar-${i}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#5641FF" />
                        <stop offset="100%" stopColor="#764ba2" />
                      </linearGradient>
                    </defs>
                    <rect
                      x={x} y={100 - barHeight}
                      width="14" height={barHeight}
                      rx="3"
                      fill={`url(#bar-${i})`}
                      opacity={0.7 + (val / 10) * 0.3}
                      className="transition-all duration-700"
                    >
                      <animate attributeName="height" from="0" to={barHeight} dur="0.8s" fill="freeze" />
                      <animate attributeName="y" from="100" to={100 - barHeight} dur="0.8s" fill="freeze" />
                    </rect>
                    <text
                      x={x + 7} y="112"
                      textAnchor="middle"
                      fill="rgba(255,255,255,0.3)"
                      fontSize="6"
                    >
                      {period === 'week' ? DAYS[i] : (i % 5 === 0 ? i + 1 : '')}
                    </text>
                    <text
                      x={x + 7} y={100 - barHeight - 4}
                      textAnchor="middle"
                      fill="rgba(255,255,255,0.5)"
                      fontSize="5.5"
                      fontWeight="bold"
                    >
                      {val}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>
        </section>

        {/* Radar Chart */}
        <section className={`py-4 transition-all duration-500 delay-300 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h2 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
            <Target size={14} /> Баланс жизни
          </h2>
          <div className="bg-gray-800/40 rounded-2xl p-4 border border-gray-700/30">
            <RadarChart data={radarData} categories={CATEGORIES} />
          </div>
        </section>

        {/* Category Breakdown */}
        <section className={`py-4 transition-all duration-500 delay-[400ms] ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h2 className="text-sm font-semibold text-gray-300 mb-3">По категориям</h2>
          <div className="space-y-2">
            {CATEGORIES.map((cat, i) => (
              <div key={cat.id} className="bg-gray-800/30 rounded-xl p-3 border border-gray-700/20">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm flex items-center gap-2">
                    <span>{cat.emoji}</span>
                    <span className="text-gray-300">{cat.name}</span>
                  </span>
                  <span className="text-sm font-bold" style={{ color: cat.color }}>
                    {radarData[i]}/10
                  </span>
                </div>
                <div className="h-1.5 bg-gray-800/50 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${radarData[i] * 10}%`,
                      backgroundColor: cat.color,
                      opacity: 0.7
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Heatmap */}
        <section className={`py-4 transition-all duration-500 delay-500 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h2 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
            <Flame size={14} /> Активность (последние 12 недель)
          </h2>
          <div className="bg-gray-800/40 rounded-2xl p-4 border border-gray-700/30">
            <HeatmapChart />
          </div>
        </section>
      </div>
    </main>
  )
}

function SummaryCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="bg-gray-800/40 rounded-xl p-3 border border-gray-700/30 text-center">
      <div className={`flex justify-center mb-1 ${color}`}>{icon}</div>
      <div className="text-lg font-bold">{value}</div>
      <div className="text-[10px] text-gray-500">{label}</div>
    </div>
  )
}

function RadarChart({ data, categories }: { data: number[]; categories: typeof CATEGORIES }) {
  const cx = 100, cy = 100, r = 70
  const n = data.length

  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / n - Math.PI / 2
    const distance = (value / 10) * r
    return {
      x: cx + Math.cos(angle) * distance,
      y: cy + Math.sin(angle) * distance
    }
  }

  const getLabelPoint = (index: number) => {
    const angle = (Math.PI * 2 * index) / n - Math.PI / 2
    const distance = r + 18
    return {
      x: cx + Math.cos(angle) * distance,
      y: cy + Math.sin(angle) * distance
    }
  }

  // Grid rings
  const rings = [2.5, 5, 7.5, 10]

  // Data polygon
  const polygonPoints = data.map((v, i) => {
    const pt = getPoint(i, v)
    return `${pt.x},${pt.y}`
  }).join(' ')

  return (
    <svg viewBox="0 0 200 200" className="w-full max-w-[280px] mx-auto">
      <defs>
        <linearGradient id="radarFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5641FF" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#764ba2" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Grid rings */}
      {rings.map((ring, i) => {
        const points = Array.from({ length: n }, (_, j) => {
          const pt = getPoint(j, ring)
          return `${pt.x},${pt.y}`
        }).join(' ')
        return (
          <polygon key={i} points={points} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
        )
      })}

      {/* Axes */}
      {categories.map((_, i) => {
        const pt = getPoint(i, 10)
        return (
          <line key={i} x1={cx} y1={cy} x2={pt.x} y2={pt.y} stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
        )
      })}

      {/* Data polygon */}
      <polygon
        points={polygonPoints}
        fill="url(#radarFill)"
        stroke="#5641FF"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Data points */}
      {data.map((v, i) => {
        const pt = getPoint(i, v)
        return (
          <circle key={i} cx={pt.x} cy={pt.y} r="3" fill={categories[i].color} stroke="#111" strokeWidth="1" />
        )
      })}

      {/* Labels */}
      {categories.map((cat, i) => {
        const pt = getLabelPoint(i)
        return (
          <text
            key={i}
            x={pt.x}
            y={pt.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="rgba(255,255,255,0.5)"
            fontSize="7"
          >
            {cat.emoji}
          </text>
        )
      })}
    </svg>
  )
}

function HeatmapChart() {
  // 12 weeks × 7 days
  const weeks = 12
  const data = Array.from({ length: weeks * 7 }, () => Math.floor(Math.random() * 5))

  const getColor = (val: number) => {
    const colors = [
      'rgba(86,65,255,0.05)',  // 0 - empty
      'rgba(86,65,255,0.15)',  // 1 - light
      'rgba(86,65,255,0.3)',   // 2 - medium
      'rgba(86,65,255,0.5)',   // 3 - good
      'rgba(86,65,255,0.75)',  // 4 - great
    ]
    return colors[val] || colors[0]
  }

  return (
    <div className="flex gap-[3px] justify-center">
      {Array.from({ length: weeks }, (_, w) => (
        <div key={w} className="flex flex-col gap-[3px]">
          {Array.from({ length: 7 }, (_, d) => (
            <div
              key={d}
              className="w-4 h-4 rounded-[3px] transition-colors hover:ring-1 hover:ring-white/20"
              style={{ backgroundColor: getColor(data[w * 7 + d]) }}
              title={`Неделя ${w + 1}, ${DAYS[d]}`}
            />
          ))}
        </div>
      ))}
      <div className="flex flex-col justify-between ml-2 text-[8px] text-gray-600">
        {DAYS.map(d => <span key={d}>{d}</span>)}
      </div>
    </div>
  )
}
