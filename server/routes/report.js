// POST /api/report/generate — build structured report data

const express = require('express')
const router  = express.Router()
const logger  = require('../utils/logger')
const { getAnalysisById } = require('../../database/queries/saveAnalysis')

// POST /api/report/generate
// Body: { analysisId } OR { result: fullResultObject }
router.post('/generate', async (req, res, next) => {
  try {
    const { analysisId, result } = req.body
    let reportData = result

    // If only ID was provided, fetch from database
    if (analysisId && !result) {
      reportData = await getAnalysisById(analysisId)
      if (!reportData) {
        return res.status(404).json({
          success: false,
          error:   `Analysis with id "${analysisId}" not found.`,
        })
      }
    }

    if (!reportData) {
      return res.status(400).json({
        success: false,
        error:   'Provide either analysisId or result in request body.',
      })
    }

    const report = {
      generatedAt:    new Date().toISOString(),
      title:          reportData.invention?.title || 'Untitled Invention',
      score:          reportData.score,
      verdict:        getVerdict(reportData.score),
      metrics:        reportData.metrics        || {},
      claims:         reportData.claims         || [],
      similarPatents: reportData.similarPatents || [],
      innovationGaps: reportData.innovationGaps || [],
      summary:        buildExecutiveSummary(reportData),
    }

    logger.success(`Report generated: "${report.title}" score=${report.score}`)

    return res.json({ success: true, data: report })

  } catch (err) {
    logger.error('Report generation failed:', err.message)
    next(err)
  }
})

// ── Helpers

function getVerdict(score) {
  if (score >= 70) return { label: 'Highly Patentable',       color: 'green'  }
  if (score >= 50) return { label: 'Potentially Novel',       color: 'yellow' }
  return                  { label: 'Needs Differentiation',   color: 'red'    }
}

function buildExecutiveSummary(data) {
  const { score = 0, similarPatents = [], innovationGaps = [] } = data

  const strength =
    score >= 70 ? 'strong' :
    score >= 50 ? 'moderate' :
    'limited'

  const topPatent = similarPatents[0]
  const priorArtNote = topPatent
    ? `The closest prior art is ${topPatent.patentNumber} with ${topPatent.similarityScore}% similarity.`
    : 'No highly similar patents were found in the database.'

  return [
    `Patentability score of ${score}/100 indicates ${strength} novelty potential.`,
    priorArtNote,
    `${innovationGaps.length} innovation gap(s) were identified as differentiation opportunities.`,
    score >= 70
      ? 'Recommendation: Proceed with filing — strong novelty indicators detected.'
      : score >= 50
      ? 'Recommendation: Refine claims to emphasize unique technical aspects before filing.'
      : 'Recommendation: Significant differentiation work required before filing.',
  ].join(' ')
}

module.exports = router