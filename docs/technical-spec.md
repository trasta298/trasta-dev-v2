# Technical Spec

## 技術スタック

### Core

- Framework: `TanStack Start`
- UI: `React`
- Language: `TypeScript`
- Toolchain: `Vite+`
- Runtime / Deploy: `Cloudflare Workers`
- Dev runtime: `Cloudflare Vite Plugin`
- Package manager: `pnpm`

### Styling

- CSSは最初は素のCSSを基本にします。
- グローバルなデザイントークンはCSS variablesで管理します。
- コンポーネント単位の複雑なUIは必要になるまで増やしません。

### Content

- 記事本文は `MDX` を使います。
- コンテンツの型定義は `content-collections` または同等の型付きcontent loaderで管理します。
- ブログと作品は別コレクションにします。

### Deploy

- Cloudflare Workersにデプロイします。
- Cloudflare Vite Pluginを利用し、Workers Runtimeに近い環境で開発・previewします。
- 静的アセットはWorkersのAssetsとして配信します。

参考:

- https://developers.cloudflare.com/workers/vite-plugin/
- https://developers.cloudflare.com/workers/framework-guides/web-apps/tanstack-start/
- https://tanstack.com/start/latest/docs/framework/react/guide/server-entry-point
- https://viteplus.dev/

## 初期化方針

Vite+を使ってTanStack Startプロジェクトを作成します。

```bash
vp create @tanstack/start
```

プロジェクト作成後、Cloudflare向け設定を確認します。

```bash
vp install
vp dev
vp check
vp build
```

デプロイ系コマンドは `package.json` にまとめます。

```json
{
  "scripts": {
    "dev": "vp dev",
    "build": "vp build",
    "check": "vp check",
    "preview": "vite preview",
    "deploy": "vp build && wrangler deploy"
  }
}
```

## ルーティング

TanStack Startのfile-based routingを使います。

```txt
/
/blog
/blog/$slug
/about
/works
/works/$slug
/admin/login
/admin
/admin/posts/new
/admin/posts/$slug/edit
```

`/admin/*` はPhase 2で実装します。MVP時点では404または未公開ルートにします。

## ディレクトリ方針

```txt
src/
  routes/
  components/
    article/
    embeds/
    layout/
    motion/
    shared/
  content/
    blog/
    works/
  lib/
    content/
    ogp/
    seo/
    share/
  styles/
    global.css
    tokens.css
    animations.css
public/
  images/
docs/
```

現在の `images/` 配下の素材は、実装時に `public/images/` へ移動します。

## Content Model

### Blog frontmatter

```ts
type BlogPost = {
  slug: string
  title: string
  description: string
  publishedAt: string
  updatedAt?: string
  tags: string[]
  category?: string
  draft?: boolean
  ogImage?: string
  xEmbeds?: string[]
}
```

### Work frontmatter

```ts
type Work = {
  slug: string
  title: string
  description: string
  publishedAt?: string
  tags: string[]
  repositoryUrl?: string
  websiteUrl?: string
  image?: string
  featured?: boolean
}
```

## Markdown / MDX

MDXで以下のコンポーネントを使えるようにします。

```tsx
<LinkCard href="https://example.com" title="..." description="..." />
<XPost id="..." />
<Callout type="note">...</Callout>
```

本文中の通常Markdownも読みやすく整えます。

- `h2` / `h3` から目次を生成します。
- headingには自動idを付与します。
- 外部リンクは安全に新規タブで開きます。
- 画像にはcaptionを付けられるようにします。

## Code Block

コードブロックは実装の優先度が高いです。

- Shiki系のハイライトを使います。
- テーマはライト/ダーク両対応にします。
- ファイル名表示に対応します。
- 行番号は任意表示にします。
- コピー用ボタンを右上に固定します。
- 長いコードは横スクロールで読みます。
- モバイルではボタンが本文を隠さないようにします。

推奨UI:

```txt
┌ file: src/routes/index.tsx        copy ┐
│ const message = "hello";                │
└─────────────────────────────────────────┘
```

## Share

記事詳細ページに共有UIを置きます。

- `navigator.share` が使える端末ではネイティブ共有を優先します。
- それ以外はX共有リンクとURLコピーを表示します。
- URLコピー成功時は短い状態表示を出します。

## OGP

記事ごとのOGPを生成します。

### MVP

- frontmatterの `ogImage` があればそれを使います。
- なければ汎用OGPテンプレートを使います。

### Phase 1.5

- Workers上で動的OGP画像を生成します。
- `title`、`description`、タグ、`trasta` / `とらすた` 表記を含めます。
- 画像サイズは `1200x630` にします。

## X埋め込み

`XPost` コンポーネントを用意します。

- 初期表示では軽量なカードを表示します。
- 必要に応じて公式埋め込みスクリプトを遅延読み込みします。
- JSが無効でも元URLへのリンクは残します。

## Link Card

`LinkCard` コンポーネントを用意します。

MVPではメタデータ手入力を基本にします。

```tsx
<LinkCard
  href="https://example.com"
  title="Example"
  description="説明"
/>
```

自動OGP取得はPhase 2で検討します。

## Admin Phase 2

adminはMVP後に追加します。

### 認証

候補:

- Cloudflare Access
- Better Auth
- 独自セッション + D1

最初はCloudflare Accessを第一候補にします。個人サイトのadmin用途として管理範囲が小さく、Workersとの相性が良いためです。

### 保存先

候補:

- GitHub連携でMDXをコミット
- D1に記事を保存
- R2にMDX/画像を保存

第一候補はGitHub連携です。公開コンテンツをGitで管理でき、既存のMarkdown運用と相性が良いためです。

### 編集UI

- スマホでも使える2ペイン未満の編集画面にします。
- デスクトップでは本文とプレビューを横並びにします。
- モバイルでは編集/プレビューをタブ切り替えにします。
- frontmatterはフォームで編集します。
- 本文はMarkdownテキストエリアを基本にします。

## Testing

### Unit

- frontmatter validation
- slug generation
- OGP metadata generation
- table of contents generation

### Component

- CodeBlock copy button
- Share buttons
- LinkCard fallback
- XPost fallback
- Theme toggle

### E2E

- トップからブログ詳細へ遷移できる
- 記事ページの目次リンクが動く
- コードコピーが動く
- ライト/ダークで主要テキストが読める
- モバイル幅でヘッダー・記事・コードブロックが崩れない

## Accessibility

- 本文は十分なコントラストを確保します。
- キーボード操作で主要導線を使えるようにします。
- `prefers-reduced-motion` ではアニメーションを抑制します。
- コピーや共有の状態変化はスクリーンリーダーにも伝わるようにします。

