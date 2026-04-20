import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer'
import path from 'path'
import type { Invoice } from '@/types/invoice'

// 서버사이드 전용 - 'use client' 없음

const FONT_REGULAR = path.join(
  process.cwd(),
  'public/fonts/NotoSansKR-Regular.ttf'
)
const FONT_BOLD = path.join(process.cwd(), 'public/fonts/NotoSansKR-Bold.ttf')

Font.register({
  family: 'NotoSansKR',
  fonts: [
    { src: FONT_REGULAR, fontWeight: 400 },
    { src: FONT_BOLD, fontWeight: 700 },
  ],
})

const styles = StyleSheet.create({
  page: {
    fontFamily: 'NotoSansKR',
    fontSize: 9,
    padding: 40,
    color: '#1a1a1a',
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 4,
  },
  invoiceNumber: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 20,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 16,
  },
  half: {
    flex: 1,
  },
  sectionLabel: {
    fontSize: 8,
    color: '#6b7280',
    marginBottom: 4,
    fontWeight: 700,
  },
  partyName: {
    fontSize: 10,
    fontWeight: 700,
    marginBottom: 2,
  },
  partyDetail: {
    color: '#6b7280',
    marginBottom: 1,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 32,
    marginBottom: 20,
  },
  metaLabel: {
    fontSize: 8,
    color: '#6b7280',
    marginBottom: 2,
  },
  metaValue: {
    fontWeight: 700,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginBottom: 0,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  colName: { flex: 4 },
  colQty: { flex: 1, textAlign: 'right' },
  colUnit: { flex: 2, textAlign: 'right' },
  colAmount: { flex: 2, textAlign: 'right' },
  colHeader: { fontWeight: 700, fontSize: 8, color: '#6b7280' },
  summaryContainer: {
    marginTop: 12,
    alignItems: 'flex-end',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 40,
    marginBottom: 4,
    width: 220,
  },
  summaryLabel: {
    color: '#6b7280',
    width: 80,
    textAlign: 'right',
  },
  summaryValue: {
    width: 100,
    textAlign: 'right',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 40,
    borderTopWidth: 1,
    borderTopColor: '#1a1a1a',
    paddingTop: 6,
    marginTop: 4,
    width: 220,
  },
  totalLabel: {
    fontWeight: 700,
    fontSize: 10,
    width: 80,
    textAlign: 'right',
  },
  totalValue: {
    fontWeight: 700,
    fontSize: 10,
    width: 100,
    textAlign: 'right',
  },
  notes: {
    marginTop: 20,
    backgroundColor: '#f9fafb',
    padding: 10,
    borderRadius: 4,
  },
  notesLabel: {
    fontWeight: 700,
    marginBottom: 4,
  },
  notesText: {
    color: '#6b7280',
    lineHeight: 1.5,
  },
  statusBadge: {
    fontSize: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
})

const STATUS_LABELS: Record<string, string> = {
  draft: '초안',
  active: '유효',
  expired: '만료',
  cancelled: '취소',
}

const STATUS_COLORS: Record<string, string> = {
  draft: '#6b7280',
  active: '#16a34a',
  expired: '#9ca3af',
  cancelled: '#dc2626',
}

function formatCurrency(amount: number): string {
  return `₩${amount.toLocaleString('ko-KR')}`
}

interface InvoicePdfDocumentProps {
  invoice: Invoice
}

export function InvoicePdfDocument({ invoice }: InvoicePdfDocumentProps) {
  const statusColor = STATUS_COLORS[invoice.status] ?? '#6b7280'
  const statusLabel = STATUS_LABELS[invoice.status] ?? invoice.status

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* 헤더 */}
        <Text style={styles.title}>{invoice.title}</Text>
        <Text style={styles.invoiceNumber}>{invoice.invoiceNumber}</Text>

        {/* 상태 뱃지 */}
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusColor + '20', color: statusColor },
          ]}
        >
          <Text>{statusLabel}</Text>
        </View>

        <View style={styles.divider} />

        {/* 날짜 정보 */}
        <View style={styles.metaRow}>
          <View>
            <Text style={styles.metaLabel}>발행일</Text>
            <Text style={styles.metaValue}>{invoice.issueDate}</Text>
          </View>
          <View>
            <Text style={styles.metaLabel}>유효기간</Text>
            <Text style={styles.metaValue}>{invoice.dueDate}</Text>
          </View>
        </View>

        {/* 공급자 / 클라이언트 */}
        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.sectionLabel}>공급자</Text>
            {invoice.supplier.companyName ? (
              <Text style={styles.partyName}>
                {invoice.supplier.companyName}
              </Text>
            ) : null}
            {invoice.supplier.contactName ? (
              <Text style={styles.partyDetail}>
                {invoice.supplier.contactName}
              </Text>
            ) : null}
            {invoice.supplier.email ? (
              <Text style={styles.partyDetail}>{invoice.supplier.email}</Text>
            ) : null}
            {invoice.supplier.phone ? (
              <Text style={styles.partyDetail}>{invoice.supplier.phone}</Text>
            ) : null}
            {invoice.supplier.address ? (
              <Text style={styles.partyDetail}>{invoice.supplier.address}</Text>
            ) : null}
          </View>
          <View style={styles.half}>
            <Text style={styles.sectionLabel}>클라이언트</Text>
            {invoice.client.companyName ? (
              <Text style={styles.partyName}>{invoice.client.companyName}</Text>
            ) : null}
            {invoice.client.contactName ? (
              <Text style={styles.partyDetail}>
                {invoice.client.contactName}
              </Text>
            ) : null}
            {invoice.client.email ? (
              <Text style={styles.partyDetail}>{invoice.client.email}</Text>
            ) : null}
            {invoice.client.phone ? (
              <Text style={styles.partyDetail}>{invoice.client.phone}</Text>
            ) : null}
            {invoice.client.address ? (
              <Text style={styles.partyDetail}>{invoice.client.address}</Text>
            ) : null}
          </View>
        </View>

        <View style={styles.divider} />

        {/* 항목 테이블 */}
        <View style={styles.tableHeader}>
          <Text style={[styles.colName, styles.colHeader]}>항목명</Text>
          <Text style={[styles.colQty, styles.colHeader]}>수량</Text>
          <Text style={[styles.colUnit, styles.colHeader]}>단가</Text>
          <Text style={[styles.colAmount, styles.colHeader]}>금액</Text>
        </View>
        {invoice.items.map(item => (
          <View key={item.id} style={styles.tableRow}>
            <Text style={styles.colName}>{item.name}</Text>
            <Text style={styles.colQty}>{item.quantity}</Text>
            <Text style={styles.colUnit}>{formatCurrency(item.unitPrice)}</Text>
            <Text style={styles.colAmount}>{formatCurrency(item.amount)}</Text>
          </View>
        ))}

        {/* 금액 요약 */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>소계</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(invoice.subtotal)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              부가세 ({Math.round(invoice.taxRate * 100)}%)
            </Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(invoice.taxAmount)}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>합계</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(invoice.totalAmount)}
            </Text>
          </View>
        </View>

        {/* 비고 */}
        {invoice.notes ? (
          <View style={styles.notes}>
            <Text style={styles.notesLabel}>비고</Text>
            <Text style={styles.notesText}>{invoice.notes}</Text>
          </View>
        ) : null}
      </Page>
    </Document>
  )
}
