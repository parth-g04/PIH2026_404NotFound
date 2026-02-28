const supabase                          = require('./supabaseClient')
const { searchSimilarPatents }          = require('./queries/vectorSearch')
const { saveAnalysis, getAnalysisById } = require('./queries/saveAnalysis')

module.exports = {
  supabase,
  searchSimilarPatents,
  saveAnalysis,
  getAnalysisById,
}