'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface CopyButtonProps {
  text: string
  className?: string
  iconClassName?: string
}

export function CopyButton({ text, className, iconClassName }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!text) return
    await navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('Copiado!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className={cn('inline-flex items-center justify-center rounded-md hover:bg-black/5 transition-colors', className)}
      aria-label="Copiar"
    >
      {copied ? (
        <Check className={cn('h-4 w-4 text-emerald-600', iconClassName)} />
      ) : (
        <Copy className={cn('h-4 w-4 text-slate-400', iconClassName)} />
      )}
    </button>
  )
}
