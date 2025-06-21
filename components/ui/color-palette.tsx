import { Text, View } from 'react-native'

const ColorPalette = () => {
  const primaryShades = [
    { name: 'primary-50', class: 'bg-primary-50' },
    { name: 'primary-100', class: 'bg-primary-100' },
    { name: 'primary-200', class: 'bg-primary-200' },
    { name: 'primary-300', class: 'bg-primary-300' },
    { name: 'primary-400', class: 'bg-primary-400' },
    { name: 'primary-500', class: 'bg-primary-500' },
    { name: 'primary-600', class: 'bg-primary-600' },
    { name: 'primary-700', class: 'bg-primary-700' },
    { name: 'primary-800', class: 'bg-primary-800' },
    { name: 'primary-900', class: 'bg-primary-900' },
    { name: 'primary-950', class: 'bg-primary-950' },
  ]

  return (
    <View className='p-4'>
      <Text className='text-xl font-bold mb-4 text-typography-900'>Paleta de Cores Primárias</Text>
      <View className='flex-row flex-wrap gap-2'>
        {primaryShades.map((shade) => (
          <View key={shade.name} className='items-center'>
            <View className={`w-16 h-16 rounded-lg ${shade.class} border border-typography-200`} />
            <Text className='text-xs mt-1 text-typography-600'>{shade.name}</Text>
          </View>
        ))}
      </View>
      
      <Text className='text-lg font-semibold mt-6 mb-3 text-typography-900'>Exemplos de Uso</Text>
      
      <View className='space-y-3'>
        <View className='bg-primary-500 p-3 rounded-lg'>
          <Text className='text-white font-medium'>Botão Primário (bg-primary-500)</Text>
        </View>
        
        <View className='bg-primary-100 p-3 rounded-lg border border-primary-200'>
          <Text className='text-primary-800 font-medium'>Card com Fundo Suave (bg-primary-100)</Text>
        </View>
        
        <View className='bg-white p-3 rounded-lg border border-primary-300'>
          <Text className='text-primary-700 font-medium'>Card com Borda (border-primary-300)</Text>
        </View>
        
        <View className='bg-white p-3 rounded-lg'>
          <Text className='text-primary-600 font-medium'>Texto Primário (text-primary-600)</Text>
        </View>
      </View>
    </View>
  )
}

export default ColorPalette 