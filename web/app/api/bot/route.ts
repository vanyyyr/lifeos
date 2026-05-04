import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const botToken = process.env.TELEGRAM_BOT_TOKEN || '8606509963:AAHQCdY4_v9RvBCUug_oiB7_lpj1cL_3EnQ'
const supabaseUrl = process.env.SUPABASE_URL || 'https://liupfnbqncxzdvvqzmrb.supabase.co'
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_QcVLms3FBecYD7hZtNJBSg_eteR1hSh'

const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
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
    
    let responseText = ''
    let replyMarkup = undefined
    
    switch (text) {
      case '/start':
        responseText = `🎉 <b>Добро пожаловать в LifeOS!</b>\n\nПривет, ${name}!\nЯ твой персональный AI-ассистент.\n\nНачни с /help`
        break
        
      case '/help':
        responseText = `<b>Команды:</b>\n/start - Начать\n/menu - Меню\n/status - Статус\n/stats - Статистика\n/app - Mini App\n/coach - AI Коуч`
        break
        
      case '/menu':
        responseText = `📋 <b>Меню</b>`
        replyMarkup = {
          keyboard: [
            [{ text: "📊 Статус" }, { text: "📈 Статистика" }],
            [{ text: "💪 Тренировка" }, { text: "🥗 Питание" }]
          ],
          resize_keyboard: true
        }
        break
        
      case '/app':
        responseText = `📱 <b>LifeOS Mini App</b>\n\nhttps://lifeos-khaki-one.vercel.app/onb`
        break
        
      default:
        responseText = `Привет, ${name}! 👋\nЯ получил: ${text}\n\nНапиши /help`
    }
    
    // Send to Telegram
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
  return NextResponse.json({ message: 'LifeOS Bot running!' })
}