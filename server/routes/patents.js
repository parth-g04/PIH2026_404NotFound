// GET /api/patents/search — search similar patents by text query

const express = require('express')
const router  = express.Router()
const logger  = require('../utils/logger')

const { generateEmbedding }    = require('../../ai/embeddings')
const { searchSimilarPatents } = require('../../database/queries/vectorSearch')

// GET /api/patents/search?q=your+query&domain=AI&limit=5
router.get('/search', async (req, res, next) => {
  try {
    const query  = (req.query.q      || '').trim()
    const domain = (req.query.domain || null)
    const limit  = Math.min(parseInt(req.query.limit) || 5, 10)

    if (!query || query.length < 3) {
      return res.status(400).json({
        success: false,
        error:   'Query must be at least 3 characters.',
      })
    }

    logger.info(`Patent search: "${query}" domain=${domain} limit=${limit}`)

    const embedding = await generateEmbedding(query)
    const patents   = await searchSimilarPatents(embedding, domain, limit)

    return res.json({
      success: true,
      data:    patents,
    })

  } catch (err) {
    logger.error('Patent search failed:', err.message)
    next(err)
  }
})

module.exports = router