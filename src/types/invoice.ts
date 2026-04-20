// 견적서 상태 타입
export type InvoiceStatus = 'draft' | 'active' | 'expired' | 'cancelled'

// 견적서 항목 타입
export interface InvoiceItem {
  id: string
  name: string
  quantity: number
  unitPrice: number
  amount: number
}

// 견적서 당사자 정보 타입 (공급자 또는 클라이언트)
export interface InvoiceParty {
  companyName: string
  contactName: string
  email?: string
  phone?: string
  address?: string
}

// 견적서 전체 타입
export interface Invoice {
  id: string
  invoiceNumber: string
  title: string
  status: InvoiceStatus
  issueDate: string // YYYY-MM-DD
  dueDate: string // YYYY-MM-DD
  supplier: InvoiceParty
  client: InvoiceParty
  items: InvoiceItem[]
  subtotal: number
  taxRate: number // 0.1 = 10%
  taxAmount: number
  totalAmount: number
  notes?: string
}
