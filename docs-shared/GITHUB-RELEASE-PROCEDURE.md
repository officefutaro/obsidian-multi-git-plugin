# GitHub リリース標準手順書

## 📋 概要
Obsidian Multi-Git Plugin のGitHubリリース作成手順を標準化したドキュメントです。  
Claude Codeを使用した半自動リリースプロセスを記載しています。

---

## 🔢 バージョニングルール

### バージョン形式
`v{メジャー}.{マイナー}.{パッチ}.{ビルド}`

例：
- `v1.1.5` - 通常リリース
- `v1.1.5.1` - パッチリリース（最後の番号をインクリメント）
- `v1.2.0` - マイナーアップデート
- `v2.0.0` - メジャーアップデート

### インクリメントルール
- **ビルド番号**：小さな修正、緊急パッチ（最後の番号をインクリメント）
- **パッチ番号**：バグ修正、小機能改善
- **マイナー番号**：新機能追加（後方互換性維持）
- **メジャー番号**：大規模変更（後方互換性なし）

---

## 🚀 リリース手順（Claude Code使用）

### 1. バージョン更新

```bash
# Claude Codeで実行
# 例：v1.1.5.1 から v1.1.5.2 へ更新
```

**Claude Codeへの指示例：**
```
v1.1.5.2を作成してgithubを更新してください。
```

### 2. 自動実行される処理

Claude Codeが以下を自動実行：

1. **manifest.json の更新**
   - ルートの `manifest.json`
   - `obsidian-multi-git-plugin/manifest.json`
   - 両ファイルのバージョンを同期

2. **Git コミット作成**
   ```bash
   git add .
   git commit -m "🔧 Update version to vX.X.X.X"
   ```

3. **Git タグ作成**
   ```bash
   git tag vX.X.X.X
   ```

4. **GitHub へプッシュ**
   ```bash
   git push origin master
   git push origin vX.X.X.X
   ```

### 3. GitHubリリース作成

**自動生成されるURL：**
```
https://github.com/officefutaro/obsidian-multi-git-plugin/releases/new?tag=vX.X.X.X
```

### 4. リリース情報入力

#### Title フォーマット
```
v{バージョン}: {簡潔な説明}
```

例：
- `v1.1.5.1: Patch version update`
- `v1.1.6: Bug fixes and improvements`
- `v1.2.0: New auto-sync feature`

#### Description テンプレート

```markdown
## 🔧 {アップデートタイプ}

### Changes
- ✅ {変更点1}
- ✅ {変更点2}
- ✅ {変更点3}

### For BRAT Users
{BRATユーザー向けの説明}

### Installation via BRAT
1. Install the [BRAT plugin](https://github.com/TfTHacker/obsidian42-brat)
2. Add this URL: https://github.com/officefutaro/obsidian-multi-git-plugin
3. Update the plugin to get version v{バージョン}

🤖 Generated with [Claude Code](https://claude.ai/code)
```

### 5. ファイルアップロード

**必須ファイル（3つ）：**
| ファイル | パス | 説明 |
|---------|------|------|
| main.js | `obsidian-multi-git-plugin/main.js` | メインプラグインコード |
| manifest.json | `obsidian-multi-git-plugin/manifest.json` | プラグインマニフェスト |
| styles.css | `obsidian-multi-git-plugin/styles.css` | UIスタイル |

**注意：** ルートディレクトリのファイルではなく、`obsidian-multi-git-plugin/` フォルダ内のファイルをアップロードする

### 6. リリース公開

- [ ] **"This is a pre-release"** のチェックを外す（正式版の場合）
- [ ] **"Publish release"** ボタンをクリック

---

## ✅ リリース後の確認

### 1. GitHub確認
- [ ] リリースページに新バージョンが表示される
- [ ] 3つのアセットファイルが添付されている
- [ ] タグが正しく設定されている

### 2. BRAT確認
1. Obsidian Settings → Community Plugins → BRAT
2. プラグインリストから選択
3. **"Update Plugin"** または **"Check for updates"** をクリック
4. 新バージョンがインストールされることを確認

### 3. 動作確認
- [ ] プラグイン設定画面でバージョン番号確認
- [ ] コンソールログで正しいバージョン表示
- [ ] 基本機能の動作テスト

---

## 🔄 トラブルシューティング

### よくある問題と解決方法

#### 1. BRATバージョン不一致エラー
**原因：** manifest.json のバージョンとGitタグが一致しない  
**解決：** 両方のmanifest.jsonを同じバージョンに統一してから再リリース

#### 2. プラグインが更新されない
**原因：** キャッシュまたはリリースファイルの問題  
**解決：** 
- BRATでプラグインを一度削除して再追加
- Obsidianを完全に再起動

#### 3. ファイルアップロードエラー
**原因：** ファイルパスの間違い  
**解決：** `obsidian-multi-git-plugin/` フォルダ内のファイルを使用

---

## 📝 Claude Code用コマンドテンプレート

### 標準リリース
```
v{新バージョン}を作成してgithubを更新してください。
```

### 緊急パッチ（最後の番号インクリメント）
```
v{現バージョン}.{+1}を作成してgithubを更新してください。
```

### 例
- 現在 v1.1.5.1 → 次 v1.1.5.2：
  ```
  v1.1.5.2を作成してgithubを更新してください。
  ```

---

## 📊 バージョン履歴管理

### 推奨フォーマット
| バージョン | リリース日 | 種別 | 主な変更点 |
|-----------|-----------|------|-----------|
| v1.1.5.1 | 2025-11-27 | Patch | バージョン同期修正 |
| v1.1.5 | 2025-11-27 | Minor | ハードコードバージョン修正 |
| v1.1.4 | 2025-11-26 | Minor | 診断機能追加 |

---

## 🛠️ 自動化の将来計画

### 検討中の改善
1. **GitHub Actions** を使用した完全自動リリース
2. **PowerShell/Bash** スクリプトの改良
3. **GitHub CLI (gh)** の活用
4. **自動テスト** の組み込み

---

## 📚 関連ドキュメント

- [BRAT実施手順書](../docs-shared/公開手順/BRAT実施手順書.md)
- [GitHub-Release作成手順](../docs-shared/公開手順/GitHub-Release作成手順.md)
- [CLAUDE.md](../obsidian-multi-git-plugin/CLAUDE.md)

---

**最終更新日：** 2025-11-27  
**作成者：** Claude Code  
**バージョン：** 1.0.0

---

## 📌 クイックリファレンス

```bash
# 1. Claude Codeで実行
"v1.1.5.2を作成してgithubを更新してください"

# 2. 生成されたURLを開く
https://github.com/officefutaro/obsidian-multi-git-plugin/releases/new?tag=v1.1.5.2

# 3. ファイルをアップロード
- obsidian-multi-git-plugin/main.js
- obsidian-multi-git-plugin/manifest.json
- obsidian-multi-git-plugin/styles.css

# 4. Publish release をクリック
```

以上