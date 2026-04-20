import Link from 'next/link'
import { FileSearch, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

// 견적서를 찾을 수 없을 때 표시되는 404 페이지 (서버 컴포넌트)
export default function InvoiceNotFound() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center px-4">
      <div className="text-center">
        {/* 아이콘 */}
        <div className="bg-muted mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
          <FileSearch className="text-muted-foreground h-10 w-10" />
        </div>

        {/* 메시지 */}
        <h1 className="text-2xl font-bold">견적서를 찾을 수 없어요</h1>
        <p className="text-muted-foreground mt-3">
          요청하신 견적서가 존재하지 않거나 삭제되었을 수 있습니다.
        </p>
        <p className="text-muted-foreground mt-1 text-sm">
          URL을 다시 확인하거나, 담당자에게 문의해 주세요.
        </p>

        {/* 홈으로 버튼 */}
        <div className="mt-8">
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              홈으로 돌아가기
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
