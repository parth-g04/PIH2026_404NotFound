// POST /api/analyze — main analysis pipeline
const express  = require('express')
const router   = express.Router()
const logger   = require('../utils/logger')
const { validateAnalysisInput, sanitizeString } = require('../utils/validator')

const { generateEmbedding }    = require('../../ai/embeddings')
const { computeScore }         = require('../../ai/scorer')
const { analyzeClaims }        = require('../../ai/claimAnalyzer')
const { detectInnovationGaps } = require('../../ai/gapDetector')

const { searchSimilarPatents } = require('../../database/queries/vectorSearch')
const { saveAnalysis }         = require('../../database/queries/saveAnalysis')

router.post('/', async (req, res, next) => {
  const startTime = Date.now()

  try {
    // ── Step 1: Validate input 
    const { valid, errors } = validateAnalysisInput(req.body)
    if (!valid) {
      return res.status(400).json({
        success: false,
        error:   errors.join(' '),
      })
    }

    // ── Step 2: Sanitize inputs 
    const invention = {
      title:       sanitizeString(req.body.title),
      description: sanitizeString(req.body.description),
      domain:      sanitizeString(req.body.domain  || 'General'),
      claims:      sanitizeString(req.body.claims  || ''),
      market:      sanitizeString(req.body.market  || ''),
    }

    logger.info(`Analyzing: "${invention.title}" [${invention.domain}]`)

    // ── Step 3: Generate embedding 
    logger.info('1/5 Generating embeddings...')
    const fullText  = `${invention.title}. ${invention.description}. Key claims: ${invention.claims}`
    const embedding = await generateEmbedding(fullText)

    // ── Step 4: Vector search for similar patents 
    logger.info('2/5 Searching prior art...')
    const similarPatents = await searchSimilarPatents(
      embedding,
      invention.domain,
      5
    )

    // ── Step 5: LLM claim analysis 
    logger.info('3/5 Analyzing claims with GPT-4o...')
    const claims = await analyzeClaims(invention)

    // ── Step 6: Compute patentability score 
    logger.info('4/5 Computing score...')
    const { score, metrics, heatmap } = await computeScore(
      invention,
      embedding,
      similarPatents
    )

    // ── Step 7: Detect innovation gaps
    logger.info('5/5 Detecting innovation gaps...')
    const innovationGaps = await detectInnovationGaps(invention, similarPatents)

    // ── Step 8: Save to database 
    const analysisId = await saveAnalysis({
      invention,
      score,
      metrics,
      heatmap,
      claims,
      similarPatents,
      innovationGaps,
    })

    const processingTimeMs = Date.now() - startTime
    logger.success(
      `Analysis done — score: ${score}/100, patents: ${similarPatents.length}, time: ${processingTimeMs}ms`
    )

    // ── Step 9: Return response 
    return res.json({
      success: true,
      data: {
        analysisId,
        score,
        metrics,
        heatmap,
        claims,
        similarPatents,
        innovationGaps,
        processingTimeMs,
        invention,
      },
    })

  } catch (err) {
    logger.error('Analysis pipeline failed:', err.message)
    next(err)  // Pass to global error handler
  }
})

module.exports = router