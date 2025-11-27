# 🌳 Obsidian Multi Git Manager
### 🚀 Claude Code × Obsidian 优化插件

> 🌐 [English](README.md) | [日本語](README.ja.md) | **简体中文** | [繁體中文](README.zh-TW.md)

[![Claude Code Compatible](https://img.shields.io/badge/Claude_Code-Compatible-purple)](https://claude.ai)
[![Lean Method](https://img.shields.io/badge/Lean-Optimized-green)](https://lean.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Obsidian Plugin](https://img.shields.io/badge/Obsidian-Plugin-blueviolet)](https://obsidian.md/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

**为 Claude Code 集成优化的强大 Obsidian 插件，高效管理多个 Git 仓库**

## 🎯 背景 - Claude Code × Obsidian 的完美协同

### 💡 插件创建的原因

**精益咨询师 Futaro (OfficeFutaro)** 开发了这个插件来解决实际工作流程中的挑战。

在使用 Claude Code 进行"氛围写作"方法论（AI 辅助文档创建）时，Obsidian 的 markdown 文件提供了完美的兼容性。然而，存在一个问题：

#### 🔄 典型工作流程
1. **Obsidian**：构建和管理知识库
2. **Claude Code**：AI 辅助文档创建和代码生成
3. **Git**：版本控制和备份

#### ❌ 以前的痛点
- Claude Code 项目文件夹通常存在于 Vault 之外
- 管理多个仓库很麻烦（切换 VSCode、CLI 操作）
- 由于上下文切换导致生产力损失

#### ✅ 本插件的解决方案
**"在 Obsidian 内管理 Vault 外的仓库"** - 一种优化 Claude Code 工作流程的革命性方法！

### 🏆 精益方法优化
- **消除浪费**：减少工具切换时间
- **简化流程**：在一个界面中完成所有操作
- **最大化价值**：保持不间断的思维流

## ✨ 核心功能

### 🔍 **智能仓库检测**
- **Vault 本身**：当 Obsidian Vault 是 Git 仓库时
- **父目录**：Vault 外的项目根目录（完美适配 Claude Code 项目）
- **子文件夹**：Vault 内的单个项目

### 📊 **实时监控**
- 状态栏持续显示变更数量
- 每 30 秒自动刷新
- 视觉指示器提供即时变更感知

### 🎛️ **统一管理界面**
- Git Manager View：所有仓库的统一控制面板
- 批量操作：同时对多个仓库进行提交/推送/拉取
- 选择性执行：仅针对必要的仓库

### ⚡ **高级 Git 操作**
- **提交**：批量提交到多个仓库
- **推送/拉取**：选择性远程同步
- **状态**：详细变更状态查看
- **分支信息**：ahead/behind 状态显示

## 🤝 Claude Code 集成优化

### 📁 推荐文件夹结构
```
project-root/
├── obsidian-vault/          # Obsidian Vault（使用本插件）
│   ├── .obsidian/
│   ├── knowledge-base/
│   └── project-notes/
├── claude-projects/         # Claude Code 项目组
│   ├── project-a/          # 单个项目（Git 管理）
│   └── project-b/          # 单个项目（Git 管理）
└── shared-docs/            # 共享文档（Git 管理）
```

### ⚡ Claude Code 优化
- **CLAUDE.md 支持**：自动检测项目上下文文件
- **Markdown 集成**：即时 Git 管理 Claude 生成的文档
- **AI 友好**：结构化提交消息

## 🚀 快速开始

### 安装

#### 从社区插件安装（推荐）
1. 打开 Obsidian
2. 设置 → 社区插件 → 浏览
3. 搜索 "Multi Git Manager"
4. 安装 → 启用

#### 手动安装（开发者）
对于开发环境或自定义需求，请参考 [CONTRIBUTING.md](CONTRIBUTING.md)。

### 基本使用

1. **检查状态**：在状态栏查看 "Git: X changes"
2. **管理面板**：点击左侧边栏的 Git 图标 🌳
3. **执行命令**：`Ctrl/Cmd + P` → `Git: [操作]`

## 💼 实际使用案例

### 面向精益咨询师和技术写作者
- **📝 Claude Code 集成**：在 Obsidian 中整理 AI 辅助文档，用 Git 管理
- **🔄 持续改进**：PDCA 文档的版本控制
- **📊 客户工作**：多个项目的并行管理

### 具体效率提升
- **之前**：工具切换 5 分钟/次 × 20 次/天 = 100 分钟浪费
- **之后**：统一 Obsidian 管理减少到 0 → **年节省 400 小时**

### 实际应用示例
- **研究人员**：学术论文项目（多仓库管理）
- **开发者**：技术笔记 + 项目代码管理
- **写作者**：博客文章管理（草稿 → 发布工作流）
- **咨询师**：客户项目知识管理

## 📖 文档

| 文档 | 内容 | 受众 |
|------|------|------|
| **[📋 安装指南](docs/zh-CN/installation.md)** | 详细安装指南 | 所有用户 |
| **[🚀 快速开始](docs/zh-CN/quick-start.md)** | 5 分钟入门 | 初学者 |
| **[📚 用户指南](docs/zh-CN/user-guide.md)** | 完整用户指南 | 中级+ |

## 🎯 系统要求

### ✅ 支持的平台
- **Windows** 10/11
- **macOS** 10.15+  
- **Linux**（Ubuntu、Fedora、Arch 等）

### ⚠️ 限制
- **仅限桌面端**（不支持移动端 Obsidian）
- **需要 Git**：系统必须安装 Git

## 🤝 贡献

### 🐛 错误报告
如果发现问题：
1. 检查 **GitHub Issues** 中的现有报告
2. 提供**重现步骤**、**环境信息**、**错误日志**进行报告
3. 如可能，提供**最小可重现示例**

### 💡 功能请求
对于新功能：
1. 解释**具体使用案例**
2. 清楚描述**预期行为**
3. 如果可用，包含**替代方案**

### 🔧 代码贡献
欢迎 Pull Request！详情请参阅 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 🔄 路线图

### 📅 即将推出
- [ ] **设置面板**：仓库排除、更新间隔配置
- [ ] **分支管理**：切换和合并功能
- [ ] **冲突解决**：可视化工具
- [ ] **自动化**：基于时间的自动提交

### 🚀 未来愿景
- [ ] **深度 Claude Code 集成**：CLAUDE.md 自动生成/更新
- [ ] **团队协作**：共享仓库协作支持
- [ ] **CI/CD 集成**：GitHub Actions 连接

## 👨‍💻 关于开发者

**Futaro @ OfficeFutaro**
- 🎯 **认证精益方法咨询师**
- 📊 在大型精益企业的丰富经验
- 🤖 AI 工作流程优化专家
- 📝 "氛围写作"方法论创建者

### 提供的服务
- 🔧 **精益咨询**：业务流程优化
- 🤝 **Claude Code 实施**：AI 驱动的文档创建效率
- 📚 **Obsidian 设置支持**：知识管理系统设计

## 💖 支持本项目

如果本插件对您的生产力有所贡献，请考虑支持：

- ⭐ **GitHub Star** - 提高项目知名度
- ☕ **Buy Me a Coffee** - 支持持续开发
- 💼 **企业咨询** - 定制和实施服务
- 📝 **技术咨询** - Git/Obsidian 工作流程优化

## 📞 支持

### 🆘 需要帮助？
- **📚 文档**：从[用户指南](docs/zh-CN/user-guide.md)开始
- **💬 问题**：在 [GitHub Issues](https://github.com/officefutaro/obsidian-multi-git-plugin/issues) 提问
- **🔧 讨论**：在 [Discussions](https://github.com/officefutaro/obsidian-multi-git-plugin/discussions) 分享使用技巧和想法

### 📧 联系方式
- **Email**：[contact@officefutaro.com](mailto:contact@officefutaro.com)
- **LinkedIn**：[linkedin.com/in/futaro](https://linkedin.com/in/futaro)
- **Twitter**：[@officefutaro](https://twitter.com/officefutaro)

## 📄 许可证

**MIT License** - 可自由使用、修改和分发。

---

<div align="center">

**🌳 Multi Git Manager**

*优化 Claude Code × Obsidian 工作流程*

*由 [OfficeFutaro](https://officefutaro.com) 精心打造*
*用高效工具赋能知识工作者*

[![Twitter Follow](https://img.shields.io/twitter/follow/officefutaro?style=social)](https://twitter.com/officefutaro)
[![GitHub followers](https://img.shields.io/github/followers/officefutaro?style=social)](https://github.com/officefutaro)

**🎉 用精益方法论消除浪费，最大化价值！**

</div>