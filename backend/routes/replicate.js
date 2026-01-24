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
          Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
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

// Animar personagem (image-to-video)
router.post('/animate-character', auth, async (req, res) => {
  const { imageUrl, prompt, model, duration } = req.body;
  const userId = req.user.id;

  // Mapear o modelo selecionado
  const animationModelMap = {
    'kling-v2.5-turbo-pro': 'kwaivgi/kling-v2.5-turbo-pro',
    'veo-3.1-fast': 'google/veo-3.1-fast',
    'veo-3.1': 'google/veo-3.1',
    'pixverse-v5': 'pixverse/pixverse-v5',
    'veo-3': 'google/veo-3'
  };

  const replicateModel = animationModelMap[model] || 'google/veo-3.1-fast';

  console.log('=== ANIMATE CHARACTER ===');
  console.log('User ID:', userId);
  console.log('Image URL:', imageUrl);
  console.log('Prompt:', prompt);
  console.log('Model:', model);
  console.log('Replicate Model:', replicateModel);

  try {
    console.log('Chamando Replicate API para animação...');

    // Chamar API da Replicate
    const response = await axios.post(
      'https://api.replicate.com/v1/models/' + replicateModel + '/predictions',
      {
        input: {
          image: imageUrl,
          prompt: prompt || 'animate this character with natural movement',
          duration: (() => {
            // Cada modelo tem durações diferentes permitidas
            if (replicateModel.includes('veo')) {
              // Google Veo aceita: 4, 6, 8
              return duration === '8s' ? 8 : duration === '6s' ? 6 : 4;
            } else if (replicateModel.includes('pixverse')) {
              // PixVerse aceita: 5, 8
              return duration === '8s' ? 8 : 5;
            } else if (replicateModel.includes('kling')) {
              // Kling aceita: 5, 10
              return duration === '10s' ? 10 : 5;
            }
            return 5;
          })()
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Resposta do Replicate:', response.data.status);
    console.log('Prediction ID:', response.data.id);

    const predictionId = response.data.id;
    const status = response.data.status === 'succeeded' ? 'completed' : 'generating';
    const outputUrl = response.data.output || null;

    // Criar sessão no banco
    const session = new Session({
      userId,
      name: `Animated Character ${Date.now()}`,
      type: 'video',
      prompt: prompt || 'Character animation',
      model: replicateModel,
      duration,
      status: status,
      outputUrl: outputUrl,
      predictionId: predictionId,
    });
    await session.save();

    res.json({ predictionId: response.data.id, sessionId: session._id });
  } catch (error) {
    console.error('Erro na animação:', error.response?.data || error.message);
    res.status(500).json({ message: error.response?.data?.detail || error.message });
  }
});

// Gerar áudio com MiniMax TTS
router.post('/generate-audio', auth, async (req, res) => {
  const { text, voice, emotion, language, speed } = req.body;
  const userId = req.user.id;

  console.log('=== GENERATE AUDIO (TTS) ===');
  console.log('User ID:', userId);
  console.log('Text:', text?.substring(0, 50) + '...');
  console.log('Voice:', voice);
  console.log('Emotion:', emotion);
  console.log('Language:', language);

  try {
    const response = await axios.post(
      'https://api.replicate.com/v1/models/minimax/speech-02-hd/predictions',
      {
        input: {
          text: text,
          voice_id: voice || 'Friendly_Person',
          emotion: emotion || 'auto',
          language_boost: language || 'Portuguese',
          speed: speed || 1,
          audio_format: 'mp3'
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json',
          'Prefer': 'wait=60'
        }
      }
    );

    console.log('TTS Response Status:', response.data.status);
    
    res.json({ 
      predictionId: response.data.id,
      status: response.data.status,
      output: response.data.output
    });
  } catch (error) {
    console.error('Erro no TTS:', error.response?.data || error.message);
    res.status(500).json({ message: error.response?.data?.detail || error.message });
  }
});

// Gerar Lipsync (vídeo + áudio)
router.post('/generate-lipsync', auth, async (req, res) => {
  const { videoUrl, audioUrl, syncMode } = req.body;
  const userId = req.user.id;

  console.log('=== GENERATE LIPSYNC ===');
  console.log('User ID:', userId);
  console.log('Video URL:', videoUrl);
  console.log('Audio URL:', audioUrl);
  console.log('Sync Mode:', syncMode);

  try {
    const response = await axios.post(
      'https://api.replicate.com/v1/models/sync/lipsync-2/predictions',
      {
        input: {
          video: videoUrl,
          audio: audioUrl,
          sync_mode: syncMode || 'loop',
          temperature: 0.5
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Lipsync Response Status:', response.data.status);
    console.log('Prediction ID:', response.data.id);

    // Criar sessão no banco
    const session = new Session({
      userId,
      name: `Lipsync Video ${Date.now()}`,
      type: 'video',
      prompt: 'Lipsync generation',
      model: 'sync/lipsync-2',
      status: response.data.status === 'succeeded' ? 'completed' : 'generating',
      outputUrl: response.data.output || null,
      predictionId: response.data.id,
    });
    await session.save();

    res.json({ 
      predictionId: response.data.id, 
      sessionId: session._id,
      status: response.data.status,
      output: response.data.output
    });
  } catch (error) {
    console.error('Erro no Lipsync:', error.response?.data || error.message);
    res.status(500).json({ message: error.response?.data?.detail || error.message });
  }
});

// Lipsync completo: Texto → Áudio → Lipsync (fluxo combinado)
router.post('/lipsync-with-tts', auth, async (req, res) => {
  const { videoUrl, text, voice, emotion, language, speed, syncMode } = req.body;
  const userId = req.user.id;

  console.log('=== LIPSYNC WITH TTS (COMBINED FLOW) ===');
  console.log('User ID:', userId);
  console.log('Video URL:', videoUrl);
  console.log('Text:', text?.substring(0, 50) + '...');
  console.log('Voice:', voice);

  try {
    // ETAPA 1: Gerar áudio com MiniMax TTS
    console.log('Etapa 1: Gerando áudio...');
    const ttsResponse = await axios.post(
      'https://api.replicate.com/v1/models/minimax/speech-02-hd/predictions',
      {
        input: {
          text: text,
          voice_id: voice || 'Friendly_Person',
          emotion: emotion || 'auto',
          language_boost: language || 'Portuguese',
          speed: speed || 1,
          audio_format: 'mp3'
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json',
          'Prefer': 'wait=60'
        }
      }
    );

    let audioUrl = ttsResponse.data.output;
    let ttsPredictionId = ttsResponse.data.id;

    // Se ainda não completou, fazer polling
    if (!audioUrl && ttsResponse.data.status !== 'succeeded') {
      console.log('TTS ainda processando, fazendo polling...');
      let attempts = 0;
      while (!audioUrl && attempts < 30) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const statusResponse = await axios.get(
          `https://api.replicate.com/v1/predictions/${ttsPredictionId}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`
            }
          }
        );
        if (statusResponse.data.status === 'succeeded') {
          audioUrl = statusResponse.data.output;
          break;
        } else if (statusResponse.data.status === 'failed') {
          throw new Error('Falha ao gerar áudio');
        }
        attempts++;
      }
    }

    if (!audioUrl) {
      throw new Error('Timeout ao gerar áudio');
    }

    console.log('Áudio gerado:', audioUrl);

    // ETAPA 2: Gerar Lipsync
    console.log('Etapa 2: Gerando lipsync...');
    const lipsyncResponse = await axios.post(
      'https://api.replicate.com/v1/models/sync/lipsync-2/predictions',
      {
        input: {
          video: videoUrl,
          audio: audioUrl,
          sync_mode: syncMode || 'loop',
          temperature: 0.5
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Lipsync iniciado:', lipsyncResponse.data.id);

    // Criar sessão no banco
    const session = new Session({
      userId,
      name: `Lipsync TTS ${Date.now()}`,
      type: 'video',
      prompt: text?.substring(0, 100),
      model: 'sync/lipsync-2 + minimax/speech-02-hd',
      status: 'generating',
      outputUrl: null,
      predictionId: lipsyncResponse.data.id,
    });
    await session.save();

    res.json({ 
      predictionId: lipsyncResponse.data.id, 
      sessionId: session._id,
      audioUrl: audioUrl,
      status: lipsyncResponse.data.status
    });
  } catch (error) {
    console.error('Erro no Lipsync with TTS:', error.response?.data || error.message);
    res.status(500).json({ message: error.response?.data?.detail || error.message });
  }
});

module.exports = router;

