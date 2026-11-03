// Fields on the job application form. Names match the `applicants` table columns.
export const applicationFields = [
  { name: 'name', label: 'Full name', type: 'text', required: true, autoComplete: 'name' },
  { name: 'email', label: 'Email', type: 'email', required: true, autoComplete: 'email' },
  { name: 'mobile_number', label: 'Mobile number', type: 'tel', required: true, autoComplete: 'tel', placeholder: '+971 5X XXX XXXX' },
  { name: 'country', label: 'Country of residence', type: 'text', required: true, autoComplete: 'country-name' },
  { name: 'nationality', label: 'Nationality', type: 'text' },
  { name: 'position', label: 'Position applying for', type: 'text', required: true },
  { name: 'experience_years', label: 'Years of experience', type: 'number', min: 0, max: 60 },
  {
    name: 'visa_status',
    label: 'UAE visa status',
    type: 'select',
    options: ['Employment visa', 'Visit visa', 'Golden visa', 'Family / dependent visa', 'Outside UAE', 'Other'],
  },
  {
    name: 'notice_period',
    label: 'Notice period',
    type: 'select',
    options: ['Immediate', '1 week', '2 weeks', '1 month', '2 months', '3 months or more'],
  },
  { name: 'current_salary', label: 'Current salary (AED / month)', type: 'number', min: 0 },
  { name: 'expected_salary', label: 'Expected salary (AED / month)', type: 'number', min: 0 },
  { name: 'linkedin', label: 'LinkedIn profile', type: 'url', placeholder: 'https://linkedin.com/in/…' },
  { name: 'message', label: 'Anything else we should know?', type: 'textarea', wide: true },
]
