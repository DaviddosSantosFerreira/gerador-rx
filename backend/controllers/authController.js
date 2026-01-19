const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Validar formato de email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validar força da senha
const isValidPassword = (password) => {
  // Mínimo 6 caracteres, pelo menos 1 letra e 1 número
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;
  return passwordRegex.test(password);
};

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const generateRefreshToken = () => {
  return crypto.randomBytes(40).toString('hex');
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    // Validar formato do email
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Formato de email inválido' });
    }

    // Validar força da senha
    if (!isValidPassword(password)) {
      return res.status(400).json({ 
        message: 'Senha deve ter no mínimo 6 caracteres, incluindo pelo menos 1 letra e 1 número' 
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    const token = generateToken(user._id);

    const refreshToken = generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save();

    return res.status(201).json({
      token,
      refreshToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        credits: user.credits
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro no registro' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }

    // Validar formato do email
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Formato de email inválido' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Senha inválida' });
    }

    const token = generateToken(user._id);

    const refreshToken = generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save();

    return res.status(200).json({
      token,
      refreshToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        credits: user.credits
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro no login' });
  }
};

const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token é obrigatório' });
    }
    
    // Buscar usuário pelo refresh token
    const user = await User.findOne({ refreshToken });
    
    if (!user) {
      return res.status(401).json({ message: 'Refresh token inválido' });
    }
    
    // Gerar novos tokens
    const newAccessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const newRefreshToken = generateRefreshToken();
    
    // Atualizar refresh token no banco
    user.refreshToken = newRefreshToken;
    await user.save();
    
    res.json({
      token: newAccessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    console.error('Erro no refresh:', error);
    res.status(500).json({ message: 'Erro ao renovar token' });
  }
};

const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (refreshToken) {
      const user = await User.findOne({ refreshToken });
      if (user) {
        user.refreshToken = null;
        await user.save();
      }
    }
    
    res.json({ message: 'Logout realizado com sucesso' });
  } catch (error) {
    console.error('Erro no logout:', error);
    res.status(500).json({ message: 'Erro ao fazer logout' });
  }
};

module.exports = { register, login, refresh, logout };
