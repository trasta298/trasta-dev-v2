import './link-card.css'

type LinkCardProps = {
  href: string
  title: string
  description?: string
  image?: string
  favicon?: string
  site?: string
}

export function LinkCard({ href, title, description, image, favicon, site }: LinkCardProps) {
  let host = site
  try {
    if (!host) host = new URL(href).host
  } catch {
    host = href
  }
  const fav = favicon ?? `https://www.google.com/s2/favicons?domain=${host}&sz=64`

  return (
    <a
      className="link-card"
      href={href}
      target="_blank"
      rel="noopener noreferrer nofollow"
    >
      <div className="link-card__body">
        <p className="link-card__title">{title}</p>
        {description ? (
          <p className="link-card__desc">{description}</p>
        ) : null}
        <p className="link-card__site">
          <img src={fav} alt="" width={14} height={14} loading="lazy" />
          <span>{host}</span>
        </p>
      </div>
      {image ? (
        <div className="link-card__thumb">
          <img src={image} alt="" loading="lazy" />
        </div>
      ) : null}
    </a>
  )
}
