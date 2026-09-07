export default function CartPageSkeleton() {
  return (
    <div className="w-full bg-[#F9FAFB] py-6 sm:py-8 lg:py-10 animate-pulse">
      <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8 xl:gap-10">
          <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="h-6 w-48 rounded bg-gray-200 sm:h-7 mb-5"></div>
            
            <div className="mt-5 hidden border-b border-gray-200 pb-3 md:grid md:grid-cols-[auto_minmax(0,1fr)_100px_140px_100px_40px] md:items-center md:gap-4">
              <div className="size-6 rounded-full bg-gray-200"></div>
              <div className="h-4 w-20 rounded bg-gray-200"></div>
              <div className="h-4 w-16 rounded bg-gray-200 justify-self-center"></div>
              <div className="h-4 w-16 rounded bg-gray-200 justify-self-center"></div>
              <div className="h-4 w-16 rounded bg-gray-200 justify-self-end"></div>
              <div></div>
            </div>

            <ul className="mt-2 divide-y divide-gray-100 md:mt-0">
              {[1, 2, 3].map((i) => (
                <li
                  key={i}
                  className="grid grid-cols-[auto_1fr] gap-3 py-4 md:grid-cols-[auto_minmax(0,1fr)_100px_140px_100px_40px] md:items-center md:gap-4"
                >
                  <div className="size-6 rounded-full bg-gray-200"></div>
                  
                  <div className="col-span-1 flex min-w-0 gap-3 md:col-auto">
                    <div className="size-14 shrink-0 rounded-md bg-gray-200 sm:size-16"></div>
                    <div className="self-center">
                      <div className="h-4 w-32 rounded bg-gray-200"></div>
                    </div>
                  </div>
                  
                  <div className="col-span-2 flex flex-wrap items-center justify-between gap-3 pl-9 md:contents md:pl-0">
                    <div className="flex justify-center md:justify-self-center">
                      <div className="h-4 w-16 rounded bg-gray-200"></div>
                    </div>
                    
                    <div className="flex justify-center md:justify-self-center">
                      <div className="h-10 w-28 rounded-md bg-gray-200"></div>
                    </div>
                    
                    <div className="flex justify-end md:justify-self-end">
                      <div className="h-4 w-16 rounded bg-gray-200"></div>
                    </div>
                    
                    <div className="flex size-9 items-center justify-center rounded-md bg-gray-200 md:justify-self-end"></div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6 lg:sticky lg:top-32">
            <div className="h-6 w-32 rounded bg-gray-200 sm:h-7 mb-6"></div>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <div className="h-4 w-20 rounded bg-gray-200"></div>
                <div className="h-4 w-16 rounded bg-gray-200"></div>
              </div>
              <div className="flex justify-between">
                <div className="h-4 w-16 rounded bg-gray-200"></div>
                <div className="h-4 w-16 rounded bg-gray-200"></div>
              </div>
              <div className="flex justify-between">
                <div className="h-4 w-32 rounded bg-gray-200"></div>
                <div className="h-4 w-16 rounded bg-gray-200"></div>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <div className="h-10 flex-1 rounded-md bg-gray-200"></div>
              <div className="h-10 w-24 shrink-0 rounded-md bg-gray-200"></div>
            </div>

            <div className="my-6 border-t border-gray-200"></div>

            <div className="flex items-center justify-between font-bold">
              <div className="h-5 w-16 rounded bg-gray-200"></div>
              <div className="h-5 w-24 rounded bg-gray-200"></div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="h-12 w-full rounded-md bg-gray-200"></div>
              <div className="h-12 w-full rounded-md bg-gray-200"></div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
