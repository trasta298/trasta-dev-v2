import type { Locale } from '../i18n/locale'

type SiteCopy = {
  description: string
  ogLocale: string
  htmlLang: string
}

const COMMON = {
  name: 'trasta',
  nameJa: 'とらすた',
  domain: 'trasta.dev',
  url: 'https://trasta.dev',
  author: 'trasta',
  twitter: '@trasta_dev',
} as const

export const SITE = {
  ...COMMON,
  description:
    'i tinker on new things that look fun. trasta / とらすた のブログとポートフォリオ。',
  descriptionJa:
    'i tinker on new things that look fun. trasta / とらすた のブログとポートフォリオ。',
  locale: 'ja-JP',
} as const

const COPY: Record<Locale, SiteCopy> = {
  ja: {
    description:
      'i tinker on new things that look fun. trasta / とらすた のブログとポートフォリオ。',
    ogLocale: 'ja_JP',
    htmlLang: 'ja',
  },
  en: {
    description:
      'i tinker on new things that look fun. a blog and portfolio by trasta.',
    ogLocale: 'en_US',
    htmlLang: 'en',
  },
}

export function siteCopy(locale: Locale): SiteCopy {
  return COPY[locale]
}
