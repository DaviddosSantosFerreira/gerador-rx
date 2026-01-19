require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const replicateRoutes = require('./routes/replicate');
const authRoutes = require('./routes/authRoutes');
const sessionsRoutes = require('./routes/sessions');
const assetsRoutes = require('./routes/assets');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "Gerador RX API",
    uptime: process.uptime(),
  });
});

connectDB();

app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/replicate', replicateRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionsRoutes);
app.use('/api/assets', assetsRoutes);

// Middleware de erro (deve ser o último)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

