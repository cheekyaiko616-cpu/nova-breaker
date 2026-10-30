# NOVA BREAKER（ソース一式）

- 動作確認用: `dist/nova_breaker.html`（全部を1ファイルにまとめたもの。iPhoneでそのまま開けます）
- 作り直し: `python3 tools/build.py` で dist を作り直します

## フォルダ構成
- index.html … 画面の骨組み
- css/style.css … 見た目
- js/core.js … 共通設定・セーブ
- js/sprites.js … ドット絵
- js/data/ … キャラ・武器・敵・ステージ・アイテムの設定（数値調整はここ）
- js/game/ … 戦闘・敵の出現・敵の動き・スキル・毎フレームの更新
- js/render.js … 描画と画面上の情報
- js/screens/ … タイトル・ステージ/キャラ選択・レベルアップ・ポーズ・結果・ガチャ
- js/input.js … タッチ操作・ボタン
- js/main.js … 起動
