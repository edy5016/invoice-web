import type { InvoiceParty } from '@/types/invoice'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, Mail, Phone, MapPin, User } from 'lucide-react'

interface PartyCardProps {
  party: InvoiceParty
  label: string
}

// 개별 당사자 정보 카드
function PartyCard({ party, label }: PartyCardProps) {
  const { companyName, contactName, email, phone, address } = party

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* 회사명 */}
        <div className="flex items-center gap-2">
          <Building2 className="text-muted-foreground h-4 w-4 shrink-0" />
          <span className="font-semibold">{companyName}</span>
        </div>
        {/* 담당자명 */}
        <div className="flex items-center gap-2 text-sm">
          <User className="text-muted-foreground h-4 w-4 shrink-0" />
          <span>{contactName}</span>
        </div>
        {/* 이메일 (있는 경우만) */}
        {email && (
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 shrink-0" />
            <span>{email}</span>
          </div>
        )}
        {/* 전화번호 (있는 경우만) */}
        {phone && (
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 shrink-0" />
            <span>{phone}</span>
          </div>
        )}
        {/* 주소 (있는 경우만) */}
        {address && (
          <div className="text-muted-foreground flex items-start gap-2 text-sm">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{address}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface InvoicePartiesProps {
  supplier: InvoiceParty
  client: InvoiceParty
}

// 공급자 및 클라이언트 정보 컴포넌트
export function InvoiceParties({ supplier, client }: InvoicePartiesProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <PartyCard party={supplier} label="공급자" />
      <PartyCard party={client} label="공급받는 자" />
    </div>
  )
}
