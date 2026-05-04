'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, ArrowLeft, Check, Bot } from 'lucide-react'

// Onboarding questions by category
const questions = {
  general: [
    { key: 'name', label: 'Как тебя зовут?', type: 'text', required: true },
    { key: 'age', label: 'Сколько тебе лет?', type: 'number', required: true },
    { key: 'gender', label: 'Пол', type: 'select', options: ['Мужской', 'Женский', 'Другое'], required: true },
    { key: 'occupation', label: 'Чем занимаешься?', type: 'text', required: false },
    { key: 'city', label: 'Город?', type: 'text', required: false },
  ],
  sleep: [
    { key: 'sleep_time', label: 'Во сколько ложишься спать?', type: 'time', required: true },
    { key: 'wake_time', label: 'Во сколько просыпаешься?', type: 'time', required: true },
    { key: 'avg_sleep_hours', label: 'Сколько часов спишь в среднем?', type: 'number', required: true },
    { key: 'sleep_quality', label: 'Оцени качество сна (1-10)', type: 'slider', min: 1, max: 10, required: true },
    { key: 'sleep_issues', label: 'Есть проблемы со сном?', type: 'select', options: ['Нет', 'Да, трудно заснуть', 'Да, просыпаюсь ночью', 'Да, рано просыпаюсь'], required: false },
    { key: 'before_sleep', label: 'Что делаешь перед сном?', type: 'multi', options: ['Экран (phone/TV)', 'Чтение', 'Медитация', 'Ничего'], required: true },
  ],
  sport: [
    { key: 'sport_frequency', label: 'Сколько раз в неделю тренируешься?', type: 'number', required: true },
    { key: 'sport_type', label: 'Какой спорт?', type: 'multi', options: ['Бег', 'Тренажёрный зал', 'Йога', 'Плавание', 'Велосипед', 'Командный спорт'], required: true },
    { key: 'sport_duration', label: 'Средняя длительность тренировки (минут)', type: 'number', required: true },
    { key: 'sport_intensity', label: 'Интенсивность (1-10)', type: 'slider', min: 1, max: 10, required: true },
    { key: 'has_injury', label: 'Есть травмы/боли?', type: 'select', options: ['Нет', 'Спина', 'Колени', 'Плечи', 'Другое'], required: false },
    { key: 'sport_goal', label: 'Какая спортивная цель?', type: 'text', required: false },
  ],
  nutrition: [
    { key: 'meals_per_day', label: 'Сколько приёмов пищи в день?', type: 'number', required: true },
    { key: 'last_meal_time', label: 'Во сколько последний приём?', type: 'time', required: true },
    { key: 'water_intake', label: 'Сколько воды пьёшь (литров)?', type: 'number', required: true },
    { key: 'coffee_cups', label: 'Сколько кофе в день?', type: 'number', required: true },
    { key: 'has_sweet_tooth', label: 'Ешь сладкое?', type: 'select', options: ['Редко', 'Иногда', 'Часто', 'Постоянно'], required: true },
    { key: 'diet_restrictions', label: 'Есть диета/ограничения?', type: 'text', required: false },
    { key: 'nutrition_goal', label: 'Какая цель в питании?', type: 'text', required: false },
  ],
  habits: [
    { key: 'early_riser', label: 'Встаёшь до 7:00?', type: 'select', options: ['Да', 'Нет', 'Иногда'], required: true },
    { key: 'cold_shower', label: 'Принимаешь холодный душ?', type: 'select', options: ['Да', 'Нет', 'Иногда'], required: true },
    { key: 'meditation', label: 'Медитируешь?', type: 'select', options: ['Да', 'Нет', 'Хочу начать'], required: true },
    { key: 'reading', label: 'Читаешь перед сном?', type: 'select', options: ['Да', 'Нет', 'Иногда'], required: true },
    { key: 'main_habit_goal', label: 'Главная привычка которую хочешь выработать?', type: 'text', required: true },
  ],
  productivity: [
    { key: 'work_hours', label: 'Сколько часов работаешь в день?', type: 'number', required: true },
    { key: 'has_schedule', label: 'Есть распорядок дня?', type: 'select', options: ['Да', 'Нет', 'Частично'], required: true },
    { key: 'uses_pomodoro', label: 'Используешь Pomodoro?', type: 'select', options: ['Да', 'Нет', 'Пробовал'], required: false },
    { key: 'procrastinates', label: 'Прокрастинируешь?', type: 'select', options: ['Редко', 'Иногда', 'Часто'], required: true },
    { key: 'distraction', label: 'Что отвлекает больше всего?', type: 'text', required: false },
    { key: 'monthly_achievement', label: 'Главное достижение за месяц?', type: 'text', required: false },
  ],
  development: [
    { key: 'reads_per_week', label: 'Сколько страниц читаешь в неделю?', type: 'number', required: true },
    { key: 'takes_courses', label: 'Проходишь курсы?', type: 'select', options: ['Да', 'Нет', 'Хочу начать'], required: true },
    { key: 'learns_language', label: 'Изучаешь язык?', type: 'select', options: ['Да', 'Нет', 'Хочу начать'], required: true },
    { key: 'language', label: 'Какой язык?', type: 'text', required: false },
    { key: 'listens_podcasts', label: 'Слушаешь подкасты?', type: 'select', options: ['Да', 'Нет', 'Иногда'], required: true },
    { key: 'new_skill', label: 'Какой новый навык освоил за год?', type: 'text', required: false },
  ],
  mental: [
    { key: 'mood_avg', label: 'Среднее настроение (1-10)', type: 'slider', min: 1, max: 10, required: true },
    { key: 'energy_avg', label: 'Уровень энергии (1-10)', type: 'slider', min: 1, max: 10, required: true },
    { key: 'stress_level', label: 'Уровень стресса (1-10)', type: 'slider', min: 1, max: 10, required: true },
    { key: 'has_anxiety', label: 'Бывает тревога?', type: 'select', options: ['Редко', 'Иногда', 'Часто'], required: true },
    { key: 'mental_goal', label: 'Что хочешь улучшить в ментальном плане?', type: 'text', required: false },
  ],
  spiritual: [
    { key: 'has_faith', label: 'Есть вера/религия?', type: 'select', options: ['Да', 'Нет', 'Не определился'], required: true },
    { key: 'practices_gratitude', label: 'Практикуешь благодарность?', type: 'select', options: ['Да', 'Нет', 'Хочу начать'], required: true },
    { key: 'time_nature', label: 'Сколько раз в неделю на природе?', type: 'number', required: true },
    { key: 'calls_family', label: 'Как часто звонишь близким?', type: 'select', options: ['Ежедневно', 'Раз в неделю', 'Реже', 'Редко'], required: true },
    { key: 'has_purpose', label: 'Есть ощущение смысла жизни?', type: 'select', options: ['Да', 'Не уверен', 'Нет'], required: true },
  ],
  goals: [
    { key: 'goal_1year', label: 'Главная цель на год?', type: 'text', required: true },
    { key: 'goal_3years', label: 'Главная цель на 3 года?', type: 'text', required: false },
    { key: 'success_definition', label: 'Что для теб�� ус��ех?', type: 'text', required: true },
  ],
  notifications: [
    { key: 'notify_morning', label: 'Утреннее напоминание (07:00)?', type: 'checkbox', default: true },
    { key: 'notify_water', label: 'Напоминание пить воду?', type: 'checkbox', default: true },
    { key: 'notify_exercise', label: 'Напоминание тренировки?', type: 'checkbox', default: true },
    { key: 'notify_evening', label: 'Вечернее напоминание (21:00)?', type: 'checkbox', default: true },
    { key: 'notify_review', label: 'Еженедельный обзор?', type: 'checkbox', default: true },
  ],
}

type CategoryKey = keyof typeof questions

const categoryOrder: CategoryKey[] = [
  'general', 'sleep', 'sport', 'nutrition', 'habits', 
  'productivity', 'development', 'mental', 'spiritual', 'goals', 'notifications'
]

const categoryNames: Record<CategoryKey, string> = {
  general: '📋 Общее',
  sleep: '💤 Сон',
  sport: '🏋️ Спорт',
  nutrition: '🥗 Питание',
  habits: '🔄 Привычки',
  productivity: '⚡ Продуктивность',
  development: '📚 Саморазвитие',
  mental: '🧠 Ментальное',
  spiritual: '🌿 Духовное',
  goals: '🎯 Цели',
  notifications: '🔔 Уведомления',
}

export default function OnboardingPage() {
  const router = useRouter()
  const [currentCategory, setCurrentCategory] = useState<number>(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const category = categoryOrder[currentCategory]
  const categoryQuestions = questions[category] || []
  const progress = ((currentCategory + 1) / categoryOrder.length) * 100

  const handleAnswer = (key: string, value: any) => {
    setAnswers(prev => ({ ...prev, [key]: value }))
  }

  const isCategoryComplete = () => {
    return categoryQuestions.every(q => {
      if (!(q as any).required) return true
      const value = answers[q.key]
      return value !== undefined && value !== '' && value !== null
    })
  }

  const nextCategory = () => {
    if (currentCategory < categoryOrder.length - 1) {
      setCurrentCategory(prev => prev + 1)
    }
  }

  const prevCategory = () => {
    if (currentCategory > 0) {
      setCurrentCategory(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      // Save to API
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers)
      })
      
      if (response.ok) {
        router.push('/onb/success')
      } else {
        alert('Ошибка сохранения. Попробуй ещё раз.')
      }
    } catch (error) {
      console.error(error)
      alert('Что-то пошло не так. Попробуй ещё раз.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isLastCategory = currentCategory === categoryOrder.length - 1
  const isFirstCategory = currentCategory === 0

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="p-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#5641FF] rounded-lg flex items-center justify-center">
            <span className="font-bold">L</span>
          </div>
          <span className="font-bold">LifeOS</span>
        </div>
        <div className="text-gray-400 text-sm">
          Шаг {currentCategory + 1} из {categoryOrder.length}
        </div>
      </header>

      {/* Progress */}
      <div className="h-1 bg-gray-800">
        <div 
          className="h-full bg-[#5641FF] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Category Title */}
      <div className="px-6 py-8">
        <h2 className="text-2xl font-bold text-center">
          {categoryNames[category]}
        </h2>
      </div>

      {/* Questions */}
      <div className="px-6 max-w-xl mx-auto space-y-6">
        {categoryQuestions.map((question) => (
          <div key={question.key} className="space-y-2">
            <label className="block text-gray-300 font-medium">
              {question.label}
              {question.required && <span className="text-[#5641FF]"> *</span>}
            </label>
            
            {question.type === 'text' && (
              <input
                type="text"
                value={answers[question.key] || ''}
                onChange={(e) => handleAnswer(question.key, e.target.value)}
                className="input-field"
                placeholder="Введи ответ..."
              />
            )}
            
            {question.type === 'number' && (
              <input
                type="number"
                value={answers[question.key] || ''}
                onChange={(e) => handleAnswer(question.key, parseInt(e.target.value))}
                className="input-field"
                placeholder="Введи число..."
              />
            )}
            
            {question.type === 'time' && (
              <input
                type="time"
                value={answers[question.key] || ''}
                onChange={(e) => handleAnswer(question.key, e.target.value)}
                className="input-field"
              />
            )}
            
            {question.type === 'slider' && (
              <div className="space-y-2">
                <input
                  type="range"
                  min={question.min || 1}
                  max={question.max || 10}
                  value={answers[question.key] || question.min || 1}
                  onChange={(e) => handleAnswer(question.key, parseInt(e.target.value))}
                  className="w-full accent-[#5641FF]"
                />
                <div className="text-center text-[#5641FF] font-bold">
                  {answers[question.key] || question.min || 1}
                </div>
              </div>
            )}
            
            {question.type === 'select' && (
              <div className="grid grid-cols-2 gap-2">
                {question.options?.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleAnswer(question.key, option)}
                    className={`p-3 rounded-lg border transition-all ${
                      answers[question.key] === option
                        ? 'border-[#5641FF] bg-[#5641FF]/20 text-white'
                        : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
            
            {question.type === 'multi' && (
              <div className="space-y-2">
                {question.options?.map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg border border-gray-700 cursor-pointer hover:border-gray-600"
                  >
                    <input
                      type="checkbox"
                      checked={(answers[question.key] || []).includes(option)}
                      onChange={(e) => {
                        const current = answers[question.key] || []
                        if (e.target.checked) {
                          handleAnswer(question.key, [...current, option])
                        } else {
                          handleAnswer(question.key, current.filter((o: string) => o !== option))
                        }
                      }}
                      className="w-5 h-5 accent-[#5641FF]"
                    />
                    <span className="text-gray-300">{option}</span>
                  </label>
                ))}
              </div>
            )}
            
            {question.type === 'checkbox' && (
              <label className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg border border-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={answers[question.key] ?? question.default ?? false}
                  onChange={(e) => handleAnswer(question.key, e.target.checked)}
                  className="w-5 h-5 accent-[#5641FF]"
                />
                <span className="text-gray-300">Включено</span>
              </label>
            )}
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="px-6 py-8 max-w-xl mx-auto flex justify-between">
        <button
          onClick={prevCategory}
          disabled={isFirstCategory}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg ${
            isFirstCategory 
              ? 'text-gray-600 cursor-not-allowed' 
              : 'text-gray-300 hover:text-white'
          }`}
        >
          <ArrowLeft size={20} />
          Назад
        </button>
        
        {isLastCategory ? (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="btn-primary flex items-center gap-2"
          >
            {isSubmitting ? (
              <>Сохранение...</>
            ) : (
              <>
                <Check size={20} />
                Завершить
              </>
            )}
          </button>
        ) : (
          <button
            onClick={nextCategory}
            disabled={!isCategoryComplete()}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold ${
              isCategoryComplete()
                ? 'bg-[#5641FF] text-white hover:bg-[#3528cc]'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            Далее
            <ArrowRight size={20} />
          </button>
        )}
      </div>
    </main>
  )
}