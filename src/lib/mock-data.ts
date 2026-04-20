import type { Invoice } from '@/types/invoice'

// 목업 데이터: 정상 케이스 (active, 5개 항목)
const mockInvoice001: Invoice = {
  id: 'mock-001',
  invoiceNumber: 'INV-2024-001',
  title: '웹사이트 개발 및 디자인 프로젝트 견적서',
  status: 'active',
  issueDate: '2024-03-01',
  dueDate: '2024-04-01',
  supplier: {
    companyName: '(주)테크스튜디오',
    contactName: '김개발',
    email: 'dev@techstudio.kr',
    phone: '02-1234-5678',
    address: '서울특별시 강남구 테헤란로 123, 5층',
  },
  client: {
    companyName: '스타트업 코리아',
    contactName: '이대표',
    email: 'ceo@startup.kr',
    phone: '010-9876-5432',
    address: '서울특별시 마포구 홍대로 456, 3층',
  },
  items: [
    {
      id: 'item-001-1',
      name: '웹사이트 프론트엔드 개발 (React/Next.js)',
      quantity: 1,
      unitPrice: 3000000,
      amount: 3000000,
    },
    {
      id: 'item-001-2',
      name: 'UI/UX 디자인 (Figma 시안 + 구현)',
      quantity: 1,
      unitPrice: 1500000,
      amount: 1500000,
    },
    {
      id: 'item-001-3',
      name: '백엔드 API 개발 (Node.js)',
      quantity: 1,
      unitPrice: 2000000,
      amount: 2000000,
    },
    {
      id: 'item-001-4',
      name: '서버 인프라 설정 (AWS EC2 + RDS)',
      quantity: 1,
      unitPrice: 500000,
      amount: 500000,
    },
    {
      id: 'item-001-5',
      name: '출시 후 1개월 유지보수 및 기술 컨설팅',
      quantity: 1,
      unitPrice: 800000,
      amount: 800000,
    },
  ],
  subtotal: 7800000,
  taxRate: 0.1,
  taxAmount: 780000,
  totalAmount: 8580000,
  notes:
    '본 견적서는 발행일로부터 30일간 유효합니다. 작업 범위 변경 시 별도 협의가 필요합니다.',
}

// 목업 데이터: 많은 항목 케이스 (active, 15개 항목 - 엣지케이스)
const mockInvoice002: Invoice = {
  id: 'mock-002',
  invoiceNumber: 'INV-2024-002',
  title: '전사 IT 인프라 구축 및 소프트웨어 개발 종합 견적서',
  status: 'active',
  issueDate: '2024-03-15',
  dueDate: '2024-04-15',
  supplier: {
    companyName: '(주)테크스튜디오',
    contactName: '박솔루션',
    email: 'solution@techstudio.kr',
    phone: '02-1234-5678',
    address: '서울특별시 강남구 테헤란로 123, 5층',
  },
  client: {
    companyName: '대기업 홀딩스',
    contactName: '최이사',
    email: 'director@bigcorp.kr',
    phone: '02-5555-0000',
    address: '서울특별시 종로구 세종대로 1, 20층',
  },
  items: [
    {
      id: 'item-002-1',
      name: '프로젝트 기획 및 요구사항 분석',
      quantity: 1,
      unitPrice: 1000000,
      amount: 1000000,
    },
    {
      id: 'item-002-2',
      name: '시스템 아키텍처 설계',
      quantity: 1,
      unitPrice: 800000,
      amount: 800000,
    },
    {
      id: 'item-002-3',
      name: '데이터베이스 설계 및 구축 (PostgreSQL)',
      quantity: 1,
      unitPrice: 1200000,
      amount: 1200000,
    },
    {
      id: 'item-002-4',
      name: '백엔드 REST API 개발',
      quantity: 3,
      unitPrice: 700000,
      amount: 2100000,
    },
    {
      id: 'item-002-5',
      name: '관리자 대시보드 개발',
      quantity: 1,
      unitPrice: 1500000,
      amount: 1500000,
    },
    {
      id: 'item-002-6',
      name: '사용자 모바일 앱 개발 (iOS)',
      quantity: 1,
      unitPrice: 3000000,
      amount: 3000000,
    },
    {
      id: 'item-002-7',
      name: '사용자 모바일 앱 개발 (Android)',
      quantity: 1,
      unitPrice: 3000000,
      amount: 3000000,
    },
    {
      id: 'item-002-8',
      name: 'UI/UX 디자인 시스템 구축',
      quantity: 1,
      unitPrice: 2000000,
      amount: 2000000,
    },
    {
      id: 'item-002-9',
      name: 'AWS 클라우드 인프라 구성',
      quantity: 1,
      unitPrice: 1000000,
      amount: 1000000,
    },
    {
      id: 'item-002-10',
      name: 'CI/CD 파이프라인 구축',
      quantity: 1,
      unitPrice: 600000,
      amount: 600000,
    },
    {
      id: 'item-002-11',
      name: '보안 취약점 점검 및 조치',
      quantity: 1,
      unitPrice: 800000,
      amount: 800000,
    },
    {
      id: 'item-002-12',
      name: '성능 최적화 및 로드 테스트',
      quantity: 1,
      unitPrice: 500000,
      amount: 500000,
    },
    {
      id: 'item-002-13',
      name: '기술 문서화 (API 명세, 운영 가이드)',
      quantity: 1,
      unitPrice: 400000,
      amount: 400000,
    },
    {
      id: 'item-002-14',
      name: '직원 교육 및 인수인계',
      quantity: 2,
      unitPrice: 300000,
      amount: 600000,
    },
    {
      id: 'item-002-15',
      name: '출시 후 3개월 유지보수',
      quantity: 3,
      unitPrice: 500000,
      amount: 1500000,
    },
  ],
  subtotal: 20000000,
  taxRate: 0.1,
  taxAmount: 2000000,
  totalAmount: 22000000,
  notes:
    '대규모 프로젝트 특성상 단계별 착수금(30%) 지급 후 작업을 시작합니다. 프로젝트 일정 및 마일스톤은 별도 계약서에 명시됩니다.',
}

// 목업 데이터: 만료 케이스 (expired, 3개 항목)
const mockInvoice003: Invoice = {
  id: 'mock-003',
  invoiceNumber: 'INV-2023-089',
  title: '로고 디자인 및 브랜드 아이덴티티 견적서',
  status: 'expired',
  issueDate: '2023-11-01',
  dueDate: '2023-12-01',
  supplier: {
    companyName: '(주)테크스튜디오',
    contactName: '정디자인',
    email: 'design@techstudio.kr',
    phone: '02-1234-5678',
    address: '서울특별시 강남구 테헤란로 123, 5층',
  },
  client: {
    companyName: '새싹 스타트업',
    contactName: '한창업',
    email: 'founder@sprout.kr',
    phone: '010-1111-2222',
  },
  items: [
    {
      id: 'item-003-1',
      name: '로고 디자인 (3가지 시안)',
      quantity: 1,
      unitPrice: 500000,
      amount: 500000,
    },
    {
      id: 'item-003-2',
      name: '브랜드 컬러 팔레트 및 타이포그래피 가이드',
      quantity: 1,
      unitPrice: 300000,
      amount: 300000,
    },
    {
      id: 'item-003-3',
      name: '명함, 레터헤드 등 기본 스테이셔너리 디자인',
      quantity: 1,
      unitPrice: 400000,
      amount: 400000,
    },
  ],
  subtotal: 1200000,
  taxRate: 0.1,
  taxAmount: 120000,
  totalAmount: 1320000,
  notes: '이 견적서는 유효기간이 만료되었습니다. 새로운 견적을 요청해 주세요.',
}

// 목업 데이터 맵
const mockInvoices: Record<string, Invoice> = {
  'mock-001': mockInvoice001,
  'mock-002': mockInvoice002,
  'mock-003': mockInvoice003,
}

// ID로 견적서 조회 함수
export function getInvoiceById(id: string): Invoice | null {
  return mockInvoices[id] ?? null
}

// 전체 목업 데이터 export (필요 시 사용)
export { mockInvoices }
