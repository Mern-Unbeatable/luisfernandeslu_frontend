import fs from 'fs'
import path from 'path'

const base = path.resolve('c:/dev/luisfernandeslu_frontend')
const localRoot = path.join(base, 'src')
const mehRoot = path.join(base, 'luisfernandeslu_frontend-mehedi/src')

function walk(dir, root) {
  const out = []
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) out.push(...walk(p, root))
    else out.push(path.relative(root, p).split(path.sep).join('/'))
  }
  return out
}

const lFiles = new Set(walk(localRoot, localRoot))
const mFiles = new Set(walk(mehRoot, mehRoot))

console.log('Only in mehedi:', [...mFiles].filter((f) => !lFiles.has(f)).sort())
console.log('Only in local:', [...lFiles].filter((f) => !mFiles.has(f)).sort())

const lr = fs.readFileSync(path.join(localRoot, 'app/router/index.jsx'), 'utf8')
const mr = fs.readFileSync(path.join(mehRoot, 'app/router/index.jsx'), 'utf8')
const re = /path:\s*['"]([^'"]+)['"]/g
const lp = [...lr.matchAll(re)].map((x) => x[1])
const mp = [...mr.matchAll(re)].map((x) => x[1])
console.log('Routes only mehedi:', mp.filter((p) => !lp.includes(p)))
console.log('Routes only local:', lp.filter((p) => !mp.includes(p)))

function deepMerge(target, source) {
  const out = { ...target }
  for (const key of Object.keys(source)) {
    if (
      source[key]
      && typeof source[key] === 'object'
      && !Array.isArray(source[key])
      && target[key]
      && typeof target[key] === 'object'
      && !Array.isArray(target[key])
    ) {
      out[key] = deepMerge(target[key], source[key])
    } else {
      out[key] = source[key]
    }
  }
  return out
}

for (const file of ['en.json', 'pt.json', 'es.json']) {
  const localPath = path.join(localRoot, 'i18n/locales', file)
  const mehPath = path.join(mehRoot, 'i18n/locales', file)
  const L = JSON.parse(fs.readFileSync(localPath, 'utf8'))
  const M = JSON.parse(fs.readFileSync(mehPath, 'utf8'))
  const merged = deepMerge(M, L)
  fs.writeFileSync(localPath, `${JSON.stringify(merged, null, 2)}\n`, 'utf8')
  console.log(`Merged ${file}`)
}

for (const file of ['en.json', 'pt.json', 'es.json']) {
  const localPath = path.join(localRoot, 'i18n/locales/catalog', file)
  const mehPath = path.join(mehRoot, 'i18n/locales/catalog', file)
  if (!fs.existsSync(mehPath)) continue
  const L = JSON.parse(fs.readFileSync(localPath, 'utf8'))
  const M = JSON.parse(fs.readFileSync(mehPath, 'utf8'))
  const merged = deepMerge(M, L)
  fs.writeFileSync(localPath, `${JSON.stringify(merged, null, 2)}\n`, 'utf8')
  console.log(`Merged catalog/${file}`)
}
