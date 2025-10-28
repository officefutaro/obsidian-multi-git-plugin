# Claude Code PowerShell連携ガイド

## 概要
Claude Codeは技術的制約により、POSIX準拠のシェル環境（Bash）を必要とします。そのため、PowerShellを直接デフォルトシェルとして使用することはできませんが、以下の方法で連携が可能です。

## 現在の環境

### Claude Codeのシェル環境
- **使用シェル**: Git Bash (`/usr/bin/bash`)
- **環境変数**: `CLAUDE_CODE_GIT_BASH_PATH=C:\Program Files\Git\bin\bash.exe`
- **プラットフォーム**: Windows (win32)

### 設定ファイルの場所
- グローバル設定: `~/.claude/settings.json` または `~/.claude.json`
- プロジェクト設定: `.claude/settings.json`
- ローカル設定: `.claude/settings.local.json`

## PowerShell連携方法

### 方法1: PowerShellプロファイルに関数を追加

PowerShellからClaude Codeを簡単に起動できるようにする設定です。

```powershell
# PowerShellプロファイルを開く
notepad $PROFILE

# 以下の関数を追加
function claude {
    param(
        [string]$Arguments = ""
    )
    & "C:\Program Files\Git\bin\bash.exe" -c "claude $Arguments"
}

# より高度な関数（プロジェクトディレクトリ指定可能）
function Start-ClaudeCode {
    param(
        [string]$Project = ".",
        [string]$Arguments = ""
    )
    $originalLocation = Get-Location
    Set-Location $Project
    & "C:\Program Files\Git\bin\bash.exe" -c "claude $Arguments"
    Set-Location $originalLocation
}

# エイリアスの設定
Set-Alias cc Start-ClaudeCode
```

### 方法2: Windows Terminal での使い分け

Windows Terminalで複数のプロファイルを設定し、タブで切り替えて使用します。

#### settings.json の設定例
```json
{
    "profiles": {
        "list": [
            {
                "guid": "{xxxxx-xxx-xxx-xxx-xxxxx}",
                "name": "PowerShell",
                "commandline": "pwsh.exe",
                "startingDirectory": "%USERPROFILE%"
            },
            {
                "guid": "{yyyyy-yyy-yyy-yyy-yyyyy}",
                "name": "Git Bash (Claude Code)",
                "commandline": "C:\\Program Files\\Git\\bin\\bash.exe",
                "startingDirectory": "%USERPROFILE%",
                "icon": "🤖"
            }
        ]
    }
}
```

### 方法3: BashからPowerShellコマンドを実行

Claude Code（Bash）内からPowerShellコマンドを実行する方法です。

```bash
# 単一のPowerShellコマンドを実行
powershell.exe -Command "Get-Process"

# PowerShellスクリプトを実行
powershell.exe -File "script.ps1"

# 複数のコマンドを実行
powershell.exe -Command "Get-Date; Get-Location"

# 管理者権限でPowerShellコマンドを実行（UAC確認あり）
powershell.exe -Command "Start-Process powershell -Verb RunAs"
```

## 環境変数の設定

### PowerShellでの環境変数設定（永続的）

```powershell
# ユーザー環境変数の設定
[System.Environment]::SetEnvironmentVariable('CLAUDE_CODE_GIT_BASH_PATH', 'C:\Program Files\Git\bin\bash.exe', 'User')

# システム環境変数の設定（管理者権限必要）
[System.Environment]::SetEnvironmentVariable('CLAUDE_CODE_GIT_BASH_PATH', 'C:\Program Files\Git\bin\bash.exe', 'Machine')
```

### 一時的な環境変数設定

```powershell
# 現在のセッションのみ
$env:CLAUDE_CODE_GIT_BASH_PATH = "C:\Program Files\Git\bin\bash.exe"
```

## よくあるコマンドの相互変換

| 操作 | PowerShell | Bash (Claude Code) |
|------|-----------|-------------------|
| ディレクトリ移動 | `cd D:\Project` | `cd /d/Project` |
| ファイル一覧 | `Get-ChildItem` or `ls` | `ls -la` |
| ファイル検索 | `Get-ChildItem -Recurse -Filter "*.md"` | `find . -name "*.md"` |
| テキスト検索 | `Select-String "pattern" *.txt` | `grep "pattern" *.txt` |
| 環境変数確認 | `$env:PATH` | `echo $PATH` |
| プロセス確認 | `Get-Process` | `ps aux` |
| ネットワーク確認 | `Test-NetConnection` | `ping` or `curl` |

## PowerShellスクリプトの実行

### Claude Code内からPowerShellスクリプトを実行

```bash
# スクリプトファイルの実行
powershell.exe -ExecutionPolicy Bypass -File "./script.ps1"

# インラインスクリプトの実行
powershell.exe -Command "& { 
    Write-Host 'Hello from PowerShell'
    Get-Date
}"
```

## トラブルシューティング

### 問題1: 実行ポリシーエラー
```powershell
# 実行ポリシーの確認
Get-ExecutionPolicy

# 実行ポリシーの変更（現在のユーザーのみ）
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 問題2: パスの区切り文字の違い
- Windows/PowerShell: `\` (バックスラッシュ)
- Bash: `/` (スラッシュ)

変換例：
```bash
# WindowsパスをBashパスに変換
winpath="C:\Users\futaro\Documents"
bashpath=$(echo $winpath | sed 's/\\/\//g' | sed 's/C:/\/c/')
```

### 問題3: 文字エンコーディング
PowerShellとBashで文字エンコーディングが異なる場合があります。

```powershell
# PowerShellでUTF-8を設定
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$PSDefaultParameterValues['Out-File:Encoding'] = 'utf8'
```

## 推奨される使用パターン

### 1. 基本的な使い分け
- **Claude Code作業**: Git Bashタブを使用
- **Windows管理作業**: PowerShellタブを使用
- **ファイル操作**: 両方で可能だが、パス形式に注意

### 2. 統合的な使用
1. PowerShellでプロジェクトフォルダに移動
2. `claude`関数でClaude Codeを起動
3. 必要に応じてBash内からPowerShellコマンドを実行

### 3. 自動化スクリプト
PowerShellスクリプトとBashスクリプトを組み合わせて、複雑な処理を自動化。

```powershell
# setup.ps1
Write-Host "Setting up project..."
npm install
& "C:\Program Files\Git\bin\bash.exe" -c "claude test"
```

## まとめ

Claude CodeはBash環境で動作しますが、上記の方法を使用することで、PowerShellとの効果的な連携が可能です。用途に応じて最適な方法を選択してください。

### 重要なポイント
- Claude Codeは直接PowerShellで動作しない
- Git Bashが必須
- PowerShellとの連携は可能
- Windows Terminalの使用を推奨
- パス形式の違いに注意

## 関連リンク
- [Claude Code ドキュメント](https://docs.anthropic.com/en/docs/claude-code)
- [Windows Terminal](https://aka.ms/terminal)
- [Git for Windows](https://gitforwindows.org/)