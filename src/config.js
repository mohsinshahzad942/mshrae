// Public connection details for the Supabase project that stores job applications.
// The anon key is designed to be public: Row Level Security in the database decides
// what it can do (submit applications only; reading them requires the admin login).
// GitHub Actions can override these with VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY.
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://whhxasnkwuewsywaijlh.supabase.co'
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_NRFmBYX2mduTzTmw3CBDxw_-7h8pHdR'

// Admin usernames map to the email of their Supabase Auth account. Passwords are never stored here.
export const ADMIN_USERS = {
  mohsinshahzad942: 'mohsinshahzad942@gmail.com',
}

export const CV_BUCKET = 'cvs'
export const CV_MAX_MB = 5
