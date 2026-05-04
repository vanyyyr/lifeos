import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_ANON_KEY || ''
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

export async function GET(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }
  const telegramId = request.headers.get('x-telegram-id') || '0'
  
  try {
    // Get user
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('telegram_id', telegramId)
      .maybeSingle()
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    const userId = user.id
    
    // Get today's status
    const { data: todayStatus } = await supabase
      .from('daily_status')
      .select('*')
      .eq('user_id', userId)
      .eq('date', new Date().toISOString().split('T')[0])
      .maybeSingle()
    
    // Get weekly stats
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    
    const [workouts, nutrition, productivity, development] = await Promise.all([
      supabase.from('workout_logs').select('id').eq('user_id', userId).gte('created_at', weekAgo.toISOString()),
      supabase.from('nutrition_logs').select('water').eq('user_id', userId).gte('created_at', weekAgo.toISOString()),
      supabase.from('productivity_logs').select('focus_minutes').eq('user_id', userId).gte('created_at', weekAgo.toISOString()),
      supabase.from('development_logs').select('pages_read').eq('user_id', userId).gte('created_at', weekAgo.toISOString()),
    ])
    
    const weekWorkouts = workouts?.data?.length || 0
    const weekWater = nutrition?.data?.reduce((sum: number, r: any) => sum + (r.water || 0), 0) || 0
    const weekFocus = productivity?.data?.reduce((sum: number, r: any) => sum + (r.focus_minutes || 0), 0) || 0
    const weekPages = development?.data?.reduce((sum: number, r: any) => sum + (r.pages_read || 0), 0) || 0
    
    // Calculate scores by category
    const scores = {
      sleep: todayStatus?.sleep_score || 0,
      sport: todayStatus?.workout_score || 0,
      nutrition: todayStatus?.nutrition_score || 0,
      development: todayStatus?.development_score || 0,
      productivity: todayStatus?.productivity_score || 0,
      mental: todayStatus?.mental_score || 0,
    }
    
    const todayScore = Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length
    
    return NextResponse.json({
      today_score: Math.round(todayScore),
      today: scores,
      week_workouts: weekWorkouts,
      week_water: weekWater,
      week_focus: Math.round(weekFocus / 60 * 10) / 10,
      week_pages: weekPages,
    })
  } catch (error: any) {
    console.error('Stats error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }
  try {
    const body = await request.json()
    const telegramId = request.headers.get('x-telegram-id') || body.telegram_id || '0'
    
    // Get user
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('telegram_id', telegramId)
      .maybeSingle()
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    const userId = user.id
    const today = new Date().toISOString().split('T')[0]
    
    // Update or insert daily status
    const { error } = await supabase
      .from('daily_status')
      .upsert({
        user_id: userId,
        date: today,
        sleep_score: body.sleep,
        workout_score: body.workout,
        nutrition_score: body.nutrition,
        development_score: body.development,
        productivity_score: body.productivity,
        mental_score: body.mental,
        overall_score: body.overall,
        updated_at: new Date().toISOString()
      })
    
    if (error) throw error
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Update stats error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}