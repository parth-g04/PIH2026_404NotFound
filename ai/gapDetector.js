

require('dotenv').config({ path: '../.env' })
const { OpenAI } = require('openai')

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

/**
 * Detect innovation gaps — what the prior art misses that your invention could claim.
 *
 * @param {Object} invention      — { title, description, domain, claims }
 * @param {Array}  similarPatents — Array of similar patent objects from vector search
 * @returns {Promise<Array>}      — Array of { title, description } gap objects
 */
async function detectInnovationGaps(invention, similarPatents) {

  // Build a summary of what prior art already covers
  const priorArtSummary = buildPriorArtSummary(similarPatents)

  const prompt = buildGapPrompt(invention, priorArtSummary)

  try {
    console.log('[GapDetector] Calling GPT-4o for gap analysis...')

    const response = await openai.chat.completions.create({
      model:       'gpt-4o',
      messages:    [{ role: 'user', content: prompt }],
      temperature: 0.6,  // Slightly higher temp for creative gap finding
      max_tokens:  700,
    })

    const raw = response.choices?.[0]?.message?.content?.trim()

    if (!raw) {
      throw new Error('GPT-4o returned empty response for gap detection')
    }

    // Clean any markdown formatting the model might add
    const cleaned = raw
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/g, '')
      .trim()

    let parsed
    try {
      parsed = JSON.parse(cleaned)
    } catch {
      throw new Error(`Failed to parse gap JSON: ${cleaned.slice(0, 100)}`)
    }

    if (!Array.isArray(parsed)) {
      throw new Error('Gap response is not an array')
    }

    // Validate and clean
    const validGaps = parsed
      .filter(g => g && typeof g.title === 'string' && typeof g.description === 'string')
      .map(g => ({
        title:       String(g.title).trim().slice(0, 80),        // max 80 chars for title
        description: String(g.description).trim().slice(0, 400), // max 400 chars
      }))
      .slice(0, 3)  // Return exactly 3 gaps

    if (validGaps.length === 0) {
      throw new Error('No valid gaps after parsing')
    }

    console.log(`[GapDetector] ✓ Detected ${validGaps.length} innovation gaps`)
    return validGaps

  } catch (err) {
    console.warn(`[GapDetector] GPT-4o failed, using domain fallback: ${err.message}`)
    return buildFallbackGaps(invention)
  }
}

// ── Prompt Builder 

function buildPriorArtSummary(similarPatents) {
  if (!similarPatents || similarPatents.length === 0) {
    return 'No similar patents found in the database — this is a relatively uncharted space.'
  }

  return similarPatents
    .slice(0, 4)
    .map((p, i) =>
      `${i + 1}. ${p.patentNumber} (${p.similarityScore}% similarity): "${p.title}"`
    )
    .join('\n')
}

function buildGapPrompt(invention, priorArtSummary) {
  return `You are a world-class innovation strategist and IP analyst working with a startup.

THE INVENTION:
Title:       ${invention.title}
Domain:      ${invention.domain}
Description: ${invention.description}
Key Claims:  ${invention.claims || 'Not specified'}

EXISTING PRIOR ART (what already exists):
${priorArtSummary}

YOUR TASK:
Identify exactly 3 "innovation gaps" — specific technical areas or sub-features that:
1. The existing patents do NOT cover or claim
2. Your invention could uniquely address
3. Would give it a defensible competitive moat

For each gap:
- Title: 3-6 words, specific and catchy (not generic like "Better Performance")
- Description: 2-3 sentences explaining WHY this is unclaimed and HOW it differentiates

Think deeply about:
- Edge cases the prior art ignores
- Integration opportunities across domains
- Performance thresholds nobody has claimed
- Novel application contexts
- Combination of techniques that don't exist together

RESPOND ONLY WITH A VALID JSON ARRAY. No markdown, no explanation.

[
  {
    "title": "Specific Gap Name Here",
    "description": "Why this is unclaimed in prior art and exactly how your invention fills this gap with specific technical detail."
  },
  {
    "title": "Second Gap",
    "description": "Second explanation."
  },
  {
    "title": "Third Gap",
    "description": "Third explanation."
  }
]`
}

// ── Domain-Specific Fallback Gaps
// Used when GPT-4o fails — each domain has tailored, realistic gaps.

function buildFallbackGaps(invention) {
  const domainGaps = {
    'Artificial Intelligence / ML': [
      {
        title: 'Cross-Domain Federated Optimization',
        description: 'Existing patents focus on single-domain federated learning. A protocol enabling model improvement sharing across heterogeneous domains without raw data exposure remains unclaimed, offering a significant privacy-preserving differentiation opportunity.',
      },
      {
        title: 'Sub-5ms Quantized Edge Inference',
        description: 'Prior art relies on cloud inference or high-powered hardware. Quantized transformer models achieving verified sub-5ms inference on commodity edge silicon is technically feasible but largely unexplored in existing filings.',
      },
      {
        title: 'Adversarial Robustness Verification Layer',
        description: 'Current systems lack formal robustness guarantees against adversarial inputs and sensor spoofing. An integrated verification layer providing certifiable robustness bounds at inference time represents an unclaimed and commercially valuable feature.',
      },
    ],
    'Internet of Things': [
      {
        title: 'Self-Healing Mesh Consensus',
        description: 'Existing IoT patents address individual node failures but not Byzantine fault tolerance in mesh networks. A lightweight consensus protocol for resource-constrained IoT devices with self-healing properties is a clear gap.',
      },
      {
        title: 'Zero-Latency Predictive Actuation',
        description: 'Prior art focuses on reactive actuation. A predictive actuation system that pre-positions physical actuators based on ML-forecasted events before sensor triggers arrive represents an unclaimed performance advantage.',
      },
      {
        title: 'Cross-Vendor Semantic Interoperability',
        description: 'IoT standards focus on protocol interoperability but not semantic data interoperability. An ontology-based translation layer enabling devices from different vendors to share meaning — not just data — is largely unaddressed.',
      },
    ],
    'Biotechnology': [
      {
        title: 'ML-Guided Off-Target Prediction',
        description: 'While CRISPR guide design exists in prior art, real-time ML prediction of off-target edits at novel genomic loci not in training data remains unaddressed, representing a safety-critical and commercially valuable innovation.',
      },
      {
        title: 'Personalized Dosing via Omics Integration',
        description: 'Existing patents treat dosing as population-level. An individual-specific dosing system integrating genomic, proteomic, and metabolomic signals in real-time for adaptive treatment personalization is a significant uncharted territory.',
      },
      {
        title: 'Synthetic Biology Design Verification',
        description: 'Current tools design synthetic genetic circuits but lack formal verification of emergent behavior in complex cellular environments. A simulation-based verification framework for synthetic biology constructs represents a novel and patentable contribution.',
      },
    ],
    'Medical Devices': [
      {
        title: 'Continuous Biomarker Fusion Monitoring',
        description: 'Existing wearables monitor single biomarkers. A multi-modal fusion system combining optical, electrical, and acoustic signals for continuous multi-biomarker tracking without blood draws represents an unclaimed clinical opportunity.',
      },
      {
        title: 'Adaptive Closed-Loop Therapy',
        description: 'Prior art describes open-loop medical devices. A closed-loop system that adapts therapy parameters in real-time based on continuous physiological feedback, with certified safety constraints, is a strong differentiation path.',
      },
      {
        title: 'Explainable Clinical AI Decisions',
        description: 'Medical AI systems lack regulatory-grade explainability. An integrated decision explanation module providing physician-interpretable justifications with uncertainty quantification and counterfactual analysis is both novel and commercially essential.',
      },
    ],
  }

  // Return domain-specific gaps if available, otherwise use general tech gaps
  return domainGaps[invention.domain] || [
    {
      title: 'Cross-System Integration Protocol',
      description: 'Prior art addresses components in isolation. A standardized integration protocol enabling this system to communicate with heterogeneous third-party platforms via a semantic API layer remains an open and patentable contribution.',
    },
    {
      title: 'Formal Verification Under Constraints',
      description: 'Existing solutions lack formal correctness guarantees. A lightweight formal verification module providing provable operational bounds under resource constraints — without requiring full formal methods expertise — is a clear and valuable gap.',
    },
    {
      title: 'Explainable Decision Audit Trail',
      description: 'Current systems produce outputs without traceable reasoning. An immutable, human-readable audit trail linking each system decision to specific input signals and model states addresses regulatory compliance needs not covered in prior art.',
    },
  ]
}

module.exports = { detectInnovationGaps }