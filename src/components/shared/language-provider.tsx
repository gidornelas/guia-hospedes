'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Locale } from '@/lib/i18n/types'
import { getDictionary, isValidLocale } from '@/lib/i18n'

interface LanguageContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  dictionary: ReturnType<typeof getDictionary>
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

const STORAGE_KEY = 'guia-locale'

function getInitialLocale(): Locale {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && isValidLocale(stored)) return stored
    const urlParams = new URLSearchParams(window.location.search)
    const urlLang = urlParams.get('lang')
    if (urlLang && isValidLocale(urlLang)) return urlLang
  }
  return 'pt-BR'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('pt-BR')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setLocaleState(getInitialLocale())
    setMounted(true)
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, newLocale)
      const url = new URL(window.location.href)
      if (newLocale === 'pt-BR') {
        url.searchParams.delete('lang')
      } else {
        url.searchParams.set('lang', newLocale)
      }
      window.history.replaceState({}, '', url.toString())
      document.documentElement.lang = newLocale
    }
  }

  const dictionary = getDictionary(locale)

  return (
    <LanguageContext.Provider value={{ locale, setLocale, dictionary }}>
      {mounted ? children : <div />}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return ctx
}
