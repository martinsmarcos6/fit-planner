import { Button, ButtonIcon } from '@/components/ui/button'
import { HStack } from '@/components/ui/hstack'
import { Pressable } from '@/components/ui/pressable'
import { useWorkout } from '@/contexts/WorkoutContext'
import { router } from 'expo-router'
import { ChevronRight, Plus } from 'lucide-react-native'
import { ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const WorkoutsPage = () => {
  const insets = useSafeAreaInsets();
  const { workouts } = useWorkout();
  
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
  
  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <ScrollView 
        style={{ flex: 1 }} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 80,
          paddingHorizontal: 20
        }}
      >
        {/* Header */}
        <View className='mb-6'>
          <HStack className='justify-between items-center'>
            <Text className='text-3xl font-bold text-typography-900 mb-2'>
              Meus Treinos
            </Text>

            <Pressable 
              className='bg-primary-500 rounded-lg px-4 py-2 flex-row items-center gap-2'
              onPress={handleCreateWorkout}
            >
              <Plus size={16} color="white" />
              <Text className='text-white font-semibold text-sm'>Novo Treino</Text>
            </Pressable>
          </HStack>
          <Text className='text-typography-600'>
            Gerencie seus treinos e acompanhe seu progresso
          </Text>
        </View>

        {/* Meus Treinos */}
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
                className='bg-gray-50 rounded-lg p-4 border border-gray-200'
                onPress={() => handleWorkoutDetails(workout.id)}
              >
                <HStack className='justify-between items-center'>
                  <View className='flex-1'>
                    <Text className='text-lg font-semibold text-typography-900'>
                      {workout.name}
                    </Text>
                    <Text className='text-typography-600 text-sm mt-1'>
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
      </ScrollView>
    </View>
  )
}

export default WorkoutsPage 