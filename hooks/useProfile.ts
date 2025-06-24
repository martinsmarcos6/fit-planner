import { useAuthContext } from '@/contexts/AuthContext';
import { Database } from '@/utils/supabase';
import { profileHelpers } from '@/utils/supabase-helpers';
import { useCallback, useEffect, useState } from 'react';

type Profile = Database['public']['Tables']['profiles']['Row'];
type InsertProfile = Database['public']['Tables']['profiles']['Insert'];

interface UseProfileReturn {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  updateProfile: (updates: Partial<InsertProfile>) => Promise<{ success: boolean; error?: string }>;
  refreshProfile: () => Promise<void>;
  isUsernameAvailable: (username: string) => Promise<boolean>;
  generateUniqueUsername: (baseUsername: string) => Promise<string>;
}

export const useProfile = (): UseProfileReturn => {
  const { user, isAuthenticated } = useAuthContext();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const userProfile = await profileHelpers.getCurrentProfile();
      setProfile(userProfile);
    } catch (err) {
      console.error('Erro ao carregar perfil:', err);
      setError('Erro ao carregar perfil do usuário');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  const updateProfile = useCallback(async (updates: Partial<InsertProfile>) => {
    if (!isAuthenticated || !user) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    try {
      setIsLoading(true);
      setError(null);

      // Verificar se o username está disponível (se foi alterado)
      if (updates.username && updates.username !== profile?.username) {
        const isAvailable = await profileHelpers.isUsernameAvailable(updates.username);
        if (!isAvailable) {
          return { success: false, error: 'Nome de usuário já está em uso' };
        }
      }

      const updatedProfile = await profileHelpers.updateProfile(updates);
      
      if (updatedProfile) {
        setProfile(updatedProfile);
        return { success: true };
      } else {
        return { success: false, error: 'Erro ao atualizar perfil' };
      }
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar perfil';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user, profile?.username]);

  const refreshProfile = useCallback(async () => {
    await loadProfile();
  }, [loadProfile]);

  const isUsernameAvailable = useCallback(async (username: string): Promise<boolean> => {
    return await profileHelpers.isUsernameAvailable(username);
  }, []);

  const generateUniqueUsername = useCallback(async (baseUsername: string): Promise<string> => {
    return await profileHelpers.generateUniqueUsername(baseUsername);
  }, []);

  // Carregar perfil quando o usuário mudar
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    refreshProfile,
    isUsernameAvailable,
    generateUniqueUsername,
  };
}; 