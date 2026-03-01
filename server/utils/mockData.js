// Realistic mock response used when APIs are unavailable or in demo mode
// This ensures our demo NEVER fails
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') })

function getMockAnalysisResult(invention) {
  const title  = invention?.title  || 'AI-Powered Traffic Signal System'
  const domain = invention?.domain || 'Artificial Intelligence / ML'

  return {
    analysisId: 'demo-' + Date.now(),
    score: 74,
    metrics: {
      noveltyIndex:         78,
      claimDifferentiation: 72,
      similarityInverse:    68,
      domainClustering:     81,
      keywordDensity:       75,
    },
    heatmap: {
      abstract:    [0.22, 0.41, 0.18, 0.55, 0.30, 0.14, 0.62, 0.27, 0.19, 0.38],
      claims:      [0.35, 0.28, 0.71, 0.19, 0.44, 0.38, 0.25, 0.60, 0.33, 0.21],
      description: [0.18, 0.52, 0.29, 0.41, 0.16, 0.67, 0.23, 0.35, 0.48, 0.20],
    },
    claims: [
      {
        type:   'independent',
        text:   `A system for ${title.toLowerCase()} comprising: a distributed edge processing unit configured to execute real-time neural network inference; a multi-modal sensor fusion module for aggregating data from heterogeneous input sources; and an adaptive output controller for dynamically adjusting system parameters based on inference results.`,
        domain: domain,
      },
      {
        type:   'independent',
        text:   `A computer-implemented method for ${title.toLowerCase()}, the method comprising: receiving input data streams from a plurality of distributed sensors; processing said streams using a quantized transformer model achieving sub-10ms inference latency; generating optimized control signals; and transmitting said signals via a low-latency mesh communication protocol.`,
        domain: domain,
      },
      {
        type:   'dependent',
        text:   `The system of claim 1, wherein the edge processing unit employs a federated learning protocol enabling model updates to be shared across a network of peer nodes without transmitting raw sensor data, thereby preserving data privacy in compliance with GDPR Article 25.`,
        domain: 'Federated Learning',
      },
      {
        type:   'dependent',
        text:   `The method of claim 2, wherein the quantized transformer model is compressed using INT8 post-training quantization achieving a 4x reduction in memory footprint while maintaining less than 2% accuracy degradation relative to the full-precision baseline model.`,
        domain: 'Model Compression',
      },
      {
        type:   'dependent',
        text:   `The system of claim 1, further comprising an adversarial robustness verification module configured to detect sensor spoofing attacks using statistical anomaly detection, triggering automatic failsafe protocols when input distributions deviate beyond 3-sigma confidence bounds.`,
        domain: 'Security & Robustness',
      },
    ],
    similarPatents: [
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
        abstract:        'A federated machine learning framework enabling IoT devices to collaboratively train shared models without transmitting raw sensor data to a central server.',
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
        abstract:        'Methods for deploying quantized convolutional neural networks on resource-constrained edge hardware achieving real-time inference latency.',
        domain:          'Semiconductor / Hardware',
        assignee:        'NVIDIA Corporation',
        similarityScore: 15,
        rawSimilarity:   0.15,
      },
    ],
    innovationGaps: [
      {
        title:       'Cross-Domain Federated Optimization',
        description: 'Existing patents restrict federated learning to single-domain deployments. A privacy-preserving protocol enabling model improvement sharing across heterogeneous urban systems — traffic, parking, and transit — without raw data exposure remains entirely unclaimed in prior art.',
      },
      {
        title:       'Adversarial Sensor Robustness Layer',
        description: 'All indexed prior art assumes sensor data integrity. An integrated robustness verification module providing certifiable guarantees against GPS spoofing, camera adversarial attacks, and radar jamming — with formal safety proofs — represents a significant unclaimed technical and commercial opportunity.',
      },
      {
        title:       'Sub-5ms Quantized Edge Inference',
        description: 'Current systems either rely on cloud inference or require high-powered GPUs at the edge. A verified INT8-quantized transformer achieving sub-5ms inference on commodity ARM Cortex-A72 hardware while maintaining 96%+ of full-precision accuracy defines a clear patentable performance frontier.',
      },
    ],
    processingTimeMs: 4200,
    invention: invention || {
      title:       title,
      description: 'A comprehensive AI system for smart city optimization.',
      domain:      domain,
      claims:      'Edge ML, federated learning, sensor fusion',
      market:      'Smart Cities',
    },
  }
}

module.exports = { getMockAnalysisResult }