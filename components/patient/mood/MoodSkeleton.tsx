import Shimmer from "@/components/ui/Shimmer"

export default function MoodSkeleton() {
  return (
    <div className="flex-1 min-w-0 h-full flex flex-col relative w-full overflow-hidden bg-[var(--color-bg)]">
      <Shimmer />
      <header className="sticky top-0 z-10 border-b border-[var(--color-border)] bg-white/95 backdrop-blur px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-6 w-32 bg-gray-200 rounded-md"></div>
            <div className="h-4 w-48 bg-gray-100 rounded-md"></div>
          </div>
          <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
        </div>
      </header>

      <main className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-32 bg-gray-100 rounded-3xl"></div>
          <div className="h-32 bg-gray-100 rounded-3xl"></div>
          <div className="h-32 bg-gray-100 rounded-3xl"></div>
        </div>
        
        <div className="h-64 bg-gray-50 rounded-[32px] border border-gray-100"></div>
        
        <div className="space-y-4">
          <div className="h-6 w-40 bg-gray-200 rounded-md"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-50 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
