import { Box } from '@/components/ui/box'
import { Button, ButtonText } from '@/components/ui/button'
import { Checkbox, CheckboxIcon, CheckboxIndicator, CheckboxLabel } from '@/components/ui/checkbox'
import { FormControl, FormControlLabel } from '@/components/ui/form-control'
import { HStack } from '@/components/ui/hstack'
import { Input, InputField } from '@/components/ui/input'
import { useAuthContext } from '@/contexts/AuthContext'
import { profileHelpers } from '@/utils/supabase-helpers'
import { Link, router } from 'expo-router'
import { Check, X } from 'lucide-react-native'
import { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const RegisterPage = () => {
  const { register, isLoading } = useAuthContext();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle');

  // Verificar disponibilidade do username em tempo real
  useEffect(() => {
    const checkUsername = async () => {
      if (username.length < 3) {
        setUsernameStatus('idle');
        return;
      }

      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        setUsernameStatus('unavailable');
        return;
      }

      setUsernameStatus('checking');
      
      try {
        const isAvailable = await profileHelpers.isUsernameAvailable(username);
        setUsernameStatus(isAvailable ? 'available' : 'unavailable');
      } catch (error) {
        setUsernameStatus('unavailable');
      }
    };

    const timeoutId = setTimeout(checkUsername, 500); // Debounce de 500ms
    return () => clearTimeout(timeoutId);
  }, [username]);

  const handleRegister = async () => {
    if (!name || !username || !email || !password || !confirmPassword) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (!acceptTerms) {
      setError('Você deve aceitar os termos de serviço');
      return;
    }

    // Validar formato do username
    if (username.length < 3) {
      setError('O username deve ter pelo menos 3 caracteres');
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('O username deve conter apenas letras, números e underscore');
      return;
    }

    if (usernameStatus !== 'available') {
      setError('Username não está disponível');
      return;
    }

    setError('');
    const result = await register(email, password, name, username);
    
    if (result.success) {
      router.replace('/(app)/profile');
    } else {
      setError(result.error || 'Erro no registro');
    }
  };

  const getUsernameStatusText = () => {
    switch (usernameStatus) {
      case 'checking':
        return 'Verificando disponibilidade...';
      case 'available':
        return 'Username disponível';
      case 'unavailable':
        return 'Username não disponível';
      default:
        return 'Apenas letras, números e underscore. Mínimo 3 caracteres.';
    }
  };

  const getUsernameStatusColor = () => {
    switch (usernameStatus) {
      case 'checking':
        return 'text-typography-600';
      case 'available':
        return 'text-green-600';
      case 'unavailable':
        return 'text-red-600';
      default:
        return 'text-typography-600';
    }
  };

  const getUsernameStatusIcon = () => {
    switch (usernameStatus) {
      case 'checking':
        return null;
      case 'available':
        return <Check size={16} color="#16a34a" />;
      case 'unavailable':
        return <X size={16} color="#dc2626" />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 20 }}>
        <Box className='bg-white rounded-lg p-4 flex-col gap-4'>
          <Text className='text-2xl font-bold text-center text-typography-900 mb-4'>
            Criar Conta
          </Text>
          
          <FormControl>
            <FormControlLabel>
              <Text>Nome completo</Text>
            </FormControlLabel>
            <Input>
              <InputField 
                placeholder='Digite seu nome completo' 
                value={name}
                onChangeText={setName}
              />
            </Input>
          </FormControl>

          <FormControl>
            <FormControlLabel>
              <Text>Username</Text>
            </FormControlLabel>
            <Input>
              <InputField 
                placeholder='Digite seu username' 
                value={username}
                onChangeText={setUsername}
                autoCapitalize='none'
                autoCorrect={false}
              />
            </Input>
            <View className='flex-row items-center gap-2 mt-1'>
              {getUsernameStatusIcon()}
              <Text className={`text-xs ${getUsernameStatusColor()}`}>
                {getUsernameStatusText()}
              </Text>
            </View>
          </FormControl>

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
                secureTextEntry 
                value={password}
                onChangeText={setPassword}
              />
            </Input>
          </FormControl>

          <FormControl>
            <FormControlLabel>
              <Text>Confirmar senha</Text>
            </FormControlLabel>
            <Input>
              <InputField 
                placeholder='Confirme sua senha' 
                secureTextEntry 
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </Input>
          </FormControl>

          <Checkbox 
            value='terms' 
            size='md'
            isChecked={acceptTerms}
            onChange={setAcceptTerms}
          >
            <CheckboxIndicator>
              <CheckboxIcon as={Check} />
            </CheckboxIndicator>
            <CheckboxLabel>
              <Text>Concordo com os termos de serviço e política de privacidade</Text>
            </CheckboxLabel>
          </Checkbox>

          {error ? (
            <Text className='text-red-500 text-center'>{error}</Text>
          ) : null}

          <Button 
            className="bg-primary-500"
            onPress={handleRegister}
            disabled={isLoading || usernameStatus !== 'available'}
          >
            <ButtonText className="text-white">
              {isLoading ? 'Criando conta...' : 'Criar conta'}
            </ButtonText>
          </Button>
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
          <Text className='text-typography-900'>Já possui uma conta?</Text>
          <Link href='/login' asChild>
            <Text className='text-primary-500 font-semibold'>Entre</Text>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default RegisterPage