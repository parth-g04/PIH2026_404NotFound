// Main Express server entry point
require('dotenv').config({ path: '../.env' })

const express   = require('express')
const cors      = require('cors')
const morgan    = require('morgan')
const rateLimit = require('express-rate-limit')

const analyzeRoutes = require('./routes/analyze')
const patentsRoutes = require('./routes/patents')
const reportRoutes  = require('./routes/report')
const errorHandler  = require('./middleware/errorHandler')
const logger        = require('./utils/logger')

const app  = express()
const PORT = process.env.PORT || 5000

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    /\.vercel\.app$/,      // ← allows ALL vercel URLs
    /\.railway\.app$/,
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
// ── Body Parsing 
app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: true }))

// ── HTTP Request Logging 
app.use(morgan('dev'))

// ── Rate Limiting 
const limiter = rateLimit({
  windowMs:  15 * 60 * 1000,  // 15 minutes
  max:        50,              // max 50 requests per window per IP
  standardHeaders: true,
  legacyHeaders:   false,
  message: { success: false, error: 'Too many requests. Please wait 15 minutes.' },
})
app.use('/api/', limiter)

// ── Routes
app.use('/api/analyze',  analyzeRoutes)
app.use('/api/patents',  patentsRoutes)
app.use('/api/report',   reportRoutes)

// ── Health Check 
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status:    'online',
      service:   'PatentGuard AI API',
      version:   '1.0.0',
      timestamp:  new Date().toISOString(),
      env:        process.env.NODE_ENV || 'development',
      openai:     !!process.env.OPENAI_API_KEY    ? '✓ configured' : '✗ missing',
      supabase:   !!process.env.SUPABASE_URL       ? '✓ configured' : '✗ missing',
    },
  })
})

// ── 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error:   `Route ${req.method} ${req.originalUrl} not found`,
  })
})

// ── Global Error Handler 
app.use(errorHandler)


app.listen(PORT, () => {
  logger.success(`⚡ PatentGuard AI server running at http://localhost:${PORT}`)
  logger.info(`📡 Health check: http://localhost:${PORT}/api/health`)
  logger.info(`🌍 Environment:  ${process.env.NODE_ENV || 'development'}`)
  logger.info(`🔑 OpenAI:       ${process.env.OPENAI_API_KEY    ? 'configured ✓' : 'MISSING ✗'}`)
  logger.info(`🗄  Supabase:     ${process.env.SUPABASE_URL       ? 'configured ✓' : 'MISSING ✗'}`)
})

module.exports = app