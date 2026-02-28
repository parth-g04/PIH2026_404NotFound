// Computes a 0-100 patentability score using 5 heuristic signals.
// Also generates the novelty heatmap data for the frontend visualization.

/**
 * Main scoring function.
 *
 * @param {Object}   invention      — { title, description, domain, claims, market }
 * @param {number[]} invEmbedding   — 1536D embedding vector of the invention text
 * @param {Array}    similarPatents — Patents returned from vector search
 *
 * @returns {{ score: number, metrics: Object, heatmap: Object }}
 */
async function computeScore(invention, invEmbedding, similarPatents) {

  // ── Signal 1: Novelty Index (35% weight) 
  // Based on highest similarity found in prior art.
  // Logic: if best match is 90% similar → novelty is only 10.
  //        if best match is 10% similar → novelty is 90.

  const maxSimilarity = similarPatents.length > 0
    ? Math.max(...similarPatents.map(p => p.rawSimilarity || p.similarityScore / 100))
    : 0.10  // No patents found → assume high novelty

  const noveltyIndex = Math.round((1 - maxSimilarity) * 100)

  // ── Signal 2: Claim Differentiation (20% weight)
  // How technically specific and unique are the stated claims?
  // Heuristic: count distinct technical keywords in title + claims + description.

  const allText        = `${invention.title} ${invention.claims} ${invention.description}`
  const techKeywords   = extractTechKeywords(allText)
  // Scale: 0 keywords → 40 score, 20+ keywords → 88 score (capped)
  const claimDiff      = Math.round(Math.min(40 + techKeywords.size * 2.4, 88))

  // ── Signal 3: Similarity Inverse (20% weight) 
  // Average similarity across ALL found patents, then invert.
  // Low average → invention is broadly dissimilar → good novelty.

  const avgSimilarity = similarPatents.length > 0
    ? similarPatents.reduce(
        (sum, p) => sum + (p.rawSimilarity || p.similarityScore / 100),
        0
      ) / similarPatents.length
    : 0.10  // No patents found → treat as low similarity

  const similarityInverse = Math.round((1 - avgSimilarity) * 100)

  // ── Signal 4: Domain Clustering (15% weight)
  // Are similar patents spread across many domains, or all in the same niche?
  // Spread across many domains → invention sits in a sparse cluster → more novel.

  const domainSet     = new Set(similarPatents.map(p => p.domain || 'Unknown'))
  const uniqueDomains = domainSet.size
  const totalPatents  = Math.max(similarPatents.length, 1)
  // Diversity ratio: 0 to 1, scale to 50-95 range
  const domainCluster = Math.round(50 + (uniqueDomains / totalPatents) * 45)

  // ── Signal 5: Keyword Density (10% weight)
  // How many domain-specific technical terms appear in the invention text?
  // More specialized vocabulary → more technically differentiated.

  const domainTermCount = countDomainTerms(allText, invention.domain)
  // Scale: 0 terms → 50, 16+ terms → 90 (capped)
  const keywordDensity  = Math.round(Math.min(50 + domainTermCount * 2.5, 90))

  // ── Weighted Composite Score 
  const raw = (
    noveltyIndex       * 0.35 +
    claimDiff          * 0.20 +
    similarityInverse  * 0.20 +
    domainCluster      * 0.15 +
    keywordDensity     * 0.10
  )

  // Clamp: never show 0 or 100 — those are too absolute for a heuristic system
  const score = Math.max(8, Math.min(93, Math.round(raw)))

  // ── Build Metrics Object

  const metrics = {
    noveltyIndex:         clamp(noveltyIndex),
    claimDifferentiation: clamp(claimDiff),
    similarityInverse:    clamp(similarityInverse),
    domainClustering:     clamp(domainCluster),
    keywordDensity:       clamp(keywordDensity),
  }

  // ── Build Heatmap Data 
  // 10 cells per section (Abstract / Claims / Description).
  // Each cell represents similarity intensity — 0 = novel, 1 = similar.

  const topSimilarity = similarPatents[0]?.rawSimilarity || 0.2

  const heatmap = {
    abstract:    buildHeatmapRow(invention.title,       topSimilarity, 0),
    claims:      buildHeatmapRow(invention.claims,      topSimilarity, 1),
    description: buildHeatmapRow(invention.description, topSimilarity, 2),
  }

  console.log(
    `[Scorer] Score: ${score}/100 | ` +
    `Novelty: ${noveltyIndex} | ` +
    `Claims: ${claimDiff} | ` +
    `Inv: ${similarityInverse} | ` +
    `Domain: ${domainCluster} | ` +
    `KW: ${keywordDensity}`
  )

  return { score, metrics, heatmap }
}

// ── Helper Functions

/**
 * Extract unique technical keywords from text.
 * Filters out short words and common patent boilerplate.
 */
function extractTechKeywords(text) {
  const stopWords = new Set([
    'method', 'system', 'device', 'using', 'wherein', 'comprising',
    'apparatus', 'process', 'means', 'based', 'further', 'least',
    'first', 'second', 'third', 'least', 'provide', 'include',
  ])

  return new Set(
    text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')  // remove punctuation
      .split(/\s+/)
      .filter(word =>
        word.length > 5 &&          // meaningful length
        !stopWords.has(word) &&     // not boilerplate
        isNaN(word)                 // not a number
      )
  )
}

/**
 * Count domain-specific technical terms in the text.
 * Each domain has a vocabulary of specialized terms.
 */
function countDomainTerms(text, domain) {
  const lower = text.toLowerCase()

  const vocabularies = {
    'Artificial Intelligence / ML': [
      'neural', 'model', 'inference', 'training', 'embedding', 'transformer',
      'gradient', 'classification', 'reinforcement', 'federated', 'attention',
      'convolutional', 'recurrent', 'encoder', 'decoder', 'latent', 'activation',
    ],
    'Internet of Things': [
      'sensor', 'mqtt', 'gateway', 'firmware', 'protocol', 'actuator',
      'mesh', 'zigbee', 'microcontroller', 'telemetry', 'payload', 'broker',
    ],
    'Biotechnology': [
      'protein', 'enzyme', 'genome', 'crispr', 'antibody', 'molecular',
      'cellular', 'peptide', 'sequence', 'nucleotide', 'expression', 'vector',
    ],
    'Medical Devices': [
      'diagnostic', 'implant', 'catheter', 'biomarker', 'wearable', 'biosensor',
      'electrode', 'spectroscopy', 'ultrasound', 'endoscope', 'ablation', 'stent',
    ],
    'Clean Energy': [
      'photovoltaic', 'turbine', 'electrolysis', 'battery', 'storage', 'inverter',
      'capacitor', 'electrochemical', 'thermal', 'renewable', 'efficiency', 'grid',
    ],
    'Semiconductor / Hardware': [
      'transistor', 'photolithography', 'doping', 'substrate', 'oxide', 'silicon',
      'memory', 'register', 'pipeline', 'cache', 'arithmetic', 'neuromorphic',
    ],
    'Robotics / Automation': [
      'actuator', 'servo', 'kinematic', 'trajectory', 'localization', 'mapping',
      'gripper', 'lidar', 'stereo', 'odometry', 'torque', 'perception',
    ],
    'Software / SaaS': [
      'microservice', 'distributed', 'consensus', 'sharding', 'replication',
      'container', 'orchestration', 'latency', 'throughput', 'serialization',
    ],
    'Telecommunications': [
      'beamforming', 'spectrum', 'modulation', 'multiplexing', 'antenna',
      'interference', 'handover', 'bandwidth', 'latency', 'throughput',
    ],
    'Blockchain / Web3': [
      'consensus', 'cryptographic', 'merkle', 'validator', 'proof', 'ledger',
      'transaction', 'contract', 'hash', 'signature', 'nonce', 'byzantine',
    ],
    'Space Technology': [
      'orbital', 'propulsion', 'telemetry', 'navigation', 'attitude', 'thruster',
      'reentry', 'satellite', 'payload', 'trajectory', 'launch', 'constellation',
    ],
  }

  const terms = vocabularies[domain] || vocabularies['Software / SaaS']
  return terms.filter(term => lower.includes(term)).length
}

/**
 * Generate a 10-cell heatmap row for one section of the patent.
 * Each cell is a 0-1 float representing similarity intensity.
 *
 * @param {string} text         — Section text (used to vary the pattern)
 * @param {number} baseSimilar  — Base similarity from top matching patent (0-1)
 * @param {number} seed         — Different seed per row for visual variety
 * @returns {number[]}          — Array of 10 floats
 */
function buildHeatmapRow(text = '', baseSimilar = 0.2, seed = 0) {
  return Array.from({ length: 10 }, (_, i) => {
    // Use text length + position + seed for deterministic variation
    const variation = Math.sin((i + seed * 3) * 1.7 + (text.length % 10)) * 0.18
    const raw = baseSimilar + variation
    return Math.max(0.02, Math.min(0.98, raw))
  })
}

/** Clamp a metric value between 5 and 95 */
function clamp(val) {
  return Math.max(5, Math.min(95, Math.round(val)))
}

module.exports = { computeScore }