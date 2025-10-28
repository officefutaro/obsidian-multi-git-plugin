const { Plugin, Notice, Modal, Setting, PluginSettingTab } = require('obsidian');
const { exec } = require('child_process');
const path = require('path');

const DEFAULT_SETTINGS = {
    autoDetect: true,
    showStatusBar: true,
    refreshInterval: 30
};

class MultiGitPlugin extends Plugin {
    async onload() {
        console.log('Loading Obsidian Multi-Git Plugin v1.0.0');
        
        await this.loadSettings();
        
        // Add ribbon icon
        this.addRibbonIcon('git-branch', 'Git Repository Manager', () => {
            new GitRepositoryManagerModal(this.app, this).open();
        });
        
        // Add commands
        this.addCommand({
            id: 'show-git-manager',
            name: 'Show Git Repository Manager',
            callback: () => {
                new GitRepositoryManagerModal(this.app, this).open();
            }
        });
        
        // Add settings tab
        this.addSettingTab(new MultiGitSettingTab(this.app, this));
        
        // Status bar
        if (this.settings.showStatusBar) {
            this.statusBarItem = this.addStatusBarItem();
            this.updateStatusBar();
        }
        
        // Auto refresh
        this.startAutoRefresh();
    }
    
    onunload() {
        console.log('Unloading Obsidian Multi-Git Plugin');
        this.stopAutoRefresh();
    }
    
    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }
    
    async saveSettings() {
        await this.saveData(this.settings);
    }
    
    async detectRepositories() {
        const repositories = [];
        const fs = require('fs').promises;
        
        const vaultPath = this.app.vault.adapter.basePath;
        const parentPath = path.dirname(vaultPath);
        
        // 1. Check Parent Directory first
        if (await this.isGitRepository(parentPath)) {
            repositories.push({
                name: 'Parent (Claude Code)',
                path: parentPath,
                isParent: true
            });
        }
        
        // 2. Check Vault Directory
        const vaultIsGit = await this.isGitRepository(vaultPath);
        if (vaultIsGit) {
            repositories.push({
                name: 'Vault',
                path: vaultPath,
                isParent: false
            });
        }
        
        // 3. Check subdirectories ONLY if Vault is NOT a Git repository
        if (!vaultIsGit) {
            try {
                const entries = await fs.readdir(vaultPath, { withFileTypes: true });
                
                for (const entry of entries) {
                    // Skip hidden directories (starting with .)
                    if (entry.isDirectory() && !entry.name.startsWith('.')) {
                        const subPath = path.join(vaultPath, entry.name);
                        
                        // Check if this subdirectory is a Git repository
                        if (await this.isGitRepository(subPath)) {
                            repositories.push({
                                name: `Vault/${entry.name}`,
                                path: subPath,
                                isParent: false
                            });
                        }
                    }
                }
            } catch (error) {
                console.error('Error scanning subdirectories:', error);
            }
        } else {
            // Special case: Check for specific known subdirectories that might be separate repos
            // This handles cases like Ayumu/Novels where Novels is a separate repo
            const knownSubRepos = ['Novels', 'Projects', 'Plugins'];
            
            try {
                for (const subName of knownSubRepos) {
                    const subPath = path.join(vaultPath, subName);
                    
                    // Check if directory exists and is a Git repository
                    try {
                        const stat = await fs.stat(subPath);
                        if (stat.isDirectory() && await this.isGitRepository(subPath)) {
                            // Only add if it has its own .git directory
                            const gitPath = path.join(subPath, '.git');
                            try {
                                await fs.stat(gitPath);
                                repositories.push({
                                    name: `Vault/${subName}`,
                                    path: subPath,
                                    isParent: false
                                });
                            } catch (e) {
                                // .git doesn't exist, skip
                            }
                        }
                    } catch (e) {
                        // Directory doesn't exist, skip
                    }
                }
            } catch (error) {
                console.error('Error checking known subdirectories:', error);
            }
        }
        
        return repositories;
    }
    
    async isGitRepository(dirPath) {
        try {
            await this.executeGitCommand(dirPath, 'git rev-parse --git-dir');
            return true;
        } catch (error) {
            return false;
        }
    }
    
    async getGitStatus(repoPath) {
        try {
            const [statusOutput, branchOutput, aheadBehindOutput] = await Promise.all([
                this.executeGitCommand(repoPath, 'git status --porcelain'),
                this.executeGitCommand(repoPath, 'git branch --show-current'),
                this.executeGitCommand(repoPath, 'git rev-list --left-right --count HEAD...@{upstream}').catch(() => '0\t0')
            ]);
            
            const statusLines = statusOutput.trim().split('\n').filter(line => line);
            const modified = statusLines.filter(line => line.startsWith(' M')).length;
            const added = statusLines.filter(line => line.startsWith('A') || line.startsWith('??')).length;
            const deleted = statusLines.filter(line => line.startsWith(' D')).length;
            const branch = branchOutput.trim();
            
            const [ahead, behind] = aheadBehindOutput.trim().split('\t').map(n => parseInt(n) || 0);
            
            return {
                modified,
                added,
                deleted,
                branch,
                ahead,
                behind,
                totalChanges: modified + added + deleted
            };
        } catch (error) {
            return {
                modified: 0,
                added: 0,
                deleted: 0,
                branch: 'unknown',
                ahead: 0,
                behind: 0,
                totalChanges: 0,
                error: error.message
            };
        }
    }
    
    executeGitCommand(repoPath, command) {
        return new Promise((resolve, reject) => {
            exec(command, { cwd: repoPath }, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(stdout);
                }
            });
        });
    }
    
    async commitRepository(repoPath, message) {
        try {
            await this.executeGitCommand(repoPath, 'git add -A');
            await this.executeGitCommand(repoPath, `git commit -m "${message}"`);
            new Notice('✅ Commit successful');
        } catch (error) {
            new Notice(`❌ Commit failed: ${error.message}`);
            throw error;
        }
    }
    
    async pushRepository(repoPath) {
        try {
            await this.executeGitCommand(repoPath, 'git push');
            new Notice('✅ Push successful');
        } catch (error) {
            new Notice(`❌ Push failed: ${error.message}`);
            throw error;
        }
    }
    
    async pullRepository(repoPath) {
        try {
            await this.executeGitCommand(repoPath, 'git pull');
            new Notice('✅ Pull successful');
        } catch (error) {
            new Notice(`❌ Pull failed: ${error.message}`);
            throw error;
        }
    }
    
    startAutoRefresh() {
        this.stopAutoRefresh();
        this.refreshInterval = window.setInterval(
            () => this.updateStatusBar(),
            this.settings.refreshInterval * 1000
        );
    }
    
    stopAutoRefresh() {
        if (this.refreshInterval) {
            window.clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }
    
    async updateStatusBar() {
        if (!this.statusBarItem) return;
        
        try {
            const repositories = await this.detectRepositories();
            let totalChanges = 0;
            
            for (const repo of repositories) {
                const status = await this.getGitStatus(repo.path);
                totalChanges += status.totalChanges;
            }
            
            this.statusBarItem.setText(`Git: ${totalChanges} changes`);
        } catch (error) {
            this.statusBarItem.setText('Git: Error');
        }
    }
}

class GitRepositoryManagerModal extends Modal {
    constructor(app, plugin) {
        super(app);
        this.plugin = plugin;
        this.repositories = [];
        // Add custom class to modal for styling
        this.modalEl.addClass('git-repository-manager-modal');
    }
    
    async onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        
        // Title
        contentEl.createEl('h1', { text: 'Git Repository Manager', cls: 'git-manager-title' });
        
        // Refresh button
        const refreshContainer = contentEl.createEl('div', { cls: 'git-refresh-container' });
        const refreshBtn = refreshContainer.createEl('button', { 
            text: '🔄 Refresh',
            cls: 'git-refresh-button'
        });
        refreshBtn.onclick = () => this.refreshRepositories();
        
        // Action buttons
        const actionContainer = contentEl.createEl('div', { cls: 'git-action-container' });
        
        const commitAllBtn = actionContainer.createEl('button', { 
            text: '📝 Commit All',
            cls: 'git-action-button git-commit-all'
        });
        commitAllBtn.onclick = () => this.commitAll();
        
        const pushAllBtn = actionContainer.createEl('button', { 
            text: '⬆️ Push All',
            cls: 'git-action-button git-push-all'
        });
        pushAllBtn.onclick = () => this.pushAll();
        
        const pullAllBtn = actionContainer.createEl('button', { 
            text: '⬇️ Pull All',
            cls: 'git-action-button git-pull-all'
        });
        pullAllBtn.onclick = () => this.pullAll();
        
        // Repository container
        this.repoContainer = contentEl.createEl('div', { cls: 'git-repo-container' });
        
        // Load repositories
        await this.refreshRepositories();
    }
    
    async refreshRepositories() {
        this.repositories = await this.plugin.detectRepositories();
        this.renderRepositories();
    }
    
    async renderRepositories() {
        this.repoContainer.empty();
        
        for (const repo of this.repositories) {
            const status = await this.plugin.getGitStatus(repo.path);
            this.renderRepository(repo, status);
        }
        
        // If no repositories found, show message
        if (this.repositories.length === 0) {
            this.repoContainer.createEl('p', { 
                text: 'No Git repositories detected.',
                cls: 'git-no-repos-message'
            });
        }
    }
    
    renderRepository(repo, status) {
        const repoEl = this.repoContainer.createEl('div', { cls: 'git-repo-item' });
        
        // Repository header
        const headerEl = repoEl.createEl('div', { cls: 'git-repo-header' });
        headerEl.createEl('h3', { text: repo.name, cls: 'git-repo-name' });
        
        // Full path display with horizontal scroll
        const pathContainer = headerEl.createEl('div', { cls: 'git-repo-path-container' });
        const pathEl = pathContainer.createEl('div', { 
            text: repo.path, 
            cls: 'git-repo-path',
            attr: { title: repo.path } 
        });
        
        // Branch info
        const branchEl = repoEl.createEl('div', { cls: 'git-branch-info' });
        branchEl.createEl('span', { text: `🌿 ${status.branch}`, cls: 'git-branch' });
        
        if (status.ahead > 0) {
            branchEl.createEl('span', { text: `↑${status.ahead}`, cls: 'git-ahead' });
        }
        if (status.behind > 0) {
            branchEl.createEl('span', { text: `↓${status.behind}`, cls: 'git-behind' });
        }
        
        // Status info
        const statusEl = repoEl.createEl('div', { cls: 'git-status-info' });
        
        if (status.modified > 0) {
            statusEl.createEl('span', { 
                text: `📝 ${status.modified} modified`, 
                cls: 'git-status git-modified' 
            });
        }
        
        if (status.added > 0) {
            statusEl.createEl('span', { 
                text: `➕ ${status.added} added`, 
                cls: 'git-status git-added' 
            });
        }
        
        if (status.deleted > 0) {
            statusEl.createEl('span', { 
                text: `🗑️ ${status.deleted} deleted`, 
                cls: 'git-status git-deleted' 
            });
        }
        
        if (status.totalChanges === 0) {
            statusEl.createEl('span', { 
                text: '✅ Clean', 
                cls: 'git-status git-clean' 
            });
        }
        
        // Action buttons
        const actionsEl = repoEl.createEl('div', { cls: 'git-repo-actions' });
        
        const commitBtn = actionsEl.createEl('button', { 
            text: '📝 Commit',
            cls: 'git-repo-button'
        });
        commitBtn.onclick = () => this.commitRepository(repo);
        
        const pushBtn = actionsEl.createEl('button', { 
            text: '⬆️ Push',
            cls: 'git-repo-button'
        });
        pushBtn.onclick = () => this.pushRepository(repo);
        
        const pullBtn = actionsEl.createEl('button', { 
            text: '⬇️ Pull',
            cls: 'git-repo-button'
        });
        pullBtn.onclick = () => this.pullRepository(repo);
    }
    
    async commitRepository(repo) {
        const message = prompt('Enter commit message:', 'Auto commit from Obsidian');
        if (message) {
            try {
                await this.plugin.commitRepository(repo.path, message);
                await this.refreshRepositories();
            } catch (error) {
                // Error already handled in plugin
            }
        }
    }
    
    async pushRepository(repo) {
        try {
            await this.plugin.pushRepository(repo.path);
            await this.refreshRepositories();
        } catch (error) {
            // Error already handled in plugin
        }
    }
    
    async pullRepository(repo) {
        try {
            await this.plugin.pullRepository(repo.path);
            await this.refreshRepositories();
        } catch (error) {
            // Error already handled in plugin
        }
    }
    
    async commitAll() {
        const message = prompt('Enter commit message for all repositories:', 'Auto commit from Obsidian');
        if (message) {
            for (const repo of this.repositories) {
                try {
                    await this.plugin.commitRepository(repo.path, message);
                } catch (error) {
                    // Continue with next repository
                }
            }
            await this.refreshRepositories();
        }
    }
    
    async pushAll() {
        for (const repo of this.repositories) {
            try {
                await this.plugin.pushRepository(repo.path);
            } catch (error) {
                // Continue with next repository
            }
        }
        await this.refreshRepositories();
    }
    
    async pullAll() {
        for (const repo of this.repositories) {
            try {
                await this.plugin.pullRepository(repo.path);
            } catch (error) {
                // Continue with next repository
            }
        }
        await this.refreshRepositories();
    }
    
    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

class MultiGitSettingTab extends PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    
    display() {
        const { containerEl } = this;
        containerEl.empty();
        
        containerEl.createEl('h2', { text: 'Multi-Git Plugin Settings' });
        
        new Setting(containerEl)
            .setName('Auto-detect repositories')
            .setDesc('Automatically detect Git repositories')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.autoDetect)
                .onChange(async (value) => {
                    this.plugin.settings.autoDetect = value;
                    await this.plugin.saveSettings();
                }));
        
        new Setting(containerEl)
            .setName('Show status bar')
            .setDesc('Show Git status in status bar')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.showStatusBar)
                .onChange(async (value) => {
                    this.plugin.settings.showStatusBar = value;
                    await this.plugin.saveSettings();
                }));
        
        new Setting(containerEl)
            .setName('Refresh interval')
            .setDesc('Status refresh interval in seconds')
            .addText(text => text
                .setPlaceholder('30')
                .setValue(String(this.plugin.settings.refreshInterval))
                .onChange(async (value) => {
                    const interval = parseInt(value);
                    if (!isNaN(interval) && interval > 0) {
                        this.plugin.settings.refreshInterval = interval;
                        await this.plugin.saveSettings();
                        this.plugin.startAutoRefresh();
                    }
                }));
    }
}

module.exports = MultiGitPlugin;