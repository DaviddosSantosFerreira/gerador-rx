const express = require('express');
const Session = require('../models/Session');
const auth = require('../middleware/auth');
const router = express.Router();

// Obter todas as sessões do usuário
router.get('/', auth, async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Deletar uma sessão
router.delete('/:id', auth, async (req, res) => {
  try {
    const session = await Session.findOne({ _id: req.params.id, userId: req.user.id });
    
    if (!session) {
      return res.status(404).json({ message: 'Sessão não encontrada' });
    }
    
    await Session.deleteOne({ _id: req.params.id });
    res.json({ message: 'Sessão deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
