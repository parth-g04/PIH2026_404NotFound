
import { useNavigate, useLocation } from 'react-router-dom'
import { Zap } from 'lucide-react'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50
                    flex items-center justify-between px-8 py-4
                    bg-bg/80 backdrop-blur-xl border-b border-border">

      {/* Logo */}
      <button onClick={() => navigate('/')} className="flex items-center gap-2.5 group">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-cyan-brand
                        flex items-center justify-center shadow-accent
                        group-hover:shadow-accent-lg transition-shadow duration-300">
          <Zap size={16} className="text-white" />
        </div>
        <span className="font-syne font-extrabold text-lg tracking-tight">
          Patent<span className="text-accent-light">Guard</span> AI
        </span>
      </button>

      {/* Center badge */}
      <div className="font-mono text-xs text-cyan-brand tracking-widest uppercase
                      bg-cyan-brand/10 border border-cyan-brand/20 px-3 py-1 rounded-full">
        BETA · v1.0.0
      </div>

      {/* Right */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-slow" />
          <span className="font-mono text-xs text-success tracking-wider">ENGINE ONLINE</span>
        </div>
        {location.pathname !== '/analyze' && (
          <button onClick={() => navigate('/analyze')} className="btn-primary px-5 py-2 text-sm">
            Start Analysis →
          </button>
        )}
      </div>
    </nav>
  )
}