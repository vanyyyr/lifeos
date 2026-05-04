import Link from 'next/link'
import { Bot } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="p-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#5641FF] rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">L</span>
          </div>
          <span className="text-white font-bold text-xl">LifeOS</span>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 py-20 text-center">
        <h1 className="text-5xl font-bold text-white mb-4">
          Твой персональный
          <br />
          <span className="text-[#5641FF]">AI-ассистент</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
          Трекинг сна, спорта, питания, саморазвития и не только. 
          Умные рекомендации для твоего роста.
        </p>
        
        <div className="flex gap-4 justify-center flex-wrap">
          <a 
            href="https://t.me/Life0Sbot"
            className="btn-primary inline-flex items-center gap-2"
          >
            <Bot size={20} />
            Запустить бота
          </a>
          <Link href="/onb" className="btn-secondary inline-flex items-center gap-2">
            Начать онбординг
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Что трекаем
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <FeatureCard emoji="💤" title="Сон" desc="Время, качество, циклы" />
          <FeatureCard emoji="🏋️" title="Спорт" desc="Тренировки, прогресс" />
          <FeatureCard emoji="🥗" title="Питание" desc="КБЖУ, вода, приёмы" />
          <FeatureCard emoji="📚" title="Саморазвитие" desc="Чтение, курсы, навыки" />
          <FeatureCard emoji="⚡" title="Продуктивность" desc="Фокус, задачи" />
          <FeatureCard emoji="🔄" title="Привычки" desc="Streaks, цели" />
          <FeatureCard emoji="🧠" title="Ментальное" desc="Настроение, энергия" />
          <FeatureCard emoji="🌿" title="Духовное" desc="Благодарность, смысл" />
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-16 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Как это работает
        </h2>
        
        <div className="space-y-4">
          <Step number="1" title="Онбординг" desc="Отвечаешь на 50+ вопросов о своей жизни" />
          <Step number="2" title="AI Анализ" desc="ИИ строит персональный план развития" />
          <Step number="3" title="Трекинг" desc="Ежедневный ввод данных через бота" />
          <Step number="4" title="Рекомендации" desc="AI даёт умные советы и мотивирует" />
          <Step number="5" title="Рост" desc="Видишь прогресс и улучшаешь жизнь" />
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-white mb-6">
          Готов стать лучше?
        </h2>
        <a 
          href="https://t.me/Life0Sbot"
          className="btn-primary inline-flex items-center gap-2 text-lg"
        >
          🚀 Старт в Telegram
        </a>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 text-center text-gray-500">
        <p>© 2024 LifeOS. Твой персональный AI-ассистент.</p>
      </footer>
    </main>
  )
}

function FeatureCard({ emoji, title, desc }: { emoji: string; title: string; desc: string }) {
  return (
    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 hover:border-[#5641FF] transition-colors">
      <div className="text-3xl mb-2">{emoji}</div>
      <div className="text-white font-semibold">{title}</div>
      <div className="text-gray-400 text-sm">{desc}</div>
    </div>
  )
}

function Step({ number, title, desc }: { number: string; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
      <div className="w-8 h-8 bg-[#5641FF] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
        {number}
      </div>
      <div>
        <div className="text-white font-semibold">{title}</div>
        <div className="text-gray-400 text-sm">{desc}</div>
      </div>
    </div>
  )
}