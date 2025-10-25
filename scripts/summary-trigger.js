/**
 * Summary Trigger
 * 「まとめ」指示を検知して自動的にサマリー生成とファイル分割を実行
 */

const AIHistoryLogger = require('./ai-history-logger');
const AISummaryGenerator = require('./ai-summary-generator');
const AIConversationExtractor = require('./ai-conversation-extractor');
const fs = require('fs');
const path = require('path');

class SummaryTrigger {
    constructor(projectPath) {
        this.projectPath = projectPath;
        this.historyLogger = new AIHistoryLogger(projectPath);
        this.summaryGenerator = new AISummaryGenerator(projectPath);
        this.conversationExtractor = new AIConversationExtractor(projectPath);
        this.isWatching = false;
    }

    /**
     * 「まとめ」指示を検知
     */
    detectSummaryTrigger(userInput) {
        const triggers = [
            'まとめ',
            'サマリー', 
            'summary',
            '作業サマリー',
            '進捗まとめ',
            'セッション終了',
            'まとめてください',
            'まとめお願いします'
        ];

        const lowerInput = userInput.toLowerCase();
        return triggers.some(trigger => 
            lowerInput.includes(trigger.toLowerCase())
        );
    }

    /**
     * サマリー生成とファイル分割を実行
     */
    async executeSummary(currentTodoList = [], sessionData = {}) {
        console.log('📊 サマリー生成を開始...');

        try {
            // 1. 現在の履歴を保存
            const currentHistoryPath = this.historyLogger.saveIncremental();
            console.log(`📝 現在の履歴を保存: ${currentHistoryPath}`);

            // 2. サマリー生成
            const summary = this.summaryGenerator.generateSummary(currentTodoList, sessionData);
            const summaryPath = this.summaryGenerator.saveSummary(summary);
            console.log(`📋 サマリーを生成: ${summaryPath}`);

            // 3. 会話履歴をMarkdown形式でエクスポート
            const conversationPath = this.conversationExtractor.exportToMarkdown();
            if (conversationPath) {
                console.log(`💬 会話履歴をエクスポート: ${conversationPath}`);
            }

            // 4. 新しい履歴ファイルを開始
            const newHistoryFile = this.historyLogger.startNewHistoryFile();
            console.log(`🆕 新しい履歴ファイルを開始: ${newHistoryFile}`);

            // 5. 分析データ生成
            const analysis = this.conversationExtractor.analyzeConversations();
            if (analysis) {
                const analysisPath = path.join(
                    this.projectPath, 
                    'ai-shared-context', 
                    'summaries',
                    `analysis-${analysis.date}.json`
                );
                fs.writeFileSync(analysisPath, JSON.stringify(analysis, null, 2), 'utf8');
                console.log(`📊 分析データを生成: ${analysisPath}`);
            }

            return {
                success: true,
                files: {
                    history: currentHistoryPath,
                    summary: summaryPath,
                    conversation: conversationPath,
                    analysis: analysis ? analysisPath : null,
                    newHistory: newHistoryFile
                },
                analysis: analysis
            };

        } catch (error) {
            console.error('❌ サマリー生成中にエラーが発生:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * リアルタイム監視の開始
     */
    startWatching() {
        if (this.isWatching) {
            console.log('⚠️  既に監視中です');
            return;
        }

        console.log('👁️  リアルタイム監視を開始...');
        this.isWatching = true;

        // 環境監視開始
        this.conversationExtractor.startEnvironmentMonitoring();

        // ファイル監視（簡易版）
        this.watchForSummaryFiles();
    }

    stopWatching() {
        this.isWatching = false;
        console.log('🛑 監視を停止しました');
    }

    /**
     * サマリー関連ファイルの監視
     */
    watchForSummaryFiles() {
        const summaryDir = path.join(this.projectPath, 'ai-shared-context', 'summaries');
        
        if (!fs.existsSync(summaryDir)) {
            return;
        }

        fs.watch(summaryDir, (eventType, filename) => {
            if (filename && filename.startsWith('summary-')) {
                console.log(`📄 新しいサマリーファイルが作成されました: ${filename}`);
                this.onSummaryCreated(filename);
            }
        });
    }

    /**
     * サマリー作成時のコールバック
     */
    onSummaryCreated(filename) {
        const summaryPath = path.join(
            this.projectPath, 
            'ai-shared-context', 
            'summaries', 
            filename
        );

        // サマリーファイルから情報を抽出
        try {
            const content = fs.readFileSync(summaryPath, 'utf8');
            const completedTasks = this.extractCompletedTasks(content);
            const incompleteTasks = this.extractIncompleteTasks(content);

            console.log(`✅ 完了タスク: ${completedTasks.length}件`);
            console.log(`⏳ 未完了タスク: ${incompleteTasks.length}件`);

            // 次回の引き継ぎ情報を生成
            this.generateHandoverInfo(completedTasks, incompleteTasks);

        } catch (error) {
            console.error('サマリーファイルの解析に失敗:', error);
        }
    }

    extractCompletedTasks(content) {
        const lines = content.split('\n');
        const completedTasks = [];
        
        lines.forEach(line => {
            const match = line.match(/- \[x\] (.+)/);
            if (match) {
                completedTasks.push(match[1].trim());
            }
        });

        return completedTasks;
    }

    extractIncompleteTasks(content) {
        const lines = content.split('\n');
        const incompleteTasks = [];
        
        lines.forEach(line => {
            const match = line.match(/- \[ \] (.+)/);
            if (match) {
                incompleteTasks.push(match[1].trim());
            }
        });

        return incompleteTasks;
    }

    /**
     * 次回への引き継ぎ情報生成
     */
    generateHandoverInfo(completedTasks, incompleteTasks) {
        const handover = {
            timestamp: new Date().toISOString(),
            summary: {
                completed: completedTasks.length,
                incomplete: incompleteTasks.length,
                completionRate: completedTasks.length / (completedTasks.length + incompleteTasks.length) * 100
            },
            nextSession: {
                priorityTasks: incompleteTasks.slice(0, 3),
                recommendedActions: this.generateRecommendations(incompleteTasks)
            }
        };

        const handoverPath = path.join(
            this.projectPath,
            'ai-shared-context',
            'handover-info.json'
        );

        fs.writeFileSync(handoverPath, JSON.stringify(handover, null, 2), 'utf8');
        console.log(`🔄 引き継ぎ情報を生成: ${handoverPath}`);

        return handover;
    }

    generateRecommendations(incompleteTasks) {
        const recommendations = [];
        
        if (incompleteTasks.some(task => task.includes('テスト'))) {
            recommendations.push('テスト関連のタスクが残っています。テスト実行を優先してください。');
        }
        
        if (incompleteTasks.some(task => task.includes('カバレッジ'))) {
            recommendations.push('カバレッジ改善のタスクがあります。テストケースの追加を検討してください。');
        }
        
        if (incompleteTasks.some(task => task.includes('ドキュメント'))) {
            recommendations.push('ドキュメント作成が未完了です。作業記録の更新を忘れずに。');
        }

        return recommendations;
    }

    /**
     * 手動サマリー実行（CLI用）
     */
    async manualSummary(todoList = []) {
        console.log('🚀 手動サマリーを実行...');
        
        const sessionData = {
            manualTrigger: true,
            timestamp: new Date().toISOString()
        };

        return await this.executeSummary(todoList, sessionData);
    }
}

// CLI使用例
if (require.main === module) {
    const projectPath = process.argv[2] || process.cwd();
    const trigger = new SummaryTrigger(projectPath);
    
    const command = process.argv[3];
    
    if (command === 'watch') {
        trigger.startWatching();
        console.log('監視モードで実行中... Ctrl+Cで停止');
        process.on('SIGINT', () => {
            trigger.stopWatching();
            process.exit(0);
        });
    } else if (command === 'summary') {
        // 手動サマリー実行
        trigger.manualSummary().then(result => {
            console.log('サマリー実行結果:', result);
            process.exit(result.success ? 0 : 1);
        });
    } else {
        console.log('Usage: node summary-trigger.js [project-path] [watch|summary]');
        console.log('  watch   - 監視モードで実行');
        console.log('  summary - 手動でサマリーを実行');
    }
}

module.exports = SummaryTrigger;