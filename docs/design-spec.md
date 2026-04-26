# Design Spec

## 方向性

シンプルで読みやすいブログを中心に、少しだけ可愛い動きを足します。

主役は本文です。虎キャラや装飾は、ページの空気を作る小さなアクセントとして使います。

## 表記

- `trasta`
- `とらすた`
- `trasta.dev`

上記以外のブランド表記は使いません。

## カラーパレット

色数を増やさないことを基本にします。新しい色を足す前に、既存トークンと `color-mix` で代替できないか検討します。

実装は `src/styles/tokens.css` にあります。CSS variables をハードコード値の代わりに必ず参照します。

### ベース (light)

- Paper / `--paper` / `--bg`: `#fffefd`
- Ink / `--ink`: `#111111`
- Ink Soft / `--ink-soft`: `#3b3a37` — 副次テキスト
- Ink Mute / `--ink-mute` / `--muted`: `#6b6962` — 補足ラベル・日付・kicker
- Border / `--line`: `#ded8cf`
- Border Soft / `--line-soft`: `#ece7dd` — セクション区切りなど薄い罫線

### サーフェス (light)

- Background Soft / `--bg-soft`: `#faf7f1` — 引用や about カードの背景
- Card / `--card`: `#ffffff` — 各種カードの背景
- Card Hover / `--card-hover`: `#fffaf0` — カードのホバー時背景
- Selection: `rgba(246, 196, 91, 0.42)` (= `--tiger-yellow` を 42% 透過)

### コード (light)

- Code BG / `--code-bg`: `#f7f4ec`
- Code FG / `--code-fg`: `#1a1a1a`
- Code Line / `--code-line`: `#e8e1d2`
- Inline kbd / `--kbd`: `#f3eee3`

### アクセント (light/dark 共通)

- Tiger Yellow / `--tiger-yellow`: `#f6c45b`
- Warm Orange / `--warm-orange`: `#f09a3e`
- Blush Pink / `--blush-pink`: `#f4a7b9`
- Mint / `--mint`: `#7bd9b4`
- Blue Eye / `--blue-eye`: `#76a9ff`
- Lavender / `--lavender`: `#b99ce8`

### CTA テキスト固定色

- CTA Ink / `--cta-ink`: `#111111` (テーマに左右されない固定値)

`--tiger-yellow` / `--warm-orange` の上に常にこの色を載せます。`--ink` をダークモードで明色に切り替えてもCTAは黒文字を維持し、コントラストを保つためです。

### ダークモード

- Paper / `--paper` / `--bg`: `#181512`
- Background Soft / `--bg-soft` (旧 Panel): `#211d19`
- Card / `--card`: `#29231f`
- Card Hover / `--card-hover`: `#322a25`
- Ink / `--ink` (旧 Text): `#f7efe2`
- Ink Soft / `--ink-soft`: `#e3d8c5`
- Ink Mute / `--ink-mute` (旧 Muted Text): `#d2c4ad`
- Border / `--line`: `#5a4d40`
- Border Soft / `--line-soft`: `#34291f`
- Code BG / `--code-bg`: `#221c17`
- Code FG / `--code-fg`: `#f3e6cc`
- Code Line / `--code-line`: `#3f3327`
- Inline kbd / `--kbd`: `#2d2722`
- Selection: `rgba(246, 196, 91, 0.28)` (= `--tiger-yellow` を 28% 透過)

### タグの色付け

タグの背景・枠は対応するアクセントの 18〜22% 透過で塗ります(実装は `color-mix(in oklab, ...)`)。タグ自体は新しい色を増やしません。

## レイアウト

- ヘッダーは小さく控えめにします。
- ヘッダーにアイコンを置きません。
- ファーストビューは `trasta` / `とらすた` と最新記事への導線を中心にします。
- ブログカードは余白を広めにして、読みやすさを優先します。
- `works` はトップでは控えめに、一覧ページでしっかり見せます。

## 使用画像

現時点の素材:

- `concept-light.png`
- `concept-dark.png`
- `tiger-peeking-wall.png`
- `tiger-peeking-wall-effects.png`
- `tiger-tail-motion.png`
- `cute-motion-effects.png`
- `effect-yellow-sparkle.png`
- `effect-orange-bounce.png`
- `effect-pink-wiggle.png`
- `effect-mint-sparkle.png`
- `effect-lavender-sparkle.png`
- `effect-dot-trail.png`

実装時は `public/images/` へ移動します。

## 虎アイコンの使い方

- ヘッダーには置きません。
- 各カードに毎回置きません。
- ページ区切り、フッター、セクション末尾などに少量だけ使います。
- `tiger-peeking-wall-effects.png` はトップページやaboutページのアクセントに使います。
- ブログ詳細ページでは本文の邪魔にならない位置に限定します。

## アニメーション

CSSで実装します。

### 基本方針

- 小さく、軽く、邪魔しない動きにします。
- hover、focus、page transition、section enterで少しだけ動かします。
- `prefers-reduced-motion: reduce` では停止または最小化します。

### 使う動き

- ナビゲーション下線がすっと伸びる。
- 記事カードがhoverで1〜2pxだけ浮く。
- sparkle素材がわずかに上下する。
- tiger tailがゆっくり揺れる。
- ページ遷移時に本文がふわっと入る。
- TOCの現在位置が控えめにハイライトされる。

### 使わない動き

- 大きなキャラアニメーション。
- 画面全体を覆う派手な演出。
- 読書中に本文近くで動き続ける装飾。
- カードごとの大量アイコン。

## ブログ本文デザイン

- 本文幅は読みやすさ優先で `680px` 前後を基準にします。
- 行間は広めにします。
- 見出しは強すぎない太さにします。
- コードブロックは本文とはっきり区別します。
- 引用・リスト・表の余白を丁寧に整えます。

## Code Block Design

- 背景色は本文と明確に分けます。
- フォントは読みやすい等幅フォントを使います。
- コピー用ボタンは右上に置きます。
- ボタンはコードを隠さない位置とサイズにします。
- ダークモードでは黒すぎず、文字の色差を保ちます。

## Mobile

- ヘッダーはテキスト中心で小さくします。
- モバイル上部に虎アイコンを置きません。
- 記事カードは縦積みします。
- TOCは折りたたみます。
- コードブロックは横スクロール可能にします。
- admin編集画面は編集/プレビューのタブ切り替えにします。

