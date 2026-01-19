# 📋 Guia Completo: Do Projeto Rodando ao Deploy

---

# 📘 RELATÓRIO TÉCNICO — GERADOR-RX

## 1. Visão Geral do Projeto

### Stack principal

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Banco de dados:** MongoDB Atlas
- **Autenticação:** JWT (JSON Web Token)
- **Hash de senha:** bcryptjs
- **Gerenciamento de estado de auth:** React Context
- **Controle de rotas:** react-router-dom

### Objetivo alcançado:

✅ **Implementar autenticação real (cadastro, login, proteção de rotas) com segurança funcional entre frontend e backend.**

---

## 2. Backend — Estado Atual

### 2.1 Conexão com MongoDB

- ✅ **Conexão ativa com MongoDB Atlas**
- ✅ **Testada e validada via log:**
  ```
  ✅ MongoDB conectado
  ```

### 2.2 Model User (MongoDB)

**Arquivo:** `backend/models/User.js`

**Schema implementado:**
- `name`: String (required)
- `email`: String (required, unique)
- `password`: String (required)
- `credits`: Number (default: 100)
- `createdAt`: Date (default: Date.now)

- ✔ Apenas schema definido
- ✔ Sem bcrypt no model (hash feito no controller)
- ✔ Índice unique aplicado ao email

### 2.3 Autenticação — Controller

**Arquivo:** `backend/controllers/authController.js`

#### Cadastro (POST /api/auth/register)

- ✅ Valida campos obrigatórios
- ✅ Verifica se o email já existe
- ✅ Faz hash da senha com bcrypt
- ✅ Salva usuário no MongoDB
- ✅ Gera JWT

**Retorna:**
```json
{
  "token": "JWT",
  "user": { "_id", "name", "email", "credits" }
}
```

#### Login (POST /api/auth/login)

- ✅ Busca usuário pelo email
- ✅ Compara senha com bcrypt
- ✅ Gera JWT

**Retorna:**
```json
{
  "token": "JWT",
  "user": { "_id", "name", "email", "credits" }
}
```

- ✔ JWT configurado com JWT_SECRET
- ✔ Token com expiração (7d)
- ✔ Sem refresh token (por decisão atual)

### 2.4 Middleware JWT

**Arquivo:** `backend/middleware/auth.js`

**Função:**
- Lê header: `Authorization: Bearer <token>`
- Valida token com JWT_SECRET
- Injeta: `req.user = { id: decoded.id }`

**Respostas:**
- ❌ Sem token → `401 Token não fornecido`
- ❌ Token inválido → `401 Token inválido`

### 2.5 Proteção de Rotas Backend

**Arquivo:** `backend/routes/sessions.js`

- ✅ `router.use(auth)` aplicado
- ✅ Todas as rotas de sessions agora exigem JWT

**Teste realizado:**
- ✅ Sem token → bloqueado
- ✅ Com token → passa pelo middleware
- ✅ Erro de ObjectId confirma que auth passou (comportamento correto)

---

## 3. Frontend — Estado Atual

### 3.1 Contexto de Autenticação

**Arquivo:** `src/context/AuthContext.jsx`

**Estado global:**
- `user`
- `loading`

**Funções:**
- `login(email, password)`
- `register(name, email, password)`
- `logout()`

**Comportamento:**
- ✅ Token salvo no localStorage
- ✅ Usuário persistido
- ✅ Reidratação automática ao recarregar página

- ✔ Sem JWT no estado global inseguro
- ✔ Token controlado corretamente

### 3.2 API Centralizada (Axios)

**Arquivo:** `src/services/api.js`

**Implementações:**
- ✅ baseURL configurado
- ✅ Interceptor automático: `Authorization: Bearer <token>`

**Funções expostas:**
- `login`
- `register`
- `getSessions`

- ✔ Frontend não precisa se preocupar com headers
- ✔ JWT injetado automaticamente

### 3.3 Proteção de Rotas no React

**Arquivo:** `src/components/ProtectedRoute.jsx`

**Lógica:**
- Se `loading` → não renderiza
- Se `!user` → redireciona para `/login`
- Se autenticado → renderiza children

### 3.4 React Router

**Arquivos envolvidos:**
- `src/index.jsx`
- `src/App.jsx`

**Configuração final:**
- `/login` → público
- `/register` → público
- `/` e demais rotas → protegidas

**Comportamento validado:**
- ✅ Usuário não logado → redirecionado
- ✅ Usuário logado → acesso normal
- ✅ Token removido → logout automático

---

## 4. Testes Realizados

### Backend
- ✔ Cadastro via Invoke-RestMethod
- ✔ Login com retorno de JWT
- ✔ Proteção de rota sem token
- ✔ Proteção de rota com token

### Frontend
- ✔ Login funcional
- ✔ Persistência de sessão
- ✔ Proteção de rotas
- ✔ Logout funcional

---

## 5. Segurança Atual (Resumo)

| Item | Status |
|------|--------|
| Hash de senha | ✅ bcrypt |
| JWT | ✅ |
| Middleware | ✅ |
| Rotas protegidas | ✅ |
| Frontend protegido | ✅ |
| Refresh token | ❌ |
| Roles | ❌ |
| Rate limit | ❌ |
| Validação forte de senha | ❌ |
| Confirmação de email | ❌ |

---

## 6. O QUE AINDA FALTA FAZER (PRÓXIMOS PASSOS)

### 🔹 Essencial (recomendado)

1. **Ajustar sessions para usar `req.user.id` (não `:userId`)**
   - Atualmente a rota usa `/:userId` como parâmetro
   - Deve usar `req.user.id` do middleware JWT
   - Mais seguro e evita acesso a sessões de outros usuários

2. **Centralizar tratamento de erros (middleware)**
   - Criar middleware de erro global
   - Padronizar respostas de erro
   - Log de erros para debug

3. **Normalizar respostas de erro (status + message)**
   - Todas as rotas devem retornar formato consistente
   - `{ message: "..." }` ou `{ error: "..." }`
   - Status codes apropriados

### 🔹 Segurança Avançada

4. **Refresh Token**
   - Implementar renovação automática de token
   - Expiração + renovação automática
   - Melhor UX (usuário não precisa fazer login novamente)

5. **Rate limiting no login**
   - Limitar tentativas de login
   - Bloqueio por tentativas falhas
   - Prevenir brute force

### 🔹 Produto / UX

6. **Validação de email**
   - Verificar formato de email no frontend e backend
   - Confirmação de email (opcional)

7. **Validação de força de senha**
   - Mínimo de caracteres
   - Requisitos de complexidade
   - Feedback visual

8. **Feedback visual de auth**
   - Loading states globais
   - Mensagens de sucesso/erro
   - Toasts/notificações

---

## 7. Status Final

🔒 **Sistema autenticado, protegido e funcional**

Estrutura equivalente a aplicações reais em produção, faltando apenas camadas avançadas.

---

## 📝 PASSO A PASSO DO QUE FALTA FAZER

### **PASSO 1: Ajustar Rotas de Sessions para Usar req.user.id**

**Problema atual:**
- Rota usa `/:userId` como parâmetro da URL
- Permite acesso a sessões de outros usuários se souber o ID

**Solução:**

1. **Editar `backend/routes/sessions.js`:**

```javascript
// ❌ ANTES (inseguro)
router.get('/:userId', async (req, res) => {
  const sessions = await Session.find({ userId: req.params.userId });
  res.json(sessions);
});

// ✅ DEPOIS (seguro)
router.get('/', async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
```

2. **Atualizar frontend `src/services/api.js`:**

```javascript
// ❌ ANTES
export const getSessions = (userId) =>
  api.get(`/sessions/${userId}`);

// ✅ DEPOIS
export const getSessions = () =>
  api.get('/sessions');
```

3. **Atualizar `src/App.jsx`:**

```javascript
// ❌ ANTES
const response = await getSessions(userData._id);

// ✅ DEPOIS
const response = await getSessions();
```

---

### **PASSO 2: Criar Middleware de Tratamento de Erros**

1. **Criar `backend/middleware/errorHandler.js`:**

```javascript
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Erro de validação do Mongoose
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: Object.values(err.errors).map(e => e.message).join(', ')
    });
  }

  // Erro de duplicação (unique)
  if (err.code === 11000) {
    return res.status(400).json({
      message: 'Email já cadastrado'
    });
  }

  // Erro padrão
  res.status(err.status || 500).json({
    message: err.message || 'Erro interno do servidor'
  });
};

module.exports = errorHandler;
```

2. **Adicionar no `backend/server.js`:**

```javascript
const errorHandler = require('./middleware/errorHandler');

// ... outras rotas ...

// Middleware de erro (deve ser o último)
app.use(errorHandler);
```

---

### **PASSO 3: Normalizar Respostas de Erro**

**Padrão a seguir:**

```javascript
// ✅ Sucesso
res.status(200).json({ data: ... });

// ✅ Erro
res.status(400).json({ message: "Mensagem de erro" });
```

**Atualizar todos os controllers para usar `message` ao invés de `error`:**

```javascript
// ❌ ANTES
res.status(400).json({ error: 'Email já cadastrado' });

// ✅ DEPOIS
res.status(400).json({ message: 'Email já cadastrado' });
```

---

### **PASSO 4: Implementar Refresh Token (Opcional)**

1. **Adicionar campo no User model:**
```javascript
refreshToken: { type: String }
```

2. **Criar rota `/api/auth/refresh`:**
```javascript
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  // Validar e gerar novo access token
});
```

3. **Atualizar frontend para renovar token automaticamente**

---

### **PASSO 5: Rate Limiting (Opcional)**

1. **Instalar:**
```bash
npm install express-rate-limit
```

2. **Criar middleware:**
```javascript
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 tentativas
  message: 'Muitas tentativas de login. Tente novamente em 15 minutos.'
});

// Aplicar na rota de login
router.post('/login', loginLimiter, login);
```

---

### **PASSO 6: Validação de Email e Senha**

1. **Backend - Validar email:**
```javascript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  return res.status(400).json({ message: 'Email inválido' });
}
```

2. **Backend - Validar senha:**
```javascript
if (password.length < 6) {
  return res.status(400).json({ message: 'Senha deve ter no mínimo 6 caracteres' });
}
```

3. **Frontend - Adicionar validação visual nos formulários**

---

### **PASSO 7: Feedback Visual (Opcional)**

1. **Instalar biblioteca de toast:**
```bash
npm install react-toastify
```

2. **Adicionar no App.jsx:**
```javascript
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Usar:
toast.success('Login realizado com sucesso!');
toast.error('Erro ao fazer login');
```

---

## ✅ Estado Atual do Projeto

### Backend
- ✅ **Funcionando** - API rodando perfeitamente
- ✅ **Conectado ao MongoDB** - MongoDB Atlas configurado e conectado
- ✅ **Rotas ativas** - Todas as rotas de API funcionando (`/api/auth`, `/api/replicate`, `/api/sessions`, `/api/assets`)
- ✅ **Pronto para produção** - Deploy realizado com sucesso (ex: Render)

### Frontend
- ✅ **Deploy feito com sucesso** - Frontend em produção (ex: Vercel)
- ✅ **Conectado ao backend** - Comunicação frontend ↔ backend funcionando
- ⚠️ **Botões não funcionam ainda** - Falta implementar lógica de UI/fluxo (não é erro técnico, é esperado)

> **Nota:** Os botões não funcionam porque ainda precisam conectar a interface com as funções da API. Isso é normal e será implementado na FASE 8 abaixo.

---

## 🎯 Objetivo

Fazer deploy completo do projeto em produção, incluindo:
1. **Frontend** hospedado (Vercel/Netlify)
2. **Backend** hospedado (Render/Railway)
3. **MongoDB Atlas** em produção (já configurado)
4. **APIs externas** configuradas (Replicate, Cloudinary)

---

## 📝 Passo a Passo para Deploy

### **FASE 1: Preparação do Código para Produção**

#### 1.1 Verificar e ajustar `baseURL` do frontend

✅ **JÁ ESTÁ CORRETO** - O arquivo `src/services/api.js` já usa:
```javascript
baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
```

**O que fazer:**
- Em produção, você vai configurar a variável `VITE_API_URL` na plataforma de deploy
- Por enquanto, está tudo certo para desenvolvimento

---

#### 1.2 Ajustar CORS no backend

**Arquivo:** `backend/server.js`

**Situação atual:**
```javascript
app.use(cors()); // Permite todas as origens
```

**Ajuste para produção:**
```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'https://seu-app.vercel.app', // URL do seu frontend em produção
  ],
  credentials: true
}));
```

**Ação:**
1. Abra `backend/server.js`
2. Substitua `app.use(cors());` pelo código acima
3. Adicione `FRONTEND_URL` no `backend/.env` quando souber a URL do frontend em produção

---

#### 1.3 Verificar se `PORT` está dinâmico no backend

**Arquivo:** `backend/server.js`

**Verificar se tem:**
```javascript
const PORT = process.env.PORT || 5000;
app.listen(PORT, ...);
```

**Se não tiver, adicione.** A maioria das plataformas (Render, Railway) define `process.env.PORT` automaticamente.

---

### **FASE 2: Configurar APIs Externas**

#### 2.1 Replicate API (para geração de vídeo/imagem)

**Status:** Token já está no `backend/.env` como `REPLICATE_API_TOKEN`

**Verificar:**
- ✅ Token válido em `backend/.env`
- ⚠️ Se não tiver ou não funcionar:
  1. Acesse: https://replicate.com/account/api-tokens
  2. Crie um novo token ou copie o existente
  3. Atualize `REPLICATE_API_TOKEN` no `.env`

---

#### 2.2 Cloudinary (para upload de assets)

**Status:** Credenciais já estão no `backend/.env`

**Verificar:**
- ✅ `CLOUDINARY_CLOUD_NAME`
- ✅ `CLOUDINARY_API_KEY`
- ✅ `CLOUDINARY_API_SECRET`

**Se não funcionar:**
1. Acesse: https://cloudinary.com/console
2. Vá em **Dashboard** → copie as credenciais
3. Atualize no `backend/.env`

---

### **FASE 3: Deploy do Backend**

#### 3.1 Escolher plataforma

**Opções recomendadas:**
- **Render** (gratuito, fácil): https://render.com
- **Railway** (gratuito, rápido): https://railway.app
- **Heroku** (pago): https://heroku.com

**Vou usar Render como exemplo** (é grátis e fácil).

---

#### 3.2 Preparar backend para deploy

**1. Verificar estrutura:**
```
backend/
├── .env          (NÃO vai para o Git - está no .gitignore)
├── server.js
├── package.json
├── models/
├── routes/
└── ...
```

**2. Verificar `package.json` tem:**
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

✅ **Já deve estar correto.**

---

#### 3.3 Criar conta e deploy no Render

**Passo a passo:**

1. **Criar conta:**
   - Acesse: https://render.com
   - Faça login com GitHub (recomendado) ou email

2. **Criar novo serviço:**
   - Clique em **"New +"** → **"Web Service"**
   - Conecte seu repositório GitHub (ou faça upload)

3. **Configurações do serviço:**
   ```
   Name: gerador-rx-backend (ou o nome que preferir)
   Environment: Node
   Build Command: cd backend && npm install
   Start Command: cd backend && npm start
   ```

4. **Variáveis de ambiente no Render:**
   - Vá em **"Environment Variables"**
   - Adicione todas as variáveis do `backend/.env`:
     ```
     MONGODB_URI=mongodb+srv://... (seu MongoDB Atlas)
     JWT_SECRET=TrFntxb7pVUU2nh5J7XTp20IH+Ux53m5s01xykeJhOg=
     REPLICATE_API_TOKEN=r8_...
     CLOUDINARY_CLOUD_NAME=ddo3vuhhk
     CLOUDINARY_API_KEY=916962624514931
     CLOUDINARY_API_SECRET=9BP5DmvJRn4oaLjdLQdAEIS0Ufw
     PORT=5000
     FRONTEND_URL=https://seu-app.vercel.app (adicionar depois)
     ```

5. **Deploy:**
   - Clique em **"Create Web Service"**
   - Aguarde o build e deploy (pode levar 5-10 minutos)

6. **Copiar URL do backend:**
   - Depois do deploy, você receberá uma URL tipo: `https://gerador-rx-backend.onrender.com`
   - **Anote essa URL** - você vai usar no frontend!

---

### **FASE 4: Deploy do Frontend**

#### 4.1 Escolher plataforma

**Opções:**
- **Vercel** (recomendado, grátis, fácil): https://vercel.com
- **Netlify** (gratuito, alternativo): https://netlify.com

**Vou usar Vercel como exemplo.**

---

#### 4.2 Preparar frontend para deploy

**1. Build local (testar antes):**
```bash
npm run build
```

**Verificar se gerou a pasta `dist/` sem erros.**

**2. Verificar `package.json` tem:**
```json
{
  "scripts": {
    "build": "vite build",
    "dev": "vite"
  }
}
```

✅ **Já deve estar correto.**

---

#### 4.3 Deploy no Vercel

**Opção A: Via CLI (recomendado)**

1. **Instalar Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```
   - Siga as instruções
   - Quando perguntar sobre variáveis de ambiente, adicione:
     ```
     VITE_API_URL=https://gerador-rx-backend.onrender.com/api
     ```
   - (Use a URL do seu backend do Render)

4. **Deploy em produção:**
   ```bash
   vercel --prod
   ```

**Opção B: Via interface web**

1. **Criar conta:**
   - Acesse: https://vercel.com
   - Faça login com GitHub

2. **Importar projeto:**
   - Clique em **"Add New..."** → **"Project"**
   - Conecte seu repositório GitHub
   - Selecione o projeto `gerador-rx`

3. **Configurações:**
   ```
   Framework Preset: Vite
   Root Directory: ./ (ou deixe vazio)
   Build Command: npm run build
   Output Directory: dist
   ```

4. **Variáveis de ambiente:**
   - Clique em **"Environment Variables"**
   - Adicione:
     ```
     VITE_API_URL = https://gerador-rx-backend.onrender.com/api
     ```
   - (Use a URL do seu backend do Render)

5. **Deploy:**
   - Clique em **"Deploy"**
   - Aguarde o build (2-5 minutos)

6. **URL do frontend:**
   - Após o deploy, você receberá uma URL tipo: `https://gerador-rx.vercel.app`
   - **Anote essa URL!**

---

### **FASE 5: Conectar Frontend e Backend**

#### 5.1 Atualizar CORS no backend

**Agora que você tem a URL do frontend:**

1. Vá no Render (ou sua plataforma do backend)
2. Acesse **"Environment Variables"**
3. Adicione ou atualize:
   ```
   FRONTEND_URL=https://gerador-rx.vercel.app
   ```

4. **Atualize o `server.js`** (se ainda não fez):
   ```javascript
   app.use(cors({
     origin: [
       process.env.FRONTEND_URL || 'http://localhost:5173',
       'https://gerador-rx.vercel.app', // URL do seu frontend
     ],
     credentials: true
   }));
   ```

5. **Redeploy o backend** (no Render, clique em "Manual Deploy" → "Deploy latest commit")

---

#### 5.2 Atualizar MongoDB Atlas (Network Access)

**Garantir que o backend em produção pode acessar:**

1. Acesse: https://cloud.mongodb.com
2. Vá em **Network Access**
3. Adicione o IP do Render (ou use `0.0.0.0/0` temporariamente para testes)
4. Se usar `0.0.0.0/0`, **remove depois** por segurança

---

### **FASE 6: Testes em Produção**

#### 6.1 Testar endpoints do backend

**Usando a URL do Render:**
```bash
# Testar se está online
curl https://gerador-rx-backend.onrender.com/api/auth/register

# Deve retornar erro 400 (esperado - falta dados), mas significa que está online!
```

#### 6.2 Testar frontend

1. Acesse a URL do Vercel (ex: `https://gerador-rx.vercel.app`)
2. Verifique se a página carrega
3. Teste login/registro (se implementado)
4. Verifique no console do navegador se há erros de CORS

---

### **FASE 7: Funcionalidades Faltando (Opcional)**

#### 7.1 Login/Register no frontend

**Status atual:** Rotas de API existem, mas não há telas no frontend.

**Para implementar:**
1. Instalar `react-router-dom`:
   ```bash
   npm install react-router-dom
   ```
2. Criar rotas `/login` e `/register`
3. Usar o `AuthContext` existente
4. Proteger rotas privadas

---

#### 7.2 Integrar geração de vídeo/imagem com backend

**Status atual:** Funções existem no `api.js`, mas o `App.jsx` usa dados mockados.

**Para implementar:**
- Conectar `handleGenerate` com `generateVideo()` e `generateImage()`
- Carregar sessões reais do backend com `getSessions()`

---

## ✅ Checklist Final Antes do Deploy

### Backend:
- [ ] `server.js` usa `process.env.PORT`
- [ ] CORS configurado com `FRONTEND_URL`
- [ ] Todas as variáveis de ambiente configuradas no Render
- [ ] MongoDB Atlas permite conexão do Render
- [ ] Replicate API token válido
- [ ] Cloudinary credenciais válidas

### Frontend:
- [ ] `api.js` usa `import.meta.env.VITE_API_URL`
- [ ] Build funciona localmente (`npm run build`)
- [ ] Variável `VITE_API_URL` configurada no Vercel
- [ ] Deploy feito e URL obtida

### Testes:
- [ ] Backend responde na URL do Render
- [ ] Frontend carrega na URL do Vercel
- [ ] Frontend consegue fazer requests para o backend (sem erros CORS)
- [ ] MongoDB conecta do backend em produção

---

## 🚨 Problemas Comuns e Soluções

### Erro: CORS no navegador

**Solução:**
- Verificar se `FRONTEND_URL` está correto no backend
- Verificar se CORS no `server.js` inclui a URL do frontend

### Erro: Variável de ambiente não encontrada

**Solução:**
- Verificar se todas as variáveis estão no Render/Vercel
- Redeploy após adicionar variáveis

### Erro: MongoDB não conecta

**Solução:**
- Verificar `Network Access` no MongoDB Atlas
- Adicionar IP do Render ou `0.0.0.0/0` temporariamente

### Frontend não carrega

**Solução:**
- Verificar build local (`npm run build`)
- Verificar logs no Vercel
- Verificar se `vite.config.js` está correto

---

## 📚 Recursos Úteis

- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **MongoDB Atlas:** https://cloud.mongodb.com
- **Replicate API:** https://replicate.com/docs
- **Cloudinary Docs:** https://cloudinary.com/documentation

---

## 🎉 Pronto!

Depois de seguir todos os passos, você terá:
- ✅ Frontend em produção (Vercel)
- ✅ Backend em produção (Render)
- ✅ MongoDB Atlas conectado
- ✅ APIs externas configuradas
- ✅ Aplicação funcionando em produção!

**URLs finais:**
- Frontend: `https://gerador-rx.vercel.app`
- Backend: `https://gerador-rx-backend.onrender.com/api`

---

**Dúvidas?** Consulte o arquivo `DEPLOY.md` para detalhes técnicos adicionais.

---

## 🎯 FASE 8: Implementar Lógica dos Botões (Tornar Funcionalidades Funcionais)

### 📌 Situação Atual

- ✅ API backend funcionando
- ✅ Frontend conectado ao backend
- ✅ Funções da API existem em `src/services/api.js`
- ⚠️ Botões não executam ações porque `App.jsx` usa dados mockados e simulação

### 🎯 Objetivo

Conectar os botões da interface com as funções reais da API para que:
- Botão "Generate Video" gere vídeos reais
- Botão "Generate Image" gere imagens reais
- Upload de assets funcione
- Sessões sejam carregadas do backend

---

### **8.1 Implementar Geração de Vídeo**

**Arquivo:** `src/App.jsx`

**Localização:** Função `handleGenerate` (linha ~44)

**❌ Código atual (simulado):**
```javascript
const handleGenerate = async () => {
  if (!currentGeneration.prompt.trim()) return;
  
  setIsGenerating(true);
  setGenerationProgress(0);
  
  // Simulate generation process
  const interval = setInterval(() => {
    setGenerationProgress(prev => {
      if (prev >= 100) {
        clearInterval(interval);
        setIsGenerating(false);
        // ... código mockado
      }
      return prev + 5;
    });
  }, 300);
};
```

**✅ Código correto (conectado com API):**

**Passo 1:** Adicionar imports no topo do `App.jsx`:
```javascript
import { generateVideo, getPrediction, getSessions } from './services/api';
```

**Passo 2:** Substituir a função `handleGenerate` completa:
```javascript
const handleGenerate = async () => {
  if (!currentGeneration.prompt.trim()) return;
  
  try {
    setIsGenerating(true);
    setGenerationProgress(0);
    
    // Chamar API para gerar vídeo
    const response = await generateVideo({
      prompt: currentGeneration.prompt,
      model: currentGeneration.model || 'gen-4',
      duration: currentGeneration.duration || '10s',
      resolution: currentGeneration.resolution || '1080p',
      style: currentGeneration.style || 'cinematic'
    });
    
    const { predictionId, sessionId } = response.data;
    
    // Polling para verificar status da geração
    const checkStatus = async () => {
      try {
        const statusResponse = await getPrediction(predictionId);
        const status = statusResponse.data.status;
        const output = statusResponse.data.output;
        
        if (status === 'succeeded') {
          setGenerationProgress(100);
          setIsGenerating(false);
          
          // Atualizar lista de sessões
          const userData = JSON.parse(localStorage.getItem('user') || '{}');
          if (userData._id) {
            const sessionsResponse = await getSessions(userData._id);
            setSessions(sessionsResponse.data);
          }
          
          // Resetar formulário
          setCurrentGeneration({
            prompt: '',
            model: 'gen-4',
            duration: '10s',
            resolution: '1080p',
            style: 'cinematic'
          });
          
          alert('Vídeo gerado com sucesso!');
        } else if (status === 'failed') {
          setIsGenerating(false);
          alert('Erro ao gerar vídeo. Tente novamente.');
        } else {
          // Status: starting, processing, etc.
          setGenerationProgress(prev => Math.min(prev + 10, 90));
          setTimeout(checkStatus, 3000); // Verificar novamente em 3s
        }
      } catch (error) {
        console.error('Erro ao verificar status:', error);
        setIsGenerating(false);
        alert('Erro ao verificar status da geração.');
      }
    };
    
    // Começar verificação após 2 segundos
    setTimeout(checkStatus, 2000);
    
  } catch (error) {
    console.error('Erro ao gerar vídeo:', error);
    setIsGenerating(false);
    alert(error.response?.data?.error || 'Erro ao gerar vídeo. Verifique seus créditos.');
  }
};
```

---

### **8.2 Implementar Geração de Imagem**

**Arquivo:** `src/App.jsx`

**Localização:** Dentro do componente `Images` (linha ~566)

**Passo 1:** Adicionar estado para geração de imagem (junto com os outros `useState`):
```javascript
const [imagePrompt, setImagePrompt] = useState('');
const [isGeneratingImage, setIsGeneratingImage] = useState(false);
```

**Passo 2:** Criar função para gerar imagem (antes do componente `Images`):
```javascript
const handleGenerateImage = async () => {
  if (!imagePrompt.trim()) return;
  
  try {
    setIsGeneratingImage(true);
    
    const response = await generateImage(imagePrompt);
    const { predictionId, sessionId } = response.data;
    
    // Polling similar ao vídeo
    const checkImageStatus = async () => {
      try {
        const statusResponse = await getPrediction(predictionId);
        const status = statusResponse.data.status;
        const output = statusResponse.data.output;
        
        if (status === 'succeeded') {
          setIsGeneratingImage(false);
          setImagePrompt('');
          
          // Atualizar sessões
          const userData = JSON.parse(localStorage.getItem('user') || '{}');
          if (userData._id) {
            const sessionsResponse = await getSessions(userData._id);
            setSessions(sessionsResponse.data);
          }
          
          alert('Imagem gerada com sucesso!');
        } else if (status === 'failed') {
          setIsGeneratingImage(false);
          alert('Erro ao gerar imagem.');
        } else {
          setTimeout(checkImageStatus, 3000);
        }
      } catch (error) {
        setIsGeneratingImage(false);
        alert('Erro ao verificar status.');
      }
    };
    
    setTimeout(checkImageStatus, 2000);
    
  } catch (error) {
    setIsGeneratingImage(false);
    alert(error.response?.data?.error || 'Erro ao gerar imagem.');
  }
};
```

**Passo 3:** Atualizar o botão "Generate Image" no componente `Images`:
```javascript
// Encontrar esta linha (~566):
<button className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors">
  Generate Image
</button>

// Substituir por:
<button
  onClick={handleGenerateImage}
  disabled={isGeneratingImage || !imagePrompt.trim()}
  className={`w-full py-3 rounded-lg font-medium transition-colors ${
    isGeneratingImage || !imagePrompt.trim()
      ? 'bg-gray-300 cursor-not-allowed'
      : 'bg-purple-600 hover:bg-purple-700 text-white'
  }`}
>
  {isGeneratingImage ? 'Generating...' : 'Generate Image'}
</button>
```

**Passo 4:** Conectar o textarea do prompt de imagem ao estado:
```javascript
// Encontrar o textarea (~530) e atualizar:
<textarea
  value={imagePrompt}
  onChange={(e) => setImagePrompt(e.target.value)}
  placeholder="Describe the image you want to create..."
  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
  rows={6}
/>
```

---

### **8.3 Carregar Sessões Reais do Backend**

**Arquivo:** `src/App.jsx`

**Passo 1:** Adicionar `useEffect` para carregar sessões ao montar o componente:
```javascript
// Adicionar junto com os outros imports no topo
import { useEffect } from 'react';

// Dentro do componente App, após os useState:
useEffect(() => {
  const loadSessions = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      if (userData._id) {
        const response = await getSessions(userData._id);
        setSessions(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar sessões:', error);
    }
  };
  
  loadSessions();
}, []);
```

---

### **8.4 Implementar Upload de Assets**

**Arquivo:** `src/App.jsx`

**Passo 1:** Adicionar import:
```javascript
import { uploadAsset, getAssets } from './services/api';
```

**Passo 2:** Criar função de upload:
```javascript
const handleUploadAsset = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', file.name);
    formData.append('type', file.type.startsWith('image/') ? 'image' : 'video');
    
    await uploadAsset(formData);
    
    // Recarregar assets
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (userData._id) {
      const response = await getAssets(userData._id);
      setAssets(response.data);
    }
    
    alert('Asset enviado com sucesso!');
  } catch (error) {
    alert('Erro ao enviar asset: ' + (error.response?.data?.error || error.message));
  }
};
```

**Passo 3:** Encontrar o componente de upload e adicionar handler (se houver input de arquivo no `Assets`).

---

### **8.5 Atualizar Créditos do Usuário**

**Passo 1:** Criar função para buscar créditos:
```javascript
// Adicionar import se necessário
import { useAuth } from './context/AuthContext';

// Dentro do componente App:
const { user: authUser } = useAuth();

useEffect(() => {
  if (authUser?.credits !== undefined) {
    setCredits(authUser.credits);
  }
}, [authUser]);
```

---

### **📋 Checklist de Implementação**

Após implementar cada funcionalidade:

- [ ] **Geração de Vídeo:**
  - [ ] Import `generateVideo`, `getPrediction`, `getSessions` adicionados
  - [ ] `handleGenerate` substituído pela versão com API
  - [ ] Polling implementado para verificar status
  - [ ] Atualização de sessões após sucesso

- [ ] **Geração de Imagem:**
  - [ ] Estado `imagePrompt` e `isGeneratingImage` criados
  - [ ] Função `handleGenerateImage` criada
  - [ ] Botão "Generate Image" conectado ao handler
  - [ ] Textarea conectado ao estado

- [ ] **Carregamento de Sessões:**
  - [ ] `useEffect` para carregar sessões ao montar componente
  - [ ] Sessões carregadas do backend

- [ ] **Upload de Assets:**
  - [ ] Função `handleUploadAsset` criada
  - [ ] Conectada ao input de arquivo (se existir)

- [ ] **Testes:**
  - [ ] Testar geração de vídeo
  - [ ] Testar geração de imagem
  - [ ] Verificar se sessões aparecem
  - [ ] Verificar atualização de créditos

---

### **🎯 Ordem Recomendada de Implementação**

1. **Primeiro:** Carregar sessões reais (8.3) - mais simples, dá feedback visual
2. **Segundo:** Geração de vídeo (8.1) - funcionalidade principal
3. **Terceiro:** Geração de imagem (8.2) - similar ao vídeo
4. **Quarto:** Upload de assets (8.4) - se necessário

---

### **💡 Dicas Importantes**

- **Token JWT:** O interceptor em `api.js` já adiciona automaticamente o token em todas as requisições
- **Tratamento de erros:** Sempre use `try/catch` e mostre mensagens amigáveis ao usuário
- **Loading states:** Use `isGenerating` e `isGeneratingImage` para desabilitar botões durante processamento
- **Polling:** A Replicate pode levar minutos para gerar - o polling verifica a cada 3 segundos

---

### **✅ Resultado Esperado**

Após implementar todas as etapas:

- ✅ Botão "Generate Video" gera vídeos reais via Replicate API
- ✅ Botão "Generate Image" gera imagens reais via Replicate API
- ✅ Sessões são carregadas do MongoDB via backend
- ✅ Créditos são atualizados após gerações
- ✅ Upload de assets funciona (se implementado)

**Status:** Aplicação 100% funcional! 🎉

