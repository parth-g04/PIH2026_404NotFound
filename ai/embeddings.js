// Converts text into vector embeddings using OpenAI
// These vectors are used to find similar patents via cosine similarity

require('dotenv').config({ path: '../.env' })
const { OpenAI } = require('openai')

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// text-embedding-3-small: fast, cheap, 1536 dimensions — perfect for our use case
const EMBEDDING_MODEL = 'text-embedding-3-small'

/**
 * Generate a vector embedding for a given text string.
 *
 * @param {string} text  — The input text (title + description + claims)
 * @returns {Promise<number[]>}  — Array of 1536 floats (the embedding vector)
 */
async function generateEmbedding(text) {
  // Input validation
  if (!text || typeof text !== 'string') {
    throw new Error('generateEmbedding: text must be a non-empty string')
  }

  // OpenAI token limit ~8000 tokens — truncate safely at char level
  const truncated = text.trim().slice(0, 8000)

  try {
    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: truncated,
    })

    // Extract embedding from response
    const embedding = response.data?.[0]?.embedding

    if (!embedding || !Array.isArray(embedding)) {
      throw new Error('OpenAI returned an invalid embedding structure')
    }

    console.log(
      `[Embedding] ✓ Generated ${embedding.length}D vector` +
      ` for ${truncated.length} chars`
    )

    return embedding

  } catch (err) {
    // Give clean, actionable error messages
    if (err.status === 401) {
      throw new Error(
        'Invalid OpenAI API key. ' +
        'Get your key at https://platform.openai.com/api-keys ' +
        'and add it to your .env file as OPENAI_API_KEY'
      )
    }
    if (err.status === 429) {
      throw new Error(
        'OpenAI rate limit reached. ' +
        'Please wait 20 seconds and try again.'
      )
    }
    if (err.status === 500) {
      throw new Error('OpenAI service error. Please try again in a moment.')
    }

    // Re-throw anything else with original message
    throw new Error(`Embedding generation failed: ${err.message}`)
  }
}

/**
 * Compute cosine similarity between two embedding vectors.
 *
 * Returns a value between 0 and 1:
 *   0.0 = completely different
 *   0.5 = somewhat similar
 *   1.0 = identical
 *
 * @param {number[]} vecA
 * @param {number[]} vecB
 * @returns {number}
 */
function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB) return 0
  if (vecA.length !== vecB.length) return 0

  let dot = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < vecA.length; i++) {
    dot   += vecA[i] * vecB[i]
    normA += vecA[i] * vecA[i]
    normB += vecB[i] * vecB[i]
  }

  const denom = Math.sqrt(normA) * Math.sqrt(normB)
  if (denom === 0) return 0

  // Clamp between 0 and 1 to handle floating point edge cases
  return Math.max(0, Math.min(1, dot / denom))
}

module.exports = { generateEmbedding, cosineSimilarity }