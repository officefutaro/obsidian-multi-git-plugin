# 🌳 Obsidian Multi Git Manager
### 🚀 Claude Code × Obsidian Optimized Plugin

> 🌐 **English** | [日本語](README.ja.md) | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md)

[![Claude Code Compatible](https://img.shields.io/badge/Claude_Code-Compatible-purple)](https://claude.ai)
[![Lean Method](https://img.shields.io/badge/Lean-Optimized-green)](https://lean.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Obsidian Plugin](https://img.shields.io/badge/Obsidian-Plugin-blueviolet)](https://obsidian.md/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

**A powerful Obsidian plugin optimized for Claude Code integration, managing multiple Git repositories efficiently**

## 🎯 Background - The Perfect Synergy of Claude Code × Obsidian

### 💡 Why This Plugin Was Created

**Lean Consultant Futaro (OfficeFutaro)** developed this plugin to solve real-world workflow challenges.

In the "Vibe Writing" methodology (AI-assisted document creation) using Claude Code, Obsidian's markdown files provide perfect compatibility. However, there was one problem:

#### 🔄 Typical Workflow
1. **Obsidian**: Building and managing knowledge bases
2. **Claude Code**: AI-assisted document creation and code generation
3. **Git**: Version control and backup

#### ❌ Previous Pain Points
- Claude Code project folders typically exist outside the Vault
- Managing multiple repositories was cumbersome (switching VSCode, CLI operations)
- Productivity loss due to context switching

#### ✅ This Plugin's Solution
**"Manage repositories outside the Vault within Obsidian"** - a revolutionary approach that optimizes your Claude Code workflow!

### 🏆 Lean Method Optimization
- **Eliminate Waste**: Reduce tool switching time
- **Streamline Flow**: Complete everything in one interface
- **Maximize Value**: Maintain uninterrupted thought flow

## ✨ Key Features

### 🔍 **Smart Repository Detection**
- **Vault itself**: When Obsidian Vault is a Git repository
- **Parent directory**: Project roots outside Vault (perfect for Claude Code projects)
- **Subfolders**: Individual projects within Vault

### 📊 **Real-time Monitoring**
- Status bar displays change count constantly
- Auto-refresh every 30 seconds
- Visual indicators for instant change awareness

### 🎛️ **Unified Management Interface**
- Git Manager View: Unified control panel for all repositories
- Batch operations: Simultaneous commit/push/pull for multiple repositories
- Selective execution: Target only necessary repositories

### ⚡ **Advanced Git Operations**
- **Commit**: Batch commits to multiple repositories
- **Push/Pull**: Selective remote synchronization
- **Status**: Detailed change status viewing
- **Branch info**: ahead/behind status display

## 🤝 Claude Code Integration Optimization

### 📁 Recommended Folder Structure
```
project-root/
├── obsidian-vault/          # Obsidian Vault (using this plugin)
│   ├── .obsidian/
│   ├── knowledge-base/
│   └── project-notes/
├── claude-projects/         # Claude Code project group
│   ├── project-a/          # Individual project (Git managed)
│   └── project-b/          # Individual project (Git managed)
└── shared-docs/            # Shared documents (Git managed)
```

### ⚡ Claude Code Optimization
- **CLAUDE.md support**: Auto-detection of project context files
- **Markdown integration**: Instant Git management of Claude-generated documents
- **AI-friendly**: Structured commit messages

## 🚀 Quick Start

### Installation

#### From Community Plugins (Recommended)
1. Open Obsidian
2. Settings → Community Plugins → Browse
3. Search for "Multi Git Manager"
4. Install → Enable

#### Manual Installation (For Developers)
For development environments or customization needs, please refer to [CONTRIBUTING.md](CONTRIBUTING.md).

### Basic Usage

1. **Check status**: View "Git: X changes" in status bar
2. **Management panel**: Click Git icon 🌳 in left sidebar
3. **Execute commands**: `Ctrl/Cmd + P` → `Git: [operation]`

## 💼 Practical Use Cases

### For Lean Consultants & Technical Writers
- **📝 Claude Code Integration**: Organize AI-assisted documents in Obsidian, manage with Git
- **🔄 Continuous Improvement**: Version control for PDCA documents
- **📊 Client Work**: Parallel management of multiple projects

### Concrete Efficiency Gains
- **Before**: Tool switching 5 min/time × 20 times/day = 100 min waste
- **After**: Unified Obsidian management reduces to 0 → **400 hours saved annually**

### Real-world Examples
- **Researchers**: Academic paper projects (multiple repository management)
- **Developers**: Technical notes + project code management
- **Writers**: Blog article management (draft → publish workflow)
- **Consultants**: Client project knowledge management

## 📖 Documentation

| Document | Content | Audience |
|----------|---------|----------|
| **[📋 Installation](docs/en/installation.md)** | Detailed installation guide | All users |
| **[🚀 Quick Start](docs/en/quick-start.md)** | 5-minute getting started | Beginners |
| **[📚 User Guide](docs/en/user-guide.md)** | Complete user guide | Intermediate+ |

## 🎯 System Requirements

### ✅ Supported Platforms
- **Windows** 10/11
- **macOS** 10.15+  
- **Linux** (Ubuntu, Fedora, Arch, etc.)

### ⚠️ Limitations
- **Desktop only** (Mobile Obsidian not supported)
- **Git required**: System must have Git installed

## 🤝 Contributing

### 🐛 Bug Reports
If you find an issue:
1. Check existing reports in **GitHub Issues**
2. Report with **reproduction steps**, **environment info**, **error logs**
3. Provide **minimal reproducible example** if possible

### 💡 Feature Requests
For new features:
1. Explain **specific use cases**
2. Clearly describe **expected behavior**
3. Include **alternatives** if available

### 🔧 Code Contributions
Pull Requests welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## 🔄 Roadmap

### 📅 Coming Soon
- [ ] **Settings Panel**: Repository exclusion, update interval configuration
- [ ] **Branch Management**: Switching and merge functions
- [ ] **Conflict Resolution**: Visual tools
- [ ] **Automation**: Time-based auto-commit

### 🚀 Future Vision
- [ ] **Deep Claude Code Integration**: CLAUDE.md auto-generation/updates
- [ ] **Team Collaboration**: Shared repository cooperation support
- [ ] **CI/CD Integration**: GitHub Actions connectivity

## 👨‍💻 About the Developer

**Futaro @ OfficeFutaro**
- 🎯 **Certified Lean Method Consultant**
- 📊 Extensive experience at major lean companies
- 🤖 AI workflow optimization specialist
- 📝 Creator of "Vibe Writing" methodology

### Services Offered
- 🔧 **Lean Consulting**: Business process optimization
- 🤝 **Claude Code Implementation**: AI-powered document creation efficiency
- 📚 **Obsidian Setup Support**: Knowledge management system design

## 💖 Support This Project

If this plugin contributes to your productivity, please consider supporting:

- ⭐ **GitHub Star** - Increase project visibility
- ☕ **Buy Me a Coffee** - Support continued development
- 💼 **Enterprise Consultation** - Customization and implementation services
- 📝 **Technical Consulting** - Git/Obsidian workflow optimization

## 📞 Support

### 🆘 Need Help?
- **📚 Documentation**: Start with [User Guide](docs/en/user-guide.md)
- **💬 Issues**: Ask questions at [GitHub Issues](https://github.com/officefutaro/obsidian-multi-git-plugin/issues)
- **🔧 Discussions**: Share usage tips and ideas at [Discussions](https://github.com/officefutaro/obsidian-multi-git-plugin/discussions)

### 📧 Contact
- **Email**: [contact@officefutaro.com](mailto:contact@officefutaro.com)
- **LinkedIn**: [linkedin.com/in/futaro](https://linkedin.com/in/futaro)
- **Twitter**: [@officefutaro](https://twitter.com/officefutaro)

## 📄 License

**MIT License** - Free to use, modify, and distribute.

---

<div align="center">

**🌳 Multi Git Manager**

*Optimizing Claude Code × Obsidian Workflow*

*Crafted with precision by [OfficeFutaro](https://officefutaro.com)*
*Empowering knowledge workers with efficient tools*

[![Twitter Follow](https://img.shields.io/twitter/follow/officefutaro?style=social)](https://twitter.com/officefutaro)
[![GitHub followers](https://img.shields.io/github/followers/officefutaro?style=social)](https://github.com/officefutaro)

**🎉 Eliminate waste and maximize value with Lean methodology!**

</div>