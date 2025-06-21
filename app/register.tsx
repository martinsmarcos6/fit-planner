import { Box } from '@/components/ui/box'
import { Button, ButtonText } from '@/components/ui/button'
import { Checkbox, CheckboxIcon, CheckboxIndicator, CheckboxLabel } from '@/components/ui/checkbox'
import { FormControl, FormControlLabel } from '@/components/ui/form-control'
import { HStack } from '@/components/ui/hstack'
import { Input, InputField } from '@/components/ui/input'
import { Link } from 'expo-router'
import { Check } from 'lucide-react-native'
import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const RegisterPage = () => {
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
              <InputField placeholder='Digite seu nome completo' />
            </Input>
          </FormControl>

          <FormControl>
            <FormControlLabel>
              <Text>Email</Text>
            </FormControlLabel>
            <Input>
              <InputField placeholder='Digite seu email' />
            </Input>
          </FormControl>

          <FormControl>
            <FormControlLabel>
              <Text>Senha</Text>
            </FormControlLabel>
            <Input>
              <InputField placeholder='Digite sua senha' secureTextEntry />
            </Input>
          </FormControl>

          <FormControl>
            <FormControlLabel>
              <Text>Confirmar senha</Text>
            </FormControlLabel>
            <Input>
              <InputField placeholder='Confirme sua senha' secureTextEntry />
            </Input>
          </FormControl>

          <Checkbox value='terms' size='md'>
            <CheckboxIndicator>
              <CheckboxIcon as={Check} />
            </CheckboxIndicator>
            <CheckboxLabel>
              <Text>Concordo com os termos de serviço e política de privacidade</Text>
            </CheckboxLabel>
          </Checkbox>

          <Button className="bg-primary-500">
            <ButtonText className="text-white">Criar conta</ButtonText>
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