import { useActionState, useEffect, useState } from 'react'
import { Link } from 'react-router'
import { PageShell } from '../components/PageShell'
import { CV_MAX_MB } from '../config'
import { applicationFields } from '../data/applicationForm'
import { submitApplication } from '../lib/applications'
import { isConfigured } from '../lib/supabase'

const NUMERIC = new Set(['experience_years', 'current_salary', 'expected_salary'])

async function submit(_prev, formData) {
  const fields = {}
  for (const { name } of applicationFields) {
    const raw = String(formData.get(name) ?? '').trim()
    fields[name] = raw === '' ? null : NUMERIC.has(name) ? Number(raw) : raw
  }
  const cv = formData.get('cv')
  const file = cv && cv.size > 0 ? cv : null
  if (!file) return { error: 'Please attach your CV as a PDF.', fields }
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf'))
    return { error: 'Your CV must be a PDF file.', fields }
  if (file.size > CV_MAX_MB * 1024 * 1024) return { error: `Your CV must be under ${CV_MAX_MB} MB.`, fields }

  try {
    await submitApplication(fields, file)
    return { ok: true }
  } catch (e) {
    return { error: `Sorry, we couldn't send your application (${e.message}). Please try again.`, fields }
  }
}

function Field({ field, defaultValue }) {
  const { name, label, type, required, options, wide, ...rest } = field
  const id = `f-${name}`
  const common = { id, name, required, defaultValue: defaultValue ?? '' }
  return (
    <div className={`field${wide ? ' wide' : ''}`}>
      <label htmlFor={id}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {type === 'textarea' ? (
        <textarea rows={5} {...common} />
      ) : type === 'select' ? (
        <select {...common}>
          <option value="">Select…</option>
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      ) : (
        <input type={type} {...common} {...rest} />
      )}
    </div>
  )
}

export default function Apply() {
  const [state, action, pending] = useActionState(submit, null)
  const [fileName, setFileName] = useState('')

  useEffect(() => {
    document.title = 'Apply for a Job · Mohsin Shahzad'
    return () => {
      document.title = 'Mohsin Shahzad'
    }
  }, [])

  if (state?.ok) {
    return (
      <PageShell kicker="Application received" title="Thank you!" theme="light">
        <div className="panel form-done" role="status">
          <p>Your application has been sent. We'll review it and get back to you if your profile is a match.</p>
          <Link to="/" className="btn primary">
            Back to the site
          </Link>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell kicker="Careers" title="Apply for a Job" theme="light">
      <p className="page-intro">
        Fill in your details and attach your CV. Fields marked * are required. Your information is stored securely and
        only seen by the HR team.
      </p>
      {!isConfigured && (
        <p className="notice" role="alert">
          Applications are not open yet. Please check back soon.
        </p>
      )}
      <form action={action} className="panel app-form" noValidate={false}>
        <div className="form-grid">
          {applicationFields.map((f) => (
            <Field key={f.name} field={f} defaultValue={state?.fields?.[f.name]} />
          ))}
          <div className="field wide">
            <label htmlFor="f-cv">
              CV (PDF, max {CV_MAX_MB} MB)<span aria-hidden="true"> *</span>
            </label>
            <label className="file-drop">
              <input
                id="f-cv"
                name="cv"
                type="file"
                accept="application/pdf,.pdf"
                required
                onChange={(e) => setFileName(e.target.files?.[0]?.name ?? '')}
              />
              <span>{fileName || 'Choose a PDF file…'}</span>
            </label>
          </div>
        </div>
        {state?.error && (
          <p className="form-error" role="alert">
            {state.error}
          </p>
        )}
        <button className="btn primary" type="submit" disabled={pending || !isConfigured}>
          {pending ? 'Sending…' : 'Submit application'}
        </button>
      </form>
    </PageShell>
  )
}
