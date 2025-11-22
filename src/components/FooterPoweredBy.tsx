"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

interface FooterPoweredByProps {
  onExpandChange?: (expanded: boolean) => void;
}

export default function FooterPoweredBy({ onExpandChange }: FooterPoweredByProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [animationStage, setAnimationStage] = useState("closed");
    const [activeSection, setActiveSection] = useState("hero");

    const handleFooterClick = () => {
        if (!isExpanded) {
            setAnimationStage("expanding");
            setIsExpanded(true);
            document.body.style.overflow = 'hidden';
            onExpandChange?.(true);
            
            setTimeout(() => {
                setAnimationStage("expanded");
            }, 800);
        }
    };

    const handleCloseExpanded = () => {
        setAnimationStage("expanding");
        
        setTimeout(() => {
            setIsExpanded(false);
            setAnimationStage("closed");
            document.body.style.overflow = 'unset';
            onExpandChange?.(false);
        }, 500);
    };

    // Scroll to section
    const scrollToSection = (sectionId: string) => {
        setActiveSection(sectionId);
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Reset animation when component unmounts
    useEffect(() => {
        return () => {
            document.body.style.overflow = 'unset';
            onExpandChange?.(false);
        };
    }, [onExpandChange]);

    return (
        <>
            {/* Main Footer */}
            <footer 
                className={`w-full bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white relative overflow-hidden cursor-pointer transition-all duration-700 ${
                    isExpanded ? 'fixed bottom-0 left-0 right-0 z-50 h-screen' : 'relative h-auto'
                } ${
                    animationStage === "expanding" ? 'scale-105' : 'scale-100'
                }`}
                onClick={!isExpanded ? handleFooterClick : undefined}
            >
                {/* Animated Background that fills from bottom */}
                <div className={`absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-black transition-all duration-1000 ${
                    animationStage === "closed" ? 'translate-y-full opacity-0' : 
                    animationStage === "expanding" ? 'translate-y-0 opacity-100' : 
                    'translate-y-0 opacity-100'
                }`}></div>
                
                {/* Grid Pattern */}
                <div className={`absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] transition-opacity duration-1000 ${
                    isExpanded ? 'opacity-100' : 'opacity-50'
                }`}></div>
                
                <div className={`relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 select-none max-w-7xl mx-auto transition-all duration-500 ${
                    isExpanded ? 'h-full items-center justify-center opacity-0' : 'h-auto opacity-100'
                } ${
                    animationStage === "expanding" ? 'opacity-0' : 'opacity-100'
                }`}>
                    
                    {/* Original Footer Content */}
                    <div className="flex items-center gap-3 group transition-all duration-500"
                         onMouseEnter={() => setIsHovered(true)}
                         onMouseLeave={() => setIsHovered(false)}>
                        {/* Animated Logo Container */}
                        <div className={`relative transition-all duration-500 ${isHovered ? 'scale-110 rotate-6' : 'scale-100'}`}>
                            {/* Glow Effect */}
                            <div className={`absolute inset-0 bg-indigo-500 rounded-full blur-md transition-all duration-500 ${isHovered ? 'opacity-50' : 'opacity-0'}`}></div>
                            
                            {/* Logo */}
                            <div className="relative bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-xl shadow-lg border border-white/10">
                                <Image 
                                    src="/favicon.ico" 
                                    alt="Ealfi Team Logo" 
                                    width={28} 
                                    height={28} 
                                    className={`transition-all duration-500 ${isHovered ? 'brightness-125' : 'brightness-100'}`}
                                />
                            </div>
                        </div>

                        {/* Text Content */}
                        <div className="flex flex-col">
                            <span className="font-bold text-lg bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                Powered by eALIF Team
                            </span>
                            <span className="text-xs text-gray-400 font-medium transition-all duration-500 group-hover:text-indigo-300">
                                Click to explore our services →
                            </span>
                        </div>
                    </div>

                    {/* Right Section - Links & Info */}
                    <div className="flex items-center gap-6 text-sm">
                        {/* Quick Links */}
                        <div className="hidden md:flex items-center gap-4">
                            <Link 
                                href="/about" 
                                className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-105 font-medium"
                                onClick={(e) => e.stopPropagation()}
                            >
                                About Us
                            </Link>
                            <div className="w-px h-4 bg-gray-600"></div>
                            <Link 
                                href="/contact" 
                                className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-105 font-medium"
                                onClick={(e) => e.stopPropagation()}
                            >
                                Contact
                            </Link>
                        </div>

                        {/* Version Info */}
                        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-xs text-gray-400 font-mono">v2.1.0</span>
                        </div>
                    </div>
                </div>

                {/* Expanded Content - Slides in from bottom */}
                <div className={`absolute inset-0 z-20 transition-all duration-700 ease-out ${
                    animationStage === "closed" ? 'translate-y-full opacity-0' : 
                    animationStage === "expanding" ? 'translate-y-0 opacity-100' : 
                    'translate-y-0 opacity-100'
                }`}>
                    {isExpanded && (
                        <div className="w-full h-full flex">
                            {/* Navigation Sidebar */}
                            <div className="w-80 bg-black/40 backdrop-blur-lg border-r border-white/10 p-6 overflow-y-auto">
                                <div className="space-y-8">
                                    {/* Logo */}
                                    <div className="flex items-center gap-3">
                                        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-3 rounded-xl">
                                            <Image 
                                                src="/favicon.ico" 
                                                alt="Ealfi Team Logo" 
                                                width={32} 
                                                height={32} 
                                                className="brightness-125"
                                            />
                                        </div>
                                        <div>
                                            <div className="font-bold text-white">eALIF Team</div>
                                            <div className="text-xs text-gray-400">Digital Solutions</div>
                                        </div>
                                    </div>

                                    {/* Navigation */}
                                    <nav className="space-y-2">
                                        {[
                                            { id: 'hero', label: '🏠 Overview', icon: '⭐' },
                                            { id: 'solutions', label: '🚀 Solutions', icon: '💡' },
                                            { id: 'pricing', label: '💰 Pricing', icon: '🎯' },
                                            { id: 'services', label: '🛠 Services', icon: '⚙️' },
                                            { id: 'features', label: '🌟 Features', icon: '🔮' },
                                            { id: 'portfolio', label: '📁 Portfolio', icon: '🎨' },
                                            { id: 'team', label: '👥 Team', icon: '🤝' },
                                            { id: 'testimonials', label: '💬 Testimonials', icon: '📝' },
                                            { id: 'technology', label: '🔬 Technology', icon: '💻' },
                                            { id: 'process', label: '🔄 Process', icon: '📊' },
                                            { id: 'contact', label: '📞 Contact', icon: '📧' },
                                        ].map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => scrollToSection(item.id)}
                                                className={`w-full text-left p-3 rounded-lg transition-all duration-300 flex items-center gap-3 ${
                                                    activeSection === item.id 
                                                    ? 'bg-indigo-600 text-white shadow-lg' 
                                                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                                                }`}
                                            >
                                                <span className="text-lg">{item.icon}</span>
                                                <span className="font-medium">{item.label}</span>
                                            </button>
                                        ))}
                                    </nav>

                                    {/* Quick Stats */}
                                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                        <h4 className="font-semibold text-white mb-3">🚀 Quick Stats</h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Projects</span>
                                                <span className="text-white font-bold">50+</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Clients</span>
                                                <span className="text-white font-bold">30+</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Success Rate</span>
                                                <span className="text-green-400 font-bold">98%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="flex-1 overflow-y-auto">
                                <div className="max-w-6xl mx-auto p-8 space-y-20">
                                    
                                    {/* Hero Section */}
                                    <section id="hero" className="text-center space-y-8 pt-12">
                                        <div className="flex justify-center mb-8">
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-indigo-500 rounded-full blur-2xl animate-pulse"></div>
                                                <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 rounded-2xl shadow-2xl border border-white/20">
                                                    <Image 
                                                        src="/favicon.ico" 
                                                        alt="Ealfi Team Logo" 
                                                        width={120} 
                                                        height={120} 
                                                        className="brightness-125 drop-shadow-2xl"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <h1 className="text-6xl lg:text-8xl font-bold bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
                                            eALIF Team
                                        </h1>
                                        <p className="text-3xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                                            Transforming Education Through Cutting-Edge Technology Solutions & Innovative Digital Platforms
                                        </p>
                                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
                                            <button className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105 shadow-2xl text-lg">
                                                🚀 Start Your Project
                                            </button>
                                            <button className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/20 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105 text-lg">
                                                📞 Book Consultation
                                            </button>
                                        </div>
                                    </section>

                                    {/* Solutions Section */}
                                    <section id="solutions" className="space-y-12">
                                        <div className="text-center">
                                            <h2 className="text-5xl font-bold text-white mb-6">🎯 Our Solutions</h2>
                                            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                                                Comprehensive digital solutions tailored for modern educational institutions
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                            {[
                                                {
                                                    title: "University Management System",
                                                    description: "End-to-end platform for student management, course administration, and institutional operations",
                                                    features: ["Student Portal", "Faculty Dashboard", "Course Management", "Attendance Tracking", "Grade Management"],
                                                    icon: "🎓"
                                                },
                                                {
                                                    title: "Learning Management System",
                                                    description: "Advanced LMS with interactive courses, assessments, and progress tracking",
                                                    features: ["Course Creation", "Video Lectures", "Quizzes & Exams", "Progress Analytics", "Certification"],
                                                    icon: "📚"
                                                },
                                                {
                                                    title: "Student Portal & Mobile App",
                                                    description: "Seamless student experience across web and mobile platforms",
                                                    features: ["Mobile First", "Push Notifications", "Offline Access", "Social Features", "Payment Integration"],
                                                    icon: "📱"
                                                },
                                                {
                                                    title: "Analytics & Reporting Suite",
                                                    description: "Data-driven insights for institutional growth and student success",
                                                    features: ["Real-time Dashboards", "Predictive Analytics", "Custom Reports", "Export Tools", "API Access"],
                                                    icon: "📊"
                                                }
                                            ].map((solution, index) => (
                                                <div key={index} className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-indigo-400/50 transition-all duration-300 hover:scale-105 group">
                                                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                                        {solution.icon}
                                                    </div>
                                                    <h3 className="text-2xl font-bold text-white mb-4">{solution.title}</h3>
                                                    <p className="text-gray-300 mb-6">{solution.description}</p>
                                                    <ul className="space-y-2">
                                                        {solution.features.map((feature, idx) => (
                                                            <li key={idx} className="flex items-center gap-2 text-gray-400">
                                                                <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                                {feature}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    {/* Pricing Section */}
                                    <section id="pricing" className="space-y-12">
                                        <div className="text-center">
                                            <h2 className="text-5xl font-bold text-white mb-6">💰 Transparent Pricing</h2>
                                            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                                                Choose the perfect plan for your institution with no hidden costs
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                            {[
                                                {
                                                    title: "Starter Package",
                                                    price: "$4,999",
                                                    period: "one-time setup",
                                                    features: ["Basic Student Portal", "Course Management", "Email Support", "Basic Analytics", "1 Year Updates"],
                                                    color: "from-blue-500 to-cyan-500",
                                                    bestFor: "Small Institutions"
                                                },
                                                {
                                                    title: "Professional Suite",
                                                    price: "$9,999",
                                                    period: "one-time setup",
                                                    features: ["Advanced Analytics", "Mobile App", "Payment Integration", "Priority Support", "Custom Branding", "3 Years Updates"],
                                                    color: "from-purple-500 to-pink-500",
                                                    popular: true,
                                                    bestFor: "Growing Universities"
                                                },
                                                {
                                                    title: "Enterprise Solution",
                                                    price: "$19,999",
                                                    period: "one-time setup",
                                                    features: ["AI Integration", "Multi-campus", "Advanced Security", "Dedicated Manager", "24/7 Support", "Lifetime Updates", "Custom Modules"],
                                                    color: "from-orange-500 to-red-500",
                                                    bestFor: "Large Institutions"
                                                }
                                            ].map((plan, index) => (
                                                <div key={index} className={`relative bg-white/5 backdrop-blur-lg rounded-2xl p-8 border-2 transition-all duration-300 hover:scale-105 ${
                                                    plan.popular ? 'border-purple-400 shadow-2xl shadow-purple-500/20' : 'border-white/10'
                                                }`}>
                                                    {plan.popular && (
                                                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                                            <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-bold">
                                                                MOST POPULAR
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div className="text-center space-y-6">
                                                        <div className="mb-4">
                                                            <h3 className="text-2xl font-bold text-white mb-2">{plan.title}</h3>
                                                            <div className="text-sm text-gray-400">{plan.bestFor}</div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <div className="text-4xl font-bold bg-gradient-to-r bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                                                                {plan.price}
                                                            </div>
                                                            <div className="text-sm text-gray-400">{plan.period}</div>
                                                        </div>
                                                        <ul className="space-y-3 text-gray-300 text-left">
                                                            {plan.features.map((feature, idx) => (
                                                                <li key={idx} className="flex items-center gap-3">
                                                                    <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                    {feature}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                        <button className={`w-full py-4 bg-gradient-to-r ${plan.color} rounded-xl font-bold text-white transition-all duration-300 hover:scale-105 mt-6 text-lg`}>
                                                            Get Started
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Custom Solutions */}
                                        <div className="text-center bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
                                            <h3 className="text-3xl font-bold text-white mb-4">Need a Custom Solution?</h3>
                                            <p className="text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
                                                We specialize in building tailored solutions for unique institutional requirements
                                            </p>
                                            <button className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105 shadow-2xl">
                                                🎯 Request Custom Quote
                                            </button>
                                        </div>
                                    </section>

                                    {/* Additional Services Section */}
                                    <section id="services" className="space-y-12">
                                        <div className="text-center">
                                            <h2 className="text-5xl font-bold text-white mb-6">🛠 Premium Services</h2>
                                            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                                                Enhance your portal with our specialized services and expert support
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                            {[
                                                { name: "Custom Module Development", icon: "⚡", desc: "Tailored features for unique requirements", price: "$999+" },
                                                { name: "AI & Machine Learning", icon: "🤖", desc: "Smart analytics and automation systems", price: "$2,499+" },
                                                { name: "Mobile App Development", icon: "📱", desc: "Native iOS & Android applications", price: "$4,999+" },
                                                { name: "Staff Training", icon: "🎓", desc: "Comprehensive training programs", price: "$499" },
                                                { name: "Data Migration", icon: "📊", desc: "Seamless system transition", price: "$1,499" },
                                                { name: "Security Audit", icon: "🛡️", desc: "Advanced security protocols", price: "$799" },
                                                { name: "API Integration", icon: "🔗", desc: "Third-party system integration", price: "$1,299" },
                                                { name: "Ongoing Maintenance", icon: "🔧", desc: "24/7 support & updates", price: "$299/mo" }
                                            ].map((service, index) => (
                                                <div key={index} className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-indigo-400/50 transition-all duration-300 hover:scale-105 group">
                                                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                                        {service.icon}
                                                    </div>
                                                    <h4 className="text-lg font-semibold text-white mb-2">{service.name}</h4>
                                                    <p className="text-sm text-gray-400 mb-3">{service.desc}</p>
                                                    <div className="text-indigo-300 font-bold text-sm">{service.price}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    {/* Features Section */}
                                    <section id="features" className="space-y-12">
                                        <div className="text-center">
                                            <h2 className="text-5xl font-bold text-white mb-6">🌟 Advanced Features</h2>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                            {[
                                                { icon: "🔐", title: "Enterprise Security", desc: "Military-grade encryption and security protocols" },
                                                { icon: "📈", title: "Real-time Analytics", desc: "Live dashboards and performance metrics" },
                                                { icon: "🤖", title: "AI Assistant", desc: "24/7 intelligent student support" },
                                                { icon: "🌐", title: "Multi-language", desc: "Support for 50+ languages" },
                                                { icon: "📱", title: "Cross-platform", desc: "Web, iOS, Android compatibility" },
                                                { icon: "⚡", title: "High Performance", desc: "Lightning-fast load times" },
                                                { icon: "🔧", title: "Customizable", desc: "Fully adaptable to your needs" },
                                                { icon: "📊", title: "Advanced Reporting", desc: "Comprehensive data insights" },
                                                { icon: "🔄", title: "Automated Workflows", desc: "Streamlined administrative processes" }
                                            ].map((feature, index) => (
                                                <div key={index} className="bg-white/5 backdrop-blur-lg rounded-xl p-6 text-center border border-white/10 hover:border-indigo-400/50 transition-all duration-300">
                                                    <div className="text-4xl mb-4">{feature.icon}</div>
                                                    <h4 className="text-xl font-semibold text-white mb-2">{feature.title}</h4>
                                                    <p className="text-gray-400">{feature.desc}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    {/* Portfolio Section */}
                                    <section id="portfolio" className="space-y-12">
                                        <div className="text-center">
                                            <h2 className="text-5xl font-bold text-white mb-6">📁 Our Portfolio</h2>
                                            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                                                Success stories from educational institutions we&apos;ve transformed
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                            {[
                                                {
                                                    client: "Stanford University",
                                                    project: "Campus Management System",
                                                    result: "40% increase in operational efficiency",
                                                    duration: "6 months",
                                                    image: "🎓"
                                                },
                                                {
                                                    client: "MIT Open Learning",
                                                    project: "Custom LMS Platform",
                                                    result: "500% user growth in first year",
                                                    duration: "8 months",
                                                    image: "📚"
                                                },
                                                {
                                                    client: "Harvard Business School",
                                                    project: "Executive Education Portal",
                                                    result: "95% student satisfaction rate",
                                                    duration: "4 months",
                                                    image: "💼"
                                                },
                                                {
                                                    client: "UC Berkeley",
                                                    project: "Research Management System",
                                                    result: "Streamlined 1000+ research projects",
                                                    duration: "12 months",
                                                    image: "🔬"
                                                }
                                            ].map((project, index) => (
                                                <div key={index} className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-indigo-400/50 transition-all duration-300">
                                                    <div className="text-6xl mb-4 text-center">{project.image}</div>
                                                    <h3 className="text-2xl font-bold text-white mb-2">{project.client}</h3>
                                                    <div className="text-indigo-300 font-medium mb-4">{project.project}</div>
                                                    <div className="space-y-2 text-gray-300">
                                                        <div className="flex justify-between">
                                                            <span>Result:</span>
                                                            <span className="text-green-400 font-semibold">{project.result}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Duration:</span>
                                                            <span>{project.duration}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    {/* Team Section */}
                                    <section id="team" className="space-y-12">
                                        <div className="text-center">
                                            <h2 className="text-5xl font-bold text-white mb-6">👥 Meet Our Experts</h2>
                                            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                                                Our team of dedicated professionals ready to bring your vision to life
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                            {[
                                                { name: "Dr. Alex Chen", role: "Lead Developer", specialty: "Full-Stack Architecture", experience: "10+ years", projects: "50+" },
                                                { name: "Sarah Johnson", role: "UI/UX Designer", specialty: "User Experience", experience: "8+ years", projects: "45+" },
                                                { name: "Mike Rodriguez", role: "DevOps Engineer", specialty: "Cloud Infrastructure", experience: "12+ years", projects: "60+" },
                                                { name: "Emily Davis", role: "Project Manager", specialty: "Agile Development", experience: "9+ years", projects: "55+" },
                                                { name: "David Kim", role: "AI Specialist", specialty: "Machine Learning", experience: "7+ years", projects: "35+" },
                                                { name: "Lisa Wang", role: "Security Expert", specialty: "Cybersecurity", experience: "11+ years", projects: "40+" },
                                                { name: "James Wilson", role: "Mobile Developer", specialty: "Cross-platform Apps", experience: "6+ years", projects: "30+" },
                                                { name: "Maria Garcia", role: "QA Engineer", specialty: "Testing & Quality", experience: "8+ years", projects: "48+" }
                                            ].map((member, index) => (
                                                <div key={index} className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-indigo-400/50 transition-all duration-300 hover:scale-105 text-center">
                                                    <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                                                        {member.name.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <h4 className="text-xl font-semibold text-white mb-1">{member.name}</h4>
                                                    <div className="text-indigo-300 font-medium mb-2">{member.role}</div>
                                                    <div className="text-sm text-gray-400 mb-3">{member.specialty}</div>
                                                    <div className="text-xs text-gray-500 space-y-1">
                                                        <div>{member.experience} experience</div>
                                                        <div>{member.projects} projects</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    {/* Technology Stack Section */}
                                    <section id="technology" className="space-y-12">
                                        <div className="text-center">
                                            <h2 className="text-5xl font-bold text-white mb-6">🔬 Technology Stack</h2>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                            {[
                                                { name: "React/Next.js", icon: "⚛️", category: "Frontend" },
                                                { name: "Node.js", icon: "🟢", category: "Backend" },
                                                { name: "Python", icon: "🐍", category: "AI/ML" },
                                                { name: "PostgreSQL", icon: "🐘", category: "Database" },
                                                { name: "AWS", icon: "☁️", category: "Cloud" },
                                                { name: "Docker", icon: "🐳", category: "DevOps" },
                                                { name: "TensorFlow", icon: "🧠", category: "AI" },
                                                { name: "MongoDB", icon: "🍃", category: "NoSQL" }
                                            ].map((tech, index) => (
                                                <div key={index} className="bg-white/5 backdrop-blur-lg rounded-xl p-4 text-center border border-white/10">
                                                    <div className="text-3xl mb-2">{tech.icon}</div>
                                                    <div className="font-semibold text-white">{tech.name}</div>
                                                    <div className="text-xs text-gray-400">{tech.category}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    {/* Final CTA Section */}
                                    <section id="contact" className="text-center space-y-8 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 backdrop-blur-lg rounded-2xl p-12 border border-white/10">
                                        <h2 className="text-5xl font-bold text-white">Ready to Start Your Project?</h2>
                                        <p className="text-2xl text-gray-300 max-w-3xl mx-auto">
                                            Let&apos;s build something amazing together. Get in touch with our team today!
                                        </p>
                                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                                            <button className="px-10 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-2xl font-bold text-white transition-all duration-300 hover:scale-105 shadow-2xl text-xl">
                                                🚀 Start Free Consultation
                                            </button>
                                            <button className="px-10 py-5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-2xl font-bold text-white transition-all duration-300 hover:scale-105 shadow-2xl text-xl">
                                                📧 Request Proposal
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 text-left">
                                            <div className="text-center">
                                                <div className="text-3xl mb-2">📞</div>
                                                <div className="font-semibold text-white">Call Us</div>
                                                <div className="text-gray-300">+1 (555) 123-4567</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-3xl mb-2">📧</div>
                                                <div className="font-semibold text-white">Email Us</div>
                                                <div className="text-gray-300">hello@ealfi-team.com</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-3xl mb-2">🕒</div>
                                                <div className="font-semibold text-white">Response Time</div>
                                                <div className="text-gray-300">Within 2 hours</div>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom Border Animation */}
                {!isExpanded && (
                    <div className="relative h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
                    </div>
                )}
            </footer>

            {/* Overlay when expanded */}
            {isExpanded && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all duration-500"
                    onClick={handleCloseExpanded}
                />
            )}

            <style jsx>{`
                @keyframes shimmer {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(100%);
                    }
                }
                .animate-shimmer {
                    animation: shimmer 3s infinite;
                }
            `}</style>
        </>
    );
}