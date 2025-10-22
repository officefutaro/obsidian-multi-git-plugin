---
created: 2025-10-22T12:54
updated: 2025-10-22T13:03
---
# Claude Code Instructions for Obsidian Multi-Git Plugin

## Project Overview
This is an Obsidian plugin for managing multiple Git repositories within Obsidian, including parent repositories.

## Current Status (2024-10-22)

### ✅ Completed Tasks
1. **基本プロジェクト構造の作成**
   - フォルダ戦略実装完了
   - npm/TypeScript環境セットアップ
   - Obsidianプラグイン基本構造 (manifest.json, main.ts)

2. **Git操作機能の実装**
   - リポジトリ自動検出（Vault内・親ディレクトリ）
   - Git status/add/commit/push/pull コマンド実装
   - Windows環境対応（child_process使用）

3. **UIコンポーネント**
   - GitStatusModal: 全リポジトリのステータス表示
   - GitCommitModal: 手動コミットメッセージ入力
   - GitOperationModal: Push/Pull操作
   - ステータスバー表示（変更数）
   - リボンアイコン追加

### 🔄 Pending Tasks
- Obsidianプラグインとしての実際のインストールとテスト
- 設定画面の実装（Settings Tab）
- エラーハンドリングの強化
- 日本語環境での実動作テスト

## Development Environment
- Platform: Windows
- Language: TypeScript
- Framework: Obsidian API
- Git Integration: Using child_process for git commands
- Node Version: Latest LTS

## Key Requirements
1. **Manual Commit Messages**: User must input commit messages manually (日本語対応)
2. **Multi-Repository Support**: Handle multiple nested Git repositories
3. **Parent Repository Support**: Manage Claude Code repository in parent directory
4. **Windows Compatibility**: Ensure all paths and commands work on Windows

## Project Structure
```
D:\Project\2510_obsidianGit\
├── obsidian-multi-git-plugin/     # GitHubに公開するプラグイン本体
│   ├── src/
│   │   └── main.ts                # メインプラグインファイル（実装済み）
│   ├── manifest.json              # Obsidianマニフェスト（設定済み）
│   ├── package.json               # npm設定（設定済み）
│   ├── tsconfig.json              # TypeScript設定（設定済み）
│   ├── styles.css                 # スタイルシート（作成済み）
│   ├── README.md                  # 公開用ドキュメント（作成済み）
│   ├── .gitignore                 # Git除外設定（設定済み）
│   ├── CLAUDE.md                  # 本ファイルへの参照
│   └── main.js                    # ビルド成果物（自動生成）
│
├── docs-shared/                   # 共有ドキュメント
│   └── CLAUDE-MAIN.md            # このファイル
│
└── .claude-private/               # Claude Code専用（GitHubに公開しない）
```

## Implemented Features
1. **Repository Detection**
   - Vault内のGitリポジトリ自動検出
   - 親ディレクトリのリポジトリ検出（Claude Code用）
   - 複数階層のリポジトリサポート

2. **Git Operations**
   - Status表示（modified/added/deleted/untracked）
   - Add & Commit（複数リポジトリ同時選択可能）
   - Push/Pull操作
   - ブランチ情報表示
   - Ahead/Behind表示

3. **User Interface**
   - モーダルダイアログでの操作
   - リポジトリ選択チェックボックス
   - コミットメッセージ手動入力欄
   - ステータスバーでの変更数表示
   - 30秒ごとの自動更新

## Code Style Guidelines
- Use TypeScript strict mode
- Follow Obsidian plugin conventions
- Handle Windows path separators correctly
- Implement proper error handling for Git operations
- NO unnecessary comments in code
- Prefer editing existing files over creating new ones

## Testing Requirements
- Test on Windows environment
- Verify multi-repository detection
- Test with Japanese commit messages
- Ensure proper handling of parent directories
- Test actual Obsidian plugin installation

## Build Commands
```bash
cd obsidian-multi-git-plugin
npm install        # Install dependencies
npm run dev       # Development build with watch
npm run build     # Production build
```

## Installation Steps
1. Build the plugin: `npm run build`
2. Copy files to Obsidian plugins directory:
   - `main.js`
   - `manifest.json`
   - `styles.css`
3. Enable plugin in Obsidian settings

## Next Steps When Resuming
1. Obsidian内でプラグインをインストール・テスト
2. 設定画面の追加（デフォルトコミットメッセージ、除外パターン等）
3. エラーメッセージの日本語化
4. リポジトリごとの個別設定機能
5. Git履歴表示機能の追加

## Known Issues
- 未テスト状態（実際のObsidian環境での動作確認必要）
- リモートリポジトリが未設定の場合のエラーハンドリング
- 大量のファイル変更時のパフォーマンス

## File Structure
- `/src` - TypeScript source files
- `/docs-shared` - Shared documentation (not in Git)
- `/.claude-private` - Private Claude Code files (not in Git)