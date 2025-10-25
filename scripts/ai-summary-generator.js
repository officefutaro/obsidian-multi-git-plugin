/**
 * AI Summary Generator
 * セッション終了時に自動で作業サマリーを生成
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class AISummaryGenerator {
    constructor(projectPath) {
        this.projectPath = projectPath;
        this.summaryDir = path.join(projectPath, 'ai-shared-context', 'summaries');
        this.timestamp = new Date();
        this.currentDate = this.getDateString(new Date());
        
        this.ensureDirectories();
    }

    getDateString(date) {
        return date.toISOString().split('T')[0]; // YYYY-MM-DD形式
    }

    getNextSummarySequence(date) {
        const pattern = `summary-${date}-`;
        const files = fs.readdirSync(this.summaryDir)
            .filter(f => f.startsWith(pattern))
            .map(f => {
                const match = f.match(/summary-\d{4}-\d{2}-\d{2}-(\d+)\.md$/);
                return match ? parseInt(match[1]) : 0;
            })
            .filter(n => !isNaN(n));
        
        return files.length > 0 ? Math.max(...files) + 1 : 1;
    }

    ensureDirectories() {
        if (!fs.existsSync(this.summaryDir)) {
            fs.mkdirSync(this.summaryDir, { recursive: true });
        }
    }

    generateSummary(todoList, sessionData = {}) {
        const summary = {
            timestamp: this.timestamp.toISOString(),
            completed: [],
            incomplete: [],
            nextPriority: [],
            decisions: [],
            problems: [],
            learnings: [],
            environment: this.getEnvironmentInfo()
        };

        // TodoListから情報を抽出
        if (todoList && Array.isArray(todoList)) {
            todoList.forEach(item => {
                if (item.status === 'completed') {
                    summary.completed.push(item.content);
                } else if (item.status === 'in_progress' || item.status === 'pending') {
                    summary.incomplete.push({
                        task: item.content,
                        status: item.status,
                        reason: item.reason || '作業中'
                    });
                }
            });
        }

        // セッションデータを統合
        Object.assign(summary, sessionData);

        return this.formatSummary(summary);
    }

    formatSummary(summary) {
        const now = this.timestamp;
        const dateStr = now.toISOString().split('T')[0];
        const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-');
        
        let content = `# 作業サマリー ${dateStr} ${timeStr}\n\n`;
        content += `**生成日時**: ${now.toISOString()}\n`;
        content += `**プロジェクト**: ${path.basename(this.projectPath)}\n\n`;
        
        // 進捗状況
        const totalTasks = summary.completed.length + summary.incomplete.length;
        const completionRate = totalTasks > 0 
            ? Math.round((summary.completed.length / totalTasks) * 100) 
            : 0;
        
        content += `## 📊 進捗状況\n`;
        content += `- 完了タスク: ${summary.completed.length}件\n`;
        content += `- 未完了タスク: ${summary.incomplete.length}件\n`;
        content += `- 進捗率: ${completionRate}%\n\n`;
        
        // 完了事項
        content += `## ✅ 完了事項\n`;
        if (summary.completed.length > 0) {
            summary.completed.forEach(task => {
                content += `- [x] ${task}\n`;
            });
        } else {
            content += `- なし\n`;
        }
        content += `\n`;
        
        // 未完了事項
        content += `## ⏳ 未完了事項\n`;
        if (summary.incomplete.length > 0) {
            summary.incomplete.forEach(item => {
                content += `- [ ] ${item.task} (${item.status}: ${item.reason})\n`;
            });
        } else {
            content += `- なし\n`;
        }
        content += `\n`;
        
        // 次回優先タスク
        content += `## 🎯 次回優先タスク\n`;
        if (summary.nextPriority && summary.nextPriority.length > 0) {
            summary.nextPriority.forEach((task, index) => {
                content += `${index + 1}. ${task}\n`;
            });
        } else {
            // 未完了タスクから自動生成
            summary.incomplete.slice(0, 3).forEach((item, index) => {
                content += `${index + 1}. ${item.task}\n`;
            });
        }
        content += `\n`;
        
        // 重要な決定事項
        if (summary.decisions && summary.decisions.length > 0) {
            content += `## 💡 重要な決定事項\n`;
            summary.decisions.forEach(decision => {
                content += `- ${decision}\n`;
            });
            content += `\n`;
        }
        
        // 問題と解決策
        if (summary.problems && summary.problems.length > 0) {
            content += `## 🔧 発生した問題と解決策\n`;
            summary.problems.forEach((problem, index) => {
                content += `\n### 問題${index + 1}: ${problem.title || '未定義'}\n`;
                content += `- **症状**: ${problem.symptom}\n`;
                content += `- **原因**: ${problem.cause}\n`;
                content += `- **解決策**: ${problem.solution}\n`;
                content += `- **結果**: ${problem.result || '継続中'}\n`;
            });
            content += `\n`;
        }
        
        // 学習事項
        if (summary.learnings && summary.learnings.length > 0) {
            content += `## 📝 学習事項・知見\n`;
            summary.learnings.forEach(learning => {
                content += `- ${learning}\n`;
            });
            content += `\n`;
        }
        
        // 環境情報
        content += `## 🖥️ 環境情報\n`;
        content += `- **プロジェクトパス**: ${summary.environment.projectPath}\n`;
        content += `- **ブランチ**: ${summary.environment.gitBranch}\n`;
        content += `- **最終コミット**: ${summary.environment.lastCommit}\n`;
        content += `- **Node.js**: ${summary.environment.nodeVersion}\n`;
        content += `- **npm**: ${summary.environment.npmVersion}\n`;
        content += `- **OS**: ${summary.environment.platform}\n\n`;
        
        // チェックリスト
        content += `## 📋 次回開始時のチェックリスト\n`;
        content += `- [ ] 前回の未完了タスクを確認\n`;
        content += `- [ ] 環境の再セットアップが必要か確認\n`;
        content += `- [ ] 依存関係の更新確認\n`;
        content += `- [ ] テストの実行確認\n\n`;
        
        content += `---\n`;
        content += `*このサマリーは AI Summary Generator によって自動生成されました*\n`;
        content += `*生成日時: ${now.toISOString()}*`;
        
        return content;
    }

    getEnvironmentInfo() {
        const info = {
            projectPath: this.projectPath,
            nodeVersion: process.version,
            platform: process.platform,
            gitBranch: 'unknown',
            lastCommit: 'unknown',
            npmVersion: 'unknown'
        };

        try {
            // Git情報取得
            info.gitBranch = execSync('git branch --show-current', { 
                cwd: this.projectPath,
                encoding: 'utf8'
            }).trim();
            
            info.lastCommit = execSync('git rev-parse --short HEAD', {
                cwd: this.projectPath,
                encoding: 'utf8'
            }).trim();

            // npm バージョン
            info.npmVersion = execSync('npm -v', {
                encoding: 'utf8'
            }).trim();
        } catch (error) {
            // エラーは無視してデフォルト値を使用
        }

        return info;
    }

    saveSummary(content) {
        const dateStr = this.currentDate;
        const sequence = this.getNextSummarySequence(dateStr);
        const filename = `summary-${dateStr}-${sequence.toString().padStart(3, '0')}.md`;
        const filepath = path.join(this.summaryDir, filename);
        
        fs.writeFileSync(filepath, content, 'utf8');
        console.log(`Summary saved to: ${filepath}`);
        
        return filepath;
    }

    formatTimestamp(date) {
        return date.toISOString()
            .replace(/:/g, '-')
            .replace(/\./g, '-')
            .replace('T', '-')
            .slice(0, 19);
    }

    loadLatestSummary() {
        if (!fs.existsSync(this.summaryDir)) {
            return null;
        }

        const files = fs.readdirSync(this.summaryDir)
            .filter(f => f.startsWith('summary-') && f.endsWith('.md'))
            .sort()
            .reverse();
        
        if (files.length === 0) {
            return null;
        }
        
        const latestFile = path.join(this.summaryDir, files[0]);
        return fs.readFileSync(latestFile, 'utf8');
    }

    getTodaySummaries() {
        const today = this.currentDate;
        const pattern = `summary-${today}-`;
        
        if (!fs.existsSync(this.summaryDir)) {
            return [];
        }

        return fs.readdirSync(this.summaryDir)
            .filter(f => f.startsWith(pattern))
            .sort()
            .map(f => path.join(this.summaryDir, f));
    }
}

// CLI として使用
if (require.main === module) {
    const projectPath = process.argv[2] || process.cwd();
    const generator = new AISummaryGenerator(projectPath);
    
    // サンプルTodoList
    const sampleTodoList = [
        { content: 'テスト環境構築', status: 'completed' },
        { content: 'カバレッジ改善', status: 'in_progress', reason: '実装中' },
        { content: 'CI/CD設定', status: 'pending', reason: '未着手' }
    ];
    
    const summary = generator.generateSummary(sampleTodoList, {
        decisions: ['モック戦略の簡素化', 'AI履歴システムの導入'],
        problems: [{
            title: 'ItemView未定義エラー',
            symptom: 'テスト実行時にクラスが見つからない',
            cause: 'モックファイルの不足',
            solution: 'モッククラスを追加',
            result: '解決済み'
        }],
        learnings: ['Jestのモック設定タイミングが重要', 'カバレッジ向上には実装の調整が必要']
    });
    
    const filepath = generator.saveSummary(summary);
    console.log('Summary generated successfully!');
}

module.exports = AISummaryGenerator;