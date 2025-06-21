import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
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

  // Carregar dados de autenticação do cache na inicialização
  useEffect(() => {
    loadAuthFromStorage();
  }, []);

  const loadAuthFromStorage = async () => {
    try {
      const storedAuth = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (storedAuth) {
        const { user, token } = JSON.parse(storedAuth);
        setAuthState({
          user,
          token,
          isLoading: false,
          isAuthenticated: true,
        });
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('Erro ao carregar autenticação do cache:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));

      // Simulação de login - em um app real, aqui seria uma chamada para API
      // Por enquanto, vamos simular um login bem-sucedido
      const mockUser: User = {
        id: '1',
        email,
        name: email.split('@')[0], // Usa a parte antes do @ como nome
      };
      
      const mockToken = `mock_token_${Date.now()}`;

      const authData = {
        user: mockUser,
        token: mockToken,
      };

      // Salvar no cache
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));

      setAuthState({
        user: mockUser,
        token: mockToken,
        isLoading: false,
        isAuthenticated: true,
      });

      return { success: true };
    } catch (error) {
      console.error('Erro no login:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: 'Erro no login' };
    }
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));

      // Simulação de registro - em um app real, aqui seria uma chamada para API
      const mockUser: User = {
        id: Date.now().toString(),
        email,
        name,
      };
      
      const mockToken = `mock_token_${Date.now()}`;

      const authData = {
        user: mockUser,
        token: mockToken,
      };

      // Salvar no cache
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));

      setAuthState({
        user: mockUser,
        token: mockToken,
        isLoading: false,
        isAuthenticated: true,
      });

      return { success: true };
    } catch (error) {
      console.error('Erro no registro:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: 'Erro no registro' };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      // Remover do cache
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      
      setAuthState({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  }, []);

  const updateUser = useCallback(async (userData: { name: string; email: string }) => {
    try {
      if (!authState.user) {
        throw new Error('Usuário não autenticado');
      }

      const updatedUser = {
        ...authState.user,
        name: userData.name,
        email: userData.email,
      };

      const authData = {
        user: updatedUser,
        token: authState.token,
      };

      // Salvar no cache
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));

      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
      }));

      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  }, [authState.user, authState.token]);

  return {
    ...authState,
    login,
    register,
    logout,
    updateUser,
  };
}; 