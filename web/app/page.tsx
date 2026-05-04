import Link from 'next/link'
import { Bot, ArrowRight, Sparkles, Shield, Zap, Brain } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white overflow-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#5641FF]/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/6 rounded-full blur-[100px]" />
        <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[80px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-5 flex justify-between items-center max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#5641FF] to-[#764ba2] rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
            <span className="text-white font-bold text-xl">L</span>
          </div>
          <span className="text-white font-bold text-xl tracking-tight">LifeOS</span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-gray-400 hover:text-white transition-colors text-sm">Функции</a>
          <a href="#how" className="text-gray-400 hover:text-white transition-colors text-sm">Как работает</a>
          <Link href="/dash" className="text-sm bg-white/5 border border-white/10 px-4 py-2 rounded-lg hover:bg-white/10 transition-all">
            Dashboard
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative z-10 px-6 pt-16 pb-24 text-center max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-[#5641FF]/10 border border-[#5641FF]/20 rounded-full px-4 py-1.5 mb-8">
          <Sparkles size={14} className="text-[#5641FF]" />
          <span className="text-[#5641FF] text-xs font-medium">AI-powered личный трекер</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-[1.1] tracking-tight">
          Управляй своей
          <br />
          <span className="bg-gradient-to-r from-[#5641FF] via-purple-400 to-[#764ba2] bg-clip-text text-transparent">
            жизнью осознанно
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Трекинг сна, спорта, питания и саморазвития с персональным AI-коучем. 
          Видишь прогресс — растёшь каждый день.
        </p>
        
        <div className="flex gap-3 justify-center flex-wrap">
          <a 
            href="https://t.me/Life0Sbot"
            className="group inline-flex items-center gap-2 bg-[#5641FF] text-white px-7 py-3.5 rounded-xl font-semibold transition-all hover:bg-[#3528cc] hover:shadow-xl hover:shadow-purple-500/20 active:scale-95"
          >
            <Bot size={20} />
            Запустить бота
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <Link 
            href="/onb" 
            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white px-7 py-3.5 rounded-xl font-semibold transition-all hover:bg-white/10 active:scale-95"
          >
            Начать онбординг
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="flex items-center justify-center gap-6 mt-10 text-gray-500 text-xs">
          <span className="flex items-center gap-1.5"><Shield size={12} /> Данные защищены</span>
          <span className="flex items-center gap-1.5"><Zap size={12} /> Быстрый старт</span>
          <span className="flex items-center gap-1.5"><Brain size={12} /> AI персонализация</span>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 px-6 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            8 направлений развития
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Комплексный подход к улучшению качества жизни
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <FeatureCard emoji="💤" title="Сон" desc="Время, качество, циклы" gradient="from-purple-500/10 to-purple-600/5" border="border-purple-500/10" />
          <FeatureCard emoji="🏋️" title="Спорт" desc="Тренировки, прогресс" gradient="from-orange-500/10 to-orange-600/5" border="border-orange-500/10" />
          <FeatureCard emoji="🥗" title="Питание" desc="КБЖУ, вода, приёмы" gradient="from-green-500/10 to-green-600/5" border="border-green-500/10" />
          <FeatureCard emoji="📚" title="Саморазвитие" desc="Чтение, курсы, навыки" gradient="from-blue-500/10 to-blue-600/5" border="border-blue-500/10" />
          <FeatureCard emoji="⚡" title="Продуктивность" desc="Фокус, задачи, цели" gradient="from-yellow-500/10 to-yellow-600/5" border="border-yellow-500/10" />
          <FeatureCard emoji="🔄" title="Привычки" desc="Streaks, ежедневные" gradient="from-pink-500/10 to-pink-600/5" border="border-pink-500/10" />
          <FeatureCard emoji="🧠" title="Ментальное" desc="Настроение, энергия" gradient="from-indigo-500/10 to-indigo-600/5" border="border-indigo-500/10" />
          <FeatureCard emoji="🌿" title="Духовное" desc="Благодарность, смысл" gradient="from-emerald-500/10 to-emerald-600/5" border="border-emerald-500/10" />
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="relative z-10 px-6 py-20 max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Как это работает
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            От первого запуска до ощутимых результатов
          </p>
        </div>
        
        <div className="space-y-3">
          <Step number="01" title="Онбординг" desc="Отвечаешь на 50+ вопросов о своей жизни — сон, спорт, питание, привычки, цели" />
          <Step number="02" title="AI Анализ" desc="Искусственный интеллект строит персональный план развития под тебя" />
          <Step number="03" title="Ежедневный трекинг" desc="Быстрый ввод данных через бота или мини-приложение — занимает 2 минуты" />
          <Step number="04" title="Умные рекомендации" desc="AI-коуч анализирует паттерны и даёт конкретные советы для роста" />
          <Step number="05" title="Видимый прогресс" desc="Графики, стрики, достижения — видишь как улучшается качество жизни" />
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 py-24 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl p-10 md:p-14 border border-gray-700/30 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#5641FF]/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl" />
            
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                Готов стать лучше?
              </h2>
              <p className="text-gray-400 mb-8">
                Присоединяйся к LifeOS и начни путь к лучшей версии себя
              </p>
              <a 
                href="https://t.me/Life0Sbot"
                className="group inline-flex items-center gap-2 bg-[#5641FF] text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:bg-[#3528cc] hover:shadow-xl hover:shadow-purple-500/20 active:scale-95"
              >
                🚀 Старт в Telegram
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-10 border-t border-gray-800/50">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-[#5641FF] to-[#764ba2] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">L</span>
            </div>
            <span className="text-gray-400 text-sm">LifeOS © 2024-2026</span>
          </div>
          <div className="flex gap-6 text-gray-500 text-sm">
            <Link href="/dash" className="hover:text-white transition-colors">Dashboard</Link>
            <Link href="/onb" className="hover:text-white transition-colors">Онбординг</Link>
            <a href="https://t.me/Life0Sbot" className="hover:text-white transition-colors">Telegram</a>
          </div>
        </div>
      </footer>
    </main>
  )
}

function FeatureCard({ emoji, title, desc, gradient, border }: { emoji: string; title: string; desc: string; gradient: string; border: string }) {
  return (
    <div className={`group bg-gradient-to-br ${gradient} rounded-xl p-5 border ${border} hover:border-opacity-50 transition-all duration-300 hover:scale-[1.02] cursor-default`}>
      <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{emoji}</div>
      <div className="text-white font-semibold text-sm">{title}</div>
      <div className="text-gray-400 text-xs mt-0.5">{desc}</div>
    </div>
  )
}

function Step({ number, title, desc }: { number: string; title: string; desc: string }) {
  return (
    <div className="group flex items-start gap-5 p-5 bg-gray-800/30 backdrop-blur rounded-xl border border-gray-700/20 hover:border-[#5641FF]/20 hover:bg-gray-800/50 transition-all duration-300">
      <div className="w-10 h-10 bg-[#5641FF]/10 border border-[#5641FF]/20 rounded-xl flex items-center justify-center text-[#5641FF] font-bold text-sm flex-shrink-0 group-hover:bg-[#5641FF]/20 transition-colors">
        {number}
      </div>
      <div>
        <div className="text-white font-semibold">{title}</div>
        <div className="text-gray-400 text-sm mt-0.5">{desc}</div>
      </div>
    </div>
  )
}