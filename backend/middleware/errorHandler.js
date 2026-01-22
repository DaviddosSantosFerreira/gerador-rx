const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Erro de validação do Mongoose
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: Object.values(err.errors).map(e => e.message).join(', ')
    });
  }

  // Erro de duplicação (unique)
  if (err.code === 11000) {
    return res.status(400).json({
      message: 'Email já cadastrado'
    });
  }

  // Erro padrão
  res.status(err.status || 500).json({
    message: err.message || 'Erro interno do servidor'
  });
};

module.exports = errorHandler;



