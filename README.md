# trasta.dev

個人サイト ([trasta.dev](https://trasta.dev)) のソースです。ブログと作ったものを置いています。
旧 Astro 版を [TanStack Start](https://tanstack.com/start) + [Cloudflare Workers](https://workers.cloudflare.com/) で組み直しました。

## 使ってるもの

- TanStack Start (SSR / ファイルベースルーティング)
- Cloudflare Workers (`src/server.ts` で言語振り分け)
- MDX + [@shikijs/rehype](https://shiki.style/) で記事 (ja / en は別ファイル)
- バニラ CSS (CSS Variables + `clamp()`)

## 開発

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm test     # vitest
pnpm build    # 本番ビルド
pnpm deploy   # build → wrangler deploy
```

## 書くとき

- ブログ: `src/content/blog/{slug}.mdx` (ja) / `src/content/en/blog/{slug}.mdx` (en)
- 作ったもの: `src/content/works/{slug}.mdx` (ja) / `src/content/en/works/{slug}.mdx` (en)
- frontmatter に `externalUrl` を入れると trap.jp / Zenn など外部記事も index に並びます

詳しくは [/works/portfolio](https://trasta.dev/works/portfolio) に書きました。

## ライセンス

ソースコードは MIT、本文・画像はぜんぶ自分のものなので転載はご相談ください。
