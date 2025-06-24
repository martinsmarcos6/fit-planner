import { Button, ButtonIcon, ButtonText } from '@/components/ui/button'
import { HStack } from '@/components/ui/hstack'
import { Pressable } from '@/components/ui/pressable'
import { useWorkout } from '@/contexts/WorkoutContext'
import { router, useLocalSearchParams } from 'expo-router'
import { ArrowRight, Bookmark, Calendar, Clock, Coffee, Edit, Heart, Plus, Star, Target, User, X } from 'lucide-react-native'
import { useEffect, useState } from 'react'
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const WorkoutDetailsPage = () => {
  const insets = useSafeAreaInsets();
  const { id, fromExplore, workoutData } = useLocalSearchParams<{ 
    id: string, 
    fromExplore?: string, 
    workoutData?: string 
  }>();
  const { 
    getWorkout, 
    getSavedWorkout,
    saveWorkout, 
    unsaveWorkout, 
    isWorkoutSaved,
    addWeightRecord,
    addWeightRecordToSaved,
    getExerciseWeightHistory,
    getSavedExerciseWeightHistory
  } = useWorkout();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<any>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');

  // Se veio da tela de explorar, usar dados mockados
  const exploreWorkout = fromExplore === 'true' && workoutData ? JSON.parse(workoutData) : null;
  const localWorkout = getWorkout(id || '');
  const savedWorkout = getSavedWorkout(id || '');

  const workout = savedWorkout || exploreWorkout || localWorkout;
  const isFromSaved = savedWorkout !== undefined;

  console.log(workout);

  // Verificar se o treino está salvo
  useEffect(() => {
    if (workout) {
      setIsSaved(isWorkoutSaved(workout.id));
    }
  }, [workout, isWorkoutSaved]);

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
    if (fromExplore === 'true' && !isFromSaved) {
      // Se veio da tela de explorar e não está salvo, mostrar mensagem
      alert('Para registrar pesos, você precisa salvar este treino primeiro.');
      return;
    }
    
    router.push({
      pathname: '/day-details',
      params: { 
        workoutId: id, 
        dayIndex: dayIndex.toString(),
        fromSaved: isFromSaved ? 'true' : 'false'
      }
    });
  };

  const navigateToEdit = () => {
    if (fromExplore === 'true' && !isFromSaved) {
      alert('Para editar este treino, você precisa salvá-lo primeiro.');
      return;
    }
    
    router.push({
      pathname: '/edit-workout',
      params: { id: id }
    });
  };

  const handleSaveWorkout = () => {
    if (isSaved) {
      unsaveWorkout(workout.id);
      setIsSaved(false);
      alert('Treino removido dos salvos!');
    } else {
      saveWorkout(workout);
      setIsSaved(true);
      alert('Treino salvo com sucesso! Agora você pode registrar pesos nos exercícios.');
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const navigateToUserProfile = (username: string) => {
    // Navegar para o perfil do usuário usando o username
    router.navigate(`/(app)/user-profile?username=${username}`);
  };

  const openWeightModal = (exercise: any, dayIndex: number) => {
    setSelectedExercise(exercise);
    setSelectedDayIndex(dayIndex);
    setWeight('');
    setNotes('');
    setShowWeightModal(true);
  };

  const handleAddWeight = () => {
    if (!weight || !selectedExercise) return;

    const weightValue = parseFloat(weight);
    if (isNaN(weightValue)) {
      alert('Por favor, insira um peso válido.');
      return;
    }

    if (isFromSaved) {
      addWeightRecordToSaved(id, selectedDayIndex, selectedExercise.id, weightValue, notes);
    } else {
      addWeightRecord(id, selectedDayIndex, selectedExercise.id, weightValue, notes);
    }

    setShowWeightModal(false);
    setSelectedExercise(null);
    setWeight('');
    setNotes('');
  };

  const getWeightHistory = (exercise: any, dayIndex: number) => {
    if (isFromSaved) {
      return getSavedExerciseWeightHistory(id, dayIndex, exercise.id);
    } else {
      return getExerciseWeightHistory(id, dayIndex, exercise.id);
    }
  };

  console.log('workout', workout)

  const renderExercise = (exercise: any, exerciseIndex: number, dayIndex: number) => {
    const weightHistory = getWeightHistory(exercise, dayIndex);
    const lastWeight = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : null;

    return (
      <View key={exerciseIndex} className='bg-gray-50 rounded p-3'>
        <HStack className='justify-between items-center'>
          <View className='flex-1'>
            <Text className='font-medium text-typography-900 text-sm'>
              {exercise.name}
            </Text>
            <HStack className='items-center gap-4 mt-1'>
              <Text className='text-xs text-typography-600'>
                {exercise.sets} séries
              </Text>
              <Text className='text-xs text-typography-600'>
                {exercise.reps}
              </Text>
              {exercise.rest !== '0s' && (
                <Text className='text-xs text-typography-600'>
                  Desc: {exercise.rest}
                </Text>
              )}
            </HStack>
            {lastWeight && (
              <Text className='text-xs text-green-600 mt-1'>
                Último peso: {lastWeight}kg
              </Text>
            )}
          </View>
          <TouchableOpacity
            className='bg-primary-500 rounded-full p-2'
            onPress={() => openWeightModal(exercise, dayIndex)}
          >
            <Plus size={16} color="white" />
          </TouchableOpacity>
        </HStack>
      </View>
    );
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
            <HStack className='items-center gap-3 flex-1 mr-4'>
              <Text className='text-3xl font-bold text-typography-900'>
                {workout.name}
              </Text>
            </HStack>
            <HStack className='gap-2'>
              {fromExplore === 'true' ? (
                <Button 
                  size='sm' 
                  variant='outline' 
                  onPress={handleSaveWorkout}
                  className={isSaved ? 'bg-green-50 border-green-300' : ''}
                >
                  <ButtonIcon as={Bookmark} className={isSaved ? 'text-green-600' : 'text-gray-600'} />
                  <ButtonText className={isSaved ? 'text-green-600' : 'text-gray-600'}>
                    {isSaved ? 'Salvo' : 'Salvar'}
                  </ButtonText>
                </Button>
              ) : (
                <Button size='sm' variant='outline' onPress={navigateToEdit}>
                  <ButtonIcon as={Edit} />
                </Button>
              )}
              <Button size='sm' variant='outline' onPress={() => router.back()}>
                <ButtonIcon as={X} />
              </Button>
            </HStack>
          </HStack>
          
          {/* Informações do treino */}
          <View className='bg-white rounded-lg p-4 border border-gray-200 mb-6'>
            <HStack className='items-center gap-2 mb-3'>
              <Target size={16} className='text-blue-600' />
              <Text className='text-typography-900 font-semibold'>Detalhes do Treino</Text>
            </HStack>
            
            {/* Informações específicas para treinos da tela de explorar */}
            {fromExplore === 'true' && exploreWorkout ? (
              <View className='space-y-3'>
                <TouchableOpacity 
                  onPress={() => navigateToUserProfile(exploreWorkout.username)}
                  className='flex-row items-center gap-2'
                >
                  <User size={14} className='text-typography-500' />
                  <Text className='text-typography-600 text-sm'>
                    Criado por @{exploreWorkout.username}
                  </Text>
                  <Text className='text-blue-500 text-xs'>Ver perfil</Text>
                </TouchableOpacity>
                <HStack className='items-center gap-2'>
                  <Clock size={14} className='text-typography-500' />
                  <Text className='text-typography-600 text-sm'>
                    Duração: {exploreWorkout.duration}
                  </Text>
                </HStack>
                <HStack className='items-center gap-2'>
                  <Star size={14} className='text-typography-500' />
                  <Text className='text-typography-600 text-sm'>
                    Dificuldade: {exploreWorkout.difficulty}
                  </Text>
                </HStack>
                <HStack className='items-center gap-2'>
                  <Heart size={14} className='text-typography-500' />
                  <Text className='text-typography-600 text-sm'>
                    {exploreWorkout.likes} curtidas
                  </Text>
                </HStack>
                {exploreWorkout.description && (
                  <Text className='text-typography-600 text-sm mt-2'>
                    {exploreWorkout.description}
                  </Text>
                )}
              </View>
            ) : (
              <HStack className='items-center gap-2'>
                <Calendar size={14} className='text-typography-500' />
                <Text className='text-typography-600 text-sm'>
                  Criado em {workout.createdAt.toLocaleDateString('pt-BR')}
                </Text>
              </HStack>
            )}
            
            {/* Descrição do treino (se existir) */}
            {workout.description && (
              <View className='mt-3 pt-3 border-t border-gray-100'>
                <Text className='text-typography-600 text-sm'>
                  {workout.description}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Dias da Semana */}
        <View className='flex-col gap-4'>
          <Text className='text-xl font-bold text-typography-900 mb-2'>
            Dias do Treino
          </Text>
          
          {(fromExplore === 'true' || isFromSaved) ? (
            // Para treinos da tela de explorar ou salvos, mostrar dias com exercícios e registro de pesos
            workout.days.sort((a: any, b: any) => a.order_index - b.order_index).map((day: any, dayIndex: number) => (
              <View 
                key={dayIndex}
                className={`rounded-lg border overflow-hidden ${
                  day.isRestDay 
                    ? 'bg-orange-50 border-orange-200' 
                    : 'bg-white border-gray-200'
                }`} 
              >
                <Pressable 
                  onPress={() => navigateToDayDetails(dayIndex)}
                  className='p-4'
                >
                  <HStack className='justify-between items-center mb-3'>
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
                        <Text className='text-typography-600 text-sm'>
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
                </Pressable>
                
                {!day.isRestDay && (
                  <View className='px-4 pb-4'>
                    <View className='space-y-2'>
                      {day.exercises.map((exercise: any, exerciseIndex: number) => (
                        <View key={exerciseIndex} className='bg-gray-50 rounded p-3 border border-gray-200'>
                          <HStack className='justify-between items-center'>
                            <View className='flex-1'>
                              <Text className='font-medium text-typography-900 text-sm'>
                                {exercise.name}
                              </Text>
                              <HStack className='items-center gap-4 mt-1'>
                                <Text className='text-xs text-typography-600'>
                                  {exercise.sets} séries
                                </Text>
                                <Text className='text-xs text-typography-600'>
                                  {exercise.reps}
                                </Text>
                                {exercise.rest !== '0s' && (
                                  <Text className='text-xs text-typography-600'>
                                    Desc: {exercise.rest}
                                  </Text>
                                )}
                              </HStack>
                            </View>
                          </HStack>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            ))
          ) : (
            // Para treinos locais, mostrar dias detalhados
            workout.days.sort((a: any, b: any) => a.order_index - b.order_index).map((day: any, dayIndex: number) => (
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
            ))
          )}
        </View>

        {/* Botão de Like */}
        {fromExplore === 'true' && (
          <View className='mt-6'>
            <Button 
              className={`w-full ${isLiked ? 'bg-red-500' : 'bg-gray-200'}`}
              onPress={handleLike}
            >
              <ButtonIcon as={Heart} className={isLiked ? 'text-white' : 'text-gray-600'} />
              <ButtonText className={isLiked ? 'text-white' : 'text-gray-600'}>
                {isLiked ? 'Curtido' : 'Curtir'}
              </ButtonText>
            </Button>
          </View>
        )}

        {/* Resumo */}
        <View className='mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200'>
          <Text className='text-blue-900 font-semibold mb-2'>
            {fromExplore === 'true' ? 'Sobre este Treino' : 'Resumo do Treino'}
          </Text>
          <Text className='text-blue-800 text-sm'>
            {fromExplore === 'true' 
              ? `Este treino foi criado por @${exploreWorkout.username} e possui ${exploreWorkout.days.filter((day: any) => !day.isRestDay).length} dia${exploreWorkout.days.filter((day: any) => !day.isRestDay).length > 1 ? 's' : ''} de treino com ${exploreWorkout.days.reduce((total: number, day: any) => total + day.exercises.length, 0)} exercícios no total.`
              : `Este treino possui ${workout.days.filter((day: any) => !day.isRestDay).length} dia${workout.days.filter((day: any) => !day.isRestDay).length !== 1 ? 's' : ''} de treino com um total de ${workout.days.reduce((total: number, day: any) => total + day.exercises.length, 0)} exercícios.`
            }
          </Text>
        </View>
      </ScrollView>

      {/* Weight Modal */}
      {showWeightModal && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={showWeightModal}
          onRequestClose={() => {
            setShowWeightModal(false);
          }}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <View className='bg-white rounded-2xl p-6 mx-4 w-80'>
              <Text className='text-xl font-bold text-typography-900 mb-4 text-center'>
                Registrar Peso
              </Text>
              
              {selectedExercise && (
                <Text className='text-typography-600 text-sm mb-4 text-center'>
                  {selectedExercise.name}
                </Text>
              )}
              
              <View className='space-y-4'>
                <View>
                  <Text className='text-sm font-medium text-typography-700 mb-2'>
                    Peso (kg)
                  </Text>
                  <TextInput
                    placeholder="Ex: 50"
                    value={weight}
                    onChangeText={setWeight}
                    keyboardType="numeric"
                    className='border border-gray-300 rounded-lg px-4 py-3 text-typography-900'
                  />
                </View>
                
                <View>
                  <Text className='text-sm font-medium text-typography-700 mb-2'>
                    Notas (opcional)
                  </Text>
                  <TextInput
                    placeholder="Ex: Fácil, difícil, etc."
                    value={notes}
                    onChangeText={setNotes}
                    multiline
                    numberOfLines={3}
                    className='border border-gray-300 rounded-lg px-4 py-3 text-typography-900'
                  />
                </View>
              </View>
              
              <HStack className='gap-3 mt-6'>
                <Button 
                  className='flex-1 bg-gray-200' 
                  onPress={() => setShowWeightModal(false)}
                >
                  <ButtonText className='text-typography-700'>Cancelar</ButtonText>
                </Button>
                <Button 
                  className='flex-1 bg-primary-500' 
                  onPress={handleAddWeight}
                >
                  <ButtonText className='text-white'>Registrar</ButtonText>
                </Button>
              </HStack>
            </View>
          </View>
        </Modal>
      )}
    </View>
  )
}

export default WorkoutDetailsPage 