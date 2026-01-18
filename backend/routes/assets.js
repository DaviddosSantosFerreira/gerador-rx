const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Asset = require('../models/Asset');
const auth = require('../middleware/auth');
const router = express.Router();

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configurar Multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Obter todos os assets do usuário
router.get('/:userId', auth, async (req, res) => {
  try {
    const assets = await Asset.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(assets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload de ativo
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    const { name, type, tags } = req.body;
    const userId = req.userId;

    // Upload para Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: type === 'video' ? 'video' : type === 'audio' ? 'raw' : 'image' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    // Criar ativo no banco
    const asset = new Asset({
      userId,
      name: name || req.file.originalname,
      type,
      size: `${(req.file.size / 1024 / 1024).toFixed(1)}MB`,
      url: result.secure_url,
      tags: tags ? tags.split(',') : [],
      private: true,
    });

    await asset.save();

    res.json(asset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Deletar ativo
router.delete('/:id', auth, async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({ error: 'Asset não encontrado' });
    }

    if (asset.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Não autorizado' });
    }

    await Asset.findByIdAndDelete(req.params.id);
    res.json({ message: 'Asset deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Atualizar ativo (favorito, etc)
router.patch('/:id', auth, async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({ error: 'Asset não encontrado' });
    }

    if (asset.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Não autorizado' });
    }

    Object.assign(asset, req.body);
    await asset.save();
    res.json(asset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

