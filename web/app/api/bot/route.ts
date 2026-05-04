import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const botToken = process.env.TELEGRAM_BOT_TOKEN
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Telegram update
    const message = body.message
    if (!message) {
      return NextResponse.json({ ok: true })
    }
    
    const chatId = message.chat.id
    const text = message.text || ''
    const name = message.from?.first_name || 'друг'
    
    // Get or create user
    let { data: user } = await supabase
      .from('users')
      .select('id, name')
      .eq('telegram_id', chatId)
      .single()
    
    if (!user) {
      const { data: newUser } = await supabase
        .from('users')
        .insert({
          telegram_id: chatId,
          name: name,
          username: message.from?.username
        })
        .select()
        .single()
      user = newUser
    }
    
    // Process commands
    let responseText = ''
    let replyMarkup = undefined
    
    switch (text) {
      case '/start':
        responseText = `🎉 <b>Добро пожаловать в LifeOS!</b>\n\n` +
          `Привет, ${name}!\n\n` +
          `Я твой персональный AI-ассистент.\n\n` +
          `Начни с /help для списка команд.`
        break
        
      case '/help':
        responseText = `<b>LifeOS - Команды</b>\n\n` +
          `<b>Основные:</b>\n` +
          `/start - Начать\n` +
          `/menu - Главное меню\n` +
          `/status - Статус дня\n` +
          `/stats - Статистика\n` +
          `/coach - AI Коуч\n\n` +
          `<b>Mini App:</b>\n` +
          `/app - Открыть приложение`
        break
        
      case '/menu':
        responseText = `📋 <b>Главное меню</b>`
        replyMarkup = {
          keyboard: [
            [{ text: "📊 Статус" }, { text: "📈 Статистика" }],
            [{ text: "💪 Тренировка" }, { text: "🥗 Питание" }],
            [{ text: "🤖 AI Коуч" }]
          ],
          resize_keyboard: true
        }
        break
        
      case '/status':
        const { data: status } = await supabase
          .from('daily_status')
          .select('*')
          .eq('user_id', user?.id)
          .eq('date', new Date().toISOString().split('T')[0])
          .single()
        
        if (status) {
          responseText = `📊 <b>Статус за сегодня</b>\n\n` +
            `💤 Сон: ${status.sleep_score || '-'}/10\n` +
            `🏋️ Тренировка: ${status.workout_score || '-'}/10\n` +
            `🥗 Питание: ${status.nutrition_score || '-'}/10\n\n` +
            `📈 Общий: <b>${status.overall_score || '-'}/10</b>`
        } else {
          responseText = `📊 Пока нет данных за сегодня.\n\n` +
            `Открой /app для трекинга!`
        }
        break
        
      case '/stats':
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        
        const { data: workouts } = await supabase
          .from('workout_logs')
          .select('id')
          .eq('user_id', user?.id)
          .gte('created_at', weekAgo.toISOString())
        
        responseText = `📈 <b>Статистика за неделю</b>\n\n` +
          `🏋️ Тренировок: ${workouts?.length || 0}`
        break
        
      case '/coach':
        responseText = `🤖 <b>AI Коуч</b>\n\n` +
          `Расскажи, как дела? Задай вопрос.\n\n` +
          `<i>AI скоро будет доступен...</i>`
        break
        
      case '/app':
        responseText = `📱 <b>LifeOS Mini App</b>\n\n` +
          `Открой для детального трекинга:`
        replyMarkup = {
          inline_keyboard: [[{ text: "🚀 Открыть LifeOS", url: "https://lifeos-khaki-one.vercel.app/onb" }]]
        }
        break
        
      case '📊 Статус':
      case '📈 Статистика':
      case '💪 Тренировка':
      case '🥗 Питание':
      case '🤖 AI Коуч':
        responseText = `Функция "${text}" скоро будет!\n\n` +
          `Пока пользуйся /app для полного трекинга.`
        break
        
      default:
        responseText = `Привет, ${name}! 👋\n\n` +
          `Я получил: ${text}\n\n` +
          `Напиши /help для команд.`
    }
    
    // Send response via Telegram API
    if (responseText && botToken) {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: responseText,
          parse_mode: 'HTML',
          reply_markup: replyMarkup
        })
      })
    }
    
    return NextResponse.json({ ok: true })
    
  } catch (error) {
    console.error('Bot error:', error)
    return NextResponse.json({ ok: false, error: String(error) })
  }
}

export async function GET() {
  return NextResponse.json({ message: 'LifeOS Bot is running!' })
}