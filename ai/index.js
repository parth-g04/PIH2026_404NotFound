const { generateEmbedding, cosineSimilarity } = require('./embeddings')
const { computeScore }          = require('./scorer')
const { analyzeClaims }         = require('./claimAnalyzer')
const { detectInnovationGaps }  = require('./gapDetector')

module.exports = {
  generateEmbedding,
  cosineSimilarity,
  computeScore,
  analyzeClaims,
  detectInnovationGaps,
}