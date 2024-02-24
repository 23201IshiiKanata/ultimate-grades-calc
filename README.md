# アルティメット成績計算機

テスト点やポートフォリオ点から、あと何点で単位が認定されるかを計算します。

bgm : https://amachamusic.chagasi.com

## 開発

### ESLintの設定
- `npm i` で必要なモジュールをすべてインストール
- VSCodeを使用している場合は、 [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) 拡張機能を導入する

楽をするために遠回りなことをしています
browserify ./public/女子小学生/node/host.js  -o ./public/女子小学生/host.js
browserify ./public/女子小学生/node/client.js -o ./public/女子小学生/client.js