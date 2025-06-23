import { HStack } from '@/components/ui/hstack'
import { Input, InputField, InputIcon } from '@/components/ui/input'
import { useWorkout } from '@/contexts/WorkoutContext'
import { router } from 'expo-router'
import { Bookmark, Heart, Search, X } from 'lucide-react-native'
import { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Modal, Platform, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const ExplorePage = () => {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [filteredWorkouts, setFilteredWorkouts] = useState<any[]>([]);
  const { 
    publicWorkouts, 
    saveWorkout, 
    unsaveWorkout, 
    isWorkoutSaved, 
    likeWorkout, 
    unlikeWorkout, 
    isWorkoutLiked,
    refreshPublicWorkouts,
    loading 
  } = useWorkout();
  
  // Dados mockados para demonstração (usuários)
  const mockUsers = [
    { id: 1, username: 'joao_treino', name: 'João Silva', avatar: '👨‍💪', isVerified: true },
    { id: 2, username: 'maria_fitness', name: 'Maria Santos', avatar: '👩‍🏃‍♀️', isVerified: false },
    { id: 3, username: 'pedro_yoga', name: 'Pedro Costa', avatar: '🧘‍♂️', isVerified: true },
    { id: 4, username: 'ana_pilates', name: 'Ana Oliveira', avatar: '🤸‍♀️', isVerified: false },
    { id: 5, username: 'carlos_crossfit', name: 'Carlos Mendes', avatar: '🏋️‍♂️', isVerified: true },
    { id: 6, username: 'julia_yoga', name: 'Julia Santos', avatar: '🧘‍♀️', isVerified: false },
  ];

  // Filtrar treinos baseado na busca
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredWorkouts(publicWorkouts);
    } else {
      const filtered = publicWorkouts.filter(workout =>
        workout.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workout.profile.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (workout.description && workout.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredWorkouts(filtered);
    }
  }, [searchQuery, publicWorkouts]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const handleUserSelect = (user: any) => {
    // Filtrar treinos por usuário
    const userWorkouts = publicWorkouts.filter(workout => 
      workout.profile.username === user.username
    );
    setFilteredWorkouts(userWorkouts);
    setSearchQuery(user.username);
    closeSearchModal();
  };

  const handleSearchWorkouts = () => {
    // A busca já é feita automaticamente pelo useEffect
    closeSearchModal();
  };

  const openSearchModal = () => {
    setIsSearchModalOpen(true);
  };

  const closeSearchModal = () => {
    setIsSearchModalOpen(false);
  };

  const navigateToWorkoutDetails = (workout: any) => {
    try {
      router.push({
        pathname: '/workout-details',
        params: { 
          id: workout.id,
          fromExplore: 'true',
          workoutData: JSON.stringify(workout)
        }
      });
    } catch (error) {
      console.error('Erro na navegação:', error);
    }
  };

  const handleSaveWorkout = async (workout: any, event: any) => {
    event.stopPropagation();
    try {
      if (isWorkoutSaved(workout.id)) {
        await unsaveWorkout(workout.id);
      } else {
        await saveWorkout(workout);
      }
    } catch (error) {
      console.error('Erro ao salvar/remover treino:', error);
    }
  };

  const handleLikeWorkout = async (workout: any, event: any) => {
    event.stopPropagation();
    try {
      if (isWorkoutLiked(workout.id)) {
        await unlikeWorkout(workout.id);
      } else {
        await likeWorkout(workout.id);
      }
    } catch (error) {
      console.error('Erro ao dar/remover like:', error);
    }
  };

  const renderWorkoutItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      className='bg-white rounded-lg p-4 border border-gray-200 shadow-sm mb-3'
      onPress={() => navigateToWorkoutDetails(item)}
    >
      <HStack className='justify-between items-start mb-3'>
        <View className='flex-1'>
          <HStack className='items-center gap-2 mb-1'>
            <Text className='text-2xl'>{item.emoji}</Text>
            <Text className='text-lg font-semibold text-typography-900'>
              {item.name}
            </Text>
          </HStack>
          {item.description && (
            <Text className='text-typography-600 text-sm mb-2'>
              {item.description}
            </Text>
          )}
          <HStack className='items-center gap-4'>
            <HStack className='items-center gap-1'>
              <Text className='text-typography-500 text-xs'>@</Text>
              <Text className='text-typography-600 text-sm font-medium'>
                {item.profile.username}
              </Text>
            </HStack>
            <HStack className='items-center gap-1'>
              <Heart size={12} className='text-typography-500' />
              <Text className='text-typography-500 text-xs'>
                {item.likes_count}
              </Text>
            </HStack>
          </HStack>
        </View>

        <HStack className='gap-2'>
          <TouchableOpacity
            className={`p-2 rounded-full ${isWorkoutLiked(item.id) ? 'bg-red-100' : 'bg-gray-100'}`}
            onPress={(event) => handleLikeWorkout(item, event)}
          >
            <Heart 
              size={16} 
              color={isWorkoutLiked(item.id) ? '#ef4444' : '#6b7280'} 
              fill={isWorkoutLiked(item.id) ? '#ef4444' : 'none'}
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            className={`p-2 rounded-full ${isWorkoutSaved(item.id) ? 'bg-primary-100' : 'bg-gray-100'}`}
            onPress={(event) => handleSaveWorkout(item, event)}
          >
            <Bookmark 
              size={16} 
              color={isWorkoutSaved(item.id) ? '#6366f1' : '#6b7280'} 
              fill={isWorkoutSaved(item.id) ? '#6366f1' : 'none'}
            />
          </TouchableOpacity>
        </HStack>
      </HStack>

      <HStack className='justify-between items-center'>
        <HStack className='gap-4'>
          <HStack className='items-center gap-1'>
            <Text className='text-typography-500 text-xs'>Duração:</Text>
            <Text className='text-typography-600 text-xs font-medium'>4 semanas</Text>
          </HStack>
          <HStack className='items-center gap-1'>
            <Text className='text-typography-500 text-xs'>Dificuldade:</Text>
            <Text className='text-typography-600 text-xs font-medium'>Intermediário</Text>
          </HStack>
        </HStack>
        <Text className='text-typography-500 text-xs'>
          {new Date(item.created_at).toLocaleDateString('pt-BR')}
        </Text>
      </HStack>
    </TouchableOpacity>
  );

  const renderUserItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      className='flex-row items-center p-3 border-b border-gray-100'
      onPress={() => handleUserSelect(item)}
    >
      <Text className='text-2xl mr-3'>{item.avatar}</Text>
      <View className='flex-1'>
        <HStack className='items-center gap-2'>
          <Text className='font-medium text-typography-900'>{item.name}</Text>
          {item.isVerified && (
            <Text className='text-blue-500 text-xs'>✓</Text>
          )}
        </HStack>
        <Text className='text-typography-600 text-sm'>@{item.username}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderSearchItem = () => (
    <View className='p-4'>
      <Text className='text-typography-600 text-sm mb-3'>
        Buscar por: &quot;{searchQuery}&quot;
      </Text>
      <TouchableOpacity
        className='bg-primary-500 rounded-lg p-3 items-center'
        onPress={handleSearchWorkouts}
      >
        <Text className='text-white font-medium'>Buscar Treinos</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
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
          <Text className='text-3xl font-bold text-typography-900 mb-4'>
            Explorar
          </Text>

          {/* Search Bar */}
          <TouchableOpacity
            className='bg-white rounded-lg p-3 border border-gray-200 flex-row items-center'
            onPress={openSearchModal}
          >
            <Search size={20} color="#6b7280" />
            <Text className='text-typography-500 ml-3 flex-1'>
              {searchQuery || 'Buscar treinos ou usuários...'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={{ flex: 1, paddingHorizontal: 20 }}>
          {loading ? (
            <View className='flex-1 justify-center items-center py-20'>
              <ActivityIndicator size="large" color="#6366f1" />
              <Text className='text-typography-600 mt-4'>Carregando treinos...</Text>
            </View>
          ) : (
            <FlatList
              data={filteredWorkouts}
              renderItem={renderWorkoutItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ 
                paddingBottom: insets.bottom + 80,
                paddingTop: 10
              }}
              ListEmptyComponent={
                <View className='flex-1 justify-center items-center py-20'>
                  <Text className='text-typography-600 text-center mb-2'>
                    {searchQuery ? 'Nenhum treino encontrado' : 'Nenhum treino público disponível'}
                  </Text>
                  <Text className='text-typography-500 text-center text-sm'>
                    {searchQuery ? 'Tente ajustar sua busca' : 'Seja o primeiro a criar um treino público!'}
                  </Text>
                </View>
              }
            />
          )}
        </View>

        {/* Search Modal */}
        <Modal
          visible={isSearchModalOpen}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
            {/* Modal Header */}
            <View 
              style={{ 
                paddingTop: insets.top + 20,
                paddingHorizontal: 20,
                paddingBottom: 20,
                backgroundColor: '#f5f5f5'
              }}
            >
              <HStack className='justify-between items-center mb-4'>
                <Text className='text-xl font-bold text-typography-900'>
                  Buscar
                </Text>
                <TouchableOpacity onPress={closeSearchModal}>
                  <X size={24} color="#6b7280" />
                </TouchableOpacity>
              </HStack>

              {/* Search Input */}
              <Input className='bg-white border border-gray-200 mb-4'>
                <InputIcon as={Search} />
                <InputField
                  placeholder="Buscar treinos ou usuários..."
                  value={searchQuery}
                  onChangeText={handleSearch}
                  autoFocus
                />
              </Input>
            </View>

            {/* Search Results */}
            <View style={{ flex: 1, paddingHorizontal: 20 }}>
              {searchQuery && (
                <FlatList
                  data={mockUsers.filter(user => 
                    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.username.toLowerCase().includes(searchQuery.toLowerCase())
                  )}
                  renderItem={renderUserItem}
                  keyExtractor={(item) => item.id.toString()}
                  ListHeaderComponent={renderSearchItem}
                  showsVerticalScrollIndicator={false}
                />
              )}
            </View>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ExplorePage; 