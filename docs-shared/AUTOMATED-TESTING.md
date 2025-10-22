# 自動テスト環境

## 🎯 テスト自動化の構成

### テストフレームワーク
- **Jest**: TypeScript対応のテストランナー
- **ts-jest**: TypeScriptトランスパイル
- **Obsidian API モック**: APIシミュレーション

## 📁 テスト構造

```
obsidian-multi-git-plugin/
├── tests/
│   ├── __mocks__/
│   │   └── obsidian.ts        # Obsidian APIのモック
│   ├── main.test.ts            # ユニットテスト
│   ├── git-operations.test.ts  # Git統合テスト
│   └── e2e/
│       └── plugin-load.test.ts # E2Eテスト
├── jest.config.js              # Jest設定
└── package.json                # テストスクリプト
```

## 🚀 テストコマンド

### 基本テスト
```bash
npm test                 # 全テスト実行
npm run test:watch      # ウォッチモード
npm run test:coverage   # カバレッジレポート生成
```

### 個別テスト
```bash
npm run test:unit       # ユニットテストのみ
npm run test:integration # 統合テストのみ
npm run test:all        # ビルド→セットアップ→全テスト
```

## ✅ テスト内容

### 1. **ユニットテスト** (`main.test.ts`)
- プラグインの読み込み/アンロード
- コマンド登録
- 設定の保存/読み込み
- Obsidian API連携

### 2. **統合テスト** (`git-operations.test.ts`)
- Gitステータス確認
- リモート設定検証
- ファイル追跡
- コミット履歴

### 3. **E2Eテスト** (`plugin-load.test.ts`)
- ビルド成果物の検証
- manifest.json妥当性
- テスト環境へのデプロイ
- ファイル構造確認

## 🔄 CI/CD パイプライン

### GitHub Actions (`.github/workflows/test.yml`)
```yaml
テストマトリックス:
- OS: Ubuntu, Windows, macOS
- Node.js: 18.x, 20.x

ジョブ:
1. ビルド検証
2. ユニットテスト
3. 統合テスト
4. カバレッジレポート
5. TypeScript型チェック
```

### 自動実行トリガー
- Push to master/main/develop
- Pull Request
- 手動実行可能

## 📊 カバレッジレポート

```bash
npm run test:coverage
```

生成される内容:
- `coverage/` ディレクトリ
- HTML レポート: `coverage/lcov-report/index.html`
- ターミナル出力
- Codecov統合（CI環境）

## 🛠️ テスト開発フロー

### 1. TDD開発
```bash
npm run test:watch  # ウォッチモード起動
# コード修正 → テスト自動実行
```

### 2. デバッグ
```bash
# VSCode: Jest拡張機能でデバッグ
# または
node --inspect-brk ./node_modules/.bin/jest --runInBand
```

### 3. モック追加
`tests/__mocks__/obsidian.ts` を編集してAPIモック追加

## 🔍 トラブルシューティング

### テスト失敗時
1. `npm run build` でビルド確認
2. `npm run test:setup` でテスト環境準備
3. 個別テスト実行で問題特定

### Windows環境の注意
- Git設定（CRLF/LF）
- パス区切り文字
- シェルスクリプト実行権限

## 📈 メトリクス目標

- **カバレッジ**: 80%以上
- **テスト実行時間**: 30秒以内
- **CI成功率**: 95%以上

## 🎉 利点

1. **品質保証**: バグの早期発見
2. **リファクタリング安全性**: 変更の影響を即座に検知
3. **ドキュメント**: テストがコードの仕様書
4. **CI/CD統合**: 自動デプロイの基盤
5. **クロスプラットフォーム**: 複数OS/Node.jsバージョン対応