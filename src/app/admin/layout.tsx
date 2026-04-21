import { headers } from 'next/headers'
import { AdminHeader } from '@/components/admin/admin-header'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { Toaster } from '@/components/ui/sonner'

// 관리자 레이아웃
// 로그인 페이지(/admin/login)는 사이드바/헤더 없이 독립 렌더링
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  // middleware에서 주입한 x-pathname 헤더로 현재 경로 확인
  const pathname = headersList.get('x-pathname') ?? ''

  const isLoginPage = pathname === '/admin/login'

  if (isLoginPage) {
    return (
      <>
        {children}
        <Toaster />
      </>
    )
  }

  return (
    <div className="bg-background flex h-screen flex-col">
      <AdminHeader />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar className="hidden lg:flex" />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
      <Toaster />
    </div>
  )
}
