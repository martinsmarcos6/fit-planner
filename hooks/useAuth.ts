import { supabase } from '@/utils/supabase';
import { profileHelpers } from '@/utils/supabase-helpers';
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

  // Sincronizar perfil com a tabela profiles
  const syncProfileWithDatabase = async (supabaseUser: SupabaseUser) => {
    try {
      // Garantir que o perfil existe na tabela profiles
      const profile = await profileHelpers.ensureProfileExists();
      
      if (profile) {
        // Usar dados do perfil do banco se disponível
        return {
          id: profile.id,
          email: profile.email,
          username: profile.username,
          name: profile.name,
        };
      }
      
      // Fallback para dados do auth
      return mapSupabaseUser(supabaseUser);
    } catch (error) {
      console.error('Erro ao sincronizar perfil:', error);
      return mapSupabaseUser(supabaseUser);
    }
  };

  // Carregar dados de autenticação do Supabase na inicialização
  useEffect(() => {
    loadAuthFromSupabase();
    
    // Escutar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (session?.user) {
          const user = await syncProfileWithDatabase(session.user);
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
        const user = await syncProfileWithDatabase(session.user);
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
        const user = await syncProfileWithDatabase(data.user);
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

      // Verificar se o username está disponível
      if (username) {
        const isAvailable = await profileHelpers.isUsernameAvailable(username);
        if (!isAvailable) {
          setAuthState(prev => ({ ...prev, isLoading: false }));
          return { success: false, error: 'Nome de usuário já está em uso' };
        }
      }

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
        // Aguardar um pouco para o trigger criar o perfil
        await new Promise(resolve => setTimeout(resolve, 1000));
        const user = await syncProfileWithDatabase(data.user);
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

      // Verificar se o username está disponível (se foi alterado)
      if (userData.username && userData.username !== authState.user.username) {
        const isAvailable = await profileHelpers.isUsernameAvailable(userData.username);
        if (!isAvailable) {
          throw new Error('Nome de usuário já está em uso');
        }
      }

      // Atualizar dados no auth
      const { data: authData, error: authError } = await supabase.auth.updateUser({
        email: userData.email,
        data: {
          name: userData.name,
          username: userData.username,
        },
      });

      if (authError) {
        throw new Error(authError.message);
      }

      // Atualizar perfil na tabela profiles
      const updatedProfile = await profileHelpers.updateProfile({
        name: userData.name,
        email: userData.email,
        username: userData.username,
      });

      if (updatedProfile) {
        setAuthState(prev => ({
          ...prev,
          user: {
            id: updatedProfile.id,
            email: updatedProfile.email,
            username: updatedProfile.username,
            name: updatedProfile.name,
          },
        }));
      } else if (authData.user) {
        const user = await syncProfileWithDatabase(authData.user);
        setAuthState(prev => ({
          ...prev,
          user,
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