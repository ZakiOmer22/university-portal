import Image from "next/image";

export default function ProfileHeader({ user }: { user: any }) {
  return (
    <section className="flex items-center gap-4 bg-white shadow p-4 rounded-lg">
      <Image
        src={
          user?.profilePicture ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || "User")}&background=4F46E5&color=fff`
        }
        alt="Parent Avatar"
        width={64}
        height={64}
        className="rounded-full object-cover"
      />
      <div>
        <h2 className="text-xl font-semibold">{user?.fullName?.split(" ")[0]}</h2>
        <p className="text-gray-500 capitalize">{user?.role}</p>
      </div>
    </section>
  );
}
