
import { useState } from 'react'
import { FileText, Download, Save, Calendar, Check } from 'lucide-react'

export default function ReportBar({ result, form }) {
  const [saved,      setSaved]      = useState(false)
  const [downloaded, setDownloaded] = useState(false)

  const handleDownload = async () => {
    try {
      // Dynamically import PDF generator to keep initial bundle small
      const { generatePDFReport } = await import('../../utils/pdfGenerator')
      await generatePDFReport(result, form)
      setDownloaded(true)
      setTimeout(() => setDownloaded(false), 3000)
    } catch (e) {
      console.error('PDF generation failed:', e)
      alert('PDF generation failed. Check console for details.')
    }
  }

  const handleSave = () => {
    try {
      const existing = JSON.parse(localStorage.getItem('patentguard_analyses') || '[]')
      existing.unshift({
        id:      Date.now(),
        form,
        result,
        savedAt: new Date().toISOString(),
      })
      // Keep only last 10 analyses
      localStorage.setItem(
        'patentguard_analyses',
        JSON.stringify(existing.slice(0, 10))
      )
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e) {
      console.error('Save failed:', e)
    }
  }

  return (
    <div className="card flex flex-wrap items-center justify-between gap-6">
      {/* Info */}
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 bg-accent/10 border border-accent/20 rounded-xl
                        flex items-center justify-center flex-shrink-0">
          <FileText size={18} className="text-accent-light" />
        </div>
        <div>
          <p className="font-syne font-bold text-[15px]">
            PatentGuard Intelligence Report
          </p>
          <p className="font-mono text-[11px] text-text-faint mt-0.5">
            Full analysis · Claim map · Risk summary · Innovation roadmap
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={handleSave}
          className="btn-ghost flex items-center gap-2 px-4 py-2.5"
        >
          {saved
            ? <Check size={13} className="text-success" />
            : <Save size={13} />}
          {saved ? 'Saved!' : 'Save Analysis'}
        </button>

        <button
          onClick={handleDownload}
          className="btn-ghost flex items-center gap-2 px-4 py-2.5"
        >
          {downloaded
            ? <Check size={13} className="text-success" />
            : <Download size={13} />}
          {downloaded ? 'Downloaded!' : 'Export PDF'}
        </button>

        <button
          onClick={() => alert('IP Consultation booking — coming soon!')}
          className="btn-primary flex items-center gap-2 px-5 py-2.5 text-sm"
        >
          <Calendar size={14} />
          Book IP Consultation →
        </button>
      </div>
    </div>
  )
}