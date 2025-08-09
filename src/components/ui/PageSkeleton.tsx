import SkeletonLoader from "./SkeletonLoader";

export default function PageSkeleton() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Skeleton */}
      <SkeletonLoader width="50%" height="2.5rem" />

      {/* Grid of skeleton cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-4"
          >
            <SkeletonLoader height="150px" /> {/* Image Placeholder */}
            <SkeletonLoader width="80%" height="1.5rem" />
            <SkeletonLoader width="60%" height="1rem" />
          </div>
        ))}
      </div>
    </div>
  );
}