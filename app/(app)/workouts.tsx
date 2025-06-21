import { Box } from '@/components/ui/box'
import { Button, ButtonText } from '@/components/ui/button'
import { HStack } from '@/components/ui/hstack'
import { ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const WorkoutsPage = () => {
  const insets = useSafeAreaInsets();
  
  const myWorkouts = [
    { 
      name: 'Treino A - Superior', 
      lastUsed: '2 dias atrás',
      exercises: 8,
      duration: '45 min',
      status: 'active'
    },
    { 
      name: 'Treino B - Inferior', 
      lastUsed: '5 dias atrás',
      exercises: 6,
      duration: '40 min',
      status: 'inactive'
    },
    { 
      name: 'Cardio HIIT', 
      lastUsed: '1 dia atrás',
      exercises: 5,
      duration: '30 min',
      status: 'active'
    },
  ];

  const recentWorkouts = [
    { name: 'Treino A - Superior', date: 'Hoje', duration: '45 min' },
    { name: 'Cardio HIIT', date: 'Ontem', duration: '30 min' },
    { name: 'Treino B - Inferior', date: '3 dias atrás', duration: '40 min' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <ScrollView 
        style={{ flex: 1 }} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 80, // Extra padding para bottom nav
          paddingHorizontal: 20
        }}
      >
        {/* Header */}
        <View className='mb-6'>
          <Text className='text-3xl font-bold text-typography-900 mb-2'>
            Meus Treinos 💪
          </Text>
          <Text className='text-typography-600'>
            Gerencie seus treinos e acompanhe seu progresso
          </Text>
        </View>

        {/* Estatísticas Rápidas */}
        <Box className='bg-white rounded-lg p-4 mb-6'>
          <Text className='text-xl font-semibold text-typography-900 mb-4'>
            📊 Resumo da Semana
          </Text>
          <HStack className='justify-between'>
            <View className='items-center'>
              <Text className='text-2xl font-bold text-primary-500'>4</Text>
              <Text className='text-sm text-typography-600'>Treinos</Text>
            </View>
            <View className='items-center'>
              <Text className='text-2xl font-bold text-green-500'>180</Text>
              <Text className='text-sm text-typography-600'>Minutos</Text>
            </View>
            <View className='items-center'>
              <Text className='text-2xl font-bold text-blue-500'>85%</Text>
              <Text className='text-sm text-typography-600'>Meta</Text>
            </View>
          </HStack>
        </Box>

        {/* Meus Treinos */}
        <Box className='bg-white rounded-lg p-4 mb-6'>
          <HStack className='justify-between items-center mb-4'>
            <Text className='text-xl font-semibold text-typography-900'>
              Meus Treinos
            </Text>
            <Button size='sm' className='bg-primary-500'>
              <ButtonText className='text-white text-xs'>+ Novo</ButtonText>
            </Button>
          </HStack>
          
          <View className='flex-col gap-3'>
            {myWorkouts.map((workout, index) => (
              <View 
                key={index}
                className='bg-gray-50 rounded-lg p-4 border border-gray-200'
              >
                <HStack className='justify-between items-center mb-2'>
                  <Text className='text-lg font-semibold text-typography-900'>
                    {workout.name}
                  </Text>
                  <View className={`px-2 py-1 rounded ${
                    workout.status === 'active' ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <Text className={`text-xs font-medium ${
                      workout.status === 'active' ? 'text-green-700' : 'text-gray-600'
                    }`}>
                      {workout.status === 'active' ? 'Ativo' : 'Inativo'}
                    </Text>
                  </View>
                </HStack>
                
                <HStack className='justify-between items-center mb-3'>
                  <Text className='text-typography-600 text-sm'>
                    📅 {workout.lastUsed}
                  </Text>
                  <Text className='text-typography-600 text-sm'>
                    ⏱️ {workout.duration}
                  </Text>
                </HStack>
                
                <HStack className='justify-between items-center'>
                  <Text className='text-typography-600 text-sm'>
                    🏋️ {workout.exercises} exercícios
                  </Text>
                  <Button size='sm' variant='outline' className='border-primary-300'>
                    <ButtonText className='text-primary-600 text-xs'>Iniciar</ButtonText>
                  </Button>
                </HStack>
              </View>
            ))}
          </View>
        </Box>

        {/* Treinos Recentes */}
        <Box className='bg-white rounded-lg p-4 mb-6'>
          <Text className='text-xl font-semibold text-typography-900 mb-4'>
            🕒 Treinos Recentes
          </Text>
          <View className='flex-col gap-3'>
            {recentWorkouts.map((workout, index) => (
              <View 
                key={index}
                className='bg-gray-50 rounded-lg p-3 border border-gray-200'
              >
                <HStack className='justify-between items-center'>
                  <View>
                    <Text className='text-typography-900 font-medium'>
                      {workout.name}
                    </Text>
                    <Text className='text-typography-600 text-sm'>
                      {workout.date} • {workout.duration}
                    </Text>
                  </View>
                  <Button size='sm' variant='outline' className='border-gray-300'>
                    <ButtonText className='text-typography-700 text-xs'>Repetir</ButtonText>
                  </Button>
                </HStack>
              </View>
            ))}
          </View>
        </Box>

        {/* Ações Rápidas */}
        <Box className='bg-white rounded-lg p-4 mb-6'>
          <Text className='text-xl font-semibold text-typography-900 mb-4'>
            ⚡ Ações Rápidas
          </Text>
          <HStack className='gap-3'>
            <Button className='flex-1 bg-green-500'>
              <ButtonText className='text-white'>Iniciar Treino</ButtonText>
            </Button>
            <Button variant='outline' className='flex-1 border-primary-300'>
              <ButtonText className='text-primary-600'>Ver Progresso</ButtonText>
            </Button>
          </HStack>
        </Box>
      </ScrollView>
    </View>
  )
}

export default WorkoutsPage 