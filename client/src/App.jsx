
import { Routes, Route } from 'react-router-dom'
import LandingPage   from './pages/LandingPage'
import DashboardPage from './pages/DashboardPage'
import ReportPage    from './pages/ReportPage'

export default function App() {
  return (
    <div className="min-h-screen bg-bg text-text font-sans">
      {/* Grid background */}
      <div className="fixed inset-0 bg-grid pointer-events-none z-0" />
      {/* Glow orb */}
      <div className="hero-glow" />

      <Routes>
        <Route path="/"        element={<LandingPage />} />
        <Route path="/analyze" element={<DashboardPage />} />
        <Route path="/report"  element={<ReportPage />} />
      </Routes>
    </div>
  )
}