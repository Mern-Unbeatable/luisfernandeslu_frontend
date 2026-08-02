import { useState } from 'react'
import ProductDetails from '../components/data-display/ProductDetails/ProductDetails'
import {
  ADMIN_PRODUCT,
  DEMO_PRODUCT,
} from '../components/data-display/ProductDetails/demoProduct'

const ROLES = [
  { id: 'customer', label: 'Customer' },
  { id: 'company', label: 'Company' },
  { id: 'supplier', label: 'Supplier / Factory' },
  { id: 'admin', label: 'Admin' },
]

export default function ProductDetailsPage() {
  const [role, setRole] = useState('customer')
  const product = role === 'admin' ? ADMIN_PRODUCT : DEMO_PRODUCT

  return (
    <section className="w-full bg-gray-100 px-3 py-6 sm:px-6 lg:px-10 xl:px-16">
      <div className="mx-auto w-full max-w-[1200px]">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--primary-text)]">
            Product Details
          </h1>
          <p className="mt-1 text-sm text-[var(--secondary-text)]">
            Common component — switch role to compare layouts.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {ROLES.map((item) => {
              const active = role === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setRole(item.id)}
                  className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                    active
                      ? 'bg-[var(--active)] text-white'
                      : 'border border-gray-200 bg-white text-[var(--primary-text)] hover:border-[var(--active)]'
                  }`}
                >
                  {item.label}
                </button>
              )
            })}
          </div>
        </header>

        <ProductDetails
          role={role}
          product={product}
          onAction={(actionId, prod, qty) => {
            console.log(role, actionId, prod?.title, qty)
          }}
        />
      </div>
    </section>
  )
}
