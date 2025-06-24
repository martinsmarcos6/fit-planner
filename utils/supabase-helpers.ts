import { Database, supabase } from './supabase';

// Tipos derivados do Database
type Profile = Database['public']['Tables']['profiles']['Row'];
type Workout = Database['public']['Tables']['workouts']['Row'];
type WorkoutDay = Database['public']['Tables']['workout_days']['Row'];
type Exercise = Database['public']['Tables']['exercises']['Row'];
type WeightRecord = Database['public']['Tables']['weight_records']['Row'];
type SavedWorkout = Database['public']['Tables']['saved_workouts']['Row'];
type WorkoutLike = Database['public']['Tables']['workout_likes']['Row'];

type InsertProfile = Database['public']['Tables']['profiles']['Insert'];
type InsertWorkout = Database['public']['Tables']['workouts']['Insert'];
type InsertWorkoutDay = Database['public']['Tables']['workout_days']['Insert'];
type InsertExercise = Database['public']['Tables']['exercises']['Insert'];
type InsertWeightRecord = Database['public']['Tables']['weight_records']['Insert'];
type InsertSavedWorkout = Database['public']['Tables']['saved_workouts']['Insert'];
type InsertWorkoutLike = Database['public']['Tables']['workout_likes']['Insert'];

// Tipos para uso no frontend
export interface WorkoutWithDetails extends Workout {
  workout_days: (WorkoutDay & {
    exercises: (Exercise & {
      weight_records: WeightRecord[]
    })[]
  })[]
  profile: Profile
  is_liked?: boolean
  is_saved?: boolean
}

export interface PublicWorkout extends Workout {
  profile: Profile
  emoji: string
  workout_days: (WorkoutDay & {
    exercises: (Exercise & {
      weight_records: WeightRecord[]
    })[]
  })[]
  is_liked?: boolean
  is_saved?: boolean
}

// Helpers para perfis
export const profileHelpers = {
  // Garantir que o perfil do usuário existe
  async ensureProfileExists(): Promise<Profile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Tentar buscar o perfil existente
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (existingProfile) {
      return existingProfile;
    }

    // Se não existe, criar o perfil
    if (fetchError && fetchError.code === 'PGRST116') {
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email || '',
          username: user.user_metadata?.username || user.email?.split('@')[0] || 'usuario',
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'Usuário'
        })
        .select()
        .single();

      if (createError) {
        console.error('Erro ao criar perfil:', createError);
        return null;
      }

      return newProfile;
    }

    return null;
  },

  // Buscar perfil do usuário atual
  async getCurrentProfile(): Promise<Profile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Erro ao buscar perfil:', error);
      // Se o perfil não existe, tentar criar
      if (error.code === 'PGRST116') {
        return this.ensureProfileExists();
      }
      return null;
    }

    return data;
  },

  // Atualizar perfil do usuário atual
  async updateProfile(updates: Partial<InsertProfile>): Promise<Profile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar perfil:', error);
      return null;
    }

    return data;
  },

  // Verificar se um username está disponível
  async isUsernameAvailable(username: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username)
      .single();

    if (error && error.code === 'PGRST116') {
      // PGRST116 = no rows returned, significa que o username está disponível
      return true;
    }

    if (error) {
      console.error('Erro ao verificar username:', error);
      return false;
    }

    // Se encontrou dados, o username já está em uso
    return false;
  },

  // Buscar perfil por username
  async getProfileByUsername(username: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single();

    if (error) {
      console.error('Erro ao buscar perfil por username:', error);
      return null;
    }

    return data;
  },

  // Buscar perfil por ID
  async getProfileById(id: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar perfil por ID:', error);
      return null;
    }

    return data;
  },

  // Buscar perfis públicos (usuários que têm treinos públicos)
  async getPublicProfiles(limit: number = 20, offset: number = 0): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        workouts!inner(is_public)
      `)
      .eq('workouts.is_public', true)
      .limit(limit)
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Erro ao buscar perfis públicos:', error);
      return [];
    }

    // Remover duplicatas baseado no ID do perfil
    const uniqueProfiles = data?.reduce((acc: Profile[], current: any) => {
      const x = acc.find((item: Profile) => item.id === current.id);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, [] as Profile[]);

    return uniqueProfiles || [];
  },

  // Buscar estatísticas do perfil
  async getProfileStats(profileId: string): Promise<{
    totalWorkouts: number;
    publicWorkouts: number;
    totalLikes: number;
    totalSaved: number;
  } | null> {
    try {
      // Contar treinos totais
      const { count: totalWorkouts, error: workoutsError } = await supabase
        .from('workouts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', profileId);

      if (workoutsError) throw workoutsError;

      // Contar treinos públicos
      const { count: publicWorkouts, error: publicError } = await supabase
        .from('workouts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', profileId)
        .eq('is_public', true);

      if (publicError) throw publicError;

      // Buscar IDs dos treinos do usuário
      const { data: userWorkouts, error: userWorkoutsError } = await supabase
        .from('workouts')
        .select('id')
        .eq('user_id', profileId);

      if (userWorkoutsError) throw userWorkoutsError;

      const workoutIds = userWorkouts?.map(w => w.id) || [];

      // Contar likes recebidos
      const { count: totalLikes, error: likesError } = await supabase
        .from('workout_likes')
        .select('*', { count: 'exact', head: true })
        .in('workout_id', workoutIds);

      if (likesError) throw likesError;

      // Contar salvamentos recebidos
      const { count: totalSaved, error: savedError } = await supabase
        .from('saved_workouts')
        .select('*', { count: 'exact', head: true })
        .in('workout_id', workoutIds);

      if (savedError) throw savedError;

      return {
        totalWorkouts: totalWorkouts || 0,
        publicWorkouts: publicWorkouts || 0,
        totalLikes: totalLikes || 0,
        totalSaved: totalSaved || 0,
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas do perfil:', error);
      return null;
    }
  },

  // Buscar perfis sugeridos (baseado em treinos similares)
  async getSuggestedProfiles(limit: number = 10): Promise<Profile[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    try {
      // Buscar usuários que têm treinos públicos e que o usuário atual ainda não salvou
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          workouts!inner(
            id,
            is_public,
            saved_workouts!left(user_id)
          )
        `)
        .eq('workouts.is_public', true)
        .neq('id', user.id)
        .limit(limit);

      if (error) throw error;

      // Filtrar e remover duplicatas
      const uniqueProfiles = data?.reduce((acc: Profile[], current: any) => {
        const x = acc.find((item: Profile) => item.id === current.id);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, [] as Profile[]);

      return uniqueProfiles || [];
    } catch (error) {
      console.error('Erro ao buscar perfis sugeridos:', error);
      return [];
    }
  },

  // Gerar username único baseado em um username base
  async generateUniqueUsername(baseUsername: string): Promise<string> {
    let username = baseUsername;
    let counter = 0;

    while (!(await this.isUsernameAvailable(username))) {
      counter++;
      username = `${baseUsername}${counter}`;
    }

    return username;
  },

  // Validar username (regras de validação)
  validateUsername(username: string): { isValid: boolean; error?: string } {
    if (!username || username.length < 3) {
      return { isValid: false, error: 'Nome de usuário deve ter pelo menos 3 caracteres' };
    }

    if (username.length > 20) {
      return { isValid: false, error: 'Nome de usuário deve ter no máximo 20 caracteres' };
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return { isValid: false, error: 'Nome de usuário deve conter apenas letras, números e underscore' };
    }

    return { isValid: true };
  },

  // Validar nome
  validateName(name: string): { isValid: boolean; error?: string } {
    if (!name || name.trim().length < 2) {
      return { isValid: false, error: 'Nome deve ter pelo menos 2 caracteres' };
    }

    if (name.trim().length > 50) {
      return { isValid: false, error: 'Nome deve ter no máximo 50 caracteres' };
    }

    return { isValid: true };
  },
};

// Helpers para treinos
export const workoutHelpers = {
  // Buscar todos os treinos do usuário atual com detalhes completos
  async getUserWorkouts(): Promise<WorkoutWithDetails[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    // Garantir que o perfil existe
    const profile = await profileHelpers.ensureProfileExists();
    if (!profile) return [];

    // Buscar os treinos
    const { data: workouts, error: workoutsError } = await supabase
      .from('workouts')
      .select(`
        *,
        workout_days (
          *,
          exercises (
            *,
            weight_records (*)
          )
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (workoutsError) {
      console.error('Erro ao buscar treinos:', workoutsError);
      return [];
    }

    // Combinar os dados
    return (workouts || []).map(workout => ({
      ...workout,
      profile
    }));
  },

  // Buscar treinos públicos
  async getPublicWorkouts(): Promise<PublicWorkout[]> {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Buscar treinos públicos
    const { data: workouts, error: workoutsError } = await supabase
      .from('workouts')
      .select(`
        *,
        workout_days (
          *,
          exercises (
            *,
            weight_records (*)
          )
        )
      `)
      .eq('is_public', true)
      .order('likes_count', { ascending: false })
      .order('created_at', { ascending: false });

    if (workoutsError) {
      console.error('Erro ao buscar treinos públicos:', workoutsError);
      return [];
    }

    // Buscar perfis dos criadores dos treinos
    const workoutsWithProfiles = await Promise.all(
      (workouts || []).map(async (workout) => {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', workout.user_id)
          .single();

        return {
          ...workout,
          profile: profile || { id: '', email: '', username: 'Usuário', name: 'Usuário', created_at: '', updated_at: '' }
        };
      })
    );

    // Verificar se o usuário atual deu like ou salvou cada treino
    const workoutsWithUserData = await Promise.all(
      workoutsWithProfiles.map(async (workout) => {
        if (!user) {
          return { ...workout, is_liked: false, is_saved: false };
        }

        const [likeResult, savedResult] = await Promise.all([
          supabase
            .from('workout_likes')
            .select('id')
            .eq('user_id', user.id)
            .eq('workout_id', workout.id)
            .single(),
          supabase
            .from('saved_workouts')
            .select('id')
            .eq('user_id', user.id)
            .eq('workout_id', workout.id)
            .single()
        ]);

        return {
          ...workout,
          is_liked: !likeResult.error,
          is_saved: !savedResult.error
        };
      })
    );

    return workoutsWithUserData;
  },

  // Buscar treino específico com detalhes completos
  async getWorkoutWithDetails(id: string): Promise<WorkoutWithDetails | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Buscar o treino com seus dias e exercícios
    const { data: workout, error: workoutError } = await supabase
      .from('workouts')
      .select(`
        *,
        workout_days (
          *,
          exercises (
            *,
            weight_records (*)
          )
        )
      `)
      .eq('id', id)
      .single();

    if (workoutError) {
      console.error('Erro ao buscar treino:', workoutError);
      return null;
    }

    // Buscar o perfil do criador
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', workout.user_id)
      .single();

    return {
      ...workout,
      profile: profile || { id: '', email: '', username: 'Usuário', name: 'Usuário', created_at: '', updated_at: '' }
    };
  },

  // Criar novo treino
  async createWorkout(workoutData: {
    name: string
    description?: string
    emoji?: string
    is_public?: boolean
    days: {
      day: string
      division: string
      is_rest_day?: boolean
      exercises: {
        name: string
        sets: number
        reps: string
      }[]
    }[]
  }): Promise<string | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Inserir o treino
    const { data: workout, error: workoutError } = await supabase
      .from('workouts')
      .insert({
        user_id: user.id,
        name: workoutData.name,
        description: workoutData.description,
        emoji: workoutData.emoji || '💪',
        is_public: workoutData.is_public || false
      })
      .select()
      .single();

    if (workoutError) {
      console.error('Erro ao criar treino:', workoutError);
      return null;
    }

    // Inserir os dias de treino
    for (let dayIndex = 0; dayIndex < workoutData.days.length; dayIndex++) {
      const day = workoutData.days[dayIndex];
      
      const { data: workoutDay, error: dayError } = await supabase
        .from('workout_days')
        .insert({
          workout_id: workout.id,
          day: day.day,
          division: day.division,
          is_rest_day: day.is_rest_day || false,
          order_index: dayIndex
        })
        .select()
        .single();

      if (dayError) {
        console.error('Erro ao criar dia de treino:', dayError);
        continue;
      }

      // Inserir os exercícios do dia
      for (let exerciseIndex = 0; exerciseIndex < day.exercises.length; exerciseIndex++) {
        const exercise = day.exercises[exerciseIndex];
        
        await supabase
          .from('exercises')
          .insert({
            workout_day_id: workoutDay.id,
            name: exercise.name,
            sets: exercise.sets,
            reps: exercise.reps,
            order_index: exerciseIndex
          });
      }
    }

    return workout.id;
  },

  // Atualizar treino
  async updateWorkout(id: string, workoutData: {
    name?: string
    description?: string
    emoji?: string
    is_public?: boolean
  }): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('workouts')
      .update(workoutData)
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Erro ao atualizar treino:', error);
      return false;
    }

    return true;
  },

  // Deletar treino
  async deleteWorkout(id: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('workouts')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Erro ao deletar treino:', error);
      return false;
    }

    return true;
  },

  // Adicionar registro de peso
  async addWeightRecord(exerciseId: string, weight: number, notes?: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('weight_records')
      .insert({
        exercise_id: exerciseId,
        user_id: user.id,
        weight,
        notes
      });

    if (error) {
      console.error('Erro ao adicionar registro de peso:', error);
      return false;
    }

    return true;
  },

  // Buscar registros de peso de um exercício
  async getWeightRecords(exerciseId: string): Promise<WeightRecord[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('weight_records')
      .select('*')
      .eq('exercise_id', exerciseId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar registros de peso:', error);
      return [];
    }

    return data || [];
  },

  // Salvar treino
  async saveWorkout(workoutId: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('saved_workouts')
      .insert({
        user_id: user.id,
        workout_id: workoutId
      });

    if (error) {
      console.error('Erro ao salvar treino:', error);
      return false;
    }

    return true;
  },

  // Remover treino salvo
  async unsaveWorkout(workoutId: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('saved_workouts')
      .delete()
      .eq('user_id', user.id)
      .eq('workout_id', workoutId);

    if (error) {
      console.error('Erro ao remover treino salvo:', error);
      return false;
    }

    return true;
  },

  // Verificar se treino está salvo
  async isWorkoutSaved(workoutId: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('saved_workouts')
      .select('id')
      .eq('user_id', user.id)
      .eq('workout_id', workoutId)
      .single();

    if (error) return false;
    return !!data;
  },

  // Dar like em treino
  async likeWorkout(workoutId: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('workout_likes')
      .insert({
        user_id: user.id,
        workout_id: workoutId
      });

    if (error) {
      console.error('Erro ao dar like no treino:', error);
      return false;
    }

    return true;
  },

  // Remover like do treino
  async unlikeWorkout(workoutId: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('workout_likes')
      .delete()
      .eq('user_id', user.id)
      .eq('workout_id', workoutId);

    if (error) {
      console.error('Erro ao remover like do treino:', error);
      return false;
    }

    return true;
  },

  // Verificar se treino está curtido
  async isWorkoutLiked(workoutId: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('workout_likes')
      .select('id')
      .eq('user_id', user.id)
      .eq('workout_id', workoutId)
      .single();

    if (error) return false;
    return !!data;
  },

  // Buscar treinos salvos do usuário
  async getSavedWorkouts(): Promise<PublicWorkout[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('saved_workouts')
      .select(`
        workout_id,
        workouts (
          *,
          workout_days (
            *,
            exercises (
              *,
              weight_records (*)
            )
          )
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar treinos salvos:', error);
      return [];
    }

    // Buscar perfis dos criadores dos treinos salvos
    const savedWorkouts = await Promise.all(
      (data || []).map(async (item: any) => {
        if (!item.workouts) return null;

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', item.workouts.user_id)
          .single();

        return {
          ...item.workouts,
          profile: profile || { id: '', email: '', username: 'Usuário', name: 'Usuário', created_at: '', updated_at: '' },
          is_liked: false,
          is_saved: true
        } as PublicWorkout;
      })
    );

    return savedWorkouts.filter((workout): workout is PublicWorkout => workout !== null);
  }
};

// Helpers gerais
export const generalHelpers = {
  // Verificar se usuário está autenticado
  async isAuthenticated(): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    return !!user;
  },

  // Buscar usuário atual
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  // Inscrever em mudanças de treinos
  subscribeToWorkouts(callback: (workout: Workout) => void) {
    return supabase
      .channel('workouts')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'workouts'
        },
        (payload) => {
          callback(payload.new as Workout);
        }
      )
      .subscribe();
  },

  // Inscrever em mudanças de perfil
  subscribeToProfile(callback: (profile: Profile) => void) {
    return supabase
      .channel('profiles')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          callback(payload.new as Profile);
        }
      )
      .subscribe();
  },
}; 