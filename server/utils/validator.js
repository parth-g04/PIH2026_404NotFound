// Input validation helpers for all routes

//Validate the analyze endpoint request body.
 // Returns { valid: boolean, errors: string[] }
function validateAnalysisInput(body) {
  const errors = []

  if (!body.title || typeof body.title !== 'string' || body.title.trim().length < 3) {
    errors.push('Invention title must be at least 3 characters.')
  }
  if (!body.description || typeof body.description !== 'string' || body.description.trim().length < 30) {
    errors.push('Description must be at least 30 characters.')
  }
  if (body.title && body.title.length > 200) {
    errors.push('Title must be under 200 characters.')
  }
  if (body.description && body.description.length > 5000) {
    errors.push('Description must be under 5000 characters.')
  }

  return { valid: errors.length === 0, errors }
}

// Sanitize a string — trim + remove control characters.
 
function sanitizeString(str) {
  if (typeof str !== 'string') return ''
  return str.trim().replace(/[\x00-\x1F\x7F]/g, '')
}

module.exports = { validateAnalysisInput, sanitizeString }