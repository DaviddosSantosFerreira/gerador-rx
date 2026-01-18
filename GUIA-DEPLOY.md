# 📋 Guia Completo: Do Projeto Rodando ao Deploy

## ✅ Estado Atual

O projeto **Gerador RX** está funcionando localmente:
- ✅ Frontend rodando em `http://localhost:5175`
- ✅ Backend rodando em `http://localhost:5000`
- ✅ MongoDB Atlas conectado
- ✅ Todas as dependências instaladas
- ✅ Estrutura completa implementada

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

