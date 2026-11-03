import { CV_BUCKET } from '../config'
import { supabase } from './supabase'

const safeName = (name) => name.replace(/[^\w.-]+/g, '_').slice(-80)

/** Uploads the CV (if any), then stores the application. Visitors can write but never read. */
export async function submitApplication(fields, cvFile) {
  let cv_path = null
  let cv_filename = null
  if (cvFile) {
    cv_filename = cvFile.name
    cv_path = `${crypto.randomUUID()}/${safeName(cvFile.name)}`
    const { error } = await supabase.storage
      .from(CV_BUCKET)
      .upload(cv_path, cvFile, { contentType: 'application/pdf', upsert: false })
    if (error) throw new Error(`CV upload failed: ${error.message}`)
  }
  const { error } = await supabase.from('applicants').insert({ ...fields, cv_path, cv_filename })
  if (error) throw new Error(error.message)
}

export async function listApplications() {
  const { data, error } = await supabase.from('applicants').select('*').order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data
}

export async function cvLink(path) {
  const { data, error } = await supabase.storage.from(CV_BUCKET).createSignedUrl(path, 60 * 5)
  if (error) throw new Error(error.message)
  return data.signedUrl
}

export async function deleteApplication(row) {
  if (row.cv_path) await supabase.storage.from(CV_BUCKET).remove([row.cv_path])
  const { error } = await supabase.from('applicants').delete().eq('id', row.id)
  if (error) throw new Error(error.message)
}
