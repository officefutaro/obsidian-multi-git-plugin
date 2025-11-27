# フォルダ構造設計書

**プロジェクト**: Obsidian Multi-Git Plugin  
**作成日**: 2025年11月28日  
**目的**: プロジェクトのフォルダ構造を明確化し、混乱を防ぐ

---

## 📁 現在のフォルダ構造

```
D:\Project\2510_obsidianGit\                    # プロジェクトルート
│
├── 📂 obsidian-multi-git-plugin\               # ⭐ プラグイン本体フォルダ（重要）
│   ├── 📄 main.js (58,266 bytes)               # ✅ 最新ビルド - GitHubリリース用
│   ├── 📄 manifest.json (v1.1.5.4)             # ✅ 最新マニフェスト - GitHubリリース用
│   ├── 📄 styles.css (7,714 bytes)             # ✅ 最新スタイル - GitHubリリース用
│   ├── 📂 src\                                 # TypeScriptソースコード
│   │   ├── main.ts                             # メインプラグインコード
│   │   └── git-manager-view.ts                 # Gitマネージャービュー
│   ├── 📂 tests\                               # テストコード
│   ├── 📂 docs\                                # プラグイン専用ドキュメント
│   ├── package.json                            # Node.js依存関係
│   └── tsconfig.json                           # TypeScript設定
│
├── 📄 main.js (27,379 bytes)                   # ⚠️ 古いバージョン（使用しない）
├── 📄 manifest.json (v1.1.5.4)                 # ⚠️ ルート用（混乱の元）
├── 📄 styles.css (8,097 bytes)                 # ⚠️ 古いバージョン（使用しない）
│
├── 📂 docs-shared\                             # 共有ドキュメント
│   ├── 📂 公開手順\                            # リリース手順書
│   ├── 📂 開発ガイド\                          # 開発関連ドキュメント
│   └── その他技術文書
│
├── 📂 test-vault\                              # テスト用Obsidian Vault（サブモジュール）
│   └── .obsidian\plugins\obsidian-multi-git-plugin\
│
├── 📂 scripts\                                 # 自動化スクリプト
└── 📂 ai-shared-context\                       # AI開発用コンテキスト

```

---

## ⚠️ 重要な注意事項

### 1. **二重構造の問題**

現在、プロジェクトには**2セットのプラグインファイル**が存在します：

| 場所 | main.js | 用途 | 状態 |
|------|---------|------|------|
| **ルート** | 27,379 bytes | 古いテスト用 | ❌ 使用禁止 |
| **obsidian-multi-git-plugin/** | 58,266 bytes | 本番用 | ✅ これを使用 |

### 2. **GitHubリリース用ファイルの選択**

**必ず以下のファイルを使用すること：**
```bash
# 正しいファイルパス
D:\Project\2510_obsidianGit\obsidian-multi-git-plugin\main.js
D:\Project\2510_obsidianGit\obsidian-multi-git-plugin\manifest.json
D:\Project\2510_obsidianGit\obsidian-multi-git-plugin\styles.css
```

---

## 🎯 各フォルダの役割

### 📂 obsidian-multi-git-plugin/
**役割**: プラグイン開発の主要フォルダ
- ソースコード管理
- ビルド成果物の生成
- テストコード
- **GitHubリリース用ファイルの格納場所**

### 📂 docs-shared/
**役割**: プロジェクト全体のドキュメント
- 公開手順
- 開発ガイド
- 技術仕様書

### 📂 test-vault/
**役割**: Obsidianでのテスト環境
- 実際のObsidian環境でのテスト
- プラグインの動作確認

### 📂 scripts/
**役割**: 自動化ツール
- AI統合スクリプト
- テスト自動化
- リリース自動化

---

## 🔧 推奨される改善策

### 1. ルートファイルの整理
```bash
# 古いファイルを削除または別フォルダに移動
mkdir old-versions
mv main.js old-versions/
mv styles.css old-versions/
```

### 2. ビルドプロセスの明確化
```json
// package.json のスクリプト
{
  "scripts": {
    "build": "esbuild src/main.ts --outfile=main.js",
    "prepare-release": "npm run build && cp main.js manifest.json styles.css ../release/"
  }
}
```

### 3. リリースフォルダの作成
```bash
# 専用リリースフォルダを作成
D:\Project\2510_obsidianGit\release\
├── main.js
├── manifest.json
└── styles.css
```

---

## 📋 チェックリスト

リリース前の確認事項：

- [ ] `obsidian-multi-git-plugin/main.js` が最新ビルドか確認（58KB以上）
- [ ] manifest.json のバージョンが正しいか確認
- [ ] styles.css が含まれているか確認
- [ ] ルートディレクトリのファイルを使っていないか確認
- [ ] GitHubリリースに3つのファイルすべてが含まれているか確認

---

**最終更新**: 2025年11月28日  
**作成者**: Claude Code