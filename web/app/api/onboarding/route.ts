import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_ANON_KEY || ''
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

export async function POST(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }
  try {
    const body = await request.json()
    
    // Get telegram_id from headers or body (for bot integration)
    const telegramId = request.headers.get('x-telegram-id') || body.telegram_id || 'web-user-default'
    
    // Check if user exists
    let { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('telegram_id', telegramId)
      .single()
    
    let userId
    
    if (user) {
      userId = user.id
    } else {
      // Create new user
      const { data: newUser, error } = await supabase
        .from('users')
        .insert({
          telegram_id: telegramId,
          name: body.name || 'User',
          onboarding_completed: true
        })
        .select('id')
        .single()
      
      if (error) throw error
      userId = newUser.id
    }
    
    // Save profile data
    const { error: profileError } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: userId,
        ...body,
        updated_at: new Date().toISOString()
      })
    
    if (profileError) throw profileError
    
    // Update user as completed
    await supabase
      .from('users')
      .update({ onboarding_completed: true })
      .eq('id', userId)
    
    return NextResponse.json({ success: true, user_id: userId })
  } catch (error: any) {
    console.error('Onboarding error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }
  const telegramId = request.headers.get('x-telegram-id')
  
  if (!telegramId) {
    return NextResponse.json({ error: 'Telegram ID required' }, { status: 400 })
  }
  
  try {
    const { data: user } = await supabase
      .from('users')
      .select('id, name, onboarding_completed')
      .eq('telegram_id', telegramId)
      .single()
    
    if (!user) {
      return NextResponse.json({ exists: false })
    }
    
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()
    
    return NextResponse.json({ 
      exists: true, 
      user: user,
      profile: profile 
    })
  } catch (error: any) {
    console.error('Get profile error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}