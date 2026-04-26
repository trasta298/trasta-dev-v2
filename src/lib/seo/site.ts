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
  defaultOgImage: '/images/concept-light.png',
} as const

export const SITE = {
  ...COMMON,
  description:
    'i build small, kind web experiences. trasta / とらすた のブログとポートフォリオ。',
  descriptionJa: 'ブログ中心の個人ポートフォリオ。小さくやさしいウェブを作っています。',
  locale: 'ja-JP',
} as const

const COPY: Record<Locale, SiteCopy> = {
  ja: {
    description:
      'i build small, kind web experiences. trasta / とらすた のブログとポートフォリオ。',
    ogLocale: 'ja_JP',
    htmlLang: 'ja',
  },
  en: {
    description:
      'a blog and portfolio by trasta — small, kind web experiences.',
    ogLocale: 'en_US',
    htmlLang: 'en',
  },
}

export function siteCopy(locale: Locale): SiteCopy {
  return COPY[locale]
}
