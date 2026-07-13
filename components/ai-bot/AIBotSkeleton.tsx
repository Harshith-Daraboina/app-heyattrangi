import Shimmer from "@/components/ui/Shimmer"

export default function AIBotSkeleton() {
  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-gray-50 font-sans">
      <Shimmer />
      <div className="mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 overflow-hidden relative">
        {/* Sidebar Skeleton */}
        <div className="relative z-10 flex w-[360px] shrink-0 flex-col items-center border-r border-gray-200 bg-white/90 px-6 py-8 backdrop-blur-md md:w-[400px]">
          <div className="h-8 w-32 bg-gray-200 rounded-lg mb-8 animate-pulse"></div>
          
          <div className="h-[320px] w-[320px] rounded-[2.5rem] bg-gray-100 mb-8 overflow-hidden relative">
            <Shimmer />
          </div>

          <div className="h-6 w-24 bg-gray-200 rounded-full mb-10 animate-pulse"></div>

          <div className="mt-auto w-full max-w-[280px] space-y-3">
            <div className="h-14 bg-gray-100 rounded-[16px] animate-pulse"></div>
            <div className="h-14 bg-gray-200 rounded-[16px] animate-pulse"></div>
          </div>
        </div>

        {/* Chat Area Skeleton */}
        <div className="relative flex min-h-0 flex-1 justify-center overflow-y-auto bg-[#fafcfd] p-12">
            <div className="flex h-full w-full max-w-xl flex-col justify-center space-y-6">
                <div className="h-10 w-64 bg-gray-200 rounded-lg animate-pulse mb-4"></div>
                <div className="h-20 bg-white border border-gray-100 rounded-2xl animate-pulse"></div>
                <div className="h-20 bg-white border border-gray-100 rounded-2xl animate-pulse"></div>
                <div className="h-20 bg-white border border-gray-100 rounded-2xl animate-pulse"></div>
            </div>
        </div>
      </div>
    </div>
  )
}
