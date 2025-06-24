import { Box } from '@/components/ui/box'
import { Button, ButtonText } from '@/components/ui/button'
import { useAuthContext } from '@/contexts/AuthContext'
import { Database, supabase } from '@/utils/supabase'
import { profileHelpers } from '@/utils/supabase-helpers'
import { router, useLocalSearchParams } from 'expo-router'
import { ArrowLeft } from 'lucide-react-native'
import { useEffect, useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type Profile = Database['public']['Tables']['profiles']['Row'];
type PublicWorkout = Database['public']['Tables']['workouts']['Row'] & {
  is_liked?: boolean;
  is_saved?: boolean;
};

const UserProfilePage = () => {
  const { user } = useAuthContext();
  const insets = useSafeAreaInsets();
  const { username } = useLocalSearchParams<{ username: string }>();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userWorkouts, setUserWorkouts] = useState<PublicWorkout[]>([]);
  const [stats, setStats] = useState<{
    totalWorkouts: number;
    publicWorkouts: number;
    totalLikes: number;
    totalSaved: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (username) {
      loadUserProfile();
    }
  }, [username]);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Buscar perfil do usuário
      const userProfile = await profileHelpers.getProfileByUsername(username);
      if (!userProfile) {
        setError('Usuário não encontrado');
        return;
      }

      setProfile(userProfile);

      // Buscar estatísticas
      const profileStats = await profileHelpers.getProfileStats(userProfile.id);
      setStats(profileStats);

      // Buscar treinos públicos do usuário
      const { data: workouts, error: workoutsError } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', userProfile.id)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (workoutsError) {
        console.error('Erro ao buscar treinos:', workoutsError);
      } else {
        setUserWorkouts(workouts || []);
      }

    } catch (err) {
      console.error('Erro ao carregar perfil:', err);
      setError('Erro ao carregar perfil do usuário');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleWorkoutPress = (workoutId: string) => {
    router.navigate(`/(app)/workout-details?id=${workoutId}`);
  };

  const isOwnProfile = user?.id === profile?.id;

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#f5f5f5', justifyContent: 'center', alignItems: 'center' }}>
        <Text className="text-lg text-gray-600">Carregando perfil...</Text>
      </View>
    );
  }

  if (error || !profile) {
    return (
      <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
        <View style={{ paddingTop: insets.top + 20, paddingHorizontal: 20 }}>
          <TouchableOpacity onPress={handleBack} className="mb-4">
            <ArrowLeft size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
          <Text className="text-xl font-semibold text-gray-900 mb-2">
            {error || 'Usuário não encontrado'}
          </Text>
          <Text className="text-gray-600 text-center">
            O usuário que você está procurando não existe ou foi removido.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <ScrollView 
        style={{ flex: 1 }} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          paddingBottom: insets.bottom + 80,
        }}
      >
        {/* Header */}
        <View style={{ paddingTop: insets.top + 20, paddingHorizontal: 20 }}>
          <TouchableOpacity onPress={handleBack} className="mb-4">
            <ArrowLeft size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Profile Header */}
        <Box className='bg-white rounded-lg mx-4 p-6 mb-6'>
          <View className='items-center mb-4'>
            <View className='w-20 h-20 bg-blue-500 rounded-full items-center justify-center mb-3'>
              <Text className='text-3xl text-white font-bold'>
                {profile.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text className='text-2xl font-bold text-gray-900 mb-1'>
              {profile.name}
            </Text>
            <Text className='text-gray-600 mb-3'>
              @{profile.username}
            </Text>
            {isOwnProfile && (
              <Button 
                size='sm' 
                variant='outline' 
                className='border-blue-300'
                onPress={() => router.navigate('/(app)/edit-profile')}
              >
                <ButtonText className='text-blue-600'>Editar Perfil</ButtonText>
              </Button>
            )}
          </View>
        </Box>

        {/* Public Workouts */}
        {userWorkouts.length > 0 && (
          <Box className='bg-white rounded-lg mx-4 p-4 mb-6'>
            <Text className='text-xl font-semibold text-gray-900 mb-4'>
              Treinos Públicos
            </Text>
            <View className='space-y-3'>
              {userWorkouts.map((workout) => (
                <TouchableOpacity
                  key={workout.id}
                  onPress={() => handleWorkoutPress(workout.id)}
                  className='bg-gray-50 p-4 rounded-lg'
                >
                  <View className='flex-row items-center'>
                    <Text className='text-2xl mr-3'>{workout.emoji}</Text>
                    <View className='flex-1'>
                      <Text className='text-lg font-semibold text-gray-900'>
                        {workout.name}
                      </Text>
                      {workout.description && (
                        <Text className='text-sm text-gray-500 mt-1' numberOfLines={2}>
                          {workout.description}
                        </Text>
                      )}
                    </View>
                    <View className='items-end'>
                      <Text className='text-sm text-gray-600'>
                        {workout.likes_count} likes
                      </Text>
                      <Text className='text-xs text-gray-500'>
                        {new Date(workout.created_at).toLocaleDateString('pt-BR')}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </Box>
        )}

        {/* Empty State */}
        {userWorkouts.length === 0 && (
          <Box className='bg-white rounded-lg mx-4 p-8 mb-6'>
            <View className='items-center'>
              <Text className='text-2xl mb-2'>💪</Text>
              <Text className='text-lg font-semibold text-gray-900 mb-2'>
                Nenhum treino público
              </Text>
              <Text className='text-gray-600 text-center'>
                Este usuário ainda não compartilhou nenhum treino público.
              </Text>
            </View>
          </Box>
        )}
      </ScrollView>
    </View>
  );
};

export default UserProfilePage; 