# 📚 開発ガイド

このフォルダには、Obsidian Multi Git Pluginの開発・公開に関する詳細なガイドドキュメントが含まれています。

## 📋 ドキュメント一覧

### 🏠 [Giteaテスト環境構築ガイド](./Giteaテスト環境構築ガイド.md)
- **目的**: GitHubに公開する前の安全なテスト環境構築
- **内容**: 
  - Dockerを使用したGiteaサーバーセットアップ
  - CI/CD パイプライン設定
  - リリース自動化
  - セキュリティ考慮事項
- **対象**: 開発者、テスト担当者

### 🚀 [プラグイン公開戦略](./プラグイン公開戦略.md)
- **目的**: 段階的で確実なプラグイン公開戦略
- **内容**:
  - 5段階の公開フェーズ
  - リスク管理とテスト戦略
  - コミュニティ貢献方法
  - 長期的なメンテナンス計画
- **対象**: プロジェクトマネージャー、開発チーム

## 🎯 使用方法

### Phase 1: Giteaテスト
```bash
# 1. Giteaテスト環境構築ガイドに従ってセットアップ
# 2. プライベート環境でのテスト実施
# 3. 問題修正・改善
```

### Phase 2: GitHub移行
```bash
# 1. プラグイン公開戦略の指針に従って準備
# 2. 必要ファイル整備
# 3. GitHub移行実行
```

### Phase 3-5: 公開・運営
```bash
# 1. BRATでのベータテスト
# 2. コミュニティプラグイン申請
# 3. 継続的メンテナンス
```

## 🔄 関連ドキュメント

### プラグイン本体
- [README.md](../../obsidian-multi-git-plugin/README.md) - プラグイン概要
- [INSTALLATION.md](../../obsidian-multi-git-plugin/INSTALLATION.md) - インストール手順
- [USER-GUIDE.md](../../obsidian-multi-git-plugin/USER-GUIDE.md) - 使用方法
- [PUBLISH-GUIDE.md](../../obsidian-multi-git-plugin/PUBLISH-GUIDE.md) - GitHub公開手順

### プロジェクト全体
- [../CLAUDE-MAIN.md](../CLAUDE-MAIN.md) - AI開発支援システム
- [../TECHNICAL-ARCHITECTURE.md](../TECHNICAL-ARCHITECTURE.md) - 技術アーキテクチャ
- [../TESTING-GUIDE.md](../TESTING-GUIDE.md) - テスト戦略

## 📈 プロジェクト進捗

### ✅ 完了項目
- [x] Giteaテスト環境構築手順作成
- [x] CI/CD パイプライン設定
- [x] 日本語ドキュメント体系整備
- [x] 段階的公開戦略策定

### 🔄 進行中
- [ ] Giteaでの実際のテスト実施
- [ ] 英語ドキュメント作成
- [ ] コミュニティフィードバック収集

### 📋 今後の予定
- [ ] GitHub移行準備
- [ ] BRATテスト実施
- [ ] コミュニティプラグイン申請

## 🤝 貢献方法

### 📝 ドキュメント改善
- 誤字脱字の修正
- 手順の追加・明確化
- 翻訳（英語化）

### 🧪 テスト支援
- Giteaテスト環境での検証
- 異なる環境での動作確認
- パフォーマンステスト

### 💡 提案・フィードバック
- GitHub Issues での問題報告
- Discussions での機能提案
- 実際の使用体験共有

---

**🎉 このガイドを活用して、安全で確実なプラグイン開発・公開を実現しましょう！**