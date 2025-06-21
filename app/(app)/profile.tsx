import { Box } from '@/components/ui/box'
import { Button, ButtonText } from '@/components/ui/button'
import { HStack } from '@/components/ui/hstack'
import { useAuthContext } from '@/contexts/AuthContext'
import { ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const ProfilePage = () => {
  const { user, logout } = useAuthContext();
  const insets = useSafeAreaInsets();

  const handleLogout = async () => {
    await logout();
  };

  const stats = [
    { label: 'Treinos Completos', value: '24', icon: '🏋️' },
    { label: 'Dias Ativos', value: '18', icon: '📅' },
    { label: 'Tempo Total', value: '720min', icon: '⏱️' },
    { label: 'Meta Semanal', value: '85%', icon: '🎯' },
  ];

  const menuItems = [
    { title: 'Configurações', icon: '⚙️', action: () => {} },
    { title: 'Metas e Objetivos', icon: '🎯', action: () => {} },
    { title: 'Histórico de Treinos', icon: '📊', action: () => {} },
    { title: 'Preferências', icon: '🔧', action: () => {} },
    { title: 'Sobre o App', icon: 'ℹ️', action: () => {} },
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
        {/* Header com Foto */}
        <Box className='bg-white rounded-lg p-6 mb-6'>
          <View className='items-center mb-4'>
            <View className='w-20 h-20 bg-primary-100 rounded-full items-center justify-center mb-3'>
              <Text className='text-3xl'>👤</Text>
            </View>
            <Text className='text-2xl font-bold text-typography-900 mb-1'>
              {user?.name}
            </Text>
            <Text className='text-typography-600 mb-3'>
              {user?.email}
            </Text>
            <Button size='sm' variant='outline' className='border-primary-300'>
              <ButtonText className='text-primary-600'>Editar Perfil</ButtonText>
            </Button>
          </View>
        </Box>

        {/* Estatísticas */}
        <Box className='bg-white rounded-lg p-4 mb-6'>
          <Text className='text-xl font-semibold text-typography-900 mb-4'>
            📊 Minhas Estatísticas
          </Text>
          <View className='grid grid-cols-2 gap-4'>
            {stats.map((stat, index) => (
              <View 
                key={index}
                className='bg-gray-50 rounded-lg p-4 items-center'
              >
                <Text className='text-2xl mb-2'>{stat.icon}</Text>
                <Text className='text-xl font-bold text-typography-900'>
                  {stat.value}
                </Text>
                <Text className='text-sm text-typography-600 text-center'>
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>
        </Box>

        {/* Informações Pessoais */}
        <Box className='bg-white rounded-lg p-4 mb-6'>
          <Text className='text-xl font-semibold text-typography-900 mb-4'>
            👤 Informações Pessoais
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

            <View className='bg-gray-50 p-4 rounded-lg'>
              <Text className='text-sm text-typography-500 mb-1'>ID do Usuário</Text>
              <Text className='text-lg font-semibold text-typography-900'>
                {user?.id}
              </Text>
            </View>
          </View>
        </Box>

        {/* Menu de Opções */}
        <Box className='bg-white rounded-lg p-4 mb-6'>
          <Text className='text-xl font-semibold text-typography-900 mb-4'>
            ⚙️ Configurações
          </Text>
          <View className='flex-col gap-2'>
            {menuItems.map((item, index) => (
              <Button
                key={index}
                variant='outline'
                className='justify-start p-4 bg-gray-50 border-gray-200'
                onPress={item.action}
              >
                <HStack className='items-center'>
                  <Text className='text-xl mr-3'>{item.icon}</Text>
                  <ButtonText className='text-typography-900 text-left'>
                    {item.title}
                  </ButtonText>
                </HStack>
              </Button>
            ))}
          </View>
        </Box>

        {/* Botão de Logout */}
        <Button 
          variant='outline' 
          className='border-red-300 mb-6'
          onPress={handleLogout}
        >
          <ButtonText className='text-red-600'>🚪 Sair da Conta</ButtonText>
        </Button>
      </ScrollView>
    </View>
  )
}

export default ProfilePage 