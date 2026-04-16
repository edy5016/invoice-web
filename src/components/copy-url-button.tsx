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
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className={className}
    >
      {copied ? (
        <>
          <Check className="mr-1.5 h-3.5 w-3.5 text-green-600" />
          <span className="text-green-600">복사됨</span>
        </>
      ) : (
        <>
          <Copy className="mr-1.5 h-3.5 w-3.5" />
          URL 복사
        </>
      )}
    </Button>
  )
}
