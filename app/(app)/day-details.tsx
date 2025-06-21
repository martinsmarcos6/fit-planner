import { Button, ButtonIcon, ButtonText } from '@/components/ui/button'
import { HStack } from '@/components/ui/hstack'
import WeightTracker from '@/components/WeightTracker'
import { useWorkout } from '@/contexts/WorkoutContext'
import { router, useLocalSearchParams } from 'expo-router'
import { ArrowLeft, Calendar, Coffee, Target } from 'lucide-react-native'
import { ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const DayDetailsPage = () => {
  const insets = useSafeAreaInsets();
  const { workoutId, dayIndex, fromSaved } = useLocalSearchParams<{ 
    workoutId: string; 
    dayIndex: string;
    fromSaved?: string;
  }>();
  const { getWorkout, getSavedWorkout } = useWorkout();

  const isFromSaved = fromSaved === 'true';
  const localWorkout = getWorkout(workoutId || '');
  const savedWorkout = getSavedWorkout(workoutId || '');
  
  const workout = isFromSaved ? savedWorkout : localWorkout;
  const dayIndexNum = parseInt(dayIndex || '0');
  
  // Usar a estrutura correta baseada no tipo de treino
  const day = isFromSaved && savedWorkout
    ? savedWorkout.workoutDays[dayIndexNum]
    : localWorkout?.days[dayIndexNum];

  if (!workout || !day) {
    return (
      <View style={{ flex: 1, backgroundColor: '#f5f5f5', justifyContent: 'center', alignItems: 'center' }}>
        <Text className='text-typography-600'>Dia não encontrado</Text>
        <Button onPress={() => router.back()} className='mt-4'>
          <ButtonText>Voltar</ButtonText>
        </Button>
      </View>
    );
  }

  // Função para obter a data apropriada
  const getWorkoutDate = () => {
    if (isFromSaved && savedWorkout) {
      return savedWorkout.savedAt.toLocaleDateString('pt-BR');
    } else if (localWorkout) {
      return localWorkout.createdAt.toLocaleDateString('pt-BR');
    }
    return '';
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
            <Button 
              size='sm' 
              variant='outline' 
              onPress={() => router.back()}
              className='mr-4'
            >
              <ButtonIcon as={ArrowLeft} />
            </Button>
            <View className='flex-1'>
              <HStack className='items-center gap-2 mb-1'>
                <Text className='text-2xl font-bold text-typography-900'>
                  {day.day}
                </Text>
                {day.isRestDay && (
                  <Coffee size={20} className='text-orange-600' />
                )}
              </HStack>
              {day.division && (
                <Text className='text-typography-600 text-sm mt-1'>
                  {day.division}
                </Text>
              )}
              {day.isRestDay && (
                <Text className='text-orange-600 font-medium text-sm mt-1'>
                  Dia de Descanso
                </Text>
              )}
            </View>
          </HStack>
          
          {/* Informações do treino */}
          <View className='bg-white rounded-lg p-4 border border-gray-200 mb-6'>
            <HStack className='items-center gap-2 mb-2'>
              <Target size={16} className='text-blue-600' />
              <Text className='text-typography-900 font-semibold'>{workout.name}</Text>
            </HStack>
            <HStack className='items-center gap-2'>
              <Calendar size={14} className='text-typography-500' />
              <Text className='text-typography-600 text-sm'>
                {isFromSaved 
                  ? `Salvo em ${getWorkoutDate()}`
                  : `Criado em ${getWorkoutDate()}`
                }
              </Text>
            </HStack>
          </View>
        </View>

        {/* Conteúdo do Dia */}
        {day.isRestDay ? (
          <View className='bg-orange-50 rounded-lg p-8 border border-orange-200'>
            <View className='items-center'>
              <Coffee size={48} className='text-orange-600 mb-4' />
              <Text className='text-orange-800 text-xl font-bold text-center mb-2'>
                Dia de Descanso
              </Text>
              <Text className='text-orange-700 text-center text-lg'>
                Aproveite para recuperar e descansar!
              </Text>
              <Text className='text-orange-600 text-center text-sm mt-4'>
                O descanso é fundamental para o crescimento muscular e recuperação.
              </Text>
            </View>
          </View>
        ) : (
          <View className='flex-col gap-4'>
            {day.exercises.length === 0 ? (
              <View className='bg-white rounded-lg p-8 border border-gray-200'>
                <Text className='text-typography-500 text-center text-lg'>
                  Nenhum exercício cadastrado para este dia
                </Text>
                <Text className='text-typography-400 text-center text-sm mt-2'>
                  Adicione exercícios ao criar ou editar o treino
                </Text>
              </View>
            ) : (
              day.exercises.map((exercise: any, exerciseIndex: number) => (
                <View key={exercise.id} className='bg-white rounded-lg p-4 border border-gray-200'>
                  <View className='flex-col gap-3'>
                    {/* Header do exercício */}
                    <View className='flex-col gap-1'>
                      <Text className='text-xl font-bold text-typography-900'>
                        {exercise.name}
                      </Text>
                      <Text className='text-typography-500 text-sm'>
                        Exercício {exerciseIndex + 1} de {day.exercises.length}
                      </Text>
                    </View>

                    {/* Configurações do exercício */}
                    <View className='bg-gray-50 rounded-lg p-3 border border-gray-200'>
                      <HStack className='gap-6'>
                        <View className='flex-1'>
                          <Text className='text-typography-600 text-sm font-medium'>Séries</Text>
                          <Text className='text-typography-900 text-lg font-bold'>{exercise.sets}</Text>
                        </View>
                        <View className='flex-1'>
                          <Text className='text-typography-600 text-sm font-medium'>Repetições</Text>
                          <Text className='text-typography-900 text-lg font-bold'>{exercise.reps}</Text>
                        </View>
                      </HStack>
                    </View>
                    
                    {/* Componente de rastreamento de peso */}
                    {exercise.id && (
                      <WeightTracker
                        workoutId={workoutId || ''}
                        dayIndex={dayIndexNum}
                        exerciseId={exercise.id}
                        exerciseName={exercise.name}
                      />
                    )}
                  </View>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </View>
  )
}

export default DayDetailsPage 