import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const botToken = process.env.TELEGRAM_BOT_TOKEN || ''
const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_ANON_KEY || ''
// We keep reading XIAOMI_API_KEY since it's already in Vercel, but we treat it as a generic OpenAI-compatible key
const AI_API_KEY = process.env.XIAOMI_API_KEY || ''
const AI_BASE_URL = process.env.AI_BASE_URL || 'https://api.xiaomimimo.com/v1'
const AI_MODEL = process.env.AI_MODEL || 'mimo-v2.5'

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

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
    
    // Get or create user (only if DB connected)
    let user = null
    if (supabase) {
      const { data } = await supabase
        .from('users')
        .select('id, name')
        .eq('telegram_id', chatId)
        .single()
      user = data
      
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
        responseText = `📱 <b>LifeOS Mini App</b>\n\nhttps://lifeos-khaki-one.vercel.app/dash`
        replyMarkup = {
          inline_keyboard: [
            [{ text: '🚀 Открыть LifeOS', web_app: { url: 'https://lifeos-khaki-one.vercel.app/dash' } }],
            [{ text: '📋 Онбординг', web_app: { url: 'https://lifeos-khaki-one.vercel.app/onb' } }]
          ]
        }
        break
        
      case '/coach':
        responseText = `🤖 <b>AI Коуч</b>\n\nРасскажи, как дела? Или задай вопрос о жизни, тренировках, питании...\n\n<i>Напиши мне что угодно!</i>`
        break
        
      default:
        // Attempt AI response if text is present
        if (text.trim() && AI_API_KEY) {
          try {
            const aiRes = await fetch(`${AI_BASE_URL}/chat/completions`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AI_API_KEY}`
              },
              body: JSON.stringify({
                model: AI_MODEL,
                messages: [
                  { role: 'system', content: 'Ты LifeOS, AI-коуч. Отвечай кратко, мотивирующе, на русском, используя эмодзи.' },
                  { role: 'user', content: text }
                ],
                temperature: 0.7,
                max_tokens: 500
              })
            })
            if (aiRes.ok) {
              const aiData = await aiRes.json()
              responseText = aiData.choices?.[0]?.message?.content || 'Извини, не удалось сформулировать ответ.'
            } else {
              const errText = await aiRes.text()
              responseText = `Привет, ${name}! 👋\nURL: ${AI_BASE_URL}\nОшибка ${aiRes.status}: ${errText}`
            }
          } catch (e: any) {
            responseText = `Привет, ${name}! 👋\nСетевая ошибка при обращении к AI: ${e.message}`
          }
        } else {
          responseText = `Привет, ${name}! 👋\nЯ получил: ${text}\n\nAI ключ не настроен. Напиши /help`
        }
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