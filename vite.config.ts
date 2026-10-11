import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * BASE PATH CONFIGURATION
 * -----------------------
 * - Hostinger / Vercel / Netlify (site served from the domain root): leave the
 *   default. The build uses "/" and works when `dist/` is uploaded to public_html.
 *
 * - GitHub Pages (site served from https://USERNAME.github.io/REPO_NAME/):
 *   the assets must be referenced under "/REPO_NAME/". Either
 *     a) run   VITE_BASE_PATH=/REPO_NAME/ npm run build
 *     b) or change DEFAULT_BASE below to '/REPO_NAME/' (e.g. '/plant-tissue-culture-3d/').
 *
 * The GitHub Actions workflow in .github/workflows/deploy.yml sets this
 * automatically from the repository name, so you normally do not need to edit it.
 */
const DEFAULT_BASE = '/'

export default defineConfig(({ mode }) => {
  // reads VITE_BASE_PATH from the shell environment or an optional .env file
  const env = loadEnv(mode, '.', 'VITE_')
  return {
    plugins: [react()],
    base: env.VITE_BASE_PATH || DEFAULT_BASE,
    build: {
      outDir: 'dist',
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          // keep the big 3D libraries in their own cacheable chunks
          manualChunks(id) {
            if (id.includes('node_modules/three/')) return 'three'
            if (id.includes('node_modules/@react-three/') || id.includes('node_modules/three-stdlib/')) return 'r3f'
            return undefined
          },
        },
      },
    },
  }
})
