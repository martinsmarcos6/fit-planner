# Fit Planner

Um app de planejamento de treinos desenvolvido com React Native, Expo e Supabase.

## 🚀 Funcionalidades

- ✅ Autenticação de usuários com Supabase
- ✅ Registro e login com email/senha
- ✅ Reset de senha via email
- ✅ Username único por usuário
- ✅ Proteção de rotas autenticadas
- ✅ Gerenciamento de treinos
- ✅ Perfil de usuário
- ✅ Sincronização em tempo real
- ✅ Row Level Security (RLS)

## 🛠️ Tecnologias

- **Frontend**: React Native, Expo, TypeScript
- **UI**: Gluestack UI, NativeWind (Tailwind CSS)
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Navegação**: Expo Router
- **Estado**: React Context + Hooks

## 📱 Screenshots

_Screenshots serão adicionados aqui_

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- pnpm
- Expo CLI
- Conta no Supabase

### 1. Instalar Dependências

```bash
pnpm install
```

### 2. Configurar Supabase

1. Siga o guia em [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
2. Crie um arquivo `.env` com suas credenciais:

```env
EXPO_PUBLIC_SUPABASE_URL=sua_url_do_supabase
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
```

### 3. Executar o App

```bash
# Desenvolvimento
pnpm start

# Android
pnpm android

# iOS
pnpm ios

# Web
pnpm web
```

## 📁 Estrutura do Projeto

```
fit-planner/
├── app/                    # Rotas (Expo Router)
│   ├── (app)/             # Rotas autenticadas
│   ├── login.tsx          # Página de login
│   └── register.tsx       # Página de registro
├── components/            # Componentes reutilizáveis
│   ├── ui/               # Componentes de UI
│   └── AuthGuard.tsx     # Proteção de rotas
├── contexts/             # Contextos React
│   └── AuthContext.tsx   # Contexto de autenticação
├── hooks/                # Hooks personalizados
│   └── useAuth.ts        # Hook de autenticação
├── utils/                # Utilitários
│   ├── supabase.ts       # Cliente Supabase
│   └── supabase-helpers.ts # Helpers para Supabase
├── examples/             # Exemplos de uso
└── docs/                 # Documentação
```

## 🔐 Autenticação

O app usa Supabase para autenticação com as seguintes funcionalidades:

- Login/Registro com email e senha
- Username único por usuário
- Reset de senha
- Sessões persistentes
- Proteção de rotas
- Row Level Security

### Como Usar

```typescript
import { useAuthContext } from "@/contexts/AuthContext";

function MeuComponente() {
  const { user, login, logout, isAuthenticated } = useAuthContext();

  const handleLogin = async () => {
    const result = await login("email@exemplo.com", "senha123");
    if (result.success) {
      console.log("Login realizado!");
    }
  };

  const handleRegister = async () => {
    const result = await register(
      "email@exemplo.com",
      "senha123",
      "Nome do Usuário",
      "username_unico" // opcional
    );
  };
}
```

### Trabalhar com Usernames

```typescript
import { profileHelpers } from "@/utils/supabase-helpers";

// Verificar disponibilidade
const isAvailable = await profileHelpers.isUsernameAvailable("meu_username");

// Buscar perfil por username
const profile = await profileHelpers.getProfileByUsername("usuario123");

// Gerar username único
const uniqueUsername = await profileHelpers.generateUniqueUsername("usuario");
```

## 🗄️ Banco de Dados

### Tabelas Principais

- **profiles**: Perfis dos usuários (id, email, username, name)
- **workouts**: Treinos dos usuários

### Helpers Disponíveis

```typescript
import { workoutHelpers, profileHelpers } from "@/utils/supabase-helpers";

// Buscar treinos do usuário
const workouts = await workoutHelpers.getUserWorkouts();

// Criar novo treino
const newWorkout = await workoutHelpers.createWorkout({
  name: "Treino A",
  description: "Descrição do treino",
});

// Verificar username
const isAvailable = await profileHelpers.isUsernameAvailable("username");
```

## 🎨 UI/UX

- Design system com Gluestack UI
- Tema escuro/claro
- Componentes acessíveis
- Animações suaves

## 📚 Documentação

- [Configuração do Supabase](./SUPABASE_SETUP.md)
- [Sistema de Autenticação](./AUTH_README.md)
- [Funcionalidades de Treino](./WORKOUT_FEATURE.md)
- [Paleta de Cores](./COLORS.md)

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

Se você encontrar algum problema ou tiver dúvidas:

1. Verifique a [documentação](./docs/)
2. Consulte os [issues](../../issues)
3. Abra um novo issue com detalhes do problema

## 🚀 Próximas Funcionalidades

- [ ] Autenticação com Google/Apple
- [ ] Upload de imagens
- [ ] Notificações push
- [ ] Modo offline
- [ ] Exportar treinos
- [ ] Compartilhar treinos
- [ ] Estatísticas de treino
- [ ] Integração com wearables
