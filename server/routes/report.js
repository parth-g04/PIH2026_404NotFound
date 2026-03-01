// PatentGuard AI — server/routes/report.js — RAILWAY COMPATIBLE
// Self-contained — no imports from database/ folder

const express = require('express')
const router  = express.Router()
const logger  = require('../utils/logger')

router.post('/generate', async (req, res) => {
  try {
    const { result } = req.body

    if (!result) {
      return res.status(400).json({
        success: false,
        error: 'Provide result in request body.',
      })
    }

    const score   = result.score || 0
    const verdict =
      score >= 70 ? { label: 'Highly Patentable',     color: 'green'  } :
      score >= 50 ? { label: 'Potentially Novel',     color: 'yellow' } :
                   { label: 'Needs Differentiation',  color: 'red'    }

    const report = {
      generatedAt:    new Date().toISOString(),
      title:          result.invention?.title || 'Untitled',
      score,
      verdict,
      metrics:        result.metrics        || {},
      claims:         result.claims         || [],
      similarPatents: result.similarPatents || [],
      innovationGaps: result.innovationGaps || [],
      summary:
        `Patentability score of ${score}/100. ` +
        `${verdict.label}. ` +
        `${(result.innovationGaps || []).length} innovation gaps identified.`,
    }

    logger.success(`Report generated: "${report.title}" score=${score}`)
    return res.json({ success: true, data: report })

  } catch (err) {
    logger.error('Report error:', err.message)
    return res.status(500).json({ success: false, error: err.message })
  }
})

module.exports = router