import { Box } from '@/components/ui/box'
import { Button, ButtonText } from '@/components/ui/button'
import { HStack } from '@/components/ui/hstack'
import { ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const ExplorePage = () => {
  const insets = useSafeAreaInsets();
  
  const categories = [
    { name: 'Cardio', icon: '🏃‍♂️', color: '#FF6B6B' },
    { name: 'Força', icon: '💪', color: '#4ECDC4' },
    { name: 'Flexibilidade', icon: '🧘‍♀️', color: '#45B7D1' },
    { name: 'Equilíbrio', icon: '⚖️', color: '#96CEB4' },
    { name: 'Funcional', icon: '🎯', color: '#FFEAA7' },
    { name: 'Yoga', icon: '🧘', color: '#DDA0DD' },
  ];

  const popularWorkouts = [
    { name: 'Treino Full Body', duration: '45 min', difficulty: 'Iniciante' },
    { name: 'HIIT Cardio', duration: '30 min', difficulty: 'Intermediário' },
    { name: 'Yoga Matinal', duration: '20 min', difficulty: 'Iniciante' },
    { name: 'Treino de Força', duration: '60 min', difficulty: 'Avançado' },
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
            Explorar 🔍
          </Text>
          <Text className='text-typography-600'>
            Descubra novos treinos e exercícios
          </Text>
        </View>

        {/* Categorias */}
        <Box className='bg-white rounded-lg p-4 mb-6'>
          <Text className='text-xl font-semibold text-typography-900 mb-4'>
            Categorias
          </Text>
          <View className='flex-row flex-wrap gap-3'>
            {categories.map((category, index) => (
              <View 
                key={index}
                className='bg-gray-50 rounded-lg p-4 min-w-[100px] items-center'
                style={{ borderLeftWidth: 4, borderLeftColor: category.color }}
              >
                <Text className='text-2xl mb-2'>{category.icon}</Text>
                <Text className='text-sm font-medium text-typography-900 text-center'>
                  {category.name}
                </Text>
              </View>
            ))}
          </View>
        </Box>

        {/* Treinos Populares */}
        <Box className='bg-white rounded-lg p-4 mb-6'>
          <Text className='text-xl font-semibold text-typography-900 mb-4'>
            Treinos Populares
          </Text>
          <View className='flex-col gap-3'>
            {popularWorkouts.map((workout, index) => (
              <View 
                key={index}
                className='bg-gray-50 rounded-lg p-4 border border-gray-200'
              >
                <HStack className='justify-between items-center mb-2'>
                  <Text className='text-lg font-semibold text-typography-900'>
                    {workout.name}
                  </Text>
                  <View className='bg-primary-100 px-2 py-1 rounded'>
                    <Text className='text-xs font-medium text-primary-700'>
                      {workout.difficulty}
                    </Text>
                  </View>
                </HStack>
                <HStack className='justify-between items-center'>
                  <Text className='text-typography-600'>
                    ⏱️ {workout.duration}
                  </Text>
                  <Button size='sm' className='bg-primary-500'>
                    <ButtonText className='text-white text-xs'>Ver Treino</ButtonText>
                  </Button>
                </HStack>
              </View>
            ))}
          </View>
        </Box>

        {/* Dicas de Treino */}
        <Box className='bg-white rounded-lg p-4 mb-6'>
          <Text className='text-xl font-semibold text-typography-900 mb-4'>
            💡 Dicas de Hoje
          </Text>
          <View className='bg-blue-50 rounded-lg p-4 border border-blue-200'>
            <Text className='text-typography-900 font-medium mb-2'>
              Mantenha-se Hidratado
            </Text>
            <Text className='text-typography-600 text-sm'>
              Beba água antes, durante e após o treino. A hidratação adequada melhora o desempenho e acelera a recuperação.
            </Text>
          </View>
        </Box>

        {/* Botão de Busca */}
        <Button className='bg-primary-500 mb-6'>
          <ButtonText className='text-white'>Buscar Treinos Personalizados</ButtonText>
        </Button>
      </ScrollView>
    </View>
  )
}

export default ExplorePage 