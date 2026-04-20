import Shimmer from "@/components/ui/Shimmer"

export default function CreditsSkeleton() {
  return (
    <div className="flex-1 overflow-y-auto px-10 py-10 bg-[#fafdfc] relative overflow-hidden">
      <Shimmer />
      <header className="mb-10 w-full max-w-5xl mx-auto flex items-end justify-between">
        <div className="space-y-3">
          <div className="h-9 w-48 bg-gray-200 rounded-lg"></div>
          <div className="h-4 w-64 bg-gray-100 rounded-md"></div>
        </div>
      </header>

      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 flex flex-col gap-6">
          <div className="h-64 bg-green-100 rounded-[32px] relative overflow-hidden">
             <Shimmer />
          </div>
          <div className="h-48 bg-gray-50 rounded-[24px] border border-gray-100"></div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="h-7 w-40 bg-gray-200 rounded-md"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-40 bg-white border border-gray-100 rounded-[24px]"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
