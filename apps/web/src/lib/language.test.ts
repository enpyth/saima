import { describe, expect, it } from 'vitest'

import {
  defaultLanguage,
  getLocalizedContent,
  languageStorageKey,
  normalizeLanguage,
  readStoredLanguage,
  writeStoredLanguage,
} from './language'

describe('language helpers', () => {
  it('defaults to English for missing or invalid language values', () => {
    expect(defaultLanguage).toBe('en')
    expect(normalizeLanguage(undefined)).toBe('en')
    expect(normalizeLanguage('fr')).toBe('en')
  })

  it('accepts supported languages', () => {
    expect(normalizeLanguage('en')).toBe('en')
    expect(normalizeLanguage('zh')).toBe('zh')
  })

  it('returns localized content with fallback normalization', () => {
    const content = {
      en: 'English text',
      zh: '中文内容',
    }

    expect(getLocalizedContent(content, 'zh')).toBe('中文内容')
    expect(getLocalizedContent(content, 'missing')).toBe('English text')
  })

  it('reads and writes localStorage language values', () => {
    const values = new Map<string, string>()
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => {
        values.set(key, value)
      },
    }

    expect(readStoredLanguage(storage)).toBe('en')
    writeStoredLanguage(storage, 'zh')
    expect(values.get(languageStorageKey)).toBe('zh')
    expect(readStoredLanguage(storage)).toBe('zh')
  })
})
