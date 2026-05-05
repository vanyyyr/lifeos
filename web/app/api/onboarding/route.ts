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
    const telegramId = request.headers.get('x-telegram-id') || body.telegram_id || '0'
    
    // Check if user exists
    let { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('telegram_id', telegramId)
      .maybeSingle()
    
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
    // We map the safe fields that exist in all schema versions.
    // To ensure 100% of the answers are saved for AI analysis without needing a manual DB schema update,
    // we store the complete unadulterated form data into the `habits` JSONB column which exists in the schema.
    const safeFields = ['age', 'sleep_time', 'wake_time', 'sport_type', 'water_intake', 'gender', 'city', 'occupation']
    const profilePayload: any = {
      user_id: userId,
      updated_at: new Date().toISOString(),
      habits: body // <--- Safely store ALL data here for AI to read
    }
    
    safeFields.forEach(field => {
      if (body[field] !== undefined) {
        profilePayload[field] = body[field]
      }
    })

    const { error: profileError } = await supabase
      .from('user_profiles')
      .upsert(profilePayload)
    
    if (profileError) {
      console.error('Profile upsert error (non-fatal):', profileError.message)
      // We don't throw here to ensure onboarding can complete
    }
    
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
      .maybeSingle()
    
    if (!user) {
      return NextResponse.json({ exists: false })
    }
    
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()
    
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