import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

function copyGeneratedImagesPlugin() {
  try {
    const artifactDir = 'C:\\Users\\MAKTECH\\.gemini\\antigravity-ide\\brain\\5f63947f-ff3a-4a78-a3b8-5674c0a0749b'
    const destDir = fileURLToPath(new URL('./public/images/categories', import.meta.url))
    if (fs.existsSync(artifactDir)) {
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true })
      }
      const files = fs.readdirSync(artifactDir)
      files.filter(f => f.endsWith('.png') && (f.includes('_real_') || f.includes('_category_'))).forEach(file => {
        const srcPath = path.join(artifactDir, file)
        const baseName = file.split('_1786')[0] + '.png'
        const destPath = path.join(destDir, baseName)
        fs.copyFileSync(srcPath, destPath)
      })
    }
  } catch (err) {
    console.error('Failed to copy generated images:', err)
  }
  return { name: 'copy-generated-images' }
}

export default defineConfig({
  plugins: [copyGeneratedImagesPlugin(), react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return

          if (id.includes('react-dom') || id.includes('/react/')) {
            return 'react-vendor'
          }
          if (id.includes('react-router')) {
            return 'router'
          }
          if (id.includes('@reduxjs') || id.includes('react-redux')) {
            return 'redux'
          }
          if (id.includes('axios')) {
            return 'http'
          }
        },
      },
    },
  },
});
