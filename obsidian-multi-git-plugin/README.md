# 🌳 Obsidian Multi Git Manager

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Obsidian Plugin](https://img.shields.io/badge/Obsidian-Plugin-blueviolet)](https://obsidian.md/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Jest](https://img.shields.io/badge/Jest-C21325?logo=jest&logoColor=white)](https://jestjs.io/)

**複数のGitリポジトリを効率的に管理する高機能Obsidianプラグイン**

複雑なプロジェクト構成や複数のノート管理を一元化し、シームレスなGitワークフローを実現します。

## ✨ 主要機能

### 🔍 **スマートリポジトリ検出**
- **Vault本体**: Obsidian Vault自体がGitリポジトリの場合
- **親ディレクトリ**: Vault外のプロジェクトルート  
- **サブフォルダ**: Vault内の個別プロジェクト

### 📊 **リアルタイム監視**
- ステータスバーで変更ファイル数を常時表示
- 30秒間隔での自動状態更新
- 視覚的インジケータで変更を即座に把握

### 🎛️ **統合管理インターフェース**
- Git Manager View: 全リポジトリの統一管理画面
- 一括操作: 複数リポジトリの同時コミット・プッシュ・プル
- 選択的実行: 必要なリポジトリのみを対象とした操作

### ⚡ **高度なGit操作**
- **コミット**: 複数リポジトリへの一括コミット
- **プッシュ/プル**: 選択式リモート同期
- **ステータス**: 詳細な変更状況の確認
- **ブランチ情報**: ahead/behind状況の表示

## 🚀 クイックスタート

### インストール

```bash
# 1. プラグインをビルド
cd obsidian-multi-git-plugin
npm install && npm run build

# 2. Obsidianプラグインフォルダにコピー
# main.js, manifest.json, styles.css を
# [YOUR_VAULT]/.obsidian/plugins/multi-git-manager/ にコピー

# 3. Obsidianでプラグインを有効化
# 設定 → コミュニティプラグイン → Multi Git Manager をON
```

### 基本的な使い方

1. **ステータス確認**: ステータスバーの「Git: X changes」を確認
2. **管理画面**: 左サイドバーのGitアイコン🌳をクリック
3. **コマンド実行**: `Ctrl/Cmd + P` → `Git: [操作名]`

## 📖 ドキュメント

| ドキュメント | 内容 | 対象者 |
|-------------|------|--------|
| **[📋 INSTALLATION.md](INSTALLATION.md)** | 詳細インストール手順 | 全ユーザー |
| **[🚀 QUICK-START.md](QUICK-START.md)** | 5分で始める使い方 | 初心者 |
| **[📚 USER-GUIDE.md](USER-GUIDE.md)** | 完全ユーザーガイド | 中級者〜 |

## 🎯 対応環境

### ✅ 対応プラットフォーム
- **Windows** 10/11
- **macOS** 10.15+  
- **Linux** (Ubuntu, Fedora, Arch等)

### ⚠️ 制限事項
- **デスクトップ版のみ** (モバイル版Obsidian非対応)
- **Git必須**: システムにGitがインストールされている必要があります

## 🛠️ 開発・テスト

### 開発環境セットアップ
```bash
# 依存関係インストール
npm install

# 開発モード (ファイル監視)
npm run dev

# テスト実行
npm test

# カバレッジ確認
npm run test:coverage

# プロダクションビルド
npm run build
```

### テスト状況
```bash
Test Suites: 3 passed, 3 total
Tests:       30 passed, 30 total
Coverage:    80%+ (主要機能)
```

## 📁 プロジェクト構造

```
obsidian-multi-git-plugin/
├── src/
│   ├── main.ts              # メインプラグインファイル
│   └── git-manager-view.ts  # Git Manager UI
├── tests/
│   ├── main.test.ts         # 単体テスト
│   ├── git-operations.test.ts # Git操作テスト
│   └── e2e/                 # E2Eテスト
├── docs/
│   ├── INSTALLATION.md      # インストールガイド
│   ├── QUICK-START.md       # クイックスタート
│   └── USER-GUIDE.md        # ユーザーガイド
├── main.js                  # ビルド成果物
├── manifest.json            # プラグイン設定
└── styles.css               # スタイルシート
```

## 🤝 コントリビューション

### 🐛 バグ報告
問題を発見された場合:
1. **GitHub Issues** で既存の報告を確認
2. **再現手順**、**環境情報**、**エラーログ** を含めて報告
3. 可能であれば**最小再現例**を提供

### 💡 機能要望
新機能の提案:
1. **具体的な使用場面** を説明
2. **期待する動作** を明確に記述
3. **代替案** があれば併せて提示

### 🔧 コード貢献
1. **Fork** → **ブランチ作成** → **実装** → **テスト** → **PR**
2. **コーディング規約** に従って実装
3. **テスト追加** を忘れずに
4. **ドキュメント更新** も含める

## 📊 使用統計・フィードバック

### 実際の使用例
- **研究者**: 論文執筆プロジェクト (複数リポジトリ管理)
- **開発者**: 技術ノート + プロジェクトコード管理
- **ライター**: ブログ記事管理 (下書き → 公開の流れ)
- **学生**: 学習ノート + 課題プロジェクト管理

### パフォーマンス
- **起動時間**: <2秒 (通常サイズVault)
- **更新頻度**: 30秒間隔 (カスタマイズ可能)
- **メモリ使用量**: <10MB (追加消費)

## 🔄 ロードマップ

### 📅 近日実装予定
- [ ] **設定画面**: リポジトリ除外、更新間隔設定
- [ ] **ブランチ管理**: 切り替え、マージ機能
- [ ] **コンフリクト解決**: ビジュアルツール
- [ ] **自動化**: 時間ベース自動コミット

### 🚀 将来構想  
- [ ] **チーム連携**: 共有リポジトリでの協調作業支援
- [ ] **CI/CD統合**: GitHub Actions等との連携
- [ ] **クラウド同期**: 自動バックアップ機能

## 📄 ライセンス

**MIT License** - 自由に使用、修正、配布が可能です。

## 📞 サポート

### 🆘 ヘルプが必要な場合
- **📚 ドキュメント**: まずは[USER-GUIDE.md](USER-GUIDE.md)をご確認ください
- **💬 Issues**: [GitHub Issues](https://github.com/your-repo/issues)でお気軽にご質問ください
- **🔧 Discussions**: 使い方相談やアイデア共有は[Discussions](https://github.com/your-repo/discussions)へ

### 🌟 このプラグインが役に立ちましたら
- **⭐ Star**をつけてサポートしてください
- **🐦 SNS**での共有をお願いします
- **💬 フィードバック**をお寄せください

---

**🎉 Multi Git Managerで効率的なGitワークフローを実現しましょう！**

*Made with ❤️ for the Obsidian community*