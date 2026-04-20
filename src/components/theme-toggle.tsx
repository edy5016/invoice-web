'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'

const THEME_CYCLE = ['system', 'light', 'dark'] as const
type Theme = (typeof THEME_CYCLE)[number]

function getNextTheme(current: string | undefined): Theme {
  const idx = THEME_CYCLE.indexOf((current ?? 'system') as Theme)
  return THEME_CYCLE[(idx + 1) % THEME_CYCLE.length]
}

function ThemeIcon({ theme }: { theme: string | undefined }) {
  if (theme === 'light') return <Sun className="h-4 w-4" />
  if (theme === 'dark') return <Moon className="h-4 w-4" />
  return <Monitor className="h-4 w-4" />
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <Button variant="ghost" size="icon" disabled className="h-8 w-8" />
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      aria-label="테마 전환"
      onClick={() => setTheme(getNextTheme(theme))}
    >
      <ThemeIcon theme={theme} />
    </Button>
  )
}
