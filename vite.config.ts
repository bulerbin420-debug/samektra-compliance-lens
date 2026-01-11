import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Fix: Cast process to any to avoid TypeScript error regarding missing cwd() in Process type definition
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    // Vercel serves from the domain root. Using '/' avoids edge-case URL
    // resolution issues in some PWA tooling (e.g., PWABuilder).
    base: '/',
    plugins: [react()],
    define: {
      // This ensures process.env.API_KEY works in your code even in the browser
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    },
    build: {
      outDir: 'dist',
      sourcemap: false
    }
  }
})