require('dotenv').config({ path: '../../.env' })

const DEMO_MODE = process.env.DEMO_MODE === 'true'

// Mock patents returned in DEMO_MODE
const MOCK_PATENTS = [
  {
    id:              'mock-1',
    patentNumber:    'US10,891,047 B2',
    title:           'Adaptive traffic signal control using deep reinforcement learning',
    abstract:        'A system for controlling traffic signals using deep reinforcement learning agents trained on real-time vehicle density data from distributed road-side sensors across a coordinated intersection network.',
    domain:          'Artificial Intelligence / ML',
    assignee:        'Siemens Mobility GmbH',
    similarityScore: 38,
    rawSimilarity:   0.38,
  },
  {
    id:              'mock-2',
    patentNumber:    'EP3,421,892 A1',
    title:           'Edge computing framework for urban mobility applications',
    abstract:        'A distributed edge computing architecture for processing mobility data at the network edge, enabling sub-millisecond decision making for urban transportation management systems.',
    domain:          'Artificial Intelligence / ML',
    assignee:        'Nokia Technologies Oy',
    similarityScore: 31,
    rawSimilarity:   0.31,
  },
  {
    id:              'mock-3',
    patentNumber:    'US11,074,492 B1',
    title:           'Federated learning system for distributed IoT sensor networks',
    abstract:        'A federated machine learning framework enabling IoT devices to collaboratively train shared models without transmitting raw sensor data to a central server, preserving data privacy.',
    domain:          'Internet of Things',
    assignee:        'Google LLC',
    similarityScore: 27,
    rawSimilarity:   0.27,
  },
  {
    id:              'mock-4',
    patentNumber:    'WO2020/185742 A1',
    title:           'Emergency vehicle preemption using V2X communication protocol',
    abstract:        'Vehicle-to-infrastructure communication protocol enabling emergency vehicles to dynamically preempt traffic signals along their route, minimizing response time.',
    domain:          'Internet of Things',
    assignee:        'Qualcomm Inc.',
    similarityScore: 19,
    rawSimilarity:   0.19,
  },
  {
    id:              'mock-5',
    patentNumber:    'US10,540,588 B2',
    title:           'Real-time object detection using edge-optimized neural networks',
    abstract:        'Methods for deploying quantized convolutional neural networks on resource-constrained edge hardware achieving real-time inference latency for computer vision applications.',
    domain:          'Semiconductor / Hardware',
    assignee:        'NVIDIA Corporation',
    similarityScore: 15,
    rawSimilarity:   0.15,
  },
]

async function searchSimilarPatents(embedding, domain = null, limit = 5) {
  // DEMO_MODE: return mock data instantly
  if (DEMO_MODE) {
    console.log('[VectorSearch] DEMO_MODE — returning mock patents')
    return MOCK_PATENTS.slice(0, limit)
  }

  // REAL: query Supabase pgvector
  try {
    const supabase = require('../supabaseClient')

    const { data, error } = await supabase.rpc('search_similar_patents', {
      query_embedding: embedding,
      match_domain:    domain || null,
      match_count:     limit,
    })

    if (error) {
      console.error('[VectorSearch] RPC error:', error.message)
      console.warn('[VectorSearch] Falling back to mock patents')
      return MOCK_PATENTS.slice(0, limit)
    }

    if (!data || data.length === 0) {
      console.warn('[VectorSearch] No results — DB may be empty, using mock')
      return MOCK_PATENTS.slice(0, limit)
    }

    console.log(`[VectorSearch] ✓ Found ${data.length} real patents`)

    return data.map(row => ({
      id:              row.id,
      patentNumber:    row.patent_number,
      title:           row.title,
      abstract:        row.abstract
        ? row.abstract.slice(0, 220) + (row.abstract.length > 220 ? '...' : '')
        : '',
      domain:          row.domain   || 'General',
      assignee:        row.assignee || 'Unknown',
      similarityScore: Math.round(row.similarity_score * 100),
      rawSimilarity:   parseFloat(row.similarity_score) || 0,
    }))

  } catch (err) {
    console.error('[VectorSearch] Error:', err.message)
    return MOCK_PATENTS.slice(0, limit)
  }
}

module.exports = { searchSimilarPatents }