import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Served from https://mohsinshahzad942.github.io/mshrae/, so assets need the repo name as base.
// If you move this to a user site repo (username.github.io), change base back to '/'.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/mshrae/',
  // "@/..." resolves to src/, which Skiper UI and Vengeance UI components import from.
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
})
