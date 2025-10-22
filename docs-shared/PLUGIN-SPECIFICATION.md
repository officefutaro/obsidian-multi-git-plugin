# Obsidian Multi-Git Plugin 仕様書

**プロジェクト名**: Obsidian Multi-Git Plugin  
**バージョン**: 1.0.0  
**作成日**: 2024年10月22日  
**対象環境**: Obsidian Desktop (Windows/macOS/Linux)

---

## 🎯 製品概要

### 目的
ObsidianのVault内および親ディレクトリにある複数のGitリポジトリを統合管理し、効率的なバージョン管理を実現するプラグイン。

### 対象ユーザー
- 複数のGitリポジトリを持つObsidianユーザー
- プロジェクト管理でObsidianとGitを併用する開発者
- Claude Codeなどの親ディレクトリプロジェクトを管理するユーザー

### 価値提案
1. **一元管理**: 複数リポジトリの状態を一画面で確認
2. **効率化**: 個別にGitコマンドを実行する手間を削減
3. **安全性**: 手動コミットメッセージによる意図的なコミット
4. **可視性**: リアルタイムな変更数表示

---

## 📋 機能要件

### 1. コア機能

#### 1.1 リポジトリ検出・管理
- **自動検出**: Vault内のGitリポジトリを自動検出
- **親ディレクトリ検出**: Vault親ディレクトリのリポジトリ検出
- **階層サポート**: ネストしたリポジトリの検出
- **動的更新**: リポジトリ追加/削除の動的反映

#### 1.2 Git操作
- **ステータス確認**: modified/added/deleted/untracked ファイル表示
- **ブランチ情報**: 現在ブランチ、ahead/behind表示
- **ステージング**: ファイルのadd操作
- **コミット**: 手動メッセージ入力によるコミット
- **プッシュ/プル**: リモートとの同期

#### 1.3 UI/UX
- **ステータスバー**: 総変更数のリアルタイム表示
- **リボンアイコン**: ワンクリックアクセス
- **モーダルダイアログ**: 直感的な操作画面
- **コマンドパレット**: キーボードショートカット対応

### 2. 高度な機能

#### 2.1 設定管理
- **デフォルト設定**: 自動プッシュ、除外パターンなど
- **リポジトリ別設定**: 個別のGit設定
- **UI設定**: 表示項目のカスタマイズ

#### 2.2 履歴・監視
- **コミット履歴**: 最近のコミット表示
- **変更監視**: ファイル変更の自動検知
- **統計情報**: コミット数、変更数統計

#### 2.3 安全機能
- **確認ダイアログ**: 重要操作の確認
- **バックアップ**: 操作前の状態保存
- **ロールバック**: 操作の取り消し機能

---

## 🏗️ 技術仕様

### 1. アーキテクチャ

#### 1.1 プラットフォーム
- **基盤**: Obsidian Plugin API
- **言語**: TypeScript
- **ビルドツール**: esbuild
- **パッケージ管理**: npm

#### 1.2 外部依存
- **Git**: システムにインストールされたGit（child_process経由）
- **Node.js**: LTS版対応
- **Obsidian**: v0.15.0以降

#### 1.3 モジュール構成
```typescript
MultiGitPlugin (メインクラス)
├── GitRepository (リポジトリ管理)
├── GitStatus (ステータス管理)
├── GitStatusModal (ステータス表示UI)
├── GitCommitModal (コミットUI)
└── GitOperationModal (プッシュ/プルUI)
```

### 2. データ構造

#### 2.1 GitRepository
```typescript
interface GitRepository {
    path: string;        // リポジトリパス
    name: string;        // 表示名
    isParent: boolean;   // 親ディレクトリフラグ
}
```

#### 2.2 GitStatus
```typescript
interface GitStatus {
    modified: string[];   // 変更ファイル
    added: string[];      // 追加ファイル
    deleted: string[];    // 削除ファイル
    untracked: string[];  // 未追跡ファイル
    branch: string;       // 現在ブランチ
    ahead: number;        // 先行コミット数
    behind: number;       // 遅れコミット数
}
```

### 3. API設計

#### 3.1 プラグインAPI
```typescript
class MultiGitPlugin extends Plugin {
    // リポジトリ検出
    detectRepositories(): Promise<void>
    
    // Gitステータス取得
    getGitStatus(repoPath: string): Promise<GitStatus>
    
    // Git操作実行
    executeGitCommand(repoPath: string, command: string): Promise<string>
    
    // UI表示
    showGitStatusModal(): void
    showCommitModal(): void
}
```

#### 3.2 コマンド定義
| コマンドID | 名前 | 機能 |
|-----------|------|------|
| `show-git-status` | Show Git Status | ステータス表示 |
| `git-commit` | Git Commit | コミット実行 |
| `git-push` | Git Push | プッシュ実行 |
| `git-pull` | Git Pull | プル実行 |

---

## 🎨 UI/UX仕様

### 1. ビジュアルデザイン

#### 1.1 ステータスバー
- **位置**: Obsidianステータスバー右側
- **表示**: `Git: X changes` 形式
- **更新**: 30秒間隔で自動更新
- **クリック**: ステータスモーダル表示

#### 1.2 リボンアイコン
- **アイコン**: git-branch
- **ツールチップ**: "Multi Git Manager"
- **クリック**: ステータスモーダル表示

#### 1.3 モーダルデザイン
```css
.git-repo-status {
    margin-bottom: 20px;
    padding: 10px;
    border: 1px solid var(--background-modifier-border);
}

.git-file-modified { color: var(--text-accent); }
.git-file-added { color: var(--text-success); }
.git-file-deleted { color: var(--text-error); }
.git-file-untracked { color: var(--text-muted); }
```

### 2. インタラクション

#### 2.1 ワークフロー: ステータス確認
1. リボンアイコンクリック
2. Git Status Modalが開く
3. 全リポジトリの状態を表示
4. リポジトリごとの変更ファイル一覧

#### 2.2 ワークフロー: コミット作成
1. コマンドパレット → "Git Commit"
2. リポジトリ選択（複数選択可）
3. コミットメッセージ入力
4. Commitボタンクリック
5. 成功/失敗通知表示

#### 2.3 ワークフロー: プッシュ/プル
1. コマンドパレット → "Git Push/Pull"
2. リポジトリ選択（複数選択可）
3. 操作実行ボタンクリック
4. 結果通知表示

---

## 📊 非機能要件

### 1. パフォーマンス
- **起動時間**: 3秒以内でリポジトリ検出完了
- **ステータス更新**: 1秒以内で全リポジトリ状態取得
- **UI応答**: 200ms以内でモーダル表示
- **メモリ使用量**: 50MB以下

### 2. 信頼性
- **エラー処理**: 全Git操作に対する適切なエラーハンドリング
- **データ整合性**: Git操作の原子性保証
- **復旧機能**: 失敗操作の適切な報告とガイダンス

### 3. 使いやすさ
- **学習コストゼロ**: 直感的なUI設計
- **日本語対応**: メッセージとUIの日本語化
- **キーボード操作**: 全機能のキーボードアクセス

### 4. 互換性
- **OS対応**: Windows 10/11, macOS 10.15+, Linux
- **Obsidianバージョン**: v0.15.0以降
- **Git版本**: 2.0以降

---

## 🔒 セキュリティ要件

### 1. データ保護
- **認証情報**: Git認証情報の直接処理なし
- **ファイルアクセス**: Obsidian APIを通じた安全なアクセス
- **プロセス実行**: 最小権限でのchild_process実行

### 2. 操作安全性
- **破壊的操作**: 確認ダイアログの実装
- **入力検証**: コミットメッセージの適切なエスケープ
- **パス検証**: ディレクトリトラバーサル対策

---

## 🧪 テスト要件

### 1. 単体テスト
- **カバレッジ**: 85%以上
- **対象**: 全Gitコマンド実行関数
- **モック**: Obsidian API、child_process

### 2. 統合テスト
- **実環境**: 実際のGitリポジトリでの動作確認
- **マルチリポジトリ**: 複数リポジトリでの同時操作
- **エラーケース**: ネットワークエラー、権限エラーなど

### 3. UI テスト
- **手動テスト**: 全モーダルの表示・操作確認
- **レスポンシブ**: 画面サイズ変更への対応
- **アクセシビリティ**: キーボード操作の確認

### 4. パフォーマンステスト
- **大規模**: 1000+ファイルでの性能確認
- **同時操作**: 複数リポジトリ同時操作の性能
- **メモリリーク**: 長時間使用での安定性

---

## 📦 配布・インストール

### 1. パッケージング
- **成果物**: main.js, manifest.json, styles.css
- **サイズ**: 100KB以下（圧縮後）
- **依存関係**: 外部依存なし

### 2. インストール方法
1. **手動インストール**:
   - プラグインファイルをObsidianプラグインフォルダにコピー
   - Obsidian設定でプラグイン有効化

2. **Community Plugin**（将来）:
   - Obsidian Community Plugin Storeから直接インストール

### 3. 更新メカニズム
- **バージョン確認**: manifest.jsonのバージョン番号
- **破壊的変更**: CHANGELOG.mdでの明記
- **設定移行**: 設定の後方互換性保証

---

## 🗓️ 開発計画

### Phase 1: 基盤実装 ✅
- [x] プロジェクト構造作成
- [x] 基本Git操作実装
- [x] UI モーダル実装
- [x] ステータスバー実装

### Phase 2: 機能拡張
- [ ] 設定画面実装
- [ ] エラーハンドリング強化
- [ ] 日本語メッセージ対応
- [ ] Git履歴表示機能

### Phase 3: 品質向上
- [ ] テストカバレッジ100%
- [ ] パフォーマンス最適化
- [ ] ユーザビリティ改善
- [ ] ドキュメント整備

### Phase 4: リリース準備
- [ ] Community Plugin申請
- [ ] ユーザーガイド作成
- [ ] FAQ整備
- [ ] サポート体制構築

---

## 📚 関連ドキュメント

### 開発関連
- [CLAUDE-MAIN.md](./CLAUDE-MAIN.md) - Claude Code開発指示書
- [TECHNICAL-ARCHITECTURE.md](./TECHNICAL-ARCHITECTURE.md) - 技術アーキテクチャ
- [API-SPECIFICATION.md](./API-SPECIFICATION.md) - API仕様書

### テスト関連
- [TESTING-GUIDE.md](./TESTING-GUIDE.md) - テスト実行ガイド
- [test-strategy/](./test-strategy/) - テスト戦略ドキュメント

### リリース関連
- [CHANGELOG.md](../obsidian-multi-git-plugin/CHANGELOG.md) - 変更履歴
- [README.md](../obsidian-multi-git-plugin/README.md) - ユーザー向け説明

---

## 📞 サポート・連絡先

### 開発者
- **名前**: futaro
- **プロジェクト**: Claude Code AI assisted development

### 課題報告
- **GitHub Issues**: プロジェクトリポジトリのIssuesセクション
- **分類**: Bug Report, Feature Request, Question

### 貢献
- **プルリクエスト**: 歓迎
- **コーディング規約**: [開発ガイド](./DEVELOPMENT-GUIDE.md)参照
- **ライセンス**: MIT License

---

**最終更新**: 2024年10月22日  
**文書バージョン**: 1.0.0  
**承認者**: futaro