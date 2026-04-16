import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '견적서를 찾을 수 없습니다',
  description: '요청하신 견적서를 찾을 수 없습니다.',
}

// 커스텀 404 페이지
export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md text-center">
        <div className="mb-6 text-6xl font-bold text-gray-200">404</div>
        <h1 className="mb-3 text-2xl font-bold text-gray-900">
          견적서를 찾을 수 없습니다
        </h1>
        <p className="mb-2 text-gray-600">
          요청하신 견적서가 존재하지 않거나 URL이 올바르지 않습니다.
        </p>
        <p className="mb-8 text-sm text-gray-400">
          견적서 URL을 다시 확인하거나 담당자에게 문의해주세요.
        </p>
        <Link
          href="/"
          className="inline-flex items-center rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-700"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  )
}
