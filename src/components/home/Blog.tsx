"use client";

import Image from "next/image";
import { useState } from "react";

const blogPosts = [
  {
    id: 1,
    title: "AI Revolutionizing Higher Education",
    date: "Aug 5, 2025",
    author: "Prof. Ahmed Musa",
    excerpt: "AI tools are reshaping how students learn and how universities deliver knowledge...",
    image: "https://images.unsplash.com/photo-1581091215367-59ab6e269fda?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "Top 10 Skills Employers Want in 2025",
    date: "July 30, 2025",
    author: "Career Services",
    excerpt: "Learn the skills that will set you apart in a competitive job market...",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "University Expands Research Funding",
    date: "July 20, 2025",
    author: "Research Department",
    excerpt: "New grants open doors for students and faculty to engage in world-class research...",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80",
  },
];

export default function Blog() {
  const [imgError, setImgError] = useState<{ [key: number]: boolean }>({});

  return (
    <section className="py-20 bg-gray-50" id="blog">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-4 text-indigo-900">Latest News & Blogs</h2>
        <p className="text-lg text-gray-600 mb-12">
          Stay updated with the latest news, research, and campus happenings.
        </p>

        <div className="grid md:grid-cols-3 gap-10">
          {blogPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition"
            >
              {/* Blog Image */}
              <div className="relative h-56 w-full">
                {!imgError[post.id] ? (
                  <Image
                    src={post.image}
                    alt={post.title}
                    layout="fill"
                    objectFit="cover"
                    onError={() => setImgError((prev) => ({ ...prev, [post.id]: true }))}
                  />
                ) : (
                  <img
                    src="https://via.placeholder.com/400x250?text=Image+Not+Available"
                    alt="Fallback"
                    className="w-full h-56 object-cover"
                  />
                )}
              </div>

              {/* Blog Content */}
              <div className="p-6 text-left">
                <h3 className="text-xl font-semibold text-indigo-800 mb-2 hover:underline cursor-pointer">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-500 mb-3">
                  {post.date} • By {post.author}
                </p>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <a
                  href="#"
                  className="text-indigo-600 hover:text-indigo-800 font-semibold"
                >
                  Read More →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
