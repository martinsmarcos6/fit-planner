import { Button, ButtonIcon, ButtonText } from '@/components/ui/button'
import { HStack } from '@/components/ui/hstack'
import { Pressable } from '@/components/ui/pressable'
import { useWorkout } from '@/contexts/WorkoutContext'
import { router, useLocalSearchParams } from 'expo-router'
import { ArrowRight, Calendar, Coffee, Edit, Target, X } from 'lucide-react-native'
import { ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const WorkoutDetailsPage = () => {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getWorkout } = useWorkout();

  const workout = getWorkout(id || '');

  if (!id || !workout) {
    return (
      <View style={{ flex: 1, backgroundColor: '#f5f5f5', justifyContent: 'center', alignItems: 'center' }}>
        <Text className='text-typography-600'>Treino não encontrado</Text>
        <Button onPress={() => router.back()} className='mt-4'>
          <ButtonText>Voltar</ButtonText>
        </Button>
      </View>
    );
  }

  const navigateToDayDetails = (dayIndex: number) => {
    router.push({
      pathname: '/day-details',
      params: { workoutId: id, dayIndex: dayIndex.toString() }
    });
  };

  const navigateToEdit = () => {
    router.push({
      pathname: '/edit-workout',
      params: { id: id }
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <ScrollView 
        style={{ flex: 1 }} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 20,
          paddingHorizontal: 20
        }}
      >
        {/* Header */}
        <View className='mb-6'>
          <HStack className='justify-between items-center mb-4'>
            <Text className='text-3xl font-bold text-typography-900'>
              {workout.name}
            </Text>
            <HStack className='gap-2'>
              <Button size='sm' variant='outline' onPress={navigateToEdit}>
                <ButtonIcon as={Edit} />
              </Button>
              <Button size='sm' variant='outline' onPress={() => router.back()}>
                <ButtonIcon as={X} />
              </Button>
            </HStack>
          </HStack>
          
          {/* Informações do treino */}
          <View className='bg-white rounded-lg p-4 border border-gray-200 mb-6'>
            <HStack className='items-center gap-2 mb-2'>
              <Target size={16} className='text-blue-600' />
              <Text className='text-typography-900 font-semibold'>Detalhes do Treino</Text>
            </HStack>
            <HStack className='items-center gap-2'>
              <Calendar size={14} className='text-typography-500' />
              <Text className='text-typography-600 text-sm'>
                Criado em {workout.createdAt.toLocaleDateString('pt-BR')}
              </Text>
            </HStack>
          </View>
        </View>

        {/* Dias da Semana */}
        <View className='flex-col gap-4'>
          <Text className='text-xl font-bold text-typography-900 mb-2'>
            Dias do Treino
          </Text>
          
          {workout.days.map((day, dayIndex) => (
            <Pressable 
              key={dayIndex}
              onPress={() => navigateToDayDetails(dayIndex)}
              className={`rounded-lg border overflow-hidden ${
                day.isRestDay 
                  ? 'bg-orange-50 border-orange-200' 
                  : 'bg-white border-gray-200'
              }`}
            >
              <View className='p-4'>
                <HStack className='justify-between items-center'>
                  <View className='flex-1'>
                    <HStack className='items-center gap-2 mb-1'>
                      <Text className={`text-lg font-semibold ${
                        day.isRestDay ? 'text-orange-800' : 'text-typography-900'
                      }`}>
                        {day.day}
                      </Text>
                      {day.isRestDay && (
                        <Coffee size={16} className='text-orange-600' />
                      )}
                    </HStack>
                    {day.division && (
                      <Text className='text-typography-600 text-sm mt-1'>
                        {day.division}
                      </Text>
                    )}
                    <Text className={`text-sm mt-2 ${
                      day.isRestDay ? 'text-orange-600' : 'text-typography-500'
                    }`}>
                      {day.isRestDay 
                        ? 'Dia de Descanso' 
                        : `${day.exercises.length} exercício${day.exercises.length !== 1 ? 's' : ''}`
                      }
                    </Text>
                  </View>
                  <Button size='sm' variant='outline'>
                    <ButtonIcon as={ArrowRight} />
                  </Button>
                </HStack>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Resumo */}
        <View className='mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200'>
          <Text className='text-blue-900 font-semibold mb-2'>Resumo do Treino</Text>
          <Text className='text-blue-800 text-sm'>
            Este treino possui {workout.days.filter(day => !day.isRestDay).length} dia{workout.days.filter(day => !day.isRestDay).length !== 1 ? 's' : ''} de treino 
            com um total de {workout.days.reduce((total, day) => total + day.exercises.length, 0)} exercícios.
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}

export default WorkoutDetailsPage 