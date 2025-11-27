# Language / 言語 / 语言
**[English](../en/installation.md)** | **[日本語](../ja/installation.md)** | **[简体中文](../zh-CN/installation.md)** | **[繁體中文](../zh-TW/installation.md)**

---

# Obsidian Multi Git Manager - 安装手册

## 📋 系统要求

### 必需条件
- **Obsidian**: 版本 1.0.0 或更高
- **操作系统**: Windows, macOS, Linux (仅桌面版)
- **Git**: 系统中已安装 Git
- **Node.js**: 仅开发/构建时需要

### 支持环境
- ✅ Windows 10/11
- ✅ macOS 10.15+
- ✅ Linux (Ubuntu, Fedora, Arch等)
- ❌ Obsidian 移动版 (不支持)

## 🚀 安装方法

### 方法1: 手动安装 (推荐)

#### 步骤 1: 构建插件
```bash
# 进入项目目录
cd D:\Project\2510_obsidianGit\obsidian-multi-git-plugin

# 安装依赖
npm install

# 构建插件
npm run build
```

#### 步骤 2: 确认插件文件
构建后，确认生成了以下文件：
```
obsidian-multi-git-plugin/
├── main.js          # ← 必需
├── manifest.json    # ← 必需
└── styles.css       # ← 必需
```

#### 步骤 3: 复制到 Obsidian 插件文件夹
```bash
# 确认 Obsidian 配置文件夹位置
# Windows: %APPDATA%\Obsidian\
# macOS: ~/Library/Application Support/obsidian/
# Linux: ~/.config/obsidian/

# 进入插件文件夹
cd "[YOUR_VAULT]/.obsidian/plugins/"

# 创建插件目录
mkdir multi-git-manager

# 复制必需文件
cp /path/to/obsidian-multi-git-plugin/main.js multi-git-manager/
cp /path/to/obsidian-multi-git-plugin/manifest.json multi-git-manager/
cp /path/to/obsidian-multi-git-plugin/styles.css multi-git-manager/
```

#### 步骤 4: 在 Obsidian 中启用插件
1. 打开 Obsidian
2. **设置** (⚙️) → **社区插件**
3. 开启 **社区插件**
4. 在 **已安装插件** 中找到「Multi Git Manager」
5. **启用** 插件

### 方法2: 开发者模式 (高级用户)

#### 步骤 1: 创建符号链接到插件文件夹
```bash
# 进入 Vault 的插件文件夹
cd "[YOUR_VAULT]/.obsidian/plugins/"

# 创建符号链接 (Windows)
mklink /D multi-git-manager "D:\Project\2510_obsidianGit\obsidian-multi-git-plugin"

# 创建符号链接 (macOS/Linux)
ln -s "/path/to/obsidian-multi-git-plugin" multi-git-manager
```

#### 步骤 2: 以开发模式运行
```bash
cd obsidian-multi-git-plugin

# 开发模式构建 (监视文件变化)
npm run dev
```

## 🔧 安装后配置

### 1. Git 检查
确认插件能够正常工作：
```bash
# 检查命令行中 Git 是否可用
git --version

# 检查在 Obsidian Vault 中能否执行 git status
cd "[YOUR_VAULT]"
git status
```

### 2. 初次设置
1. **重启 Obsidian**
2. 打开 **命令面板** (Ctrl/Cmd + P)
3. 输入「Git Manager」并执行 **Open Git Manager**
4. 确认显示 GitManager 视图

### 3. 功能确认
1. **状态栏** 显示「Git: X changes」
2. **功能区图标** (左侧栏) 显示 Git 图标
3. **命令面板** 中可使用以下命令：
   - Open Git Manager
   - Show Git Status
   - Git Commit
   - Git Push
   - Git Pull

## 🎯 可用功能

### 主要功能
| 功能 | 说明 | 访问方式 |
|------|------|-------------|
| **Git Manager View** | 所有仓库的统一管理界面 | 点击功能区图标 |
| **状态显示** | 实时显示修改文件数量 | 状态栏 |
| **批量提交** | 同时提交多个仓库 | 命令面板 |
| **Push/Pull** | 与远程仓库同步 | 命令面板 |
| **状态确认** | 详细的变更情况确认 | 命令面板 |

### 支持的仓库类型
- ✅ **主 Vault**: Obsidian Vault 本身
- ✅ **父目录**: Vault 外的项目根目录
- ✅ **子文件夹**: Vault 内的子项目

## 🔍 故障排除

### 常见问题

#### 1. 插件不显示
**原因**: 文件复制错误或权限问题
```bash
# 确认文件结构
ls -la "[YOUR_VAULT]/.obsidian/plugins/multi-git-manager/"

# 确认必需文件存在
# - main.js
# - manifest.json  
# - styles.css
```

**解决方法**:
1. 重新复制文件
2. 完全重启 Obsidian
3. 关闭社区插件后重新开启

#### 2. Git 命令无法执行
**原因**: Git 未设置在系统路径中

**解决方法**:
```bash
# 确认 Git 安装
git --version

# 如果路径未设置，配置环境变量
# Windows: 在系统环境变量中添加 Git 的 bin 文件夹
# macOS/Linux: 在 ~/.bashrc 或 ~/.zshrc 中添加路径
export PATH="/usr/local/git/bin:$PATH"
```

#### 3. 「not a git repository」错误
**原因**: Vault 或文件夹未初始化为 Git 仓库

**解决方法**:
```bash
# 在 Vault 中初始化 git
cd "[YOUR_VAULT]"
git init
git add .
git commit -m "Initial commit"
```

#### 4. 权限错误 (Linux/macOS)
**原因**: 文件权限不正确

**解决方法**:
```bash
# 修正权限
chmod 644 "[YOUR_VAULT]/.obsidian/plugins/multi-git-manager/main.js"
chmod 644 "[YOUR_VAULT]/.obsidian/plugins/multi-git-manager/manifest.json"
```

### 日志确认方法

#### 开发者工具调试
1. **在 Obsidian 中打开开发者工具**:
   - Windows/Linux: `Ctrl + Shift + I`
   - macOS: `Cmd + Option + I`

2. 在 **Console** 标签页确认错误日志:
```javascript
// 搜索插件相关日志
console.log("Multi Git Manager"); // 确认插件是否已加载
```

3. 在 **Network** 标签页确认文件加载错误

#### 启用插件日志
```javascript
// Obsidian 设置 → 高级设置 → 开发者模式 设为开启
// 控制台会输出详细日志
```

## 🔄 更新方法

### 手动更新
1. 获取最新插件代码
2. 执行构建:
```bash
cd obsidian-multi-git-plugin
git pull
npm run build
```
3. 将新的 `main.js` 复制到现有插件文件夹
4. 重启 Obsidian

### 使用开发者模式时
```bash
# 使用符号链接的情况
cd obsidian-multi-git-plugin
git pull
npm run build
# Obsidian 会自动加载新文件
```

## 🗑️ 卸载方法

1. 在 **Obsidian 设置** 中禁用插件
2. 删除插件文件夹:
```bash
rm -rf "[YOUR_VAULT]/.obsidian/plugins/multi-git-manager"
```
3. 重启 Obsidian

## 📞 技术支持

### 问题报告
- **GitHub Issues**: 在项目 Issues 中报告问题
- **日志文件**: 包含开发者工具 Console 日志
- **环境信息**: 记录 OS、Obsidian 版本、Git 版本

### 常见问题
问: **能在移动版 Obsidian 上使用吗？**
答: 不可以，此插件仅支持桌面版。

问: **可以在多个 Vault 中使用吗？**
答: 可以，需要在每个 Vault 中单独安装。

问: **会影响现有的 Git 工作流程吗？**
答: 不会，使用标准 Git 命令，与现有工作流程兼容。

---

**📝 如果此手册无法解决您的问题，请在项目 Issues 页面告知我们。**

*🤖 Created with Claude Code integration by Lean consultant Futaro (OfficeFutaro)*