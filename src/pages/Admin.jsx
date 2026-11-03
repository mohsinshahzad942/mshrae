import { useCallback, useEffect, useMemo, useState } from 'react'
import { PageShell } from '../components/PageShell'
import { ADMIN_USERS } from '../config'
import { applicationFields } from '../data/applicationForm'
import { cvLink, deleteApplication, listApplications } from '../lib/applications'
import { isConfigured, supabase } from '../lib/supabase'

const LABELS = Object.fromEntries(applicationFields.map((f) => [f.name, f.label]))
const COLUMNS = ['id', 'created_at', ...applicationFields.map((f) => f.name), 'cv_filename']
const fmtDate = (iso) =>
  new Date(iso).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Dubai' })

function useSession() {
  const [session, setSession] = useState(undefined)
  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [])
  return isConfigured ? session : null
}

function LoginForm() {
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const user = String(form.get('username')).trim()
    const email = user.includes('@') ? user : ADMIN_USERS[user.toLowerCase()]
    setBusy(true)
    setError('')
    const { error: err } = email
      ? await supabase.auth.signInWithPassword({ email, password: String(form.get('password')) })
      : { error: true }
    setBusy(false)
    if (err) setError('Wrong username or password.')
  }

  return (
    <form className="panel login" onSubmit={onSubmit}>
      <div className="field">
        <label htmlFor="username">Username</label>
        <input id="username" name="username" autoComplete="username" required />
      </div>
      <div className="field">
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required />
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <button className="btn primary" type="submit" disabled={busy}>
        {busy ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}

function toCsv(rows) {
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const head = COLUMNS.map((c) => esc(LABELS[c] ?? c)).join(',')
  return [head, ...rows.map((r) => COLUMNS.map((c) => esc(r[c])).join(','))].join('\r\n')
}

function download(name, text) {
  const url = URL.createObjectURL(new Blob(['﻿' + text], { type: 'text/csv;charset=utf-8' }))
  const a = Object.assign(document.createElement('a'), { href: url, download: name })
  a.click()
  URL.revokeObjectURL(url)
}

function Detail({ row, onClose, onDeleted }) {
  const [busy, setBusy] = useState(false)
  const openCv = async () => {
    try {
      window.open(await cvLink(row.cv_path), '_blank', 'noopener')
    } catch (e) {
      alert(`Couldn't open the CV: ${e.message}`)
    }
  }
  const remove = async () => {
    if (!confirm(`Delete the application from ${row.name}? This cannot be undone.`)) return
    setBusy(true)
    try {
      await deleteApplication(row)
      onDeleted(row.id)
    } catch (e) {
      alert(`Couldn't delete: ${e.message}`)
      setBusy(false)
    }
  }
  return (
    <div className="panel detail" role="region" aria-label={`Application from ${row.name}`}>
      <div className="detail-head">
        <h2>{row.name}</h2>
        <button className="copy" type="button" onClick={onClose}>
          Close
        </button>
      </div>
      <dl>
        <dt>ID</dt>
        <dd>{row.id}</dd>
        <dt>Received</dt>
        <dd>{fmtDate(row.created_at)}</dd>
        {applicationFields.map(({ name, label }) =>
          row[name] == null || row[name] === '' ? null : (
            <div key={name} className="dl-row">
              <dt>{label}</dt>
              <dd>
                {name === 'email' ? (
                  <a href={`mailto:${row.email}`}>{row.email}</a>
                ) : name === 'linkedin' ? (
                  <a href={row.linkedin} target="_blank" rel="noopener noreferrer">
                    {row.linkedin}
                  </a>
                ) : name === 'mobile_number' ? (
                  <a href={`tel:${row.mobile_number.replace(/\s/g, '')}`}>{row.mobile_number}</a>
                ) : (
                  String(row[name])
                )}
              </dd>
            </div>
          ),
        )}
      </dl>
      <div className="detail-actions">
        {row.cv_path && (
          <button className="btn primary small" type="button" onClick={openCv}>
            Open CV ({row.cv_filename})
          </button>
        )}
        <button className="btn small danger" type="button" onClick={remove} disabled={busy}>
          Delete
        </button>
      </div>
    </div>
  )
}

function Dashboard() {
  const [rows, setRows] = useState(null)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)

  const load = useCallback(async () => {
    setError('')
    try {
      setRows(await listApplications())
    } catch (e) {
      setError(e.message)
    }
  }, [])

  useEffect(() => {
    let active = true
    listApplications()
      .then((data) => active && setRows(data))
      .catch((e) => active && setError(e.message))
    return () => {
      active = false
    }
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!rows || !q) return rows
    return rows.filter((r) =>
      ['name', 'email', 'position', 'country', 'nationality', 'mobile_number'].some((k) =>
        String(r[k] ?? '').toLowerCase().includes(q),
      ),
    )
  }, [rows, query])

  const current = rows?.find((r) => r.id === selected)

  return (
    <>
      <div className="toolbar">
        <input
          type="search"
          placeholder="Search name, position, country…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search applications"
        />
        <button className="btn small" type="button" onClick={load}>
          Refresh
        </button>
        <button
          className="btn small"
          type="button"
          disabled={!rows?.length}
          onClick={() => download(`applications-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(rows))}
        >
          Export CSV
        </button>
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      {!rows && !error && <p className="label">Loading applications…</p>}
      {rows && (
        <p className="label count">
          {filtered.length} of {rows.length} application{rows.length === 1 ? '' : 's'}
        </p>
      )}
      {current && (
        <Detail
          key={current.id}
          row={current}
          onClose={() => setSelected(null)}
          onDeleted={(id) => {
            setRows((rs) => rs.filter((r) => r.id !== id))
            setSelected(null)
          }}
        />
      )}
      {filtered?.length > 0 && (
        <div className="panel table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Position</th>
                <th>Mobile</th>
                <th>Country</th>
                <th>Experience</th>
                <th>Received</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr
                  key={r.id}
                  className={r.id === selected ? 'on' : undefined}
                  onClick={() => setSelected(r.id)}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setSelected(r.id)}
                >
                  <td>{r.id}</td>
                  <td>{r.name}</td>
                  <td>{r.position}</td>
                  <td>{r.mobile_number}</td>
                  <td>{r.country}</td>
                  <td>{r.experience_years ?? '–'}</td>
                  <td>{fmtDate(r.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {rows?.length === 0 && <p className="page-intro">No applications yet.</p>}
    </>
  )
}

export default function Admin() {
  const session = useSession()

  useEffect(() => {
    document.title = 'Admin · Mohsin Shahzad'
    return () => {
      document.title = 'Mohsin Shahzad'
    }
  }, [])

  const signOut = session ? (
    <button className="btn small" type="button" onClick={() => supabase.auth.signOut()}>
      Sign out
    </button>
  ) : null

  return (
    <PageShell kicker="Admin" title="Job applications" actions={signOut}>
      {!isConfigured ? (
        <p className="notice">The applications database is not connected yet.</p>
      ) : session === undefined ? (
        <p className="label">Checking sign-in…</p>
      ) : session ? (
        <Dashboard />
      ) : (
        <LoginForm />
      )}
    </PageShell>
  )
}
