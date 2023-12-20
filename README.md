# PaSoRich 2.0 - SC2Scratch for PaSoRi to Scratch 3.0
SONY PaSoRi (RC-S380/RC-S300) を使ってFelicaカードのIDmを読み取るためのScratch3.0拡張機能です。

スマートカード（Felicaカード）を使ったプログラム開発が可能になることを目指しています。

<img src="https://www.con3.com/files/pasorich_briefpaper.jpg">

---

## 必要なもの
- SONY PaSoRiカードリーダー（[RC-S380](https://www.sony.co.jp/Products/felica/consumer/products/RC-S380.html)と[RC-S300](https://www.sony.co.jp/Products/felica/consumer/products/RC-S300.html)に対応）
- Google Chrome，Microsoft Edge 等のWebUSB対応ブラウザ

## 動作環境
- macOS（そのままで動作）
- Windows（汎用USBドライバを導入することで動作。[Zadig](https://zadig.akeo.ie)等）
- ChromeOS（そのままで動作）
- Raspberry Pi（要権限設定） https://qiita.com/frameair/items/596724fc2f3438ea7925
- Android（そのままで動作）

　※iOSでは利用できません。

## デモ用Scratchプロジェクト
[https://github.com/con3code/pasorich/tree/master/demo-projects](https://github.com/con3code/pasorich/tree/master/demo-projects)

## 利用情報
PaSoRiを始め，ICカードをScratchで利用する関連情報を以下のサイトで公開しています。

[SmartCard to Scratch3.0 - 拡張機能SC2Scratch関連情報サイト](https://con3.com/sc2scratch/)


---

## How

1. Setup LLK/scratch-gui on your computer.

    ```
    % git clone git@github.com:LLK/scratch-gui.git
    % cd scratch-gui
    % npm install
    ```

2. In scratch-gui folder, clone pasorich. You will have numberbank folder under scratch-gui.

    ```
    % git clone https://github.com/con3code/pasorich.git
    ```

3. Run the install script.

    ```
    % sh pasorich/install.sh
    ```


---

## 開発状況
### (2.0)
- RC-S300に対応
- ICカードリーダーの複数利用に対応
- 更新確認機能ブロックの追加
- デバイスリセットブロックの追加

### (0.7.0)
- コードの見直し整理

### (0.6.9)
- 「IDm」に表記変更

### (0.6.8)
- デバイス初期化手続きの見直し

### (0.6.7)
- 内部処理の改善
- 「読み取り完了」真偽値ブロックの廃止
- ブロック名の見直し

### (0.6.0)
- 日本語化（にほんご化）
- 「読み取り完了」真偽値ブロックの追加
- 「reading」「writing」真偽値ブロックの廃止
- デモプロジェクトの修正

### (0.3.9)
- 「connect」ブロックを追加

### (0.3.6)
- アイコンとイメージを新調
- タイミング微調整


## 開発環境
Xcratch（拡張Scratch3.0環境）にて，JavaScript言語を使用して開発。
macOS／Cursor Editor／Google Chrome

## ライセンス
PaSoRiはソニーグループ株式会社またはその関連会社の登録商標または商標です。
PaSoRich (SC2Scratch for PaSoRi)及び関連情報はscrtach-vm/scratch-guiとともに利用することを踏まえ，それらと同様の三条項BSDライセンス（BSD-3-clause）にもとづき自由に利用することができます。連絡不要ですが，活用例等の報告は大歓迎です。

## 参考情報
[SONY PaSoRi RC-S300](https://www.sony.co.jp/Products/felica/consumer/products/RC-S300.html)
[SONY PaSoRi RC-S380](https://www.sony.co.jp/Products/felica/consumer/products/RC-S380.html)

[Scratch 3.0の拡張機能を作ってみよう](https://ja.scratch-wiki.info/wiki/Scratch_3.0の拡張機能を作ってみよう)

[WebUSBことはじめ - Qiita](https://qiita.com/Aruneko/items/aebb75feca5bed12fe32)

[WebUSBでFeliCaの一意なIDであるIDmを読む - Qiita](https://qiita.com/saturday06/items/333fcdf5b3b8030c9b05)

[How to Develop Your Own Block for Scratch 3.0](https://medium.com/@hiroyuki.osaki/how-to-develop-your-own-block-for-scratch-3-0-1b5892026421)

[「WebUSBでFeliCaのIDmとMIFAREのIDも読み込む」を、RC-S300に対応させたよ](https://qiita.com/MarioninC/items/b5c59e78f3e23c06b83f)

[JavaScript Web APIs USBDevice を使って FeliCa リーダー／ライターを操作してみました。](https://sakura-system.com/?p=2892)

PaSoRich自体はインターネット接続を必要としませんが，クラウドとの連携は拡張機能[NumberBank](https://con3.com/numberbank/)を利用することができます。

## 開発者
@kotatsurin
