'use client'

import { cn } from '@/lib/utils'
import { useLanguage } from './language-provider'
import { localeLabels } from '@/lib/i18n'
import { Locale } from '@/lib/i18n/types'

const flagSrc: Record<Locale, string> = {
  'pt-BR': 'https://flagcdn.com/w40/br.png',
  'en': 'https://flagcdn.com/w40/gb.png',
  'es': 'https://flagcdn.com/w40/es.png',
}

const localeList: Locale[] = ['pt-BR', 'en', 'es']

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useLanguage()

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      {localeList.map((l) => (
        <button
          key={l}
          onClick={() => setLocale(l)}
          title={localeLabels[l]}
          className={cn(
            'relative overflow-hidden rounded-sm border transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1',
            locale === l
              ? 'border-primary shadow-sm ring-1 ring-primary'
              : 'border-slate-200 opacity-60 hover:opacity-100'
          )}
          aria-label={`Mudar idioma para ${localeLabels[l]}`}
          aria-pressed={locale === l}
        >
          <img
            src={flagSrc[l]}
            alt={localeLabels[l]}
            className="h-5 w-7 object-cover"
            loading="lazy"
          />
        </button>
      ))}
    </div>
  )
}
