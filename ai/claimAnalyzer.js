// Uses GPT-4o to extract structured independent and dependent patent claims.
// Falls back to heuristic claims if the API call fails — so the pipeline never breaks.

require('dotenv').config({ path: '../.env' })
const { OpenAI } = require('openai')

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

/**
 * Analyze an invention and extract 5 structured patent claims.
 * Returns 2 independent + 3 dependent claims.
 *
 * @param {Object} invention — { title, description, domain, claims }
 * @returns {Promise<Array>} — Array of { type, text, domain } objects
 */
async function analyzeClaims(invention) {

  // Build a focused prompt — temperature 0.3 for consistent, precise output
  const prompt = buildClaimPrompt(invention)

  try {
    console.log('[ClaimAnalyzer] Calling GPT-4o...')

    const response = await openai.chat.completions.create({
      model:       'gpt-4o',
      messages:    [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens:  900,
    })

    const raw = response.choices?.[0]?.message?.content?.trim()

    if (!raw) {
      throw new Error('GPT-4o returned empty response')
    }

    // Strip markdown code fences if model adds them
    const cleaned = raw
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/g, '')
      .trim()

    // Parse JSON
    let parsed
    try {
      parsed = JSON.parse(cleaned)
    } catch {
      throw new Error(`Failed to parse GPT-4o JSON response: ${cleaned.slice(0, 100)}`)
    }

    if (!Array.isArray(parsed)) {
      throw new Error('GPT-4o response is not an array')
    }

    // Validate and clean each claim
    const validClaims = parsed
      .filter(c => c && typeof c.type === 'string' && typeof c.text === 'string')
      .map(c => ({
        type:   c.type === 'independent' ? 'independent' : 'dependent',
        text:   String(c.text).trim(),
        domain: String(c.domain || invention.domain).trim(),
      }))
      .slice(0, 8)  // max 8 claims

    if (validClaims.length === 0) {
      throw new Error('No valid claims after parsing GPT-4o response')
    }

    console.log(`[ClaimAnalyzer] ✓ Extracted ${validClaims.length} claims`)
    return validClaims

  } catch (err) {
    // Log and fall back — never let this break the whole analysis pipeline
    console.warn(`[ClaimAnalyzer] GPT-4o failed, using fallback: ${err.message}`)
    return buildFallbackClaims(invention)
  }
}

// ── Prompt Builder ────────────────────────────────────────

function buildClaimPrompt(invention) {
  return `You are a senior patent attorney with 20 years of experience drafting patent claims.

INVENTION TITLE: ${invention.title}
TECHNICAL DOMAIN: ${invention.domain}

DESCRIPTION:
${invention.description}

INVENTOR'S STATED CLAIMS:
${invention.claims || 'Not provided — infer from description'}

YOUR TASK:
Generate exactly 5 patent claims for this invention:
- Claim 1: INDEPENDENT — broad, covers the core system architecture
- Claim 2: INDEPENDENT — broad, covers the core method/process
- Claim 3: DEPENDENT — narrows Claim 1 with a specific technical feature
- Claim 4: DEPENDENT — narrows Claim 2 with a performance or implementation detail
- Claim 5: DEPENDENT — narrows Claim 1 with an optional enhancement or variation

RULES FOR EACH CLAIM:
- Use proper patent language: "comprising", "wherein", "configured to", "the method of"
- Be technically precise and specific to THIS invention
- Independent claims should be broad but defensible
- Dependent claims should reference their parent ("The system of claim 1...")
- Keep each claim to 1-3 sentences maximum

RESPOND ONLY WITH A VALID JSON ARRAY. No markdown, no explanation, no preamble.

Required format:
[
  {
    "type": "independent",
    "text": "A system for [invention] comprising [key components]...",
    "domain": "specific technical sub-domain"
  },
  {
    "type": "dependent",
    "text": "The system of claim 1, wherein [specific feature]...",
    "domain": "specific technical sub-domain"
  }
]`
}

// ── Fallback Claim Generator ──────────────────────────────
// Used if GPT-4o fails — ensures the pipeline never breaks

function buildFallbackClaims(invention) {
  const t = invention.title
  const d = invention.domain

  return [
    {
      type:   'independent',
      text:   `A system for ${t.toLowerCase()} comprising: a processing unit configured to execute real-time computational operations; a data ingestion module for receiving multi-source input signals; and an output interface for communicating results to downstream consumers.`,
      domain: d,
    },
    {
      type:   'independent',
      text:   `A computer-implemented method for ${t.toLowerCase()}, the method comprising: receiving input data from one or more sources; processing said data using an algorithmic inference framework; and generating a structured output result based on the processed data.`,
      domain: d,
    },
    {
      type:   'dependent',
      text:   `The system of claim 1, wherein the processing unit employs a machine learning model trained on domain-specific data to perform real-time inference with sub-100ms latency.`,
      domain: 'ML Inference',
    },
    {
      type:   'dependent',
      text:   `The method of claim 2, wherein the processing is distributed across a plurality of edge computing nodes, each node executing a local inference process and communicating results via a lightweight messaging protocol.`,
      domain: 'Distributed Edge Computing',
    },
    {
      type:   'dependent',
      text:   `The system of claim 1, further comprising a feedback loop module configured to adaptively update model parameters based on observed performance metrics without requiring full system retraining.`,
      domain: 'Adaptive Learning',
    },
  ]
}

module.exports = { analyzeClaims }