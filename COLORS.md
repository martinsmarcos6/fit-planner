# Sistema de Cores - Fit Planner

Este projeto utiliza um sistema de cores personalizado configurado com Tailwind CSS e Gluestack UI Provider.

## Cores Disponíveis

### Cor Primária (Laranja #FF5900)

A cor primária é um laranja vibrante com 11 variações:

- `primary-50` - Laranja muito claro (fundo suave)
- `primary-100` - Laranja claro (fundo)
- `primary-200` - Laranja médio-claro (bordas)
- `primary-300` - Laranja médio (elementos secundários)
- `primary-400` - Laranja médio-escuro
- `primary-500` - Laranja principal (#FF5900) (botões, links)
- `primary-600` - Laranja escuro (texto em fundo claro)
- `primary-700` - Laranja mais escuro
- `primary-800` - Laranja muito escuro
- `primary-900` - Laranja quase preto
- `primary-950` - Laranja preto

### Outras Cores do Sistema

- **Secundária**: Verde (`secondary-*`)
- **Terciária**: Roxo (`tertiary-*`)
- **Erro**: Vermelho (`error-*`)
- **Sucesso**: Verde (`success-*`)
- **Aviso**: Amarelo/Laranja (`warning-*`)
- **Informação**: Azul (`info-*`)
- **Tipografia**: Cinza (`typography-*`)
- **Outline**: Cinza (`outline-*`)
- **Background**: Cinza (`background-*`)

## Como Usar

### Classes CSS

```tsx
// Fundo
<View className="bg-primary-500" />

// Texto
<Text className="text-primary-600" />

// Borda
<View className="border border-primary-200" />

// Combinações
<Button className="bg-primary-500">
  <ButtonText className="text-white">Botão</ButtonText>
</Button>
```

### Exemplos Práticos

#### Botão Primário

```tsx
<Button className="bg-primary-500">
  <ButtonText className="text-white">Entrar</ButtonText>
</Button>
```

#### Link

```tsx
<Text className="text-primary-600 font-semibold">Cadastre-se</Text>
```

#### Card com Borda

```tsx
<View className="bg-white p-4 rounded-lg border border-primary-200">
  <Text className="text-typography-800">Conteúdo do card</Text>
</View>
```

#### Fundo Suave

```tsx
<View className="bg-primary-50 p-4 rounded-lg">
  <Text className="text-primary-800">Informação importante</Text>
</View>
```

## Personalização

Para alterar a cor primária, edite as variáveis no arquivo `components/ui/gluestack-ui-provider/config.ts`:

```typescript
export const config = {
  light: vars({
    "--color-primary-500": "255 89 0", // Laranja atual #FF5900
    // Altere para sua cor preferida em formato RGB
  }),
  dark: vars({
    "--color-primary-500": "255 89 0", // Laranja atual #FF5900
    // Altere para sua cor preferida em formato RGB
  }),
};
```

### Sugestões de Cores

- **Verde**: `34 197 94` (para apps de fitness)
- **Roxo**: `168 85 247` (para apps modernos)
- **Azul**: `59 130 246` (para apps profissionais)
- **Vermelho**: `239 68 68` (para apps de saúde)

## Configuração

As cores são configuradas através do Gluestack UI Provider, que oferece:

- **Suporte a tema claro/escuro**: Cores diferentes para cada modo
- **Variáveis CSS**: Integração perfeita com Tailwind CSS
- **Performance otimizada**: Cores carregadas apenas quando necessário

## Componente de Demonstração

Use o componente `ColorPalette` para visualizar todas as variações da cor primária:

```tsx
import ColorPalette from "@/components/ui/color-palette";

// Em qualquer página
<ColorPalette />;
```
