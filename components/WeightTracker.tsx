import { Button, ButtonText } from '@/components/ui/button'
import { HStack } from '@/components/ui/hstack'
import { Input, InputField } from '@/components/ui/input'
import { useWorkout } from '@/contexts/WorkoutContext'
import { Calendar, TrendingUp } from 'lucide-react-native'
import React, { useState } from 'react'
import { Modal, ScrollView, Text, View } from 'react-native'

interface WeightTrackerProps {
  workoutId: string
  dayIndex: number
  exerciseId: string
  exerciseName: string
}

const WeightTracker: React.FC<WeightTrackerProps> = ({
  workoutId,
  dayIndex,
  exerciseId,
  exerciseName
}) => {
  const { addWeightRecord, getExerciseWeightHistory } = useWorkout()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [weight, setWeight] = useState('')
  const [notes, setNotes] = useState('')

  // Verificações de segurança
  if (!workoutId || dayIndex < 0 || !exerciseId || !exerciseName) {
    return null
  }

  const weightHistory = getExerciseWeightHistory(workoutId, dayIndex, exerciseId)
  const lastWeight = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : null

  const handleAddWeight = () => {
    const weightValue = parseFloat(weight)
    if (weightValue > 0) {
      addWeightRecord(workoutId, dayIndex, exerciseId, weightValue, notes.trim() || undefined)
      setWeight('')
      setNotes('')
      setIsModalVisible(false)
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <View className='mt-3'>
      {/* Botão para adicionar peso */}
      <Button 
        size='sm' 
        variant='outline' 
        onPress={() => setIsModalVisible(true)}
        className='mb-3'
      >
        <ButtonText>Registrar Peso</ButtonText>
      </Button>

      {/* Último peso registrado */}
      {lastWeight && (
        <View className='bg-blue-50 p-3 rounded-lg border border-blue-200 mb-3'>
          <HStack className='items-center gap-2 mb-1'>
            <TrendingUp size={16} className='text-blue-600' />
            <Text className='text-blue-800 font-semibold'>Último peso: {lastWeight}kg</Text>
          </HStack>
        </View>
      )}

      {/* Histórico de pesos */}
      {weightHistory.length > 0 && (
        <View className='bg-gray-50 p-3 rounded-lg border border-gray-200'>
          <Text className='text-typography-900 font-semibold mb-2'>Histórico de Pesos</Text>
          <ScrollView className='max-h-32'>
            {weightHistory.slice().reverse().map((record) => (
              <View key={record.id} className='bg-white p-2 rounded border border-gray-200 mb-2'>
                <HStack className='justify-between items-center'>
                  <View className='flex-1'>
                    <Text className='text-typography-900 font-medium'>{record.weight}kg</Text>
                    {record.notes && (
                      <Text className='text-typography-600 text-sm'>{record.notes}</Text>
                    )}
                  </View>
                  <HStack className='items-center gap-1'>
                    <Calendar size={12} className='text-typography-500' />
                    <Text className='text-typography-500 text-xs'>
                      {formatDate(record.date)}
                    </Text>
                  </HStack>
                </HStack>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Modal para adicionar peso */}
      <Modal
        visible={isModalVisible}
        animationType='slide'
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className='flex-1 justify-center items-center bg-black/50'>
          <View className='bg-white rounded-lg p-6 w-80 max-w-[90%]'>
            <Text className='text-xl font-bold text-typography-900 mb-4'>
              Registrar Peso - {exerciseName}
            </Text>
            
            <View className='mb-4'>
              <Text className='text-typography-700 mb-2'>Peso (kg)</Text>
              <Input className='mb-3'>
                <InputField
                  value={weight}
                  onChangeText={setWeight}
                  placeholder='Ex: 50'
                  keyboardType='numeric'
                />
              </Input>
            </View>

            <View className='mb-6'>
              <Text className='text-typography-700 mb-2'>Observações (opcional)</Text>
              <Input>
                <InputField
                  value={notes}
                  onChangeText={setNotes}
                  placeholder='Como foi o treino?'
                  multiline
                  numberOfLines={3}
                />
              </Input>
            </View>

            <HStack className='gap-3'>
              <Button 
                variant='outline' 
                onPress={() => setIsModalVisible(false)}
                className='flex-1'
              >
                <ButtonText>Cancelar</ButtonText>
              </Button>
              <Button 
                onPress={handleAddWeight}
                className='flex-1'
                disabled={!weight || parseFloat(weight) <= 0}
              >
                <ButtonText>Salvar</ButtonText>
              </Button>
            </HStack>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default WeightTracker 