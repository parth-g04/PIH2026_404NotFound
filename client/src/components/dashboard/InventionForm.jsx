import { Zap, FlaskConical, Loader2 } from 'lucide-react'

const DOMAINS = [
  'Artificial Intelligence / ML',
  'Internet of Things',
  'Biotechnology',
  'Semiconductor / Hardware',
  'Clean Energy',
  'Medical Devices',
  'Telecommunications',
  'Robotics / Automation',
  'Software / SaaS',
  'Blockchain / Web3',
  'Space Technology',
  'Other',
]

const LOADING_STEPS = [
  'Generating semantic embeddings from your description...',
  'Searching patent database + live USPTO validation...',
  'Analyzing claim structure with GPT-4o...',
  'Computing patentability risk score...',
  'Detecting innovation gaps in prior art...',
]

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="label-mono">{label}</label>
      {children}
    </div>
  )
}

function LoadingSteps({ currentStep }) {
  return (
    <div className="mt-5 flex flex-col gap-3">
      <div className="h-0.5 bg-border rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-accent to-cyan-brand loading-bar-animate" />
      </div>
      <div className="flex flex-col gap-2 pt-1">
        {LOADING_STEPS.map((text, i) => {
          const isDone   = i < currentStep
          const isActive = i === currentStep
          return (
            <div key={i} className={`step-item ${isDone ? 'step-done' : isActive ? 'step-active' : ''}`}>
              <div className="w-5 h-5 rounded-full border border-current
                              flex items-center justify-center flex-shrink-0 text-[10px]">
                {isDone ? '✓' : isActive ? <Loader2 size={10} className="animate-spin" /> : '○'}
              </div>
              <span>{text}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function InventionForm({ form, onUpdate, onAnalyze, onDemo, status, loadStep, error }) {
  const isLoading = status === 'loading'

  return (
    <div className="card card-accent relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="section-tag mb-3">01 · INPUT</div>
          <h2 className="font-syne font-bold text-2xl">Describe Your Invention</h2>
          <p className="text-text-muted text-sm mt-1">The more detail you provide, the more accurate the analysis.</p>
        </div>
        <button onClick={onDemo} disabled={isLoading} className="btn-ghost flex items-center gap-2 px-4 py-2">
          <FlaskConical size={13} />
          Load Demo
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <Field label="Invention Title *">
          <input type="text" className="input-field"
            placeholder="e.g. AI-powered traffic signal optimizer"
            value={form.title} onChange={e => onUpdate('title', e.target.value)} disabled={isLoading} />
        </Field>

        <Field label="Technical Domain">
          <select className="input-field cursor-pointer"
            value={form.domain} onChange={e => onUpdate('domain', e.target.value)} disabled={isLoading}>
            {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </Field>

        <div className="md:col-span-2">
          <Field label="Detailed Description *">
            <textarea className="input-field h-36 resize-none"
              placeholder="Describe your invention in detail — how it works, what problem it solves, key technical components, and what makes it unique..."
              value={form.description} onChange={e => onUpdate('description', e.target.value)} disabled={isLoading} />
          </Field>
        </div>

        <Field label="Key Technical Claims">
          <input type="text" className="input-field"
            placeholder="e.g. Edge ML inference, distributed sensor fusion"
            value={form.claims} onChange={e => onUpdate('claims', e.target.value)} disabled={isLoading} />
        </Field>

        <Field label="Target Market">
          <input type="text" className="input-field"
            placeholder="e.g. Smart city infrastructure, Urban mobility"
            value={form.market} onChange={e => onUpdate('market', e.target.value)} disabled={isLoading} />
        </Field>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 px-4 py-3 bg-danger/10 border border-danger/30 rounded-lg text-danger text-sm font-mono">
          ⚠ {error}
        </div>
      )}

      {/* Submit */}
      <button onClick={onAnalyze} disabled={isLoading}
        className="btn-primary w-full flex items-center justify-center gap-3 py-4 text-base">
        {isLoading ? (
          <><Loader2 size={18} className="animate-spin" /> Analyzing — please wait...</>
        ) : (
          <><Zap size={18} /> Run Patentability Analysis</>
        )}
      </button>

      {isLoading && <LoadingSteps currentStep={loadStep} />}
    </div>
  )
}