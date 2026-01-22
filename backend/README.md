# Gerador RX - Backend API

## Configuração

1. Instale as dependências:
```bash
npm install
```

2. Crie um arquivo `.env` na raiz do backend com as seguintes variáveis:
```
MONGODB_URI=mongodb://localhost:27017/gerador-rx
JWT_SECRET=your-secret-key-here
REPLICATE_API_TOKEN=your-replicate-api-token
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
PORT=5000
```

3. Inicie o servidor:
```bash
npm run dev
```

O servidor estará rodando em `http://localhost:5000`

## Estrutura

- `config/db.js` - Configuração do MongoDB
- `models/` - Modelos do Mongoose (User, Session, Asset)
- `routes/` - Rotas da API (auth, replicate, sessions, assets)
- `server.js` - Arquivo principal do servidor



