# 残存タスク管理ファイル
最終更新: 2024-11-28

## 🔴 緊急度: 高

### 1. v1.1.5.6リリースの動作確認
- [ ] GitHub Actionsワークフロー完了確認
  - URL: https://github.com/officefutaro/obsidian-multi-git-plugin/actions
- [ ] リリースページでファイルサイズ確認
  - main.js: 57KB（正常） vs 22bytes（異常）
  - URL: https://github.com/officefutaro/obsidian-multi-git-plugin/releases
- [ ] リリースアセット（ZIP、各ファイル）のダウンロードテスト

### 2. BRATインストール検証
- [ ] Obsidian BRATプラグインでのインストールテスト
  - リポジトリURL: https://github.com/officefutaro/obsidian-multi-git-plugin
- [ ] プラグイン動作確認（Git操作、UI表示）
- [ ] バージョン表示がv1.1.5.6になっているか確認
- [ ] 以前のv1.1.5.5からの更新テスト

## 🟡 緊急度: 中

### 3. GitHub Actions テスト失敗の修正（Check Status: 1/9）
**現在の問題**: 9個のテストのうち8個が失敗

#### 3.1 テストワークフロー調査 (.github/workflows/test.yml)
- [ ] Ubuntu/Windows/macOS × Node.js 18/20 の6環境でのエラー確認
- [ ] `npm run test:unit` エラーログ確認
- [ ] `npm run test:integration` エラーログ確認
- [ ] テストファイル更新: tests/*.test.ts

#### 3.2 Quality Gateワークフロー調査 (.github/workflows/quality-gate.yml)
- [ ] ビルドエラーの確認
- [ ]依存関係の問題確認

#### 3.3 対処方針
- [ ] テストコードの修正
- [ ] package.json依存関係の更新
- [ ] CI/CD設定の調整

### 4. ブランチ構成の整理
**現在の問題**: masterとmainの二重管理

- [ ] GitHubでデフォルトブランチをmainに設定
- [ ] masterブランチの削除検討
- [ ] ローカルでのmasterブランチ削除
- [ ] README等でmainブランチ使用を明記

### 5. リリースノートとドキュメント更新

#### 5.1 v1.1.5.6リリースノート詳細化
- [ ] 修正内容の詳細説明
- [ ] v1.1.5.5の問題（22bytesファイル）について説明
- [ ] ユーザー向けの更新手順

#### 5.2 README更新
- [ ] インストール手順の確認
- [ ] BRATインストール方法の最新化
- [ ] 既知の問題セクションの更新

## 🟢 緊急度: 低

### 6. プロジェクト構成のクリーンアップ

#### 6.1 不要ファイルの整理
- [ ] `obsidian-multi-git-plugin-release/` フォルダの扱い検討
- [ ] `coverage/` フォルダのgitignore追加
- [ ] `node_modules/` の除外確認
- [ ] 開発ドキュメントの整理

#### 6.2 .gitignore最適化
- [ ] 開発用ファイルの除外設定
- [ ] ビルド成果物の扱い
- [ ] プラットフォーム固有ファイルの除外

### 7. 継続的改善

#### 7.1 今後のリリース手順標準化
- [ ] `scripts/release-validator.ps1` の改善
- [ ] GITHUB-RELEASE-RULES.md の実践
- [ ] 自動リリース作成の安定化

#### 7.2 品質保証の向上
- [ ] テストカバレッジの改善
- [ ] 自動化テストの拡充
- [ ] プラグイン品質チェックの追加

## 📊 進捗管理

### 完了済みタスク ✅
- ✅ v1.1.5.6バージョン更新
- ✅ package.json/manifest.json同期
- ✅ GitHub Actionsワークフロー修正（ダミーファイル問題解決）
- ✅ ビルド検証スクリプト作成
- ✅ 再発防止ドキュメント作成
- ✅ masterからmainブランチへのマージ
- ✅ GitHubへのプッシュとタグ作成

### 優先順位
1. **即座に**: リリース動作確認（タスク1-2）
2. **今週中**: テスト修正（タスク3）  
3. **来週**: プロジェクト整理（タスク4-7）

---
**管理者**: officefutaro  
**最終検証**: v1.1.5.6リリース後