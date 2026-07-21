import fs from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const seoShellDirectory = resolve(process.cwd(), 'seo-shells')
const seoShellInputs = fs.existsSync(seoShellDirectory)
  ? Object.fromEntries(
      fs.readdirSync(seoShellDirectory)
        .filter((file) => file.endsWith('.html'))
        .map((file) => [`seo-${file.replace(/\.html$/, '')}`, resolve(seoShellDirectory, file)]),
    )
  : {}

export default defineConfig({
  plugins: [react()],
  server: { host: '0.0.0.0', port: 5173 },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    rollupOptions: {
      input: {
        main: resolve(process.cwd(), 'index.html'),
        cms: resolve(process.cwd(), 'cms.html'),
        webCreation: resolve(process.cwd(), 'creacion-web.html'),
        ...seoShellInputs,
      },
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (id.includes('@supabase')) return 'supabase'
          if (id.includes('framer-motion')) return 'motion'
          if (id.includes('react-helmet-async')) return 'helmet'
          if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) return 'vendor'
          return undefined
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },
})
