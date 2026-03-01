require('dotenv').config({ path: '../../.env' })

const DEMO_MODE = process.env.DEMO_MODE === 'true'

async function saveAnalysis({
  invention,
  score,
  metrics,
  heatmap,
  claims,
  similarPatents,
  innovationGaps,
}) {
  // DEMO_MODE: skip DB write, return fake ID
  if (DEMO_MODE) {
    console.log('[SaveAnalysis] DEMO_MODE — skipping DB save')
    return 'demo-' + Date.now()
  }

  try {
    const supabase = require('../supabaseClient')

    // 1. Insert main analysis
    const { data: row, error } = await supabase
      .from('analyses')
      .insert({
        invention_title:  invention.title,
        invention_desc:   invention.description,
        invention_domain: invention.domain,
        invention_claims: invention.claims,
        invention_market: invention.market,
        score,
        metrics,
        heatmap,
      })
      .select('id')
      .single()

    if (error) {
      console.error('[SaveAnalysis] Insert error:', error.message)
      return null
    }

    const analysisId = row.id
    console.log('[SaveAnalysis] ✓ Saved:', analysisId)

    // 2. Save claims
    if (claims?.length > 0) {
      await supabase.from('patent_claims').insert(
        claims.map((c, i) => ({
          analysis_id: analysisId,
          claim_type:  c.type,
          claim_text:  c.text,
          domain:      c.domain || invention.domain,
          rank:        i,
        }))
      )
    }

    // 3. Save innovation gaps
    if (innovationGaps?.length > 0) {
      await supabase.from('innovation_gaps').insert(
        innovationGaps.map((g, i) => ({
          analysis_id: analysisId,
          title:       g.title,
          description: g.description,
          rank:        i,
        }))
      )
    }

    // 4. Save patent links (only those with real DB ids)
    const realPatents = (similarPatents || []).filter(
      p => p.id && !String(p.id).startsWith('mock')
    )
    if (realPatents.length > 0) {
      await supabase.from('analysis_patents').insert(
        realPatents.map((p, i) => ({
          analysis_id:      analysisId,
          patent_id:        p.id,
          similarity_score: p.similarityScore,
          rank:             i,
        }))
      )
    }

    return analysisId

  } catch (err) {
    console.error('[SaveAnalysis] Unexpected error:', err.message)
    return null
  }
}

async function getAnalysisById(id) {
  if (DEMO_MODE || !id) return null

  try {
    const supabase = require('../supabaseClient')

    const { data, error } = await supabase
      .from('analyses')
      .select('*')
      .eq('id', id)
      .single()

    if (error) return null
    return data

  } catch (err) {
    console.error('[GetAnalysis] Error:', err.message)
    return null
  }
}

module.exports = { saveAnalysis, getAnalysisById }