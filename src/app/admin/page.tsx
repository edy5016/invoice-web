import Link from 'next/link'
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react'
import { getInvoiceSummary, getInvoiceList } from '@/lib/notion-invoice-list'
import { InvoiceStatusBadge } from '@/components/admin/invoice-status-badge'

const formatKRW = (amount: number) =>
  new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(
    amount
  )

export default async function AdminDashboardPage() {
  const [summary, { items: recentItems }] = await Promise.all([
    getInvoiceSummary(),
    getInvoiceList({ pageSize: 5 }),
  ])

  const stats = [
    {
      label: '전체 견적서',
      value: summary.total,
      icon: FileText,
      href: '/admin/invoices',
      color: 'text-blue-600',
    },
    {
      label: '대기 중',
      value: summary.pending,
      icon: Clock,
      href: '/admin/invoices?status=대기',
      color: 'text-yellow-600',
    },
    {
      label: '승인',
      value: summary.confirmed,
      icon: CheckCircle,
      href: '/admin/invoices?status=승일',
      color: 'text-green-600',
    },
    {
      label: '거절',
      value: summary.cancelled,
      icon: XCircle,
      href: '/admin/invoices?status=거절',
      color: 'text-red-600',
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-foreground text-2xl font-bold">대시보드</h1>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, href, color }) => (
          <Link
            key={label}
            href={href}
            className="bg-card border-border hover:bg-accent rounded-lg border p-5 transition-colors"
          >
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-sm">{label}</p>
              <Icon className={`size-5 ${color}`} />
            </div>
            <p className="text-foreground mt-2 text-3xl font-bold">{value}</p>
          </Link>
        ))}
      </div>

      {/* 최근 견적서 */}
      <div className="bg-card border-border rounded-lg border">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-foreground font-semibold">최근 견적서</h2>
          <Link
            href="/admin/invoices"
            className="text-primary text-sm hover:underline"
          >
            전체 보기 →
          </Link>
        </div>
        {recentItems.length === 0 ? (
          <p className="text-muted-foreground p-6 text-center text-sm">
            견적서가 없습니다.
          </p>
        ) : (
          <ul className="divide-border divide-y">
            {recentItems.map(item => (
              <li key={item.id}>
                <Link
                  href={`/admin/invoices/${item.id}`}
                  className="hover:bg-accent flex items-center justify-between px-4 py-3 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-foreground truncate text-sm font-medium">
                      {item.invoiceNumber}
                    </p>
                    <p className="text-muted-foreground truncate text-xs">
                      {item.clientName}
                    </p>
                  </div>
                  <div className="ml-4 flex shrink-0 flex-col items-end gap-1">
                    <InvoiceStatusBadge status={item.notionStatus} />
                    <p className="text-muted-foreground text-xs">
                      {formatKRW(item.totalAmount)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
