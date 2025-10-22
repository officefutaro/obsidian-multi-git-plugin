#!/bin/bash

echo "Setting up test environment..."

# ビルドしてからテスト環境にコピー
cd "$(dirname "$0")/../obsidian-multi-git-plugin"
npm run build

# テストディレクトリを作成（存在しない場合）
mkdir -p "../test-vault/.obsidian/plugins/obsidian-multi-git-plugin"

# 必要なファイルをコピー
cp "main.js" "../test-vault/.obsidian/plugins/obsidian-multi-git-plugin/"
cp "manifest.json" "../test-vault/.obsidian/plugins/obsidian-multi-git-plugin/"
cp "styles.css" "../test-vault/.obsidian/plugins/obsidian-multi-git-plugin/"

echo "Test environment setup complete!"
echo "Open test-vault in Obsidian to test the plugin."