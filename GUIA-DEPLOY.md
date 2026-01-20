# 📋 Guia Completo: Do Projeto Rodando ao Deploy

---

# 📘 RELATÓRIO COMPLETO DO PROJETO GERADOR-RX

## ✅ O QUE JÁ ESTÁ FUNCIONANDO

### Backend (Render)

✅ Servidor Node.js rodando na porta 5000  
✅ MongoDB Atlas conectado  
✅ Autenticação JWT implementada  
✅ Refresh Token implementado  
✅ Rate Limiting (login, registro, refresh)  
✅ Validação de email e senha  
✅ Middleware de tratamento de erros  
✅ Rotas protegidas com JWT  
✅ Integração com Replicate API (modelos de vídeo e imagem configurados)  
✅ Modelos de vídeo: google/veo-3.1-fast, openai/sora-2, kwaivgi/kling-v2.6, wan-video/wan-2.5-t2v, kwaivgi/kling-v2.5-turbo-pro  
✅ Modelos de imagem: google/nano-banana-pro, prunaai/p-image, prunaai/z-image-turbo, bytedance/seedream-4.5, black-forest-labs/flux-2-max  
✅ URL: https://gerador-rx.onrender.com

### Frontend (Vercel)

✅ React + Vite funcionando  
✅ Interface de usuário completa  
✅ Telas de Login/Registro  
✅ Dashboard com navegação  
✅ Formulários de geração de vídeo e imagem  
✅ Toasts de feedback visual  
✅ Componentes Generate e Images movidos para fora do App (correção de foco)  
✅ Variável VITE_API_URL configurada no Vercel  
✅ URL: https://gerador-rx.vercel.app

### Replicate

✅ Conta ativa com créditos ($2.01 restantes, $14.39 usados)  
✅ Gerações anteriores funcionaram (kwaivgi/kling-v2.6 gerou vídeo com sucesso)

---

## ❌ ERROS IDENTIFICADOS NO CONSOLE

### Erro 1: CORS Bloqueado
```
Access to XMLHttpRequest at 'http://localhost:5000/api/auth/login' 
from origin 'https://gerador-rx.vercel.app' has been blocked by CORS policy
```
**Problema:** O frontend está tentando acessar localhost:5000 em vez de https://gerador-rx.onrender.com

### Erro 2: localhost:5000 (ERR_FAILED)
```
localhost:5000/api/auth/login - Failed to load resource: net::ERR_FAILED
localhost:5000/api/auth/register - Failed to load resource: 400 (Bad Request)
```
**Problema:** As requisições estão indo para localhost em vez do backend em produção

### Erro 3: Erro 500 na geração
```
POST http://localhost:5000/api/replicate/generate-video - 500 (Internal Server Error)
Erro ao gerar vídeo: {message: 'Request failed with status code 500'}
```
**Problema:** Mesmo problema - requisições indo para localhost

### Erro 4: Erro 402
```
Request failed with status code 402
```
**Problema:** Créditos insuficientes (mas você tem créditos no Replicate, então é o sistema interno)

---

## 🔍 CAUSA RAIZ DO PROBLEMA

O frontend não está usando a variável de ambiente `VITE_API_URL` corretamente. Mesmo com a variável configurada no Vercel, o código está usando `localhost:5000`.

**Isso acontece porque:**

1. A variável `VITE_API_URL` é injetada no momento do build, não em runtime
2. O arquivo `src/services/api.js` pode não estar lendo a variável corretamente
3. Ou o build foi feito antes da variável ser configurada

---

## 📝 PASSO A PASSO: O QUE FALTA FAZER

### 🔧 PASSO 1: Corrigir a URL da API no Frontend

**Arquivo:** `src/services/api.js`

**Problema:** O código está usando `http://localhost:5000/api` hardcoded.

**Solução:** Atualizar para usar variável de ambiente ou lógica condicional.

**Opção A - Usar variável de ambiente (Recomendado):**
```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});
```

**Opção B - Lógica condicional baseada no modo:**
```javascript
const api = axios.create({
  baseURL:
    import.meta.env.MODE === 'development'
      ? 'http://localhost:5000/api'
      : 'https://gerador-rx.onrender.com/api',
});
```

**✅ Ação:** Já corrigido! O arquivo `src/services/api.js` foi atualizado com a Opção B.

---

### 🔧 PASSO 2: Configurar Variável de Ambiente no Vercel

**Se optou pela Opção A (variável de ambiente):**

1. Acesse o dashboard do Vercel: https://vercel.com/dashboard
2. Selecione o projeto `gerador-rx`
3. Vá em **Settings** → **Environment Variables**
4. Adicione a variável:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://gerador-rx.onrender.com/api`
   - **Environment:** Production, Preview, Development (marque todos)
5. Clique em **Save**
6. **IMPORTANTE:** Faça um novo deploy após adicionar a variável:
   - Vá em **Deployments**
   - Clique nos três pontos (...) do último deployment
   - Selecione **Redeploy**

**Se optou pela Opção B (lógica condicional):**
- ✅ Não precisa configurar variável de ambiente
- ✅ Já funciona automaticamente

---

### 🔧 PASSO 3: Verificar CORS no Backend

**Arquivo:** `backend/server.js`

**Verificar se o CORS está configurado corretamente:**

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:5173', // Vite dev server
    'https://gerador-rx.vercel.app' // Produção
  ],
  credentials: true
}));
```

**✅ Ação:** Verificar se o backend está permitindo requisições do frontend em produção.

---

### 🔧 PASSO 4: Verificar Variáveis de Ambiente do Backend

**Arquivo:** `backend/.env` (no Render)

**Verificar se todas as variáveis estão configuradas:**

1. Acesse o dashboard do Render: https://dashboard.render.com
2. Selecione o serviço `gerador-rx`
3. Vá em **Environment**
4. Verifique se estão configuradas:
   - `MONGODB_URI` - String de conexão do MongoDB Atlas
   - `JWT_SECRET` - Chave secreta para JWT
   - `REPLICATE_API_TOKEN` - Token da API do Replicate
   - `PORT` - Porta (geralmente 5000 ou deixar vazio para usar a padrão do Render)

**✅ Ação:** Verificar e adicionar variáveis faltantes se necessário.

---

### 🔧 PASSO 5: Fazer Novo Deploy do Frontend

**Após corrigir o código:**

1. **Commit e push das alterações:**
   ```bash
   git add src/services/api.js
   git commit -m "fix: corrigir URL da API para produção"
   git push origin main
   ```

2. **O Vercel fará deploy automaticamente** (se conectado ao GitHub)

3. **Ou faça deploy manual:**
   - Acesse o dashboard do Vercel
   - Vá em **Deployments**
   - Clique em **Redeploy** no último deployment

---

### 🔧 PASSO 6: Testar a Conexão

**Após o deploy:**

1. Acesse: https://gerador-rx.vercel.app
2. Abra o Console do navegador (F12)
3. Tente fazer login
4. Verifique se as requisições estão indo para:
   - ✅ `https://gerador-rx.onrender.com/api/auth/login`
   - ❌ NÃO deve aparecer `localhost:5000`

---

### 🔧 PASSO 7: Verificar Logs do Backend

**No Render:**

1. Acesse o dashboard do Render
2. Selecione o serviço `gerador-rx`
3. Vá em **Logs**
4. Verifique se há erros relacionados a:
   - CORS
   - Autenticação
   - Replicate API

---

### 🔧 PASSO 8: Testar Geração de Vídeo/Imagem

**Após corrigir a URL da API:**

1. Faça login no frontend
2. Tente gerar um vídeo ou imagem
3. Verifique os logs do backend (Render)
4. Verifique o console do navegador para erros

**Se ainda houver erro 402 (créditos insuficientes):**

- Verificar se o usuário tem créditos no banco de dados
- Verificar a lógica de dedução de créditos no backend
- Verificar se os créditos estão sendo verificados corretamente

---

## 🐛 DEBUGGING

### Como verificar se a URL está correta:

**No console do navegador:**
```javascript
console.log('API URL:', import.meta.env.VITE_API_URL);
console.log('Mode:', import.meta.env.MODE);
```

**No código:**
Adicione logs temporários em `src/services/api.js`:
```javascript
console.log('Base URL:', baseURL);
```

### Como verificar CORS:

**No console do navegador, após tentar fazer login:**
- Se aparecer erro de CORS, o backend não está permitindo a origem
- Verificar se `https://gerador-rx.vercel.app` está na lista de origens permitidas no backend

### Como verificar variáveis de ambiente:

**No Vercel:**
- Settings → Environment Variables
- Verificar se `VITE_API_URL` está configurada
- Verificar se o valor está correto: `https://gerador-rx.onrender.com/api`

**No Render:**
- Environment
- Verificar se todas as variáveis necessárias estão configuradas

---

## ✅ CHECKLIST FINAL

- [ ] Corrigir `src/services/api.js` para usar URL de produção
- [ ] Configurar `VITE_API_URL` no Vercel (se usar variável de ambiente)
- [ ] Verificar CORS no backend
- [ ] Verificar variáveis de ambiente no Render
- [ ] Fazer novo deploy do frontend
- [ ] Testar login/registro
- [ ] Testar geração de vídeo/imagem
- [ ] Verificar logs do backend
- [ ] Verificar console do navegador

---

## 📚 RECURSOS ÚTEIS

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Render Dashboard:** https://dashboard.render.com
- **MongoDB Atlas:** https://cloud.mongodb.com
- **Replicate Dashboard:** https://replicate.com/account

---

## 🎯 PRÓXIMOS PASSOS APÓS CORRIGIR

1. **Melhorar tratamento de erros:**
   - Mensagens de erro mais amigáveis
   - Feedback visual melhor

2. **Otimizar geração:**
   - Polling mais eficiente
   - Loading states melhores

3. **Adicionar features:**
   - Histórico de gerações
   - Download de resultados
   - Compartilhamento

---

**Última atualização:** 2025-01-XX
