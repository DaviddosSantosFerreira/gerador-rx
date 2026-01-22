# Gerador RX — Rodar e Deploy

## 1. Para rodar localmente

### Backend

1. **Criar `backend/.env`** com:
   ```
   MONGODB_URI=mongodb://localhost:27017/gerador-rx
   JWT_SECRET=uma-chave-secreta-forte-aqui
   REPLICATE_API_TOKEN=seu-token-replicate
   CLOUDINARY_CLOUD_NAME=seu-cloud-name
   CLOUDINARY_API_KEY=sua-api-key
   CLOUDINARY_API_SECRET=seu-api-secret
   PORT=5000
   ```

2. **MongoDB** rodando:
   - Local: instalar MongoDB e subir o serviço, ou
   - MongoDB Atlas: criar cluster e usar a URI em `MONGODB_URI`.

3. **Instalar e iniciar:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   Servidor em `http://localhost:5000`.

### Frontend

1. **Instalar e iniciar:**
   ```bash
   npm install
   npm run dev
   ```
   App em `http://localhost:5173` (ou porta que o Vite mostrar).

2. O `src/services/api.js` usa `baseURL: 'http://localhost:5000/api'` — correto para desenvolvimento.

### O que ainda falta para “rodar completo”

- **Login/Register no fluxo do app:**  
  O `App.jsx` não usa `Register` nem tem tela de Login; sempre mostra o dashboard.  
  Para ter login/registro:
  - Instalar `react-router-dom`,
  - Definir rotas `/login`, `/register` e `/` (dashboard),
  - Em `/` e nas rotas internas, checar `user` do `AuthContext` e, se não estiver logado, redirecionar para `/login`.

- **APIs externas (para gerar vídeo e upload):**
  - Replicate: token em https://replicate.com
  - Cloudinary: conta em https://cloudinary.com  
  Sem elas, registro/login e o app “rodam”, mas geração de vídeo e upload de assets vão falhar.

---

## 2. Para fazer deploy

### Visão geral

- **Frontend:** build estático (Vite → `dist/`), hospedado em Vercel, Netlify, etc.
- **Backend:** Node/Express em Render, Railway, Heroku, etc.
- **Banco:** MongoDB Atlas em produção.
- **APIs:** Replicate e Cloudinary com as mesmas variáveis, em valores de produção.

---

### 2.1 Ajustes no código

#### Frontend — `baseURL` da API

Hoje está fixo em `http://localhost:5000/api`. Em produção o frontend precisa apontar para a URL do backend.

1. **Variável de ambiente no Vite**  
   No frontend, crie `.env.production` (não commitar valores sensíveis; na Vercel/Netlify você configura):
   ```
   VITE_API_URL=https://sua-api.railway.app/api
   ```
   Ou a URL real do seu backend (ex.: `https://gerador-rx-api.onrender.com/api`).

2. **Em `src/services/api.js`**, trocar:
   ```javascript
   baseURL: 'http://localhost:5000/api',
   ```
   por:
   ```javascript
   baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
   ```

#### Backend — CORS

No `server.js` o CORS está `app.use(cors())`, ou seja, aceita qualquer origem. Em produção é melhor restringir:

```javascript
app.use(cors({
  origin: [
    'https://seu-app.vercel.app',
    'https://gerador-rx.netlify.app',
    'http://localhost:5173'
  ],
  credentials: true
}));
```

Ajuste `origin` para a(s) URL(s) do frontend em produção (e localhost para dev).

---

### 2.2 Build do frontend

```bash
npm run build
```

Saída em `dist/`. Esse diretório é o que a Vercel/Netlify vão servir.

---

### 2.3 Onde hospedar

#### Frontend (Vercel ou Netlify)

- Conectar o repositório do projeto.
- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Variáveis de ambiente:**  
  `VITE_API_URL` = URL base da API (ex.: `https://sua-api.onrender.com/api`).

Para SPA: se no futuro você tiver rotas (ex. `/login`, `/register`), configurar redirect/rewrite para `index.html` em todas as rotas. Na Vercel isso já é padrão para `dist`; na Netlify pode precisar de `_redirects` ou `netlify.toml`.

#### Backend (Render, Railway, Heroku, etc.)

- Conectar o repositório; a pasta do backend pode ser a `backend/` ou a raiz, dependendo de como você configurar o “root” do serviço.
- **Build:** `cd backend && npm install` (ou o comando que a plataforma usar para a pasta do backend).
- **Start:** `cd backend && npm start` (ou `node server.js`), conforme o `package.json` do backend.
- **Variáveis de ambiente** (definir no painel):
  - `MONGODB_URI` (Atlas em produção)
  - `JWT_SECRET`
  - `REPLICATE_API_TOKEN`
  - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
  - `PORT` (geralmente a plataforma define; usar `process.env.PORT`)

Se o backend e o frontend estiverem no mesmo repositório (monorepo), em Render/Railway você aponta o “root” ou “app” para a pasta `backend`.

---

### 2.4 MongoDB Atlas

1. Criar cluster em https://cloud.mongodb.com.
2. Obter connection string (ex.: `mongodb+srv://user:pass@cluster.xxxxx.mongodb.net/gerador-rx`).
3. Em **Network Access**, liberar `0.0.0.0/0` (ou só os IPs do Render/Railway, se a plataforma publicar).
4. Usar essa URI em `MONGODB_URI` no backend em produção.

---

### 2.5 Servir frontend pelo Express (opcional)

Se quiser um único deploy (só backend):

1. No backend, após as rotas da API:
   ```javascript
   if (process.env.NODE_ENV === 'production') {
     app.use(express.static(path.join(__dirname, '../dist')));
     app.get('*', (req, res) => {
       res.sendFile(path.join(__dirname, '../dist/index.html'));
     });
   }
   ```
2. Rodar `npm run build` na raiz e garantir que a pasta `dist` exista ao fazer deploy do backend (incluindo no build do serviço: `npm run build` na raiz antes de `npm start` no backend, ou um script que faça os dois).

Nesse cenário, a URL do frontend e da API é a mesma; o `VITE_API_URL` pode ser relativo, ex. `/api`, e no `api.js`:
`baseURL: import.meta.env.VITE_API_URL || '/api'` (e o backend servindo em `https://seu-dominio.com`).

---

## 3. Checklist rápido

### Rodar local

- [ ] `backend/.env` criado com `MONGODB_URI`, `JWT_SECRET`, etc.
- [ ] MongoDB local ou Atlas acessível
- [ ] `cd backend && npm install && npm run dev`
- [ ] Na raiz: `npm install && npm run dev`
- [ ] (Opcional) Integrar `Register`/`Login` no `App` com `react-router-dom` e `AuthContext`

### Deploy

- [ ] `api.js` usando `import.meta.env.VITE_API_URL` (com fallback para localhost em dev)
- [ ] CORS no backend com a origem do frontend em produção
- [ ] `VITE_API_URL` nas variáveis do projeto do frontend (Vercel/Netlify)
- [ ] Backend com `MONGODB_URI` (Atlas), `JWT_SECRET`, Replicate, Cloudinary e `PORT`
- [ ] Build do frontend: `npm run build` → `dist/`
- [ ] MongoDB Atlas com acesso de rede liberado para o serviço do backend

---

## 4. Resumo

- **Rodar:** `.env` no backend, MongoDB, `npm install` e `npm run dev` no backend e no frontend. Para ter login/registro de verdade, falta integrar `Register`/`Login` no `App` (ex. com React Router) e usar o `AuthContext`.
- **Deploy:** `VITE_API_URL` no frontend, CORS no backend, build do frontend, backend em Render/Railway (ou similar) com variáveis de produção, MongoDB Atlas e, se for usar, Replicate e Cloudinary configurados.



