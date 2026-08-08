const errorHandler = (err, req, res, next) => {
  console.error('[Error Middleware]:', err.stack);

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'Invalid task ID.'
    });
  }

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(error => error.message);
    return res.status(400).json({
      success: false,
      error: messages.join(' ')
    });
  }

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: 'Invalid JSON payload.'
    });
  }

  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
};

module.exports = errorHandler;
