import Shimmer from "@/components/ui/Shimmer"

export default function ScheduleSkeleton() {
  return (
    <div className="flex-1 min-w-0 h-full overflow-y-auto w-full bg-[var(--color-bg)]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <Shimmer />
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <div className="h-9 w-48 bg-gray-200 rounded-lg"></div>
            <div className="h-4 w-64 bg-gray-100 rounded-md"></div>
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded-md shrink-0"></div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-xl border border-gray-100"></div>
          ))}
        </div>
      </main>
    </div>
  )
}
