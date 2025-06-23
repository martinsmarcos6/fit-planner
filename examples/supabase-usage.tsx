import { useWorkout } from '@/contexts/WorkoutContext';
import { generalHelpers, profileHelpers, PublicWorkout, workoutHelpers, WorkoutWithDetails } from '@/utils/supabase-helpers';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Text, View } from 'react-native';

// Exemplo de componente que usa os helpers do Supabase
export const SupabaseUsageExample = () => {
  const [workouts, setWorkouts] = useState<WorkoutWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    try {
      setLoading(true);
      const userWorkouts = await workoutHelpers.getUserWorkouts();
      setWorkouts(userWorkouts);
    } catch (error) {
      console.error('Erro ao carregar treinos:', error);
    } finally {
      setLoading(false);
    }
  };

  const createWorkout = async () => {
    try {
      const newWorkout = await workoutHelpers.createWorkout({
        name: 'Meu Novo Treino',
        description: 'Um treino incrível',
        emoji: '💪',
        is_public: false,
        days: [
          {
            day: 'Segunda-feira',
            division: 'Treino A - Superior',
            is_rest_day: false,
            exercises: [
              {
                name: 'Flexão de Braço',
                sets: 3,
                reps: '10-12'
              },
              {
                name: 'Agachamento',
                sets: 3,
                reps: '12-15'
              }
            ]
          }
        ]
      });

      if (newWorkout) {
        Alert.alert('Sucesso', 'Treino criado com sucesso!');
        await loadWorkouts();
      }
    } catch (error) {
      console.error('Erro ao criar treino:', error);
      Alert.alert('Erro', 'Erro ao criar treino');
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Exemplo de Uso do Supabase
      </Text>
      
      <Button title="Criar Novo Treino" onPress={createWorkout} />
      
      {loading ? (
        <Text>Carregando...</Text>
      ) : (
        <View>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 20 }}>
            Seus Treinos ({workouts.length}):
          </Text>
          {workouts.map((workout) => (
            <View key={workout.id} style={{ marginTop: 10, padding: 10, backgroundColor: '#f0f0f0' }}>
              <Text style={{ fontWeight: 'bold' }}>{workout.name}</Text>
              <Text>{workout.description}</Text>
              <Text>Emoji: {workout.emoji}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

// Exemplo de uso do Supabase no Fit Planner
// Este arquivo demonstra como usar as funcionalidades do Supabase

// Exemplo 1: Usando os helpers diretamente
export const SupabaseExample = () => {
  const [userWorkouts, setUserWorkouts] = useState<WorkoutWithDetails[]>([])
  const [publicWorkouts, setPublicWorkouts] = useState<PublicWorkout[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Carregar treinos do usuário
      const workouts = await workoutHelpers.getUserWorkouts()
      setUserWorkouts(workouts)
      
      // Carregar treinos públicos
      const publicWorkoutsData = await workoutHelpers.getPublicWorkouts()
      setPublicWorkouts(publicWorkoutsData)
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const createNewWorkout = async () => {
    try {
      const workout = await workoutHelpers.createWorkout({
        name: 'Meu Novo Treino',
        description: 'Um treino incrível',
        emoji: '💪',
        is_public: false,
        days: [
          {
            day: 'Segunda-feira',
            division: 'Treino A - Superior',
            is_rest_day: false,
            exercises: [
              {
                name: 'Flexão de Braço',
                sets: 3,
                reps: '10-12'
              },
              {
                name: 'Agachamento',
                sets: 3,
                reps: '12-15'
              }
            ]
          }
        ]
      })
      
      if (workout) {
        console.log('Treino criado:', workout)
        await loadData() // Recarregar dados
      }
    } catch (error) {
      console.error('Erro ao criar treino:', error)
    }
  }

  const addWeightRecord = async (exerciseId: string) => {
    try {
      const record = await workoutHelpers.addWeightRecord(
        exerciseId,
        50.5, // peso
        'Ótimo treino!' // notas
      )
      
      if (record) {
        console.log('Registro de peso adicionado:', record)
      }
    } catch (error) {
      console.error('Erro ao adicionar registro:', error)
    }
  }

  const likeWorkout = async (workoutId: string) => {
    try {
      const success = await workoutHelpers.likeWorkout(workoutId)
      if (success) {
        console.log('Like adicionado!')
        await loadData() // Recarregar dados
      }
    } catch (error) {
      console.error('Erro ao dar like:', error)
    }
  }

  const saveWorkout = async (workoutId: string) => {
    try {
      const success = await workoutHelpers.saveWorkout(workoutId)
      if (success) {
        console.log('Treino salvo!')
        await loadData() // Recarregar dados
      }
    } catch (error) {
      console.error('Erro ao salvar treino:', error)
    }
  }

  return {
    userWorkouts,
    publicWorkouts,
    loading,
    createNewWorkout,
    addWeightRecord,
    likeWorkout,
    saveWorkout
  }
}

// Exemplo 2: Usando o contexto (recomendado)
export const ContextExample = () => {
  const {
    workouts,
    publicWorkouts,
    savedWorkouts,
    loading,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    saveWorkout,
    unsaveWorkout,
    likeWorkout,
    unlikeWorkout,
    refreshWorkouts,
    refreshPublicWorkouts
  } = useWorkout()

  const createWorkoutWithContext = async () => {
    try {
      await addWorkout({
        name: 'Treino via Contexto',
        description: 'Criado usando o contexto',
        emoji: '🔥',
        days: [
          {
            day: 'Segunda-feira',
            division: 'Treino Full Body',
            isRestDay: false,
            exercises: [
              {
                id: '1',
                name: 'Supino',
                sets: 4,
                reps: '8-10',
                weightHistory: []
              }
            ]
          }
        ],
        username: 'usuario'
      })
      
      console.log('Treino criado via contexto!')
    } catch (error) {
      console.error('Erro ao criar treino:', error)
    }
  }

  const handleLikeWorkout = async (workoutId: string) => {
    try {
      await likeWorkout(workoutId)
      console.log('Like adicionado via contexto!')
    } catch (error) {
      console.error('Erro ao dar like:', error)
    }
  }

  const handleSaveWorkout = async (workoutId: string) => {
    try {
      await saveWorkout({ id: workoutId })
      console.log('Treino salvo via contexto!')
    } catch (error) {
      console.error('Erro ao salvar treino:', error)
    }
  }

  return {
    workouts,
    publicWorkouts,
    savedWorkouts,
    loading,
    createWorkoutWithContext,
    handleLikeWorkout,
    handleSaveWorkout,
    refreshWorkouts,
    refreshPublicWorkouts
  }
}

// Exemplo 3: Gerenciamento de perfil
export const ProfileExample = () => {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setLoading(true)
      const userProfile = await profileHelpers.getCurrentProfile()
      setProfile(userProfile)
    } catch (error) {
      console.error('Erro ao carregar perfil:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateUserProfile = async (updates: any) => {
    try {
      const updatedProfile = await profileHelpers.updateProfile(updates)
      if (updatedProfile) {
        setProfile(updatedProfile)
        console.log('Perfil atualizado:', updatedProfile)
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
    }
  }

  const checkUsername = async (username: string) => {
    try {
      const isAvailable = await profileHelpers.isUsernameAvailable(username)
      console.log(`Username "${username}" está disponível:`, isAvailable)
      return isAvailable
    } catch (error) {
      console.error('Erro ao verificar username:', error)
      return false
    }
  }

  const generateUsername = async (baseUsername: string) => {
    try {
      const uniqueUsername = await profileHelpers.generateUniqueUsername(baseUsername)
      console.log('Username único gerado:', uniqueUsername)
      return uniqueUsername
    } catch (error) {
      console.error('Erro ao gerar username:', error)
      return null
    }
  }

  return {
    profile,
    loading,
    updateUserProfile,
    checkUsername,
    generateUsername
  }
}

// Exemplo 4: Verificações de autenticação
export const AuthExample = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const authenticated = await generalHelpers.isAuthenticated()
      setIsAuthenticated(authenticated)
      
      if (authenticated) {
        const user = await generalHelpers.getCurrentUser()
        setCurrentUser(user)
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error)
    }
  }

  return {
    isAuthenticated,
    currentUser,
    checkAuth
  }
}

// Exemplo 5: Subscriptions em tempo real
export const RealtimeExample = () => {
  useEffect(() => {
    // Inscrever em mudanças de treinos
    const workoutSubscription = generalHelpers.subscribeToWorkouts((workout: any) => {
      console.log('Treino atualizado em tempo real:', workout)
    })

    // Inscrever em mudanças de perfil
    const profileSubscription = generalHelpers.subscribeToProfile((profile: any) => {
      console.log('Perfil atualizado em tempo real:', profile)
    })

    // Cleanup das subscriptions
    return () => {
      workoutSubscription?.unsubscribe()
      profileSubscription?.unsubscribe()
    }
  }, [])

  return null
}

// Exemplo 6: Componente completo de uso
export const CompleteExample = () => {
  const {
    workouts,
    publicWorkouts,
    loading,
    addWorkout,
    likeWorkout,
    saveWorkout
  } = useWorkout()

  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    const userProfile = await profileHelpers.getCurrentProfile()
    setProfile(userProfile)
  }

  const handleCreateWorkout = async () => {
    try {
      await addWorkout({
        name: 'Treino Completo',
        description: 'Exemplo de treino completo',
        emoji: '🏋️',
        days: [
          {
            day: 'Segunda-feira',
            division: 'Treino A',
            isRestDay: false,
            exercises: [
              {
                id: '1',
                name: 'Supino Reto',
                sets: 4,
                reps: '8-10',
                weightHistory: []
              }
            ]
          }
        ],
        username: profile?.username || 'usuario'
      })
    } catch (error) {
      console.error('Erro:', error)
    }
  }

  return {
    workouts,
    publicWorkouts,
    loading,
    profile,
    handleCreateWorkout,
    likeWorkout,
    saveWorkout
  }
}

/*
COMO USAR:

1. Para usar os helpers diretamente:
```tsx
const { userWorkouts, createNewWorkout } = SupabaseExample()
```

2. Para usar o contexto (recomendado):
```tsx
const { workouts, addWorkout } = useWorkout()
```

3. Para gerenciar perfil:
```tsx
const { profile, updateUserProfile } = ProfileExample()
```

4. Para verificar autenticação:
```tsx
const { isAuthenticated, currentUser } = AuthExample()
```

5. Para subscriptions em tempo real:
```tsx
<RealtimeExample />
```

6. Para um exemplo completo:
```tsx
const { workouts, handleCreateWorkout } = CompleteExample()
```

BENEFÍCIOS DO SUPABASE:

✅ Autenticação completa
✅ Banco de dados PostgreSQL
✅ Políticas de segurança (RLS)
✅ Subscriptions em tempo real
✅ Storage para arquivos
✅ Edge Functions
✅ Analytics integrado
✅ Backup automático
✅ Escalabilidade automática
✅ Interface web para gerenciar dados

ESTRUTURA DO BANCO:

- profiles: Perfis dos usuários
- workouts: Treinos criados
- workout_days: Dias de treino
- exercises: Exercícios
- weight_records: Registros de peso
- saved_workouts: Treinos salvos
- workout_likes: Likes em treinos

TODAS AS OPERAÇÕES SÃO AUTOMATICAMENTE:
- Autenticadas (apenas usuários logados)
- Autorizadas (apenas donos podem editar)
- Sincronizadas em tempo real
- Backup automático
- Seguras com RLS
*/ 