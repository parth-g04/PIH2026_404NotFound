
async function searchSimilarPatents(embedding, domain = null, limit = 5) {
  console.log('[VectorSearch STUB] Returning mock patents, domain:', domain)

  // Return realistic mock patents so the full pipeline works
  return [
    {
      id:              'mock-1',
      patentNumber:    'US10,891,047 B2',
      title:           'Adaptive traffic signal control using deep reinforcement learning',
      abstract:        'A system for controlling traffic signals using deep reinforcement learning agents trained on real-time vehicle density data from distributed road-side sensors.',
      domain:          'Artificial Intelligence / ML',
      assignee:        'Siemens Mobility GmbH',
      similarityScore: 38,
      rawSimilarity:   0.38,
    },
    {
      id:              'mock-2',
      patentNumber:    'EP3,421,892 A1',
      title:           'Edge computing framework for urban mobility applications',
      abstract:        'A distributed edge computing architecture for processing mobility data at the network edge, enabling sub-millisecond decision making for urban transportation.',
      domain:          'Artificial Intelligence / ML',
      assignee:        'Nokia Technologies Oy',
      similarityScore: 31,
      rawSimilarity:   0.31,
    },
    {
      id:              'mock-3',
      patentNumber:    'US11,074,492 B1',
      title:           'Federated learning system for distributed IoT sensor networks',
      abstract:        'A federated machine learning framework enabling IoT devices to collaboratively train models without transmitting raw sensor data to a central server.',
      domain:          'Internet of Things',
      assignee:        'Google LLC',
      similarityScore: 27,
      rawSimilarity:   0.27,
    },
    {
      id:              'mock-4',
      patentNumber:    'WO2020/185742 A1',
      title:           'Emergency vehicle preemption using V2X communication protocol',
      abstract:        'Vehicle-to-infrastructure communication protocol enabling emergency vehicles to dynamically preempt traffic signals along their route.',
      domain:          'Internet of Things',
      assignee:        'Qualcomm Inc.',
      similarityScore: 19,
      rawSimilarity:   0.19,
    },
    {
      id:              'mock-5',
      patentNumber:    'US10,540,588 B2',
      title:           'Real-time object detection using edge-optimized neural networks',
      abstract:        'Methods for deploying quantized neural networks on resource-constrained edge hardware achieving real-time inference without cloud dependency.',
      domain:          'Semiconductor / Hardware',
      assignee:        'NVIDIA Corporation',
      similarityScore: 15,
      rawSimilarity:   0.15,
    },
  ]
}

module.exports = { searchSimilarPatents }