'use client'

import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { ThemeToggle } from '@/components/theme-toggle'

export function AdminHeader() {
  return (
    <header className="bg-background flex h-14 items-center justify-between border-b px-4">
      {/* 모바일: 햄버거 메뉴 + 타이틀 / 데스크톱: 빈 영역 */}
      <div className="flex items-center lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="메뉴 열기">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetTitle className="sr-only">관리자 메뉴</SheetTitle>
            <AdminSidebar className="border-r-0" />
          </SheetContent>
        </Sheet>
        <span className="ml-3 text-sm font-semibold">관리자</span>
      </div>
      <div className="hidden lg:block" />

      {/* 오른쪽: 테마 토글 */}
      <ThemeToggle />
    </header>
  )
}
