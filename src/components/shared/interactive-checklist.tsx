'use client'

import { useState, useEffect } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InteractiveChecklistProps {
  items: string[]
  storageKey: string
}

export function InteractiveChecklist({ items, storageKey }: InteractiveChecklistProps) {
  const [checked, setChecked] = useState<Set<number>>(new Set())

  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          setChecked(new Set(parsed))
        }
      } catch {
        // ignore
      }
    }
  }, [storageKey])

  const toggle = (index: number) => {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      localStorage.setItem(storageKey, JSON.stringify([...next]))
      return next
    })
  }

  const progress = items.length > 0 ? Math.round((checked.size / items.length) * 100) : 0

  return (
    <div className="space-y-3">
      {/* Progress */}
      <div className="flex items-center gap-3 mb-2">
        <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs font-medium text-slate-500">{progress}%</span>
      </div>

      {/* Items */}
      <div className="space-y-2">
        {items.map((item, i) => {
          const isChecked = checked.has(i)
          return (
            <button
              key={i}
              onClick={() => toggle(i)}
              className={cn(
                'flex items-start gap-3 w-full text-left rounded-xl border p-3.5 transition-all',
                isChecked
                  ? 'bg-primary/5 border-primary/20'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              )}
            >
              <div
                className={cn(
                  'h-6 w-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors',
                  isChecked ? 'bg-primary text-primary-foreground' : 'border-2 border-slate-300'
                )}
              >
                {isChecked && <Check className="h-3.5 w-3.5" />}
              </div>
              <span
                className={cn(
                  'text-sm leading-relaxed',
                  isChecked ? 'text-slate-400 line-through' : 'text-slate-700'
                )}
              >
                {item.trim()}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
