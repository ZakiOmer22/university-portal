import Image from "next/image";

export default function Hero() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center px-6 sm:px-12 lg:px-16">
        {/* Left Text Content */}
        <div className="md:w-1/2 text-center md:text-left">
          <h1
            className="font-extrabold text-indigo-900 mb-6 leading-tight"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)", // Fluid responsive font size
              lineHeight: 1.2,
            }}
          >
            Welcome to the University Portal
          </h1>
          <p className="text-gray-700 mb-8 max-w-lg mx-auto md:mx-0 text-base sm:text-lg leading-relaxed">
            Manage your courses, connect with faculty, and access academic resources all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start max-w-xs mx-auto md:mx-0">
            <a
              href="/auth/login"
              className="px-8 py-3 bg-indigo-900 text-white rounded-lg font-semibold hover:bg-indigo-700 transition text-center"
            >
              Login
            </a>
            <a
              href="/auth/register"
              className="px-8 py-3 border-2 border-indigo-900 text-indigo-900 rounded-lg font-semibold hover:bg-indigo-50 transition text-center"
            >
              Register
            </a>
          </div>
        </div>

        {/* Right Image Content */}
        <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
          <Image
            src="/icon.png" // Replace with an actual image URL or import
            alt="University building"
            width={400}
            height={300}
            className="rounded-lg shadow-lg object-contain max-w-full h-auto"
            priority={true} // if this is a key visual, loads faster
          />
        </div>
      </div>
    </section>
  );
}
