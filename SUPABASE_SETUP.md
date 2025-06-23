# Configuração do Supabase para o Fit Planner

Este guia irá ajudá-lo a configurar o Supabase para o projeto Fit Planner.

## 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Faça login ou crie uma conta
3. Clique em "New Project"
4. Escolha sua organização
5. Digite um nome para o projeto (ex: "fit-planner")
6. Escolha uma senha forte para o banco de dados
7. Escolha uma região próxima a você
8. Clique em "Create new project"

## 2. Configurar Variáveis de Ambiente

Após criar o projeto, você precisará das credenciais do Supabase:

1. No dashboard do Supabase, vá para **Settings** > **API**
2. Copie as seguintes informações:

   - **Project URL** (ex: `https://your-project.supabase.co`)
   - **anon public** key (chave pública)
   - **service_role** key (chave privada - mantenha segura)

3. Crie um arquivo `.env` na raiz do projeto com:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 3. Executar Script SQL

### ⚠️ IMPORTANTE: Se você já executou o script anteriormente

Se você já tentou executar o script e encontrou erros de trigger duplicado, execute primeiro o script de limpeza:

1. No **SQL Editor**, crie uma nova query
2. Copie e cole o conteúdo do arquivo `remove-trigger.sql`
3. Clique em **Run**
4. Verifique se não retornou nenhum resultado (significa que o trigger foi removido)

### Executar o Script Principal

1. No dashboard do Supabase, vá para **SQL Editor**
2. Clique em **New query**
3. Copie e cole o conteúdo do arquivo `database-schema.sql`
4. Clique em **Run** para executar o script

**Nota:** O script principal foi corrigido para evitar erros de triggers duplicados. Ele agora usa `DROP IF EXISTS` antes de criar triggers e políticas.

## 4. Configurar Autenticação

1. No dashboard do Supabase, vá para **Authentication** > **Settings**
2. Em **Site URL**, adicione: `exp://localhost:8081` (para desenvolvimento)
3. Em **Redirect URLs**, adicione:
   - `exp://localhost:8081`
   - `exp://192.168.1.100:8081` (se necessário para teste em dispositivo físico)

## 5. Configurar Políticas de Segurança (RLS)

As políticas de segurança já estão incluídas no script SQL. Elas garantem que:

- Usuários só podem ver e modificar seus próprios dados
- Treinos públicos podem ser vistos por todos os usuários autenticados
- Dados sensíveis são protegidos

## 6. Testar a Configuração

1. Execute o projeto:

```bash
npx expo start
```

2. Teste o login/registro
3. Verifique se os dados estão sendo salvos no Supabase

## 7. Troubleshooting

### Erro de Trigger Duplicado (on_auth_user_created)

Se você ainda encontrar o erro `trigger "on_auth_user_created" for relation "users" already exists`:

1. **Execute o script de limpeza primeiro:**

   - No SQL Editor, crie uma nova query
   - Cole o conteúdo do arquivo `remove-trigger.sql`
   - Execute o script

2. **Depois execute o script principal:**

   - Cole o conteúdo do arquivo `database-schema.sql`
   - Execute o script

3. **Verificar se funcionou:**

```sql
-- Verificar se o trigger foi criado corretamente
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created'
AND event_object_schema = 'auth';
```

### Erro de Profile Undefined

Se você encontrar erros como `Cannot read property 'username' of undefined`:

1. **Verificar se os perfis foram criados:**

   - No SQL Editor, execute o script `check-profiles.sql`
   - Verifique se todos os usuários têm perfis

2. **Se houver usuários sem perfil:**

   - O script `check-profiles.sql` irá criar perfis automaticamente
   - Execute novamente para verificar se foram criados

3. **Verificar se o trigger está funcionando:**

```sql
-- Verificar se a função handle_new_user existe
SELECT routine_name FROM information_schema.routines
WHERE routine_name = 'handle_new_user'
AND routine_schema = 'public';

-- Verificar se o trigger está ativo
SELECT trigger_name FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created'
AND event_object_schema = 'auth';
```

### Verificar se as Tabelas Foram Criadas

Para verificar se todas as tabelas foram criadas corretamente:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

### Verificar Políticas RLS

Para verificar as políticas de segurança:

```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public';
```

## 8. Estrutura do Banco de Dados

O script cria as seguintes tabelas:

- **profiles**: Perfis dos usuários
- **workouts**: Treinos criados pelos usuários
- **workout_days**: Dias de treino dentro de um treino
- **exercises**: Exercícios dentro de cada dia
- **weight_records**: Registros de peso para exercícios
- **saved_workouts**: Treinos salvos pelos usuários
- **workout_likes**: Likes em treinos

## 9. Próximos Passos

Após a configuração:

1. Teste todas as funcionalidades do app
2. Verifique se os dados estão sendo salvos corretamente
3. Teste as políticas de segurança
4. Configure backups se necessário

## Suporte

Se encontrar problemas:

1. Verifique os logs no dashboard do Supabase
2. Consulte a documentação oficial do Supabase
3. Verifique se todas as variáveis de ambiente estão configuradas corretamente

## 10. Funcionalidades Implementadas

### Autenticação:

- ✅ Login com email/senha
- ✅ Registro de usuários
- ✅ Logout
- ✅ Recuperação de senha
- ✅ Perfis de usuário automáticos

### Treinos:

- ✅ Criar treinos personalizados
- ✅ Editar treinos existentes
- ✅ Excluir treinos
- ✅ Visualizar treinos próprios
- ✅ Explorar treinos públicos
- ✅ Salvar treinos de outros usuários
- ✅ Dar like em treinos

### Exercícios:

- ✅ Adicionar exercícios aos treinos
- ✅ Definir séries e repetições
- ✅ Organizar exercícios por dia
- ✅ Registrar pesos dos exercícios

### Perfis:

- ✅ Editar informações do perfil
- ✅ Usernames únicos
- ✅ Ver perfis de outros usuários

## 11. Comandos Úteis

```

```
