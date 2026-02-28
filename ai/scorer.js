// Real version will built later its for backend testing

async function computeScore(invention, invEmbedding, similarPatents) {
  console.log('[Scorer STUB] Computing mock score')

  const score = 74

  const metrics = {
    noveltyIndex:         78,
    claimDifferentiation: 72,
    similarityInverse:    68,
    domainClustering:     81,
    keywordDensity:       75,
  }

  const heatmap = {
    abstract:    [0.22, 0.41, 0.18, 0.55, 0.30, 0.14, 0.62, 0.27, 0.19, 0.38],
    claims:      [0.35, 0.28, 0.71, 0.19, 0.44, 0.38, 0.25, 0.60, 0.33, 0.21],
    description: [0.18, 0.52, 0.29, 0.41, 0.16, 0.67, 0.23, 0.35, 0.48, 0.20],
  }

  return { score, metrics, heatmap }
}

module.exports = { computeScore }