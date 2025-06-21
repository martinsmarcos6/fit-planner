import { Database, supabase } from './supabase';


// Tipos derivados do Database
type Profile = Database['public']['Tables']['profiles']['Row'];
type Workout = Database['public']['Tables']['workouts']['Row'];
type InsertProfile = Database['public']['Tables']['profiles']['Insert'];
type InsertWorkout = Database['public']['Tables']['workouts']['Insert'];

// Helpers para perfis
export const profileHelpers = {
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
};

// Helpers para treinos
export const workoutHelpers = {
  // Buscar todos os treinos do usuário atual
  async getUserWorkouts(): Promise<Workout[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar treinos:', error);
      return [];
    }

    return data || [];
  },

  // Criar novo treino
  async createWorkout(workout: Omit<InsertWorkout, 'user_id'>): Promise<Workout | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('workouts')
      .insert({
        ...workout,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar treino:', error);
      return null;
    }

    return data;
  },

  // Atualizar treino
  async updateWorkout(id: string, updates: Partial<InsertWorkout>): Promise<Workout | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('workouts')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id) // Garante que só o dono pode atualizar
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar treino:', error);
      return null;
    }

    return data;
  },

  // Deletar treino
  async deleteWorkout(id: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('workouts')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id); // Garante que só o dono pode deletar

    if (error) {
      console.error('Erro ao deletar treino:', error);
      return false;
    }

    return true;
  },

  // Buscar treino específico
  async getWorkout(id: string): Promise<Workout | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Erro ao buscar treino:', error);
      return null;
    }

    return data;
  },
};

// Helper para verificar se o usuário está autenticado
export const authHelpers = {
  async isAuthenticated(): Promise<boolean> {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },
};

// Helper para real-time subscriptions
export const realtimeHelpers = {
  // Escutar mudanças nos treinos do usuário atual
  subscribeToWorkouts(callback: (workout: Workout) => void) {
    return supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return null;

      return supabase
        .channel('workouts')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'workouts',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            callback(payload.new as Workout);
          }
        )
        .subscribe();
    });
  },

  // Escutar mudanças no perfil do usuário atual
  subscribeToProfile(callback: (profile: Profile) => void) {
    return supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return null;

      return supabase
        .channel('profile')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${user.id}`,
          },
          (payload) => {
            callback(payload.new as Profile);
          }
        )
        .subscribe();
    });
  },
}; 