const { Plugin, Notice, Modal, Setting, PluginSettingTab } = require('obsidian');
const { exec } = require('child_process');
const path = require('path');

const DEFAULT_SETTINGS = {
    repositories: [],
    autoSync: false,
    syncInterval: 10,
    showStatusBar: true,
    commitMessage: 'Sync from Obsidian Multi-Git Plugin'
};

class MultiGitPlugin extends Plugin {
    async onload() {
        console.log('Loading Obsidian Multi-Git Plugin v0.9.1');
        
        await this.loadSettings();
        
        // Add ribbon icon for main GUI
        this.addRibbonIcon('git-branch', 'Multi-Git: Open Control Panel', () => {
            new MultiGitControlPanel(this.app, this).open();
        });
        
        // Add secondary ribbon icon for quick sync
        this.addRibbonIcon('sync', 'Multi-Git: Quick Sync All', async () => {
            await this.syncAllRepositories();
        });
        
        // Add commands
        this.addCommand({
            id: 'sync-all-repos',
            name: 'Sync all repositories',
            callback: async () => {
                await this.syncAllRepositories();
            }
        });
        
        this.addCommand({
            id: 'open-control-panel',
            name: 'Open Multi-Git Control Panel',
            callback: () => {
                new MultiGitControlPanel(this.app, this).open();
            }
        });
        
        this.addCommand({
            id: 'add-repository',
            name: 'Add repository to manage',
            callback: () => {
                new AddRepoModal(this.app, this).open();
            }
        });
        
        this.addCommand({
            id: 'show-git-status',
            name: 'Show status for all repositories',
            callback: async () => {
                await this.showAllStatus();
            }
        });
        
        // Add settings tab
        this.addSettingTab(new MultiGitSettingTab(this.app, this));
        
        // Status bar
        if (this.settings.showStatusBar) {
            this.statusBarItem = this.addStatusBarItem();
            this.updateStatusBar();
        }
        
        // Auto sync
        if (this.settings.autoSync) {
            this.startAutoSync();
        }
    }
    
    onunload() {
        console.log('Unloading Obsidian Multi-Git Plugin');
        this.stopAutoSync();
    }
    
    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }
    
    async saveSettings() {
        await this.saveData(this.settings);
    }
    
    async syncAllRepositories() {
        new Notice('🔄 Starting sync for all repositories...');
        
        for (const repo of this.settings.repositories) {
            await this.syncRepository(repo);
        }
        
        new Notice('✅ All repositories synced!');
        this.updateStatusBar();
    }
    
    async syncRepository(repo) {
        try {
            new Notice(`📦 Syncing ${repo.name}...`);
            
            // Pull changes
            await this.executeGitCommand(repo.path, 'git pull');
            
            // Add all changes
            await this.executeGitCommand(repo.path, 'git add -A');
            
            // Commit if there are changes
            const status = await this.executeGitCommand(repo.path, 'git status --porcelain');
            if (status.trim()) {
                const commitMsg = repo.commitMessage || this.settings.commitMessage;
                await this.executeGitCommand(repo.path, `git commit -m "${commitMsg}"`);
            }
            
            // Push changes
            await this.executeGitCommand(repo.path, 'git push');
            
            new Notice(`✅ ${repo.name} synced successfully`);
        } catch (error) {
            new Notice(`❌ Error syncing ${repo.name}: ${error.message}`);
            console.error(error);
        }
    }
    
    async showAllStatus() {
        const statuses = [];
        
        for (const repo of this.settings.repositories) {
            try {
                const status = await this.executeGitCommand(repo.path, 'git status --short');
                statuses.push(`📁 ${repo.name}:\n${status || 'Clean'}\n`);
            } catch (error) {
                statuses.push(`📁 ${repo.name}: Error - ${error.message}\n`);
            }
        }
        
        new StatusModal(this.app, statuses.join('\n')).open();
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
    
    startAutoSync() {
        this.stopAutoSync();
        this.autoSyncInterval = window.setInterval(
            () => this.syncAllRepositories(),
            this.settings.syncInterval * 60 * 1000
        );
    }
    
    stopAutoSync() {
        if (this.autoSyncInterval) {
            window.clearInterval(this.autoSyncInterval);
            this.autoSyncInterval = null;
        }
    }
    
    updateStatusBar() {
        if (this.statusBarItem) {
            const repoCount = this.settings.repositories.length;
            this.statusBarItem.setText(`📦 ${repoCount} repos`);
        }
    }
}

class MultiGitControlPanel extends Modal {
    constructor(app, plugin) {
        super(app);
        this.plugin = plugin;
    }
    
    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        
        contentEl.createEl('h1', { text: '🚀 Multi-Git Control Panel' });
        
        // Repository count display
        const repoCount = this.plugin.settings.repositories.length;
        const countEl = contentEl.createEl('div', { 
            text: `📦 Managed Repositories: ${repoCount}`,
            cls: 'multi-git-repo-count'
        });
        
        // Main action buttons
        const buttonContainer = contentEl.createEl('div', { cls: 'multi-git-button-container' });
        
        const syncAllBtn = buttonContainer.createEl('button', { 
            text: '🔄 Sync All Repositories',
            cls: 'multi-git-primary-button'
        });
        syncAllBtn.onclick = async () => {
            await this.plugin.syncAllRepositories();
        };
        
        const addRepoBtn = buttonContainer.createEl('button', { 
            text: '➕ Add Repository',
            cls: 'multi-git-secondary-button'
        });
        addRepoBtn.onclick = () => {
            this.close();
            new AddRepoModal(this.app, this.plugin).open();
        };
        
        const statusBtn = buttonContainer.createEl('button', { 
            text: '📊 Show Status',
            cls: 'multi-git-secondary-button'
        });
        statusBtn.onclick = async () => {
            await this.plugin.showAllStatus();
        };
        
        const settingsBtn = buttonContainer.createEl('button', { 
            text: '⚙️ Settings',
            cls: 'multi-git-secondary-button'
        });
        settingsBtn.onclick = () => {
            this.close();
            // Open settings tab
            this.app.setting.open();
            this.app.setting.openTabById('obsidian-multi-git-plugin');
        };
        
        // Repository list
        if (repoCount > 0) {
            contentEl.createEl('h3', { text: 'Repository List' });
            
            const repoList = contentEl.createEl('div', { cls: 'multi-git-repo-list' });
            
            for (let i = 0; i < this.plugin.settings.repositories.length; i++) {
                const repo = this.plugin.settings.repositories[i];
                const repoEl = repoList.createEl('div', { cls: 'multi-git-repo-item' });
                
                const infoEl = repoEl.createEl('div', { cls: 'multi-git-repo-info' });
                infoEl.createEl('div', { text: repo.name, cls: 'multi-git-repo-name' });
                infoEl.createEl('div', { text: repo.path, cls: 'multi-git-repo-path' });
                
                const actionEl = repoEl.createEl('div', { cls: 'multi-git-repo-actions' });
                
                const syncBtn = actionEl.createEl('button', { 
                    text: '🔄',
                    cls: 'multi-git-small-button',
                    attr: { title: 'Sync this repository' }
                });
                syncBtn.onclick = async () => {
                    await this.plugin.syncRepository(repo);
                };
                
                const removeBtn = actionEl.createEl('button', { 
                    text: '🗑️',
                    cls: 'multi-git-small-button multi-git-danger',
                    attr: { title: 'Remove this repository' }
                });
                removeBtn.onclick = async () => {
                    this.plugin.settings.repositories.splice(i, 1);
                    await this.plugin.saveSettings();
                    this.plugin.updateStatusBar();
                    this.onOpen(); // Refresh the panel
                };
            }
        } else {
            contentEl.createEl('p', { 
                text: '📝 No repositories added yet. Click "Add Repository" to get started!',
                cls: 'multi-git-empty-state'
            });
        }
        
        // Auto-sync status
        const autoSyncEl = contentEl.createEl('div', { cls: 'multi-git-auto-sync-status' });
        const autoSyncText = this.plugin.settings.autoSync 
            ? `✅ Auto-sync: ON (every ${this.plugin.settings.syncInterval} min)`
            : '⏸️ Auto-sync: OFF';
        autoSyncEl.createEl('p', { text: autoSyncText });
    }
    
    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

class AddRepoModal extends Modal {
    constructor(app, plugin) {
        super(app);
        this.plugin = plugin;
    }
    
    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        
        contentEl.createEl('h2', { text: 'Add Git Repository' });
        
        const nameInput = contentEl.createEl('input', {
            type: 'text',
            placeholder: 'Repository name'
        });
        nameInput.style.width = '100%';
        nameInput.style.marginBottom = '10px';
        
        const pathInput = contentEl.createEl('input', {
            type: 'text',
            placeholder: 'Repository path (absolute)'
        });
        pathInput.style.width = '100%';
        pathInput.style.marginBottom = '10px';
        
        const commitMsgInput = contentEl.createEl('input', {
            type: 'text',
            placeholder: 'Custom commit message (optional)'
        });
        commitMsgInput.style.width = '100%';
        commitMsgInput.style.marginBottom = '20px';
        
        const addButton = contentEl.createEl('button', { text: 'Add Repository' });
        addButton.onclick = async () => {
            if (nameInput.value && pathInput.value) {
                this.plugin.settings.repositories.push({
                    name: nameInput.value,
                    path: pathInput.value,
                    commitMessage: commitMsgInput.value || ''
                });
                await this.plugin.saveSettings();
                this.plugin.updateStatusBar();
                new Notice(`Repository ${nameInput.value} added!`);
                this.close();
            } else {
                new Notice('Please fill in name and path');
            }
        };
    }
    
    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

class StatusModal extends Modal {
    constructor(app, status) {
        super(app);
        this.status = status;
    }
    
    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        
        contentEl.createEl('h2', { text: 'Git Status - All Repositories' });
        
        const pre = contentEl.createEl('pre');
        pre.style.overflow = 'auto';
        pre.style.maxHeight = '400px';
        pre.setText(this.status);
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
        
        // Auto sync toggle
        new Setting(containerEl)
            .setName('Auto sync')
            .setDesc('Automatically sync repositories at regular intervals')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.autoSync)
                .onChange(async (value) => {
                    this.plugin.settings.autoSync = value;
                    await this.plugin.saveSettings();
                    if (value) {
                        this.plugin.startAutoSync();
                    } else {
                        this.plugin.stopAutoSync();
                    }
                }));
        
        // Sync interval
        new Setting(containerEl)
            .setName('Sync interval')
            .setDesc('Interval in minutes for auto sync')
            .addText(text => text
                .setPlaceholder('10')
                .setValue(String(this.plugin.settings.syncInterval))
                .onChange(async (value) => {
                    const interval = parseInt(value);
                    if (!isNaN(interval) && interval > 0) {
                        this.plugin.settings.syncInterval = interval;
                        await this.plugin.saveSettings();
                        if (this.plugin.settings.autoSync) {
                            this.plugin.startAutoSync();
                        }
                    }
                }));
        
        // Default commit message
        new Setting(containerEl)
            .setName('Default commit message')
            .setDesc('Default message for commits')
            .addText(text => text
                .setPlaceholder('Sync from Obsidian')
                .setValue(this.plugin.settings.commitMessage)
                .onChange(async (value) => {
                    this.plugin.settings.commitMessage = value;
                    await this.plugin.saveSettings();
                }));
        
        // Status bar
        new Setting(containerEl)
            .setName('Show status bar')
            .setDesc('Show repository count in status bar')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.showStatusBar)
                .onChange(async (value) => {
                    this.plugin.settings.showStatusBar = value;
                    await this.plugin.saveSettings();
                }));
        
        // Repository list
        containerEl.createEl('h3', { text: 'Managed Repositories' });
        
        if (this.plugin.settings.repositories.length === 0) {
            containerEl.createEl('p', { text: 'No repositories added yet.' });
        } else {
            for (let i = 0; i < this.plugin.settings.repositories.length; i++) {
                const repo = this.plugin.settings.repositories[i];
                new Setting(containerEl)
                    .setName(repo.name)
                    .setDesc(repo.path)
                    .addButton(button => button
                        .setButtonText('Remove')
                        .onClick(async () => {
                            this.plugin.settings.repositories.splice(i, 1);
                            await this.plugin.saveSettings();
                            this.plugin.updateStatusBar();
                            this.display();
                        }));
            }
        }
        
        // Add repository button
        new Setting(containerEl)
            .addButton(button => button
                .setButtonText('Add Repository')
                .onClick(() => {
                    new AddRepoModal(this.app, this.plugin).open();
                }));
    }
}

module.exports = MultiGitPlugin;