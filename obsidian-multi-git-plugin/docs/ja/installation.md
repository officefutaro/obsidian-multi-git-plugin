# Language / 言語 / 语言
**[English](../en/installation.md)** | **[日本語](../ja/installation.md)** | **[简体中文](../zh-CN/installation.md)** | **[繁體中文](../zh-TW/installation.md)**

---

# Obsidian Multi Git Manager - インストールマニュアル

## 📋 システム要件

### 必須要件
- **Obsidian**: バージョン 1.0.0 以上
- **OS**: Windows, macOS, Linux (デスクトップ版のみ)
- **Git**: システムにGitがインストールされていること
- **Node.js**: 開発・ビルド時のみ必要

### 対応環境
- ✅ Windows 10/11
- ✅ macOS 10.15+
- ✅ Linux (Ubuntu, Fedora, Arch等)
- ❌ モバイル版Obsidian (非対応)

## 🚀 インストール方法

### 方法1: 手動インストール (推奨)

#### Step 1: プラグインのビルド
```bash
# プロジェクトディレクトリに移動
cd D:\Project\2510_obsidianGit\obsidian-multi-git-plugin

# 依存関係をインストール
npm install

# プラグインをビルド
npm run build
```

#### Step 2: プラグインファイルの確認
ビルド後、以下のファイルが生成されていることを確認：
```
obsidian-multi-git-plugin/
├── main.js          # ← 必須
├── manifest.json    # ← 必須
└── styles.css       # ← 必須
```

#### Step 3: Obsidianプラグインフォルダにコピー
```bash
# Obsidianの設定フォルダを確認
# Windows: %APPDATA%\Obsidian\
# macOS: ~/Library/Application Support/obsidian/
# Linux: ~/.config/obsidian/

# プラグインフォルダに移動
cd "[YOUR_VAULT]/.obsidian/plugins/"

# プラグイン用ディレクトリを作成
mkdir multi-git-manager

# 必要ファイルをコピー
cp /path/to/obsidian-multi-git-plugin/main.js multi-git-manager/
cp /path/to/obsidian-multi-git-plugin/manifest.json multi-git-manager/
cp /path/to/obsidian-multi-git-plugin/styles.css multi-git-manager/
```

#### Step 4: Obsidianでプラグインを有効化
1. Obsidianを開く
2. **設定** (⚙️) → **コミュニティプラグイン**
3. **コミュニティプラグイン** をオンにする
4. **インストール済みプラグイン** で「Multi Git Manager」を見つける
5. プラグインを **有効** にする

### 方法2: 開発者モード (上級者向け)

#### Step 1: プラグインフォルダにシンボリックリンク作成
```bash
# Vaultのプラグインフォルダに移動
cd "[YOUR_VAULT]/.obsidian/plugins/"

# シンボリックリンクを作成 (Windows)
mklink /D multi-git-manager "D:\Project\2510_obsidianGit\obsidian-multi-git-plugin"

# シンボリックリンクを作成 (macOS/Linux)
ln -s "/path/to/obsidian-multi-git-plugin" multi-git-manager
```

#### Step 2: 開発モードで実行
```bash
cd obsidian-multi-git-plugin

# 開発モードでビルド (ファイル変更を監視)
npm run dev
```

## 🔧 インストール後の設定

### 1. Gitの確認
プラグインが正常に動作するか確認：
```bash
# コマンドラインでGitが使用可能か確認
git --version

# Obsidian Vaultでgit statusが実行できるか確認
cd "[YOUR_VAULT]"
git status
```

### 2. 初回セットアップ
1. **Obsidianを再起動**
2. **コマンドパレット** (Ctrl/Cmd + P) を開く
3. 「Git Manager」と入力して **Open Git Manager** を実行
4. GitManagerビューが表示されることを確認

### 3. 動作確認
1. **ステータスバー** に「Git: X changes」が表示される
2. **リボンアイコン** (左サイドバー) にGitアイコンが表示される
3. **コマンドパレット** で以下のコマンドが使用可能：
   - Open Git Manager
   - Show Git Status
   - Git Commit
   - Git Push
   - Git Pull

## 🎯 利用可能な機能

### メイン機能
| 機能 | 説明 | アクセス方法 |
|------|------|-------------|
| **Git Manager View** | 全リポジトリの統合管理画面 | リボンアイコン クリック |
| **ステータス表示** | 変更ファイル数をリアルタイム表示 | ステータスバー |
| **一括コミット** | 複数リポジトリへの同時コミット | コマンドパレット |
| **Push/Pull** | リモートとの同期操作 | コマンドパレット |
| **ステータス確認** | 詳細な変更状況の確認 | コマンドパレット |

### 対応リポジトリ
- ✅ **メインVault**: Obsidian Vault自体
- ✅ **親ディレクトリ**: Vault外のプロジェクトルート
- ✅ **サブフォルダ**: Vault内のサブプロジェクト

## 🔍 トラブルシューティング

### よくある問題

#### 1. プラグインが表示されない
**原因**: ファイルのコピーミスまたは権限問題
```bash
# ファイル構成を確認
ls -la "[YOUR_VAULT]/.obsidian/plugins/multi-git-manager/"

# 必要ファイルが存在するか確認
# - main.js
# - manifest.json  
# - styles.css
```

**解決方法**:
1. ファイルを再コピー
2. Obsidianを完全再起動
3. コミュニティプラグインを一度オフ→オンにする

#### 2. Gitコマンドが実行できない
**原因**: Gitがシステムパスに設定されていない

**解決方法**:
```bash
# Gitのインストール確認
git --version

# パスが通っていない場合、環境変数を設定
# Windows: システム環境変数にGitのbinフォルダを追加
# macOS/Linux: ~/.bashrc や ~/.zshrc にパスを追加
export PATH="/usr/local/git/bin:$PATH"
```

#### 3. 「not a git repository」エラー
**原因**: VaultまたはフォルダがGitリポジトリとして初期化されていない

**解決方法**:
```bash
# Vaultでgitを初期化
cd "[YOUR_VAULT]"
git init
git add .
git commit -m "Initial commit"
```

#### 4. 権限エラー (Linux/macOS)
**原因**: ファイル権限が不適切

**解決方法**:
```bash
# 権限を修正
chmod 644 "[YOUR_VAULT]/.obsidian/plugins/multi-git-manager/main.js"
chmod 644 "[YOUR_VAULT]/.obsidian/plugins/multi-git-manager/manifest.json"
```

### ログの確認方法

#### 開発者ツールでのデバッグ
1. **Obsidianで開発者ツールを開く**:
   - Windows/Linux: `Ctrl + Shift + I`
   - macOS: `Cmd + Option + I`

2. **Console タブ**でエラーログを確認:
```javascript
// プラグイン関連のログを検索
console.log("Multi Git Manager"); // プラグインが読み込まれているか確認
```

3. **Network タブ**でファイル読み込みエラーを確認

#### プラグインログの有効化
```javascript
// Obsidianの設定画面 → 詳細設定 → 開発者モード をオンにする
// コンソールに詳細ログが出力される
```

## 🔄 アップデート方法

### 手動アップデート
1. 最新のプラグインコードを取得
2. ビルドを実行:
```bash
cd obsidian-multi-git-plugin
git pull
npm run build
```
3. 新しい `main.js` を既存のプラグインフォルダにコピー
4. Obsidianを再起動

### 開発者モード使用時
```bash
# シンボリックリンクを使用している場合
cd obsidian-multi-git-plugin
git pull
npm run build
# Obsidianは自動的に新しいファイルを読み込む
```

## 🗑️ アンインストール方法

1. **Obsidianの設定**でプラグインを無効化
2. プラグインフォルダを削除:
```bash
rm -rf "[YOUR_VAULT]/.obsidian/plugins/multi-git-manager"
```
3. Obsidianを再起動

## 📞 サポート

### 問題報告
- **GitHub Issues**: プロジェクトのIssuesで問題を報告
- **ログファイル**: 開発者ツールのConsoleログを含める
- **環境情報**: OS、Obsidianバージョン、Gitバージョンを記載

### よくある質問
Q: **モバイル版Obsidianで使用できますか？**
A: いいえ、このプラグインはデスクトップ版専用です。

Q: **複数のVaultで使用できますか？**
A: はい、各Vaultに個別にインストールする必要があります。

Q: **既存のGitワークフローに影響しますか？**
A: いいえ、標準的なGitコマンドを使用しているため、既存のワークフローと互換性があります。

---

**📝 このマニュアルで解決しない問題がございましたら、プロジェクトのIssuesページでお知らせください。**

*🤖 Created with Claude Code integration by Lean consultant Futaro (OfficeFutaro)*