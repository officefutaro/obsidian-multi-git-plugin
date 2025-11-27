# 🌳 Obsidian Multi Git Manager
### 🚀 Claude Code × Obsidian 最適化プラグイン

> 🌐 [English](README.md) | **日本語** | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md)

[![Claude Code Compatible](https://img.shields.io/badge/Claude_Code-Compatible-purple)](https://claude.ai)
[![Lean Method](https://img.shields.io/badge/Lean-Optimized-green)](https://lean.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Obsidian Plugin](https://img.shields.io/badge/Obsidian-Plugin-blueviolet)](https://obsidian.md/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

**Claude Codeとの連携に最適化された、複数Gitリポジトリ管理プラグイン**

## 🎯 開発の背景 - Claude Code × Obsidian の最強タッグ

### 💡 なぜこのプラグインが必要か

**リーンコンサルタント Futaro（OfficeFutaro）** が実務で発見した課題を解決します。

Claude Codeを使った「Vibe Writing」手法（AIアシスト文書作成）において、Obsidianのマークダウンファイルは最高の相性を示します。しかし、一つ問題がありました：

#### 🔄 典型的なワークフロー
1. **Obsidian**: ナレッジベースの構築・管理
2. **Claude Code**: AI支援による文書作成・コード生成
3. **Git**: バージョン管理とバックアップ

#### ❌ 従来の問題点
- Claude Codeプロジェクトフォルダは通常Vault外に配置
- 複数リポジトリの管理が煩雑（VSCode切り替えやCLI操作）
- コンテキストスイッチによる生産性低下

#### ✅ このプラグインの解決策
**「Vault外のリポジトリもObsidianで管理」** という革新的アプローチで、Claude Codeワークフローを最適化！

### 🏆 リーン手法による最適化
- **ムダの排除**: ツール間の切り替え時間を削減
- **フロー効率化**: 一つのインターフェースで完結
- **価値の最大化**: 思考の流れを止めない作業環境

## ✨ 主要機能

### 🔍 **スマートリポジトリ検出**
- **Vault本体**: Obsidian Vault自体がGitリポジトリの場合
- **親ディレクトリ**: Vault外のプロジェクトルート（Claude Codeプロジェクトに最適）
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

## 🤝 Claude Code連携の最適化機能

### 📁 推奨フォルダ構造
```
プロジェクトルート/
├── obsidian-vault/          # Obsidian Vault（このプラグイン使用）
│   ├── .obsidian/
│   ├── ナレッジベース/
│   └── プロジェクトノート/
├── claude-projects/          # Claude Codeプロジェクト群
│   ├── project-a/           # 個別プロジェクト（Git管理）
│   └── project-b/           # 個別プロジェクト（Git管理）
└── shared-docs/             # 共有ドキュメント（Git管理）
```

### ⚡ Claude Code向け最適化
- **CLAUDE.md対応**: プロジェクトコンテキストファイルの自動検出
- **マークダウン連携**: Claude生成文書の即座なGit管理
- **AIフレンドリー**: 構造化されたコミットメッセージ

## 🚀 クイックスタート

### インストール

#### コミュニティプラグインから（推奨）
1. Obsidianを開く
2. 設定 → コミュニティプラグイン → ブラウズ
3. 「Multi Git Manager」を検索
4. インストール → 有効化

#### 手動インストール（開発者向け）
開発環境での利用やカスタマイズが必要な場合は、[CONTRIBUTING.md](CONTRIBUTING.md)を参照してください。

### 基本的な使い方

1. **ステータス確認**: ステータスバーの「Git: X changes」を確認
2. **管理画面**: 左サイドバーのGitアイコン🌳をクリック
3. **コマンド実行**: `Ctrl/Cmd + P` → `Git: [操作名]`

## 💼 実践的活用例

### リーンコンサルタント・技術文書作成者向け
- **📝 Claude Code連携**: AIアシスト文書をObsidianで整理、Gitで管理
- **🔄 継続的改善**: PDCA文書のバージョン管理
- **📊 クライアントワーク**: 複数案件の並行管理

### 具体的な効率化事例
- **Before**: ツール切り替え5分/回 × 20回/日 = 100分のムダ
- **After**: Obsidian一元管理で0分に削減 → **年間400時間の創出**

### 実際の使用例
- **研究者**: 論文執筆プロジェクト（複数リポジトリ管理）
- **開発者**: 技術ノート + プロジェクトコード管理
- **ライター**: ブログ記事管理（下書き → 公開の流れ）
- **コンサルタント**: クライアント案件の知識管理

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
Pull Requestは歓迎します！詳細は[CONTRIBUTING.md](CONTRIBUTING.md)を参照してください。

## 🔄 ロードマップ

### 📅 近日実装予定
- [ ] **設定画面**: リポジトリ除外、更新間隔設定
- [ ] **ブランチ管理**: 切り替え、マージ機能
- [ ] **コンフリクト解決**: ビジュアルツール
- [ ] **自動化**: 時間ベース自動コミット

### 🚀 将来構想  
- [ ] **Claude Code深層統合**: CLAUDE.md自動生成・更新
- [ ] **チーム連携**: 共有リポジトリでの協調作業支援
- [ ] **CI/CD統合**: GitHub Actions等との連携

## 👨‍💻 開発者について

**Futaro @ OfficeFutaro**
- 🎯 **リーンメソッド認定コンサルタント**
- 📊 大手リーン企業での実務経験
- 🤖 AI活用ワークフローの最適化専門
- 📝 「Vibe Writing」手法の提唱者

### 提供サービス
- 🔧 **リーンコンサルティング**: 業務プロセス最適化
- 🤝 **Claude Code導入支援**: AI活用文書作成の効率化
- 📚 **Obsidian構築支援**: 知識管理システムの設計

## 💖 Support This Project

このプラグインが業務効率化に貢献した場合、ぜひサポートをご検討ください：

- ⭐ **GitHub Star** - プロジェクトの認知度向上
- ☕ **Buy Me a Coffee** - 開発継続のサポート
- 💼 **企業導入相談** - カスタマイズや導入支援サービス
- 📝 **技術コンサルティング** - Git/Obsidian活用の最適化支援

## 📞 サポート

### 🆘 ヘルプが必要な場合
- **📚 ドキュメント**: まずは[USER-GUIDE.md](USER-GUIDE.md)をご確認ください
- **💬 Issues**: [GitHub Issues](https://github.com/officefutaro/obsidian-multi-git-plugin/issues)でお気軽にご質問ください
- **🔧 Discussions**: 使い方相談やアイデア共有は[Discussions](https://github.com/officefutaro/obsidian-multi-git-plugin/discussions)へ

### 📧 お問い合わせ
- **メール**: [contact@officefutaro.com](mailto:contact@officefutaro.com)
- **LinkedIn**: [linkedin.com/in/futaro](https://linkedin.com/in/futaro)
- **Twitter**: [@officefutaro](https://twitter.com/officefutaro)

## 📄 ライセンス

**MIT License** - 自由に使用、修正、配布が可能です。

---

<div align="center">

**🌳 Multi Git Manager**

*Claude Code × Obsidian のワークフローを最適化*

*Crafted with precision by [OfficeFutaro](https://officefutaro.com)*
*Empowering knowledge workers with efficient tools*

[![Twitter Follow](https://img.shields.io/twitter/follow/officefutaro?style=social)](https://twitter.com/officefutaro)
[![GitHub followers](https://img.shields.io/github/followers/officefutaro?style=social)](https://github.com/officefutaro)

**🎉 リーン手法でムダを削減し、価値を最大化しましょう！**

</div>