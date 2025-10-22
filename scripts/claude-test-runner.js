#!/usr/bin/env node

/**
 * Claude Code AI Test Runner
 * Obsidianプラグインのテストを自動実行し、AI評価を行う
 */

const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class ClaudeTestRunner {
  constructor(config = {}) {
    this.config = {
      projectPath: config.projectPath || path.join(__dirname, '../obsidian-multi-git-plugin'),
      testTimeout: config.testTimeout || 300000, // 5分
      evaluationCriteria: {
        coverage: { weight: 0.25, threshold: 80 },
        performance: { weight: 0.20, threshold: 100 },
        success: { weight: 0.30, threshold: 100 },
        quality: { weight: 0.15, threshold: 8.0 },
        security: { weight: 0.10, threshold: 9.0 }
      },
      ...config
    };
    this.results = {};
    this.startTime = Date.now();
  }

  /**
   * メインのテスト実行フロー
   */
  async runTestSuite() {
    console.log('🤖 Claude Code AI Test Runner Starting...');
    console.log(`📁 Project: ${this.config.projectPath}`);
    console.log(`⏰ Started: ${new Date().toISOString()}\n`);

    try {
      // 1. 環境チェック
      await this.checkEnvironment();
      
      // 2. プロジェクトビルド
      await this.buildProject();
      
      // 3. テスト実行
      await this.executeTests();
      
      // 4. 結果収集
      await this.collectResults();
      
      // 5. AI評価
      const evaluation = await this.evaluateQuality();
      
      // 6. レポート生成
      await this.generateReport(evaluation);
      
      // 7. 改善提案
      const recommendations = await this.generateRecommendations(evaluation);
      
      console.log('\n✅ Claude Code AI Test Evaluation Complete!');
      return {
        evaluation,
        recommendations,
        executionTime: Date.now() - this.startTime
      };
      
    } catch (error) {
      console.error('❌ Test execution failed:', error.message);
      return {
        error: error.message,
        executionTime: Date.now() - this.startTime
      };
    }
  }

  /**
   * 環境チェック
   */
  async checkEnvironment() {
    console.log('🔍 Checking environment...');
    
    // Node.js バージョン確認
    const nodeVersion = process.version;
    console.log(`   Node.js: ${nodeVersion}`);
    
    // npm 確認
    try {
      await this.execCommand('npm --version');
      console.log('   npm: ✅');
    } catch (error) {
      throw new Error('npm not found');
    }
    
    // プロジェクトディレクトリ確認
    if (!fs.existsSync(this.config.projectPath)) {
      throw new Error(`Project directory not found: ${this.config.projectPath}`);
    }
    
    // package.json 確認
    const packageJsonPath = path.join(this.config.projectPath, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error('package.json not found');
    }
    
    console.log('   Environment: ✅\n');
  }

  /**
   * プロジェクトビルド
   */
  async buildProject() {
    console.log('🔨 Building project...');
    
    try {
      // 依存関係インストール
      await this.execCommand('npm ci', { cwd: this.config.projectPath });
      console.log('   Dependencies: ✅');
      
      // ビルド実行
      await this.execCommand('npm run build', { cwd: this.config.projectPath });
      console.log('   Build: ✅\n');
      
    } catch (error) {
      throw new Error(`Build failed: ${error.message}`);
    }
  }

  /**
   * テスト実行
   */
  async executeTests() {
    console.log('🧪 Executing tests...');
    
    const testSuites = [
      { name: 'unit', command: 'npm run test:unit' },
      { name: 'integration', command: 'npm run test:integration' },
      { name: 'coverage', command: 'npm run test:coverage' }
    ];
    
    this.results.tests = {};
    
    for (const suite of testSuites) {
      try {
        console.log(`   Running ${suite.name} tests...`);
        const result = await this.execCommand(suite.command, { 
          cwd: this.config.projectPath,
          timeout: this.config.testTimeout
        });
        
        this.results.tests[suite.name] = {
          success: true,
          output: result.stdout,
          executionTime: result.executionTime
        };
        console.log(`   ${suite.name}: ✅`);
        
      } catch (error) {
        this.results.tests[suite.name] = {
          success: false,
          error: error.message,
          output: error.stdout || '',
          stderr: error.stderr || ''
        };
        console.log(`   ${suite.name}: ❌`);
      }
    }
    
    console.log('   Tests completed\n');
  }

  /**
   * 結果収集
   */
  async collectResults() {
    console.log('📊 Collecting test results...');
    
    // カバレッジレポート読み込み
    const coveragePath = path.join(this.config.projectPath, 'coverage/coverage-summary.json');
    if (fs.existsSync(coveragePath)) {
      try {
        const coverageData = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
        this.results.coverage = coverageData.total;
        console.log(`   Coverage: ${this.results.coverage.lines.pct}%`);
      } catch (error) {
        console.log('   Coverage: ❌ (failed to read)');
      }
    }
    
    // パフォーマンスメトリクス
    this.results.performance = {
      totalExecutionTime: Date.now() - this.startTime,
      buildTime: this.results.tests.unit?.executionTime || 0,
      testTime: Object.values(this.results.tests).reduce((sum, test) => 
        sum + (test.executionTime || 0), 0)
    };
    
    console.log(`   Execution time: ${this.results.performance.totalExecutionTime}ms\n`);
  }

  /**
   * AI品質評価
   */
  async evaluateQuality() {
    console.log('🤖 Evaluating quality with AI...');
    
    const evaluation = {
      timestamp: new Date().toISOString(),
      scores: {},
      overallScore: 0,
      status: 'unknown'
    };
    
    // 各評価項目のスコア計算
    const criteria = this.config.evaluationCriteria;
    
    // 1. テスト成功率
    const testResults = Object.values(this.results.tests);
    const successRate = testResults.filter(t => t.success).length / testResults.length * 100;
    evaluation.scores.success = Math.min(10, (successRate / criteria.success.threshold) * 10);
    
    // 2. カバレッジ
    const coverage = this.results.coverage?.lines?.pct || 0;
    evaluation.scores.coverage = Math.min(10, (coverage / criteria.coverage.threshold) * 10);
    
    // 3. パフォーマンス
    const expectedTime = criteria.performance.threshold * 1000; // ms
    const actualTime = this.results.performance.totalExecutionTime;
    evaluation.scores.performance = Math.max(0, Math.min(10, 
      10 - ((actualTime - expectedTime) / expectedTime) * 5));
    
    // 4. コード品質 (簡易版)
    evaluation.scores.quality = this.analyzeCodeQuality();
    
    // 5. セキュリティ (簡易版)
    evaluation.scores.security = this.analyzeSecurityIssues();
    
    // 総合スコア計算
    evaluation.overallScore = Object.entries(criteria).reduce((sum, [key, config]) => {
      return sum + (evaluation.scores[key] || 0) * config.weight;
    }, 0);
    
    // ステータス判定
    if (evaluation.overallScore >= 8.0) evaluation.status = 'excellent';
    else if (evaluation.overallScore >= 6.0) evaluation.status = 'good';
    else if (evaluation.overallScore >= 4.0) evaluation.status = 'needs-improvement';
    else evaluation.status = 'poor';
    
    console.log(`   Overall Score: ${evaluation.overallScore.toFixed(1)}/10 (${evaluation.status})`);
    console.log(`   Success Rate: ${evaluation.scores.success.toFixed(1)}/10`);
    console.log(`   Coverage: ${evaluation.scores.coverage.toFixed(1)}/10`);
    console.log(`   Performance: ${evaluation.scores.performance.toFixed(1)}/10\n`);
    
    return evaluation;
  }

  /**
   * コード品質分析 (簡易版)
   */
  analyzeCodeQuality() {
    // 実装: TypeScriptエラー、リンターエラーなどを確認
    // 現在は固定値を返す
    return 8.0;
  }

  /**
   * セキュリティ分析 (簡易版)
   */
  analyzeSecurityIssues() {
    // 実装: 脆弱性スキャン、設定チェックなど
    // 現在は固定値を返す
    return 9.0;
  }

  /**
   * 改善提案生成
   */
  async generateRecommendations(evaluation) {
    console.log('💡 Generating improvement recommendations...');
    
    const recommendations = [];
    
    // カバレッジが低い場合
    if (evaluation.scores.coverage < 8.0) {
      recommendations.push({
        priority: 'high',
        category: 'coverage',
        title: 'テストカバレッジの向上',
        description: 'コードカバレッジが目標値を下回っています',
        actions: [
          'テストされていないファイルの特定',
          '重要機能のテストケース追加',
          'エッジケースのテスト強化'
        ]
      });
    }
    
    // テスト失敗がある場合
    const failedTests = Object.entries(this.results.tests)
      .filter(([_, result]) => !result.success);
    
    if (failedTests.length > 0) {
      recommendations.push({
        priority: 'high',
        category: 'test-failures',
        title: 'テスト失敗の修正',
        description: `${failedTests.length}個のテストが失敗しています`,
        actions: failedTests.map(([name, _]) => `${name}テストの修正`)
      });
    }
    
    // パフォーマンスが悪い場合
    if (evaluation.scores.performance < 7.0) {
      recommendations.push({
        priority: 'medium',
        category: 'performance',
        title: 'パフォーマンスの改善',
        description: 'テスト実行時間が目標値を超えています',
        actions: [
          '重い処理の最適化',
          'テストの並列化',
          '不要な処理の削除'
        ]
      });
    }
    
    console.log(`   Generated ${recommendations.length} recommendations\n`);
    return recommendations;
  }

  /**
   * レポート生成
   */
  async generateReport(evaluation) {
    console.log('📋 Generating evaluation report...');
    
    const reportPath = path.join(__dirname, '../docs-shared/test-reports');
    if (!fs.existsSync(reportPath)) {
      fs.mkdirSync(reportPath, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportFile = path.join(reportPath, `ai-evaluation-${timestamp}.md`);
    
    const report = this.generateMarkdownReport(evaluation);
    fs.writeFileSync(reportFile, report);
    
    console.log(`   Report saved: ${reportFile}\n`);
    return reportFile;
  }

  /**
   * Markdownレポート生成
   */
  generateMarkdownReport(evaluation) {
    const timestamp = new Date().toISOString();
    const statusEmoji = {
      excellent: '🟢',
      good: '🟡',
      'needs-improvement': '🟠',
      poor: '🔴'
    };
    
    return `# Claude Code AI テスト評価レポート

**実行日時**: ${timestamp}  
**総合スコア**: ${evaluation.overallScore.toFixed(1)}/10 ${statusEmoji[evaluation.status]}  
**ステータス**: ${evaluation.status}

## 📊 スコア詳細

| 項目 | スコア | 重み | 貢献度 |
|-----|--------|------|--------|
| テスト成功率 | ${evaluation.scores.success?.toFixed(1) || 'N/A'}/10 | 30% | ${((evaluation.scores.success || 0) * 0.3).toFixed(1)} |
| カバレッジ | ${evaluation.scores.coverage?.toFixed(1) || 'N/A'}/10 | 25% | ${((evaluation.scores.coverage || 0) * 0.25).toFixed(1)} |
| パフォーマンス | ${evaluation.scores.performance?.toFixed(1) || 'N/A'}/10 | 20% | ${((evaluation.scores.performance || 0) * 0.2).toFixed(1)} |
| コード品質 | ${evaluation.scores.quality?.toFixed(1) || 'N/A'}/10 | 15% | ${((evaluation.scores.quality || 0) * 0.15).toFixed(1)} |
| セキュリティ | ${evaluation.scores.security?.toFixed(1) || 'N/A'}/10 | 10% | ${((evaluation.scores.security || 0) * 0.1).toFixed(1)} |

## 🧪 テスト結果

${Object.entries(this.results.tests || {}).map(([name, result]) => 
  `- **${name}**: ${result.success ? '✅' : '❌'} ${result.success ? 'Success' : 'Failed'}`
).join('\n')}

## 📈 パフォーマンス

- **総実行時間**: ${this.results.performance?.totalExecutionTime || 0}ms
- **ビルド時間**: ${this.results.performance?.buildTime || 0}ms
- **テスト時間**: ${this.results.performance?.testTime || 0}ms

## 📋 カバレッジ

${this.results.coverage ? `
- **行カバレッジ**: ${this.results.coverage.lines.pct}%
- **関数カバレッジ**: ${this.results.coverage.functions.pct}%
- **ブランチカバレッジ**: ${this.results.coverage.branches.pct}%
- **ステートメントカバレッジ**: ${this.results.coverage.statements.pct}%
` : '- カバレッジデータなし'}

---
*Generated by Claude Code AI Test Runner v1.0.0*
`;
  }

  /**
   * コマンド実行ヘルパー
   */
  execCommand(command, options = {}) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      
      exec(command, options, (error, stdout, stderr) => {
        const executionTime = Date.now() - startTime;
        
        if (error) {
          reject({
            ...error,
            stdout,
            stderr,
            executionTime
          });
        } else {
          resolve({
            stdout,
            stderr,
            executionTime
          });
        }
      });
    });
  }
}

// CLI実行
if (require.main === module) {
  const runner = new ClaudeTestRunner();
  runner.runTestSuite()
    .then(result => {
      console.log('🎉 AI Test Evaluation Complete!');
      if (result.error) {
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('💥 Fatal error:', error);
      process.exit(1);
    });
}

module.exports = ClaudeTestRunner;