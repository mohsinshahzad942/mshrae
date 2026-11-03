import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Served from https://mohsinshahzad942.github.io/mshrae/, so assets need the repo name as base.
// If you move this to a user site repo (username.github.io), change base back to '/'.
export default defineConfig({
  plugins: [react()],
  base: '/mshrae/',
})
