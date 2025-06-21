import { HStack } from '@/components/ui/hstack'
import { Input, InputField, InputIcon } from '@/components/ui/input'
import { useWorkout } from '@/contexts/WorkoutContext'
import { router } from 'expo-router'
import { Bookmark, Heart, Search, X } from 'lucide-react-native'
import { useState } from 'react'
import { FlatList, KeyboardAvoidingView, Modal, Platform, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const ExplorePage = () => {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [filteredWorkouts, setFilteredWorkouts] = useState<any[]>([]);
  const { saveWorkout, unsaveWorkout, isWorkoutSaved } = useWorkout();
  
  // Dados mockados para demonstração
  const mockUsers = [
    { id: 1, username: 'joao_treino', name: 'João Silva', avatar: '👨‍💪', isVerified: true },
    { id: 2, username: 'maria_fitness', name: 'Maria Santos', avatar: '👩‍🏃‍♀️', isVerified: false },
    { id: 3, username: 'pedro_yoga', name: 'Pedro Costa', avatar: '🧘‍♂️', isVerified: true },
    { id: 4, username: 'ana_pilates', name: 'Ana Oliveira', avatar: '🤸‍♀️', isVerified: false },
    { id: 5, username: 'carlos_crossfit', name: 'Carlos Mendes', avatar: '🏋️‍♂️', isVerified: true },
    { id: 6, username: 'julia_yoga', name: 'Julia Santos', avatar: '🧘‍♀️', isVerified: false },
  ];

  const mockWorkouts = [
    { 
      id: 1, 
      name: 'Treino Full Body', 
      creator: 'joao_treino',
      duration: '45 min', 
      difficulty: 'Iniciante',
      likes: 128,
      image: '💪',
      description: 'Treino completo para todo o corpo, ideal para iniciantes',
      exercises: 12,
      days: 3,
      workoutDays: [
        {
          day: 'Segunda-feira',
          division: 'Treino A - Superior',
          isRestDay: false,
          exercises: [
            { name: 'Flexão de Braço', sets: 3, reps: '10-12', rest: '60s' },
            { name: 'Agachamento', sets: 3, reps: '12-15', rest: '60s' },
            { name: 'Remada Curvada', sets: 3, reps: '10-12', rest: '60s' },
            { name: 'Elevação Lateral', sets: 3, reps: '12-15', rest: '45s' }
          ]
        },
        {
          day: 'Terça-feira',
          division: 'Treino B - Inferior',
          isRestDay: false,
          exercises: [
            { name: 'Agachamento Livre', sets: 4, reps: '8-10', rest: '90s' },
            { name: 'Leg Press', sets: 3, reps: '12-15', rest: '60s' },
            { name: 'Extensão de Pernas', sets: 3, reps: '15-20', rest: '45s' },
            { name: 'Flexão de Pernas', sets: 3, reps: '12-15', rest: '60s' }
          ]
        },
        {
          day: 'Quarta-feira',
          division: 'Descanso',
          isRestDay: true,
          exercises: []
        },
        {
          day: 'Quinta-feira',
          division: 'Treino C - Cardio',
          isRestDay: false,
          exercises: [
            { name: 'Corrida', sets: 1, reps: '20 min', rest: '0s' },
            { name: 'Polichinelo', sets: 3, reps: '30 seg', rest: '30s' },
            { name: 'Burpee', sets: 3, reps: '10 reps', rest: '60s' }
          ]
        }
      ]
    },
    { 
      id: 2, 
      name: 'HIIT Cardio', 
      creator: 'maria_fitness',
      duration: '30 min', 
      difficulty: 'Intermediário',
      likes: 89,
      image: '🏃‍♀️',
      description: 'Treino de alta intensidade para queimar calorias',
      exercises: 8,
      days: 4,
      workoutDays: [
        {
          day: 'Segunda-feira',
          division: 'HIIT Superior',
          isRestDay: false,
          exercises: [
            { id: 1, name: 'Flexão Explosiva', sets: 4, reps: '30s', rest: '30s' },
            { id: 2, name: 'Mountain Climber', sets: 4, reps: '30s', rest: '30s' },
            { id: 3, name: 'Burpee', sets: 4, reps: '30s', rest: '30s' }
          ]
        },
        {
          day: 'Terça-feira',
          division: 'HIIT Inferior',
          isRestDay: false,
          exercises: [
            { id: 4, name: 'Agachamento com Salto', sets: 4, reps: '30s', rest: '30s' },
            { id: 5, name: 'Lunge Alternado', sets: 4, reps: '30s', rest: '30s' },
            { id: 6, name: 'Polichinelo', sets: 4, reps: '30s', rest: '30s' }
          ]
        },
        {
          day: 'Quarta-feira',
          division: 'Descanso',
          isRestDay: true,
          exercises: []
        },
        {
          day: 'Quinta-feira',
          division: 'HIIT Completo',
          isRestDay: false,
          exercises: [
            { id: 7, name: 'Burpee', sets: 5, reps: '30s', rest: '30s' },
            { id: 8, name: 'Flexão de Braço', sets: 5, reps: '30s', rest: '30s' },
            { id: 9, name: 'Agachamento', sets: 5, reps: '30s', rest: '30s' }
          ]
        }
      ]
    },
    { 
      id: 3, 
      name: 'Yoga Matinal', 
      creator: 'pedro_yoga',
      duration: '20 min', 
      difficulty: 'Iniciante',
      likes: 156,
      image: '🧘‍♀️',
      description: 'Sequência de yoga para começar o dia com energia',
      exercises: 6,
      days: 7,
      workoutDays: [
        {
          day: 'Segunda-feira',
          division: 'Saudação ao Sol',
          isRestDay: false,
          exercises: [
            { id: 10, name: 'Postura da Montanha', sets: 1, reps: '5 respirações', rest: '0s' },
            { id: 11, name: 'Saudação ao Sol A', sets: 3, reps: '1 sequência', rest: '30s' },
            { id: 12, name: 'Saudação ao Sol B', sets: 2, reps: '1 sequência', rest: '30s' }
          ]
        },
        {
          day: 'Terça-feira',
          division: 'Equilíbrio',
          isRestDay: false,
          exercises: [
            { id: 13, name: 'Postura da Árvore', sets: 2, reps: '30s cada lado', rest: '30s' },
            { id: 14, name: 'Postura do Guerreiro III', sets: 2, reps: '30s cada lado', rest: '30s' }
          ]
        },
        {
          day: 'Quarta-feira',
          division: 'Flexibilidade',
          isRestDay: false,
          exercises: [
            { id: 15, name: 'Postura do Cachorro Olhando para Baixo', sets: 1, reps: '1 min', rest: '0s' },
            { id: 16, name: 'Postura da Cobra', sets: 3, reps: '30s', rest: '30s' },
            { id: 17, name: 'Postura da Ponte', sets: 3, reps: '30s', rest: '30s' }
          ]
        },
        {
          day: 'Quinta-feira',
          division: 'Força',
          isRestDay: false,
          exercises: [
            { id: 18, name: 'Postura da Cadeira', sets: 3, reps: '30s', rest: '30s' },
            { id: 19, name: 'Postura do Guerreiro I', sets: 2, reps: '30s cada lado', rest: '30s' },
            { id: 20, name: 'Postura do Guerreiro II', sets: 2, reps: '30s cada lado', rest: '30s' }
          ]
        },
        {
          day: 'Sexta-feira',
          division: 'Meditação',
          isRestDay: false,
          exercises: [
            { id: 21, name: 'Respiração Consciente', sets: 1, reps: '5 min', rest: '0s' },
            { id: 22, name: 'Postura do Lótus', sets: 1, reps: '10 min', rest: '0s' }
          ]
        },
        {
          day: 'Sábado',
          division: 'Descanso',
          isRestDay: true,
          exercises: []
        },
        {
          day: 'Domingo',
          division: 'Descanso',
          isRestDay: true,
          exercises: []
        }
      ]
    },
    { 
      id: 4, 
      name: 'Treino de Força', 
      creator: 'joao_treino',
      duration: '60 min', 
      difficulty: 'Avançado',
      likes: 203,
      image: '🏋️‍♂️',
      description: 'Treino focado em ganho de força e massa muscular',
      exercises: 15,
      days: 5,
      workoutDays: [
        {
          day: 'Segunda-feira',
          division: 'Peito e Tríceps',
          isRestDay: false,
          exercises: [
            { id: 23, name: 'Supino Reto', sets: 4, reps: '6-8', rest: '120s' },
            { id: 24, name: 'Supino Inclinado', sets: 3, reps: '8-10', rest: '90s' },
            { id: 25, name: 'Flexão de Braço', sets: 3, reps: 'Falha', rest: '60s' },
            { id: 26, name: 'Extensão de Tríceps', sets: 3, reps: '10-12', rest: '60s' },
            { id: 27, name: 'Mergulho', sets: 3, reps: '8-10', rest: '60s' }
          ]
        },
        {
          day: 'Terça-feira',
          division: 'Costas e Bíceps',
          isRestDay: false,
          exercises: [
            { id: 28, name: 'Puxada na Frente', sets: 4, reps: '8-10', rest: '90s' },
            { id: 29, name: 'Remada Curvada', sets: 3, reps: '8-10', rest: '90s' },
            { id: 30, name: 'Remada na Máquina', sets: 3, reps: '10-12', rest: '60s' },
            { id: 31, name: 'Rosca Direta', sets: 3, reps: '10-12', rest: '60s' },
            { id: 32, name: 'Rosca Martelo', sets: 3, reps: '10-12', rest: '60s' }
          ]
        },
        {
          day: 'Quarta-feira',
          division: 'Descanso',
          isRestDay: true,
          exercises: []
        },
        {
          day: 'Quinta-feira',
          division: 'Pernas',
          isRestDay: false,
          exercises: [
            { id: 33, name: 'Agachamento Livre', sets: 4, reps: '6-8', rest: '120s' },
            { id: 34, name: 'Leg Press', sets: 3, reps: '8-10', rest: '90s' },
            { id: 35, name: 'Extensão de Pernas', sets: 3, reps: '12-15', rest: '60s' },
            { id: 36, name: 'Flexão de Pernas', sets: 3, reps: '10-12', rest: '60s' }
          ]
        },
        {
          day: 'Sexta-feira',
          division: 'Ombros e Abdômen',
          isRestDay: false,
          exercises: [
            { id: 37, name: 'Desenvolvimento Militar', sets: 4, reps: '8-10', rest: '90s' },
            { id: 38, name: 'Elevação Lateral', sets: 3, reps: '10-12', rest: '60s' },
            { id: 39, name: 'Elevação Frontal', sets: 3, reps: '10-12', rest: '60s' },
            { id: 40, name: 'Abdominal Crunch', sets: 3, reps: '15-20', rest: '45s' },
            { id: 41, name: 'Prancha', sets: 3, reps: '60s', rest: '30s' }
          ]
        }
      ]
    },
    { 
      id: 5, 
      name: 'Pilates Core', 
      creator: 'maria_fitness',
      duration: '40 min', 
      difficulty: 'Intermediário',
      likes: 67,
      image: '🤸‍♀️',
      description: 'Treino específico para fortalecer o core',
      exercises: 10,
      days: 3,
      workoutDays: [
        {
          day: 'Segunda-feira',
          division: 'Core Superior',
          isRestDay: false,
          exercises: [
            { id: 42, name: 'Prancha Frontal', sets: 3, reps: '45s', rest: '30s' },
            { id: 43, name: 'Prancha Lateral', sets: 3, reps: '30s cada lado', rest: '30s' },
            { id: 44, name: 'Dead Bug', sets: 3, reps: '10 cada lado', rest: '30s' },
            { id: 45, name: 'Bird Dog', sets: 3, reps: '10 cada lado', rest: '30s' }
          ]
        },
        {
          day: 'Terça-feira',
          division: 'Core Inferior',
          isRestDay: false,
          exercises: [
            { id: 46, name: 'Ponte Glúteo', sets: 3, reps: '15 reps', rest: '30s' },
            { id: 47, name: 'Ponte Glúteo Unilateral', sets: 3, reps: '10 cada lado', rest: '30s' },
            { id: 48, name: 'Abdominal Hollow', sets: 3, reps: '30s', rest: '30s' },
            { id: 49, name: 'Leg Raise', sets: 3, reps: '12 reps', rest: '30s' }
          ]
        },
        {
          day: 'Quarta-feira',
          division: 'Core Completo',
          isRestDay: false,
          exercises: [
            { id: 50, name: 'Prancha com Movimento', sets: 3, reps: '60s', rest: '30s' },
            { id: 51, name: 'Russian Twist', sets: 3, reps: '20 reps', rest: '30s' },
            { id: 52, name: 'Mountain Climber', sets: 3, reps: '30s', rest: '30s' },
            { id: 53, name: 'Superman', sets: 3, reps: '15 reps', rest: '30s' }
          ]
        }
      ]
    },
    { 
      id: 6, 
      name: 'Meditação Guiada', 
      creator: 'pedro_yoga',
      duration: '15 min', 
      difficulty: 'Iniciante',
      likes: 234,
      image: '🧘',
      description: 'Sessão de meditação para relaxamento e foco',
      exercises: 3,
      days: 7,
      workoutDays: [
        {
          day: 'Segunda-feira',
          division: 'Respiração Consciente',
          isRestDay: false,
          exercises: [
            { id: 54, name: 'Respiração 4-7-8', sets: 1, reps: '5 min', rest: '0s' },
            { id: 55, name: 'Respiração Quadrada', sets: 1, reps: '5 min', rest: '0s' },
            { id: 56, name: 'Meditação Guiada', sets: 1, reps: '5 min', rest: '0s' }
          ]
        },
        {
          day: 'Terça-feira',
          division: 'Mindfulness',
          isRestDay: false,
          exercises: [
            { id: 57, name: 'Escaneamento Corporal', sets: 1, reps: '10 min', rest: '0s' },
            { id: 58, name: 'Meditação Caminhando', sets: 1, reps: '5 min', rest: '0s' }
          ]
        },
        {
          day: 'Quarta-feira',
          division: 'Loving-Kindness',
          isRestDay: false,
          exercises: [
            { id: 59, name: 'Meditação Metta', sets: 1, reps: '15 min', rest: '0s' }
          ]
        },
        {
          day: 'Quinta-feira',
          division: 'Descanso',
          isRestDay: true,
          exercises: []
        },
        {
          day: 'Sexta-feira',
          division: 'Descanso',
          isRestDay: true,
          exercises: []
        },
        {
          day: 'Sábado',
          division: 'Descanso',
          isRestDay: true,
          exercises: []
        },
        {
          day: 'Domingo',
          division: 'Descanso',
          isRestDay: true,
          exercises: []
        }
      ]
    },
  ];

  // Filtrar usuários baseado na pesquisa
  const filteredUsers = mockUsers.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const handleUserSelect = (user: any) => {
    setSearchQuery(user.username);
    setIsSearchModalOpen(false);
  };

  const handleSearchWorkouts = () => {
    // Filtrar treinos baseado na pesquisa
    const filtered = mockWorkouts.filter(workout => 
      workout.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workout.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workout.difficulty.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredWorkouts(filtered);
    setIsSearchModalOpen(false);
  };

  const openSearchModal = () => {
    setIsSearchModalOpen(true);
    setSearchQuery('');
    setFilteredWorkouts([]);
  };

  const closeSearchModal = () => {
    setIsSearchModalOpen(false);
    setSearchQuery('');
    setFilteredWorkouts([]);
  };

  const navigateToWorkoutDetails = (workout: any) => {
    router.push({
      pathname: '/workout-details',
      params: { 
        id: workout.id.toString(),
        fromExplore: 'true',
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
        <Text className='text-xs text-typography-600 mb-1'>
          @{item.creator}
        </Text>
        <HStack className='items-center gap-1'>
          <Heart size={16} />
          <Text className='text-xs text-typography-500'>
            {item.likes}
          </Text>
        </HStack>
      </View>
    </TouchableOpacity>
  );

  const renderUserItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      className='flex-row items-center py-3 px-4 border-b border-gray-100'
      onPress={() => handleUserSelect(item)}
    >
      <Text className='text-2xl mr-3'>{item.avatar}</Text>
      <View className='flex-1'>
        <HStack className='items-center gap-1 mb-1'>
          <Text className='font-semibold text-typography-900'>
            {item.name}
          </Text>
          {item.isVerified && (
            <Text className='text-blue-500'>✓</Text>
          )}
        </HStack>
        <Text className='text-sm text-typography-600'>
          @{item.username}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderSearchItem = () => (
    <TouchableOpacity
      className='flex-row items-center py-3 px-4 border-b border-gray-100'
      onPress={handleSearchWorkouts}
    >
      <Search size={20} color="#6b7280" className='mr-3' />
      <View className='flex-1'>
        <Text className='font-medium text-typography-900'>
          Pesquisar &quot;{searchQuery}&quot;
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {/* Header com Barra de Pesquisa */}
      <View 
        style={{ 
          paddingTop: insets.top + 15,
          paddingHorizontal: 20,
          paddingBottom: 20,
          backgroundColor: '#f5f5f5'
        }}
      >
        <Text className='text-2xl font-bold text-typography-900 mb-5'>
          Explorar
        </Text>
        
        {/* Barra de Pesquisa (Botão) */}
        <TouchableOpacity 
          className='bg-white border border-gray-200 rounded-lg p-4 flex-row items-center shadow-sm'
          onPress={openSearchModal}
        >
          <Text className='text-lg mr-3'>🔍</Text>
          <Text className='text-typography-500 text-base'>
            Pesquisar
          </Text>
        </TouchableOpacity>
      </View>

      {/* Grid de Treinos */}
      <FlatList
        data={filteredWorkouts.length > 0 ? filteredWorkouts : mockWorkouts}
        renderItem={renderWorkoutItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ 
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 80
        }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View className='mb-4'>
            <Text className='text-lg font-semibold text-typography-900 mb-2'>
              {filteredWorkouts.length > 0 ? `Resultados para "${searchQuery}"` : 'Treinos em Destaque'}
            </Text>
            <Text className='text-typography-600 text-sm'>
              {filteredWorkouts.length > 0 
                ? `${filteredWorkouts.length} treino${filteredWorkouts.length > 1 ? 's' : ''} encontrado${filteredWorkouts.length > 1 ? 's' : ''}`
                : 'Descubra os treinos mais populares da comunidade'
              }
            </Text>
          </View>
        }
      />

      {/* Modal de Pesquisa Fullscreen */}
      <Modal
        visible={isSearchModalOpen}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <KeyboardAvoidingView 
          style={{ flex: 1, backgroundColor: '#f5f5f5' }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Header do Modal */}
          <View 
            style={{ 
              paddingTop: insets.top + 10,
              paddingHorizontal: 20,
              paddingBottom: 15,
              backgroundColor: '#f5f5f5',
              borderBottomWidth: 1,
              borderBottomColor: '#e5e7eb'
            }}
          >
            <HStack className='items-center justify-between mb-4'>
              <Text className='text-xl font-bold text-typography-900'>
                Pesquisar
              </Text>
              <TouchableOpacity onPress={closeSearchModal}>
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </HStack>
            
            {/* Barra de Pesquisa */}
            <Input className='bg-white border-gray-200 shadow-sm' size='lg'>
              <InputIcon>
                <Text>🔍</Text>
              </InputIcon>
              <InputField
                placeholder="Pesquisar usuários..."
                value={searchQuery}
                onChangeText={handleSearch}
                className='text-typography-900 text-base'
                autoFocus={true}
              />
            </Input>
          </View>

          {/* Resultados da Pesquisa */}
          <FlatList
            data={searchQuery.length > 0 ? [null, ...filteredUsers] : mockUsers}
            renderItem={({ item, index }) => {
              if (searchQuery.length > 0 && index === 0) {
                return renderSearchItem();
              }
              return renderUserItem({ item });
            }}
            keyExtractor={(item, index) => 
              searchQuery.length > 0 && index === 0 ? 'search' : item?.id?.toString() || index.toString()
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ 
              paddingBottom: insets.bottom + 20
            }}
            ListHeaderComponent={
              searchQuery.length > 0 ? null : (
                <View className='p-4 border-b border-gray-100'>
                  <Text className='text-sm font-medium text-typography-700'>
                    Usuários Sugeridos
                  </Text>
                </View>
              )
            }
            ListEmptyComponent={
              searchQuery.length > 0 ? (
                <View className='p-8 items-center'>
                  <Text className='text-typography-600 text-center'>
                    Nenhum usuário encontrado para &quot;{searchQuery}&quot;
                  </Text>
                </View>
              ) : null
            }
          />
        </KeyboardAvoidingView>
      </Modal>
    </View>
  )
}

export default ExplorePage 