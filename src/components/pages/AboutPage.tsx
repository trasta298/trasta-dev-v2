import { Sparkle } from '../motion/Sparkle'
import type { Locale } from '../../lib/i18n/locale'
import { getDict } from '../../lib/i18n/dict'

export function AboutPage({ locale }: { locale: Locale }) {
  const dict = getDict(locale)
  return (
    <div className="page-wrap about">
      <header className="about__head">
        <p className="kicker">{dict.about.kicker}</p>
        <h1 className="about__title">
          {dict.about.titleHello}
          <span className="about__title-en">{dict.about.titleName}</span>
          {'.'}
          <Sparkle color="lavender" size={22} top="-10px" right="-26px" delay={120} />
        </h1>
        <p className="about__lead">{dict.about.lead}</p>
      </header>

      <section className="about__profile">
        <h2>{dict.about.profile.title}</h2>
        <div className="about__profile-body">
          {dict.about.profile.bio.map((para, i) => (
            <p key={i} dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(para) }} />
          ))}
        </div>
      </section>

      <section className="about__grid">
        <article className="about__card">
          <h2>{dict.about.interests.title}</h2>
          <ul>
            {dict.about.interests.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="about__card">
          <h2>{dict.about.stack.title}</h2>
          <ul className="about__chips">
            <li className="tag" data-color="yellow">Python</li>
            <li className="tag" data-color="mint">Go</li>
            <li className="tag" data-color="pink">TypeScript</li>
            <li className="tag" data-color="lavender">React</li>
            <li className="tag" data-color="yellow">AWS</li>
            <li className="tag" data-color="mint">Cloudflare</li>
            <li className="tag" data-color="pink">Rust</li>
          </ul>
        </article>

        <article className="about__card">
          <h2>{dict.about.links.title}</h2>
          <ul className="about__links">
            <li>
              <a href="https://x.com/tra_sta" target="_blank" rel="noopener noreferrer" className="bare">
                <span className="about__link-key">{dict.about.links.xLabel}</span>
                <span>@tra_sta</span>
              </a>
            </li>
            <li>
              <a href="https://github.com/trasta298" target="_blank" rel="noopener noreferrer" className="bare">
                <span className="about__link-key">{dict.about.links.ghLabel}</span>
                <span>github.com/trasta298</span>
              </a>
            </li>
            <li>
              <a href="mailto:trasta298@gmail.com" className="bare">
                <span className="about__link-key">{dict.about.links.mailLabel}</span>
                <span>trasta298@gmail.com</span>
              </a>
            </li>
          </ul>
        </article>
      </section>

      <footer className="about__sign" aria-hidden>
        <img
          src="/images/tiger-tail-motion.png"
          alt=""
          width={120}
          height={120}
          className="about__tail"
          loading="lazy"
        />
        <span className="about__sig">{dict.about.sign}</span>
      </footer>
    </div>
  )
}

function renderInlineMarkdown(text: string): string {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
  return escaped.replace(
    /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
    (_m, label, href) =>
      `<a href="${href}" target="_blank" rel="noopener noreferrer" class="bare">${label}</a>`,
  )
}
