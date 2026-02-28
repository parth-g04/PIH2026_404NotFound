
// This stub lets the server start without OpenAI key

async function generateEmbedding(text) {
  // Returns a fake 1536-dim vector (all 0.1)
  // Replace with real OpenAI call 
  console.log('[Embedding STUB] Returning mock vector for:', text.slice(0, 50))
  return new Array(1536).fill(0.1)
}

function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0
  let dot = 0, normA = 0, normB = 0
  for (let i = 0; i < vecA.length; i++) {
    dot   += vecA[i] * vecB[i]
    normA += vecA[i] * vecA[i]
    normB += vecB[i] * vecB[i]
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB)
  return denom === 0 ? 0 : dot / denom
}

module.exports = { generateEmbedding, cosineSimilarity }