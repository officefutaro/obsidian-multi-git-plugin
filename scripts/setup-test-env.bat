@echo off
echo Setting up test environment...

REM ビルドしてからテスト環境にコピー
cd /d "%~dp0..\obsidian-multi-git-plugin"
call npm run build

REM テストディレクトリを作成（存在しない場合）
if not exist "..\test-vault\.obsidian\plugins\obsidian-multi-git-plugin" (
    mkdir "..\test-vault\.obsidian\plugins\obsidian-multi-git-plugin"
)

REM 必要なファイルをコピー
copy /Y "main.js" "..\test-vault\.obsidian\plugins\obsidian-multi-git-plugin\"
copy /Y "manifest.json" "..\test-vault\.obsidian\plugins\obsidian-multi-git-plugin\"
copy /Y "styles.css" "..\test-vault\.obsidian\plugins\obsidian-multi-git-plugin\"

echo Test environment setup complete!
echo Open test-vault in Obsidian to test the plugin.
pause