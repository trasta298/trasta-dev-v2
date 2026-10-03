import { waitUntil } from 'cloudflare:workers'

// Worker の応答は Cache-Control を付けても CDN にキャッシュされないので Cache API に置く
export async function edgeCached(
  name: string,
  key: string,
  render: () => Promise<Response>,
): Promise<Response> {
  const cache = await caches.open(name)
  const hit = await cache.match(key)
  if (hit) return hit
  const res = await render()
  if (res.ok) waitUntil(cache.put(key, res.clone()))
  return res
}
