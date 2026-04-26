import { Tweet } from 'react-tweet'
import './x-post.css'

type XPostProps = {
  id: string
  user?: string
  text?: string
}

export function XPost({ id, user }: XPostProps) {
  const fallbackUrl = user
    ? `https://x.com/${user}/status/${id}`
    : `https://x.com/i/web/status/${id}`

  return (
    <div className="x-post-embed">
      <Tweet
        id={id}
        fallback={<XPostFallback id={id} url={fallbackUrl} user={user} />}
      />
    </div>
  )
}

function XPostFallback({
  id: _id,
  url,
  user,
}: {
  id: string
  url: string
  user?: string
}) {
  return (
    <a
      className="x-post-embed__fallback"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="x-post-embed__head">
        <svg
          className="x-post-embed__icon"
          viewBox="0 0 24 24"
          aria-hidden="true"
          width={14}
          height={14}
        >
          <path
            fill="currentColor"
            d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
          />
        </svg>
        <span>{user ? `@${user}` : 'view post on X'}</span>
      </div>
      <p className="x-post-embed__cta">read on x →</p>
    </a>
  )
}
