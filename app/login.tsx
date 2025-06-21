import { Box } from '@/components/ui/box'
import { Button, ButtonText } from '@/components/ui/button'
import { FormControl, FormControlLabel } from '@/components/ui/form-control'
import { HStack } from '@/components/ui/hstack'
import { Input, InputField } from '@/components/ui/input'
import { useAuthContext } from '@/contexts/AuthContext'
import { Link, router } from 'expo-router'
import { useState } from 'react'
import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const LoginPage = () => {
  const { login, isLoading } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    setError('');
    const result = await login(email, password);
    
    if (result.success) {
      router.replace('/(app)/profile');
    } else {
      setError(result.error || 'Erro no login');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 20 }}>
        <Box className='bg-white rounded-lg p-4 flex-col gap-4'>
          <FormControl>
            <FormControlLabel>
              <Text>Email</Text>
            </FormControlLabel>
            <Input>
              <InputField 
                placeholder='Digite seu email' 
                value={email}
                onChangeText={setEmail}
                keyboardType='email-address'
                autoCapitalize='none'
              />
            </Input>
          </FormControl>
          <FormControl>
            <FormControlLabel>
              <Text>Senha</Text>
            </FormControlLabel>
            <Input>
              <InputField 
                placeholder='Digite sua senha' 
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </Input>
          </FormControl>

          {error ? (
            <Text className='text-red-500 text-center'>{error}</Text>
          ) : null}

          <Button 
            className="bg-primary-500" 
            onPress={handleLogin}
            disabled={isLoading}
          >
            <ButtonText className="text-white">
              {isLoading ? 'Entrando...' : 'Entrar'}
            </ButtonText>
          </Button>

          <Text className='text-center text-typography-600'>Esqueceu a senha?</Text>
          
        </Box>

        <View className='flex-row items-center my-6'>
          <View className='flex-1 h-[1px] bg-outline-300' />
          <Text className='text-typography-600 mx-4'>
            Continue com
          </Text>
          <View className='flex-1 h-[1px] bg-outline-300' />
        </View>

        <HStack space='md'>
          <Button variant='outline' className='flex-1 border-outline-300'>
            <ButtonText className='text-typography-900'>Google</ButtonText>
          </Button>

          <Button variant='outline' className='flex-1 border-outline-300'>
            <ButtonText className='text-typography-900'>Facebook</ButtonText>
          </Button>
        </HStack>

        <View className='flex-row justify-center items-center gap-1 mt-4'>
          <Text className='text-typography-900'>Não possui uma conta?</Text>
          <Link href='/register' asChild>
            <Text className='text-primary-500 font-semibold'>Cadastre-se</Text>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default LoginPage