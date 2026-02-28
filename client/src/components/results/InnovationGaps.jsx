import { motion } from 'framer-motion'
import { Lightbulb } from 'lucide-react'

import {
  Rocket,
  Wrench,
  BarChart,
  PartyPopper,
  Trophy
} from "lucide-react";

const GAP_ICONS = [
  <Rocket />,
  <Lightbulb />,
  <Wrench />,
  <BarChart />,
  <PartyPopper />,
  <Trophy />
];

export default function InnovationGaps({ gaps = [] }) {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-success/20 bg-bg-surface">

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px
                      bg-gradient-to-r from-transparent via-success to-transparent" />

      <div className="p-7">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="font-mono text-[10px] tracking-widest text-success uppercase
                            bg-success/10 border border-success/20
                            px-3 py-1 rounded inline-block mb-3">
              INNOVATION CO-PILOT
            </div>
            <h3 className="font-syne font-extrabold text-2xl tracking-tight">
              Innovation Gap Detection
            </h3>
            <p className="text-text-muted text-sm mt-1.5">
              What existing patents miss — your differentiation opportunity
            </p>
          </div>
          <div className="p-3 bg-success/10 border border-success/20 rounded-xl flex-shrink-0">
            <Lightbulb size={20} className="text-success" />
          </div>
        </div>

        {/* Gap Cards */}
        {gaps.length === 0 ? (
          <p className="text-text-faint text-sm font-mono">No gaps detected.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gaps.map((gap, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                className="bg-bg-secondary border border-border rounded-xl p-5
                           hover:border-success/30 transition-colors duration-200"
              >
                <div className="text-2xl mb-3">
                  {GAP_ICONS[i % GAP_ICONS.length]}
                </div>
                <h4 className="font-syne font-bold text-sm text-success mb-2">
                  {gap.title}
                </h4>
                <p className="text-xs text-text-muted leading-relaxed">
                  {gap.description}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}