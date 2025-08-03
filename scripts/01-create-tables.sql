-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create car_preferences table
CREATE TABLE IF NOT EXISTS public.car_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  budget_min INTEGER NOT NULL,
  budget_max INTEGER NOT NULL,
  fuel_type TEXT NOT NULL CHECK (fuel_type IN ('petrol', 'diesel', 'electric', 'hybrid')),
  car_type TEXT NOT NULL CHECK (car_type IN ('sedan', 'suv', 'hatchback', 'coupe', 'convertible', 'wagon')),
  brand_preference TEXT[],
  mileage_min INTEGER,
  transmission TEXT CHECK (transmission IN ('manual', 'automatic', 'both')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cars table (sample data)
CREATE TABLE IF NOT EXISTS public.cars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  price INTEGER NOT NULL,
  fuel_type TEXT NOT NULL,
  car_type TEXT NOT NULL,
  mileage INTEGER NOT NULL,
  transmission TEXT NOT NULL,
  image_url TEXT,
  features TEXT[],
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create saved_recommendations table
CREATE TABLE IF NOT EXISTS public.saved_recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  car_id UUID REFERENCES public.cars(id) ON DELETE CASCADE NOT NULL,
  preference_id UUID REFERENCES public.car_preferences(id) ON DELETE CASCADE,
  match_score INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, car_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.car_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_recommendations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own preferences" ON public.car_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own preferences" ON public.car_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" ON public.car_preferences
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own preferences" ON public.car_preferences
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view cars" ON public.cars
  FOR SELECT TO authenticated;

CREATE POLICY "Users can view own saved recommendations" ON public.saved_recommendations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own saved recommendations" ON public.saved_recommendations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved recommendations" ON public.saved_recommendations
  FOR DELETE USING (auth.uid() = user_id);
