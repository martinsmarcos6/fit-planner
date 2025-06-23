-- Estrutura completa do banco de dados para o Fit Planner
-- Execute este SQL no SQL Editor do Supabase

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de perfis de usuário
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de treinos
CREATE TABLE IF NOT EXISTS workouts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  emoji TEXT NOT NULL DEFAULT '💪',
  is_public BOOLEAN DEFAULT false,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de dias de treino
CREATE TABLE IF NOT EXISTS workout_days (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  workout_id UUID REFERENCES workouts(id) ON DELETE CASCADE NOT NULL,
  day TEXT NOT NULL,
  division TEXT NOT NULL,
  is_rest_day BOOLEAN DEFAULT false,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de exercícios
CREATE TABLE IF NOT EXISTS exercises (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  workout_day_id UUID REFERENCES workout_days(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  sets INTEGER NOT NULL,
  reps TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de registros de peso
CREATE TABLE IF NOT EXISTS weight_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  weight DECIMAL(5,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de treinos salvos
CREATE TABLE IF NOT EXISTS saved_workouts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  workout_id UUID REFERENCES workouts(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, workout_id)
);

-- Tabela de likes em treinos
CREATE TABLE IF NOT EXISTS workout_likes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  workout_id UUID REFERENCES workouts(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, workout_id)
);

-- View para facilitar o join entre workouts e profiles
CREATE OR REPLACE VIEW workouts_with_profiles AS
SELECT 
  w.*,
  p.username,
  p.name as creator_name,
  p.email as creator_email
FROM workouts w
JOIN profiles p ON w.user_id = p.id;

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_workouts_user_id ON workouts(user_id);
CREATE INDEX IF NOT EXISTS idx_workouts_public ON workouts(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_workout_days_workout_id ON workout_days(workout_id);
CREATE INDEX IF NOT EXISTS idx_exercises_workout_day_id ON exercises(workout_day_id);
CREATE INDEX IF NOT EXISTS idx_weight_records_exercise_id ON weight_records(exercise_id);
CREATE INDEX IF NOT EXISTS idx_weight_records_user_id ON weight_records(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_workouts_user_id ON saved_workouts(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_likes_workout_id ON workout_likes(workout_id);

-- Função para atualizar o timestamp updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at automaticamente
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_workouts_updated_at ON workouts;
CREATE TRIGGER update_workouts_updated_at BEFORE UPDATE ON workouts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para atualizar o contador de likes
CREATE OR REPLACE FUNCTION update_workout_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE workouts SET likes_count = likes_count + 1 WHERE id = NEW.workout_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE workouts SET likes_count = likes_count - 1 WHERE id = OLD.workout_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

-- Trigger para atualizar contador de likes
DROP TRIGGER IF EXISTS update_workout_likes_count_trigger ON workout_likes;
CREATE TRIGGER update_workout_likes_count_trigger
  AFTER INSERT OR DELETE ON workout_likes
  FOR EACH ROW EXECUTE FUNCTION update_workout_likes_count();

-- Políticas de segurança RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_likes ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas para workouts
DROP POLICY IF EXISTS "Users can view their own workouts" ON workouts;
CREATE POLICY "Users can view their own workouts" ON workouts
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view public workouts" ON workouts;
CREATE POLICY "Users can view public workouts" ON workouts
  FOR SELECT USING (is_public = true);

DROP POLICY IF EXISTS "Users can insert their own workouts" ON workouts;
CREATE POLICY "Users can insert their own workouts" ON workouts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own workouts" ON workouts;
CREATE POLICY "Users can update their own workouts" ON workouts
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own workouts" ON workouts;
CREATE POLICY "Users can delete their own workouts" ON workouts
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para workout_days
DROP POLICY IF EXISTS "Users can view workout days of their workouts" ON workout_days;
CREATE POLICY "Users can view workout days of their workouts" ON workout_days
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM workouts 
      WHERE workouts.id = workout_days.workout_id 
      AND workouts.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can view workout days of public workouts" ON workout_days;
CREATE POLICY "Users can view workout days of public workouts" ON workout_days
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM workouts 
      WHERE workouts.id = workout_days.workout_id 
      AND workouts.is_public = true
    )
  );

DROP POLICY IF EXISTS "Users can insert workout days for their workouts" ON workout_days;
CREATE POLICY "Users can insert workout days for their workouts" ON workout_days
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM workouts 
      WHERE workouts.id = workout_days.workout_id 
      AND workouts.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update workout days of their workouts" ON workout_days;
CREATE POLICY "Users can update workout days of their workouts" ON workout_days
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM workouts 
      WHERE workouts.id = workout_days.workout_id 
      AND workouts.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete workout days of their workouts" ON workout_days;
CREATE POLICY "Users can delete workout days of their workouts" ON workout_days
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM workouts 
      WHERE workouts.id = workout_days.workout_id 
      AND workouts.user_id = auth.uid()
    )
  );

-- Políticas para exercises
DROP POLICY IF EXISTS "Users can view exercises of their workouts" ON exercises;
CREATE POLICY "Users can view exercises of their workouts" ON exercises
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM workout_days 
      JOIN workouts ON workouts.id = workout_days.workout_id
      WHERE workout_days.id = exercises.workout_day_id 
      AND workouts.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can view exercises of public workouts" ON exercises;
CREATE POLICY "Users can view exercises of public workouts" ON exercises
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM workout_days 
      JOIN workouts ON workouts.id = workout_days.workout_id
      WHERE workout_days.id = exercises.workout_day_id 
      AND workouts.is_public = true
    )
  );

DROP POLICY IF EXISTS "Users can insert exercises for their workouts" ON exercises;
CREATE POLICY "Users can insert exercises for their workouts" ON exercises
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM workout_days 
      JOIN workouts ON workouts.id = workout_days.workout_id
      WHERE workout_days.id = exercises.workout_day_id 
      AND workouts.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update exercises of their workouts" ON exercises;
CREATE POLICY "Users can update exercises of their workouts" ON exercises
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM workout_days 
      JOIN workouts ON workouts.id = workout_days.workout_id
      WHERE workout_days.id = exercises.workout_day_id 
      AND workouts.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete exercises of their workouts" ON exercises;
CREATE POLICY "Users can delete exercises of their workouts" ON exercises
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM workout_days 
      JOIN workouts ON workouts.id = workout_days.workout_id
      WHERE workout_days.id = exercises.workout_day_id 
      AND workouts.user_id = auth.uid()
    )
  );

-- Políticas para weight_records
DROP POLICY IF EXISTS "Users can view their own weight records" ON weight_records;
CREATE POLICY "Users can view their own weight records" ON weight_records
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own weight records" ON weight_records;
CREATE POLICY "Users can insert their own weight records" ON weight_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own weight records" ON weight_records;
CREATE POLICY "Users can update their own weight records" ON weight_records
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own weight records" ON weight_records;
CREATE POLICY "Users can delete their own weight records" ON weight_records
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para saved_workouts
DROP POLICY IF EXISTS "Users can view their own saved workouts" ON saved_workouts;
CREATE POLICY "Users can view their own saved workouts" ON saved_workouts
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own saved workouts" ON saved_workouts;
CREATE POLICY "Users can insert their own saved workouts" ON saved_workouts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own saved workouts" ON saved_workouts;
CREATE POLICY "Users can delete their own saved workouts" ON saved_workouts
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para workout_likes
DROP POLICY IF EXISTS "Users can view all workout likes" ON workout_likes;
CREATE POLICY "Users can view all workout likes" ON workout_likes
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own workout likes" ON workout_likes;
CREATE POLICY "Users can insert their own workout likes" ON workout_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own workout likes" ON workout_likes;
CREATE POLICY "Users can delete their own workout likes" ON workout_likes
  FOR DELETE USING (auth.uid() = user_id);

-- Função para criar perfil automaticamente após signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Remover trigger existente se houver (especificando o schema auth)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Criar trigger para criar perfil automaticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); 