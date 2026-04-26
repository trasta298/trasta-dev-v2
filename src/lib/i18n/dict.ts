import type { Locale } from './locale'

type Dict = {
  nav: { blog: string; works: string; about: string }
  footer: { blog: string; works: string; about: string }
  home: {
    kicker: string
    leadEn: string
    leadJa: string
    ctaPrimary: string
    ctaGhost: string
    latestKicker: string
    latestTitle: string
    latestMore: string
    worksKicker: string
    worksTitle: string
    worksMore: string
    aboutKicker: string
    aboutTitle: string
    aboutMore: string
    aboutBody: string
  }
  blog: {
    kicker: string
    titleEn: string
    titleJa: string
    lead: string
    filterAll: string
    empty: string
    backToAll: string
    minSuffix: (n: number) => string
    updatedPrefix: string
  }
  works: {
    kicker: string
    title: string
    lead: string
    backToAll: string
    siteLink: string
    repoLink: string
    workKicker: string
  }
  about: {
    kicker: string
    titleHello: string
    titleName: string
    lead: string
    profile: { title: string; bio: string[] }
    interests: { title: string; items: string[] }
    stack: { title: string }
    links: { title: string; xLabel: string; ghLabel: string; mailLabel: string }
    sign: string
  }
  toc: { label: string }
  share: { label: string; copy: string; copied: string; copiedSr: string; share: string; xAria: string }
  notFound: {
    kicker: string
    title: (missing: string) => React.ReactNode
    titleEn: string
    lead: string
    home: string
    blog: string
  }
  themeAria: (mode: string) => string
  langSwitcher: { label: string; ja: string; en: string }
}

export const DICT: Record<Locale, Dict> = {
  ja: {
    nav: { blog: 'blog', works: 'works', about: 'about' },
    footer: { blog: 'blog', works: 'works', about: 'about' },
    home: {
      kicker: 'trasta.dev',
      leadEn: 'i make new and slightly weird things.',
      leadJa: '新しくて面白そうなものを、ちょこちょこ作っています。',
      ctaPrimary: 'read the blog',
      ctaGhost: 'about me',
      latestKicker: 'latest posts',
      latestTitle: '最近の話',
      latestMore: 'all posts →',
      worksKicker: 'works',
      worksTitle: '作ったもの',
      worksMore: 'all works →',
      aboutKicker: 'about me',
      aboutTitle: 'どんな人？',
      aboutMore: 'read more →',
      aboutBody:
        '普段は CoeFont でソフトウェアえんじにゃーやってます。新しいものが好きで、空いた時間は大体何か作っているか、寝ています。',
    },
    blog: {
      kicker: 'blog',
      titleEn: 'posts',
      titleJa: '書いたもの',
      lead: '書きながら考えていること、最近作っているもの、たまに脇道。',
      filterAll: 'all',
      empty: 'この条件に合う記事はありません。',
      backToAll: '← all posts',
      minSuffix: (n) => `${n} min`,
      updatedPrefix: 'updated',
    },
    works: {
      kicker: 'works',
      title: '作ったもの',
      lead: 'ささやかな個人開発から、仕事の延長で書いたものまで。最近のものから順番に。',
      backToAll: '← all works',
      siteLink: 'site →',
      repoLink: 'github →',
      workKicker: 'work',
    },
    about: {
      kicker: 'about me',
      titleHello: 'hi, i am ',
      titleName: 'trasta',
      lead:
        '新しくて面白いものを作るのが好きなソフトウェアえんじにゃーです。作ったものや考えていることの記録を、ここに置いています。',
      profile: {
        title: 'どんな人？',
        bio: [
          '2000 年生まれ・兵庫出身。灘中高 → 東京科学大学を経て、いまは [CoeFont Co. Ltd.](https://coefont.com) で Software Engineer をしています (2020〜)。',
          '在学中は [東京科学大学デジタル創作同好会 traP](https://trap.jp) に所属し、元代表でした。',
          'プログラミングのきっかけは中学生の頃に Minecraft PE にハマったこと。mod 作りやサーバープラグインを書いているうちに、何か新しいもの・面白いものを作るのがすきです。',
          '普段は Python / Golang / TypeScript / AWS あたりを触っています。',
        ],
      },
      interests: {
        title: '興味のあること',
        items: [
          'みんなに使ってもらえるものを作ること',
          '新しい技術を試すこと (最近は LLM 周り)',
          'マルチプレイのゲーム — 遊ぶのも、作るのも',
          'ハッカソンやコンテスト的なノリの開発',
        ],
      },
      stack: { title: 'よく使う技術' },
      links: { title: 'リンク', xLabel: 'x', ghLabel: 'github', mailLabel: 'mail' },
      sign: '— trasta',
    },
    toc: { label: '目次' },
    share: {
      label: 'share',
      copy: 'copy url',
      copied: 'copied!',
      copiedSr: 'URL をコピーしました',
      share: 'share',
      xAria: 'share on x',
    },
    notFound: {
      kicker: '404',
      title: () => null,
      titleEn: 'missing',
      lead:
        'URL が変わったか、最初から存在しなかったようです。トップに戻って、blog や works から辿ってみてください。',
      home: 'home へ戻る',
      blog: 'read the blog',
    },
    themeAria: (mode) => `theme: ${mode}`,
    langSwitcher: { label: 'language', ja: '日本語', en: 'english' },
  },
  en: {
    nav: { blog: 'blog', works: 'works', about: 'about' },
    footer: { blog: 'blog', works: 'works', about: 'about' },
    home: {
      kicker: 'trasta.dev',
      leadEn: 'i make new and slightly weird things.',
      leadJa: 'mostly small projects — tools, hackathon scraps, side experiments.',
      ctaPrimary: 'read the blog',
      ctaGhost: 'about me',
      latestKicker: 'latest posts',
      latestTitle: 'recent writing',
      latestMore: 'all posts →',
      worksKicker: 'works',
      worksTitle: 'things i made',
      worksMore: 'all works →',
      aboutKicker: 'about me',
      aboutTitle: 'about',
      aboutMore: 'read more →',
      aboutBody:
        'software engineer at CoeFont by day. weak to anything new, so off the clock i\'m usually making something or asleep.',
    },
    blog: {
      kicker: 'blog',
      titleEn: 'posts',
      titleJa: 'all entries',
      lead: 'notes from while i think, things i build, and occasional detours.',
      filterAll: 'all',
      empty: 'no posts match this filter.',
      backToAll: '← all posts',
      minSuffix: (n) => `${n} min read`,
      updatedPrefix: 'updated',
    },
    works: {
      kicker: 'works',
      title: 'things i have made',
      lead: 'tiny personal projects, extensions of day-job work, listed newest first.',
      backToAll: '← all works',
      siteLink: 'site →',
      repoLink: 'github →',
      workKicker: 'work',
    },
    about: {
      kicker: 'about me',
      titleHello: 'hi, i am ',
      titleName: 'trasta',
      lead:
        'a software engineer who likes building new and slightly weird things. this is where i keep the records of what i make and think about.',
      profile: {
        title: 'who am i?',
        bio: [
          'Born in 2000 in Hyogo, Japan. Graduated from Nada High School and Institute of Science Tokyo. Currently a Software Engineer at [CoeFont Co. Ltd.](https://coefont.com) since 2020.',
          'During university i was part of [Digital Creators Club traP](https://trap.jp) and served as its president.',
          'Started programming in middle school after getting hooked on Minecraft PE — making mods and server plugins. That joy of building something new and a little strange has stuck around.',
          'Day-to-day i mostly work with Python, Golang, TypeScript and AWS.',
        ],
      },
      interests: {
        title: 'what i care about',
        items: [
          'building things that other people actually use',
          'trying new technology (lately, mostly LLMs)',
          'multiplayer games — playing them, and making them',
          'hackathon-energy side projects',
        ],
      },
      stack: { title: 'stack i use' },
      links: { title: 'find me', xLabel: 'x', ghLabel: 'github', mailLabel: 'mail' },
      sign: '— trasta',
    },
    toc: { label: 'contents' },
    share: {
      label: 'share',
      copy: 'copy url',
      copied: 'copied!',
      copiedSr: 'URL copied to clipboard',
      share: 'share',
      xAria: 'share on x',
    },
    notFound: {
      kicker: '404',
      title: () => null,
      titleEn: 'missing',
      lead:
        'this URL has moved, or never existed. head back home and follow the blog or works links instead.',
      home: 'back home',
      blog: 'read the blog',
    },
    themeAria: (mode) => `theme: ${mode}`,
    langSwitcher: { label: 'language', ja: '日本語', en: 'english' },
  },
}

export function getDict(locale: Locale): Dict {
  return DICT[locale]
}
