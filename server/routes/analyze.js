// BULLETPROOF: DEMO_MODE bypasses all AI/DB calls

const path   = require('path')
const dotenv = require('dotenv')
dotenv.config({ path: path.join(__dirname, '../../.env') })

const express = require('express')
const router  = express.Router()
const logger  = require('../utils/logger')
const { validateAnalysisInput, sanitizeString } = require('../utils/validator')
const { getMockAnalysisResult }                  = require('../utils/mockData')

router.post('/', async (req, res) => {
  const startTime = Date.now()

  // Read fresh every request — never cached
  const DEMO_MODE = process.env.DEMO_MODE === 'true'
  logger.info(`DEMO_MODE = ${DEMO_MODE}`)

  try {
    // ── Validate 
    const { valid, errors } = validateAnalysisInput(req.body)
    if (!valid) {
      return res.status(400).json({ success: false, error: errors.join(' ') })
    }

    const invention = {
      title:       sanitizeString(req.body.title),
      description: sanitizeString(req.body.description),
      domain:      sanitizeString(req.body.domain  || 'General'),
      claims:      sanitizeString(req.body.claims  || ''),
      market:      sanitizeString(req.body.market  || ''),
    }

    // ── DEMO MODE — instant mock response 
    if (DEMO_MODE) {
      logger.warn('DEMO_MODE ON — returning mock data, no API calls made')
      // Realistic 3 second delay so loading animation plays
      await new Promise(r => setTimeout(r, 3000))
      const mock = getMockAnalysisResult(invention)
      mock.processingTimeMs = Date.now() - startTime
      return res.json({ success: true, data: mock })
    }

    // ── REAL MODE
    logger.info(`Real analysis: "${invention.title}"`)

    const { generateEmbedding }    = require('../../ai/embeddings')
    const { computeScore }         = require('../../ai/scorer')
    const { analyzeClaims }        = require('../../ai/claimAnalyzer')
    const { detectInnovationGaps } = require('../../ai/gapDetector')
    const { searchSimilarPatents } = require('../../database/queries/vectorSearch')
    const { saveAnalysis }         = require('../../database/queries/saveAnalysis')
    const { searchUSPTOLive }      = require('../utils/usptoSearch')

    logger.info('1/5 Generating embedding...')
    const fullText  = `${invention.title}. ${invention.description}. Claims: ${invention.claims}`
    const embedding = await generateEmbedding(fullText)

    logger.info('2/5 Vector search + USPTO live...')
    const [dbPatents, livePatents] = await Promise.all([
      searchSimilarPatents(embedding, invention.domain, 5),
      searchUSPTOLive(invention.title, invention.domain),
    ])

    // Merge DB + USPTO, deduplicate by patent number
    const seen = new Set()
    const similarPatents = [...dbPatents, ...livePatents].filter(p => {
      if (seen.has(p.patentNumber)) return false
      seen.add(p.patentNumber)
      return true
    }).slice(0, 5)

    logger.info('3/5 Claim analysis...')
    const claims = await analyzeClaims(invention)

    logger.info('4/5 Computing score...')
    const { score, metrics, heatmap } = await computeScore(
      invention, embedding, similarPatents
    )

    logger.info('5/5 Gap detection...')
    const innovationGaps = await detectInnovationGaps(invention, similarPatents)

    const analysisId = await saveAnalysis({
      invention, score, metrics, heatmap,
      claims, similarPatents, innovationGaps,
    })

    const processingTimeMs = Date.now() - startTime
    logger.success(`Done — ${score}/100 in ${processingTimeMs}ms`)

    return res.json({
      success: true,
      data: {
        analysisId, score, metrics, heatmap,
        claims, similarPatents, innovationGaps,
        processingTimeMs, invention,
      },
    })

  } catch (err) {
    // ── ALWAYS fallback — demo NEVER fails 
    logger.error('Pipeline error:', err.message)
    logger.warn('Auto-fallback to mock data...')
    const invention = {
      title:       sanitizeString(req.body?.title       || 'Demo Invention'),
      description: sanitizeString(req.body?.description || ''),
      domain:      sanitizeString(req.body?.domain      || 'General'),
      claims:      sanitizeString(req.body?.claims      || ''),
      market:      sanitizeString(req.body?.market      || ''),
    }
    const mock = getMockAnalysisResult(invention)
    mock.processingTimeMs = Date.now() - startTime
    mock.isFallback = true
    return res.json({ success: true, data: mock })
  }
})

module.exports = router