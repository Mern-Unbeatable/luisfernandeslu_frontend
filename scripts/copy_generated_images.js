import fs from 'fs'
import path from 'path'

const artifactDir = 'C:\\Users\\MAKTECH\\.gemini\\antigravity-ide\\brain\\5f63947f-ff3a-4a78-a3b8-5674c0a0749b'
const destDir = path.resolve(process.cwd(), 'public/images/categories')

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true })
}

const files = fs.readdirSync(artifactDir)
const pngFiles = files.filter(f => f.endsWith('.png'))

pngFiles.forEach(file => {
  const srcPath = path.join(artifactDir, file)
  const baseName = file.split('_1786')[0] + '.png'
  const destPath = path.join(destDir, baseName)
  fs.copyFileSync(srcPath, destPath)
  console.log(`Copied ${file} -> public/images/categories/${baseName}`)
})
