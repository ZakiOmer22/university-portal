import Image from "next/image";

interface User {
  fullName: string;
  role: string;
  profilePicture?: string;
}

interface ProfileHeaderProps {
  user: User | null;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <section className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-700 rounded-3xl shadow-2xl overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]"></div>
      </div>
      
      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between p-8">
        {/* User Info */}
        <div className="flex items-center gap-6 mb-6 lg:mb-0">
          <div className="relative">
            <div className="absolute -inset-2 bg-white/20 rounded-2xl blur-sm"></div>
            <Image
              src={
                user?.profilePicture ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || "Leader")}&background=ffffff&color=4F46E5&bold=true&size=128`
              }
              alt="Leader Profile"
              width={100}
              height={100}
              className="relative rounded-2xl object-cover shadow-2xl border-4 border-white/20"
            />
            {/* Online Status */}
            <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
          </div>
          
          <div className="text-white">
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.fullName?.split(" ")[0]}! 👨‍💼
            </h1>
            <div className="flex items-center gap-4 text-white/90">
              <span className="capitalize text-lg font-semibold bg-white/20 px-3 py-1 rounded-full">
                {user?.role}
              </span>
              <span className="text-white/70">•</span>
              <span className="flex items-center gap-2 font-medium">
                <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></div>
                Active Leader
              </span>
            </div>
          </div>
        </div>

        {/* Stats - Updated for Leader Role */}
        <div className="flex gap-4">
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20 min-w-[100px]">
            <div className="text-2xl font-bold text-white">24</div>
            <div className="text-white/80 text-sm">Students</div>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20 min-w-[100px]">
            <div className="text-2xl font-bold text-white">8</div>
            <div className="text-white/80 text-sm">Courses</div>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20 min-w-[100px]">
            <div className="text-2xl font-bold text-white">12</div>
            <div className="text-white/80 text-sm">Tasks</div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative z-10 px-8 pb-6">
        <div className="flex items-center justify-between text-white/80 text-sm mb-2">
          <span>Leadership Progress</span>
          <span>85%</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-2 rounded-full shadow-lg shadow-emerald-500/25"
            style={{ width: '85%' }}
          ></div>
        </div>
      </div>
    </section>
  );
}