
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  (response) => {
    const body = response.data
    if (body && body.success === false) {
      throw new Error(String(body.error || 'Server error'))
    }
    return body.data !== undefined ? body.data : body
  },
  (error) => {
    // FIX: Always convert to string — never throw object
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'Network error — backend may be down'
    throw new Error(String(message))
  }
)

export async function analyzeInvention(form) {
  return api.post('/api/analyze', form)
}

export async function searchPatents(query) {
  return api.get('/api/patents/search', { params: { q: query } })
}

export async function generateReport(result) {
  return api.post('/api/report/generate', result)
}

export async function healthCheck() {
  return api.get('/api/health')
}