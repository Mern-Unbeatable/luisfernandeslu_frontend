import fs from 'fs'
import path from 'path'

const base = path.resolve('c:/dev/luisfernandeslu_frontend')
const localRoot = path.join(base, 'src')
const mehRoot = path.join(base, 'luisfernandeslu_frontend-mehedi/src')

/** Keep local transporter UI (mehedi uses ComingSoon placeholders). */
const KEEP_LOCAL_PREFIXES = [
  'pages/transporter/dashboard/',
  'pages/transporter/insurance/',
  'pages/transporter/payments-payouts/',
  'pages/transporter/assign-deliveries/',
  'pages/transporter/invoices/',
]

function shouldKeepLocal(rel) {
  const normalized = rel.split(path.sep).join('/')
  return KEEP_LOCAL_PREFIXES.some((prefix) => normalized.startsWith(prefix))
}

function walk(dir, root) {
  const out = []
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) out.push(...walk(p, root))
    else out.push(path.relative(root, p))
  }
  return out
}

function copyFile(rel) {
  const src = path.join(mehRoot, rel)
  const dest = path.join(localRoot, rel)
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  fs.copyFileSync(src, dest)
}

const mFiles = walk(mehRoot, mehRoot)
let copied = 0
let skipped = 0

for (const rel of mFiles) {
  const normalized = rel.split(path.sep).join('/')
  if (shouldKeepLocal(normalized)) {
    skipped += 1
    continue
  }
  const localPath = path.join(localRoot, rel)
  const mehPath = path.join(mehRoot, rel)
  if (!fs.existsSync(localPath)) {
    copyFile(rel)
    copied += 1
    continue
  }
  const a = fs.readFileSync(localPath)
  const b = fs.readFileSync(mehPath)
  if (!a.equals(b)) {
    copyFile(rel)
    copied += 1
  }
}

console.log(`Synced ${copied} files from mehedi (skipped ${skipped} transporter files).`)

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
  for (const sub of ['locales', 'locales/catalog']) {
    const localPath = path.join(localRoot, 'i18n', sub, file)
    const mehPath = path.join(mehRoot, 'i18n', sub, file)
    if (!fs.existsSync(mehPath) || !fs.existsSync(localPath)) continue
    const L = JSON.parse(fs.readFileSync(localPath, 'utf8'))
    const M = JSON.parse(fs.readFileSync(mehPath, 'utf8'))
    const merged = deepMerge(M, L)
    fs.writeFileSync(localPath, `${JSON.stringify(merged, null, 2)}\n`, 'utf8')
  }
}

console.log('Re-merged locale files (mehedi base + local overrides).')
