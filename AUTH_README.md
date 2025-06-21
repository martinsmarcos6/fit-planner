# Sistema de Autenticação - Fit Planner

Este documento explica como funciona o sistema de autenticação implementado no app Fit Planner.

## Estrutura do Sistema

### 1. Hook de Autenticação (`hooks/useAuth.ts`)

- Gerencia o estado de autenticação
- Salva dados no AsyncStorage (cache local)
- Simula login/registro (pronto para integração com API real)
- Fornece funções: `login`, `register`, `logout`

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
  const { user, isAuthenticated, login, logout } = useAuthContext();

  // Usar as funções e estado
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

- [x] Login com email/senha
- [x] Registro de usuário
- [x] Logout
- [x] Cache local com AsyncStorage
- [x] Proteção de rotas
- [x] Redirecionamento automático
- [x] Estado de loading
- [x] Validação de formulários

### 🔄 Pronto para API Real

- [ ] Substituir simulação por chamadas reais de API
- [ ] Adicionar refresh token
- [ ] Implementar renovação automática de token
- [ ] Adicionar interceptors para requisições autenticadas

## Dados do Usuário

```typescript
interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
```

## Cache Local

Os dados de autenticação são salvos no AsyncStorage com a chave `@fit_planner_auth`:

```json
{
  "user": {
    "id": "1",
    "email": "usuario@exemplo.com",
    "name": "Usuário"
  },
  "token": "mock_token_1234567890"
}
```

## Próximos Passos

1. **Integração com API Real**

   - Substituir simulações por chamadas HTTP
   - Implementar refresh token
   - Adicionar interceptors para requisições

2. **Melhorias de UX**

   - Adicionar toast notifications
   - Implementar recuperação de senha
   - Adicionar autenticação biométrica

3. **Segurança**
   - Implementar expiração de token
   - Adicionar validação de força de senha
   - Implementar rate limiting
