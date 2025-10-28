# Obsidian Multi-Git Plugin

複数のGitリポジトリを一元管理するObsidianプラグイン / Manage multiple Git repositories within Obsidian

## Version 0.9.1

## 🎯 機能 / Features

- 📦 **複数リポジトリ管理** - 複数のGitリポジトリを同時に管理
- 🔄 **自動同期** - 設定した間隔で自動的にpull/commit/push
- 📊 **ステータス表示** - すべてのリポジトリの状態を一覧表示
- ⚙️ **カスタマイズ可能** - リポジトリごとに個別のコミットメッセージを設定
- 🎨 **ダーク/ライトモード対応** - Obsidianのテーマに自動対応

## 📥 インストール方法

### BRAT経由でのインストール（推奨）

1. Obsidian Community Pluginsから「BRAT」をインストール
2. BRATの設定を開く
3. 「Add Beta plugin」をクリック
4. 以下のURLを入力:
   ```
   https://github.com/officefutaro/obsidian-multi-git-plugin
   ```
5. 「Add Plugin」をクリック
6. Community Pluginsから「Obsidian Multi-Git Plugin」を有効化

### 手動インストール

1. 最新のリリースから`main.js`, `manifest.json`, `styles.css`をダウンロード
2. Obsidianのプラグインフォルダに`obsidian-multi-git-plugin`フォルダを作成
3. ダウンロードしたファイルをそのフォルダにコピー
4. Obsidianを再起動し、プラグインを有効化

## 🚀 使い方

### リポジトリの追加

1. コマンドパレット（Ctrl/Cmd + P）を開く
2. 「Multi-Git: Add repository」を選択
3. リポジトリ名とパスを入力
4. オプション: カスタムコミットメッセージを設定

### 同期の実行

#### 手動同期
- リボンアイコン（Git branch）をクリック
- またはコマンドパレットから「Multi-Git: Sync all repositories」を選択

#### 自動同期
1. 設定から「Auto sync」を有効化
2. 同期間隔（分）を設定

### ステータス確認

- コマンドパレットから「Multi-Git: Show status for all repositories」を選択
- すべてのリポジトリの現在の状態が表示されます

## ⚙️ 設定

| 設定項目 | 説明 | デフォルト |
|---------|------|-----------|
| Auto sync | 自動同期を有効化 | 無効 |
| Sync interval | 自動同期の間隔（分） | 10 |
| Default commit message | デフォルトのコミットメッセージ | "Sync from Obsidian Multi-Git Plugin" |
| Show status bar | ステータスバーにリポジトリ数を表示 | 有効 |

## 🛠️ コマンド一覧

- **Sync all repositories** - すべてのリポジトリを同期
- **Add repository to manage** - 新しいリポジトリを追加
- **Show status for all repositories** - 全リポジトリのステータス表示

## ⚠️ 必要要件

- Obsidian v0.15.0以上
- Gitがシステムにインストールされていること
- 各リポジトリがすでにGitで初期化されていること
- Git認証が設定済みであること（SSH鍵またはcredential helper）

## 🐛 既知の問題

- Windows環境でパスにスペースが含まれる場合、エスケープが必要
- 大規模なリポジトリでは同期に時間がかかる場合があります

## 📝 変更履歴

### v0.9.1 (2024-10-28)
- 初回リリース
- 基本的な複数リポジトリ管理機能
- 自動同期機能
- ステータス表示機能
- 設定画面の実装

## 🤝 貢献

Issue報告やPull Requestは大歓迎です！

- [Issues](https://github.com/officefutaro/obsidian-multi-git-plugin/issues)
- [Pull Requests](https://github.com/officefutaro/obsidian-multi-git-plugin/pulls)

## 📄 ライセンス

MIT License

## 👨‍💻 開発者

- **officefutaro**
- GitHub: [@officefutaro](https://github.com/officefutaro)

## 🙏 謝辞

このプラグインはObsidianコミュニティの皆様のフィードバックにより改善されています。

---

**注意**: このプラグインはGitコマンドを直接実行します。重要なデータは必ずバックアップを取ってからご使用ください。