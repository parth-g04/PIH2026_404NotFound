// PatentGuard AI — SimilarPatents.jsx — Member B
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'

function getSimilarityColor(score) {
  if (score <= 30) return 'text-success'
  if (score <= 60) return 'text-warning'
  return 'text-danger'
}

function getSimilarityLabel(score) {
  if (score <= 30) return 'LOW OVERLAP'
  if (score <= 60) return 'MODERATE'
  return 'HIGH OVERLAP'
}

export default function SimilarPatents({ patents = [] }) {
  return (
    <div className="card">
      <h3 className="font-syne font-bold text-[15px] flex items-center gap-2 mb-5">
        📋 Most Similar Prior Art
        <span className="font-mono text-[10px] text-accent-light
                         bg-accent/10 border border-accent/20
                         px-2 py-0.5 rounded tracking-wide">
          VECTOR MATCH
        </span>
      </h3>

      {patents.length === 0 ? (
        <p className="text-text-faint text-sm font-mono">No similar patents found.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {patents.map((patent, i) => (
            <motion.div
              key={patent.patentNumber || i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="patent-item group"
            >
              {/* Similarity percentage */}
              <div className="text-center min-w-[64px]">
                <div className={`font-syne font-extrabold text-2xl
                                  ${getSimilarityColor(patent.similarityScore)}`}>
                  {patent.similarityScore}%
                </div>
                <div className={`font-mono text-[9px] tracking-wide mt-0.5
                                  ${getSimilarityColor(patent.similarityScore)}`}>
                  {getSimilarityLabel(patent.similarityScore)}
                </div>
              </div>

              {/* Patent info */}
              <div className="flex-1 min-w-0">
                <p className="font-mono text-[11px] text-text-faint mb-1">
                  {patent.patentNumber}
                </p>
                <p className="text-sm text-text font-medium leading-snug">
                  {patent.title}
                </p>
                {patent.abstract && (
                  <p className="text-xs text-text-muted mt-1 line-clamp-1">
                    {patent.abstract}
                  </p>
                )}
              </div>

              {/* Domain + external link */}
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <span className="font-mono text-[10px] text-accent-light
                                 bg-accent/10 border border-accent/20
                                 px-2 py-1 rounded whitespace-nowrap">
                  {patent.domain}
                </span>
                <ExternalLink
                  size={13}
                  className="text-text-faint opacity-0 group-hover:opacity-100
                             transition-opacity"
                />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}