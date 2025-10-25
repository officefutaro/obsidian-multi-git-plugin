/**
 * AI History Logger
 * AI対話履歴を自動記録するシステム
 */

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class AIHistoryLogger {
    constructor(projectPath) {
        this.projectPath = projectPath;
        this.historyDir = path.join(projectPath, 'ai-shared-context', 'history');
        this.sessionId = uuidv4();
        this.sessionStart = new Date();
        this.entries = [];
        this.currentDate = this.getDateString(new Date());
        this.currentHistoryFile = null;
        this.conversationHistory = []; // AI会話履歴
        
        this.ensureDirectories();
        this.initializeHistoryFile();
    }

    getDateString(date) {
        return date.toISOString().split('T')[0]; // YYYY-MM-DD形式
    }

    getNextSequenceNumber(date) {
        const pattern = `history-${date}-`;
        const files = fs.readdirSync(this.historyDir)
            .filter(f => f.startsWith(pattern))
            .map(f => {
                const match = f.match(/history-\d{4}-\d{2}-\d{2}-(\d+)\.md$/);
                return match ? parseInt(match[1]) : 0;
            })
            .filter(n => !isNaN(n));
        
        return files.length > 0 ? Math.max(...files) + 1 : 1;
    }

    initializeHistoryFile() {
        const date = this.currentDate;
        const sequence = this.getNextSequenceNumber(date);
        this.currentHistoryFile = `history-${date}-${sequence.toString().padStart(3, '0')}.md`;
    }

    ensureDirectories() {
        const dirs = [
            path.join(this.projectPath, 'ai-shared-context'),
            path.join(this.projectPath, 'ai-shared-context', 'history'),
            path.join(this.projectPath, 'ai-shared-context', 'summaries'),
            path.join(this.projectPath, 'ai-shared-context', 'knowledge-base')
        ];
        
        dirs.forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });
    }

    logInteraction(userMessage, assistantResponse, actions = []) {
        const entry = {
            timestamp: new Date().toISOString(),
            user: userMessage,
            assistant: assistantResponse,
            actions: actions
        };
        
        this.entries.push(entry);
        this.conversationHistory.push({
            role: 'user',
            content: userMessage,
            timestamp: entry.timestamp
        });
        this.conversationHistory.push({
            role: 'assistant', 
            content: assistantResponse,
            timestamp: entry.timestamp,
            actions: actions
        });
        
        this.saveIncremental();
    }

    // 「まとめ」指示時に新しいファイルを開始
    startNewHistoryFile() {
        const date = this.currentDate;
        const sequence = this.getNextSequenceNumber(date);
        this.currentHistoryFile = `history-${date}-${sequence.toString().padStart(3, '0')}.md`;
        
        // 現在のセッションをリセット
        this.entries = [];
        this.sessionId = uuidv4();
        this.sessionStart = new Date();
        
        console.log(`新しい履歴ファイルを開始: ${this.currentHistoryFile}`);
        return this.currentHistoryFile;
    }

    logAction(type, details) {
        const action = {
            type: type,
            details: details,
            timestamp: new Date().toISOString()
        };
        
        if (this.entries.length > 0) {
            const lastEntry = this.entries[this.entries.length - 1];
            if (!lastEntry.actions) {
                lastEntry.actions = [];
            }
            lastEntry.actions.push(action);
        }
        
        return action;
    }

    saveIncremental() {
        if (!this.currentHistoryFile) {
            this.initializeHistoryFile();
        }
        
        const filepath = path.join(this.historyDir, this.currentHistoryFile);
        const content = this.formatHistory();
        fs.writeFileSync(filepath, content, 'utf8');
        
        return filepath;
    }

    formatTimestamp(date) {
        return date.toISOString()
            .replace(/:/g, '-')
            .replace(/\./g, '-')
            .replace('T', '-')
            .slice(0, 19);
    }

    formatHistory() {
        const now = new Date();
        let content = `# AI対話履歴\n\n`;
        content += `**日時**: ${now.toISOString()}\n`;
        content += `**プロジェクト**: ${path.basename(this.projectPath)}\n`;
        content += `**セッションID**: ${this.sessionId}\n`;
        content += `**セッション開始**: ${this.sessionStart.toISOString()}\n\n`;
        
        content += `## 対話ログ\n\n`;
        
        this.entries.forEach((entry, index) => {
            content += `### 対話 #${index + 1} (${entry.timestamp})\n\n`;
            content += `#### Human:\n${entry.user}\n\n`;
            content += `#### Assistant:\n${entry.assistant}\n\n`;
            
            if (entry.actions && entry.actions.length > 0) {
                content += `#### 実行されたアクション:\n`;
                entry.actions.forEach(action => {
                    content += `- **${action.type}**: ${JSON.stringify(action.details)}\n`;
                });
                content += `\n`;
            }
        });
        
        return content;
    }

    getNextSummarySequence(date) {
        const summaryDir = path.join(this.projectPath, 'ai-shared-context', 'summaries');
        if (!fs.existsSync(summaryDir)) {
            return 1;
        }

        const pattern = `summary-${date}-`;
        const files = fs.readdirSync(summaryDir)
            .filter(f => f.startsWith(pattern))
            .map(f => {
                const match = f.match(/summary-\d{4}-\d{2}-\d{2}-(\d+)\.md$/);
                return match ? parseInt(match[1]) : 0;
            })
            .filter(n => !isNaN(n));
        
        return files.length > 0 ? Math.max(...files) + 1 : 1;
    }

    createSummary(completedTasks, incompleteTasks, nextTasks, decisions, problems) {
        const now = new Date();
        const dateStr = this.getDateString(now);
        const sequence = this.getNextSummarySequence(dateStr);
        const filename = `summary-${dateStr}-${sequence.toString().padStart(3, '0')}.md`;
        const filepath = path.join(this.projectPath, 'ai-shared-context', 'summaries', filename);
        
        let content = `# 作業サマリー ${now.toISOString()}\n\n`;
        content += `**セッションID**: ${this.sessionId}\n`;
        content += `**作業時間**: ${this.getSessionDuration()}\n\n`;
        
        content += `## 完了事項\n`;
        completedTasks.forEach(task => {
            content += `- [x] ${task}\n`;
        });
        content += `\n`;
        
        content += `## 未完了事項\n`;
        incompleteTasks.forEach(task => {
            content += `- [ ] ${task.name}${task.reason ? ` (理由: ${task.reason})` : ''}\n`;
        });
        content += `\n`;
        
        content += `## 次回優先タスク\n`;
        nextTasks.forEach((task, index) => {
            content += `${index + 1}. ${task}\n`;
        });
        content += `\n`;
        
        if (decisions.length > 0) {
            content += `## 重要な決定事項\n`;
            decisions.forEach(decision => {
                content += `- ${decision}\n`;
            });
            content += `\n`;
        }
        
        if (problems.length > 0) {
            content += `## 発生した問題と解決策\n`;
            problems.forEach(problem => {
                content += `- **問題**: ${problem.issue}\n`;
                content += `  **解決**: ${problem.solution}\n`;
            });
            content += `\n`;
        }
        
        content += `## 環境情報\n`;
        content += `- プロジェクトパス: ${this.projectPath}\n`;
        content += `- Node.js: ${process.version}\n`;
        content += `- OS: ${process.platform}\n`;
        
        fs.writeFileSync(filepath, content, 'utf8');
        
        return filepath;
    }

    getSessionDuration() {
        const now = new Date();
        const duration = now - this.sessionStart;
        const hours = Math.floor(duration / 3600000);
        const minutes = Math.floor((duration % 3600000) / 60000);
        return `${hours}時間${minutes}分`;
    }

    loadPreviousSummary() {
        const summaryDir = path.join(this.projectPath, 'ai-shared-context', 'summaries');
        
        if (!fs.existsSync(summaryDir)) {
            return null;
        }
        
        const files = fs.readdirSync(summaryDir)
            .filter(f => f.startsWith('summary-'))
            .sort()
            .reverse();
        
        if (files.length === 0) {
            return null;
        }
        
        const latestFile = path.join(summaryDir, files[0]);
        return fs.readFileSync(latestFile, 'utf8');
    }
}

// CLIとして使用する場合
if (require.main === module) {
    const projectPath = process.argv[2] || process.cwd();
    const logger = new AIHistoryLogger(projectPath);
    
    // サンプル使用例
    logger.logInteraction(
        "テストを実行してください",
        "テストを実行します",
        [
            { type: "command", details: "npm test" },
            { type: "result", details: "30 tests passed" }
        ]
    );
    
    console.log('History logger initialized at:', projectPath);
    console.log('Session ID:', logger.sessionId);
}

module.exports = AIHistoryLogger;