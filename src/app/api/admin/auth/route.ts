import { NextRequest, NextResponse } from 'next/server'

// 관리자 인증 API 엔드포인트
// POST /api/admin/auth - 관리자 키 검증 후 세션 쿠키 설정
export async function POST(request: NextRequest) {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: '잘못된 요청 형식입니다.' },
      { status: 400 }
    )
  }

  // body 타입 검증
  if (
    typeof body !== 'object' ||
    body === null ||
    !('key' in body) ||
    typeof (body as Record<string, unknown>).key !== 'string'
  ) {
    return NextResponse.json(
      { error: '잘못된 요청 형식입니다.' },
      { status: 400 }
    )
  }

  const { key } = body as { key: string }
  const adminAccessKey = process.env.ADMIN_ACCESS_KEY

  // 환경 변수 미설정 시 (개발 환경 등): 'dev' 키 허용
  if (!adminAccessKey) {
    if (key !== 'dev') {
      return NextResponse.json(
        { error: '인증 키가 올바르지 않습니다.' },
        { status: 401 }
      )
    }
  } else if (key !== adminAccessKey) {
    // 키 불일치 시 401 응답
    return NextResponse.json(
      { error: '인증 키가 올바르지 않습니다.' },
      { status: 401 }
    )
  }

  // 인증 성공: httpOnly 쿠키 설정 (24시간 유효)
  const response = NextResponse.json({ ok: true }, { status: 200 })
  response.cookies.set('admin-session', key, {
    httpOnly: true,
    maxAge: 86400, // 24시간
    sameSite: 'lax',
    path: '/',
    // 프로덕션 환경에서는 secure 쿠키 사용
    secure: process.env.NODE_ENV === 'production',
  })

  return response
}
