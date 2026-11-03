---
name: write-blog
description: trasta.dev のブログ記事 (`src/content/blog/*.mdx` と `src/content/en/blog/*.mdx`) を、本人へのインタビューと手元の事実をもとに書き、Web で見られるプレビューまで用意する。「ブログ書いて」「記事にしたい」「振り返り書く」「○○について書きたい」のように題材だけ渡されたときや、`/home/trasta/trasta-dev-v2/` に記事を足す・直すときに使う。
---

# write-blog

題材と本人の言葉から記事を 1 本書き、プレビューの URL を渡すところまでやる。

## 進め方

1. 題材の事実を集める。リポジトリ、README、ログ、過去の会話など、手元にあるものを先に読む。数値、日付、固有名詞は必ず元の資料から取る。
2. 本人にインタビューする。`AskUserQuestion` で 1 回 4 問までにする。聞くのは事実ではなく本人にしか分からないこと（動機、印象に残ったこと、苦労、どこまで書いてよいか、費用を載せるか）。選択肢は資料から作り、本人が「Other」に書いた言葉はなるべくそのまま本文に使う。答えがなかった問いは推測で埋めず、書かないか、もらった言葉の範囲で書く。
3. 日本語版を書く。書き方は下の「文章」のとおり。
4. 日本語版を yomiyasu で推敲する（下の「推敲」）。
5. 英語版を書く。日本語版の内容と構成をそのまま英語にする。
6. `pnpm test` と `pnpm build` を通し、ブランチを push してプレビューを渡す（下の「プレビュー」）。
7. 本人の直しを受けて 3〜6 を繰り返す。直しの指示は資料のメモに足しておき、次の推敲の照合に使う。

## ファイル

- 日本語版: `src/content/blog/YYYYMMDD.mdx`、英語版: `src/content/en/blog/YYYYMMDD.mdx`。ファイル名は `publishedAt` の日付と同じにする。
- 画像: `public/images/blog/<内容を表す名前>.png` に置き、`![説明](/images/blog/<名前>.png)` で参照する。日英で画像が違うなら `.ja.png` と `.png` に分ける。
- 外部の記事を一覧に出すだけなら `external-<site>-<id>.mdx` に `externalUrl` と `externalSite` を書き、本文は空にする。

### Frontmatter

```yaml
---
title: "何をした記事かが分かる題（「〜を作った」「〜してみた」など）"
description: "何をやって何の話かを 1 文で。OG カードに出る。"
publishedAt: "YYYY-MM-DD"
tags: ["ISUCON","Claude Code"]
---
```

tags は使った道具や題材を 3〜5 個。年末の振り返りは `[]`。

### コンポーネント

import は要らない。

- `<Callout type="note">…</Callout>`: 本文を AI に書かせた記事は、冒頭に「この記事の文章は Claude に書かせて加筆修正しています」の注記を置く（英語版は「The text of this article was drafted by Claude and then edited by me.」）。
- `<LinkCard href="…" title="…" description="…" site="github.com" />`: 記事の主役のリポジトリや外部記事を、本文の早いところで 1 枚だけ出す。
- `<XPost id="…" user="trasta" />`: X の投稿を埋め込む。X のアカウントは `@trasta`。

### Markdown の注意

- `remark-breaks` が入っているので、段落の中の改行はそのまま `<br>` になる。1 段落は 1 行で書く。
- 表は GFM の表が使える。コードは ```` ```text ```` や ```` ```bash ```` で囲む。
- 本文の見出しは `##` から。title が H1 になる。

## 文章

- ですます調で書く。本人の口語（「ちなみに」「爆死しました」「すごい時代だなぁ」など）はインタビューの答えから拾って使う。口癖を作って足すことはしない。
- 冒頭 1〜2 文で何を作った・やったかを言う。前置きや「本記事では〜」の予告は書かない。
- 見出しは扱う話題の短い名前にする。中身が 1 段落しかない話は見出しを立てず、近い節に入れる。
- 本人が「どうでもいい」と言った話は削り、本人が書きたいと言った話を厚くする。
- 公開しないと決めているもの（非公開のソースの中身など）は、公開済みの README などに書いてある範囲までにする。
- 結論を強く言い切ったり、教訓でまとめたりしない。最後の節は次にやることや読者へのお願いで終える。
- 英数字の前後のスペースやカッコの全角・半角は、機械的にそろえない。

## 推敲

日本語版は [yomiyasu](https://github.com/nanaism/yomiyasu) で推敲する。入っていなければ scratchpad に clone して使う。

- 本文だけ（frontmatter、`<Callout>`、`<LinkCard>` を除いたもの）を `.md` に書き出して検査にかける。
- 資料（README、インタビューのメモ、使った事実のメモ）を `--material` に渡し、資料にない数値や名前が出たら元の資料で確かめる。
- 1 回目は `run --final`、直したあとは前の版を `--source` に渡して `run` する。最後に `verify` を実行し、記録の行を本人への報告に入れる。
- 推敲で本人の言葉の意味や強さを変えない。

## プレビュー

- `post/<題材>` のようなブランチを切り、コミットして push する。Cloudflare Workers Builds がブランチごとにプレビューを作る。
- URL は `https://<ブランチ名の / を - にしたもの>-trasta-dev.trasta.workers.dev/blog/YYYYMMDD`（英語版は `/en/blog/YYYYMMDD`）。
- ビルドの完了は `gh api repos/trasta298/trasta-dev-v2/commits/<sha>/check-runs` で待ち、ページが返ってくるのを確かめてから URL を渡す。
- `pnpm dev` を動かすと `src/routeTree.gen.ts` が書き換わることがある。記事と関係ない差分なのでコミットに入れない。
- main への PR は本人が内容に OK を出してから作る。
