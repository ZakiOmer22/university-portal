export default function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Profile Skeleton */}
      <div className="bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gray-400/50"></div>
            <div className="space-y-2">
              <div className="h-5 w-32 bg-gray-400/50 rounded"></div>
              <div className="h-3 w-24 bg-gray-400/50 rounded"></div>
            </div>
          </div>
          <div className="hidden sm:flex gap-3">
            <div className="bg-white/20 rounded-lg p-3 min-w-[50px]">
              <div className="h-4 w-6 bg-gray-400/50 rounded mx-auto mb-1"></div>
              <div className="h-2 w-8 bg-gray-400/50 rounded"></div>
            </div>
            <div className="bg-white/20 rounded-lg p-3 min-w-[50px]">
              <div className="h-4 w-6 bg-gray-400/50 rounded mx-auto mb-1"></div>
              <div className="h-2 w-8 bg-gray-400/50 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="bg-white/80 rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="h-7 w-48 bg-gray-300 rounded"></div>
          <div className="h-4 w-24 bg-gray-300 rounded"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="bg-gray-200 rounded-xl p-4 h-32">
              <div className="h-5 w-3/4 bg-gray-300 rounded mb-3"></div>
              <div className="h-3 w-full bg-gray-300 rounded mb-2"></div>
              <div className="h-3 w-2/3 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}