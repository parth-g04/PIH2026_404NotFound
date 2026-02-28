
import { motion } from 'framer-motion'

function ClaimBadge({ type }) {
  const isIndependent = type === 'independent'
  return (
    <span
      className={`font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded
        ${isIndependent
          ? 'text-cyan-brand bg-cyan-brand/10 border border-cyan-brand/20'
          : 'text-accent-light bg-accent/10 border border-accent/20'
        }`}
    >
      {type} claim
    </span>
  )
}

export default function ClaimAnalyzer({ claims = [] }) {
  return (
    <div className="card h-full">
      <h3 className="font-syne font-bold text-[15px] flex items-center gap-2 mb-5">
        🔍 Claim Structure Analysis
        <span className="font-mono text-[10px] text-accent-light
                         bg-accent/10 border border-accent/20
                         px-2 py-0.5 rounded tracking-wide">
          LLM EXTRACTED
        </span>
      </h3>

      {claims.length === 0 ? (
        <p className="text-text-faint text-sm font-mono">No claims extracted.</p>
      ) : (
        <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-1">
          {claims.map((claim, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-bg-secondary border border-border rounded-xl p-4"
            >
              <div className="flex items-center gap-2 mb-2.5">
                <ClaimBadge type={claim.type} />
                <span className="font-mono text-[10px] text-text-faint">
                  CLAIM {i + 1}
                </span>
              </div>
              <p className="text-sm text-text-muted leading-relaxed">
                {claim.text}
              </p>
              {claim.domain && (
                <span className="mt-2.5 inline-block font-mono text-[10px]
                                 text-text-faint bg-border/50 px-2 py-0.5 rounded">
                  {claim.domain}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}