import ProductDetailsSkeleton from '@/components/data-display/ProductDetails/ProductDetailsSkeleton'

export default function ProductDetailPageSkeleton() {
  return (
    <div className="w-full bg-white py-6 sm:py-8 lg:py-10">
      <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8">
        <ProductDetailsSkeleton />
      </div>
    </div>
  )
}
