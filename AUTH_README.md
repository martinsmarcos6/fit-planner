# Sistema de Autenticação - Fit Planner com Supabase

Este documento explica como funciona o sistema de autenticação implementado no app Fit Planner usando Supabase.

## Configuração Inicial

### 1. Configurar Supabase

1. Acesse [https://supabase.com](https://supabase.com) e crie uma conta
2. Crie um novo projeto
3. Vá em **Settings > API** e copie:
   - **Project URL**
   - **anon/public key**

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
EXPO_PUBLIC_SUPABASE_URL=sua_url_do_supabase_aqui
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase_aqui
```

### 3. Configurar Banco de Dados

Execute o SQL do arquivo `supabase-schema.sql` no **SQL Editor** do Supabase para criar as tabelas e políticas de segurança.

## Estrutura do Sistema

### 1. Hook de Autenticação (`hooks/useAuth.ts`)

- Gerencia o estado de autenticação com Supabase
- Escuta mudanças na autenticação em tempo real
- Fornece funções: `login`, `register`, `logout`, `resetPassword`
- Suporte a username único

### 2. Contexto de Autenticação (`contexts/AuthContext.tsx`)

- Compartilha o estado de autenticação entre componentes
- Usa o hook `useAuth` internamente
- Fornece o hook `useAuthContext` para componentes

### 3. Proteção de Rotas (`components/AuthGuard.tsx`)

- Componente que protege rotas autenticadas
- Redireciona para login se não autenticado
- Mostra loading durante verificação

## Como Usar

### 1. Em Componentes

```typescript
import { useAuthContext } from "@/contexts/AuthContext";

function MeuComponente() {
  const { user, isAuthenticated, login, logout, resetPassword } =
    useAuthContext();

  const handleLogin = async () => {
    const result = await login("email@exemplo.com", "senha123");
    if (result.success) {
      console.log("Login realizado com sucesso!");
    } else {
      console.error("Erro no login:", result.error);
    }
  };

  const handleRegister = async () => {
    const result = await register(
      "email@exemplo.com",
      "senha123",
      "Nome do Usuário",
      "username_unico" // opcional
    );
    if (result.success) {
      console.log("Registro realizado com sucesso!");
    }
  };

  const handleResetPassword = async () => {
    const result = await resetPassword("email@exemplo.com");
    if (result.success) {
      console.log("Email de reset enviado!");
    }
  };
}
```

### 2. Proteger Rotas

```typescript
import { AuthGuard } from "@/components/AuthGuard";

function MinhaRotaProtegida() {
  return (
    <AuthGuard>
      <ConteudoProtegido />
    </AuthGuard>
  );
}
```

### 3. Trabalhar com Usernames

```typescript
import { profileHelpers } from "@/utils/supabase-helpers";

// Verificar se um username está disponível
const isAvailable = await profileHelpers.isUsernameAvailable("meu_username");

// Buscar perfil por username
const profile = await profileHelpers.getProfileByUsername("usuario123");

// Gerar username único
const uniqueUsername = await profileHelpers.generateUniqueUsername("usuario");
```

## Estrutura de Rotas

```
app/
├── index.tsx          # Redireciona baseado na autenticação
├── login.tsx          # Página de login
├── register.tsx       # Página de registro
└── (app)/             # Rotas autenticadas
    ├── _layout.tsx    # Layout com AuthGuard
    ├── index.tsx      # Página principal autenticada
    ├── profile.tsx    # Perfil do usuário
    └── workouts.tsx   # Treinos
```

## Funcionalidades

### ✅ Implementado

- [x] Login com email/senha via Supabase
- [x] Registro de usuário via Supabase
- [x] Logout via Supabase
- [x] Reset de senha via email
- [x] Sincronização automática de sessão
- [x] Proteção de rotas
- [x] Redirecionamento automático
- [x] Estado de loading
- [x] Validação de formulários
- [x] Row Level Security (RLS)
- [x] Criação automática de perfil
- [x] Username único por usuário
- [x] Verificação de disponibilidade de username
- [x] Geração automática de username único

### 🔄 Próximas Melhorias

- [ ] Autenticação com Google/Apple
- [ ] Autenticação biométrica
- [ ] Refresh token automático
- [ ] Interceptors para requisições autenticadas
- [ ] Toast notifications
- [ ] Rate limiting

## Dados do Usuário

```typescript
interface User {
  id: string;
  email: string;
  username: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
```

## Estrutura do Banco de Dados

### Tabela `profiles`

```sql
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tabela `workouts`

```sql
CREATE TABLE public.workouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Segurança

### Row Level Security (RLS)

- Usuários só podem acessar seus próprios dados
- Políticas de segurança configuradas automaticamente
- Triggers para criação automática de perfis

### Autenticação

- Tokens JWT gerenciados pelo Supabase
- Sessões persistentes com AsyncStorage
- Refresh automático de tokens

### Username

- Username único por usuário
- Geração automática de username único
- Verificação de disponibilidade
- Índices para performance

## Troubleshooting

### Erro: "Variáveis de ambiente não configuradas"

1. Verifique se o arquivo `.env` existe
2. Confirme se as variáveis estão corretas
3. Reinicie o servidor de desenvolvimento

### Erro: "Invalid login credentials"

1. Verifique se o usuário existe no Supabase
2. Confirme se a senha está correta
3. Verifique se o email foi confirmado (se necessário)

### Erro: "Row Level Security policy violation"

1. Execute o SQL do `supabase-schema.sql`
2. Verifique se as políticas foram criadas
3. Confirme se o RLS está habilitado

### Erro: "Username already exists"

1. Use `profileHelpers.isUsernameAvailable()` para verificar
2. Use `profileHelpers.generateUniqueUsername()` para gerar um único
3. O sistema gera automaticamente usernames únicos no registro

### Erro: "Database error saving new user"

- **Este é um erro comum durante a configuração inicial**
- **Verifique se o formulário de registro inclui o campo username**
- Execute o script `quick-fix-registration.sql` para correção rápida
- Execute o script `fix-registration-issues.sql` para diagnóstico completo
- Verifique se todas as funções e triggers foram criados corretamente
- Se o problema persistir, tente:
  1. Executar o schema SQL novamente
  2. Verificar se não há conflitos de username
  3. Limpar dados de teste se necessário

### Erro: "column log_time does not exist"

- **Este erro é normal no script de diagnóstico**
- A consulta de logs foi removida do script corrigido
- Use o script `fix-registration-issues.sql` atualizado
- Para ver logs, vá em **Logs > Database** no dashboard do Supabase

## Formulário de Registro

O formulário de registro (`app/register.tsx`) inclui:

### Campos Obrigatórios:

- **Nome completo**: Nome real do usuário
- **Username**: Nome de usuário único (3+ caracteres, apenas letras, números e underscore)
- **Email**: Email válido
- **Senha**: Senha do usuário
- **Confirmar senha**: Confirmação da senha

### Validações:

- Todos os campos são obrigatórios
- Senhas devem coincidir
- Username deve ter pelo menos 3 caracteres
- Username deve conter apenas caracteres válidos
- Verificação em tempo real da disponibilidade do username
- Aceitação dos termos de serviço

### Funcionalidades:

- **Verificação em tempo real** da disponibilidade do username
- **Debounce** de 500ms para evitar muitas requisições
- **Indicadores visuais** (ícones e cores) para status do username
- **Botão desabilitado** até que o username esteja disponível

## Comandos Úteis

```bash
# Instalar dependências
pnpm install

# Iniciar servidor de desenvolvimento
pnpm start

# Verificar configuração do Supabase
pnpm start --clear
```
