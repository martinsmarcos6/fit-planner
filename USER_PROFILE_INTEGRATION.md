# Integração de Usuários e Perfis com Supabase

Este documento explica como a integração de usuários e perfis foi implementada no Fit Planner usando Supabase.

## Estrutura do Banco de Dados

### Tabela `profiles`

A tabela `profiles` armazena informações detalhadas dos usuários:

```sql
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Trigger Automático

Um trigger é executado automaticamente quando um novo usuário se registra:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Hooks e Contextos

### useAuth Hook

O hook `useAuth` gerencia a autenticação e sincroniza automaticamente com a tabela de perfis:

```typescript
const { user, isAuthenticated, login, register, logout, updateUser } =
  useAuth();
```

**Funcionalidades:**

- Login/registro com validação de username único
- Sincronização automática com a tabela `profiles`
- Atualização de dados do usuário
- Reset de senha

### useProfile Hook

O hook `useProfile` fornece funcionalidades específicas para gerenciar perfis:

```typescript
const {
  profile,
  isLoading,
  error,
  updateProfile,
  refreshProfile,
  isUsernameAvailable,
  generateUniqueUsername,
} = useProfile();
```

**Funcionalidades:**

- Carregamento automático do perfil
- Atualização de dados do perfil
- Validação de username
- Geração de username único

## Helpers do Supabase

### profileHelpers

Conjunto de funções utilitárias para gerenciar perfis:

```typescript
import { profileHelpers } from "@/utils/supabase-helpers";

// Garantir que o perfil existe
const profile = await profileHelpers.ensureProfileExists();

// Buscar perfil atual
const currentProfile = await profileHelpers.getCurrentProfile();

// Atualizar perfil
const updatedProfile = await profileHelpers.updateProfile({
  name: "Novo Nome",
  username: "novo_username",
});

// Verificar disponibilidade de username
const isAvailable = await profileHelpers.isUsernameAvailable("username");

// Buscar estatísticas do perfil
const stats = await profileHelpers.getProfileStats(profileId);

// Buscar perfis públicos
const publicProfiles = await profileHelpers.getPublicProfiles(20, 0);

// Buscar perfis sugeridos
const suggestedProfiles = await profileHelpers.getSuggestedProfiles(10);
```

## Componentes

### UserProfileCard

Componente para exibir cards de perfil de usuário:

```typescript
import { UserProfileCard } from "@/components/UserProfileCard";

<UserProfileCard
  profile={profile}
  onPress={() => router.navigate(`/user/${profile.username}`)}
  showStats={true}
  compact={false}
/>;
```

**Props:**

- `profile`: Dados do perfil
- `onPress`: Função executada ao clicar no card
- `showStats`: Exibir estatísticas do perfil
- `compact`: Modo compacto

## Fluxo de Autenticação

### 1. Registro de Usuário

```typescript
const result = await register(email, password, name, username);
if (result.success) {
  // Usuário registrado com sucesso
  // Perfil criado automaticamente via trigger
} else {
  // Erro no registro
  console.error(result.error);
}
```

### 2. Login

```typescript
const result = await login(email, password);
if (result.success) {
  // Login realizado com sucesso
  // Perfil sincronizado automaticamente
} else {
  // Erro no login
  console.error(result.error);
}
```

### 3. Atualização de Perfil

```typescript
const result = await updateProfile({
  name: "Novo Nome",
  username: "novo_username",
});

if (result.success) {
  // Perfil atualizado com sucesso
} else {
  // Erro na atualização
  console.error(result.error);
}
```

## Validações

### Username

- Mínimo 3 caracteres
- Máximo 20 caracteres
- Apenas letras, números e underscore
- Deve ser único

### Nome

- Mínimo 2 caracteres
- Máximo 50 caracteres

## Políticas de Segurança (RLS)

As políticas de segurança garantem que:

- Usuários só podem ver e editar seus próprios perfis
- Dados sensíveis são protegidos
- Acesso controlado baseado na autenticação

```sql
-- Usuários podem ver apenas seus próprios perfis
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Usuários podem atualizar apenas seus próprios perfis
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

## Exemplo de Uso Completo

```typescript
import { useAuthContext } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { profileHelpers } from "@/utils/supabase-helpers";

const MyComponent = () => {
  const { user, isAuthenticated } = useAuthContext();
  const { profile, updateProfile } = useProfile();

  const handleUpdateProfile = async () => {
    const result = await updateProfile({
      name: "João Silva",
      username: "joao_silva",
    });

    if (result.success) {
      console.log("Perfil atualizado com sucesso!");
    } else {
      console.error("Erro:", result.error);
    }
  };

  return (
    <View>
      <Text>Nome: {profile?.name}</Text>
      <Text>Username: @{profile?.username}</Text>
      <Button onPress={handleUpdateProfile}>Atualizar Perfil</Button>
    </View>
  );
};
```

## Tratamento de Erros

Todos os hooks e helpers incluem tratamento de erros robusto:

- Validação de dados de entrada
- Verificação de disponibilidade de username
- Tratamento de erros de rede
- Fallbacks para dados ausentes

## Performance

- Cache automático de dados do perfil
- Carregamento lazy de estatísticas
- Otimização de queries com índices
- Sincronização eficiente com o Supabase

## Próximos Passos

1. Implementar upload de avatar
2. Adicionar campos adicionais ao perfil (bio, localização, etc.)
3. Implementar sistema de seguidores
4. Adicionar notificações de perfil
5. Implementar busca de usuários
