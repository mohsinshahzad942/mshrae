import { createClient } from '@supabase/supabase-js'
import { SUPABASE_ANON_KEY, SUPABASE_URL } from '../config'

export const isConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)

export const supabase = isConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: true } })
  : null
