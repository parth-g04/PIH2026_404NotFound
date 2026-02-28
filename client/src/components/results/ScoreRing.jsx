import { useEffect, useRef, useState } from 'react'

const RADIUS       = 60
const CIRCUMFERENCE = 2 * Math.PI * RADIUS  // ≈ 377

function getScoreColor(score) {
  if (score >= 70) return { stroke: '#10b981', text: 'text-success',  label: 'HIGHLY PATENTABLE' }
  if (score >= 50) return { stroke: '#f59e0b', text: 'text-warning',  label: 'POTENTIALLY NOVEL' }
  return             { stroke: '#ef4444', text: 'text-danger',   label: 'NEEDS DIFFERENTIATION' }
}

function getScoreDetail(score) {
  if (score >= 70) return 'Low overlap detected — strong novelty indicators'
  if (score >= 50) return 'Moderate overlap — some differentiation needed'
  return 'High overlap — significant differentiation required'
}

export default function ScoreRing({ score = 0 }) {
  const [displayed, setDisplayed] = useState(0)
  const [offset,    setOffset]    = useState(CIRCUMFERENCE)
  const animRef = useRef(null)

  const { stroke, text, label } = getScoreColor(score)

  useEffect(() => {
    // Animate the number counter
    const duration = 1800
    const start    = performance.now()

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1)
      const eased    = 1 - Math.pow(1 - progress, 3)  // ease-out cubic
      setDisplayed(Math.round(score * eased))
      if (progress < 1) animRef.current = requestAnimationFrame(tick)
    }
    animRef.current = requestAnimationFrame(tick)

    // Animate the ring — small delay so CSS transition fires after mount
    const targetOffset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE
    setTimeout(() => setOffset(targetOffset), 80)

    return () => cancelAnimationFrame(animRef.current)
  }, [score])

  return (
    <div className="card card-accent-green flex flex-col items-center justify-center
                    min-h-[280px] text-center">

      <p className="label-mono mb-6">PATENTABILITY SCORE</p>

      {/* SVG Ring */}
      <div className="relative w-[148px] h-[148px] mb-5">
        <svg
          width="148"
          height="148"
          viewBox="0 0 148 148"
          className="-rotate-90"
        >
          {/* Background track */}
          <circle
            cx="74" cy="74" r={RADIUS}
            fill="none"
            stroke="rgba(99,179,237,0.1)"
            strokeWidth="9"
          />
          {/* Animated fill */}
          <circle
            cx="74" cy="74" r={RADIUS}
            fill="none"
            stroke={stroke}
            strokeWidth="9"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            className="score-ring-fill"
            style={{ filter: `drop-shadow(0 0 8px ${stroke})` }}
          />
        </svg>

        {/* Center number */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-syne font-extrabold text-5xl leading-none ${text}`}>
            {displayed}
          </span>
          <span className="font-mono text-[10px] text-text-faint mt-1 tracking-widest">
            /100
          </span>
        </div>
      </div>

      {/* Verdict */}
      <p className={`font-syne font-bold text-base ${text}`}>{label}</p>
      <p className="font-mono text-[11px] text-text-faint mt-1.5 leading-snug max-w-[200px]">
        {getScoreDetail(score)}
      </p>
    </div>
  )
}