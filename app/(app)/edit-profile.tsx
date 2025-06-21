import { Box } from '@/components/ui/box'
import { Button, ButtonText } from '@/components/ui/button'
import { FormControl, FormControlLabel, FormControlLabelText } from '@/components/ui/form-control'
import { Input, InputField } from '@/components/ui/input'
import { useAuthContext } from '@/contexts/AuthContext'
import { router } from 'expo-router'
import { ArrowLeft } from 'lucide-react-native'
import { useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const EditProfilePage = () => {
  const { user, updateUser } = useAuthContext();
  const insets = useSafeAreaInsets();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    setIsLoading(true);
    try {
      await updateUser({ name: name.trim(), email: email.trim() });
      router.navigate('/(app)/profile');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      alert('Erro ao atualizar perfil. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.navigate('/(app)/profile');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <View 
        style={{ 
          backgroundColor: '#ffffff',
          paddingTop: insets.top + 10,
          paddingBottom: 20,
          paddingHorizontal: 20,
          borderBottomWidth: 1,
          borderBottomColor: '#e5e7eb'
        }}
      >
        <View className='flex-row items-center justify-between'>
          <Button 
            variant='outline' 
            size='sm'
            onPress={handleCancel}
            className='border-gray-300'
          >
            <ArrowLeft size={20} color='#6b7280' />
          </Button>
          <Text className='text-xl font-bold text-typography-900'>
            Editar Perfil
          </Text>
          <View style={{ width: 40 }} />
        </View>
      </View>

      <ScrollView 
        style={{ flex: 1 }} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: insets.bottom + 20
        }}
      >
        {/* Foto do Perfil */}
        <Box className='bg-white rounded-lg p-6 mb-6'>
          <View className='items-center'>
            <View className='w-24 h-24 bg-primary-100 rounded-full items-center justify-center mb-4'>
              <Text className='text-4xl font-bold text-primary-600'>
                {name.charAt(0) || 'U'}
              </Text>
            </View>
            <Text className='text-typography-600 text-center'>
              Clique para alterar a foto
            </Text>
          </View>
        </Box>

        {/* Formulário */}
        <Box className='bg-white rounded-lg p-6'>
          <Text className='text-xl font-semibold text-typography-900 mb-6'>
            Informações Pessoais
          </Text>
          
          <View className='flex-col gap-4'>
            <FormControl>
              <FormControlLabel>
                <FormControlLabelText className='text-typography-700 font-medium'>
                  Nome Completo
                </FormControlLabelText>
              </FormControlLabel>
              <Input className='bg-gray-50 border-gray-200'>
                <InputField
                  placeholder='Digite seu nome completo'
                  value={name}
                  onChangeText={setName}
                  className='text-typography-900'
                />
              </Input>
            </FormControl>

            <FormControl>
              <FormControlLabel>
                <FormControlLabelText className='text-typography-700 font-medium'>
                  Email
                </FormControlLabelText>
              </FormControlLabel>
              <Input className='bg-gray-50 border-gray-200'>
                <InputField
                  placeholder='Digite seu email'
                  value={email}
                  onChangeText={setEmail}
                  keyboardType='email-address'
                  autoCapitalize='none'
                  className='text-typography-900'
                />
              </Input>
            </FormControl>
          </View>
        </Box>

        {/* Botões */}
        <View className='mt-6 flex-col gap-4'>
          <Button 
            className='bg-primary-600'
            onPress={handleSave}
            disabled={isLoading}
          >
            <ButtonText className='text-white font-semibold'>
              {isLoading ? 'Salvando...' : 'Salvar Alterações'}
            </ButtonText>
          </Button>

          <Button 
            variant='outline'
            className='border-gray-300'
            onPress={handleCancel}
            disabled={isLoading}
          >
            <ButtonText className='text-typography-700'>
              Cancelar
            </ButtonText>
          </Button>
        </View>
      </ScrollView>
    </View>
  )
}

export default EditProfilePage 