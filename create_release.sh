#!/bin/bash

# GitHub Release Creation Script for v1.0.1
# Usage: ./create_release.sh

# Check if GITHUB_TOKEN is set
if [ -z "$GITHUB_TOKEN" ]; then
    echo "Error: GITHUB_TOKEN environment variable not set"
    echo "Please set it with: export GITHUB_TOKEN='your_token_here'"
    exit 1
fi

REPO_OWNER="officefutaro"
REPO_NAME="obsidian-multi-git-plugin"
TAG_NAME="v1.0.1"
RELEASE_NAME="v1.0.1: ボタンの処理中フィードバック機能"

# Release description in JSON format
RELEASE_BODY=$(cat <<'EOF'
## 🎉 新機能

### ボタンの処理中フィードバック
- すべてのGit操作ボタンに処理中の視覚的フィードバックを追加しました
- ボタンを押すと「⏳ Processing...」と表示され、処理中であることが分かりやすくなりました
- パルスアニメーション効果で処理中を視覚的に表現
- 処理完了後は自動的に元の状態に戻ります

## 📦 インストール

BRATプラグインをお使いの方は、プラグインの設定から更新チェックを実行してください。
EOF
)

echo "Creating GitHub release for $TAG_NAME..."

# Create the release
RELEASE_RESPONSE=$(curl -s -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  -H "Content-Type: application/json" \
  "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/releases" \
  -d "{
    \"tag_name\": \"$TAG_NAME\",
    \"target_commitish\": \"master\",
    \"name\": \"$RELEASE_NAME\",
    \"body\": $(echo "$RELEASE_BODY" | jq -Rs .),
    \"draft\": false,
    \"prerelease\": false
  }")

# Check if the release was created successfully
if echo "$RELEASE_RESPONSE" | grep -q '"upload_url"'; then
    echo "✅ Release created successfully!"
    
    # Extract the upload URL and release ID
    UPLOAD_URL=$(echo "$RELEASE_RESPONSE" | grep '"upload_url"' | sed 's/.*"upload_url": "\([^"]*\)".*/\1/' | sed 's/{?name,label}//')
    RELEASE_ID=$(echo "$RELEASE_RESPONSE" | grep '"id"' | head -1 | sed 's/.*"id": \([0-9]*\).*/\1/')
    
    echo "Release ID: $RELEASE_ID"
    echo "Upload URL: $UPLOAD_URL"
    
    # Upload assets
    echo "📦 Uploading release assets..."
    
    # Upload main.js
    echo "Uploading main.js..."
    curl -s -X POST \
      -H "Authorization: token $GITHUB_TOKEN" \
      -H "Content-Type: application/javascript" \
      "${UPLOAD_URL}?name=main.js" \
      --data-binary @"obsidian-multi-git-plugin/main.js" > /dev/null
    
    # Upload manifest.json
    echo "Uploading manifest.json..."
    curl -s -X POST \
      -H "Authorization: token $GITHUB_TOKEN" \
      -H "Content-Type: application/json" \
      "${UPLOAD_URL}?name=manifest.json" \
      --data-binary @"obsidian-multi-git-plugin/manifest.json" > /dev/null
    
    # Upload styles.css
    echo "Uploading styles.css..."
    curl -s -X POST \
      -H "Authorization: token $GITHUB_TOKEN" \
      -H "Content-Type: text/css" \
      "${UPLOAD_URL}?name=styles.css" \
      --data-binary @"obsidian-multi-git-plugin/styles.css" > /dev/null
    
    echo "✅ All assets uploaded successfully!"
    echo "🎉 Release v1.0.1 is now available at: https://github.com/$REPO_OWNER/$REPO_NAME/releases/tag/$TAG_NAME"
    
else
    echo "❌ Failed to create release. Response:"
    echo "$RELEASE_RESPONSE"
    exit 1
fi