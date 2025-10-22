#!/usr/bin/env node

/**
 * AI Test Dashboard
 * Claude Codeのテスト結果をダッシュボード形式で表示
 */

const fs = require('fs');
const path = require('path');

class AITestDashboard {
  constructor(config = {}) {
    this.config = {
      reportDir: config.reportDir || path.join(__dirname, '../docs-shared/test-reports'),
      historyFile: config.historyFile || 'execution-history.json',
      ...config
    };
  }

  /**
   * ダッシュボード表示
   */
  async displayDashboard() {
    console.clear();
    this.printHeader();
    
    try {
      const data = await this.loadData();
      
      this.printOverview(data);
      this.printRecentExecutions(data);
      this.printQualityTrends(data);
      this.printAlerts(data);
      this.printActions();
      
    } catch (error) {
      console.error('❌ Error loading dashboard data:', error.message);
    }
  }

  /**
   * ヘッダー表示
   */
  printHeader() {
    const timestamp = new Date().toLocaleString();
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║                   🤖 Claude Code AI Test Dashboard          ║');
    console.log('║                     Obsidian Plugin Quality Monitor         ║');
    console.log('╚══════════════════════════════════════════════════════════════╝');
    console.log(`📅 Last Updated: ${timestamp}\n`);
  }

  /**
   * データ読み込み
   */
  async loadData() {
    const historyPath = path.join(this.config.reportDir, this.config.historyFile);
    
    let history = { executions: [] };
    if (fs.existsSync(historyPath)) {
      history = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
    }
    
    // アラート読み込み
    const alertsDir = path.join(this.config.reportDir, 'alerts');
    let alerts = [];
    if (fs.existsSync(alertsDir)) {
      const alertFiles = fs.readdirSync(alertsDir)
        .filter(file => file.endsWith('.json'))
        .sort()
        .slice(-10); // 最新10件
      
      alerts = alertFiles.map(file => {
        const alertPath = path.join(alertsDir, file);
        return JSON.parse(fs.readFileSync(alertPath, 'utf8'));
      });
    }
    
    return { history, alerts };
  }

  /**
   * 概要表示
   */
  printOverview(data) {
    const executions = data.history.executions || [];
    
    if (executions.length === 0) {
      console.log('📊 OVERVIEW');
      console.log('══════════');
      console.log('No execution data available. Run your first AI test!\n');
      return;
    }
    
    const latest = executions[executions.length - 1];
    const avgScore = executions.reduce((sum, exec) => sum + exec.score, 0) / executions.length;
    const trend = this.calculateTrend(executions.slice(-5).map(e => e.score));
    
    const statusEmoji = {
      excellent: '🟢',
      good: '🟡',
      'needs-improvement': '🟠',
      poor: '🔴',
      unknown: '⚪'
    };
    
    console.log('📊 OVERVIEW');
    console.log('══════════');
    console.log(`🎯 Latest Score:     ${latest.score.toFixed(1)}/10 ${statusEmoji[latest.status]}`);
    console.log(`📈 Average Score:    ${avgScore.toFixed(1)}/10`);
    console.log(`📊 Total Executions: ${executions.length}`);
    console.log(`📅 Last Execution:   ${new Date(latest.timestamp).toLocaleString()}`);
    console.log(`📈 Trend:           ${this.getTrendDisplay(trend)}`);
    console.log('');
  }

  /**
   * 最近の実行結果表示
   */
  printRecentExecutions(data) {
    const executions = data.history.executions || [];
    const recent = executions.slice(-5).reverse();
    
    if (recent.length === 0) return;
    
    console.log('🕐 RECENT EXECUTIONS');
    console.log('══════════════════');
    console.log('Time                Score   Status              Duration  Recommendations');
    console.log('─────────────────────────────────────────────────────────────────────────');
    
    recent.forEach(exec => {
      const time = new Date(exec.timestamp).toLocaleTimeString();
      const score = exec.score.toFixed(1).padStart(4);
      const status = exec.status.padEnd(18);
      const duration = `${exec.executionTime}ms`.padEnd(8);
      const recommendations = exec.recommendations.toString().padStart(2);
      
      console.log(`${time}     ${score}/10  ${status}  ${duration}  ${recommendations}`);
    });
    console.log('');
  }

  /**
   * 品質トレンド表示
   */
  printQualityTrends(data) {
    const executions = data.history.executions || [];
    
    if (executions.length < 3) return;
    
    const recent = executions.slice(-10);
    const scores = recent.map(e => e.score);
    
    console.log('📈 QUALITY TRENDS (Last 10 executions)');
    console.log('═══════════════════════════════════════');
    
    // ASCII グラフ
    const maxScore = 10;
    const graphWidth = 50;
    
    scores.forEach((score, index) => {
      const barLength = Math.round((score / maxScore) * graphWidth);
      const bar = '█'.repeat(barLength) + '░'.repeat(graphWidth - barLength);
      const execNum = `#${executions.length - recent.length + index + 1}`.padEnd(4);
      
      console.log(`${execNum} ${bar} ${score.toFixed(1)}/10`);
    });
    
    // 統計
    const min = Math.min(...scores);
    const max = Math.max(...scores);
    const avg = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    
    console.log('');
    console.log(`📊 Min: ${min.toFixed(1)}  Max: ${max.toFixed(1)}  Avg: ${avg.toFixed(1)}`);
    console.log('');
  }

  /**
   * アラート表示
   */
  printAlerts(data) {
    if (data.alerts.length === 0) {
      console.log('🔔 ALERTS');
      console.log('════════');
      console.log('✅ No active alerts\n');
      return;
    }
    
    console.log('🚨 ALERTS');
    console.log('════════');
    
    data.alerts.slice(-5).forEach(alert => {
      const time = new Date(alert.timestamp).toLocaleString();
      const typeEmoji = {
        quality_alert: '⚠️',
        critical_alert: '🚨',
        execution_failure: '💥'
      };
      
      console.log(`${typeEmoji[alert.type] || '📢'} ${time}`);
      console.log(`   ${alert.message}`);
      
      if (alert.score) {
        console.log(`   Score: ${alert.score.toFixed(1)}/10 (threshold: ${alert.threshold})`);
      }
      
      console.log('');
    });
  }

  /**
   * アクション表示
   */
  printActions() {
    console.log('🎮 ACTIONS');
    console.log('═════════');
    console.log('1. Run immediate test:     npm run test:ai');
    console.log('2. Start scheduler:        node scripts/ai-test-scheduler.js');
    console.log('3. View full reports:      ls docs-shared/test-reports/');
    console.log('4. Check test coverage:    npm run test:coverage');
    console.log('5. Refresh dashboard:      node scripts/ai-test-dashboard.js');
    console.log('');
    console.log('Press Ctrl+C to exit');
  }

  /**
   * トレンド計算
   */
  calculateTrend(scores) {
    if (scores.length < 2) return 0;
    
    const n = scores.length;
    const sumX = n * (n - 1) / 2;
    const sumY = scores.reduce((sum, score) => sum + score, 0);
    const sumXY = scores.reduce((sum, score, index) => sum + score * index, 0);
    const sumX2 = n * (n - 1) * (2 * n - 1) / 6;
    
    return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  }

  /**
   * トレンド表示
   */
  getTrendDisplay(trend) {
    if (trend > 0.1) return '📈 Improving (Good!)';
    if (trend < -0.1) return '📉 Declining (Attention needed)';
    return '➡️ Stable';
  }

  /**
   * ウォッチモード
   */
  async watchMode() {
    console.log('👁️ Starting dashboard watch mode...');
    console.log('Refreshing every 30 seconds. Press Ctrl+C to exit.\n');
    
    const refresh = async () => {
      await this.displayDashboard();
      console.log('⏰ Auto-refresh in 30 seconds...');
    };
    
    await refresh();
    
    this.watchInterval = setInterval(refresh, 30000);
    
    // Graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n👋 Stopping dashboard watch mode...');
      if (this.watchInterval) {
        clearInterval(this.watchInterval);
      }
      process.exit(0);
    });
  }

  /**
   * 詳細レポート生成
   */
  async generateDetailedReport() {
    const data = await this.loadData();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportPath = path.join(this.config.reportDir, `dashboard-report-${timestamp}.md`);
    
    const executions = data.history.executions || [];
    const latest = executions[executions.length - 1];
    const avgScore = executions.length > 0 
      ? executions.reduce((sum, exec) => sum + exec.score, 0) / executions.length 
      : 0;
    
    const report = `# Claude Code AI Test Dashboard Report

**Generated**: ${new Date().toISOString()}  
**Report Period**: ${executions.length} total executions

## 📊 Executive Summary

- **Current Quality Score**: ${latest?.score.toFixed(1) || 'N/A'}/10
- **Average Score**: ${avgScore.toFixed(1)}/10
- **Total Executions**: ${executions.length}
- **Alert Count**: ${data.alerts.length}

## 📈 Quality Metrics

### Score Distribution
${this.generateScoreDistribution(executions)}

### Recent Performance
${this.generatePerformanceTable(executions.slice(-10))}

## 🚨 Alert Summary

${data.alerts.length > 0 ? 
  data.alerts.map(alert => `- **${alert.type}**: ${alert.message} (${new Date(alert.timestamp).toLocaleString()})`).join('\n') :
  'No alerts recorded'
}

## 💡 Recommendations

${this.generateRecommendations(executions, data.alerts)}

---
*Generated by Claude Code AI Test Dashboard v1.0.0*
`;
    
    fs.writeFileSync(reportPath, report);
    console.log(`📋 Detailed report saved: ${reportPath}`);
    return reportPath;
  }

  /**
   * スコア分布生成
   */
  generateScoreDistribution(executions) {
    if (executions.length === 0) return 'No data available';
    
    const ranges = [
      { min: 9, max: 10, label: 'Excellent (9-10)' },
      { min: 7, max: 9, label: 'Good (7-9)' },
      { min: 5, max: 7, label: 'Fair (5-7)' },
      { min: 0, max: 5, label: 'Poor (0-5)' }
    ];
    
    return ranges.map(range => {
      const count = executions.filter(exec => 
        exec.score >= range.min && exec.score < range.max
      ).length;
      const percentage = ((count / executions.length) * 100).toFixed(1);
      return `- ${range.label}: ${count} (${percentage}%)`;
    }).join('\n');
  }

  /**
   * パフォーマンステーブル生成
   */
  generatePerformanceTable(executions) {
    if (executions.length === 0) return 'No recent data available';
    
    const header = '| Date | Score | Status | Duration | Recommendations |';
    const separator = '|------|-------|--------|----------|----------------|';
    const rows = executions.map(exec => {
      const date = new Date(exec.timestamp).toLocaleDateString();
      return `| ${date} | ${exec.score.toFixed(1)}/10 | ${exec.status} | ${exec.executionTime}ms | ${exec.recommendations} |`;
    });
    
    return [header, separator, ...rows].join('\n');
  }

  /**
   * 推奨事項生成
   */
  generateRecommendations(executions, alerts) {
    const recommendations = [];
    
    if (executions.length === 0) {
      recommendations.push('- Run your first AI test to establish baseline quality metrics');
      return recommendations.join('\n');
    }
    
    const latest = executions[executions.length - 1];
    const avgScore = executions.reduce((sum, exec) => sum + exec.score, 0) / executions.length;
    
    if (latest.score < 6.0) {
      recommendations.push('- 🔴 **Immediate Action**: Current quality score is below acceptable threshold');
      recommendations.push('- Review and address failed tests immediately');
    }
    
    if (avgScore < 7.0) {
      recommendations.push('- 🟡 **Medium Priority**: Average quality score needs improvement');
      recommendations.push('- Consider implementing additional test coverage');
    }
    
    if (alerts.length > 5) {
      recommendations.push('- 🚨 **High Priority**: Multiple alerts detected');
      recommendations.push('- Review alert patterns and address root causes');
    }
    
    const recentTrend = this.calculateTrend(executions.slice(-5).map(e => e.score));
    if (recentTrend < -0.1) {
      recommendations.push('- 📉 **Trend Alert**: Quality declining in recent executions');
      recommendations.push('- Investigate recent changes and their impact');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('- ✅ **Good Status**: Continue current testing practices');
      recommendations.push('- Consider setting up automated scheduling for continuous monitoring');
    }
    
    return recommendations.join('\n');
  }
}

// CLI実行
if (require.main === module) {
  const dashboard = new AITestDashboard();
  
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case 'watch':
      dashboard.watchMode();
      break;
    case 'report':
      dashboard.generateDetailedReport()
        .then(reportPath => console.log(`Report generated: ${reportPath}`))
        .catch(error => console.error('Error generating report:', error));
      break;
    default:
      dashboard.displayDashboard();
      break;
  }
}

module.exports = AITestDashboard;