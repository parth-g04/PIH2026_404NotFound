import { useState, useCallback, useRef, useEffect } from 'react'
import { analyzeInvention } from '../utils/api'

const INITIAL_FORM = {
  title: '',
  description: '',
  domain: 'Artificial Intelligence / ML',
  claims: '',
  market: '',
}

export const DEMO_DATA = {
  title: 'AI-Powered Adaptive Traffic Signal System',
  description:
    'A real-time traffic management system using edge-deployed neural networks to dynamically adjust signal timing based on vehicle density, pedestrian patterns, and emergency vehicle priority.',
  domain: 'Artificial Intelligence / ML',
  claims:
    'Edge ML inference under 10ms, distributed sensor fusion, adaptive signal timing, federated learning across intersections',
  market: 'Smart City Infrastructure, Urban Mobility, Government',
}

export function useAnalysis() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [status, setStatus] = useState('idle')
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [loadStep, setLoadStep] = useState(0)

  const timersRef = useRef([])

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }, [])

  useEffect(() => {
    return () => clearTimers()
  }, [clearTimers])

  const updateField = useCallback((field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }, [])

  const loadDemo = useCallback(() => {
    setForm(DEMO_DATA)
  }, [])

  const reset = useCallback(() => {
    clearTimers()
    setForm(INITIAL_FORM)
    setStatus('idle')
    setResult(null)
    setError(null)
    setLoadStep(0)
  }, [clearTimers])

  const analyze = useCallback(async () => {
    if (status === 'loading') return

    if (!form.title.trim() || !form.description.trim()) {
      setError('Please fill in the invention title and description.')
      return
    }

    setStatus('loading')
    setError(null)
    setResult(null)
    setLoadStep(0)

    clearTimers()

    const delays = [0, 900, 1800, 2700, 3500]
    timersRef.current = delays.map((delay, i) =>
      setTimeout(() => setLoadStep(i), delay)
    )

    try {
      const data = await analyzeInvention(form)
      clearTimers()
      setLoadStep(5)
      setResult(data)
      setStatus('success')
    } catch (err) {
      clearTimers()
      setError(err.message || 'Analysis failed. Please try again.')
      setStatus('error')
    }
  }, [form, status, clearTimers])

  return {
    form,
    updateField,
    loadDemo,
    reset,
    analyze,
    status,
    result,
    error,
    loadStep,
  }
}