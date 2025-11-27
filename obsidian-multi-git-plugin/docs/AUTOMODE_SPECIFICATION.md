# Automode機能仕様書

## 概要
Obsidian Multi Git Pluginの自動コミット・プッシュ機能（Automode）の詳細仕様書です。

## 機能概要
指定したサイクルタイムでファイルの変更を監視し、変更があれば自動的にコミット・プッシュを実行する機能。

### 🔀 ブランチ戦略
- **Automode ON**: 専用ブランチ（デフォルト: `automode`）で自動コミット・プッシュ
- **Automode OFF**: メインブランチ（`main`または`master`）に自動切り替え
- **安全性**: 手動操作とAutomode操作を分離し、競合を防止
- **透明性**: 現在のブランチとモードをステータスバーに常時表示

## 1. 機能要件

### 1.1 基本機能
- **自動監視**: 設定した間隔でGitリポジトリの変更を監視
- **自動コミット**: 変更が検出された場合、自動的にファイルをステージング・コミット
- **自動プッシュ**: コミット後、自動的にリモートリポジトリにプッシュ
- **手動制御**: ユーザーがいつでもAutomode機能のON/OFFを切り替え可能
- **ブランチ分離**: Automode実行時は専用ブランチで作業、手動操作時はメインブランチに自動復帰

### 1.2 対象リポジトリ
- プラグインが検出したすべてのGitリポジトリ（親ディレクトリ含む）
- 各リポジトリは独立して監視・処理される

### 1.3 監視対象ファイル
- **modified**: 変更されたファイル
- **added**: 新規追加されたファイル  
- **deleted**: 削除されたファイル
- **untracked**: 未追跡ファイル
- **除外**: `.gitignore`に指定されたファイルは対象外

## 2. ユーザーインターフェース

### 2.1 設定画面
**場所**: Obsidian設定 > Community plugins > Multi Git Manager

**設定項目**:
- **Automode有効/無効**: トグルスイッチ
- **監視間隔**: 5秒〜60分（スライダー・数値入力）
- **コミットメッセージテンプレート**: カスタマイズ可能なテンプレート
- **プッシュ有効/無効**: コミット後の自動プッシュを制御
- **通知設定**: 自動操作時の通知表示有無
- **ブランチ分離**: Automode用の専用ブランチを使用するかの設定
- **Automodeブランチ名**: 専用ブランチの名前（デフォルト: "automode"）
- **自動ブランチ切り替え**: 手動操作時にmainブランチに自動復帰

### 2.2 Git Manager View
**追加要素**:
- **Automodeステータス表示**: 現在の状態（ON/OFF、次回実行時間）
- **Automode切り替えボタン**: 「🤖 Auto ON」「⏸️ Auto OFF」
- **即座実行ボタン**: 「⚡ Run Now」- 手動で即座にAutomode実行

### 2.3 ステータスバー
**表示内容**:
- **通常時**: 「Git: Auto OFF」
- **Automode有効**: 「Git: Auto ON (次回: 30s)」
- **実行中**: 「Git: Auto Running...」

## 3. 技術仕様

### 3.1 監視メカニズム
```javascript
class AutomodeManager {
    private automodeTimer: NodeJS.Timer | null = null;
    private isRunning: boolean = false;
    private settings: AutomodeSettings;
    
    startAutomode() {
        this.automodeTimer = setInterval(
            () => this.executeAutomodeCheck(),
            this.settings.interval * 1000
        );
    }
    
    stopAutomode() {
        if (this.automodeTimer) {
            clearInterval(this.automodeTimer);
            this.automodeTimer = null;
        }
    }
}
```

### 3.2 変更検出ロジック
```javascript
async detectChanges(repo: GitRepository): Promise<boolean> {
    const status = await this.getGitStatus(repo.path);
    return (
        status.modified.length > 0 ||
        status.added.length > 0 ||
        status.deleted.length > 0 ||
        status.untracked.length > 0
    );
}
```

### 3.3 自動コミット処理
```javascript
async executeAutoCommit(repo: GitRepository): Promise<void> {
    try {
        // 1. ブランチ切り替え（必要に応じて）
        if (this.settings.useSeparateBranch) {
            await this.ensureAutomodeBranch(repo);
        }
        
        // 2. ステージング
        await this.executeGitCommand(repo.path, 'add .');
        
        // 3. コミット
        const message = this.generateCommitMessage(repo);
        await this.executeGitCommand(repo.path, `commit -m "${message}"`);
        
        // 4. プッシュ（設定により）
        if (this.settings.autoPush) {
            await this.executeGitCommand(repo.path, 'push origin ' + this.settings.automodeBranchName);
        }
    } catch (error) {
        this.handleAutomodeError(repo, error);
    }
}

async ensureAutomodeBranch(repo: GitRepository): Promise<void> {
    const currentBranch = await this.getCurrentBranch(repo.path);
    const automodeBranch = this.settings.automodeBranchName;
    
    if (currentBranch !== automodeBranch) {
        // Automodeブランチが存在するかチェック
        const branches = await this.executeGitCommand(repo.path, 'branch -a');
        const branchExists = branches.includes(automodeBranch);
        
        if (!branchExists) {
            // 新規ブランチ作成
            await this.executeGitCommand(repo.path, `checkout -b ${automodeBranch}`);
        } else {
            // 既存ブランチに切り替え
            await this.executeGitCommand(repo.path, `checkout ${automodeBranch}`);
        }
    }
}

async switchToMainBranch(repo: GitRepository): Promise<void> {
    if (this.settings.autoSwitchToMain) {
        const mainBranch = await this.getMainBranchName(repo.path);
        await this.executeGitCommand(repo.path, `checkout ${mainBranch}`);
    }
}

async generateCommitMessage(repo: GitRepository): Promise<string> {
    const status = await this.getGitStatus(repo.path);
    const changedFiles = [
        ...status.modified,
        ...status.added,
        ...status.deleted,
        ...status.untracked
    ];
    
    // ファイルパスからファイル名のみを抽出
    const fileNames = changedFiles.map(file => 
        file.split('/').pop() || file
    );
    
    const template = this.settings.commitMessageTemplate;
    const now = new Date();
    
    return template
        .replace('${files}', fileNames.join(', '))
        .replace('${fileCount}', fileNames.length.toString())
        .replace('${repo}', repo.name)
        .replace('${timestamp}', now.toISOString())
        .replace('${date}', now.toISOString().split('T')[0])
        .replace('${time}', now.toTimeString().split(' ')[0]);
}
```

## 4. 設定仕様

### 4.1 デフォルト設定
```typescript
interface AutomodeSettings {
    enabled: boolean;           // false
    interval: number;          // 30 (秒)
    autoPush: boolean;         // true
    commitMessageTemplate: string; // "${files}"
    showNotifications: boolean; // true
    excludeRepositories: string[]; // []
    useSeparateBranch: boolean; // true
    automodeBranchName: string; // "automode"
    autoSwitchToMain: boolean;  // true
}
```

### 4.2 コミットメッセージテンプレート
**利用可能な変数**:
- `${timestamp}`: ISO形式のタイムスタンプ
- `${date}`: YYYY-MM-DD形式の日付
- `${time}`: HH:mm:ss形式の時刻
- `${repo}`: リポジトリ名
- `${files}`: 変更されたファイル名をカンマ区切りで表示
- `${fileCount}`: 変更されたファイル数

**デフォルト**: `${files}` - 変更されたファイル名を表示

**例**:
- `"document.md, settings.json"` (デフォルト)
- `"Auto-commit: ${timestamp}"`
- `"📝 Auto-save ${date} ${time}"`
- `"🤖 ${fileCount} files: ${files}"`
- `"Auto: ${files} in ${repo}"`

## 5. エラーハンドリング

### 5.1 エラー種別と対応
| エラー種別 | 対応 | 通知 |
|------------|------|------|
| ネットワークエラー | プッシュをスキップ、ローカルコミットは実行 | 警告通知 |
| マージコンフリクト | Automodeを一時停止 | エラー通知 |
| 認証エラー | プッシュをスキップ | エラー通知 |
| その他のGitエラー | 該当リポジトリをスキップ | 警告通知 |

### 5.2 安全機能
- **コンフリクト検出**: マージコンフリクトが発生した場合はAutomode自動停止
- **認証失敗**: プッシュに失敗した場合はローカルコミットのみ実行
- **最大リトライ**: 一定回数失敗した場合の自動停止機能

## 6. パフォーマンス考慮事項

### 6.1 最適化
- **並列処理**: 複数リポジトリを並列で処理
- **差分チェック**: 前回チェック時から変更がない場合はスキップ
- **バックグラウンド実行**: UI操作をブロックしない非同期処理

### 6.2 制限事項
- **最小間隔**: 5秒未満の設定は不可
- **同時実行**: 前回の処理が完了していない場合は次回をスキップ
- **大容量ファイル**: 特定サイズ以上のファイルは警告表示

## 7. セキュリティ

### 7.1 認証
- **既存認証の利用**: システムに設定されたGit認証情報を使用
- **秘密情報の保護**: プラグイン設定にパスワード等の機密情報は保存しない

### 7.2 操作制限
- **読み取り専用モード**: 設定により、監視のみで自動コミットを無効化
- **リポジトリ除外**: 特定のリポジトリをAutomode対象から除外

## 8. 通知とログ

### 8.1 通知種別
- **成功**: 「✅ Auto-committed 3 files to MyRepo」
- **警告**: 「⚠️ Push failed, local commit completed」
- **エラー**: 「❌ Automode stopped due to conflict」

### 8.2 ログ機能
- **操作履歴**: 自動実行された操作の履歴をコンソールに出力
- **デバッグ情報**: 開発者向けの詳細ログ（設定により有効化）

## 9. 将来的な拡張

### 9.1 計画中の機能
- **条件分岐**: ファイルタイプ別のコミット条件設定
- **スケジュール機能**: 時間帯指定での自動実行
- **フック連携**: pre-commit/post-commitフックとの連携
- **ブランチマージ**: Automodeブランチから手動でmainブランチへのマージ機能

### 9.2 検討中の機能
- **AI生成コミットメッセージ**: 変更内容に基づく自動生成
- **クラウド連携**: GitHub Actions等との連携
- **チーム機能**: チーム開発での自動同期機能

---

## 改版履歴
- **v1.0**: 初版作成 (2025-11-27)

## 関連ドキュメント
- [ユーザーガイド](./docs/en/user-guide.md)
- [開発者向けドキュメント](./docs/en/developer.md)
- [API仕様書](./docs/en/api.md)