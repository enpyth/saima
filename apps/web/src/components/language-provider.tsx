import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

import type { Language } from '../content/types'
import { defaultLanguage, readStoredLanguage, writeStoredLanguage } from '../lib/language'

type LanguageContextValue = {
  language: Language
  setLanguage: (language: Language) => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(defaultLanguage)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setLanguageState(readStoredLanguage(window.localStorage))
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) {
      return
    }

    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en'
    writeStoredLanguage(window.localStorage, language)
  }, [hydrated, language])

  const value = useMemo(
    () => ({
      language,
      setLanguage: setLanguageState,
    }),
    [language],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const value = useContext(LanguageContext)

  if (!value) {
    throw new Error('useLanguage must be used inside LanguageProvider')
  }

  return value
}
