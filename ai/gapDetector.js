
// Real version built later

async function detectInnovationGaps(invention, similarPatents) {
  console.log('[GapDetector STUB] Returning mock gaps')

  return [
    {
      title:       'Cross-Domain Federated Optimization',
      description: 'Existing patents restrict federated learning to single-domain deployments. A privacy-preserving protocol enabling model sharing across heterogeneous urban systems — traffic, parking, and transit — without raw data exposure remains entirely unclaimed in prior art.',
    },
    {
      title:       'Adversarial Sensor Robustness Layer',
      description: 'All indexed prior art assumes sensor data integrity. An integrated robustness verification module providing certifiable guarantees against GPS spoofing and camera adversarial attacks — with formal safety proofs — is a significant unclaimed technical opportunity.',
    },
    {
      title:       'Sub-5ms Quantized Edge Inference',
      description: 'Current systems rely on cloud inference or high-powered GPUs. A verified INT8-quantized transformer achieving sub-5ms inference on commodity ARM hardware while maintaining 96%+ of full-precision accuracy defines a clear patentable performance frontier.',
    },
  ]
}

module.exports = { detectInnovationGaps }