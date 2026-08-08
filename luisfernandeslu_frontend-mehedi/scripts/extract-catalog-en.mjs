import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { PRODUCT_CATEGORIES } from '../src/data/productCategories.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, '../src/i18n/locales/catalog')
fs.mkdirSync(outDir, { recursive: true })

function extract() {
  const categories = {}
  const subcategories = {}
  const types = {}
  for (const c of PRODUCT_CATEGORIES) {
    categories[c.id] = c.name
    for (const s of c.subcategories) {
      subcategories[s.id] = s.name
      for (const t of s.productTypes) types[t.id] = t.name
    }
  }
  return { categories, subcategories, types }
}

const en = extract()
fs.writeFileSync(path.join(outDir, 'en.json'), JSON.stringify(en, null, 2))
fs.writeFileSync(
  path.join(outDir, '_keys.json'),
  JSON.stringify(
    {
      categories: Object.keys(en.categories),
      subcategories: Object.entries(en.subcategories),
      types: Object.entries(en.types),
    },
    null,
    2,
  ),
)
console.log(
  'en written',
  Object.keys(en.categories).length,
  Object.keys(en.subcategories).length,
  Object.keys(en.types).length,
)
