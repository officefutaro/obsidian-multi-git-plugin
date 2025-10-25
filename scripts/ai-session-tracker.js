/**
 * AI Session Tracker
 * Claude Code環境でのリアルタイム会話追跡システム
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class AISessionTracker {
    constructor(projectPath) {
        this.projectPath = projectPath;
        this.sessionDir = path.join(projectPath, 'ai-shared-context', 'active-session');
        this.historyDir = path.join(projectPath, 'ai-shared-context', 'history');
        this.sessionStart = new Date();
        this.interactions = [];
        this.currentDate = new Date().toISOString().split('T')[0];
        
        this.ensureDirectories();
        this.initializeSession();
    }

    ensureDirectories() {
        [this.sessionDir, this.historyDir].forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });
    }

    initializeSession() {
        // アクティブセッション情報を作成
        this.sessionInfo = {
            sessionId: this.generateSessionId(),
            startTime: this.sessionStart.toISOString(),
            projectPath: this.projectPath,
            platform: process.platform,
            nodeVersion: process.version
        };

        this.saveSessionInfo();
        this.startActivityMonitoring();
    }

    generateSessionId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        return `session-${timestamp}-${random}`;
    }

    saveSessionInfo() {
        const sessionFile = path.join(this.sessionDir, 'current-session.json');
        fs.writeFileSync(sessionFile, JSON.stringify(this.sessionInfo, null, 2), 'utf8');
    }

    /**
     * 活動監視を開始（ファイル変更、コマンド実行など）
     */
    startActivityMonitoring() {
        console.log(`🔍 セッション追跡開始: ${this.sessionInfo.sessionId}`);
        
        // ファイル変更監視
        this.monitorFileChanges();
        
        // 定期的な状態保存
        this.autoSaveInterval = setInterval(() => {
            this.saveCurrentState();
        }, 60000); // 1分毎
        
        // プロセス終了時の処理
        process.on('beforeExit', () => {
            this.finalizeSession();
        });
    }

    monitorFileChanges() {
        const watchTargets = [
            this.projectPath
        ];

        watchTargets.forEach(target => {
            if (fs.existsSync(target)) {
                try {
                    fs.watch(target, { recursive: true }, (eventType, filename) => {
                        if (filename && this.shouldTrackFile(filename)) {
                            this.logFileActivity(eventType, filename);
                        }
                    });
                } catch (error) {
                    // 監視エラーは無視（権限不足など）
                }
            }
        });
    }

    shouldTrackFile(filename) {
        const ignorePaths = [
            'node_modules',
            '.git',
            'coverage',
            'dist',
            'build',
            'temp',
            '.cache'
        ];

        return !ignorePaths.some(ignore => filename.includes(ignore));
    }

    logFileActivity(eventType, filename) {
        const activity = {
            timestamp: new Date().toISOString(),
            type: 'file_change',
            event: eventType,
            file: filename,
            sessionId: this.sessionInfo.sessionId
        };

        this.interactions.push(activity);
        this.saveCurrentState();
    }

    /**
     * ユーザー入力を推測（間接的方法）
     */
    inferUserInteraction(context = {}) {
        const interaction = {
            timestamp: new Date().toISOString(),
            type: 'inferred_interaction',
            context: context,
            sessionId: this.sessionInfo.sessionId
        };

        this.interactions.push(interaction);
        return interaction;
    }

    /**
     * AI応答を記録（手動呼び出し用）
     */
    logAIResponse(response, metadata = {}) {
        const aiResponse = {
            timestamp: new Date().toISOString(),
            type: 'ai_response',
            content: typeof response === 'string' ? response : JSON.stringify(response),
            metadata: metadata,
            sessionId: this.sessionInfo.sessionId
        };

        this.interactions.push(aiResponse);
        this.saveCurrentState();
        return aiResponse;
    }

    /**
     * 現在の状態を保存
     */
    saveCurrentState() {
        const state = {
            sessionInfo: this.sessionInfo,
            interactions: this.interactions,
            lastUpdate: new Date().toISOString(),
            interactionCount: this.interactions.length
        };

        const stateFile = path.join(this.sessionDir, 'session-state.json');
        fs.writeFileSync(stateFile, JSON.stringify(state, null, 2), 'utf8');
    }

    /**
     * Git活動から会話を推測
     */
    inferFromGitActivity() {
        try {
            // 最近のコミット情報
            const recentCommits = execSync('git log --oneline -5', {
                cwd: this.projectPath,
                encoding: 'utf8'
            }).trim().split('\n');

            // Git status
            const gitStatus = execSync('git status --porcelain', {
                cwd: this.projectPath,
                encoding: 'utf8'
            }).trim();

            if (gitStatus) {
                this.inferUserInteraction({
                    type: 'git_activity',
                    status: gitStatus,
                    recentCommits: recentCommits
                });
            }
        } catch (error) {
            // Git関連エラーは無視
        }
    }

    /**
     * npm/yarn活動から会話を推測
     */
    inferFromPackageActivity() {
        const packageLock = path.join(this.projectPath, 'package-lock.json');
        const yarnLock = path.join(this.projectPath, 'yarn.lock');
        
        if (fs.existsSync(packageLock)) {
            const stats = fs.statSync(packageLock);
            const modifiedRecently = (Date.now() - stats.mtime.getTime()) < 300000; // 5分以内
            
            if (modifiedRecently) {
                this.inferUserInteraction({
                    type: 'package_activity',
                    manager: 'npm',
                    lastModified: stats.mtime.toISOString()
                });
            }
        }
    }

    /**
     * セッション終了時の処理
     */
    finalizeSession() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }

        // 最終状態を保存
        this.saveCurrentState();

        // ヒストリーファイルに変換
        this.convertToHistoryFile();

        console.log(`📝 セッション終了: ${this.sessionInfo.sessionId}`);
    }

    /**
     * ヒストリーファイルに変換
     */
    convertToHistoryFile() {
        const sequence = this.getNextHistorySequence();
        const historyFile = `history-${this.currentDate}-${sequence.toString().padStart(3, '0')}.md`;
        const historyPath = path.join(this.historyDir, historyFile);

        const content = this.formatAsHistory();
        fs.writeFileSync(historyPath, content, 'utf8');
        
        console.log(`📚 ヒストリーファイル作成: ${historyFile}`);
        return historyPath;
    }

    getNextHistorySequence() {
        const pattern = `history-${this.currentDate}-`;
        const files = fs.readdirSync(this.historyDir)
            .filter(f => f.startsWith(pattern))
            .map(f => {
                const match = f.match(/history-\d{4}-\d{2}-\d{2}-(\d+)\.md$/);
                return match ? parseInt(match[1]) : 0;
            })
            .filter(n => !isNaN(n));
        
        return files.length > 0 ? Math.max(...files) + 1 : 1;
    }

    formatAsHistory() {
        const duration = ((new Date() - this.sessionStart) / 1000 / 60).toFixed(1);
        
        let content = `# AI対話履歴 - ${this.currentDate}\n\n`;
        content += `**セッションID**: ${this.sessionInfo.sessionId}\n`;
        content += `**開始時刻**: ${this.sessionStart.toISOString()}\n`;
        content += `**終了時刻**: ${new Date().toISOString()}\n`;
        content += `**セッション時間**: ${duration}分\n`;
        content += `**総インタラクション**: ${this.interactions.length}件\n\n`;

        content += `## 活動概要\n\n`;

        // ファイル変更をグループ化
        const fileChanges = this.interactions.filter(i => i.type === 'file_change');
        if (fileChanges.length > 0) {
            content += `### ファイル変更 (${fileChanges.length}件)\n`;
            const fileGroups = {};
            fileChanges.forEach(change => {
                const file = change.file;
                if (!fileGroups[file]) fileGroups[file] = [];
                fileGroups[file].push(change.event);
            });
            
            Object.entries(fileGroups).forEach(([file, events]) => {
                content += `- **${file}**: ${events.join(', ')}\n`;
            });
            content += `\n`;
        }

        // AI応答
        const aiResponses = this.interactions.filter(i => i.type === 'ai_response');
        if (aiResponses.length > 0) {
            content += `### AI応答 (${aiResponses.length}件)\n`;
            aiResponses.forEach((response, index) => {
                const time = new Date(response.timestamp).toLocaleTimeString();
                content += `${index + 1}. **${time}**: ${response.content.substring(0, 100)}...\n`;
            });
            content += `\n`;
        }

        // 推測されたインタラクション
        const inferred = this.interactions.filter(i => i.type === 'inferred_interaction');
        if (inferred.length > 0) {
            content += `### 検出された活動\n`;
            inferred.forEach(inf => {
                const time = new Date(inf.timestamp).toLocaleTimeString();
                content += `- **${time}**: ${JSON.stringify(inf.context)}\n`;
            });
            content += `\n`;
        }

        content += `---\n`;
        content += `*AI Session Tracker によって自動生成*\n`;
        content += `*生成日時: ${new Date().toISOString()}*`;

        return content;
    }

    /**
     * 現在のセッション状況を取得
     */
    getCurrentStatus() {
        return {
            sessionId: this.sessionInfo.sessionId,
            duration: Math.round((Date.now() - this.sessionStart.getTime()) / 1000 / 60),
            interactions: this.interactions.length,
            lastActivity: this.interactions.length > 0 
                ? this.interactions[this.interactions.length - 1].timestamp 
                : this.sessionStart.toISOString()
        };
    }
}

// グローバルインスタンス（単一セッション）
let globalTracker = null;

function getGlobalTracker(projectPath = process.cwd()) {
    if (!globalTracker) {
        globalTracker = new AISessionTracker(projectPath);
    }
    return globalTracker;
}

// CLI使用
if (require.main === module) {
    const projectPath = process.argv[2] || process.cwd();
    const tracker = new AISessionTracker(projectPath);
    
    console.log('AI Session Tracker が開始されました');
    console.log('Ctrl+C で終了');
    
    process.on('SIGINT', () => {
        tracker.finalizeSession();
        process.exit(0);
    });
    
    // デモ用のテスト実行
    setInterval(() => {
        tracker.inferFromGitActivity();
        tracker.inferFromPackageActivity();
        console.log('現在の状況:', tracker.getCurrentStatus());
    }, 30000);
}

module.exports = { AISessionTracker, getGlobalTracker };