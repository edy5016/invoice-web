import { NextRequest, NextResponse } from 'next/server'

// 관리자 접근 제어 미들웨어
// /admin/login은 인증 없이 통과, 나머지 /admin/* 경로는 쿠키 확인
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 현재 경로를 헤더에 추가 (레이아웃에서 로그인 페이지 감지용)
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', pathname)

  // 로그인 페이지는 인증 없이 통과
  if (pathname === '/admin/login') {
    return NextResponse.next({
      request: { headers: requestHeaders },
    })
  }

  // admin-session 쿠키 확인
  const session = request.cookies.get('admin-session')

  if (!session?.value) {
    // 미인증 시 로그인 페이지로 리다이렉트
    const loginUrl = new URL('/admin/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  })
}

export const config = {
  matcher: ['/admin/:path*'],
}
