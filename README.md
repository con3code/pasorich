# PaSoRich - SC2Scratch for PaSoRi to Scratch 3.0
Scratch3.0でSONY PaSoRi (RC-S380) を使ってFelicaのIDmを読み取るための拡張機能です。

手元にある様々なFelicaカードを使ったプログラムの開発が可能になることを目指しています。

---

## 必要なもの
- SONY PaSoRiカードリーダー（RC-S380のみ対応）
- Google Chrome または Chromium互換ブラウザ

　デモ環境をGitHub Pages上で構築　→　[https://con3office.github.io/scratch-gui/](https://con3office.github.io/scratch-gui/)

　デモプログラム　→　[https://github.com/con3office/pasorich/tree/master/demo-projects](https://github.com/con3office/pasorich/tree/master/demo-projects)

---

## 動作環境
- macOS（そのままで動作）
- Windows（汎用USBドライバを導入することで動作。[Zadig](https://zadig.akeo.ie)等）
- ChromeOS（そのままで動作）
- Raspberry Pi（要設定変更） https://qiita.com/frameair/items/596724fc2f3438ea7925
- Android（そのままで動作）

## 開発状況(0.3.5)
- Idm変数のリセットブロックを追加
- 新しいデモプログラムと電子音ファイル追加

WebUSBによる動作検証段階です。拡張機能追加後のPaSoRiリーダー脱着処理等は未作業。

カード読み取りは可能であるものの，読み取ったIdmの反映に1秒程度待機が必要です。リーダーの動作状況を参照して待つブロックを利用します。

## 開発環境
macOS上でローカルScratch3.0環境を構築して開発。

## 参考情報

[SONY PaSoRi RC-S380](https://www.sony.co.jp/Products/felica/consumer/products/RC-S380.html)

[Scratch 3.0の拡張機能を作ってみよう](https://ja.scratch-wiki.info/wiki/Scratch_3.0の拡張機能を作ってみよう)

[WebUSBことはじめ - Qiita](https://qiita.com/Aruneko/items/aebb75feca5bed12fe32)

[WebUSBでFeliCaの一意なIDであるIDmを読む - Qiita](https://qiita.com/saturday06/items/333fcdf5b3b8030c9b05)

[How to Develop Your Own Block for Scratch 3.0](https://medium.com/@hiroyuki.osaki/how-to-develop-your-own-block-for-scratch-3-0-1b5892026421)

## 開発者
kotatsurin
