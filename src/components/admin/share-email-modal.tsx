'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Loader2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z.object({
  email: z.string().email('유효한 이메일 주소를 입력해 주세요.'),
})
type FormValues = z.infer<typeof schema>

type Status = 'idle' | 'loading' | 'success' | 'error'

interface ShareEmailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoiceId: string
  invoiceNumber: string
}

export function ShareEmailModal({
  open,
  onOpenChange,
  invoiceId,
  invoiceNumber,
}: ShareEmailModalProps) {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const handleClose = (next: boolean) => {
    if (!next) {
      reset()
      setStatus('idle')
      setErrorMessage('')
    }
    onOpenChange(next)
  }

  const onSubmit = async (values: FormValues) => {
    setStatus('loading')
    setErrorMessage('')

    try {
      const res = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: values.email,
          invoiceId,
          invoiceNumber,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error ?? '이메일 발송에 실패했습니다.')
      }

      setStatus('success')
      reset()
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : '이메일 발송에 실패했습니다.'
      )
      setStatus('error')
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>이메일로 견적서 공유</DialogTitle>
          <DialogDescription>
            견적서 {invoiceNumber}를 이메일로 발송합니다.
          </DialogDescription>
        </DialogHeader>

        {status === 'success' ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle2 className="size-12 text-green-500" />
            <p className="font-medium">이메일이 성공적으로 발송되었습니다.</p>
            <Button variant="outline" onClick={() => handleClose(false)}>
              닫기
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="flex flex-col gap-4 py-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="share-email">받는 사람 이메일</Label>
                <div className="relative">
                  <Mail className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                  <Input
                    id="share-email"
                    type="email"
                    placeholder="example@email.com"
                    className="pl-9"
                    disabled={status === 'loading'}
                    aria-invalid={!!errors.email}
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="text-destructive text-sm">
                    {errors.email.message}
                  </p>
                )}
                {status === 'error' && errorMessage && (
                  <p className="text-destructive text-sm">{errorMessage}</p>
                )}
              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleClose(false)}
                disabled={status === 'loading'}
              >
                취소
              </Button>
              <Button type="submit" disabled={status === 'loading'}>
                {status === 'loading' && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}
                {status === 'loading' ? '발송 중...' : '이메일 발송'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
