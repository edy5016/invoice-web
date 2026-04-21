'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FileText, LayoutDashboard, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const navItems = [
  { href: '/admin', label: '대시보드', icon: LayoutDashboard, exact: true },
  {
    href: '/admin/invoices',
    label: '견적서 목록',
    icon: FileText,
    exact: false,
  },
]

interface AdminSidebarProps {
  className?: string
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        'bg-background flex h-full w-64 flex-col border-r',
        className
      )}
    >
      <div className="flex h-14 items-center border-b px-6">
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          <FileText className="text-primary size-5" />
          <span className="text-foreground">관리자</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {navItems.map(({ href, label, icon: Icon, exact }) => {
            const isActive = exact
              ? pathname === href
              : pathname.startsWith(href)
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <Icon className="size-4" />
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* 하단: 로그아웃 */}
      <div className="border-t p-4">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground w-full justify-start gap-2 text-xs"
          onClick={async () => {
            await fetch('/api/admin/auth', { method: 'DELETE' })
            window.location.href = '/admin/login'
          }}
        >
          <LogOut className="size-4" />
          로그아웃
        </Button>
      </div>
    </aside>
  )
}
