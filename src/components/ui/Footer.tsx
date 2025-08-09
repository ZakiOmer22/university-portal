import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-indigo-900 text-white pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* About */}
        <div>
          <h3 className="font-bold text-lg mb-4">University of Hargeisa</h3>
          <p className="text-gray-300 max-w-xs mb-4">
            Committed to academic excellence and community service in Somaliland and beyond.
          </p>
          <div className="flex gap-4 text-xl">
            <a href="#" className="hover:text-gray-400"><FaFacebook /></a>
            <a href="#" className="hover:text-gray-400"><FaTwitter /></a>
            <a href="#" className="hover:text-gray-400"><FaLinkedin /></a>
            <a href="#" className="hover:text-gray-400"><FaInstagram /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-bold text-lg mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/academics/undergraduate" className="hover:underline">Undergraduate Programs</a></li>
            <li><a href="/academics/graduate" className="hover:underline">Graduate Programs</a></li>
            <li><a href="/admissions/apply" className="hover:underline">Admissions</a></li>
            <li><a href="/student-life/clubs" className="hover:underline">Student Life</a></li>
            <li><a href="/resources/library" className="hover:underline">Library</a></li>
          </ul>
        </div>

        {/* News & Events */}
        <div>
          <h3 className="font-bold text-lg mb-4">News & Events</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/blog" className="hover:underline">Latest News</a></li>
            <li><a href="/events" className="hover:underline">Upcoming Events</a></li>
            <li><a href="/research" className="hover:underline">Research Highlights</a></li>
            <li><a href="/achievements" className="hover:underline">Achievements</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-bold text-lg mb-4">Contact Us</h3>
          <address className="not-italic text-sm space-y-2 text-gray-300">
            <p>University of Hargeisa</p>
            <p>Hargeisa, Somaliland</p>
            <p>Email: info@uoh.edu.so</p>
            <p>Phone: +252 63 1234567</p>
          </address>
        </div>
      </div>

      {/* Bottom */}
      <div className="text-center text-xs mt-10 opacity-70 border-t border-indigo-800 pt-4">
        &copy; {new Date().getFullYear()} University of Hargeisa. All rights reserved.
      </div>
    </footer>
  );
}
