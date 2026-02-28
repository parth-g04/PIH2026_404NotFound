import { useNavigate } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import Navbar from '../components/layout/Navbar'
import { Target, Search, Map, Lightbulb, ArrowRight, Zap, Shield, Clock, TrendingUp } from 'lucide-react'

/* ───────────────── Animations ───────────────── */

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: 'easeOut', delay },
})

/* ───────────────── Animated Counter ───────────────── */

function Counter({ value, suffix = '' }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return

    let start = 0
    const end = value
    const duration = 1200
    const stepTime = 16
    const totalSteps = duration / stepTime
    const increment = end / totalSteps

    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, stepTime)

    return () => clearInterval(timer)
  }, [isInView, value])

  return (
    <div ref={ref} className="font-syne font-extrabold text-4xl
                              bg-gradient-to-b from-white to-text-muted bg-clip-text text-transparent">
      {count}{suffix}
    </div>
  )
}

/* ───────────────── Data ───────────────── */

const FEATURES = [
  {
    icon: Target,
    color: 'text-accent-light',
    bg: 'bg-accent/10 border-accent/20',
    name: 'Patentability Score',
    desc: 'Composite 0–100 score using semantic similarity, claim overlap, and domain clustering.',
  },
  {
    icon: Search,
    color: 'text-cyan-brand',
    bg: 'bg-cyan-brand/10 border-cyan-brand/20',
    name: 'Claim Analyzer',
    desc: 'LLM-powered extraction of independent and dependent claims from prior art.',
  },
  {
    icon: Map,
    color: 'text-warning',
    bg: 'bg-warning/10 border-warning/20',
    name: 'Novelty Heatmap',
    desc: 'Visual similarity intensity mapped across Abstract, Claims, and Description.',
  },
  {
    icon: Lightbulb,
    color: 'text-success',
    bg: 'bg-success/10 border-success/20',
    name: 'Innovation Gaps',
    desc: 'Detects missing sub-features in existing patents to help guide differentiation.',
  },
]

const HOW_IT_WORKS = [
  { step: '01', title: 'Describe Your Invention', desc: 'Input your idea, technical domain, and key claims.' },
  { step: '02', title: 'Semantic Vector Search', desc: 'We search 120M+ patents via pgvector similarity.' },
  { step: '03', title: 'LLM Claim Analysis', desc: 'GPT-4o analyzes overlapping claims and structures.' },
  { step: '04', title: 'Receive Intelligence Report', desc: 'Get your patentability score, heatmap, and PDF report.' },
]

/* ───────────────── Component ───────────────── */

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="relative z-10">
      <Navbar />

      {/* ───────── HERO ───────── */}
      <section className="min-h-screen flex flex-col items-center justify-center pt-28 pb-20 px-6 text-center relative">

        {/* Glow background */}
        <div className="hero-glow" />

        <motion.div {...fadeUp(0.1)}
          className="font-mono text-xs tracking-widest text-accent-light uppercase mb-6">
          NOVELTY INTELLIGENCE ENGINE
        </motion.div>

        <motion.h1 {...fadeUp(0.25)}
          className="font-syne font-extrabold leading-[0.92] tracking-tight
                     text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-7 max-w-4xl">
          Know If Your Idea<br />
          Is{' '}
          <span className="bg-gradient-to-r from-accent to-cyan-brand bg-clip-text text-transparent">
            Truly Novel
          </span>
          <br />In Minutes.
        </motion.h1>

        <motion.p {...fadeUp(0.4)}
          className="text-lg text-text-muted font-light leading-relaxed max-w-xl mb-12">
          PatentGuard AI combines semantic vector search and LLM claim analysis
          to validate your innovation before you spend months filing.
        </motion.p>

        {/* Stats with counter animation */}
        <motion.div {...fadeUp(0.5)} className="flex flex-wrap justify-center gap-12 mb-14">
          <div className="text-center">
            <Counter value={120} suffix="M+" />
            <div className="font-mono text-xs text-text-faint tracking-widest uppercase mt-2">
              Patents Indexed
            </div>
          </div>

          <div className="text-center">
            <div className="font-syne font-extrabold text-4xl text-white">&lt; 2min</div>
            <div className="font-mono text-xs text-text-faint tracking-widest uppercase mt-2">
              Analysis Time
            </div>
          </div>

          <div className="text-center">
            <Counter value={94} suffix="%" />
            <div className="font-mono text-xs text-text-faint tracking-widest uppercase mt-2">
              Accuracy Score
            </div>
          </div>

          <div className="text-center">
            <Counter value={50} suffix="+" />
            <div className="font-mono text-xs text-text-faint tracking-widest uppercase mt-2">
              Tech Domains
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div {...fadeUp(0.6)} className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <button
            onClick={() => navigate('/analyze')}
            className="btn-primary flex items-center gap-2 px-8 py-4 text-base">
            Analyze an Invention
            <ArrowRight size={16} />
          </button>

          <button
            onClick={() => navigate('/analyze?demo=true')}
            className="btn-secondary px-7 py-4 text-base">
            View Live Demo
          </button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className="text-text-faint font-mono text-xs tracking-widest">
          SCROLL TO EXPLORE ↓
        </motion.div>
      </section>

      {/* ───────── HOW IT WORKS ───────── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="section-tag inline-block mb-4">HOW IT WORKS</div>
            <h2 className="font-syne font-extrabold text-4xl md:text-5xl tracking-tight">
              From idea to intelligence<br />
              <span className="text-accent-light">in 4 steps.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map(({ step, title, desc }, i) => (
              <motion.div key={step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}>
                <div className="card h-full hover:-translate-y-1 transition-transform duration-300">
                  <div className="font-syne font-extrabold text-5xl text-border mb-4 leading-none">{step}</div>
                  <h3 className="font-syne font-bold text-base mb-3">{title}</h3>
                  <p className="text-sm text-text-muted leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── FINAL CTA ───────── */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="card card-accent text-center py-16">
            <div className="flex justify-center gap-4 mb-6">
              <Shield size={24} className="text-accent-light" />
              <Clock size={24} className="text-cyan-brand" />
              <TrendingUp size={24} className="text-success" />
            </div>

            <h2 className="font-syne font-extrabold text-4xl tracking-tight mb-4">
              Ready to validate your<br />
              <span className="text-accent-light">breakthrough idea?</span>
            </h2>

            <p className="text-text-muted mb-10 max-w-md mx-auto">
              Get a data-driven patentability score in under 2 minutes.
            </p>

            <button
              onClick={() => navigate('/analyze')}
              className="btn-primary inline-flex items-center gap-2 px-10 py-4 text-base">
              Start Free Analysis
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6 text-center">
        <p className="font-mono text-xs text-text-faint tracking-wide">
          PatentGuard AI · Built for National Hackathon 2026
        </p>
      </footer>
    </div>
  )
}