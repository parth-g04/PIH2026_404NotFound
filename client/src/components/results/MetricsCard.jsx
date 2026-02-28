
import { useEffect, useState } from 'react'

const METRIC_CONFIG = [
  {
    key:      'noveltyIndex',
    label:    'Novelty Index',
    gradient: 'from-emerald-500 to-emerald-400',
    color:    'text-emerald-400',
  },
  {
    key:      'claimDifferentiation',
    label:    'Claim Differentiation',
    gradient: 'from-blue-500 to-blue-400',
    color:    'text-blue-400',
  },
  {
    key:      'similarityInverse',
    label:    'Similarity Inverse',
    gradient: 'from-amber-500 to-amber-400',
    color:    'text-amber-400',
  },
  {
    key:      'domainClustering',
    label:    'Domain Clustering',
    gradient: 'from-violet-500 to-violet-400',
    color:    'text-violet-400',
  },
  {
    key:      'keywordDensity',
    label:    'Keyword Density',
    gradient: 'from-cyan-500 to-cyan-400',
    color:    'text-cyan-400',
  },
]

function MetricRow({ label, value, gradient, color, index }) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    // Staggered bar animation
    const t = setTimeout(() => setWidth(value), 200 + index * 150)
    return () => clearTimeout(t)
  }, [value, index])

  return (
    <div className="flex items-center gap-4">
      <span className="font-mono text-[11px] text-text-faint uppercase
                       tracking-wide w-44 flex-shrink-0">
        {label}
      </span>

      <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${gradient}
                      transition-all duration-[1400ms] ease-out`}
          style={{ width: `${width}%` }}
        />
      </div>

      <span className={`font-mono text-sm font-medium w-8 text-right ${color}`}>
        {value}
      </span>
    </div>
  )
}

export default function MetricsCard({ metrics = {} }) {
  return (
    <div className="card h-full">
      <h3 className="font-syne font-bold text-base text-text-muted mb-6">
        Scoring Breakdown
      </h3>

      <div className="flex flex-col gap-5">
        {METRIC_CONFIG.map(({ key, label, gradient, color }, i) => (
          <MetricRow
            key={key}
            label={label}
            value={metrics[key] ?? 0}
            gradient={gradient}
            color={color}
            index={i}
          />
        ))}
      </div>
    </div>
  )
}