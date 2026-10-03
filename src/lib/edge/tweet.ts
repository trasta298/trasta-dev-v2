import { getTweet } from 'react-tweet/api'
import { edgeCached } from './cache'

const TWEET_PATTERN = /^\/api\/tweet\/(\d{1,40})$/

export function isTweetRequest(pathname: string): boolean {
  return TWEET_PATTERN.test(pathname)
}

export async function handleTweetRequest(request: Request): Promise<Response> {
  const id = TWEET_PATTERN.exec(new URL(request.url).pathname)![1]
  return edgeCached('tweet', request.url, async () => {
    try {
      // Workers の fetch は User-Agent を付けず、syndication API は UA なしだと 400 を返す
      const tweet = await getTweet(id, { headers: { 'user-agent': 'trasta.dev (+https://trasta.dev)' } })
      return Response.json(
        { data: tweet ?? null },
        { headers: { 'cache-control': 'public, max-age=3600, s-maxage=86400' } },
      )
    } catch (error) {
      console.error(error)
      return Response.json({ error: 'failed to fetch tweet' }, { status: 502 })
    }
  })
}
