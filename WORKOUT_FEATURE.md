# Funcionalidade de Criação de Treinos

## Visão Geral

Esta funcionalidade permite aos usuários criar e gerenciar seus treinos de musculação, organizando exercícios por dia da semana com divisões específicas. **Todas as páginas estão protegidas por autenticação.**

## Funcionalidades Implementadas

### 1. Lista de Treinos (`app/(app)/workouts.tsx`)

- Exibe todos os treinos criados pelo usuário
- Mostra o nome do treino e data de criação
- Botão "Novo Treino" para criar um novo treino
- Estado vazio quando não há treinos criados
- Navegação para detalhes do treino ao clicar
- **Protegida por autenticação**

### 2. Criação de Treino (`app/(app)/create-workout.tsx`)

- Formulário para definir o nome do treino
- Interface para configurar todos os 7 dias da semana
- Para cada dia:
  - Campo para definir a divisão (ex: Push, Pull, Legs, Upper, Lower)
  - Lista de exercícios com campos para:
    - Nome do exercício
    - Número de séries
    - Range de repetições
  - Botões para adicionar/remover exercícios
  - Interface expansível para cada dia
- **Protegida por autenticação**

### 3. Detalhes do Treino (`app/(app)/workout-details.tsx`)

- Visualização completa do treino criado
- Lista de todos os dias da semana
- Para cada dia mostra:
  - Nome do dia
  - Divisão configurada
  - Lista de exercícios com séries e repetições
- Interface expansível para visualizar exercícios
- **Protegida por autenticação**

### 4. Gerenciamento de Estado (`contexts/WorkoutContext.tsx`)

- Contexto React para gerenciar treinos
- Funções para:
  - Adicionar novo treino
  - Deletar treino
  - Buscar treino por ID
  - Listar todos os treinos

## Estrutura de Dados

### Exercise

```typescript
interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
}
```

### DayWorkout

```typescript
interface DayWorkout {
  day: string;
  division: string;
  exercises: Exercise[];
}
```

### Workout

```typescript
interface Workout {
  id: string;
  name: string;
  days: DayWorkout[];
  createdAt: Date;
}
```

## Fluxo de Uso

1. **Acessar Treinos**: Usuário navega para a tela "Meus Treinos" (protegida por autenticação)
2. **Criar Novo Treino**: Clica em "Novo Treino" (navegação relativa para `./create-workout`)
3. **Configurar Treino**:
   - Define o nome do treino
   - Para cada dia da semana:
     - Define a divisão (ex: "Push" para segunda-feira)
     - Adiciona exercícios com séries e repetições
4. **Salvar Treino**: Clica em "Salvar Treino"
5. **Visualizar Treino**: Retorna à lista e pode clicar no treino para ver detalhes (navegação relativa para `./workout-details`)

## Exemplo de Uso

### Treino PPL (Push, Pull, Legs)

- **Segunda-feira**: Divisão "Push"
  - Supino inclinado com halter (3 séries, 8-12 reps)
  - Desenvolvimento (3 séries, 8-12 reps)
  - Rosca direta (3 séries, 8-12 reps)
- **Terça-feira**: Divisão "Pull"
  - Puxada na frente (3 séries, 8-12 reps)
  - Remada curvada (3 séries, 8-12 reps)
- **Quarta-feira**: Divisão "Legs"
  - Agachamento (3 séries, 8-12 reps)
  - Leg press (3 séries, 8-12 reps)

## Segurança e Autenticação

- **Todas as páginas de treinos estão dentro da pasta `(app)`**
- **Protegidas pelo `AuthGuard`** que verifica se o usuário está autenticado
- **Navegação relativa** (`./create-workout`, `./workout-details`) mantém a proteção
- **Redirecionamento automático** para login se não autenticado

## Tecnologias Utilizadas

- **React Native** com Expo Router para navegação
- **Gluestack UI** para componentes de interface
- **TypeScript** para tipagem
- **Context API** para gerenciamento de estado
- **Tailwind CSS** (NativeWind) para estilização
- **AuthGuard** para proteção de rotas

## Próximos Passos

- Persistência de dados (AsyncStorage ou banco de dados)
- Edição de treinos existentes
- Deletar treinos
- Compartilhamento de treinos
- Histórico de treinos realizados
- Progresso e evolução dos pesos
