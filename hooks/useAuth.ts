import { supabase } from '@/utils/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useCallback, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  username: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AUTH_STORAGE_KEY = '@fit_planner_auth';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Converter usuário do Supabase para nosso formato
  const mapSupabaseUser = (supabaseUser: SupabaseUser): User => ({
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    username: supabaseUser.user_metadata?.username || supabaseUser.email?.split('@')[0] || 'usuario',
    name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'Usuário',
  });

  // Carregar dados de autenticação do Supabase na inicialização
  useEffect(() => {
    loadAuthFromSupabase();
    
    // Escutar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (session?.user) {
          const user = mapSupabaseUser(session.user);
          setAuthState({
            user,
            token: session.access_token,
            isLoading: false,
            isAuthenticated: true,
          });
        } else {
          setAuthState({
            user: null,
            token: null,
            isLoading: false,
            isAuthenticated: false,
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadAuthFromSupabase = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Erro ao carregar sessão:', error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      if (session?.user) {
        const user = mapSupabaseUser(session.user);
        setAuthState({
          user,
          token: session.access_token,
          isLoading: false,
          isAuthenticated: true,
        });
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('Erro ao carregar autenticação:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Erro no login:', error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return { success: false, error: error.message };
      }

      if (data.user) {
        const user = mapSupabaseUser(data.user);
        setAuthState({
          user,
          token: data.session?.access_token || null,
          isLoading: false,
          isAuthenticated: true,
        });
        return { success: true };
      }

      return { success: false, error: 'Erro desconhecido no login' };
    } catch (error) {
      console.error('Erro no login:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: 'Erro no login' };
    }
  }, []);

  const register = useCallback(async (email: string, password: string, name: string, username?: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            username: username,
          },
        },
      });

      if (error) {
        console.error('Erro no registro:', error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return { success: false, error: error.message };
      }

      if (data.user) {
        const user = mapSupabaseUser(data.user);
        setAuthState({
          user,
          token: data.session?.access_token || null,
          isLoading: false,
          isAuthenticated: true,
        });
        return { success: true };
      }

      return { success: false, error: 'Erro desconhecido no registro' };
    } catch (error) {
      console.error('Erro no registro:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: 'Erro no registro' };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Erro no logout:', error);
      }
      
      setAuthState({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error('Erro no logout:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const updateUser = useCallback(async (userData: { name: string; email: string; username?: string }) => {
    try {
      if (!authState.user) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error } = await supabase.auth.updateUser({
        email: userData.email,
        data: {
          name: userData.name,
          username: userData.username,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.user) {
        const updatedUser = mapSupabaseUser(data.user);
        setAuthState(prev => ({
          ...prev,
          user: updatedUser,
        }));
      }

      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  }, [authState.user]);

  const resetPassword = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'fit-planner://reset-password',
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Erro ao resetar senha:', error);
      return { success: false, error: 'Erro ao resetar senha' };
    }
  }, []);

  return {
    ...authState,
    login,
    register,
    logout,
    updateUser,
    resetPassword,
  };
}; 