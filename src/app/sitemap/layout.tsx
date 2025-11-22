import type { Metadata } from 'next'

export const metadata: Metadata = {
  description: "Explore the complete sitemap of our university portal. Find all academic programs, departments, admissions information, and student resources in one place.",
  keywords: "university sitemap, academic programs, departments, admissions, student resources, campus navigation",
  openGraph: {
    title: "University Portal Sitemap",
    description: "Complete navigation guide for our university portal",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function SitemapLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}