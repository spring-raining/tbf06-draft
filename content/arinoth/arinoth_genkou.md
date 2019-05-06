# EPUB Adaptive Layout による<wbr/>段組み<wbr/>混在<wbr/>レイアウト<wbr/>への<wbr/>挑戦

<div class="draft-author">リブロワークス 大津雄一郎 @arinoth</div>

まだ完成していないので名前は伏せますが、某複合機の製品マニュアルのための PDF 生成用 CSS の作成に関わりました。そのマニュアルのレイアウトは、基本 2 段組みで上部に 1 段組みが混ざる場合があるという、異なる段組みが混在したものです。今までも書籍の「仮組み」を作る目的で Vivliostyle を使ってきましたが、完成印刷物（注：実案件のフィニッシュは複合機で印刷できることです）まで目指したのは今回がはじめてで、かなり苦労しました。

今回はそのために作成した EPUB Adaptive Layout によるマスターページについて軽くお話しします。EPUB Adaptive Layout はなかなか難しいもので、手探りの試行錯誤で成果物を作ることは何とかできたというレベルなのですが、体験談の 1 つとしてお読みいただけると幸いです。

※画像のサンプルはこの記事のために作成したもので、実案件の成果物とはまったく異なります[^ この記事で使用するサンプルのデータ https://github.com/lwohtsu/atom-markdown-book-preview/tree/master/bookmasterpage_sample]。

![マスターイメージ](/assets/arinoth/sshot-2.png)

## EPUB Adaptive Layout とは？
Vivliostyle にはページレイアウトを設定するための仕様が 2 種類あります。1 つは「CSS Paged Media」、もう1つは「EPUB Adaptive Layout[^ EPUB Adaptive Layout http://www.idpf.org/epub/pgt/]」です。名前からして本命は前者のようなのですが、表現力は EPUB Adaptive Layout のほうが圧倒的に勝っています。

EPUB Adaptive Layout の特徴は、「マスターページ」というものを設計し、どこに何を流し込むかを細かく指定できる点です。マスターページを複数作って切り替えながら使うこともできます（自在に使うのはかなり難しいですが）。

**@-epubx-page-template ルール**内に**@-epubx-page-master ルール**を書き、それが1つのマスターページの指定になります。マスターページの指定内には**@-epubx-partition ルール**を使ってパーティーション（領域）を作り、それがコンテンツが流し込まれる場所の指定となります。パーティーションとは InDesign でいうところのマスターアイテム的なものです。

###### マスターページのイメージコード {.code-title}
```css
@-epubx-page-template {
  /* ここからマスター設定 */
  @-epubx-page-master main {
    @-epubx-partition back1{
      背景飾り
    }
    @-epubx-partition col2{
      2段組み流し込み領域
    }
    @-epubx-partition col1{
      1段組み流し込み領域
    }
    @-epubx-partition {
      ノンブル領域
    }
    @-epubx-partition {
      柱流し込み領域
    }
  }
}
```

![図版：マスターページ](/assets/arinoth/sshot-6.JPG)


今回のサンプルではマスターページの指定は別ファイルに分けてインポートしています。ページサイズは @page ルールで指定します。

###### manual.css {.code-title}
```css
/*ページサイズ*/
@page {
  size: 210mm 297mm;  /*A4*/
}

@-epubx-page-template {
  @import "masterpage_simple.css";
}
```

サンプルの HTML は次のとおりです（実際のサンプルは Markdown から変換した都合で日本語が 16 進数表記になっています）。

###### master_test.html {.code-title}
```html
<!DOCTYPE html>
<html>
  <head>
    <title>doc</title>
    <meta charset="utf-8">
    <link rel="stylesheet" href="css/manual.css">
  </head>
  <body>
    <div class="coverpage">
      <h1>タイトルページ</h1>
    </div>
    <div class="runninghead">ランニングヘッド</div>

    <div class="sect">
      <div class="uppersingle">
        <h1>タイトル1</h1>
        <p>この文章はダミーです。文字の大きさ、量、字間、行間等を確認するために入れています。</p>
        <div class="dummyboxh">ダミーボックス</div>
      </div>

      <h2>中タイトル</h2>
      <h3>小タイトル</h3>
      <p>この文章はダミーです。文字の大きさ、量、字間、行間等を確認するために入れています。
      <div class="uppersingle">
        <img src="kissclipart-royal-exchange_cc0.png" alt="">
      </div>
      ……後略……
```
上部の一段組み領域に流し込みたい部分は「`<div class="uppersingle">`」で囲んでいます。また、カバーページにする部分は「`<div class="coverpage">`」で囲んでいます。注目すべきところはそれぐらいで、あとは標準的な HTML です。


## パーティーションの作成
### ノンブルの配置
マスターページ内に書く領域について 1 つずつ説明していきます。まずはたいていの文書で必要となるノンブル（ページ番号）の配置からです。

Vivliostyle のマスターページは、InDesign のような見開き設定ができないため、左右ページでスタイルを変えたい場合でも 1 ページ分の設定の中に書かなければいけません。右ページと左ページで位置が変わる場合、領域も 2 つ必要となります。そして**-epubx-enabled プロパティ**を利用して、奇数ページと偶数ページのどちらかにだけ表示されるよう制限します。


###### masterpage_simple.css {.code-title}
```css
/*偶数ノンブル*/
@-epubx-partition {
  -epubx-enabled: -epubx-expr( page-number % 2==0);
  content: counter(page);
  position: absolute;
  bottom: 5mm;
  left: 15mm;
  width: 170mm;
  height: 5mm;
  text-align: left;
  font-size: 12pt;
  color: #000;
}
/*奇数ノンブル*/
@-epubx-partition {
  -epubx-enabled: -epubx-expr( page-number % 2==1);
  content:  counter(page);
  position: absolute;
  bottom: 5mm;
  right: 15mm;
  width: 170mm;
  height: 5mm;
  background-color: 0;
  text-align: right;
  font-size: 12pt;
  color: #000;
}
```

ページ番号は`counter(page)`で表示し、「`counter-reset: page`」で初期化できるのですが、「`@-epubx-page-template {}`」内で初期化しないと効果がないようです。

### 2 段組みの本文領域の作成
次にメインとなる 2 段組み用の領域を作成します。2 段組みの実装方法としては、「マスターで 2 段組みの領域を作る」方法と、「マスターでは 1 段組みにして流し込まれる側に2段組みを設定する」方法の 2 とおりが考えられます。ただ、筆者が前に試したところでは、後者のやり方だと段がキレイにそろわず、理解しがたいところで次ページに送られた経験があります。

このサンプルのようにマスター側で 2 段組みにした場合、実際のページでは Vivliostyle が 2 つのボックスを生成して配置します。どこまでを前段に残し、どこから次の段に送られるかという判断も Vivliostyle が行うようです。そのせいかはわかりませんが、結果として比較的きれいな段組みになる印象です。

###### masterpage_simple.css {.code-title}
```css
/* 二段組み領域 */
@-epubx-partition col2{
  -epubx-flow-from: body;
  -epubx-required: true;
  top: 25mm;
  left: 20mm;
  width: 170mm;
  height: 247mm;
  overflow: visible;
  /*段数指定*/
  column-count: 2;
  column-gap: 8mm;
  column-rule: dotted 0.5mm #000;
  column-fill: auto;
  background: #EFF;
}
```

領域内で使用しているのはほとんどが一般的な CSS プロパティですが、重要なものが 2 つあります。まず「`-epubx-flow-from: body;`」は body 要素内のコンテンツをこの領域に流し込めという指示です。他の領域に流し込む指定がないコンテンツはすべてここに流し込まれます。

その次の「`-epubx-required: true;`」はこの領域をマスター内に必ず配置しろという意味です。これはマスター内の**1 つの領域に必ず書く**必要があるらしく、「`-epubx-required: true;`」が 1 つもない場合や、複数の領域に書いた場合は Vivliostyle がフリーズするようです。

### 1 段組みの本文領域の作成
次に1段組み領域を作成します。領域の作り方自体はこれまでと同じです。ちなみに`@-epubx-partition`のあとに「`col1`」や「`col2`」という名前を付けていますが、これ自体はあまり意味はないようです（少なくともこのサンプル内では無意味です）。

重要なのは、「`-epubx-flow-from: master-single-flow;`」です。これは`master-single-flow`という名前が表すフロー（コンテンツの流れ）をこの領域に流し込めという意味です。このフローは別のところで定義する必要があります。ちなみにフローの名前を間違えると Vivliostyle が止まったりするので、とても注意してください。

###### masterpage_simple.css {.code-title}
```css
/* 一段組み領域 */
@-epubx-partition col1{
  -epubx-flow-from: master-single-flow;
  top: 25mm;
  left: 20mm;
  width: 170mm;
  background: #FFE;
  overflow: visible;
  padding-bottom: 10mm;
  max-width: 247mm;
}
```

また、この領域は初期状態の高さを設定せず、`max-width`だけを指定しています。この場合、流し込むコンテンツがない場合は 1 段組み領域は表示されません。今回のフォーマットでは任意のページだけに 1 段組みを表示したいので、こういう指定にしています。ただし、このような領域を重ねる配置方法には、いくつか副作用があります。それについてはあとで説明します。

<br>

今度は流し込む側の指定です。1 段組み領域に流し込むコンテンツは、HTML 側では`div.uppersingle`で囲んでいます。この場合`.uppersingle`をセレクタにして、「`-epubx-flow-into: master-single-flow;`」と指定します。つまり、コンテンツ側に`-epubx-flow-into`プロパティを書き、流し込む領域側に`-epubx-flow-from`プロパティを書き、両者を同じフロー名で紐付けるのです。


なお、この指定は`@-epubx-page-template`の中、かつ`@-epubx-page-master`の外に書く必要があります。

###### masterpage_simple.css {.code-title}
```css
.uppersingle {
  -epubx-flow-into: master-single-flow;
  break-before: page;
}
@-epubx-flow master-single-flow {
  -epubx-flow-consume: all;
}
```

そのあとの「`@-epubx-flow master-single-flow{-epubx-flow-consume: all;}`」ですが、これは流し込むものが柱の場合は不要で、本文的なコンテンツの場合は必要なものです。村上さんに質問したところによると、ないと一部が表示されない恐れがあるとのこと。

`-epubx-flow-into`と`-epubx-flow-from`を使うときに大事なのは、とにかく**フロー名を間違えない**ことです。マスターページを作り始めたころに、「何かよくわからないけど止まる……」原因はたいていフロー名の不一致です。

### 柱の作成
柱（runninghead）のための指定です。これはノンブルの配置と 1 段組み配置の合わせ技ですね。領域指定については特に新たに説明するものはありません。

###### masterpage_simple.css {.code-title}
```css
/* 柱 */
@-epubx-partition{
  -epubx-enabled: -epubx-expr( page-number % 2==1);
  -epubx-flow-from: master-running-flow;
  position: absolute;
  top: 5mm;
  right: 15mm;
  width: 170mm;
  height: 5mm;
  background-color: 0;
  font-size: 12pt;
  color: #000;
}
```

`-epubx-flow-into`側では「`-epubx-flow-options: static exclusive last;`」を付けます。これがないと柱は 1 回しか表示されません。

###### masterpage_simple.css {.code-title}
```css
.runninghead {
  -epubx-flow-into: master-running-flow;
  -epubx-flow-options: static exclusive last;
  text-align: right;
}
```

なお、柱に流し込んだコンテンツは本文領域に表示されなくなるため、見出しを柱に表示したいときはどうしたらいいか悩みます。解決策は実は非常に単純で、見出しの要素と別に柱に表示する用の要素を作ればいいのです。

```html
<h2>見出しのタイトル<span class="runninghead">見出しのタイトル</span></h2>
```


### ページに飾りを付ける
領域回りの説明もこれで最後です。今回のマスターには、ページ回りに緑色の飾りを付けています。単に領域をいくつか置くだけです。

###### masterpage_simple.css {.code-title}
```css
/* 背景装飾 */
@-epubx-partition back1{
  top:0;
  left: 0;
  width: 210mm;
  height: 297mm;
  background: #6D6;
}
@-epubx-partition back2{
  -epubx-enabled: -epubx-expr( page-number % 2==0);
  top:15mm;
  left: 10mm;
  width: 200mm;
  height: 267mm;
  background: #FFF;
}
@-epubx-partition back2{
  -epubx-enabled: -epubx-expr( page-number % 2==1);
  top:15mm;
  left: 0;
  width: 200mm;
  height: 267mm;
  background: #FFF;
}
```

なお、マスターページ内に複数の領域を配置する場合、`@-epubx-page-master`内で**先に記述したものが奥に配置されます**。そのため、背景のための領域は先に書き、本文や柱のテキストはあとに書くといいでしょう。

`z-index`プロパティを使って強制的に領域の重ね順を変えることもできますが、使いすぎるとわけがわからなくなるので、基本は記述順で重ね順をコントロールし、それでどうしても不都合があるときだけ`z-index`を使ったほうがよさそうです。

## 「超」重要な改ページの制御
改ページ用のプロパティは普通の CSS ではあまり意識されないものですが、CSS 組版では「超」重要です。そしてとてもやっかいです。うまく設定しないと、改ページをしてほしいところでしてくれず、しなくていいところでしたりします。

改ページしたいところに要素（ボーダーを消した hr 要素など）を置いて強制改ページ指定するなら簡単ですが、それだと人間が手作業ですべて指定しなければいけなくなってしまいます。最低でも見出しをページ末に配置しない（`break-after: avoid-page`）設定はしておくべきでしょう。


|<div style="min-width: 8rem">プロパティ</div>|<div style="min-width: 8rem">値</div>|説明
|--|--|--
|`break-before`|`auto` | 初期値。
||`page` |この要素の前で改ページする。
||`column`| この要素の前で改段する。
||`left` |この要素の前で改ページして、左ページから開始する。
||`right` |この要素の前で改ページして、右ページから開始する。
||`avoid-page`| この要素の前での改ページを避ける。つまり、直前の要素を上に引っ張ってくる。
||`avoid-column`|この要素の前での改段を避ける。つまり、直前の要素を上に引っ張ってくる。
|`break-after`|`auto` | 初期値。
||`page` |この要素のあとで改ページする。
||`column`| この要素のあとで改段する。
||`left` |この要素のあとで改ページして、左ページから開始する。
||`right` |この要素のあとで改ページして、右ページから開始する。
||`avoid-page`| この要素のあとでの改ページを避ける。つまり、要素がページ末に来そうなら、次のページに送る。
||`avoid-column`|この要素のあとでの改段を避ける。つまり、要素が段末に来そうなら、次の段に送る。
|`break-inside`|`auto`| 初期値。
||`avoid-page`| 要素の途中での改ページ（泣き別れ）を避ける。つまり、改ページしそうなら丸ごと次ページに送る。
||`avoid-column`|要素の途中での改段（泣き別れ）を避ける。つまり、改段しそうなら丸ごと次段に送る。

プロパティが 3 種類、値もたくさんあるので、覚えきれないのではと心配するかもしれませんが、大丈夫です。**うまく行くまで何度も調整することになるので、そのうちに忘れられなくなります**。

これらのプロパティは CSS 標準に属するので、ちゃんと MDN にも載っています[^ 
https://developer.mozilla.org/ja/docs/Web/CSS/break-inside]。

![MDNの画像](/assets/arinoth/sshot-5.png)

なお、CSS には`pabe-break-before`のように`page-`で始まるプロパティもあり、今でも使えますが非推奨になったようです。

改ページ位置は`orphans`（ページ末に表示する最小行数）と`widows`（ページ頭に表示する最小行数）の影響も受けます。これもいろいろ調整しながら最適な値をひねり出すしかありません。




## さまざまなトラブルと暫定的な対処
ここからはマスターページを使っている内に起きたさまざまなトラブルについて書いていきます。ほぼ解決したのでさらっと書いていますが、夢に見るレベルで大変でした。


### フローごとに改ページ制御が必要
サンプルのように 1 段組み領域と 2 段組み領域があって個別に流し込む場合、フローは別々に処理されます。つまり、1 段組み領域と 2 段組み領域は別のコンテンツとして扱われます。ちょっと困ってしまうのは、コンテンツの分量によっては HTML の順番とは異なる表示になってしまうことです。

次の図では HTML では「1段、2段、1段、2段」という順番にコンテンツが並んでいますが、ページ上の表示が「1段、2段、2段、1段」となってしまう場合があるということです。いわゆる非同期問題みたいなものですね。1 段組みのコンテンツが挿絵のようなものなら問題ないのですが、節見出しのようなコンテンツの区切りの場合、困ったことになります。

![図版：前に流し込まれてしまう](/assets/arinoth/sshot-7.JPG)

それで困る場合は、1 段組み、2 段組みフローそれぞれで改ページ指定する必要があります。

![図版：改ページ指定を加えて合わせる](/assets/arinoth/sshot-8.JPG)

### 領域を重ねると、いろいろと困った現象が起きる
サンプルのマスターは 1 段組み領域と 2 段組み領域を重ねています。聞いたところによると、領域が重なった場合、Vivliostyle が間に**floatを設定した領域**を挟み、下に来る要素（サンプルの場合は 2 段組み領域）の文字が隠れないように追い出してくれます。InDesign でいうところの「テキストの回り込み」処理ですね。ところがここで困るのは、文字は追い出してくれるのですが、**要素自体は残ってしまう**という点です。

この結果、次のような問題が起きます。

- 段頭に配置された要素の上ボーダーが消える
- 段頭に配置された li 要素のマーカーが変な位置に来る／消える

知らないとビックリしますが、要するに上の領域に、下の領域の要素が潜り込んでしまっているのです。

実案件では問題が終盤に発覚したため、かなり強引な方法で解決することになってしまったのですが、紹介するほどいいやり方ではありません。そもそも「段組みを混在させるためにマスターページ内で領域を重ねる」という方法がよくないという説もあります。

### 版面からはみ出すカバーページを作りたい
カバーページ（本扉、章扉）はたいてい他のページとはデザインが異なります。ただ、そのためにマスターページを増やすと別の問題が起きるため、結構シンプルな方法で解決しました。

![カバーページ](/assets/arinoth/sshot-1.png)

要素サイズをページサイズに合わせ、絶対配置にして版面外にはみ出させ、さらに`z-index`も増やしてマスターページの要素を隠してしまうのです。

###### manual.css {.code-title}
```css
/* カバーページ */
.coverpage{
  position: absolute;
  width: 210mm;
  height: 297mm;
  background: #FFE;
  top: -25mm;
  left: -20mm;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10;
}
```

### マスターページの適用順がおかしくなる
Vivliostyle では複数のマスターページを作ることができますが、この制御が結構難しく、油断すると HTML での順番を無視して**書籍の冒頭に奥付が来る**といったトラブルが起きます。

いろいろと質問してみたり試行錯誤してみたりしたのですが、最終的に実案件では、マスターページの使い回しを減らし、**台割の順番に合わせて似たようなマスターページを大量に作る**という方法を採りました。つまり、仮に「白ページマスター」「赤ページマスター」が交互に来る書籍があった場合、「白ページマスター 1」「赤ページマスター 1」「白ページマスター 2」「赤ページマスター 2」のように大量に作ってしまうのです。

きれいな方法ではありませんが、奥付が書籍の頭に表示されるよりはマシです。それに一般的な書籍であれば、せいぜい「前付けマスター」「目次マスター」「本文マスター」「後付けマスター」ぐらいで済むと思います。


ちなみに実案件では、章のツメを動かすために章ごとにマスターページを作っています。ただ、あとから考えると、1 マスター内にツメの領域を複数作っておき、章ごとに流し込む領域を変えるという方法でもよかったかもしれません。

### 段頭に来た見出しの上マージン
見出しの上マージンは、ページや段の先頭に来るときは 0、それ以外のときは空けたいものです。ページや段の先頭に来たときにマッチする擬似セレクタがあるといいのですがないので、上マージンを 0 にしておき、「`p+h2`」などの条件で上マージンを設定するのが一般的なやり方でしょうか。

ただ、この方法でうまく行かないときや、特に指定していないのに上マージンが0になることもあってなかなか謎が多いです。


### 前処理で補助用のクラスをたくさん付けたほうがよさそう
実案件では「HTML を入力しやすいようクラスは最低限に」という要望があって、最低限のクラス指定（それでも結構ありましたが）で進めた結果、『CSS 設計本』で禁じ手とされるややこしいセレクタ指定やスタイル打ち消しが大量に発生してしまい、いわゆるメンテナンスしにくい CSS になってしまいました。

反省点なのですが、クラスを手で入力できないのであれば、何かのスクリプトの前処理でクラスを自動追加してしまえばよかったですね。例えばリストの入れ子がかなりあったので、スクリプトで階層をチェックして「`ol_level1`」「`ol_level2`」のようなクラスを自動追加するだけでも、かなりやりやすくなったのではないかという気がします。

## まとめ
今のところ、CSS 組版で最終印刷物まで持って行くのは、ノウハウなさ過ぎて大変です。InDesign だったら「赤字を入れて、はいお願い」で済むことに、何倍の時間かけているんだという気持ちになります。とはいえ、書き出した PDF を見ると「意外とちゃんとできてるなぁ」という印象はありますし、挑戦する人が増えてノウハウが蓄積されてくれば、また違った地平が見えて来るのではないでしょうか。
