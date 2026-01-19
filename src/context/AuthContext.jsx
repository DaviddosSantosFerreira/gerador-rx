import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import { login as loginApi, register as registerApi, logoutUser } from '../services/api';

// Validar formato de email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validar força da senha
const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;
  return passwordRegex.test(password);
};

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Validação no frontend
    if (!email || !password) {
      toast.error('Email e senha são obrigatórios');
      return {
        success: false,
        error: 'Email e senha são obrigatórios'
      };
    }
    if (!isValidEmail(email)) {
      toast.error('Formato de email inválido');
      return {
        success: false,
        error: 'Formato de email inválido'
      };
    }
    
    try {
      const response = await loginApi(email, password);
      const { token, refreshToken, user } = response.data;
      setUser(user);
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      toast.success('Login realizado com sucesso!');
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Erro ao fazer login');
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erro ao fazer login'
      };
    }
  };

  const register = async (name, email, password) => {
    // Validação no frontend
    if (!name || !email || !password) {
      toast.error('Todos os campos são obrigatórios');
      return {
        success: false,
        error: 'Todos os campos são obrigatórios'
      };
    }
    if (!isValidEmail(email)) {
      toast.error('Formato de email inválido');
      return {
        success: false,
        error: 'Formato de email inválido'
      };
    }
    if (!isValidPassword(password)) {
      toast.error('Senha deve ter no mínimo 6 caracteres, incluindo pelo menos 1 letra e 1 número');
      return {
        success: false,
        error: 'Senha deve ter no mínimo 6 caracteres, incluindo pelo menos 1 letra e 1 número'
      };
    }
    
    try {
      const response = await registerApi(name, email, password);
      const { token, refreshToken, user } = response.data;
      setUser(user);
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      toast.success('Conta criada com sucesso!');
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Erro ao criar conta');
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erro ao registrar'
      };
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await logoutUser(refreshToken);
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setUser(null);
      toast.info('Você saiu da sua conta');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
