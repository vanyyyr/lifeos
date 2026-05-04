'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle, ArrowRight, Sparkles, Target, Calendar, Brain } from 'lucide-react'

export default function OnboardingSuccess() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    setTimeout(() => setShow(true), 100)
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col items-center justify-center px-6">
      {/* Success Animation */}
      <div className={`transition-all duration-700 ${show ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
        <div className="relative">
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <CheckCircle size={56} className="text-green-400" />
          </div>
          <div className="absolute -top-2 -right-2 animate-bounce">
            <Sparkles size={24} className="text-yellow-400" />
          </div>
        </div>
      </div>

      <div className={`text-center transition-all duration-700 delay-300 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <h1 className="text-3xl font-bold mb-3">
          Отлично! 🎉
        </h1>
        <p className="text-xl text-gray-300 mb-2">
          Онбординг завершён
        </p>
        <p className="text-gray-400 max-w-md mx-auto mb-10">
          AI анализирует твои ответы и строит персональный план развития. 
          Это займёт несколько секунд.
        </p>
      </div>

      {/* What happens next */}
      <div className={`w-full max-w-md space-y-3 mb-10 transition-all duration-700 delay-500 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 text-center">
          Что дальше
        </h2>
        
        <div className="flex items-center gap-4 bg-gray-800/60 backdrop-blur rounded-xl p-4 border border-gray-700/50">
          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <Brain size={20} className="text-purple-400" />
          </div>
          <div>
            <div className="font-medium text-sm">AI Анализ</div>
            <div className="text-gray-400 text-xs">Персональные рекомендации</div>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-gray-800/60 backdrop-blur rounded-xl p-4 border border-gray-700/50">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <Calendar size={20} className="text-blue-400" />
          </div>
          <div>
            <div className="font-medium text-sm">Ежедневный трекинг</div>
            <div className="text-gray-400 text-xs">Сон, спорт, питание, привычки</div>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-gray-800/60 backdrop-blur rounded-xl p-4 border border-gray-700/50">
          <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <Target size={20} className="text-green-400" />
          </div>
          <div>
            <div className="font-medium text-sm">Видимый прогресс</div>
            <div className="text-gray-400 text-xs">Графики, статистика, цели</div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className={`flex flex-col gap-3 w-full max-w-md transition-all duration-700 delay-700 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <Link
          href="/dash"
          className="w-full bg-[#5641FF] text-white px-6 py-4 rounded-xl font-semibold text-center flex items-center justify-center gap-2 hover:bg-[#3528cc] transition-all active:scale-95"
        >
          Перейти в Dashboard
          <ArrowRight size={20} />
        </Link>
        
        <a
          href="https://t.me/Life0Sbot"
          className="w-full bg-gray-800 text-white px-6 py-4 rounded-xl font-semibold text-center flex items-center justify-center gap-2 hover:bg-gray-700 transition-all"
        >
          🤖 Открыть бота в Telegram
        </a>
      </div>
    </main>
  )
}
