/**
 * AI Conversation Extractor
 * AIとの会話履歴を自動取得・整理する機能
 * 
 * 注意: Claude Code環境では直接的な会話履歴APIは提供されていないため、
 * ログベースでの履歴管理を行います
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

class AIConversationExtractor {
    constructor(projectPath) {
        this.projectPath = projectPath;
        this.logDir = path.join(projectPath, 'ai-shared-context', 'conversation-logs');
        this.tempDir = path.join(projectPath, 'ai-shared-context', 'temp');
        
        this.ensureDirectories();
    }

    ensureDirectories() {
        const dirs = [this.logDir, this.tempDir];
        dirs.forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });
    }

    /**
     * 会話履歴をキャプチャするためのプロキシメソッド
     * AIとのやり取りを記録
     */
    captureConversation(userInput, aiResponse, metadata = {}) {
        const conversation = {
            timestamp: new Date().toISOString(),
            sessionId: metadata.sessionId || 'unknown',
            user: {
                content: userInput,
                timestamp: new Date().toISOString()
            },
            assistant: {
                content: aiResponse,
                timestamp: new Date().toISOString(),
                model: metadata.model || 'claude',
                usage: metadata.usage || {}
            },
            context: {
                projectPath: this.projectPath,
                workingDirectory: process.cwd(),
                nodeVersion: process.version,
                platform: process.platform
            }
        };

        this.saveConversation(conversation);
        return conversation;
    }

    saveConversation(conversation) {
        const date = conversation.timestamp.split('T')[0];
        const logFile = path.join(this.logDir, `conversation-${date}.jsonl`);
        
        // JSONL形式で保存（1行1会話）
        const line = JSON.stringify(conversation) + '\n';
        fs.appendFileSync(logFile, line, 'utf8');
    }

    /**
     * 会話履歴を読み込み
     */
    loadConversations(date = null, limit = 100) {
        const targetDate = date || new Date().toISOString().split('T')[0];
        const logFile = path.join(this.logDir, `conversation-${targetDate}.jsonl`);
        
        if (!fs.existsSync(logFile)) {
            return [];
        }

        const lines = fs.readFileSync(logFile, 'utf8')
            .split('\n')
            .filter(line => line.trim())
            .slice(-limit);

        return lines.map(line => {
            try {
                return JSON.parse(line);
            } catch (error) {
                console.warn('Invalid JSON line:', line);
                return null;
            }
        }).filter(conv => conv !== null);
    }

    /**
     * 会話履歴をMarkdown形式でエクスポート
     */
    exportToMarkdown(date = null, outputPath = null) {
        const conversations = this.loadConversations(date);
        const targetDate = date || new Date().toISOString().split('T')[0];
        
        if (conversations.length === 0) {
            return null;
        }

        let markdown = `# AI会話履歴 - ${targetDate}\n\n`;
        markdown += `**総会話数**: ${conversations.length}\n`;
        markdown += `**生成日時**: ${new Date().toISOString()}\n\n`;

        conversations.forEach((conv, index) => {
            const time = new Date(conv.timestamp).toLocaleTimeString();
            markdown += `## 会話 #${index + 1} (${time})\n\n`;
            markdown += `### Human:\n${conv.user.content}\n\n`;
            markdown += `### Assistant:\n${conv.assistant.content}\n\n`;
            
            if (conv.assistant.usage && Object.keys(conv.assistant.usage).length > 0) {
                markdown += `**使用量**: ${JSON.stringify(conv.assistant.usage)}\n\n`;
            }
            
            markdown += '---\n\n';
        });

        const defaultPath = path.join(this.projectPath, 'ai-shared-context', 'history', 
            `extracted-conversation-${targetDate}.md`);
        const savePath = outputPath || defaultPath;
        
        fs.writeFileSync(savePath, markdown, 'utf8');
        console.log(`会話履歴をエクスポート: ${savePath}`);
        
        return savePath;
    }

    /**
     * 環境監視による自動キャプチャ
     * ファイル変更やコマンド実行を監視して会話を推測
     */
    startEnvironmentMonitoring() {
        console.log('環境監視を開始...');
        
        // ファイル変更監視
        this.watchProjectFiles();
        
        // プロセス監視（簡易版）
        this.logEnvironmentChanges();
    }

    watchProjectFiles() {
        const watchTargets = [
            path.join(this.projectPath, 'src'),
            path.join(this.projectPath, 'tests'),
            path.join(this.projectPath, 'scripts')
        ];

        watchTargets.forEach(target => {
            if (fs.existsSync(target)) {
                fs.watch(target, { recursive: true }, (eventType, filename) => {
                    if (filename && !filename.includes('node_modules')) {
                        this.logFileChange(eventType, filename, target);
                    }
                });
            }
        });
    }

    logFileChange(eventType, filename, directory) {
        const change = {
            timestamp: new Date().toISOString(),
            type: 'file_change',
            event: eventType,
            file: filename,
            directory: directory,
            fullPath: path.join(directory, filename)
        };

        const logFile = path.join(this.tempDir, 'environment-changes.jsonl');
        fs.appendFileSync(logFile, JSON.stringify(change) + '\n', 'utf8');
    }

    logEnvironmentChanges() {
        // 定期的に環境状態をログ
        setInterval(() => {
            const state = {
                timestamp: new Date().toISOString(),
                type: 'environment_state',
                cwd: process.cwd(),
                memory: process.memoryUsage(),
                uptime: process.uptime()
            };

            const logFile = path.join(this.tempDir, 'environment-state.jsonl');
            fs.appendFileSync(logFile, JSON.stringify(state) + '\n', 'utf8');
        }, 300000); // 5分毎
    }

    /**
     * 過去の履歴から学習データを生成
     */
    generateTrainingData(startDate, endDate) {
        const trainingData = [];
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split('T')[0];
            const conversations = this.loadConversations(dateStr);
            
            conversations.forEach(conv => {
                trainingData.push({
                    input: conv.user.content,
                    output: conv.assistant.content,
                    metadata: {
                        date: dateStr,
                        project: path.basename(this.projectPath),
                        context: conv.context
                    }
                });
            });
        }

        const outputFile = path.join(this.projectPath, 'ai-shared-context', 
            `training-data-${startDate}-to-${endDate}.json`);
        fs.writeFileSync(outputFile, JSON.stringify(trainingData, null, 2), 'utf8');
        
        return outputFile;
    }

    /**
     * 会話の分析とサマリー生成
     */
    analyzeConversations(date = null) {
        const conversations = this.loadConversations(date);
        
        if (conversations.length === 0) {
            return null;
        }

        const analysis = {
            date: date || new Date().toISOString().split('T')[0],
            totalConversations: conversations.length,
            userMessages: conversations.length,
            assistantResponses: conversations.length,
            averageResponseLength: 0,
            commonTopics: [],
            timeRange: {
                start: conversations[0]?.timestamp,
                end: conversations[conversations.length - 1]?.timestamp
            }
        };

        // 平均レスポンス長計算
        const totalLength = conversations.reduce((sum, conv) => 
            sum + conv.assistant.content.length, 0);
        analysis.averageResponseLength = Math.round(totalLength / conversations.length);

        // 頻出キーワード抽出（簡易版）
        const allText = conversations
            .map(conv => conv.user.content + ' ' + conv.assistant.content)
            .join(' ')
            .toLowerCase();
        
        const keywords = allText.match(/\b\w{4,}\b/g) || [];
        const frequency = {};
        keywords.forEach(word => {
            frequency[word] = (frequency[word] || 0) + 1;
        });
        
        analysis.commonTopics = Object.entries(frequency)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .map(([word, count]) => ({ word, count }));

        return analysis;
    }
}

// CLI使用例
if (require.main === module) {
    const projectPath = process.argv[2] || process.cwd();
    const extractor = new AIConversationExtractor(projectPath);
    
    // サンプル会話を記録
    extractor.captureConversation(
        "テストを実行してください",
        "テストを実行します。npm testコマンドを使用します。",
        { sessionId: 'sample-001', model: 'claude-sonnet-4' }
    );
    
    // 履歴をMarkdownでエクスポート
    extractor.exportToMarkdown();
    
    // 分析実行
    const analysis = extractor.analyzeConversations();
    console.log('会話分析結果:', analysis);
    
    console.log('AI Conversation Extractor initialized');
}

module.exports = AIConversationExtractor;