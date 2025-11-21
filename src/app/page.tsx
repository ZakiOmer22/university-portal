"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  FiBook, 
  FiUsers, 
  FiAward, 
  FiCalendar, 
  FiStar, 
  FiTrendingUp,
  FiCheckCircle,
  FiMapPin,
  FiClock,
  FiBarChart2,
  FiGlobe,
  FiHeart,
  FiTarget,
  FiShield,
  FiLayers,
  FiZap,
  FiCode,
  FiBriefcase,
  FiBookOpen,
  FiUserCheck
} from "react-icons/fi";

export default function Home() {
  const router = useRouter();

  // useEffect(() => {
  //   const userRaw = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  //   if (userRaw) {
  //     try {
  //       const user = JSON.parse(userRaw);
  //       if (user?.activated) {
  //         router.replace("/dashboard");
  //       } else {
  //         router.replace("/auth/activation-pending");
  //       }
  //     } catch {
  //       localStorage.removeItem("user");
  //     }
  //   }
  // }, [router]);

  const departments = [
    {
      name: "Computer Science",
      description: "Cutting-edge technology and programming education with modern curriculum",
      programs: 8,
      students: 1200,
      icon: FiCode,
      color: "from-blue-500 to-cyan-500"
    },
    {
      name: "Business Administration",
      description: "Leadership and management excellence for future entrepreneurs",
      programs: 6,
      students: 1500,
      icon: FiBriefcase,
      color: "from-green-500 to-emerald-500"
    },
    {
      name: "Engineering",
      description: "Innovation and technical expertise across multiple disciplines",
      programs: 7,
      students: 1100,
      icon: FiZap,
      color: "from-purple-500 to-pink-500"
    },
    {
      name: "Health Sciences",
      description: "Healthcare and medical education with practical training",
      programs: 5,
      students: 900,
      icon: FiHeart,
      color: "from-red-500 to-orange-500"
    }
  ];

  const programs = [
    {
      name: "Bachelor of Computer Science",
      duration: "4 years",
      type: "Undergraduate",
      students: 450,
      icon: FiBook
    },
    {
      name: "MBA Executive",
      duration: "2 years",
      type: "Graduate",
      students: 200,
      icon: FiUsers
    },
    {
      name: "Civil Engineering",
      duration: "4 years",
      type: "Undergraduate",
      students: 300,
      icon: FiTarget
    },
    {
      name: "Nursing Program",
      duration: "3 years",
      type: "Diploma",
      students: 350,
      icon: FiHeart
    }
  ];

  const achievements = [
    { number: "95%", label: "Graduation Rate", icon: FiAward },
    { number: "50+", label: "Academic Programs", icon: FiBook },
    { number: "10k+", label: "Alumni Network", icon: FiUsers },
    { number: "25+", label: "Years of Excellence", icon: FiStar }
  ];

  const features = [
    {
      title: "Modern Campus",
      description: "State-of-the-art facilities with advanced learning environments and technology",
      icon: FiMapPin
    },
    {
      title: "Expert Faculty",
      description: "Learn from industry professionals and academic experts with real-world experience",
      icon: FiUserCheck
    },
    {
      title: "Career Support",
      description: "Comprehensive career services and placement assistance for all graduates",
      icon: FiTrendingUp
    },
    {
      title: "Research Opportunities",
      description: "Engage in cutting-edge research projects and innovation initiatives",
      icon: FiTarget
    }
  ];

  const testimonials = [
    {
      name: "Ahmed Mohamed",
      role: "Computer Science Graduate",
      content: "The university provided me with the skills and opportunities to launch my career in tech. The hands-on projects were invaluable.",
      avatar: "/avatars/ahmed.jpg"
    },
    {
      name: "Aisha Hassan",
      role: "Business Administration Student",
      content: "The faculty's dedication and the practical curriculum prepared me perfectly for the business world. Highly recommended!",
      avatar: "/avatars/aisha.jpg"
    },
    {
      name: "Omar Ali",
      role: "Engineering Alumni",
      content: "The engineering program gave me a strong foundation and the confidence to tackle complex challenges in my career.",
      avatar: "/avatars/omar.jpg"
    }
  ];

  const events = [
    {
      title: "Annual Science Fair",
      date: "2024-03-15",
      location: "Main Campus",
      type: "Academic"
    },
    {
      title: "Career Development Workshop",
      date: "2024-03-20",
      location: "Business Hall",
      type: "Professional"
    },
    {
      title: "Cultural Festival",
      date: "2024-04-05",
      location: "University Grounds",
      type: "Cultural"
    },
    {
      title: "Research Symposium",
      date: "2024-04-12",
      location: "Science Building",
      type: "Academic"
    }
  ];

  const blogPosts = [
    {
      title: "The Future of AI in Education",
      excerpt: "Exploring how artificial intelligence is transforming learning methodologies and student engagement.",
      date: "2024-03-10",
      category: "Technology"
    },
    {
      title: "Sustainable Campus Initiatives",
      excerpt: "Our commitment to environmental sustainability and green campus practices for a better future.",
      date: "2024-03-08",
      category: "Sustainability"
    },
    {
      title: "Student Entrepreneurship Success",
      excerpt: "How our students are launching successful startups during their studies with university support.",
      date: "2024-03-05",
      category: "Business"
    }
  ];

  const tripleSections = [
    {
      title: "Academic Excellence",
      description: "Rigorous academic programs designed to challenge and inspire students to reach their full potential.",
      features: [
        "World-class faculty with industry experience",
        "Modern curriculum aligned with market needs",
        "Research opportunities for undergraduates",
        "International accreditation standards"
      ],
      icon: FiBookOpen,
      color: "from-blue-500 to-cyan-500",
      link: "/academics"
    },
    {
      title: "Student Success",
      description: "Comprehensive support systems to ensure every student achieves their academic and career goals.",
      features: [
        "Personalized academic advising",
        "Career counseling and placement",
        "Leadership development programs",
        "Mental health and wellness support"
      ],
      icon: FiUsers,
      color: "from-green-500 to-emerald-500",
      link: "/student-life"
    },
    {
      title: "Innovation & Technology",
      description: "Cutting-edge technology infrastructure and innovation hubs to foster creativity and research.",
      features: [
        "State-of-the-art laboratories",
        "Digital learning platforms",
        "Entrepreneurship incubators",
        "Industry partnership programs"
      ],
      icon: FiZap,
      color: "from-purple-500 to-pink-500",
      link: "/innovation"
    }
  ];

  const quickStats = [
    { number: "15,000+", label: "Students Enrolled", icon: FiUsers },
    { number: "500+", label: "Faculty Members", icon: FiUserCheck },
    { number: "100+", label: "Countries Represented", icon: FiGlobe },
    { number: "98%", label: "Employment Rate", icon: FiBriefcase }
  ];

  const campusLife = [
    {
      title: "Student Clubs",
      description: "Over 50 student-led organizations and clubs for every interest",
      icon: FiUsers,
      count: "50+"
    },
    {
      title: "Sports Facilities",
      description: "Modern gymnasium, swimming pool, and multiple sports fields",
      icon: FiZap,
      count: "15+"
    },
    {
      title: "Library Resources",
      description: "Digital and physical resources with 24/7 online access",
      icon: FiBook,
      count: "100k+"
    },
    {
      title: "Housing Options",
      description: "Safe and comfortable on-campus accommodation options",
      icon: FiMapPin,
      count: "5"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              Welcome to UniversityPortal
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 mb-8 leading-relaxed">
              Empowering Future Leaders Through Innovative Education and Cutting-Edge Technology
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/admissions/apply"
                className="bg-white text-blue-900 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg"
              >
                Start Your Application
              </Link>
              <Link
                href="/programs"
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-900 transition-colors"
              >
                Explore Programs
              </Link>
              <Link
                href="/dashboard"
                className="border-2 border-blue-300 text-blue-300 px-8 py-4 rounded-xl font-semibold hover:bg-blue-300 hover:text-blue-900 transition-colors"
              >
                Student Portal
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {quickStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="text-2xl text-blue-600" />
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Triple Sections */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Why Choose UniversityPortal
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We combine academic excellence with innovative technology to create an unparalleled educational experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {tripleSections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${section.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <section.icon className="text-2xl text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  {section.title}
                </h3>
                
                <p className="text-slate-600 mb-6 leading-relaxed">
                  {section.description}
                </p>

                <ul className="space-y-3 mb-8">
                  {section.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3 text-slate-700">
                      <FiCheckCircle className="text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={section.link}
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                >
                  Learn More
                  <FiTrendingUp className="text-lg" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              About UniversityPortal
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              UniversityPortal is a modern educational platform dedicated to transforming lives through innovative learning, 
              cutting-edge research, and comprehensive student support. We empower students to become leaders in their fields.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 bg-slate-50 rounded-2xl hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <achievement.icon className="text-2xl text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-2">
                  {achievement.number}
                </div>
                <div className="text-slate-600 font-medium">
                  {achievement.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Campus Life Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Campus Life & Facilities
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Experience a vibrant campus community with world-class facilities and endless opportunities
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {campusLife.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 bg-slate-800 rounded-2xl hover:bg-slate-750 transition-colors"
              >
                <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="text-xl text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-2">
                  {item.count}
                </div>
                <h3 className="text-lg font-semibold mb-3">
                  {item.title}
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Academic Departments
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Explore our diverse range of academic departments offering cutting-edge programs 
              and research opportunities.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {departments.map((dept, index) => (
              <motion.div
                key={dept.name}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${dept.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <dept.icon className="text-2xl text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  {dept.name}
                </h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  {dept.description}
                </p>
                <div className="flex justify-between text-sm text-slate-500">
                  <span>{dept.programs} Programs</span>
                  <span>{dept.students.toLocaleString()} Students</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Featured Programs
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Discover our most popular academic programs designed to prepare you for success 
              in today&apos;s competitive world.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {programs.map((program, index) => (
              <motion.div
                key={program.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all hover:border-blue-200"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <program.icon className="text-xl text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      {program.name}
                    </h3>
                    <p className="text-slate-600 mb-4">
                      {program.type} • {program.duration}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-500">
                        {program.students} students enrolled
                      </span>
                      <Link
                        href="/programs"
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        Learn More →
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Why Choose Our University
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              We provide an exceptional educational experience with comprehensive support 
              and world-class facilities.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="text-2xl text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">
                  {feature.title}
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Student Success Stories
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Hear from our alumni and current students about their transformative experiences.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-slate-50 rounded-2xl p-8 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <FiUsers className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-slate-600 text-sm">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed italic">
                  &quot;{testimonial.content}&quot;
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Upcoming Events
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Join us for academic, cultural, and professional development events.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {events.map((event, index) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-900">
                    {event.title}
                  </h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {event.type}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-slate-600">
                  <div className="flex items-center gap-2">
                    <FiCalendar className="text-slate-400" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMapPin className="text-slate-400" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Latest News & Insights
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Stay updated with the latest developments, research, and stories from our community.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <motion.div
                key={post.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="p-6">
                  <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium mb-4">
                    {post.category}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {post.title}
                  </h3>
                  <p className="text-slate-600 mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                    <Link
                      href="/blog"
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Join our community of learners and innovators. Take the first step toward 
              your future today at UniversityPortal.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/admissions/apply"
                className="bg-white text-blue-900 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg"
              >
                Apply Now
              </Link>
              <Link
                href="/contact"
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-900 transition-colors"
              >
                Contact Admissions
              </Link>
              <Link
                href="/dashboard"
                className="border-2 border-blue-300 text-blue-300 px-8 py-4 rounded-xl font-semibold hover:bg-blue-300 hover:text-blue-900 transition-colors"
              >
                Student Login
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}