import { Box } from '@/components/ui/box'
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button'
import { useAuthContext } from '@/contexts/AuthContext'
import { useProfile } from '@/hooks/useProfile'
import { profileHelpers } from '@/utils/supabase-helpers'
import { router } from 'expo-router'
import { Calendar, LogOut, Mail, User } from 'lucide-react-native'
import { useEffect, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const ProfilePage = () => {
  const { user, logout } = useAuthContext();
  const { profile, isLoading, error } = useProfile();
  const [stats, setStats] = useState<{
    totalWorkouts: number;
    publicWorkouts: number;
    totalLikes: number;
    totalSaved: number;
  } | null>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (profile) {
      loadStats();
    }
  }, [profile]);

  const loadStats = async () => {
    if (profile) {
      const profileStats = await profileHelpers.getProfileStats(profile.id);
      setStats(profileStats);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleEditProfile = () => {
    router.navigate('/(app)/edit-profile');
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#f5f5f5', justifyContent: 'center', alignItems: 'center' }}>
        <Text className="text-lg text-gray-600">Carregando perfil...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, backgroundColor: '#f5f5f5', justifyContent: 'center', alignItems: 'center' }}>
        <Text className="text-lg text-red-600">Erro ao carregar perfil: {error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <ScrollView 
        style={{ flex: 1 }} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 80,
          paddingHorizontal: 20
        }}
      >
        {/* Header com Foto */}
        <Box className='bg-white rounded-lg p-6 mb-6'>
          <View className='items-center mb-4'>
            <View className='w-20 h-20 bg-blue-500 rounded-full items-center justify-center mb-3'>
              <Text className='text-3xl text-white font-bold'>
                {profile?.name?.charAt(0) || user?.name?.charAt(0)}
              </Text>
            </View>
            <Text className='text-2xl font-bold text-gray-900 mb-1'>
              {profile?.name || user?.name}
            </Text>
            <Text className='text-gray-600 mb-1'>
              @{profile?.username}
            </Text>
            <Text className='text-gray-600 mb-3'>
              {profile?.email || user?.email}
            </Text>
            <Button 
              size='sm' 
              variant='outline' 
              className='border-blue-300'
              onPress={handleEditProfile}
            >
              <ButtonText className='text-blue-600'>Editar Perfil</ButtonText>
            </Button>
          </View>
        </Box>

        {/* Estatísticas */}
        {stats && (
          <Box className='bg-white rounded-lg p-4 mb-6'>
            <Text className='text-xl font-semibold text-gray-900 mb-4'>
              Estatísticas
            </Text>
            <View className='flex-row justify-between'>
              <View className='items-center flex-1'>
                <Text className='text-2xl font-bold text-blue-600'>
                  {stats.totalWorkouts}
                </Text>
                <Text className='text-sm text-gray-600'>Treinos</Text>
              </View>
              <View className='items-center flex-1'>
                <Text className='text-2xl font-bold text-green-600'>
                  {stats.publicWorkouts}
                </Text>
                <Text className='text-sm text-gray-600'>Públicos</Text>
              </View>
              <View className='items-center flex-1'>
                <Text className='text-2xl font-bold text-red-600'>
                  {stats.totalLikes}
                </Text>
                <Text className='text-sm text-gray-600'>Likes</Text>
              </View>
              <View className='items-center flex-1'>
                <Text className='text-2xl font-bold text-purple-600'>
                  {stats.totalSaved}
                </Text>
                <Text className='text-sm text-gray-600'>Salvos</Text>
              </View>
            </View>
          </Box>
        )}

        {/* Informações Básicas */}
        <Box className='bg-white rounded-lg p-4 mb-6'>
          <Text className='text-xl font-semibold text-gray-900 mb-4'>
            Informações Pessoais
          </Text>
          <View className='flex-col gap-3'>
            <View className='bg-gray-50 p-4 rounded-lg'>
              <View className='flex-row items-center mb-1'>
                <User size={16} className='text-gray-500 mr-2' />
                <Text className='text-sm text-gray-500'>Nome</Text>
              </View>
              <Text className='text-lg font-semibold text-gray-900'>
                {profile?.name || user?.name}
              </Text>
            </View>

            <View className='bg-gray-50 p-4 rounded-lg'>
              <View className='flex-row items-center mb-1'>
                <Mail size={16} className='text-gray-500 mr-2' />
                <Text className='text-sm text-gray-500'>Email</Text>
              </View>
              <Text className='text-lg font-semibold text-gray-900'>
                {profile?.email || user?.email}
              </Text>
            </View>

            <View className='bg-gray-50 p-4 rounded-lg'>
              <View className='flex-row items-center mb-1'>
                <Calendar size={16} className='text-gray-500 mr-2' />
                <Text className='text-sm text-gray-500'>Membro desde</Text>
              </View>
              <Text className='text-lg font-semibold text-gray-900'>
                {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('pt-BR') : 'N/A'}
              </Text>
            </View>
          </View>
        </Box>

        {/* Botão de Logout */}
        <Button 
          variant='outline' 
          className='border-red-300 mb-6'
          onPress={handleLogout}
        >
          <ButtonIcon as={LogOut} />
          <ButtonText className='text-red-600'>Sair da Conta</ButtonText>
        </Button>
      </ScrollView>
    </View>
  )
}

export default ProfilePage 