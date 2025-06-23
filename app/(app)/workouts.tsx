import { Button, ButtonIcon } from '@/components/ui/button'
import { HStack } from '@/components/ui/hstack'
import { Pressable } from '@/components/ui/pressable'
import { useWorkout } from '@/contexts/WorkoutContext'
import { router } from 'expo-router'
import { ChevronRight, Heart, Plus, User } from 'lucide-react-native'
import { useState } from 'react'
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const WorkoutsPage = () => {
  const insets = useSafeAreaInsets();
  const { workouts, savedWorkouts, loading } = useWorkout();
  const [activeTab, setActiveTab] = useState<'my' | 'saved'>('my');
  
  const handleCreateWorkout = () => {
    try {
      router.push('/(app)/create-workout')
      console.log('Navegação executada com sucesso')
    } catch (error) {
      console.error('Erro na navegação:', error)
    }
  }

  const handleWorkoutDetails = (id: string) => {
    try {
      router.push(`/(app)/workout-details?id=${id}`)
      console.log('Navegação para detalhes executada com sucesso')
    } catch (error) {
      console.error('Erro na navegação:', error)
    }
  }

  const handleSavedWorkoutDetails = (workout: any) => {
    try {
      router.push({
        pathname: '/workout-details',
        params: { 
          id: workout.id,
          fromExplore: 'true',
          workoutData: JSON.stringify(workout)
        }
      })
    } catch (error) {
      console.error('Erro na navegação:', error)
    }
  }
  
  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <View 
        style={{ 
          paddingTop: insets.top + 20,
          paddingHorizontal: 20,
          paddingBottom: 20,
          backgroundColor: '#f5f5f5'
        }}
      >
        <HStack className='justify-between items-center mb-4'>
          <Text className='text-3xl font-bold text-typography-900'>
            Treinos
          </Text>

          <Pressable 
            className='bg-primary-500 rounded-lg px-4 py-2 flex-row items-center gap-2'
            onPress={handleCreateWorkout}
          >
            <Plus size={16} color="white" />
            <Text className='text-white font-semibold text-sm'>Novo Treino</Text>
          </Pressable>
        </HStack>

        {/* Tabs */}
        <View className='flex-row bg-white rounded-lg p-1 border border-gray-200'>
          <TouchableOpacity
            className={`flex-1 py-3 px-4 rounded-md ${activeTab === 'my' ? 'bg-primary-500' : 'bg-transparent'}`}
            onPress={() => setActiveTab('my')}
          >
            <Text className={`text-center font-medium ${activeTab === 'my' ? 'text-white' : 'text-typography-600'}`}>
              Meus Treinos ({workouts.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-3 px-4 rounded-md ${activeTab === 'saved' ? 'bg-primary-500' : 'bg-transparent'}`}
            onPress={() => setActiveTab('saved')}
          >
            <Text className={`text-center font-medium ${activeTab === 'saved' ? 'text-white' : 'text-typography-600'}`}>
              Salvos ({savedWorkouts.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView 
        style={{ flex: 1 }} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 80
        }}
      >
        {loading ? (
          <View className='flex-1 justify-center items-center py-20'>
            <ActivityIndicator size="large" color="#6366f1" />
            <Text className='text-typography-600 mt-4'>Carregando treinos...</Text>
          </View>
        ) : activeTab === 'my' ? (
          // Aba Meus Treinos
          <View className='flex-col gap-3'>
            {workouts.length === 0 ? (
              <View className='bg-white rounded-lg p-8 border border-gray-200 items-center'>
                <Text className='text-typography-600 text-center mb-4'>
                  Você ainda não tem treinos criados
                </Text>
                <Text className='text-typography-500 text-center text-sm'>
                  Clique em &quot;Novo Treino&quot; para criar seu primeiro treino
                </Text>
              </View>
            ) : (
              workouts.map((workout) => (
                <Pressable 
                  key={workout.id}
                  className='bg-white rounded-lg p-4 border border-gray-200 shadow-sm'
                  onPress={() => handleWorkoutDetails(workout.id)}
                >
                  <HStack className='justify-between items-center'>
                    <View className='flex-1'>
                      <HStack className='items-center gap-2 mb-1'>
                        <Text className='text-lg font-semibold text-typography-900'>
                          {workout.name}
                        </Text>
                      </HStack>
                      {workout.description && (
                        <Text className='text-typography-600 text-sm mb-1'>
                          {workout.description}
                        </Text>
                      )}
                      <HStack className='items-center gap-2 mb-1'>
                        <User size={12} className='text-typography-500' />
                        <Text className='text-typography-600 text-sm'>
                          @{workout.username}
                        </Text>
                      </HStack>
                      <HStack className='items-center gap-4'>
                        <HStack className='items-center gap-1'>
                          <Heart size={12} className='text-typography-500' />
                          <Text className='text-typography-500 text-xs'>
                            {workout.likes_count}
                          </Text>
                        </HStack>
                      </HStack>
                      <Text className='text-typography-500 text-xs mt-1'>
                        Criado em {workout.createdAt.toLocaleDateString('pt-BR')}
                      </Text>
                    </View>

                    <Button size='sm' variant='outline' className='border-primary-300'>
                      <ButtonIcon as={ChevronRight} />
                    </Button>
                  </HStack>
                </Pressable>
              ))
            )}
          </View>
        ) : (
          // Aba Treinos Salvos
          <View className='flex-col gap-3'>
            {savedWorkouts.length === 0 ? (
              <View className='bg-white rounded-lg p-8 border border-gray-200 items-center'>
                <Text className='text-typography-600 text-center mb-4'>
                  Você ainda não salvou nenhum treino
                </Text>
                <Text className='text-typography-500 text-center text-sm'>
                  Explore treinos na aba &quot;Explorar&quot; e salve os que gostar
                </Text>
              </View>
            ) : (
              savedWorkouts.map((workout) => (
                <Pressable 
                  key={workout.id}
                  className='bg-white rounded-lg p-4 border border-gray-200 shadow-sm'
                  onPress={() => handleSavedWorkoutDetails(workout)}
                >
                  <HStack className='justify-between items-center'>
                    <View className='flex-1'>
                      <HStack className='items-center gap-2 mb-1'>
                        <Text className='text-lg font-semibold text-typography-900'>
                          {workout.name}
                        </Text>
                        <Text className='text-2xl'>{workout.emoji}</Text>
                      </HStack>
                      {workout.description && (
                        <Text className='text-typography-600 text-sm mb-1'>
                          {workout.description}
                        </Text>
                      )}
                      <HStack className='items-center gap-2 mb-1'>
                        <User size={12} className='text-typography-500' />
                        <Text className='text-typography-600 text-sm'>
                          @{workout.username}
                        </Text>
                      </HStack>
                      <HStack className='items-center gap-4'>
                        <HStack className='items-center gap-1'>
                          <Heart size={12} className='text-typography-500' />
                          <Text className='text-typography-500 text-xs'>
                            {workout.likes_count}
                          </Text>
                        </HStack>
                      </HStack>
                      <Text className='text-typography-500 text-xs mt-1'>
                        Salvo em {workout.createdAt.toLocaleDateString('pt-BR')}
                      </Text>
                    </View>

                    <Button size='sm' variant='outline' className='border-primary-300'>
                      <ButtonIcon as={ChevronRight} />
                    </Button>
                  </HStack>
                </Pressable>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </View>
  )
}

export default WorkoutsPage 