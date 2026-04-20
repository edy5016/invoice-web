'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CopyUrlButtonProps {
  url: string
  className?: string
}

// 견적서 URL을 클립보드에 복사하는 클라이언트 컴포넌트
export function CopyUrlButton({ url, className }: CopyUrlButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard API 실패 시 fallback
      const input = document.createElement('input')
      input.value = url
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <>
      {/* aria-live="polite": 복사 완료 상태를 스크린리더에 비방해 방식으로 알림 */}
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? '견적서 URL이 클립보드에 복사되었습니다.' : ''}
      </span>

      <Button
        variant="outline"
        size="sm"
        onClick={handleCopy}
        className={className}
        aria-label={copied ? '견적서 URL 복사됨' : '견적서 URL 복사'}
      >
        {copied ? (
          <>
            <Check
              className="mr-1.5 h-3.5 w-3.5 text-green-600"
              aria-hidden="true"
            />
            <span className="text-green-600">복사됨</span>
          </>
        ) : (
          <>
            <Copy className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
            URL 복사
          </>
        )}
      </Button>
    </>
  )
}
