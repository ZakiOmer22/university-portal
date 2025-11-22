import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/about',
        '/academics/',
        '/admissions/',
        '/departments/',
        '/student-life/',
        '/resources/',
      ],
      disallow: [
        '/dashboard/',
        '/auth/',
        '/api/',
        '/admin/',
        '/account/',
      ],
    },
    sitemap: 'https://univeristy-portal-system.com/sitemap.xml',
  }
}