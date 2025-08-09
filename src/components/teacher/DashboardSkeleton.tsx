export default function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Profile Skeleton */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-300"></div>
        <div className="space-y-2">
          <div className="h-4 w-48 bg-gray-300 rounded"></div>
          <div className="h-3 w-32 bg-gray-300 rounded"></div>
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-40 bg-gray-300 rounded-lg"></div>
        <div className="h-40 bg-gray-300 rounded-lg"></div>
        <div className="h-40 bg-gray-300 rounded-lg"></div>
      </div>
    </div>
  );
}
