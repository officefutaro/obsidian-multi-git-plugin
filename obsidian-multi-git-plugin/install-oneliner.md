# 🚀 ワンライナーインストール

## Windows (PowerShell)

```powershell
# PowerShellを管理者権限で開いて実行
irm http://192.168.68.72:3000/futaro/obsidian-multi-git-plugin/raw/branch/master/install.ps1 | iex
```

または

```powershell
# ダウンロードして実行
Invoke-WebRequest -Uri "http://192.168.68.72:3000/futaro/obsidian-multi-git-plugin/raw/branch/master/install.ps1" -OutFile "$env:TEMP\install-mgm.ps1"; powershell -ExecutionPolicy Bypass -File "$env:TEMP\install-mgm.ps1"
```

## macOS / Linux (Bash)

```bash
# ワンライナーインストール
curl -sSL http://192.168.68.72:3000/futaro/obsidian-multi-git-plugin/raw/branch/master/install.sh | bash
```

または

```bash
# wgetを使用
wget -qO- http://192.168.68.72:3000/futaro/obsidian-multi-git-plugin/raw/branch/master/install.sh | bash
```

## 📋 手動でスクリプトを実行

### Windows
```powershell
# 1. スクリプトをダウンロード
Invoke-WebRequest -Uri "http://192.168.68.72:3000/futaro/obsidian-multi-git-plugin/raw/branch/master/install.ps1" -OutFile "install.ps1"

# 2. 実行
powershell -ExecutionPolicy Bypass -File install.ps1
```

### macOS / Linux
```bash
# 1. スクリプトをダウンロード
curl -O http://192.168.68.72:3000/futaro/obsidian-multi-git-plugin/raw/branch/master/install.sh

# 2. 実行権限を付与
chmod +x install.sh

# 3. 実行
./install.sh
```

## 🔍 スクリプトの動作

1. **自動検出**: インストール済みのObsidian Vaultを自動検出
2. **選択**: 複数のVaultがある場合は選択メニューを表示
3. **ダウンロード**: Giteaから最新のプラグインファイルを取得
4. **インストール**: 適切な場所にファイルを配置
5. **確認**: インストール完了後、Obsidianの起動オプション提供

## ⚠️ 注意事項

- **ネットワークアクセス**: `192.168.68.72:3000` へのアクセスが必要
- **PowerShell実行ポリシー**: Windowsでは実行ポリシーの変更が必要な場合があります
- **管理者権限**: 通常は不要ですが、特殊な環境では必要な場合があります

## 🔧 トラブルシューティング

### PowerShellで「実行できません」エラー
```powershell
# 実行ポリシーを一時的に変更
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

### macOS/Linuxで「Permission denied」エラー
```bash
# 実行権限を付与
chmod +x install.sh
```

### ネットワークエラー
- Giteaサーバー（192.168.68.72:3000）にアクセスできることを確認
- ファイアウォール設定を確認

## 📝 手動インストール用URL

直接ファイルをダウンロードする場合：

- **main.js**: http://192.168.68.72:3000/futaro/obsidian-multi-git-plugin/raw/branch/master/main.js
- **manifest.json**: http://192.168.68.72:3000/futaro/obsidian-multi-git-plugin/raw/branch/master/manifest.json
- **styles.css**: http://192.168.68.72:3000/futaro/obsidian-multi-git-plugin/raw/branch/master/styles.css