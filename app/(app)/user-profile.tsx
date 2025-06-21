import { HStack } from '@/components/ui/hstack'
import { useWorkout } from '@/contexts/WorkoutContext'
import { router, useLocalSearchParams } from 'expo-router'
import { ArrowLeft, Bookmark, Heart, MoreVertical } from 'lucide-react-native'
import { useState } from 'react'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const UserProfilePage = () => {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const { saveWorkout, unsaveWorkout, isWorkoutSaved } = useWorkout();
  
  // Dados do usuário (em uma aplicação real, viriam da API)
  const [user] = useState({
    id: params.userId || '1',
    username: params.username || 'joao_treino',
    name: params.name || 'João Silva',
    avatar: params.avatar || '👨‍💪',
    isVerified: params.isVerified === 'true',
    bio: 'Personal trainer certificado com 5 anos de experiência. Especialista em treinos funcionais e hipertrofia.',
    followers: 1247,
    following: 89,
    workouts: 15,
    joinDate: '2022'
  });

  // Treinos criados pelo usuário (mockados)
  const [userWorkouts] = useState([
    { 
      id: 1, 
      name: 'Treino Full Body', 
      duration: '45 min', 
      difficulty: 'Iniciante',
      likes: 128,
      image: '💪',
      description: 'Treino completo para todo o corpo, ideal para iniciantes',
      exercises: 12,
      days: 3,
      createdAt: '2024-01-15'
    },
    { 
      id: 4, 
      name: 'Treino de Força', 
      duration: '60 min', 
      difficulty: 'Avançado',
      likes: 203,
      image: '🏋️‍♂️',
      description: 'Treino focado em ganho de força e massa muscular',
      exercises: 15,
      days: 5,
      createdAt: '2024-01-10'
    },
    { 
      id: 7, 
      name: 'Treino Cardio HIIT', 
      duration: '30 min', 
      difficulty: 'Intermediário',
      likes: 95,
      image: '🏃‍♂️',
      description: 'Treino de alta intensidade para queimar calorias',
      exercises: 8,
      days: 4,
      createdAt: '2024-01-05'
    },
    { 
      id: 10, 
      name: 'Treino Funcional', 
      duration: '40 min', 
      difficulty: 'Intermediário',
      likes: 67,
      image: '🤸‍♂️',
      description: 'Treino funcional para melhorar mobilidade e força',
      exercises: 10,
      days: 3,
      createdAt: '2024-01-01'
    }
  ]);

  const navigateToWorkoutDetails = (workout: any) => {
    router.push({
      pathname: '/workout-details',
      params: { 
        id: workout.id.toString(),
        fromUserProfile: 'true',
        workoutData: JSON.stringify(workout)
      }
    });
  };

  const handleSaveWorkout = (workout: any, event: any) => {
    event.stopPropagation();
    if (isWorkoutSaved(workout.id.toString())) {
      unsaveWorkout(workout.id.toString());
    } else {
      saveWorkout(workout);
    }
  };

  const renderWorkoutItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      className='bg-white rounded-lg overflow-hidden shadow-sm'
      style={{ width: '48%', marginBottom: 8 }}
      onPress={() => navigateToWorkoutDetails(item)}
    >
      <View className='aspect-square bg-gray-100 items-center justify-center relative'>
        <Text className='text-4xl'>{item.image}</Text>
        <TouchableOpacity
          className='absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm'
          onPress={(event) => handleSaveWorkout(item, event)}
        >
          <Bookmark 
            size={16} 
            color={isWorkoutSaved(item.id.toString()) ? '#10b981' : '#6b7280'} 
            fill={isWorkoutSaved(item.id.toString()) ? '#10b981' : 'transparent'}
          />
        </TouchableOpacity>
      </View>
      <View className='p-3'>
        <Text className='font-semibold text-typography-900 text-sm mb-1' numberOfLines={1}>
          {item.name}
        </Text>
        <HStack className='items-center gap-1 mb-1'>
          <Heart size={14} />
          <Text className='text-xs text-typography-500'>
            {item.likes}
          </Text>
        </HStack>
        <Text className='text-xs text-typography-600'>
          {item.duration} • {item.difficulty}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <View 
        style={{ 
          paddingTop: insets.top + 10,
          paddingHorizontal: 20,
          paddingBottom: 20,
          backgroundColor: '#f5f5f5'
        }}
      >
        <HStack className='items-center justify-between mb-4'>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#6b7280" />
          </TouchableOpacity>
          <Text className='text-lg font-semibold text-typography-900'>
            Perfil
          </Text>
          <TouchableOpacity>
            <MoreVertical size={24} color="#6b7280" />
          </TouchableOpacity>
        </HStack>
      </View>

      {/* Informações do Usuário */}
      <View className='bg-white px-5 py-6'>
        <HStack className='items-center mb-4'>
          <Text className='text-5xl mr-4'>{user.avatar}</Text>
          <View className='flex-1'>
            <HStack className='items-center gap-2 mb-1'>
              <Text className='text-xl font-bold text-typography-900'>
                {user.name}
              </Text>
              {user.isVerified && (
                <Text className='text-blue-500 text-lg'>✓</Text>
              )}
            </HStack>
            <Text className='text-typography-600 mb-2'>
              @{user.username}
            </Text>
            <Text className='text-typography-700 text-sm leading-5'>
              {user.bio}
            </Text>
          </View>
        </HStack>

        {/* Estatísticas */}
        <HStack className='justify-between py-4 border-t border-gray-100'>
          <View className='items-center'>
            <Text className='text-lg font-bold text-typography-900'>
              {user.workouts}
            </Text>
            <Text className='text-xs text-typography-600'>
              Treinos
            </Text>
          </View>
          <View className='items-center'>
            <Text className='text-lg font-bold text-typography-900'>
              {user.followers}
            </Text>
            <Text className='text-xs text-typography-600'>
              Seguidores
            </Text>
          </View>
          <View className='items-center'>
            <Text className='text-lg font-bold text-typography-900'>
              {user.following}
            </Text>
            <Text className='text-xs text-typography-600'>
              Seguindo
            </Text>
          </View>
        </HStack>

        {/* Botão Seguir */}
        <TouchableOpacity className='bg-primary-600 py-3 rounded-lg items-center'>
          <Text className='text-white font-semibold'>
            Seguir
          </Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Treinos */}
      <View className='flex-1 px-5 pt-4'>
        <Text className='text-lg font-semibold text-typography-900 mb-4'>
          Treinos Criados
        </Text>
        
        <FlatList
          data={userWorkouts}
          renderItem={renderWorkoutItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={{ 
            paddingBottom: insets.bottom + 20
          }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className='p-8 items-center'>
              <Text className='text-typography-600 text-center'>
                Este usuário ainda não criou nenhum treino
              </Text>
            </View>
          }
        />
      </View>
    </View>
  )
}

export default UserProfilePage 