# Vivliostyle Viewer で CSS 組版<wbr/>ちょっと入門

<div class="draft-author">村上 真雄 @MurakamiShinyu</div>

Vivliostyle は、CSS 組版で本を作るためのツールとして、少しずつ知られるようになってきたかと思います。そして、最近の更新では、目次ナビゲーション機能、Web Publications 対応など、Web／電子出版ビューアとしても、使い勝手のよいものを目指しています。この「Vivliostyle Viewer で CSS 組版ちょっと入門」では、Vivliostyle Viewer でできることを中心にした CSS 組版のちょっとだけ入門を書いてみます。

## Vivliostyle Viewer の紹介

Vivliostyle Viewer[^ https://vivliostyle.github.io/vivliostyle.js/viewer/vivliostyle-viewer.html] は、ブラウザ上で動作する CSS 組版エンジン [vivliostyle.js](https://github.com/vivliostyle/vivliostyle.js/) とビューア UI [vivliostyle-ui](https://github.com/vivliostyle/vivliostyle-ui/) でできています。

### 何をするもの？

Vivliostyle Viewer は次のように使われることを想定してます：

- 出版物を Web で公開するのに使える
  - CSS 組版でレイアウトする本や雑誌の Web 版ができる
  - PDF とは違って、リフロー、文字サイズ可変、レスポンシブなレイアウトが可能
- Web で公開されている出版物を閲覧
  - 例えば公開されている EPUB や青空文庫の作品を Vivliostyle Viewer で読める
  - ユーザースタイルの設定によって読みやすい形にして読める
- CSS 組版で本を作るのに使える
  - 組版結果を確認するプレビューアとして
  - 印刷／PDF 書き出しに

### 設置・インストールについて

- 公開されてる Vivliostyle Viewer を使うならインストール不要
  - URL: https://vivliostyle.github.io/vivliostyle.js/viewer/vivliostyle-viewer.html
- ローカルにインストールしてローカルな Web サーバーで使用
  - Vivliostyle のダウンロードページ[^ https://vivliostyle.org/ja/download/]からダウンロードしたパッケージ（最新開発版`vivliostyle-js-latest.zip`またはリリース版`vivliostyle-js-[version].zip`）を解凍してできた`vivliostyle-js-[version]`フォルダ内の`start-webserver`スクリプトを実行するとローカルな Web サーバーが起動して、ローカル環境で Vivliostyle Viewer が使えます。
- 自分の Web サイトに設置
  - ダウンロードしたパッケージ内の`viewer`フォルダを自分の Web サイトにコピーして、Vivliostyle Viewer で閲覧するコンテンツを公開するのに使うことができます。

設置・インストールと使い方について、Vivliostyle Viewer ユーザーガイド[^ https://vivliostyle.github.io/vivliostyle.js/docs/ja/]もご覧ください。

### Vivliostyle Viewer の最初の画面

Vivliostyle Viewer の URL をパラメータなしで開くと、文書 URL の入力欄（“Input a document URL”）と使い方の説明が表示されます。（説明書きは今のところ英語だけですが、Vivliostyle Viewer ユーザーガイド（日本語）[^ https://vivliostyle.github.io/vivliostyle.js/docs/ja/]に日本語訳があります。）

文書 URL の入力欄に表示対象の文書の URL を入れて Enter キーを押すと、その文書をロードして組版結果を表示します。これは Vivliostyle Viewer のURLに、フラグメントパラメータ`#b=<文書のURL>`で表示対象の文書を指定したのと同じことになります。

なお、URL を入力する代わりに、HTML コードを入れることもできて、ちょっと Vivliostyle の組版を試してみるのに使えます。これで例えば`<p>Hello, world!</p>`から CSS 組版をはじめられます。

<figure>
  <img src="/assets/shinyu/helloworld.png" alt="Vivliostyle Viewer スタート画面の文書 URL 入力欄に Hello, world! と入力したところ">
  <figcaption class="fig">Vivliostyle Viewer スタート画面の文書 URL 入力欄に<code>&lt;p&gt;Hello, world!&lt;/p&gt;</code>と入力したところ</figcaption>
</figure>


### 設定パネルからできること

Vivliostyle Viewer の画面右上の設定ボタン <img alt="Settings (S)" src="/assets/shinyu/settings_button.png" style="width: 1.5em;" /> をクリック（または、キーボードの S キー）で、設定パネルが表示されます。ここで設定を変更して **Apply** ボタンを押すと設定内容が適用されます。（**Apply** で通常はパネルが閉じますが、設定ボタン 2 度押しでパネルを開くと、適用してもパネルが開いたままにできます）。

![Vivliostyle Viewer の設定パネル](/assets/shinyu/settings_panel.png)

#### 全ページをレンダリング（Render All Pages）On/Off設定

この設定は、全ページのレンダリング（ブラウザのメモリ上でページを生成する組版処理をして表示や印刷ができる状態にする）を常に行うかどうかを指定します。Vivliostyle Viewer を使う目的によって、この設定が必要です：

- **On**：印刷向き（すべてのページが印刷可能で、ページ番号は期待されるとおりに機能します）
- **Off**：閲覧向き（おおまかなページ番号を使って、クイックロード）

全ページの印刷／PDF 出力を行う場合や、CSS のページカウンタ（`counter(page)`, `counter(pages)`）を正しく表示するには、全ページをレンダリングするモード（Render All Pages: **On**）にする必要があります。

閲覧向き（Render All Pages: **Off**）のモードでは、多数の HTML ファイルで構成される大規模な出版物（EPUB や Web Publications など）を、途中から閲覧するような場合にその部分だけの組版・ページ生成処理をするので、処理時間を待たされることなく閲覧できます。ページ番号のカウントは、実際に組版した結果のページ数ではなく、各 HTML ファイルの大きさと、HTML ファイル内での各要素の位置から計算された、擬似的なページ番号になります。

#### ユーザースタイル設定（User Style Preferences）

設定パネルの**▶ User Style Preferences**を開くと次のユーザースタイル設定項目があります：

- **Page Size**（ページサイズ）　**Preset**で定義済みのページサイズ（**A4**など）を選べるほか、**Custom size**で任意の幅と高さを指定できます。単には CSS の単位（mm, cm, in, pt, px など）が使えます。
- **Page Margins**（ページ余白）　Vivliostyle ではページ余白（`@page`ルールの`margin`プロパティ）のデフォルトは`10%`つまり、上下左右のマージンともページサイズ（高さ／幅）の 10% ずつになっています。
  - **Set page margin to 0**（ページ余白を 0 に）　固定レイアウトの EPUB など、画面いっぱいに表示するのに適したコンテンツを閲覧するのに役に立ちます。
  - **Custom margin** で CSS の`margin`プロパティの値を指定できます。例えば`20mm 15mm 10mm`という指定の場合、上の余白が`20mm`、右と左の余白がともに`15mm`、下の余白が`10mm`ということになります。
  - **Set first page margin to 0** （最初のページ余白を 0 に）という設定は、最初のページがカバー画像なので余白は不要というような場合のためです。
  - **Force html/body margin to 0**（html/body マージンを 0 にする）　HTML 文書にもともと指定されているスタイルシートで body 要素にマージンが設定されているような場合、Vivliostyle で設定されるページ余白とそのマージンの両方が合わさって余白がとても大きくなってしまう問題を解消するためです。
- **Page Breaks**（改ページ）
  - **Allow widows and orphans**（widows/orphans を許容）　デフォルトで Vivliostyle が行っている段落内でのページ分割における widows/orphans の制御（CSS の`widows`／`orphans`プロパティで定義されているデフォルトの動作で、段落を分割するとき 2 行以上がページの先頭／末尾に残るようにする）を行わないようにします。
  - **Avoid page break inside paragraph**（段落内で改ページしない）　段落の途中でページが変わると読みにくいという場合に指定してください。例えば音声読み上げでテキストを読む場合、文の途中でページが変わるとそこで読み上げが切れてしまうというアクセシビリティの問題を解消します。
- **Images**（画像）
  - **Set image max-size to fit page** は画像の最大サイズがページに収まるようにして、ページに収まらず欠けてしまうのを防ぎます。
  - **Keep aspect ratio** は画像のサイズが調整されるとき縦横比を維持するようにします。
- **Text**（テキスト）
  - **Font size** のパーセント値の設定は、ツールバーにある **A<sup>-</sup>** (Text: Smaller)、 **A<sup>+</sup>** (Text: Larger) ボタンで変わる文字サイズと連動しています。これは、Vivliostyle の文字サイズの基本設定（一般のブラウザと同様 16px = 12pt がデフォルト）を変えることになります。
  - **Base font-size** は、ルート要素での`font-size`プロパティ値を設定します。実際の文字サイズは **Font size** のパーセント値と掛け合わされたものになります。
  - **Base line-height** は、ルート要素での`line-height`プロパティ値を設定します。単位をつけない数値で文字サイズを基準にした行の高さを指定します。指定しない場合のデフォルトはブラウザと同じ`line-height: normal`で、行の高さは使われるフォントに依存します。
  - **Base font-family** は、ルート要素での`font-family`プロパティ値を設定します。
- **Override Document Style Sheets**（文書のスタイルシートを上書きする）　これをチェックすると、ここで設定したユーザースタイルが文書に指定されたスタイルシートよりも優先されるようになります（ユーザースタイルの CSS に`!important`が付く）。

#### 設定される CSS コードの確認と追加・編集（CSS Details）

**▶ CSS Details** を開くと、ユーザースタイル設定の内容の CSS コードを確認することができます。また、ここでユーザーが CSS コードを直接書くこともできます。その場合は自動生成されたコメント`/*<viewer>*/`と`/*</viewer>*/`で囲まれてた部分はそのままにして、その前か後に追加するようにしてください。

#### 設定内容は URL パラメータに反映

設定パネルで設定した内容は、Vivliostyle Viewer の URL パラメータに反映されるので、この設定付きの URL をブックマークしたり公開することもできます。
例えば、[Vivliostyle Viewer ユーザーガイド](https://vivliostyle.github.io/vivliostyle.js/docs/ja/) にある [Web 上に公開されている文書に、設定パネルからユーザースタイルの設定を加えた例： 『Cascading Style Sheets Level 2 Revision 2 (CSS 2.2) Specification』](https://vivliostyle.github.io/vivliostyle.js/viewer/vivliostyle-viewer.html#b=https://drafts.csswg.org/css2/&userStyle=data:,/*%3Cviewer%3E*/%0A@page%20%7B%20size:%20A4;%20%7D%0A/*%3C/viewer%3E*/%0A%0A@page%20:first%20%7B%0A%20%20@top-left%20%7B%0A%20%20%20%20content:%20none;%0A%20%20%7D%0A%20%20@top-right%20%7B%0A%20%20%20%20content:%20none;%0A%20%20%7D%0A%20%20@bottom-center%20%7B%0A%20%20%20%20content:%20none;%0A%20%20%7D%0A%7D%0A%0A@page%20:left%20%7B%0A%20%20font-size:%200.8rem;%0A%20%20@top-left%20%7B%0A%20%20%20%20content:%20env(pub-title);%0A%20%20%7D%0A%20%20@bottom-center%20%7B%0A%20%20%20%20content:%20counter(page);%0A%20%20%7D%0A%7D%0A%0A@page%20:right%20%7B%0A%20%20font-size:%200.8rem;%0A%20%20@top-right%20%7B%0A%20%20%20%20content:%20env(doc-title);%0A%20%20%7D%0A%20%20@bottom-center%20%7B%0A%20%20%20%20content:%20counter(page);%0A%20%20%7D%0A%7D&renderAllPages=true)。


## Vivliostyle CSS 組版ちょっと入門

ここでは、Vivliostyle Viewer で閲覧できて、印刷・PDF 出力できるような「本」を作るための、ちょっとしたポイントを解説します。

### 章ごとの HTML ファイルをまとめて本の形にする方法

これまで CSS 組版で本を作る場合、原稿は章ごとに分けて書いていても、最後にひとつの大きな HTML ファイルにまとめたものを CSS 組版のソースにする方法がよく行われてました。

しかし、Vivliostyle では複数の HTML ファイルのまま、まとめて組版して本の形にする方法が便利でおすすめです。

複数の HTML ファイルをまとめる形式はいくつかあります。

- EPUB 形式にする方法: EPUB は、複数の (X)HTML ファイルと、そのほかのリソース（CSS や画像）を、メタ情報や内容リストを XML 形式で記述した OPF ファイルと一緒にまとめて ZIP 形式に圧縮したものですが、Vivliostyle では、これを解凍した形式（複数のファイルになっている状態）を扱うことができます。
- Web Publications[^ https://www.w3.org/TR/wpub/]: これは W3C で標準化が進められている Web 出版物の形式です。メタ情報や内容リストを JSON 形式のマニフェストデータとして記述します。
- 最初の HTML ファイル（通常`index.html`）にほかの HTML ファイルへのリンクをまとめた目次がある形式。

#### 表紙から目次までを`index.html`に

最初の HTML ファイルの名前を`index.html`として、これに表紙（タイトルページ）から目次までを記述する例を説明します。

###### `index.html`の例 {.code-title}
```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>簡単な本</title>
</head>
<body>
  <header>
    <h1>簡単な本</h1>
  </header>
  <nav id="toc" role="doc-toc">
    <h2>目次</h2>
    <ol>
      <li><a href="chapter1.html">最初の章</a></li>
      <li><a href="chapter2.html">２番目の章</a></li>
      <li><a href="chapter3.html">最後の章</a></li>
    </ol>
  </nav>
</body>
</html>
```

###### 各章の HTML の例（`chapter1.html`） {.code-title}
```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>最初の章</title>
</head>
<body>
  <h1>最初の章</h1>
  <p>ほげ。</p>
</body>
</html>
```

このように`index.html`ファイルと、各章の HTML ファイルを用意して、`index.html` の URL を Vivliostyle Viewer の`#b=`パラメータに指定して開くと、組版結果が表示されます。最初のページがタイトルと目次で、目次の項目をクリックするか、→または↓でページを進めると、各章のページへと移動します。目次パネル（Viewer 画面左上のボタンで表示）からのナビゲーションも有効になります。

#### 改ページの指定 `break-before: page | left | right | recto | verso`

この「簡単な本」の例を、より「本」らしくするには、最初のページはタイトルが書かれた表紙ページ、ページをめくると目次ページ、とするのがよいでしょう。それには、まず、目次の要素の前で改ページするように CSS で指定します。CSS Fragmentation[^ https://drafts.csswg.org/css-break/] 仕様で定義されている`break-before`プロパティを使います。

```css
nav {
  break-before: page; /* この要素の前で改ページ */
}
```

`break-before`プロパティの値`page`の代わりに、`left`または`right`を指定することもできて、改ページしたあとのページが見開きの左側または右側のページになるように自動的に空白ページを入れて改ページさせることができます。また、`right`・`left`の代わりに`recto`・`verso`という値を指定することもできます。これは、「表側」・「裏側」という意味で、ページ進行方向が左から右なら`recto`=`right`、`verso`=`left`、ページ進行方向が右から左ならその逆です。（つまり、表紙と同じ側が`recto`でその裏側が`verso`、奇数ページ番号が`recto`で偶数ページ番号が`verso`。）

#### 表紙のページスタイル `@page :first {...}`

CSS Paged Media[^ https://drafts.csswg.org/css-page-3/] 仕様では、`@page`ルールで、ページサイズや余白などを指定します。

```css
@page {
  size: A5;
  margin: 15mm;  /* ページの上下左右の余白を15mmずつに */
  @top-center {
    content: "簡単な本";    /* ページヘッダーにタイトル */
  }
  @bottom-center {
    content: counter(page); /* ページフッターにページ番号 */
  }
}
```

そして、`@page :first {...}`という構文で、文書の最初のページだけのスタイルを指定できるので、表紙のページを作るのに役に立ちます。

```css
@page :first {
  background-color: gold; /* ページ全体に背景色 */
  margin: 0;              /* ページ余白無し */
  @top-center {
    content: none;        /* ページヘッダー無し */
  }
  @bottom-center {
    content: none;        /* ページフッター無し */
  }
}
```

### 目次の作り方

#### `<nav role="doc-toc">`で目次のマークアップ

HTML で目次を作るおすすめののマークアップは次のようなものです：

```html
  <nav id="toc" role="doc-toc">
    <h2>目次</h2>
    <ol>
      <li><a href="chapter1.html">最初の章</a>
        <ol>
          <li><a href="chapter1.html#section1">はじめのセクション</a></li>
          <li><a href="chapter1.html#section2">ふたつめのセクション</a></li>
          ...
        </ol>
      </li>
      <li><a href="chapter2.html">２番目の章</a>
        ...
      </li>
      <li><a href="chapter3.html">最後の章</a>
        ...
      </li>
    </ol>
  </nav>
```

「目次」を表す role 属性の値 "doc-toc" は、Digital Publishing WAI-ARIA[^ https://www.w3.org/TR/dpub-aria-1.0/] という仕様で定義されてます。Vivliostyle は、この属性のある要素（通常は`<nav>`）を目次として認識して、リンクされている HTML をまとめて一冊の本のように扱い、Viewer の目次パネルのナビゲーションも有効にします。

#### Vivliostyle Viewer での目次パネル

![Vivliostyle Viewer の目次パネル](/assets/shinyu/toc_panel.png)

目次パネルでは、HTML の目次の項目のリスト（`<ol>`または`<ul>`要素）から、↓↑←→キーで操作できるツリー状のリストになります。章→セクション→サブセクションのような多階層の目次はリスト要素をネストさせて作ります。目次パネルでは最初トップレベルの項目のみ表示されて、「▸」をクリックして下位の項目が出るようになってます。

#### ページ番号参照 `target-counter()`

HTML の目次はリンクになってます。PDF でもリンクが有効です。でも紙の本にした場合はページ番号が必要でしょう。

CSS Generated Content[^ https://drafts.csswg.org/css-content/] 仕様で定義されている`target-counter()`関数を、リンク要素`<a>`の`::after`擬似要素の`content`プロパティの値に使うことで、各目次項目のリンク先のページ番号を入れられます。

```css
nav li a::after {
  content: target-counter(attr(href), page);
}
```

ページ番号を右寄せにして目次項目との間を点線で埋めるのは、次のように CSS Flexbox の`inline-flex`を使ってできます：

```css
nav li a {
  display: inline-flex;
  width: 100%;
  text-decoration: none;
  color: currentColor;
  align-items: baseline;
}
nav li a::before {
  margin-left: 0.5em;
  margin-right: 0.5em;
  border-bottom: 1px dotted;
  content: "";
  order: 1;
  flex: auto;
}
nav li a::after {
  text-align: right;
  content: target-counter(attr(href), page);	
  align-self: flex-end;
  flex: none;
  order: 2;
}
```

![目次ページ](/assets/shinyu/toc_page.png)

注意：ページ番号が正しく表示されるには、全ページをレンダリング（Render All Pages）の設定が On である必要があります。

### 各章を左ページあるいは右ページからに

各章を HTML ファイルひとつずつで作る場合、各 HTML は改ページした新しいページから開始するので、明示的の改ページの指定`break-before: page`は不要ですが、各章を必ず左右ページ（あるいは奇数・偶数ページ）のどちらかから開始するといった場合には、次のように`<body>`要素に指定します：

```css
body {
  break-before: recto; /* 奇数ページから開始 */
}
```

### ページヘッダー／フッター（ページマージンボックス）

`@page`ルールで次のように書くと、文字列（タイトルなど）やページ番号や画像をページヘッダー／フッターに出力することができます：
```css
@page {
  @top-center {
    content: "サンプル文書";  /* 固定の文字列を出力 */
  }
  @bottom-center {
    content: counter(page) " / " counter(pages); /* 「ページ番号 / 総ページ数」を出力 */
  }
  @top-right-corner {
    content: url(images/logo.png);  /* 画像を出力 */
  }
}
```

ページヘッダー／フッターを指定する`@top-center`や`@bottom-center`など（ページマージンボックスという）は [CSS Paged Media](https://drafts.csswg.org/css-page-3/) 仕様で次の 16 個が定義されています。

<table style="font-size: 80%">
  <tr>
    <td>@top-left-corner</td>
    <td>@top-left</td>
    <td>@top-center</td>
    <td>@top-right</td>
    <td>@top-right-corner</td>
  </tr>
  <tr>
    <td>@left-top</td>
    <td colspan="3" rowspan="3"></td>
    <td>@right-top</td>
  </tr>
  <tr>
    <td>@left-middle</td>
    <td>@right-middle</td>
  </tr>
  <tr>
    <td>@left-bottom</td>
    <td>@right-bottom</td>
  </tr>
  <tr>
    <td>@bottom-left-corner</td>
    <td>@bottom-left</td>
    <td>@bottom-center</td>
    <td>@bottom-right</td>
    <td>@bottom-right-corner</td>
  </tr>
</table>

#### 章タイトルなどをページヘッダー／フッターに `env(pub-title)` と `env(doc-title)`

Vivliostyle では、`env(pub-title)`あるいは`env(doc-title)`という特別な変数を使うことができて、これで本のタイトルや、章のタイトルを、ページヘッダー／フッターに出力することができます。

* `env(pub-title)`は、出版物タイトルを表します。この値は、メインのHTMLファイル（通常`index.html`）の`<title>`要素の内容のテキストです。
* `env(doc-title)`は、個別のHTML文書タイトルを表します。各HTMLファイルの`<title>`要素の内容のテキストです。

本を作るのに章ごとの HTML ファイルにしている場合、`env(pub-title)`は本のタイトル、`env(doc-title)`は章のタイトルということになります。

#### 左右ページのレイアウト `@page :left` と `@page :right`

次は、本の見開きページの左側と右側のページヘッダーにそれぞれ本のタイトルと章のタイトルを出力するという例です：

```css
@page :left {     /* 左側ページ */
  @top-left {
    content: env(pub-title);  /* 本のタイトル */
  }
}
@page :right {    /* 右側ページ */
  @top-right {
    content: env(doc-title);  /* 章のタイトル */
  }
}
```

#### ページヘッダー／フッターへのフォントの指定

[CSS Paged Media](https://drafts.csswg.org/css-page-3/) 仕様で、継承プロパティの値は、ページマージンボックス（`@top-left {...}`など）はページコンテキスト（`@page {...}`）から継承して、ページコンテキストはルート要素から継承するとされています。
ただし、Vivliostyle は現在のところ、ルート要素からページコンテキストへのプロパティ値の継承は未サポートです。したがって、ページヘッダー／フッターに共通のフォントの指定をしたい場合は、ルート要素とは別に`@page {...}`にそのフォントの指定をする必要があります。

```css
@page {
  font-family: "IPAexGothic", sans-serif;
  font-size: 0.75rem;
}
```

このように`@page {...}`にフォントの指定をすると、ページマージンボックス（`@top-left {...}`など）に継承されるので、個別のページマージンボックスに指定しなくてもすみます。そして、ページの本体のほうの基本のフォントは、`@page {...}`ではなくて、ルート要素（`html {...}`あるいは`:root {...}`）で指定します。

### トンボをつけるには

印刷物を作るとき、ページの仕上がりサイズに断裁するための位置合わせのために、ページの四隅などに付ける目印のことをトンボといいます。これを出力するための CSS プロパティが [CSS Paged Media](https://drafts.csswg.org/css-page-3/) 仕様で定義されていて、Vivliostyle はこれを実装しています。

#### トンボを出力 `marks: crop cross`

```css
@page {
  size: A5;
  marks: crop cross;
  bleed: 3mm;
}
```

`marks`プロパティの値`crop`は四隅のトンボ、`cross`は上下・左右の中央の位置を示すトンボです。通常は両方指定します。

#### 塗り足し `bleed: 3mm`

`bleed`プロパティは、塗り足し領域（bleed）の幅を指定します。ページの端まで色を塗るとき、ページの仕上がりサイズぴったりのところまでしか色が塗られていないと、そこで断裁したときのずれによって塗られていない白い部分が残ってしまうため、ページの外側にはみ出して色を塗る塗り足し領域が必要です。このプロパティの仕様でデフォルトは 6pt（約 2.1mm）ですが、日本の印刷業界では 3mm とするのが標準的なので`bleed: 3mm`を指定します。

#### ページの背景色を塗り足し領域に広げる例

本の表紙のページ全体とタイトルのまわりに背景色をつけた例：

```css
@page :first {
  background-color: gold; /* ページ全体に背景色 */
  marks: crop cross;      /* トンボを付ける */
  bleed: 3mm;             /* 塗り足し領域 */
  margin: -3mm;           /* ページ領域を塗り足し領域まで広げる */
}
header {
  background: rebeccapurple;
  padding: 5vh 5vw;
}
header h1 {
  font-size: 4rem;
  text-align: center;
  color: white;
}
```

```html
<body>
  <header>
    <h1>簡単な本</h1>
  </header>
  ...
```

![トンボと塗り足しありで出力した簡単な本の表紙](/assets/shinyu/marks_bleed.png)

この例では、`@page`ルールに`margin: -3mm`という指定をすることでページ領域を塗り足し領域まで広げて、ページ内に配置する要素（この例では紫色の背景色をつけた本のタイトル部分のブロック）が塗り足し領域から配置されるようにしています。

通常のページ余白（`margin: 15mm`など）があるページの場合で、写真をページの隅に配置するような場合には、その要素にマイナスのマージン（ページ余白と塗り足し領域の分）を指定することで、写真の端を塗り足し領域まで広げるようにするとよいでしょう。

```css
@page {
  marks: crop cross;      /* トンボを付ける */
  bleed: 3mm;             /* 塗り足し領域 */
  margin: 15mm;           /* ページ余白 */
}
img.photo {
  float: right;
  margin-right: -18mm;    /* 画像右端を塗り足し領域に */
}
```

![写真を塗り足し領域から配置してるページ](/assets/shinyu/bleed_photo.png)

### ちょっと入門はここまで

ちょっと入門の次は、次のようなトピックなど、

- 段組
- 脚注
- 章番号や図や数式の番号の自動生成とクロスリファレンス
- 図版のページ配置：ページフロート
- ページテンプレート（EPUB Adaptive Layout）

またの機会に。

チュートリアル「簡単な本」サンプルはGist https://gist.github.com/MurakamiShinyu/ に公開[^ https://gist.github.com/MurakamiShinyu/4f0423fd3578a277c7d29f56a31912b7/]しています。
