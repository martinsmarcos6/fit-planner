import { Box } from '@/components/ui/box'
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button'
import { useAuthContext } from '@/contexts/AuthContext'
import { router } from 'expo-router'
import { LogOut } from 'lucide-react-native'
import { ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const ProfilePage = () => {
  const { user, logout } = useAuthContext();
  const insets = useSafeAreaInsets();

  const handleLogout = async () => {
    await logout();
  };

  const handleEditProfile = () => {
    router.navigate('/(app)/edit-profile');
  };

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
            <View className='w-20 h-20 bg-primary-100 rounded-full items-center justify-center mb-3'>
              <Text className='text-3xl'>{user?.name.charAt(0)}</Text>
            </View>
            <Text className='text-2xl font-bold text-typography-900 mb-1'>
              {user?.name}
            </Text>
            <Text className='text-typography-600 mb-3'>
              {user?.email}
            </Text>
            <Button 
              size='sm' 
              variant='outline' 
              className='border-primary-300'
              onPress={handleEditProfile}
            >
              <ButtonText className='text-primary-600'>Editar Perfil</ButtonText>
            </Button>
          </View>
        </Box>

        {/* Informações Básicas */}
        <Box className='bg-white rounded-lg p-4 mb-6'>
          <Text className='text-xl font-semibold text-typography-900 mb-4'>
            Informações Pessoais
          </Text>
          <View className='flex-col gap-3'>
            <View className='bg-gray-50 p-4 rounded-lg'>
              <Text className='text-sm text-typography-500 mb-1'>Nome</Text>
              <Text className='text-lg font-semibold text-typography-900'>
                {user?.name}
              </Text>
            </View>

            <View className='bg-gray-50 p-4 rounded-lg'>
              <Text className='text-sm text-typography-500 mb-1'>Email</Text>
              <Text className='text-lg font-semibold text-typography-900'>
                {user?.email}
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