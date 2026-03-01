import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import { FileText, Trash2, ExternalLink, Clock } from 'lucide-react'

export default function ReportPage() {
  const [analyses, setAnalyses] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('patentguard_analyses') || '[]')
      setAnalyses(saved)
    } catch {
      setAnalyses([])
    }
  }, [])

  const deleteAnalysis = (id) => {
    const updated = analyses.filter(a => a.id !== id)
    setAnalyses(updated)
    localStorage.setItem('patentguard_analyses', JSON.stringify(updated))
  }

  return (
    <div className="relative z-10 pb-20">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 pt-28">

        <div className="mb-8">
          <div className="section-tag mb-3">SAVED REPORTS</div>
          <h1 className="font-syne font-extrabold text-3xl">Your Analysis History</h1>
          <p className="text-text-muted mt-2">
            {analyses.length === 0
              ? 'No saved analyses yet.'
              : `${analyses.length} saved analysis${analyses.length > 1 ? 'es' : ''}`}
          </p>
        </div>

        {analyses.length === 0 ? (
          <div className="card card-accent text-center py-16">
            <FileText size={40} className="text-text-faint mx-auto mb-4" />
            <p className="font-syne font-bold text-xl mb-2">No saved reports yet</p>
            <p className="text-text-muted mb-8">
              Run an analysis and click "Save Analysis" to see it here.
            </p>
            <button
              onClick={() => navigate('/analyze')}
              className="btn-primary px-8 py-3 text-sm"
            >
              Start Analysis →
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {analyses.map(analysis => (
              <div key={analysis.id}
                className="card flex items-center justify-between gap-6">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 bg-accent/10 border border-accent/20
                                  rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText size={18} className="text-accent-light" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-syne font-bold text-base truncate">
                      {analysis.form?.title || 'Untitled'}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="font-mono text-xs text-success">
                        Score: {analysis.result?.score}/100
                      </span>
                      <span className="font-mono text-xs text-text-faint flex items-center gap-1">
                        <Clock size={10} />
                        {new Date(analysis.savedAt).toLocaleDateString('en-IN')}
                      </span>
                      <span className="font-mono text-xs text-accent-light">
                        {analysis.form?.domain}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate('/analyze')}
                    className="btn-ghost px-3 py-2 flex items-center gap-1.5"
                  >
                    <ExternalLink size={12} />
                    View
                  </button>
                  <button
                    onClick={() => deleteAnalysis(analysis.id)}
                    className="p-2 text-text-faint hover:text-danger
                               transition-colors rounded-lg hover:bg-danger/10"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}