import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import InventionForm from '../components/dashboard/InventionForm'
import { useAnalysis } from '../hooks/useAnalysis'

export default function DashboardPage() {
  const [searchParams] = useSearchParams()
  const {
    form, updateField, loadDemo, reset,
    analyze, status, result, error, loadStep,
  } = useAnalysis()

  // Auto-load demo if ?demo=true in URL
  useEffect(() => {
    if (searchParams.get('demo') === 'true') {
      loadDemo()
    }
  }, [])

  return (
    <div className="relative z-10 pb-20">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 pt-28">
        <InventionForm
          form={form}
          onUpdate={updateField}
          onAnalyze={analyze}
          onDemo={loadDemo}
          status={status}
          loadStep={loadStep}
          error={error}
        />

        {/* Results will go here upcoming*/}
        {status === 'success' && result && (
          <div className="mt-8 card card-accent text-center py-12">
            <p className="text-6xl mb-4">✅</p>
            <p className="font-syne font-bold text-2xl text-success">
              Analysis Complete — Score: {result.score}/100
            </p>
            <p className="text-text-muted mt-2">
              Result components coming in Phase 6-7
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="mt-8 card border-danger/30 text-center py-12">
            <p className="text-2xl mb-3">⚠️</p>
            <p className="font-syne font-bold text-lg text-danger mb-2">Analysis Failed</p>
            <p className="text-text-muted text-sm mb-6">{error}</p>
            <button onClick={reset} className="btn-secondary px-6 py-2.5 text-sm">Try Again</button>
          </div>
        )}
      </div>
    </div>
  )
}