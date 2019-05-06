# Vivliostyle.js: TypeScript 化の<wbr/>道のり

<div class="draft-author">緑豆はるさめ @spring-raining</div>

空気を読まず CSS や組版に関係のない Vivliostyle.js の内部についての記事です、すいません:P

Vivliostyle.js のソースコードを見たことはあるでしょうか？ Vivliostyle.js は、その名の通り JavaScript で書かれていますが、そのコードは現在**Closure Compiler**というツールでパッケージングされています。実は、Vivliostyle.js は今後書き換わり**TypeScript**としてリリースすることが計画されています。この記事では、現状のコードをなぜ置き換える必要があるのか、そしてその方法について紹介したいと思います。

## Vivliostyle.js のはじまり

今では CSS によるページレイアウトを実現するライブラリですが、元々このプログラムは Peter Sorotokin 氏が**EPUB Adaptive Layout**という仕様を実現するための参考実装として生まれたもので、とても良くできたものでした。ご存知の通り EPUB は電子書籍のフォーマットですが、EPUB の実態は (X)HTML+CSS を ZIP で固めたもので、そのまま CSS 組版のレイアウトに適用することができました。そういうわけで、Vivliostyle.js は EPUB Adaptive Layout のために用意された機能をベースとして、ブラウザの実装を待たずに最新の CSS Paged Media の仕様にも対応することができるようになったのです。

Vivliostyle.js の最初のコミットを見てみると、Sorotokin 氏によって`js/adapt/`以下に JavaScript のコードが追加されている様子が確認できます。これらのコードには、`goog`で始まる箇所が含まれていますが、これは**Closure Complier**による依存関係解決のために用意されています。Closure Compiler はこのように複数 JS ファイルの管理や最適化、minify など、今では Webpack がやってくれそうな諸々の機能をまとめて提供してくれます。さらに、JSDoc 上のコメントで型を設定することで、Closure Compiler が型のチェックまでしてくれます。私自身は Vivliostyle.js で初めて Closure Compiler に触れましたが、これだけの機能を自前で実装してのける Google の力に震えたものです。

しかし、世は今や Webpack、TypeScript の時代です。今のところ Closure Compiler 自体が無くなることはなさそうですが、現在ごく少人数のボランティアで維持している  Vivliostyle Foundation（一般社団法人ビブリオスタイル）はもはや内輪のメンバーのみで開発・維持していくスタイルは難しくなりつつあります。結論として、Vivliostyle.js が TypeScript に乗り換える理由は「**OSS としてより多くの人に貢献してもらうため**」です。コード自体の魅力がなければ、やがてライブラリとしての Vivliostyle も廃れていくことでしょう。

## Lebab によるモダン化

TypeScript 化の前段階として、Vivliostyle.js はコードを ES3 の状態から ES2015 に置き換える作業をしました。コードのトランスパイルは**Lebab**というツールを使うことで、多くの箇所は何も手を加えること無く変換させることができました（[#416](https://github.com/vivliostyle/vivliostyle.js/pull/416)）。この変更は、すでに master ブランチに取り込まれています。

![圧倒的感謝](/assets/spring_raining/lebab.png)

## TypeScript やっていき

モダンになった Vivliostye.js のコードをもとに、いよいよ TypeScript へコードを置き換えていきます。都合のいいことに、Closure Compiler 用にアノテートされた JavaScript を TypeScript へ変換する**Gents**というツールが公開されており、TypeScript コードの骨子はこのツールにより変換されました。このあたりは Vivliostyle Foundation メンバーの Johannes Wilm 氏の貢献により変換作業が終わりましたが、待ち受けていたのは TypeScript コンパイラによるおびただしい量のコンパイルエラーでした。

この後は、ひたすらコンパイルエラーを潰す作業が続きました。型自体は Closure Compiler 向けの型がほぼ TypeScript に流用できるため、新しく型付けするということはせず、Gents でうまくトランスパイルできなかった箇所を愚直に変換していきます。明らかにおかしな所はあらかた修正し（[#449](https://github.com/vivliostyle/vivliostyle.js/pull/449) [#450](https://github.com/vivliostyle/vivliostyle.js/pull/450) など）、後はエラー内容を見つつ修正していくフェーズになりました。ここで、修正の順番を効率的に決めるため、**Madge**というツールを使ってソースファイル間の依存関係を可視化し、上流の方からソースコードを修正していく試みをしました。CLI 上でソースコードを与えると、Graphviz でいい感じに依存関係を確認することができます。

![Vivliostyle.js のソースコード依存関係](/assets/spring_raining/graph.svg)

実はこの作業はまだ続いており（遅れてすみません…）、現在は 70% 程度のソースコードが修正されています[^ https://github.com/vivliostyle/vivliostyle.js/milestone/1 ]。修正自体は気合いの問題なので、私がこの作業を終わらせれば技術書典 6 のあと頃には TypeScript 版のリリースができそうな気がします。村上さん、後は頼んだ……！

## まとめ

既存ソースコードの TypeScript 化というニッチな内容になってしまいましたが、この内容に限らず Vivliostyle を OSS としてより魅力的なプロジェクトにするべく、今後も様々な施策に取り組んでいきます。ぜひチェックしてください！
