import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://university-portal-system.com'
  
  // Core pages that should be indexed
  const staticPages = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/academics`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/admissions`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/departments`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/student-life`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/resources`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ]

  // Academic programs
  const academicPrograms = [
    'undergraduate',
    'graduate', 
    'online',
    'computer-science',
    'business-administration',
    'accounting',
    'nursing',
    'civil-engineering',
    'education',
    'data-science',
    'information-technology',
    'graphic-design',
    'environmental-science',
    'mechanical-engineering',
    'marketing',
    'psychology',
    'philosophy',
    'physics',
    'architecture',
    'law',
    'social-work'
  ].map(program => ({
    url: `${baseUrl}/academics/${program}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Department pages
  const departments = [
    'cs',
    'business',
    'engineering',
    'humanities',
    'sciences'
  ].map(dept => ({
    url: `${baseUrl}/departments/${dept}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Admissions pages
  const admissionsPages = [
    'apply',
    'scholarships',
    'tuition',
    'visit'
  ].map(page => ({
    url: `${baseUrl}/admissions/${page}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // Student life pages
  const studentLifePages = [
    'clubs',
    'careers',
    'health',
    'housing'
  ].map(page => ({
    url: `${baseUrl}/student-life/${page}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // Resource pages
  const resourcePages = [
    'library',
    'it-support',
    'contact',
    'map'
  ].map(page => ({
    url: `${baseUrl}/resources/${page}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  // Authentication pages (lower priority)
  const authPages = [
    'login',
    'register',
    'activation-pending'
  ].map(page => ({
    url: `${baseUrl}/auth/${page}`,
    lastModified: new Date(),
    changeFrequency: 'yearly' as const,
    priority: 0.3,
  }))

  // Combine all pages
  return [
    ...staticPages,
    ...academicPrograms,
    ...departments,
    ...admissionsPages,
    ...studentLifePages,
    ...resourcePages,
    ...authPages,
  ]
}