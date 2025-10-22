#!/usr/bin/env node

/**
 * AI Test Scheduler
 * Claude Codeによる定期的なテスト実行とモニタリング
 */

const ClaudeTestRunner = require('./claude-test-runner');
const fs = require('fs');
const path = require('path');

class AITestScheduler {
  constructor(config = {}) {
    this.config = {
      interval: config.interval || 3600000, // 1時間
      maxRetries: config.maxRetries || 3,
      alertThreshold: config.alertThreshold || 6.0, // スコア閾値
      reportDir: config.reportDir || path.join(__dirname, '../docs-shared/test-reports'),
      ...config
    };
    
    this.isRunning = false;
    this.lastExecution = null;
    this.executionHistory = [];
    this.runner = new ClaudeTestRunner();
  }

  /**
   * スケジューラー開始
   */
  start() {
    console.log('⚡ Starting AI Test Scheduler...');
    console.log(`📅 Interval: ${this.config.interval / 1000}s`);
    console.log(`🚨 Alert threshold: ${this.config.alertThreshold}/10\n`);
    
    this.isRunning = true;
    this.scheduleNext();
  }

  /**
   * スケジューラー停止
   */
  stop() {
    console.log('⏹️ Stopping AI Test Scheduler...');
    this.isRunning = false;
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  /**
   * 次回実行をスケジュール
   */
  scheduleNext() {
    if (!this.isRunning) return;
    
    console.log(`⏰ Next execution scheduled in ${this.config.interval / 1000}s`);
    
    this.timer = setTimeout(async () => {
      await this.executeWithRetry();
      this.scheduleNext();
    }, this.config.interval);
  }

  /**
   * リトライ付きテスト実行
   */
  async executeWithRetry() {
    let retries = 0;
    let lastError;
    
    while (retries < this.config.maxRetries) {
      try {
        console.log(`\n🚀 Executing scheduled AI test (attempt ${retries + 1}/${this.config.maxRetries})`);
        
        const result = await this.runner.runTestSuite();
        
        if (result.error) {
          throw new Error(result.error);
        }
        
        // 実行履歴に記録
        this.recordExecution(result);
        
        // アラート判定
        await this.checkAlerts(result);
        
        // 傾向分析
        await this.analyzeTrends();
        
        console.log('✅ Scheduled execution completed successfully\n');
        return result;
        
      } catch (error) {
        lastError = error;
        retries++;
        console.error(`❌ Execution failed (attempt ${retries}): ${error.message}`);
        
        if (retries < this.config.maxRetries) {
          console.log(`⏳ Retrying in 30 seconds...`);
          await this.sleep(30000);
        }
      }
    }
    
    console.error(`💥 All retry attempts failed. Last error: ${lastError.message}`);
    await this.sendFailureAlert(lastError);
  }

  /**
   * 実行結果を履歴に記録
   */
  recordExecution(result) {
    const execution = {
      timestamp: new Date().toISOString(),
      score: result.evaluation?.overallScore || 0,
      status: result.evaluation?.status || 'unknown',
      executionTime: result.executionTime,
      recommendations: result.recommendations?.length || 0
    };
    
    this.executionHistory.push(execution);
    this.lastExecution = execution;
    
    // 履歴は最新50件まで保持
    if (this.executionHistory.length > 50) {
      this.executionHistory = this.executionHistory.slice(-50);
    }
    
    // ファイルに保存
    this.saveHistory();
  }

  /**
   * アラート判定
   */
  async checkAlerts(result) {
    if (!result.evaluation) return;
    
    const score = result.evaluation.overallScore;
    
    if (score < this.config.alertThreshold) {
      console.log(`🚨 ALERT: Quality score below threshold (${score.toFixed(1)} < ${this.config.alertThreshold})`);
      await this.sendQualityAlert(result);
    }
    
    // 連続して品質が低下している場合
    const recentExecutions = this.executionHistory.slice(-3);
    if (recentExecutions.length >= 3) {
      const allBelowThreshold = recentExecutions.every(exec => exec.score < this.config.alertThreshold);
      if (allBelowThreshold) {
        console.log('🚨 CRITICAL: Quality degradation detected in last 3 executions');
        await this.sendCriticalAlert(recentExecutions);
      }
    }
  }

  /**
   * 傾向分析
   */
  async analyzeTrends() {
    if (this.executionHistory.length < 5) return;
    
    console.log('📈 Analyzing quality trends...');
    
    const recent = this.executionHistory.slice(-10);
    const scores = recent.map(exec => exec.score);
    
    // 平均スコア
    const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    
    // トレンド (線形回帰の簡易版)
    const trend = this.calculateTrend(scores);
    
    console.log(`   Average score (last 10): ${avgScore.toFixed(1)}/10`);
    console.log(`   Trend: ${trend > 0 ? '📈 Improving' : trend < 0 ? '📉 Declining' : '➡️ Stable'}`);
    
    // トレンドレポート生成
    await this.generateTrendReport(recent, avgScore, trend);
  }

  /**
   * トレンド計算
   */
  calculateTrend(scores) {
    const n = scores.length;
    if (n < 2) return 0;
    
    const sumX = n * (n - 1) / 2;
    const sumY = scores.reduce((sum, score) => sum + score, 0);
    const sumXY = scores.reduce((sum, score, index) => sum + score * index, 0);
    const sumX2 = n * (n - 1) * (2 * n - 1) / 6;
    
    return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  }

  /**
   * 品質アラート送信
   */
  async sendQualityAlert(result) {
    const alertMessage = {
      type: 'quality_alert',
      timestamp: new Date().toISOString(),
      score: result.evaluation.overallScore,
      threshold: this.config.alertThreshold,
      recommendations: result.recommendations.length,
      message: `Quality score ${result.evaluation.overallScore.toFixed(1)} is below threshold ${this.config.alertThreshold}`
    };
    
    await this.saveAlert(alertMessage);
    console.log('📧 Quality alert saved');
  }

  /**
   * クリティカルアラート送信
   */
  async sendCriticalAlert(recentExecutions) {
    const alertMessage = {
      type: 'critical_alert',
      timestamp: new Date().toISOString(),
      executions: recentExecutions,
      message: 'Quality degradation detected in multiple consecutive executions'
    };
    
    await this.saveAlert(alertMessage);
    console.log('🚨 Critical alert saved');
  }

  /**
   * 実行失敗アラート送信
   */
  async sendFailureAlert(error) {
    const alertMessage = {
      type: 'execution_failure',
      timestamp: new Date().toISOString(),
      error: error.message,
      retries: this.config.maxRetries,
      message: 'Test execution failed after all retry attempts'
    };
    
    await this.saveAlert(alertMessage);
    console.log('💥 Failure alert saved');
  }

  /**
   * アラート保存
   */
  async saveAlert(alert) {
    const alertDir = path.join(this.config.reportDir, 'alerts');
    if (!fs.existsSync(alertDir)) {
      fs.mkdirSync(alertDir, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const alertFile = path.join(alertDir, `alert-${alert.type}-${timestamp}.json`);
    
    fs.writeFileSync(alertFile, JSON.stringify(alert, null, 2));
  }

  /**
   * 履歴保存
   */
  saveHistory() {
    const historyFile = path.join(this.config.reportDir, 'execution-history.json');
    fs.writeFileSync(historyFile, JSON.stringify({
      lastUpdate: new Date().toISOString(),
      executions: this.executionHistory
    }, null, 2));
  }

  /**
   * トレンドレポート生成
   */
  async generateTrendReport(recent, avgScore, trend) {
    const reportDir = path.join(this.config.reportDir, 'trends');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportFile = path.join(reportDir, `trend-report-${timestamp}.md`);
    
    const report = `# 品質トレンドレポート

**生成日時**: ${new Date().toISOString()}  
**対象期間**: 最新${recent.length}回の実行

## 📊 サマリー

- **平均スコア**: ${avgScore.toFixed(1)}/10
- **トレンド**: ${trend > 0 ? '📈 改善中' : trend < 0 ? '📉 悪化中' : '➡️ 安定'}
- **実行回数**: ${recent.length}

## 📈 実行履歴

| 実行日時 | スコア | ステータス | 実行時間 | 改善提案数 |
|----------|--------|------------|----------|------------|
${recent.map(exec => 
  `| ${exec.timestamp} | ${exec.score.toFixed(1)}/10 | ${exec.status} | ${exec.executionTime}ms | ${exec.recommendations} |`
).join('\n')}

## 🎯 推奨アクション

${trend < -0.1 ? `
- ⚠️ **品質悪化**: 連続して品質が低下しています
- 🔍 最近の変更を確認してください
- 🧪 テストケースの見直しが必要です
` : trend > 0.1 ? `
- ✅ **品質改善**: 良い傾向です
- 🚀 この調子で品質向上を継続してください
` : `
- ➡️ **安定状態**: 品質は安定しています
- 📈 さらなる改善の余地を探してください
`}

---
*Generated by AI Test Scheduler v1.0.0*
`;
    
    fs.writeFileSync(reportFile, report);
    console.log(`   Trend report saved: ${reportFile}`);
  }

  /**
   * スリープ
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 統計情報取得
   */
  getStats() {
    return {
      isRunning: this.isRunning,
      lastExecution: this.lastExecution,
      totalExecutions: this.executionHistory.length,
      averageScore: this.executionHistory.length > 0 
        ? this.executionHistory.reduce((sum, exec) => sum + exec.score, 0) / this.executionHistory.length 
        : 0,
      config: this.config
    };
  }
}

// CLI実行
if (require.main === module) {
  const scheduler = new AITestScheduler({
    interval: process.env.AI_TEST_INTERVAL || 3600000, // デフォルト1時間
    alertThreshold: parseFloat(process.env.AI_ALERT_THRESHOLD) || 6.0
  });
  
  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Received SIGINT, stopping scheduler...');
    scheduler.stop();
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.log('\n🛑 Received SIGTERM, stopping scheduler...');
    scheduler.stop();
    process.exit(0);
  });
  
  scheduler.start();
}

module.exports = AITestScheduler;