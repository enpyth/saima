import type { Language, Localized } from '../content/types'

export const defaultLanguage: Language = 'en'
export const languageStorageKey = 'saima-language'

export function isLanguage(value: unknown): value is Language {
  return value === 'en' || value === 'zh'
}

export function normalizeLanguage(value: unknown): Language {
  return isLanguage(value) ? value : defaultLanguage
}

export function getLocalizedContent<T>(content: Localized<T>, language: unknown): T {
  return content[normalizeLanguage(language)]
}

export function readStoredLanguage(storage: Pick<Storage, 'getItem'> | undefined): Language {
  if (!storage) {
    return defaultLanguage
  }

  return normalizeLanguage(storage.getItem(languageStorageKey))
}

export function writeStoredLanguage(
  storage: Pick<Storage, 'setItem'> | undefined,
  language: Language,
) {
  storage?.setItem(languageStorageKey, language)
}
