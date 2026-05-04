-- LifeOS Database Schema for Supabase

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    telegram_id BIGINT UNIQUE NOT NULL,
    name VARCHAR(255),
    username VARCHAR(255),
    language VARCHAR(10) DEFAULT 'ru',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_premium BOOLEAN DEFAULT FALSE,
    onboarding_completed BOOLEAN DEFAULT FALSE
);

-- User profile data (from onboarding)
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- General
    age INTEGER,
    gender VARCHAR(20),
    country VARCHAR(100),
    city VARCHAR(100),
    occupation VARCHAR(255),
    family_status VARCHAR(50),
    
    -- Sleep
    sleep_time TIME,
    wake_time TIME,
    avg_sleep_hours DECIMAL(3,1),
    sleep_quality INTEGER CHECK (sleep_quality BETWEEN 1 AND 10),
    sleep_quality_notes TEXT,
    
    -- Sport
    sport_frequency INTEGER,
    sport_type VARCHAR(100),
    sport_duration INTEGER,
    sport_intensity INTEGER CHECK (sport_intensity BETWEEN 1 AND 10),
    sport_injury TEXT,
    sport_goal TEXT,
    
    -- Nutrition
    meals_per_day INTEGER,
    last_meal_time TIME,
    water_intake DECIMAL(4,1),
    coffee_cups INTEGER,
    has_sweet_tooth BOOLEAN,
    diet_restrictions TEXT,
    nutrition_goal TEXT,
    
    -- Habits
    habits JSONB,
    main_habit_goal TEXT,
    hardest_habit TEXT,
    
    -- Productivity
    work_hours_per_day INTEGER,
    has_schedule BOOLEAN,
    pomodoro_use BOOLEAN,
    monthly_achievement TEXT,
    tasks_per_day INTEGER,
    procrastinates BOOLEAN,
    distraction_source TEXT,
    
    -- Self-development
    reads_pages_per_week INTEGER,
    takes_courses BOOLEAN,
    course_names TEXT,
    learns_language BOOLEAN,
    language_name VARCHAR(50),
    language_level VARCHAR(20),
    listens_podcasts BOOLEAN,
    new_skill TEXT,
    development_hours_per_week INTEGER,
    development_goal TEXT,
    
    -- Mental
    mood_avg INTEGER CHECK (mood_avg BETWEEN 1 AND 10),
    energy_avg INTEGER CHECK (energy_avg BETWEEN 1 AND 10),
    stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 10),
    anxiety_level INTEGER CHECK (anxiety_level BETWEEN 1 AND 10),
    has_burnout BOOLEAN,
    mental_goal TEXT,
    
    -- Spiritual
    has_faith BOOLEAN,
    practices_gratitude BOOLEAN,
    practices_meditation BOOLEAN,
    time_in_nature INTEGER,
    calls_family BOOLEAN,
    has_life_purpose BOOLEAN,
    spiritual_goal TEXT,
    
    -- Goals
    main_goal_1year TEXT,
    main_goal_3years TEXT,
    main_goal_10years TEXT,
    success_definition TEXT,
    
    -- Daily rhythm
    wake_up_time TIME,
    first_meal_time TIME,
    lunch_time TIME,
    dinner_time TIME,
    sleep_prep_time TIME,
    free_hours_per_day INTEGER,
    hobby_hours_per_day INTEGER,
    family_hours_per_day INTEGER,
    screen_time_hours DECIMAL(4,1),
    
    -- Notification settings
    notify_morning BOOLEAN DEFAULT TRUE,
    notify_afternoon BOOLEAN DEFAULT TRUE,
    notify_evening BOOLEAN DEFAULT TRUE,
    notify_water BOOLEAN DEFAULT TRUE,
    notify_exercise BOOLEAN DEFAULT TRUE,
    
    -- AI settings
    ai_style VARCHAR(50) DEFAULT 'supportive',
    ai_tone VARCHAR(50) DEFAULT 'motivator',
    ai_check_frequency VARCHAR(50) DEFAULT 'twice_daily',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sleep logs
CREATE TABLE IF NOT EXISTS sleep_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    sleep_time TIMESTAMP WITH TIME ZONE NOT NULL,
    wake_time TIMESTAMP WITH TIME ZONE,
    quality INTEGER CHECK (quality BETWEEN 1 AND 10),
    notes TEXT,
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workout logs
CREATE TABLE IF NOT EXISTS workout_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    workout_type VARCHAR(100) NOT NULL,
    duration_minutes INTEGER,
    intensity INTEGER CHECK (intensity BETWEEN 1 AND 10),
    feeling VARCHAR(50),
    notes TEXT,
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Nutrition logs
CREATE TABLE IF NOT EXISTS nutrition_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    meal_type VARCHAR(50) NOT NULL,
    calories INTEGER,
    proteins DECIMAL(6,1),
    fats DECIMAL(6,1),
    carbs DECIMAL(6,1),
    water DECIMAL(4,1),
    coffee BOOLEAN DEFAULT FALSE,
    alcohol BOOLEAN DEFAULT FALSE,
    sweet BOOLEAN DEFAULT FALSE,
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Development logs
CREATE TABLE IF NOT EXISTS development_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    activity_type VARCHAR(100) NOT NULL,
    duration_minutes INTEGER,
    pages_read INTEGER,
    notes TEXT,
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Productivity logs
CREATE TABLE IF NOT EXISTS productivity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    focus_minutes INTEGER,
    tasks_completed INTEGER,
    main_achievement TEXT,
    procrastinated BOOLEAN DEFAULT FALSE,
    notes TEXT,
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habits
CREATE TABLE IF NOT EXISTS habits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    target_time TIME,
    streak INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habit logs
CREATE TABLE IF NOT EXISTS habit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    habit_id UUID REFERENCES habits(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT FALSE,
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mental logs
CREATE TABLE IF NOT EXISTS mental_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    mood INTEGER CHECK (mood BETWEEN 1 AND 10),
    energy INTEGER CHECK (energy BETWEEN 1 AND 10),
    stress INTEGER CHECK (stress BETWEEN 1 AND 10),
    anxiety INTEGER CHECK (anxiety BETWEEN 1 AND 10),
    motivation INTEGER CHECK (motivation BETWEEN 1 AND 10),
    notes TEXT,
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily status
CREATE TABLE IF NOT EXISTS daily_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date DATE DEFAULT CURRENT_DATE,
    
    sleep_score INTEGER,
    workout_score INTEGER,
    nutrition_score INTEGER,
    development_score INTEGER,
    productivity_score INTEGER,
    mental_score INTEGER,
    overall_score INTEGER,
    
    completed_habits JSONB,
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, date)
);

-- Reminders/Notifications
CREATE TABLE IF NOT EXISTS reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reminder_type VARCHAR(100) NOT NULL,
    message TEXT,
    scheduled_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    days_of_week INTEGER[] DEFAULT ARRAY[1,2,3,4,5,6,7],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Chat history
CREATE TABLE IF NOT EXISTS ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    tokens INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE development_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE productivity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE mental_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (telegram_id = auth.uid());
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (telegram_id = auth.uid());
-- Note: For bot access, we'll use service role key

-- Indexes for performance
CREATE INDEX idx_sleep_logs_user_date ON sleep_logs(user_id, date);
CREATE INDEX idx_workout_logs_user_date ON workout_logs(user_id, date);
CREATE INDEX idx_nutrition_logs_user_date ON nutrition_logs(user_id, date);
CREATE INDEX idx_daily_status_user_date ON daily_status(user_id, date);
CREATE INDEX idx_mental_logs_user_date ON mental_logs(user_id, date);
CREATE INDEX idx_habit_logs_user_date ON habit_logs(user_id, date);