// Checks the live Supabase setup the way a visitor would: submit an application with a CV,
// then confirm the public key cannot read applications or CVs back.
import { createClient } from '@supabase/supabase-js'

const url = 'https://whhxasnkwuewsywaijlh.supabase.co'
const key = 'sb_publishable_NRFmBYX2mduTzTmw3CBDxw_-7h8pHdR'
const db = createClient(url, key, { auth: { persistSession: false } })
let failed = false
const check = (ok, msg) => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${msg}`)
  if (!ok) failed = true
}

const pdf = new Blob(['%PDF-1.4\n%test\n'], { type: 'application/pdf' })
const path = `smoke-test/${Date.now()}.pdf`
const up = await db.storage.from('cvs').upload(path, pdf, { contentType: 'application/pdf' })
check(!up.error, `visitor can upload a CV${up.error ? `: ${up.error.message}` : ''}`)

const ins = await db.from('applicants').insert({
  name: 'TEST APPLICATION (automated check, safe to delete)',
  email: 'test@example.com',
  mobile_number: '+971500000000',
  country: 'UAE',
  position: 'Test',
  cv_filename: 'test.pdf',
  cv_path: up.error ? null : path,
})
check(!ins.error, `visitor can submit an application${ins.error ? `: ${ins.error.message}` : ''}`)

const sel = await db.from('applicants').select('*')
check(!sel.error && sel.data.length === 0, `visitor cannot read applications (got ${sel.data?.length ?? sel.error?.message})`)

const dl = await db.storage.from('cvs').download(path)
check(Boolean(dl.error), 'visitor cannot download CVs')

const signup = await db.auth.signUp({ email: `smoke${Date.now()}@example.com`, password: 'Test-Password-123!' })
check(Boolean(signup.error), `public sign-ups are disabled${signup.error ? '' : ' (they are ENABLED, turn them off)'}`)

process.exit(failed ? 1 : 0)
