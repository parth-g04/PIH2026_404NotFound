import axios from 'axios'

const api = axios.create({
  baseURL: '',       // Vite proxy forwards /api → localhost:5000
  timeout: 60000,    // 60s timeout — AI takes time
  headers: { 'Content-Type': 'application/json' },
})

// Unwrap server envelope { success, data } automatically
api.interceptors.response.use(
  (response) => {
    const body = response.data
    if (body && body.success === false) throw new Error(body.error || 'Server error')
    return body.data !== undefined ? body.data : body
  },
  (error) => {
    const message =
      error.response?.data?.error ||
      error.message ||
      'Network error — is the backend running on port 5000?'
    throw new Error(message)
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