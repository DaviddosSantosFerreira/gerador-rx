const express = require('express');
const axios = require('axios');
const Session = require('../models/Session');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Gerar imagem
router.post('/generate-image', auth, async (req, res) => {
  const { prompt, model } = req.body;
  const userId = req.user.id;

  // Mapear o modelo para o ID correto do Replicate
  const imageModelMap = {
    'google/nano-banana-pro': 'google/nano-banana-pro',
    'prunaai/p-image': 'prunaai/p-image',
    'prunaai/z-image-turbo': 'prunaai/z-image-turbo',
    'bytedance/seedream-4.5': 'bytedance/seedream-4.5',
    'black-forest-labs/flux-2-max': 'black-forest-labs/flux-2-max'
  };

  const replicateModel = imageModelMap[model] || 'google/nano-banana-pro';

  try {
    // Verificar créditos do usuário
    const user = await User.findById(userId);
    if (!user || user.credits < 2) {
      return res.status(400).json({ message: 'Créditos insuficientes' });
    }

    // Chamar API da Replicate para gerar imagem
    const response = await axios.post(
      'https://api.replicate.com/v1/models/' + replicateModel + '/predictions',
      {
        input: {
          prompt: prompt
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json',
          'Prefer': 'wait'
        }
      }
    );

    // Extrair a URL do output da resposta
    const outputUrl = response.data.output;
    const predictionId = response.data.id;
    const status = response.data.status === 'succeeded' ? 'completed' : 'generating';

    // Criar sessão no banco com a URL do output
    const session = new Session({
      userId,
      name: `Generated Image ${Date.now()}`,
      type: 'image',
      prompt,
      model: replicateModel,
      status: status,
      outputUrl: outputUrl,
      predictionId: predictionId,
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
  // O modelo vem do body da requisição
  const { prompt, model, duration, resolution, style } = req.body;
  const userId = req.user.id;

  // Mapear o modelo para o ID correto do Replicate
  const modelMap = {
    'google/veo-3.1-fast': 'google/veo-3.1-fast',
    'openai/sora-2': 'openai/sora-2',
    'kwaivgi/kling-v2.6': 'kwaivgi/kling-v2.6',
    'wan-video/wan-2.5-t2v': 'wan-video/wan-2.5-t2v',
    'kwaivgi/kling-v2.5-turbo-pro': 'kwaivgi/kling-v2.5-turbo-pro'
  };

  const replicateModel = modelMap[model] || 'google/veo-3.1-fast';

  console.log('=== GENERATE VIDEO ===');
  console.log('User ID:', userId);
  console.log('Prompt:', prompt);
  console.log('Model:', model);
  console.log('Replicate Model:', replicateModel);

  try {
    // Verificar créditos do usuário
    const user = await User.findById(userId);
    if (!user || user.credits < 5) {
      return res.status(400).json({ message: 'Créditos insuficientes' });
    }

    console.log('Chamando Replicate API...');

    // Chamar API da Replicate
    const response = await axios.post(
      'https://api.replicate.com/v1/models/' + replicateModel + '/predictions',
      {
        input: {
          prompt: prompt
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json',
          'Prefer': 'wait'
        }
      }
    );

    console.log('Resposta do Replicate:', response.data.status);
    console.log('Output URL:', response.data.output);

    // Extrair a URL do output da resposta
    const outputUrl = response.data.output;
    const predictionId = response.data.id;
    const status = response.data.status === 'succeeded' ? 'completed' : 'generating';

    // Criar sessão no banco com a URL do output
    const session = new Session({
      userId,
      name: `Generated Video ${Date.now()}`,
      type: 'video',
      prompt,
      model: replicateModel,
      duration,
      resolution,
      style,
      status: status,
      outputUrl: outputUrl,
      predictionId: predictionId,
    });
    await session.save();

    // Deduzir créditos
    user.credits -= 5;
    await user.save();

    res.json({ predictionId: response.data.id, sessionId: session._id });
  } catch (error) {
    console.error('Erro na geração de vídeo:', error.response?.data || error.message);
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

