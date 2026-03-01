require('dotenv').config({ path: '../.env' })

const SUPABASE_URL         = process.env.SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY
const DEMO_MODE            = process.env.DEMO_MODE === 'true'

// In DEMO_MODE — return a fake client so nothing crashes
if (DEMO_MODE || !SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.log('[Supabase] Running in DEMO_MODE — using mock client')

  const mockClient = {
    from: () => ({
      insert:  () => Promise.resolve({ data: null,  error: null }),
      select:  () => ({
        eq:     () => ({
          single: () => Promise.resolve({ data: null, error: null }),
        }),
        single:   () => Promise.resolve({ data: null, error: null }),
      }),
    }),
    rpc: () => Promise.resolve({ data: [], error: null }),
  }

  module.exports = mockClient

} else {
  // Real Supabase client
  const { createClient } = require('@supabase/supabase-js')

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: {
      persistSession:   false,
      autoRefreshToken: false,
    },
  })

  console.log('[Supabase] ✓ Real client connected:', SUPABASE_URL)
  module.exports = supabase
}