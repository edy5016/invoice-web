import type { MetadataRoute } from 'next'

// sitemap.xml 자동 생성 (Next.js 파일 기반 라우트)
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      // 홈페이지만 색인 대상 (견적서 페이지는 robots.ts에서 제외)
      url: process.env.NEXT_PUBLIC_BASE_URL || 'https://invoice-web.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}
