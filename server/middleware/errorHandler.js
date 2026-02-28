// Global error handler — catches all errors thrown in routes

const logger = require('../utils/logger')

module.exports = function errorHandler(err, req, res, next) {
  logger.error(`${req.method} ${req.path} →`, err.message)

  // Print stack trace in development
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack)
  }

  // OpenAI auth error
  if (err.message?.includes('API key') || err.status === 401) {
    return res.status(401).json({
      success: false,
      error:   'OpenAI API key is invalid or missing. Check your .env file.',
    })
  }

  // OpenAI rate limit
  if (err.status === 429 || err.message?.toLowerCase().includes('rate limit')) {
    return res.status(429).json({
      success: false,
      error:   'AI rate limit reached. Please wait a moment and try again.',
    })
  }

  // Supabase error
  if (err.message?.includes('supabase') || err.message?.includes('SUPABASE')) {
    return res.status(503).json({
      success: false,
      error:   'Database connection error. Check SUPABASE_URL and SUPABASE_SERVICE_KEY in .env',
    })
  }

  // Default
  const status = err.statusCode || err.status || 500
  res.status(status).json({
    success: false,
    error:
      process.env.NODE_ENV === 'development'
        ? err.message
        : 'Internal server error. Please try again.',
  })
}