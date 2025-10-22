# 📚 プロジェクトドキュメント

## 📁 ディレクトリ構造

```
docs-shared/
├── README.md                    # このファイル
├── CLAUDE-MAIN.md              # Claude Code メイン指示書
├── AUTOMATED-TESTING.md        # 自動テスト環境説明
├── TESTING-GUIDE.md            # テスト実行ガイド
├── api-specs/                  # API仕様書
├── architecture/               # アーキテクチャ設計書
├── development-notes/          # 開発進捗メモ
│   └── progress-2024-10-22.md
└── test-strategy/              # テスト戦略ドキュメント
    ├── TEST-STRATEGY-2024-10-22.md    # テスト戦略書
    ├── CURRENT-STATUS-2024-10-22.md   # 実装現状報告
    └── TEST-ROADMAP-2024-Q4.md        # Q4ロードマップ
```

## 📖 主要ドキュメント

### 開発ガイド
- **[CLAUDE-MAIN.md](./CLAUDE-MAIN.md)** - Claude Code用の主要指示書
- **[architecture/](./architecture/)** - システム設計とアーキテクチャ
- **[api-specs/](./api-specs/)** - API仕様とインターフェース定義

### テスト関連
- **[TESTING-GUIDE.md](./TESTING-GUIDE.md)** - テスト環境セットアップと実行手順
- **[AUTOMATED-TESTING.md](./AUTOMATED-TESTING.md)** - 自動テストフレームワークと使用方法
- **[test-strategy/](./test-strategy/)** - テスト戦略と計画書

### 進捗管理
- **[development-notes/](./development-notes/)** - 日次/週次の開発進捗記録

## 🚀 クイックリンク

### テストを始める
1. [テスト環境セットアップ](./TESTING-GUIDE.md#テスト手順)
2. [自動テスト実行](./AUTOMATED-TESTING.md#テストコマンド)
3. [テスト戦略](./test-strategy/TEST-STRATEGY-2024-10-22.md)

### 現在の状況
- [テスト実装状況](./test-strategy/CURRENT-STATUS-2024-10-22.md)
- [開発進捗](./development-notes/progress-2024-10-22.md)
- [Q4ロードマップ](./test-strategy/TEST-ROADMAP-2024-Q4.md)

## 📝 ドキュメント規約

### ファイル命名
- 戦略/計画書: `{TYPE}-{YYYY-MM-DD}.md`
- ガイド: `{TOPIC}-GUIDE.md`
- 進捗: `progress-{YYYY-MM-DD}.md`

### 更新ルール
- 重要な変更時は日付付きで新規作成
- 軽微な更新は既存ファイルを編集
- 古いバージョンはアーカイブ化

### マークダウン規約
- 見出しは階層的に使用
- コードブロックは言語指定
- 表は視認性を重視
- 絵文字は節度を持って使用

## 🔄 更新履歴

| 日付 | 更新内容 | 作成者 |
|-----|---------|--------|
| 2024-10-22 | 初版作成、ドキュメント整理 | Claude |
| 2024-10-22 | テスト戦略ドキュメント追加 | Claude |

## 📮 フィードバック

ドキュメントに関する質問や改善提案は、プロジェクトリードまでお願いします。

---

**最終更新**: 2024年10月22日  
**管理者**: futaro