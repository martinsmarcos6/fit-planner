import { useAuthContext } from '@/contexts/AuthContext';
import { profileHelpers, realtimeHelpers, workoutHelpers } from '@/utils/supabase-helpers';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Text, View } from 'react-native';

// Exemplo de componente que usa os helpers do Supabase
export const SupabaseUsageExample: React.FC = () => {
  const { user, isAuthenticated } = useAuthContext();
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Carregar dados na inicialização
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
      setupRealtimeSubscriptions();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Carregar perfil do usuário
      const userProfile = await profileHelpers.getCurrentProfile();
      setProfile(userProfile);

      // Carregar treinos do usuário
      const userWorkouts = await workoutHelpers.getUserWorkouts();
      setWorkouts(userWorkouts);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados');
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscriptions = () => {
    // Escutar mudanças nos treinos em tempo real
    const workoutSubscription = realtimeHelpers.subscribeToWorkouts((updatedWorkout) => {
      console.log('Treino atualizado em tempo real:', updatedWorkout);
      // Atualizar a lista de treinos
      loadData();
    });

    // Escutar mudanças no perfil em tempo real
    const profileSubscription = realtimeHelpers.subscribeToProfile((updatedProfile) => {
      console.log('Perfil atualizado em tempo real:', updatedProfile);
      setProfile(updatedProfile);
    });

    // Cleanup das subscriptions
    return () => {
      workoutSubscription?.then(sub => sub?.unsubscribe());
      profileSubscription?.then(sub => sub?.unsubscribe());
    };
  };

  const handleCreateWorkout = async () => {
    try {
      const newWorkout = await workoutHelpers.createWorkout({
        name: 'Treino de Teste',
        description: 'Este é um treino criado para teste',
      });

      if (newWorkout) {
        Alert.alert('Sucesso', 'Treino criado com sucesso!');
        loadData(); // Recarregar dados
      } else {
        Alert.alert('Erro', 'Não foi possível criar o treino');
      }
    } catch (error) {
      console.error('Erro ao criar treino:', error);
      Alert.alert('Erro', 'Erro ao criar treino');
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const updatedProfile = await profileHelpers.updateProfile({
        name: 'Nome Atualizado',
        username: 'novo_username',
      });

      if (updatedProfile) {
        Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
        setProfile(updatedProfile);
      } else {
        Alert.alert('Erro', 'Não foi possível atualizar o perfil');
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      Alert.alert('Erro', 'Erro ao atualizar perfil');
    }
  };

  const handleCheckUsername = async () => {
    try {
      const isAvailable = await profileHelpers.isUsernameAvailable('teste_username');
      Alert.alert(
        'Disponibilidade do Username',
        isAvailable ? 'Username disponível!' : 'Username já está em uso'
      );
    } catch (error) {
      console.error('Erro ao verificar username:', error);
      Alert.alert('Erro', 'Erro ao verificar username');
    }
  };

  const handleGenerateUsername = async () => {
    try {
      const uniqueUsername = await profileHelpers.generateUniqueUsername('usuario');
      Alert.alert('Username Único Gerado', `Username: ${uniqueUsername}`);
    } catch (error) {
      console.error('Erro ao gerar username:', error);
      Alert.alert('Erro', 'Erro ao gerar username');
    }
  };

  const handleDeleteWorkout = async (workoutId: string) => {
    try {
      const success = await workoutHelpers.deleteWorkout(workoutId);
      
      if (success) {
        Alert.alert('Sucesso', 'Treino deletado com sucesso!');
        loadData(); // Recarregar dados
      } else {
        Alert.alert('Erro', 'Não foi possível deletar o treino');
      }
    } catch (error) {
      console.error('Erro ao deletar treino:', error);
      Alert.alert('Erro', 'Erro ao deletar treino');
    }
  };

  if (!isAuthenticated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Faça login para ver os dados</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Exemplo de Uso do Supabase
      </Text>

      {/* Informações do Perfil */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Perfil:</Text>
        {profile && (
          <View style={{ marginTop: 10 }}>
            <Text>Nome: {profile.name}</Text>
            <Text>Username: @{profile.username}</Text>
            <Text>Email: {profile.email}</Text>
            <Button title="Atualizar Perfil" onPress={handleUpdateProfile} />
            <Button title="Verificar Username" onPress={handleCheckUsername} />
            <Button title="Gerar Username Único" onPress={handleGenerateUsername} />
          </View>
        )}
      </View>

      {/* Treinos */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Treinos ({workouts.length}):</Text>
        <Button title="Criar Novo Treino" onPress={handleCreateWorkout} />
        
        {workouts.map((workout) => (
          <View key={workout.id} style={{ marginTop: 10, padding: 10, borderWidth: 1, borderColor: '#ccc' }}>
            <Text style={{ fontWeight: 'bold' }}>{workout.name}</Text>
            <Text>{workout.description}</Text>
            <Text style={{ fontSize: 12, color: '#666' }}>
              Criado em: {new Date(workout.created_at).toLocaleDateString()}
            </Text>
            <Button 
              title="Deletar" 
              onPress={() => handleDeleteWorkout(workout.id)}
              color="red"
            />
          </View>
        ))}
      </View>

      {/* Informações do Usuário */}
      <View>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Usuário Atual:</Text>
        <Text>ID: {user?.id}</Text>
        <Text>Username: @{user?.username}</Text>
        <Text>Email: {user?.email}</Text>
        <Text>Nome: {user?.name}</Text>
      </View>
    </View>
  );
};

// Exemplo de hook personalizado para gerenciar treinos
export const useWorkouts = () => {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWorkouts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await workoutHelpers.getUserWorkouts();
      setWorkouts(data);
    } catch (err) {
      setError('Erro ao carregar treinos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createWorkout = async (workoutData: { name: string; description?: string }) => {
    try {
      const newWorkout = await workoutHelpers.createWorkout(workoutData);
      if (newWorkout) {
        setWorkouts(prev => [newWorkout, ...prev]);
        return { success: true };
      }
      return { success: false, error: 'Erro ao criar treino' };
    } catch (err) {
      console.error(err);
      return { success: false, error: 'Erro ao criar treino' };
    }
  };

  const deleteWorkout = async (id: string) => {
    try {
      const success = await workoutHelpers.deleteWorkout(id);
      if (success) {
        setWorkouts(prev => prev.filter(w => w.id !== id));
        return { success: true };
      }
      return { success: false, error: 'Erro ao deletar treino' };
    } catch (err) {
      console.error(err);
      return { success: false, error: 'Erro ao deletar treino' };
    }
  };

  return {
    workouts,
    loading,
    error,
    loadWorkouts,
    createWorkout,
    deleteWorkout,
  };
}; 