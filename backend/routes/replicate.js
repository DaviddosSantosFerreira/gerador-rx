const express = require('express');
const axios = require('axios');
const Session = require('../models/Session');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Gerar imagem
router.post('/generate-image', auth, async (req, res) => {
  const { prompt } = req.body;
  const userId = req.userId;

  try {
    // Verificar créditos do usuário
    const user = await User.findById(userId);
    if (!user || user.credits < 2) {
      return res.status(400).json({ message: 'Créditos insuficientes' });
    }

    // Chamar API da Replicate para gerar imagem
    const response = await axios.post(
      'https://api.replicate.com/v1/predictions',
      {
        version: 'db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c446677f6b74b90', // Stable Diffusion
        input: {
          prompt: prompt,
          width: 1024,
          height: 1024,
        },
      },
      {
        headers: {
          Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Criar sessão no banco
    const session = new Session({
      userId,
      name: `Generated Image ${Date.now()}`,
      type: 'image',
      prompt,
      status: 'queued',
      predictionId: response.data.id,
    });

    await session.save();

    // Deduzir créditos
    user.credits -= 2;
    await user.save();

    res.json({ predictionId: response.data.id, sessionId: session._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Gerar vídeo com Gen-4
router.post('/generate-video', auth, async (req, res) => {
  const { prompt, model, duration, resolution, style } = req.body;
  const userId = req.userId;

  try {
    // Verificar créditos do usuário
    const user = await User.findById(userId);
    if (!user || user.credits < 5) {
      return res.status(400).json({ message: 'Créditos insuficientes' });
    }

    // Chamar API da Replicate
    const response = await axios.post(
      'https://api.replicate.com/v1/predictions',
      {
        version: 'db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c446677f6b74b90', // Stable Diffusion (exemplo)
        input: {
          prompt: prompt,
          width: resolution === '720p' ? 1280 : resolution === '1080p' ? 1920 : 3840,
          height: resolution === '720p' ? 720 : resolution === '1080p' ? 1080 : 2160,
          num_frames: duration === '5s' ? 15 : duration === '10s' ? 30 : duration === '15s' ? 45 : 90,
        },
      },
      {
        headers: {
          Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Criar sessão no banco
    const session = new Session({
      userId,
      name: `Generated Video ${Date.now()}`,
      type: 'video',
      prompt,
      model,
      duration,
      resolution,
      style,
      status: 'queued',
    });

    await session.save();

    // Deduzir créditos
    user.credits -= 5;
    await user.save();

    res.json({ predictionId: response.data.id, sessionId: session._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obter status da geração
router.get('/prediction/:id', async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.replicate.com/v1/predictions/${req.params.id}`,
      {
        headers: {
          Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Atualizar sessão com resultado
router.post('/update-session/:sessionId', async (req, res) => {
  const { sessionId } = req.params;
  const { status, outputUrl } = req.body;

  try {
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Sessão não encontrada' });
    }

    session.status = status;
    if (outputUrl) session.outputUrl = outputUrl;
    await session.save();

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

