

import { useEffect }               from 'react'
import { useSearchParams }         from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

import Navbar         from '../components/layout/Navbar'
import InventionForm  from '../components/dashboard/InventionForm'
import ScoreRing      from '../components/results/ScoreRing'
import MetricsCard    from '../components/results/MetricsCard'
import NoveltyHeatmap from '../components/results/NoveltyHeatmap'
import ClaimAnalyzer  from '../components/results/ClaimAnalyzer'
import SimilarPatents from '../components/results/SimilarPatents'
import InnovationGaps from '../components/results/InnovationGaps'
import ReportBar      from '../components/results/ReportBar'
import { useAnalysis } from '../hooks/useAnalysis'

export default function DashboardPage() {
  const [searchParams] = useSearchParams()
  const {
    form, updateField, loadDemo, reset,
    analyze, status, result, error, loadStep,
  } = useAnalysis()


  useEffect(() => {
    if (searchParams.get('demo') === 'true') {
      loadDemo()   
    }
  }, []) 

  const showResults = status === 'success' && result

  return (
    <div className="relative z-10 pb-24">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 pt-28">

        {/* ── Input Form ── */}
        <InventionForm
          form={form}
          onUpdate={updateField}
          onAnalyze={analyze}
          onDemo={loadDemo}
          status={status}
          loadStep={loadStep}
          error={error}
        />

        {/* ── Results ── */}
        <AnimatePresence>
          {showResults && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="mt-10 flex flex-col gap-6"
            >
              {/* Results header */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="section-tag">02 · RESULTS</div>
                <h2 className="font-syne font-bold text-2xl">Analysis Complete</h2>
                <span className="font-mono text-xs text-success
                                 bg-success/10 border border-success/20
                                 px-2.5 py-1 rounded">
                  ✓ DONE IN {result.processingTimeMs}ms
                </span>
              </div>

              {/* Row 1: Score + Metrics */}
              <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
                <ScoreRing score={result.score} />
                <MetricsCard metrics={result.metrics} />
              </div>

              {/* Row 2: Heatmap + Claims */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <NoveltyHeatmap heatmap={result.heatmap} />
                <ClaimAnalyzer  claims={result.claims}  />
              </div>

              {/* Row 3: Similar Patents */}
              <SimilarPatents patents={result.similarPatents} />

              {/* Row 4: Innovation Gaps */}
              <InnovationGaps gaps={result.innovationGaps} />

              {/* Row 5: Report Bar */}
              <ReportBar result={result} form={form} />

              {/* Reset */}
              <div className="flex justify-center pt-4">
                <button onClick={reset} className="btn-secondary px-8 py-3 text-sm">
                  ← Analyze Another Invention
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Error State ── */}
        <AnimatePresence>
          {status === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-8 card border-danger/30 text-center py-14"
            >
              <p className="text-4xl mb-4">⚠️</p>
              <p className="font-syne font-bold text-xl text-danger mb-2">
                Analysis Failed
              </p>
              <p className="text-text-muted text-sm mb-3 max-w-md mx-auto">
                {error}
              </p>

              {/* ── Phase 8 Helper Message ── */}
              {error?.includes('500') || error?.includes('Network') ? (
                <div className="mb-8 mx-auto max-w-md px-4 py-3
                                bg-accent/10 border border-accent/20 rounded-lg">
                  <p className="font-mono text-xs text-accent-light">
                    ℹ️ Backend not running yet
                  </p>
                </div>
              ) : (
                <div className="mb-8" />
              )}

              <button onClick={reset} className="btn-secondary px-8 py-3 text-sm">
                Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}