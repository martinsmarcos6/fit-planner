# Guia de Publicação - Fit Planner

Este guia te ajudará a publicar o app Fit Planner nas lojas Apple App Store e Google Play Store usando o EAS (Expo Application Services).

## Pré-requisitos

### 1. Conta Expo

- Crie uma conta em [expo.dev](https://expo.dev)
- Faça login no EAS CLI: `eas login`

### 2. Apple Developer Account (para iOS)

- Conta Apple Developer ($99/ano)
- App Store Connect configurado
- Certificados e perfis de provisionamento

### 3. Google Play Console (para Android)

- Conta Google Play Console ($25 taxa única)
- Chave de conta de serviço configurada

## Configuração Inicial

### 1. Configurar o Projeto EAS

```bash
eas build:configure
```

### 2. Atualizar Configurações

#### No arquivo `app.json`:

- Substitua `com.yourcompany.fitplanner` pelo seu bundle identifier real
- Atualize o `projectId` na seção `extra.eas`

#### No arquivo `eas.json`:

- Substitua `SEU_APPLE_ID_AQUI` pelo seu Apple ID
- Substitua `SEU_APP_STORE_CONNECT_APP_ID` pelo ID do app no App Store Connect
- Substitua `SEU_APPLE_TEAM_ID` pelo seu Apple Team ID

### 3. Configurar Ícones e Splash Screen

Certifique-se de que os arquivos de imagem estão nas dimensões corretas:

- `icon.png`: 1024x1024px
- `adaptive-icon.png`: 1024x1024px
- `splash-icon.png`: 1242x2436px (ou proporcional)

## Processo de Build

### 1. Build de Preview (Teste)

```bash
# Para Android (APK)
eas build --platform android --profile preview

# Para iOS (IPA)
eas build --platform ios --profile preview
```

### 2. Build de Produção

```bash
# Para Android (AAB)
eas build --platform android --profile production

# Para iOS (IPA)
eas build --platform ios --profile production
```

## Publicação nas Lojas

### Apple App Store

#### 1. Configurar App Store Connect

- Crie um novo app no App Store Connect
- Configure metadados, screenshots e descrições
- Defina preço e disponibilidade

#### 2. Submeter Build

```bash
eas submit --platform ios --profile production
```

#### 3. Revisão da Apple

- Aguarde a revisão da Apple (1-7 dias)
- Responda a qualquer feedback da Apple

### Google Play Store

#### 1. Configurar Google Play Console

- Crie um novo app no Google Play Console
- Configure metadados, screenshots e descrições
- Configure política de privacidade

#### 2. Submeter Build

```bash
eas submit --platform android --profile production
```

#### 3. Revisão do Google

- Aguarde a revisão do Google (1-3 dias)
- Responda a qualquer feedback do Google

## Atualizações

### 1. Incrementar Versão

- Atualize `version` no `app.json`
- Para iOS: incremente `buildNumber`
- Para Android: incremente `versionCode`

### 2. Build e Submissão

```bash
# Build de produção
eas build --platform all --profile production

# Submissão
eas submit --platform all --profile production
```

## Troubleshooting

### Problemas Comuns

1. **Build falha**: Verifique logs em `eas build:list`
2. **Submissão rejeitada**: Verifique metadados e políticas das lojas
3. **Certificados expirados**: Renove certificados no Apple Developer Portal

### Comandos Úteis

```bash
# Ver builds
eas build:list

# Ver logs de um build
eas build:view [BUILD_ID]

# Cancelar build
eas build:cancel [BUILD_ID]

# Configurar credenciais
eas credentials
```

## Recursos Adicionais

- [Documentação EAS](https://docs.expo.dev/eas/)
- [Guia App Store](https://developer.apple.com/app-store/)
- [Guia Google Play](https://support.google.com/googleplay/android-developer)

## Suporte

Para problemas específicos:

- [Expo Discord](https://chat.expo.dev)
- [Expo Forums](https://forums.expo.dev)
- [GitHub Issues](https://github.com/expo/expo/issues)
