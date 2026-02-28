async function saveAnalysis(data) {
  console.log('[SaveAnalysis STUB] Skipping DB save — later we  will enable this')
  // Return a fake UUID so the pipeline doesn't break
  return 'stub-' + Date.now()
}

async function getAnalysisById(id) {
  console.log('[GetAnalysis STUB] No DB yet — returning null')
  return null
}

module.exports = { saveAnalysis, getAnalysisById }