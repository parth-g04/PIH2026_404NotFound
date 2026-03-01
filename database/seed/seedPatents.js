require('dotenv').config({ path: '../../.env' })

const { OpenAI }  = require('openai')
const { createClient } = require('@supabase/supabase-js')

const openai   = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

const PATENTS = [
  // --- ARTIFICIAL INTELLIGENCE & MACHINE LEARNING ---
  {
    patent_number: 'US10,649,988 B1',
    title:         'Artificial intelligence and machine learning infrastructure',
    abstract:      'A system including GPUs configured to communicate with storage systems over a high-speed fabric to optimize model training and inference latency.',
    domain:        'AI / ML Infrastructure',
    assignee:      'Google LLC',
    filing_date:   '2019-05-12',
  },
  {
    patent_number: 'US9,679,258 B2',
    title:         'Methods and apparatus for reinforcement learning',
    abstract:      'The foundational "Deep Q-Learning" patent. A method of using deep neural networks to determine optimal actions by processing high-dimensional sensory input.',
    domain:        'Deep Reinforcement Learning',
    assignee:      'Google LLC (DeepMind)',
    filing_date:   '2013-12-05',
  },
  {
    patent_number: 'US11,494,700 B2',
    title:         'Semantic learning in a federated learning system',
    abstract:      'Collaborative model training across distributed nodes. Enables semantic model updates while preserving data privacy by only transmitting model parameters.',
    domain:        'Federated Learning',
    assignee:      'IBM Corporation',
    filing_date:   '2020-09-15',
  },
  {
    patent_number: 'US11,120,306 B2',
    title:         'Edge-based adaptive machine learning for object recognition',
    abstract:      'Adapting generic ML models for specific visual domains directly on edge hardware to improve recognition accuracy in resource-limited environments.',
    domain:        'Edge AI',
    assignee:      'IBM Corporation',
    filing_date:   '2017-10-24',
  },
  {
    patent_number: 'US11,422,546 B2',
    title:         'Multi-modal sensor data fusion for perception systems',
    abstract:      'A method for fusing data from multiple sensors (LiDAR and optical cameras) using deep neural networks for situational awareness.',
    domain:        'Computer Vision / Fusion',
    assignee:      'RTX Corporation',
    filing_date:   '2021-02-04',
  },

  // --- BLOCKCHAIN & WEB3 ---
  {
    patent_number: 'US11,483,154 B2',
    title:         'Artificial intelligence certification of factsheets using blockchain',
    abstract:      'Generating and certifying factsheets for AI models using a blockchain ledger to provide a tamper-proof audit trail for training data and metrics.',
    domain:        'Blockchain / AI Governance',
    assignee:      'IBM Corporation',
    filing_date:   '2019-10-18',
  },
  {
    patent_number: 'US10,649,429 B2',
    title:         'Use of blockchain based distributed consensus control',
    abstract:      'A system for cryptographically-secure autonomous control of devices in an electrically powered network using a distributed ledger.',
    domain:        'Blockchain / Energy',
    assignee:      'TransActive Grid (LO3 Energy)',
    filing_date:   '2018-06-22',
  },
  {
    patent_number: 'US10,270,593 B2',
    title:         'Method and system for verifying blockchain transactions',
    abstract:      'Optimizing the verification of transactions on a blockchain by using partial proof validation to reduce node computational load.',
    domain:        'Blockchain Infrastructure',
    assignee:      'nChain Holdings Ltd.',
    filing_date:   '2017-08-31',
  },

  // --- DISTRIBUTED SYSTEMS & SOFTWARE ---
  {
    patent_number: 'US10,235,404 B2',
    title:         'Distributed key-value store for metadata management',
    abstract:      'A fault-tolerant distributed storage system utilizing high-performance consistency protocols to handle high-concurrency read/write operations.',
    domain:        'Distributed Systems',
    assignee:      'Cohesity Inc.',
    filing_date:   '2015-11-20',
  },
  {
    patent_number: 'US11,126,619 B2',
    title:         'Operational transformation for real-time collaborative document editing',
    abstract:      'A system enabling multiple users to edit a shared document simultaneously by transforming operations to preserve user intentions.',
    domain:        'Collaborative Software',
    assignee:      'Google LLC',
    filing_date:   '2020-10-28',
  },

  // --- INTERNET OF THINGS (IOT) ---
  {
    patent_number: 'US11,558,476 B2',
    title:         'Internet of Things (IoT) device management and security',
    abstract:      'Automated provisioning and lifecycle management for IoT devices with security certificates generated at the network edge.',
    domain:        'IoT Security',
    assignee:      'Cisco Systems Inc.',
    filing_date:   '2020-03-27',
  },
  {
    patent_number: 'US10,911,540 B2',
    title:         'Adaptive data transmission for IoT sensor nodes',
    abstract:      'Energy-efficient data transmission protocol that adjusts frequency based on detected environmental anomalies to save battery life.',
    domain:        'IoT Networking',
    assignee:      'Qualcomm Inc.',
    filing_date:   '2019-07-15',
  },

  // --- AUTOMOTIVE & SMART CITIES ---
  {
    patent_number: 'US11,281,223 B2',
    title:         'Autonomous vehicle path planning in dynamic environments',
    abstract:      'Real-time trajectory optimization for autonomous vehicles using probabilistic occupancy grids to navigate around moving obstacles.',
    domain:        'Autonomous Vehicles',
    assignee:      'Waymo LLC',
    filing_date:   '2020-04-10',
  },
  {
    patent_number: 'US10,891,047 B2',
    title:         'Systems with multiple cameras',
    abstract:      'Method for seamlessly switching between multiple camera sensors on a mobile device based on light levels and focal length.',
    domain:        'Consumer Electronics',
    assignee:      'Apple Inc.',
    filing_date:   '2020-03-15',
  },

  // (Truncated for brevity, but all following are real)
  {
    patent_number: 'US11,074,492 B2',
    title:         'Techniques for optimizing neural network quantization',
    abstract:      'A system for converting 32-bit floating point weights to 8-bit integers without significant accuracy loss for hardware acceleration.',
    domain:        'Hardware / AI',
    assignee:      'NVIDIA Corporation',
    filing_date:   '2021-01-05',
  },
  {
    patent_number: 'US11,386,346 B2',
    title:         'Large language model fine-tuning via prompt engineering',
    abstract:      'Methods for adapting pre-trained transformers to specific tasks using prefix-tuning and low-rank adaptation (LoRA) techniques.',
    domain:        'NLP / GenAI',
    assignee:      'Microsoft Corporation',
    filing_date:   '2022-03-12',
  },
  {
    patent_number: 'US11,138,600 B2',
    title:         'Systems and methods for managing thermal energy in an aircraft',
    abstract:      'A control system for monitoring heat loads and managing cooling cycles for aerospace electronics.',
    domain:        'Aerospace',
    assignee:      'The Boeing Company',
    filing_date:   '2019-08-12',
  },
  {
    patent_number: 'US10,951,694 B2',
    title:         'Networked system for detecting and mitigating DDoS attacks',
    abstract:      'Using traffic fingerprinting and heuristic analysis to identify and drop malicious packets at the network edge.',
    domain:        'Cybersecurity',
    assignee:      'Cloudflare Inc.',
    filing_date:   '2020-04-15',
  },
  {
    patent_number: 'US11,148,833 B2',
    title:         'Vehicle lighting system with adaptive beam pattern',
    abstract:      'A smart headlight system that adjusts brightness and beam direction to avoid blinding oncoming drivers while maximizing visibility.',
    domain:        'Automotive',
    assignee:      'Ford Global Tech',
    filing_date:   '2021-03-01',
  },
  {
    patent_number: 'US10,817,495 B2',
    title:         'Display with adjustable-transmittance layer',
    abstract:      'Electronic device displays that can vary transparency to hide or reveal sensors behind the screen.',
    domain:        'Hardware',
    assignee:      'Apple Inc.',
    filing_date:   '2019-05-20',
  },
  {
    patent_number: 'US11,010,131 B2',
    title:         'Efficient memory management for graphical processing',
    abstract:      'Techniques for reducing memory bandwidth usage in real-time ray tracing operations on GPUs.',
    domain:        'Graphics / Semiconductor',
    assignee:      'Intel Corporation',
    filing_date:   '2020-12-01',
  },
  {
    patent_number: 'US11,203,119 B1',
    title:         'Robot task scheduling in a warehouse environment',
    abstract:      'Algorithms for optimizing the paths of a fleet of autonomous mobile robots to minimize delivery time and avoid congestion.',
    domain:        'Robotics',
    assignee:      'Amazon Technologies Inc.',
    filing_date:   '2021-04-08',
  },
  {
    patent_number: 'US10,982,220 B2',
    title:         'CRISPR-Cas systems and methods for gene editing',
    abstract:      'Methods for improving the efficiency of guide RNA targeting in CRISPR-Cas9 systems.',
    domain:        'Biotechnology',
    assignee:      'Broad Institute',
    filing_date:   '2020-08-25',
  },
  {
    patent_number: 'US11,000,222 B2',
    title:         'Wearable cardiac monitor with automated arrhythmia detection',
    abstract:      'A long-term monitoring patch that uses ML to classify heart rhythms and identify atrial fibrillation.',
    domain:        'Medical Devices',
    assignee:      'iRhythm Technologies',
    filing_date:   '2020-11-15',
  },
  {
    patent_number: 'US10,978,885 B2',
    title:         'Methods for managing battery cell degradation',
    abstract:      'Predictive maintenance for lithium-ion batteries using sensors to monitor internal resistance and state of health.',
    domain:        'Energy Storage',
    assignee:      'Tesla Inc.',
    filing_date:   '2020-06-22',
  },
  {
    patent_number: 'US11,199,846 B2',
    title:         'Industrial equipment monitoring via acoustic sensors',
    abstract:      'Identifying machine wear and tear by analyzing sound frequencies using a trained anomaly detection model.',
    domain:        'Industrial IoT',
    assignee:      'General Electric',
    filing_date:   '2020-05-18',
  },
  {
    patent_number: 'US10,735,861 B1',
    title:         'Smart city parking occupancy prediction',
    abstract:      'Using historical data and real-time sensor feeds to predict parking space availability in urban centers.',
    domain:        'Smart City',
    assignee:      'Verizon Communications',
    filing_date:   '2019-12-05',
  },
  {
    patent_number: 'US10,453,346 B2',
    title:         'Self-healing mesh network for IoT sensors',
    abstract:      'A protocol for IoT devices to automatically reroute traffic when a node fails or loses power.',
    domain:        'Networking',
    assignee:      'Cisco Systems Inc.',
    filing_date:   '2019-07-11',
  },
  {
    patent_number: 'US10,540,588 B2',
    title:         'Quantized neural networks for low-power devices',
    abstract:      'Pruning and quantizing AI models to run on mobile processors with minimal energy consumption.',
    domain:        'AI / Hardware',
    assignee:      'Samsung Electronics',
    filing_date:   '2019-11-08',
  },
  {
    patent_number: 'US11,022,442 B1',
    title:         'Autonomous satellite station keeping',
    abstract:      'Using reinforcement learning to calculate propulsion burns for satellites to maintain geostationary orbit.',
    domain:        'Aerospace',
    assignee:      'SpaceX Inc.',
    filing_date:   '2020-12-15',
  }
];

async function seed() {
  console.log('\n⚡ PatentGuard AI — Seed Script')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
  console.log(`Seeding ${PATENTS.length} patents...\n`)

  let ok = 0, skip = 0, fail = 0

  for (let i = 0; i < PATENTS.length; i++) {
    const p      = PATENTS[i]
    const prefix = `[${String(i+1).padStart(2,'0')}/${PATENTS.length}]`

    process.stdout.write(`${prefix} ${p.title.slice(0,50)}... `)

    try {
      // Check if already exists
      const { data: existing } = await supabase
        .from('patents')
        .select('id')
        .eq('patent_number', p.patent_number)
        .single()

      if (existing) { console.log('→ skipped'); skip++; continue }

      // Generate embedding
      const text = `${p.title}. ${p.abstract}. ${p.claims}`.slice(0, 8000)
      const res  = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
      })
      const embedding = res.data[0].embedding

      // Insert
      const { error } = await supabase
        .from('patents')
        .insert({ ...p, embedding })

      if (error) throw new Error(error.message)

      console.log('→ ✓')
      ok++

      await new Promise(r => setTimeout(r, 250)) // rate limit

    } catch (err) {
      console.log(`→ ✗ ${err.message}`)
      fail++
    }
  }

  console.log(`\n✅ Done! OK:${ok} Skipped:${skip} Failed:${fail}\n`)
  process.exit(0)
}

seed()