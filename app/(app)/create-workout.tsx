import { Button, ButtonIcon, ButtonText } from '@/components/ui/button'
import { Checkbox, CheckboxIcon, CheckboxIndicator, CheckboxLabel } from '@/components/ui/checkbox'
import { FormControl, FormControlLabel, FormControlLabelText } from '@/components/ui/form-control'
import { HStack } from '@/components/ui/hstack'
import { Input, InputField } from '@/components/ui/input'
import { Pressable } from '@/components/ui/pressable'
import { useAuthContext } from '@/contexts/AuthContext'
import { useWorkout } from '@/contexts/WorkoutContext'
import { router } from 'expo-router'
import { Check, ChevronDown, ChevronUp, Plus, Trash2, X } from 'lucide-react-native'
import { useEffect, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface Exercise {
  id: string
  name: string
  sets: number
  reps: string
  weightHistory: any[]
}

interface DayWorkout {
  day: string
  division: string
  exercises: Exercise[]
  isExpanded: boolean
  isRestDay: boolean
}

const CreateWorkoutPage = () => {
  const insets = useSafeAreaInsets();
  const { addWorkout } = useWorkout();
  const { user } = useAuthContext();
  const [workoutName, setWorkoutName] = useState('')
  const [workoutDescription, setWorkoutDescription] = useState('')
  const [selectedEmoji, setSelectedEmoji] = useState('💪')
  const [showEmojiPopup, setShowEmojiPopup] = useState(false)
  const [days, setDays] = useState<DayWorkout[]>([
    { day: 'Segunda-feira', division: '', exercises: [], isExpanded: false, isRestDay: false },
    { day: 'Terça-feira', division: '', exercises: [], isExpanded: false, isRestDay: false },
    { day: 'Quarta-feira', division: '', exercises: [], isExpanded: false, isRestDay: false },
    { day: 'Quinta-feira', division: '', exercises: [], isExpanded: false, isRestDay: false },
    { day: 'Sexta-feira', division: '', exercises: [], isExpanded: false, isRestDay: false },
    { day: 'Sábado', division: '', exercises: [], isExpanded: false, isRestDay: false },
    { day: 'Domingo', division: '', exercises: [], isExpanded: false, isRestDay: false },
  ])

  // Emojis predefinidos para seleção
  const workoutEmojis = [
    '💪', '🏋️', '🔥', '⚡', '💯', '🎯', '🚀', '⭐', '🌟', '💎',
    '🏃', '🚴', '🏊', '🧘', '🥊'
  ]

  // Limpar estado quando a página é montada
  useEffect(() => {
    setWorkoutName('')
    setWorkoutDescription('')
    setSelectedEmoji('💪')
    setShowEmojiPopup(false)
    setDays([
      { day: 'Segunda-feira', division: '', exercises: [], isExpanded: false, isRestDay: false },
      { day: 'Terça-feira', division: '', exercises: [], isExpanded: false, isRestDay: false },
      { day: 'Quarta-feira', division: '', exercises: [], isExpanded: false, isRestDay: false },
      { day: 'Quinta-feira', division: '', exercises: [], isExpanded: false, isRestDay: false },
      { day: 'Sexta-feira', division: '', exercises: [], isExpanded: false, isRestDay: false },
      { day: 'Sábado', division: '', exercises: [], isExpanded: false, isRestDay: false },
      { day: 'Domingo', division: '', exercises: [], isExpanded: false, isRestDay: false },
    ])
  }, [])

  const toggleDayExpansion = (index: number) => {
    const updatedDays = [...days]
    updatedDays[index].isExpanded = !updatedDays[index].isExpanded
    setDays(updatedDays)
  }

  const updateDivision = (index: number, division: string) => {
    const updatedDays = [...days]
    updatedDays[index].division = division
    setDays(updatedDays)
  }

  const toggleRestDay = (index: number) => {
    const updatedDays = [...days]
    updatedDays[index].isRestDay = !updatedDays[index].isRestDay
    setDays(updatedDays)
  }

  const addExercise = (dayIndex: number) => {
    const updatedDays = [...days]
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: '',
      sets: 3,
      reps: '8-12',
      weightHistory: []
    }
    updatedDays[dayIndex].exercises.push(newExercise)
    setDays(updatedDays)
  }

  const updateExercise = (dayIndex: number, exerciseIndex: number, field: keyof Exercise, value: string | number) => {
    const updatedDays = [...days]
    updatedDays[dayIndex].exercises[exerciseIndex][field] = value as never
    setDays(updatedDays)
  }

  const removeExercise = (dayIndex: number, exerciseIndex: number) => {
    const updatedDays = [...days]
    updatedDays[dayIndex].exercises.splice(exerciseIndex, 1)
    setDays(updatedDays)
  }

  const saveWorkout = async () => {
    if (!workoutName.trim()) {
      alert('Por favor, insira um nome para o treino')
      return
    }

    if (!user) {
      alert('Usuário não autenticado')
      return
    }

    try {
      // Remove a propriedade isExpanded dos dias antes de salvar
      const daysToSave = days
        .filter(day => !day.isRestDay || day.exercises.length > 0) // Remove dias vazios
        .map(({ isExpanded, ...day }) => ({
          ...day,
          isRestDay: day.isRestDay
        }))
      
      await addWorkout({
        name: workoutName,
        description: workoutDescription,
        emoji: selectedEmoji,
        days: daysToSave,
        username: user.name
      })

      router.back()
    } catch (error) {
      console.error('Erro ao criar treino:', error)
      alert('Erro ao criar treino. Tente novamente.')
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <ScrollView 
        style={{ flex: 1 }} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 100,
          paddingHorizontal: 20
        }}
      >
        {/* Header */}
        <View className='mb-6'>
          <HStack className='justify-between items-center mb-4'>
            <Text className='text-3xl font-bold text-typography-900'>
              Novo Treino
            </Text>
            <Button size='sm' variant='outline' onPress={() => router.back()}>
              <ButtonIcon as={X} />
            </Button>
          </HStack>
        </View>

        {/* Emoji Avatar - Primeiro Campo */}
        <View className='mb-6 items-center'>
          <Text className='text-typography-700 font-medium mb-3'>Emoji do Treino</Text>
          <Pressable 
            onPress={() => setShowEmojiPopup(!showEmojiPopup)}
            className='w-20 h-20 bg-white border-2 border-gray-200 rounded-full items-center justify-center shadow-sm'
          >
            <Text className='text-4xl'>{selectedEmoji}</Text>
          </Pressable>
          
          {showEmojiPopup && (
            <View className='mt-4 bg-white border border-gray-200 rounded-lg p-4 w-full shadow-lg'>
              <Text className='text-typography-700 font-medium mb-4 text-center'>Selecione um emoji:</Text>
              <View className='flex-row flex-wrap justify-center gap-3'>
                {workoutEmojis.map((emoji) => (
                  <Pressable 
                    key={emoji}
                    onPress={() => {
                      setSelectedEmoji(emoji)
                      setShowEmojiPopup(false)
                    }}
                    className={`w-12 h-12 rounded-full items-center justify-center border-2 ${
                      selectedEmoji === emoji 
                        ? 'border-primary-500 bg-primary-50' 
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <Text className='text-2xl'>{emoji}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Nome do Treino */}
        <View className='mb-6'>
          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Nome do Treino</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField 
                placeholder="Ex: PPL + Upper + Lower"
                value={workoutName}
                onChangeText={setWorkoutName}
              />
            </Input>
          </FormControl>
        </View>

        {/* Descrição do Treino */}
        <View className='mb-6'>
          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Descrição do Treino</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField 
                placeholder="Ex: Treino para aumentar a massa muscular"
                value={workoutDescription}
                onChangeText={setWorkoutDescription}
              />
            </Input>
          </FormControl>
        </View>

        {/* Dias da Semana */}
        <View className='flex-col gap-4'>
          {days.map((day, dayIndex) => (
            <View key={dayIndex} className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
              {/* Header do Dia */}
              <Pressable 
                onPress={() => toggleDayExpansion(dayIndex)}
                className='p-4 border-b border-gray-100'
              >
                <HStack className='justify-between items-center'>
                  <Text className='text-lg font-semibold text-typography-900'>
                    {day.day}
                  </Text>
                  <Button size='sm' variant='outline'>
                    <ButtonIcon as={day.isExpanded ? ChevronUp : ChevronDown} />
                  </Button>
                </HStack>
              </Pressable>

              {/* Conteúdo do Dia */}
              {day.isExpanded && (
                <View className='p-4'>
                  {/* Checkbox de Descanso */}
                  <View className='mb-4'>
                    <Checkbox
                      value={day.isRestDay ? 'rest' : ''}
                      onChange={() => toggleRestDay(dayIndex)}
                      className='mb-2'
                    >
                      <CheckboxIndicator>
                        <CheckboxIcon as={Check} />
                      </CheckboxIndicator>
                      <CheckboxLabel>Dia de Descanso</CheckboxLabel>
                    </Checkbox>
                    {day.isRestDay && (
                      <Text className='text-typography-500 text-sm ml-6'>
                        Este dia será marcado como descanso. Não será necessário adicionar exercícios.
                      </Text>
                    )}
                  </View>

                  {/* Divisão */}
                  {!day.isRestDay && <View className='mb-4'>
                    <FormControl>
                      <FormControlLabel>
                        <FormControlLabelText>Divisão</FormControlLabelText>
                      </FormControlLabel>
                      <Input>
                        <InputField 
                          placeholder="Ex: Push, Pull, Legs, Upper, Lower"
                          value={day.division}
                          onChangeText={(value: string) => updateDivision(dayIndex, value)}
                        />
                      </Input>
                    </FormControl>
                  </View>}

                  {/* Exercícios - Só mostra se não for dia de descanso */}
                  {!day.isRestDay && (
                    <View className='mb-4'>
                      <HStack className='justify-between items-center mb-3'>
                        <Text className='text-typography-900 font-semibold'>Exercícios</Text>
                        <Button size='sm' onPress={() => addExercise(dayIndex)}>
                          <ButtonIcon as={Plus} />
                          <ButtonText>Adicionar</ButtonText>
                        </Button>
                      </HStack>

                      <View className='flex-col gap-3'>
                        {day.exercises.map((exercise, exerciseIndex) => (
                          <View key={exercise.id} className='bg-gray-50 rounded-lg p-3 border border-gray-200'>
                            <HStack className='justify-between items-center mb-3'>
                              <Text className='text-typography-700 font-medium'>
                                Exercício {exerciseIndex + 1}
                              </Text>
                              <Button 
                                size='sm' 
                                variant='outline' 
                                onPress={() => removeExercise(dayIndex, exerciseIndex)}
                              >
                                <ButtonIcon as={Trash2} />
                              </Button>
                            </HStack>

                            <View className='flex-col gap-3'>
                              <FormControl>
                                <FormControlLabel>
                                  <FormControlLabelText>Nome do Exercício</FormControlLabelText>
                                </FormControlLabel>
                                <Input>
                                  <InputField 
                                    placeholder="Ex: Supino inclinado com halter"
                                    value={exercise.name}
                                    onChangeText={(value: string) => updateExercise(dayIndex, exerciseIndex, 'name', value)}
                                  />
                                </Input>
                              </FormControl>

                              <HStack className='gap-3'>
                                <View className='flex-1'>
                                  <FormControl>
                                    <FormControlLabel>
                                      <FormControlLabelText>Séries</FormControlLabelText>
                                    </FormControlLabel>
                                    <Input>
                                      <InputField 
                                        placeholder="3"
                                        value={exercise.sets.toString()}
                                        onChangeText={(value: string) => updateExercise(dayIndex, exerciseIndex, 'sets', parseInt(value) || 0)}
                                        keyboardType="numeric"
                                      />
                                    </Input>
                                  </FormControl>
                                </View>

                                <View className='flex-1'>
                                  <FormControl>
                                    <FormControlLabel>
                                      <FormControlLabelText>Repetições</FormControlLabelText>
                                    </FormControlLabel>
                                    <Input>
                                      <InputField 
                                        placeholder="8-12"
                                        value={exercise.reps}
                                        onChangeText={(value: string) => updateExercise(dayIndex, exerciseIndex, 'reps', value)}
                                      />
                                    </Input>
                                  </FormControl>
                                </View>
                              </HStack>
                            </View>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Botão Salvar */}
      <View className='absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200'>
        <Button onPress={saveWorkout} className='w-full'>
          <ButtonText>Salvar Treino</ButtonText>
        </Button>
      </View>
    </View>
  )
}

export default CreateWorkoutPage 