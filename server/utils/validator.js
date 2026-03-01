// Input validation + GIBBERISH DETECTION
// Prevents nonsense input from getting high scores

function sanitizeString(str) {
  if (!str || typeof str !== 'string') return ''
  return str.trim().replace(/[\x00-\x1F\x7F]/g, '')
}

// ── Gibberish Detection ─
function isGibberish(text) {
  if (!text || text.trim().length === 0) return true

  const clean = text.trim().toLowerCase()
  const words  = clean.split(/\s+/).filter(w => w.length > 0)

  if (clean.length < 20) return true

  // 2. Character entropy check

  const charFreq = {}
  for (const c of clean.replace(/\s/g, '')) {
    charFreq[c] = (charFreq[c] || 0) + 1
  }
  const totalChars   = Object.values(charFreq).reduce((a, b) => a + b, 0)
  const uniqueChars  = Object.keys(charFreq).length
  const charDiversity = uniqueChars / Math.min(totalChars, 30)

  if (charDiversity < 0.18) return true

  // 3. Unique word ratio
  
  const uniqueWords    = new Set(words).size
  const uniqueWordRatio = uniqueWords / Math.max(words.length, 1)

  // If only 1 word or 0% unique word ratio → gibberish
  if (words.length < 3) return true

  // 4. Max repeated character run check
  
  const maxRunMatch = clean.match(/(.)\1{4,}/)  // 5+ repeated chars
  if (maxRunMatch) return true

  // 5. Consonant cluster check
  // Random keyboard mashing creates impossible consonant sequences
  const vowelRatio = (clean.match(/[aeiou]/g) || []).length / Math.max(clean.replace(/\s/g, '').length, 1)
  if (vowelRatio < 0.08) return true

  return false
}

// ── Main Validator

function validateAnalysisInput(body) {
  const errors = []

  if (!body || typeof body !== 'object') {
    return { valid: false, errors: ['Request body is missing or invalid.'] }
  }

  const title       = sanitizeString(body.title       || '')
  const description = sanitizeString(body.description || '')

  // ── Title checks 
  if (!title || title.length === 0) {
    errors.push('Invention title is required.')
  } else if (title.length < 3) {
    errors.push('Invention title must be at least 3 characters.')
  } else if (title.length > 300) {
    errors.push('Invention title must be under 300 characters.')
  } else if (isGibberish(title + ' ' + title)) {
    // Repeat title to meet length threshold for gibberish check
    errors.push('Please enter a real invention title. Random characters are not accepted.')
  }

  // ── Description checks 
  if (!description || description.length === 0) {
    errors.push('Invention description is required.')
  } else if (description.length < 30) {
    errors.push('Description must be at least 30 characters. Please describe your invention in detail.')
  } else if (description.length > 5000) {
    errors.push('Description must be under 5000 characters.')
  } else if (isGibberish(description)) {
    errors.push('Please provide a meaningful invention description. Random text is not accepted.')
  }

  return {
    valid:  errors.length === 0,
    errors,
  }
}

module.exports = { validateAnalysisInput, sanitizeString, isGibberish }