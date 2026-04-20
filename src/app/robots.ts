import type { MetadataRoute } from 'next'

// robots.txt 자동 생성 (Next.js 파일 기반 라우트)
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // 견적서 개별 페이지는 검색 엔진 색인 제외 (클라이언트 개인정보 보호)
      disallow: '/invoice/',
    },
  }
}
