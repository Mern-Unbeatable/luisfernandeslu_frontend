import { useState } from 'react'
import AddProduct from '../components/forms/AddProduct/AddProduct'
import { DEMO_ADD_PRODUCT } from '../components/forms/AddProduct/defaults'

export default function AddProductPage() {
  const [form, setForm] = useState(DEMO_ADD_PRODUCT)

  return (
    <section className="w-full bg-gray-100 px-3 py-6 sm:px-6 lg:px-10 xl:px-16">
      <div className="mx-auto w-full max-w-[1440px] rounded-xl bg-white p-4 sm:p-6 lg:p-8">
        <AddProduct
          value={form}
          onChange={setForm}
          onBack={() => window.history.back()}
          onSubmit={(payload) => console.log('submit product', payload)}
          onAiAssist={async (section) => {
            await new Promise((resolve) => setTimeout(resolve, 400))
            if (section === 'feature') {
              return 'High Strength & Durability\nSmooth Workability\nCrack Resistance Performance\nSuitable for All Construction Types'
            }
            return `AI generated ${section} for ${form.title || 'this product'}.`
          }}
        />
      </div>
    </section>
  )
}
