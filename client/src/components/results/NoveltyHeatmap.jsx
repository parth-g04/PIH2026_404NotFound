import { useEffect, useState } from 'react'

// value 0 = novel (green), value 1 = similar to prior art (red)
function getHeatColor(value) {
  if (value < 0.33) return { bg: '#10b981', opacity: 0.35 + value * 0.7 }
  if (value < 0.66) return { bg: '#f59e0b', opacity: 0.45 + value * 0.5 }
  return               { bg: '#ef4444', opacity: 0.45 + value * 0.5 }
}

function HeatmapRow({ label, cells, revealed }) {
  return (
    <div>
      <p className="font-mono text-[10px] text-text-faint uppercase tracking-widest mb-2">
        {label}
      </p>
      <div className="grid grid-cols-10 gap-1 mb-4">
        {cells.map((val, i) => {
          const { bg, opacity } = getHeatColor(val)
          return (
            <div
              key={i}
              className="heatmap-cell"
              title={`Similarity: ${(val * 100).toFixed(0)}%`}
              style={
                revealed
                  ? {
                      background: bg,
                      opacity,
                      transition: `background 0.6s ease ${i * 55}ms,
                                   opacity    0.6s ease ${i * 55}ms`,
                    }
                  : {}
              }
            />
          )
        })}
      </div>
    </div>
  )
}

export default function NoveltyHeatmap({ heatmap = null }) {
  const [revealed, setRevealed] = useState(false)

  // Fallback random data if nothing from API yet
  const data = heatmap || {
    abstract:    Array.from({ length: 10 }, () => Math.random()),
    claims:      Array.from({ length: 10 }, () => Math.random()),
    description: Array.from({ length: 10 }, () => Math.random()),
  }

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 300)
    return () => clearTimeout(t)
  }, [heatmap])

  return (
    <div className="card h-full">
      {/* Header */}
      <div className="mb-5">
        <h3 className="font-syne font-bold text-[15px] flex items-center gap-2">
          🗺 Novelty Heatmap
          <span className="font-mono text-[10px] text-accent-light
                           bg-accent/10 border border-accent/20
                           px-2 py-0.5 rounded tracking-wide">
            SECTION ANALYSIS
          </span>
        </h3>
        <p className="font-mono text-[11px] text-text-faint mt-1.5">
          Green = novel · Red = high similarity to prior art
        </p>
      </div>

      {/* Rows */}
      <HeatmapRow label="Abstract"    cells={data.abstract}    revealed={revealed} />
      <HeatmapRow label="Claims"      cells={data.claims}      revealed={revealed} />
      <HeatmapRow label="Description" cells={data.description} revealed={revealed} />

      {/* Legend */}
      <div className="flex items-center justify-between mt-2">
        <span className="font-mono text-[10px] text-text-faint">NOVEL</span>
        <div
          className="flex-1 mx-3 h-1 rounded-full"
          style={{ background: 'linear-gradient(90deg, #10b981, #f59e0b, #ef4444)' }}
        />
        <span className="font-mono text-[10px] text-text-faint">SIMILAR</span>
      </div>
    </div>
  )
}