'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface CopyButtonProps {
  text: string
  className?: string
  iconClassName?: string
  ariaLabel?: string
  successMessage?: string
}

export function CopyButton({
  text,
  className,
  iconClassName,
  ariaLabel = 'Copiar',
  successMessage = 'Copiado!',
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!text) return
    await navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success(successMessage)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={!text}
      className={cn(
        'inline-flex items-center justify-center rounded-md transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-40 min-h-11 min-w-11',
        className,
      )}
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      {copied ? (
        <Check className={cn('h-4 w-4 text-emerald-600', iconClassName)} />
      ) : (
        <Copy className={cn('h-4 w-4 text-slate-400', iconClassName)} />
      )}
    </button>
  )
}
