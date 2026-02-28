// Real version built later
// Returns a fake client so server doesn't crash

console.log('[Supabase STUB] Using mock client — real DB onw later')

// Fake supabase client that returns empty data
const supabase = {
  from: () => ({
    insert: () => Promise.resolve({ data: null, error: null }),
    select: () => ({
      eq:     () => ({ single: () => Promise.resolve({ data: null, error: null }) }),
      single: ()  => Promise.resolve({ data: null, error: null }),
    }),
  }),
  rpc: () => Promise.resolve({ data: [], error: null }),
}

module.exports = supabase