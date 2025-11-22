export default function DashboardSkeleton() {
    return (
        <div className="space-y-8 animate-pulse">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="lg:hidden w-10 h-10 bg-gray-300 rounded-lg"></div>
                    <div className="space-y-3">
                        <div className="h-10 w-80 bg-gray-300 rounded-lg"></div>
                        <div className="h-5 w-96 bg-gray-300 rounded"></div>
                    </div>
                </div>
                <div className="hidden lg:flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                    <div className="space-y-2">
                        <div className="h-4 w-32 bg-gray-300 rounded"></div>
                        <div className="h-3 w-24 bg-gray-300 rounded"></div>
                    </div>
                </div>
            </div>

            {/* Profile Header Skeleton */}
            <div className="relative bg-gradient-to-r from-gray-300 to-gray-400 rounded-3xl shadow-2xl overflow-hidden p-8">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
                    {/* User Info Skeleton */}
                    <div className="flex items-center gap-6 mb-6 lg:mb-0">
                        <div className="relative">
                            <div className="w-24 h-24 bg-gray-400 rounded-2xl"></div>
                        </div>
                        <div className="space-y-3">
                            <div className="h-8 w-64 bg-gray-400 rounded"></div>
                            <div className="flex items-center gap-4">
                                <div className="h-6 w-20 bg-gray-400 rounded-full"></div>
                                <div className="h-6 w-24 bg-gray-400 rounded"></div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Skeleton */}
                    <div className="flex gap-4">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="bg-gray-400/50 rounded-2xl p-4 min-w-[100px]">
                                <div className="h-7 w-8 bg-gray-400 rounded mb-2 mx-auto"></div>
                                <div className="h-4 w-12 bg-gray-400 rounded mx-auto"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Progress Bar Skeleton */}
                <div className="mt-6 px-8 pb-6">
                    <div className="flex items-center justify-between mb-2">
                        <div className="h-4 w-32 bg-gray-400 rounded"></div>
                        <div className="h-4 w-8 bg-gray-400 rounded"></div>
                    </div>
                    <div className="w-full bg-gray-400/50 rounded-full h-2"></div>
                </div>
            </div>

            {/* Main Content Skeleton */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="h-6 w-64 bg-gray-300 rounded mb-6"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="h-40 bg-gray-200 rounded-xl"></div>
                    ))}
                </div>
            </div>
        </div>
    );
}