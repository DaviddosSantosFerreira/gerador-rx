# 📋 GUIA COMPLETO - GERADOR-RX

## 📅 Última Atualização: Janeiro 2026

---

# 🎯 VISÃO GERAL DO PROJETO

O **Gerador RX** é uma plataforma SaaS de geração de conteúdo com IA que permite:
- **Gerar Vídeos** a partir de texto (text-to-video)
- **Gerar Imagens** a partir de texto (text-to-image)
- **Animar Personagens** a partir de imagens (image-to-video)

## 🌐 URLs de Produção

| Serviço | URL |
|---------|-----|
| **Frontend (Vercel)** | https://gerador-rx.vercel.app |
| **Backend (Render)** | https://gerador-rx.onrender.com |
| **Banco de Dados** | MongoDB Atlas |
| **API de IA** | Replicate.com |

---

# ✅ FUNCIONALIDADES IMPLEMENTADAS

## 1. Generate Videos ✅
- **Descrição:** Gera vídeos a partir de prompts de texto
- **Modelos disponíveis:**
  - Google Veo 3.1 Fast (Recomendado)
  - OpenAI Sora 2
  - Kling V2.6
  - Wan 2.5 T2V
  - Kling V2.5 Turbo Pro
- **Custo:** 5 créditos por geração

## 2. Generate Images ✅
- **Descrição:** Gera imagens a partir de prompts de texto
- **Modelos disponíveis:**
  - Google Nano Banana Pro (Recomendado)
  - Pruna P-Image (Mais Rápido)
  - Pruna Z-Image Turbo
  - ByteDance Seedream 4.5
  - Flux 2 Max (Máxima Fidelidade)
- **Custo:** 2 créditos por geração

## 3. Animate Characters ✅
- **Descrição:** Anima imagens estáticas transformando-as em vídeos
- **Modelos disponíveis:**
  - Google Veo 3.1 Fast (Recomendado)
  - Google Veo 3.1 (Alta Qualidade)
  - Google Veo 3 (Com Áudio)
  - Kling V2.5 Turbo Pro (Motion Suave)
  - PixVerse V5 (Anime/Cartoon)
- **Durações:** 4s, 5s, 6s, 8s, 10s (varia por modelo)
- **Custo:** 10 créditos por geração

## 4. Workflows ⏳ (UI apenas)
- Interface visual presente
- Funcionalidade para implementação futura

## 5. Live ⏳ (Coming Soon)
- Placeholder para experiências em tempo real
- Funcionalidade para implementação futura

---

# 🔧 ERROS CORRIGIDOS

## Erro 1: CORS Bloqueado
- **Problema:** Frontend tentando acessar localhost:5000 em produção
- **Solução:** Configurada variável `VITE_API_URL` no Vercel e lógica condicional no `api.js`

## Erro 2: Modelo 'gen-4' não reconhecido
- **Problema:** Frontend enviava modelo `'gen-4'` que não existia no backend
- **Solução:** Alterado valor padrão para `'google/veo-3.1-fast'` no App.jsx

## Erro 3: Header de autenticação incorreto na rota prediction
- **Problema:** Rota `/prediction/:id` usava `Token` em vez de `Bearer`
- **Solução:** Corrigido para `Authorization: Bearer ${token}` no replicate.js

## Erro 4: Vídeo/Imagem gerados mas não exibidos
- **Problema:** Frontend não mostrava o resultado após geração
- **Solução:** Adicionados estados `generatedVideo` e `generatedImage` com players e botões de download

## Erro 5: Perda de foco no input do Animate
- **Problema:** Componente Animate estava dentro de DashboardApp causando re-render
- **Solução:** Movido componente Animate para fora de DashboardApp (mesmo padrão de Generate e Images)

## Erro 6: Erro 413 - Imagem muito grande
- **Problema:** Imagem em base64 excedia limite do servidor
- **Solução:** Implementado upload via Cloudinary + compressão de fallback

## Erro 7: Erro 422 - Duração inválida para Veo
- **Problema:** Google Veo aceita apenas 4, 6, 8 segundos
- **Solução:** Implementada lógica de duração específica por modelo no backend

---

# 🚀 COMO RODAR O PROJETO LOCALMENTE

## Pré-requisitos
- Node.js 18+ instalado
- Git instalado
- Conta no MongoDB Atlas
- Conta no Replicate.com
- Conta no Cloudinary (para upload de imagens)

---

## 📂 PASSO 1: Abrir o Projeto

1. Abra o **Terminal** ou **PowerShell**
2. Navegue até a pasta do projeto:
```bash
cd C:\Users\david\OneDrive\Desktop\gerador-rx
```

---

## 🔙 PASSO 2: Iniciar o Backend

1. Abra um terminal e navegue para a pasta backend:
```bash
cd backend
```

2. Instale as dependências (apenas na primeira vez ou se adicionar novas):
```bash
npm install
```

3. Verifique se o arquivo `.env` existe com as variáveis:
```env
MONGODB_URI=sua_string_de_conexao_mongodb
JWT_SECRET=sua_chave_secreta_jwt
REPLICATE_API_TOKEN=seu_token_replicate
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=seu_api_secret
PORT=5000
```

4. Inicie o servidor backend:
```bash
npm run dev
```

5. Você verá a mensagem:
Servidor rodando na porta 5000
MongoDB conectado

**⚠️ Mantenha este terminal aberto!**

---

## 🖥️ PASSO 3: Iniciar o Frontend

1. Abra um **NOVO terminal** (não feche o do backend)

2. Navegue para a pasta raiz do projeto:
```bash
cd C:\Users\david\OneDrive\Desktop\gerador-rx
```

3. Instale as dependências (apenas na primeira vez):
```bash
npm install
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

5. Você verá a mensagem:
VITE v5.x.x ready in xxx ms
➜ Local: http://localhost:5173/

6. Abra o navegador em: **http://localhost:5173**

---

## 🔄 PASSO 4: Fluxo Completo de Inicialização

### Resumo Rápido (Checklist Diário):
```bash
# Terminal 1 - Backend
cd C:\Users\david\OneDrive\Desktop\gerador-rx\backend
npm run dev

# Terminal 2 - Frontend (novo terminal)
cd C:\Users\david\OneDrive\Desktop\gerador-rx
npm run dev

# Abrir navegador em http://localhost:5173
```

---

# 📦 DEPLOY EM PRODUÇÃO

## Frontend (Vercel)

1. Acesse: https://vercel.com/dashboard
2. O deploy é **automático** ao fazer `git push origin main`
3. Variáveis de ambiente configuradas:
   - `VITE_API_URL` = `https://gerador-rx.onrender.com/api`

### Deploy Manual:
```bash
git add .
git commit -m "sua mensagem"
git push origin main
```

## Backend (Render)

1. Acesse: https://dashboard.render.com
2. O deploy é **automático** ao fazer push na pasta backend
3. Variáveis de ambiente configuradas no Render:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `REPLICATE_API_TOKEN`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

### Deploy Manual do Backend:
```bash
cd backend
git add .
git commit -m "sua mensagem"
git push origin main
```

---

# 📁 ESTRUTURA DO PROJETO
gerador-rx/
├── src/                      # Frontend React
│   ├── components/           # Componentes React
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/
│   │   └── AuthContext.jsx   # Contexto de autenticação
│   ├── services/
│   │   └── api.js            # Configuração Axios e funções API
│   ├── App.jsx               # Componente principal
│   └── index.jsx             # Entrada da aplicação
├── backend/                  # Backend Node.js
│   ├── models/               # Modelos MongoDB
│   │   ├── User.js
│   │   └── Session.js
│   ├── routes/               # Rotas da API
│   │   ├── auth.js           # Autenticação
│   │   └── replicate.js      # Geração de conteúdo
│   ├── middleware/
│   │   └── auth.js           # Middleware JWT
│   └── server.js             # Entrada do servidor
├── package.json              # Dependências frontend
├── vite.config.js            # Configuração Vite
└── GUIA-DEPLOY.md            # Este arquivo

---

# 🔑 CREDENCIAIS E ACESSOS

## Serviços Externos

| Serviço | URL | Função |
|---------|-----|--------|
| **Vercel** | https://vercel.com/dashboard | Deploy Frontend |
| **Render** | https://dashboard.render.com | Deploy Backend |
| **MongoDB Atlas** | https://cloud.mongodb.com | Banco de Dados |
| **Replicate** | https://replicate.com/account | API de IA |
| **Cloudinary** | https://cloudinary.com/console | Upload de Imagens |

---

# 🐛 TROUBLESHOOTING

## Erro: "CORS blocked"
- Verifique se o backend está rodando
- Verifique se `VITE_API_URL` está configurado no Vercel
- Faça redeploy no Vercel

## Erro: "401 Unauthorized"
- Token JWT expirado
- Faça logout e login novamente

## Erro: "402 Insufficient credit"
- Adicione créditos no Replicate: https://replicate.com/account/billing

## Erro: "500 Internal Server Error"
- Verifique os logs do Render
- Verifique se todas as variáveis de ambiente estão configuradas

## Erro: "413 Payload Too Large"
- Imagem muito grande
- Use imagens menores que 5MB

## Vídeo/Imagem não aparece após geração
- Verifique o console do navegador (F12)
- Verifique os logs do Render

---

# 📞 COMANDOS ÚTEIS
```bash
# Ver status do git
git status

# Ver logs do git
git log --oneline

# Atualizar projeto com última versão
git pull origin main

# Ver dependências desatualizadas
npm outdated

# Limpar cache do npm
npm cache clean --force

# Reinstalar dependências
rm -rf node_modules
npm install
```

---

# 📝 NOTAS IMPORTANTES

1. **Render pode "dormir"**: O plano gratuito do Render coloca o servidor em sleep após inatividade. A primeira requisição pode demorar ~30 segundos.

2. **Créditos Replicate**: Monitore seus créditos em https://replicate.com/account/billing

3. **Variáveis de Ambiente**: Nunca commite arquivos `.env` no Git. Eles contêm credenciais sensíveis.

4. **Backup**: Faça backup regular do banco de dados MongoDB Atlas.

---

# ✅ CHECKLIST DE VERIFICAÇÃO

Antes de considerar o projeto funcionando, verifique:

- [ ] Backend rodando (local ou Render)
- [ ] Frontend rodando (local ou Vercel)
- [ ] Login/Registro funcionando
- [ ] Geração de vídeo funcionando
- [ ] Geração de imagem funcionando
- [ ] Animação de personagem funcionando
- [ ] Download de arquivos funcionando
- [ ] Créditos sendo deduzidos corretamente

---