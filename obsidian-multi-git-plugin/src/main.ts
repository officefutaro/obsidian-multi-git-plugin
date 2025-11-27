import { Plugin, Notice, Modal, App, Setting, ItemView, WorkspaceLeaf, ButtonComponent, PluginSettingTab } from 'obsidian';
import { exec, ExecException } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import { promisify } from 'util';
import { GitManagerView, GIT_MANAGER_VIEW_TYPE } from './git-manager-view';
import { AutomodeManager } from './automode-manager';

const execAsync = promisify(exec);

export interface GitRepository {
    path: string;
    name: string;
    isParent: boolean;
}

export interface GitStatus {
    modified: string[];
    added: string[];
    deleted: string[];
    untracked: string[];
    branch: string;
    ahead: number;
    behind: number;
}

export interface AutomodeSettings {
    enabled: boolean;
    interval: number;
    autoPush: boolean;
    commitMessageTemplate: string;
    showNotifications: boolean;
    excludeRepositories: string[];
    useSeparateBranch: boolean;
    automodeBranchName: string;
    autoSwitchToMain: boolean;
    debugMode: boolean;
    logLevel: 'error' | 'warn' | 'info' | 'debug';
    enableFileLogging: boolean;
    logFilePath: string;
}

export const DEFAULT_AUTOMODE_SETTINGS: AutomodeSettings = {
    enabled: false,
    interval: 30,
    autoPush: true,
    commitMessageTemplate: "${files}",
    showNotifications: true,
    excludeRepositories: [],
    useSeparateBranch: true,
    automodeBranchName: "automode",
    autoSwitchToMain: true,
    debugMode: false,
    logLevel: 'info',
    enableFileLogging: false,
    logFilePath: 'multi-git-debug.log'
};

export default class MultiGitPlugin extends Plugin {
    repositories: GitRepository[] = [];
    statusBarItem: HTMLElement;
    automodeSettings: AutomodeSettings = { ...DEFAULT_AUTOMODE_SETTINGS };
    automodeManager: AutomodeManager;

    // Logger utility
    log(level: 'error' | 'warn' | 'info' | 'debug', message: string, ...args: any[]) {
        const logLevels = { error: 0, warn: 1, info: 2, debug: 3 };
        const currentLevel = logLevels[this.automodeSettings.logLevel];
        const messageLevel = logLevels[level];
        
        if (messageLevel <= currentLevel) {
            const timestamp = new Date().toISOString();
            const prefix = `[Multi-Git ${level.toUpperCase()}]`;
            const fullMessage = `${prefix} ${message}`;
            const argsStr = args.length > 0 ? ' ' + args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
            ).join(' ') : '';
            
            // Console logging
            console[level === 'debug' ? 'log' : level](fullMessage, ...args);
            
            // File logging
            if (this.automodeSettings.enableFileLogging) {
                this.writeToLogFile(`${timestamp} ${fullMessage}${argsStr}`);
            }
            
            // Show notices for errors and warnings (if notifications enabled)
            if (this.automodeSettings.showNotifications && (level === 'error' || level === 'warn')) {
                new Notice(`${prefix} ${message}`);
            }
            
            // Debug mode shows all messages as notices
            if (this.automodeSettings.debugMode && level === 'debug') {
                new Notice(`${prefix} ${message}`);
            }
        }
    }

    private async writeToLogFile(logEntry: string): Promise<void> {
        try {
            const vaultPath = (this.app.vault.adapter as any).basePath;
            const logPath = path.join(vaultPath, this.automodeSettings.logFilePath);
            
            // Append to log file
            fs.appendFileSync(logPath, logEntry + '\n', 'utf8');
        } catch (error) {
            // Fallback to console only if file logging fails
            console.error('[Multi-Git] Failed to write to log file:', error);
        }
    }

    async onload() {
        this.log('info', `Loading Multi Git Manager plugin v${this.manifest.version}`);

        // Load settings
        await this.loadSettings();
        this.log('debug', 'Settings loaded:', this.automodeSettings);

        // Initialize automode manager
        this.automodeManager = new AutomodeManager(this);
        this.log('debug', 'Automode manager initialized');

        // Register the custom view
        this.registerView(
            GIT_MANAGER_VIEW_TYPE,
            (leaf) => new GitManagerView(leaf, this)
        );

        // Add settings tab
        this.addSettingTab(new MultiGitSettingTab(this.app, this));

        this.statusBarItem = this.addStatusBarItem();
        this.statusBarItem.setText('Git: Initializing...');

        await this.detectRepositories();

        // Start automode if enabled
        if (this.automodeSettings.enabled) {
            this.log('info', 'Starting automode on plugin load');
            this.automodeManager.startAutomode();
        } else {
            this.log('debug', 'Automode disabled in settings');
        }

        this.addCommand({
            id: 'show-git-status',
            name: 'Show Git Status',
            callback: () => this.showGitStatusModal()
        });

        this.addCommand({
            id: 'git-commit',
            name: 'Git Commit',
            callback: () => this.showCommitModal()
        });

        this.addCommand({
            id: 'git-push',
            name: 'Git Push',
            callback: () => this.gitPush()
        });

        this.addCommand({
            id: 'git-pull',
            name: 'Git Pull',
            callback: () => this.gitPull()
        });

        this.addCommand({
            id: 'open-git-manager',
            name: 'Open Git Manager',
            callback: () => this.openGitManagerView()
        });

        this.addCommand({
            id: 'toggle-automode',
            name: 'Toggle Automode',
            callback: () => this.automodeManager.toggleAutomode()
        });

        this.addCommand({
            id: 'run-automode-now',
            name: 'Run Automode Now',
            callback: () => this.automodeManager.runNow()
        });

        this.addRibbonIcon('git-branch', 'Git Manager View', () => {
            this.openGitManagerView();
        });

        this.registerInterval(
            window.setInterval(() => this.updateStatusBar(), 30000)
        );

        await this.updateStatusBar();
        
        this.log('info', 'Multi Git Manager plugin loaded successfully');
    }

    async loadSettings() {
        const loadedData = await this.loadData();
        this.automodeSettings = Object.assign({}, DEFAULT_AUTOMODE_SETTINGS, loadedData);
        
        // Ensure new settings exist (for compatibility with older versions)
        if (this.automodeSettings.enableFileLogging === undefined) {
            this.automodeSettings.enableFileLogging = false;
        }
        if (!this.automodeSettings.logFilePath) {
            this.automodeSettings.logFilePath = 'multi-git-debug.log';
        }
        if (this.automodeSettings.debugMode === undefined) {
            this.automodeSettings.debugMode = false;
        }
        if (!this.automodeSettings.logLevel) {
            this.automodeSettings.logLevel = 'info';
        }
        
        this.log('debug', 'Settings migration completed, current settings:', this.automodeSettings);
        
        // Save updated settings to ensure new fields are persisted
        await this.saveSettings();
    }

    async saveSettings() {
        await this.saveData(this.automodeSettings);
        if (this.automodeManager) {
            this.automodeManager.onSettingsChanged();
        }
    }

    async onunload() {
        console.log('Unloading Multi Git Manager plugin');
        if (this.automodeManager) {
            this.automodeManager.destroy();
        }
    }

    async detectRepositories() {
        this.log('debug', 'Starting repository detection...');
        this.repositories = [];
        
        const vaultPath = (this.app.vault.adapter as any).basePath;
        this.log('debug', 'Vault path:', vaultPath);
        
        const checkGitRepo = async (dirPath: string, name: string, isParent: boolean = false) => {
            try {
                this.log('debug', `Checking Git repository: ${dirPath}`);
                await execAsync('git status', { cwd: dirPath });
                this.repositories.push({ path: dirPath, name, isParent });
                this.log('info', `Found Git repository: ${name} at ${dirPath}`);
                return true;
            } catch (error) {
                this.log('debug', `Not a Git repository: ${dirPath}`, error);
                return false;
            }
        };

        await checkGitRepo(vaultPath, 'Vault', false);
        
        const parentPath = path.dirname(vaultPath);
        await checkGitRepo(parentPath, 'Parent (Claude Code)', true);
        
        const folders = this.app.vault.getAllLoadedFiles()
            .filter(f => f.children)
            .map(f => f.path);
        
        for (const folder of folders) {
            const fullPath = path.join(vaultPath, folder);
            await checkGitRepo(fullPath, folder, false);
        }

        this.log('info', `Detected ${this.repositories.length} Git repositories:`, 
            this.repositories.map(r => `${r.name} (${r.path})`));
    }

    async getGitStatus(repoPath: string): Promise<GitStatus> {
        const status: GitStatus = {
            modified: [],
            added: [],
            deleted: [],
            untracked: [],
            branch: 'main',
            ahead: 0,
            behind: 0
        };

        try {
            const { stdout: statusOut } = await execAsync('git status --porcelain', { cwd: repoPath });
            const lines = statusOut.split('\n').filter(line => line.trim());
            
            for (const line of lines) {
                const fileStatus = line.substring(0, 2);
                const fileName = line.substring(3);
                
                if (fileStatus.includes('M')) status.modified.push(fileName);
                else if (fileStatus.includes('A')) status.added.push(fileName);
                else if (fileStatus.includes('D')) status.deleted.push(fileName);
                else if (fileStatus === '??') status.untracked.push(fileName);
            }

            const { stdout: branchOut } = await execAsync('git branch --show-current', { cwd: repoPath });
            status.branch = branchOut.trim() || 'main';

            try {
                const { stdout: aheadBehind } = await execAsync(
                    `git rev-list --left-right --count origin/${status.branch}...HEAD`,
                    { cwd: repoPath }
                );
                const [behind, ahead] = aheadBehind.trim().split('\t').map(n => parseInt(n) || 0);
                status.ahead = ahead;
                status.behind = behind;
            } catch {
                // Remote might not exist
            }
        } catch (error) {
            this.log('error', `Error getting git status for ${repoPath}`, error);
        }

        return status;
    }

    async updateStatusBar() {
        if (this.automodeManager) {
            // Let automode manager handle status bar updates
            return;
        }

        let totalChanges = 0;
        for (const repo of this.repositories) {
            const status = await this.getGitStatus(repo.path);
            totalChanges += status.modified.length + status.added.length + 
                          status.deleted.length + status.untracked.length;
        }
        
        this.statusBarItem.setText(`Git: ${totalChanges} changes`);
    }

    async openGitManagerView() {
        const existingLeaf = this.app.workspace.getLeavesOfType(GIT_MANAGER_VIEW_TYPE)[0];
        if (existingLeaf) {
            this.app.workspace.revealLeaf(existingLeaf);
        } else {
            const leaf = this.app.workspace.getRightLeaf(false);
            await leaf.setViewState({ type: GIT_MANAGER_VIEW_TYPE, active: true });
            this.app.workspace.revealLeaf(leaf);
        }
    }

    async showGitStatusModal() {
        const modal = new GitStatusModal(this.app, this);
        modal.open();
    }

    async showCommitModal() {
        const modal = new GitCommitModal(this.app, this);
        modal.open();
    }

    async gitPush() {
        const modal = new GitOperationModal(this.app, this, 'push');
        modal.open();
    }

    async gitPull() {
        const modal = new GitOperationModal(this.app, this, 'pull');
        modal.open();
    }

    async executeGitCommand(repoPath: string, command: string): Promise<string> {
        try {
            const { stdout, stderr } = await execAsync(`git ${command}`, { cwd: repoPath });
            return stdout || stderr;
        } catch (error) {
            const e = error as ExecException;
            throw new Error(e.message);
        }
    }
}

class GitStatusModal extends Modal {
    plugin: MultiGitPlugin;

    constructor(app: App, plugin: MultiGitPlugin) {
        super(app);
        this.plugin = plugin;
    }

    async onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.createEl('h2', { text: 'Git Status - All Repositories' });

        for (const repo of this.plugin.repositories) {
            const repoDiv = contentEl.createDiv({ cls: 'git-repo-status' });
            repoDiv.createEl('h3', { text: `${repo.name} ${repo.isParent ? '(Parent)' : ''}` });
            
            const status = await this.plugin.getGitStatus(repo.path);
            
            const statusInfo = repoDiv.createDiv({ cls: 'git-status-info' });
            statusInfo.createEl('div', { text: `Branch: ${status.branch}` });
            
            if (status.ahead > 0 || status.behind > 0) {
                statusInfo.createEl('div', { 
                    text: `↑${status.ahead} ↓${status.behind}`,
                    cls: 'git-sync-status'
                });
            }

            if (status.modified.length > 0) {
                const modDiv = repoDiv.createDiv();
                modDiv.createEl('strong', { text: `Modified (${status.modified.length}):` });
                status.modified.forEach(f => modDiv.createEl('div', { text: `  M ${f}`, cls: 'git-file-modified' }));
            }

            if (status.added.length > 0) {
                const addDiv = repoDiv.createDiv();
                addDiv.createEl('strong', { text: `Added (${status.added.length}):` });
                status.added.forEach(f => addDiv.createEl('div', { text: `  A ${f}`, cls: 'git-file-added' }));
            }

            if (status.deleted.length > 0) {
                const delDiv = repoDiv.createDiv();
                delDiv.createEl('strong', { text: `Deleted (${status.deleted.length}):` });
                status.deleted.forEach(f => delDiv.createEl('div', { text: `  D ${f}`, cls: 'git-file-deleted' }));
            }

            if (status.untracked.length > 0) {
                const untDiv = repoDiv.createDiv();
                untDiv.createEl('strong', { text: `Untracked (${status.untracked.length}):` });
                status.untracked.forEach(f => untDiv.createEl('div', { text: `  ? ${f}`, cls: 'git-file-untracked' }));
            }

            const totalChanges = status.modified.length + status.added.length + 
                               status.deleted.length + status.untracked.length;
            if (totalChanges === 0) {
                repoDiv.createEl('div', { text: 'No changes', cls: 'git-no-changes' });
            }

            repoDiv.createEl('hr');
        }

        const closeBtn = contentEl.createEl('button', { text: 'Close' });
        closeBtn.onclick = () => this.close();
    }
}

class GitCommitModal extends Modal {
    plugin: MultiGitPlugin;
    selectedRepos: Set<string> = new Set();

    constructor(app: App, plugin: MultiGitPlugin) {
        super(app);
        this.plugin = plugin;
    }

    async onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.createEl('h2', { text: 'Git Commit' });

        const repoSection = contentEl.createDiv({ cls: 'git-repo-selection' });
        repoSection.createEl('h3', { text: 'Select Repositories:' });

        for (const repo of this.plugin.repositories) {
            const status = await this.plugin.getGitStatus(repo.path);
            const totalChanges = status.modified.length + status.added.length + 
                               status.deleted.length + status.untracked.length;
            
            if (totalChanges > 0) {
                new Setting(repoSection)
                    .setName(`${repo.name} ${repo.isParent ? '(Parent)' : ''} - ${totalChanges} changes`)
                    .addToggle(toggle => {
                        toggle.onChange(value => {
                            if (value) {
                                this.selectedRepos.add(repo.path);
                            } else {
                                this.selectedRepos.delete(repo.path);
                            }
                        });
                        toggle.setValue(true);
                        this.selectedRepos.add(repo.path);
                    });
            }
        }

        const messageSection = contentEl.createDiv({ cls: 'git-commit-message' });
        messageSection.createEl('h3', { text: 'Commit Message:' });
        
        const messageInput = messageSection.createEl('textarea', {
            attr: {
                placeholder: 'Enter commit message...',
                rows: '4',
                style: 'width: 100%;'
            }
        });

        const buttonSection = contentEl.createDiv({ cls: 'git-commit-buttons' });
        
        const commitBtn = buttonSection.createEl('button', { text: 'Commit', cls: 'mod-cta' });
        commitBtn.onclick = async () => {
            const message = messageInput.value.trim();
            if (!message) {
                new Notice('Please enter a commit message');
                return;
            }

            if (this.selectedRepos.size === 0) {
                new Notice('Please select at least one repository');
                return;
            }

            for (const repoPath of this.selectedRepos) {
                try {
                    await this.plugin.executeGitCommand(repoPath, 'add .');
                    await this.plugin.executeGitCommand(repoPath, `commit -m "${message.replace(/"/g, '\\"')}"`);
                    
                    const repoName = this.plugin.repositories.find(r => r.path === repoPath)?.name || 'Repository';
                    new Notice(`✓ Committed to ${repoName}`);
                } catch (error) {
                    new Notice(`✗ Error committing to repository: ${error}`);
                }
            }

            this.plugin.updateStatusBar();
            this.close();
        };

        const cancelBtn = buttonSection.createEl('button', { text: 'Cancel' });
        cancelBtn.onclick = () => this.close();
    }
}

class GitOperationModal extends Modal {
    plugin: MultiGitPlugin;
    operation: 'push' | 'pull';
    selectedRepos: Set<string> = new Set();

    constructor(app: App, plugin: MultiGitPlugin, operation: 'push' | 'pull') {
        super(app);
        this.plugin = plugin;
        this.operation = operation;
    }

    async onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.createEl('h2', { text: `Git ${this.operation.charAt(0).toUpperCase() + this.operation.slice(1)}` });

        const repoSection = contentEl.createDiv({ cls: 'git-repo-selection' });
        repoSection.createEl('h3', { text: 'Select Repositories:' });

        for (const repo of this.plugin.repositories) {
            new Setting(repoSection)
                .setName(`${repo.name} ${repo.isParent ? '(Parent)' : ''}`)
                .addToggle(toggle => {
                    toggle.onChange(value => {
                        if (value) {
                            this.selectedRepos.add(repo.path);
                        } else {
                            this.selectedRepos.delete(repo.path);
                        }
                    });
                    toggle.setValue(true);
                    this.selectedRepos.add(repo.path);
                });
        }

        const buttonSection = contentEl.createDiv({ cls: 'git-operation-buttons' });
        
        const executeBtn = buttonSection.createEl('button', { 
            text: this.operation.charAt(0).toUpperCase() + this.operation.slice(1), 
            cls: 'mod-cta' 
        });
        
        executeBtn.onclick = async () => {
            if (this.selectedRepos.size === 0) {
                new Notice('Please select at least one repository');
                return;
            }

            for (const repoPath of this.selectedRepos) {
                try {
                    const result = await this.plugin.executeGitCommand(repoPath, this.operation);
                    const repoName = this.plugin.repositories.find(r => r.path === repoPath)?.name || 'Repository';
                    new Notice(`✓ ${this.operation} completed for ${repoName}`);
                } catch (error) {
                    new Notice(`✗ Error during ${this.operation}: ${error}`);
                }
            }

            this.plugin.updateStatusBar();
            this.close();
        };

        const cancelBtn = buttonSection.createEl('button', { text: 'Cancel' });
        cancelBtn.onclick = () => this.close();
    }
}

class MultiGitSettingTab extends PluginSettingTab {
    plugin: MultiGitPlugin;

    constructor(app: App, plugin: MultiGitPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: `Multi Git Manager Settings v${this.plugin.manifest.version} 🚀` });
        
        // MASSIVE UPDATE BANNER - CANNOT BE MISSED
        const updateBanner = containerEl.createEl('div', { 
            attr: { 
                style: 'font-size: 1.5em; font-weight: bold; color: white; background: linear-gradient(90deg, blue, purple); margin: 20px 0; padding: 20px; border-radius: 15px; border: 4px solid cyan; text-align: center; box-shadow: 0 0 20px rgba(0,255,255,0.5);'
            }
        });
        updateBanner.innerHTML = `🎉 NEW SETTINGS CODE v${this.plugin.manifest.version} IS ACTIVE! 🎉<br><small>If you see this, the code has been updated!</small>`;
        
        // Debug info at top
        const debugInfo = containerEl.createEl('div', { 
            cls: 'setting-item-info',
            attr: { style: 'margin-bottom: 20px; padding: 10px; background: var(--background-secondary); border-radius: 5px;' }
        });
        debugInfo.createEl('div', { text: `Plugin Version: v${this.plugin.manifest.version}` });
        debugInfo.createEl('div', { text: `Settings loaded: ${this.plugin.automodeSettings ? 'Yes' : 'No'}` });
        debugInfo.createEl('div', { text: `Debug mode: ${this.plugin.automodeSettings?.debugMode}` });
        debugInfo.createEl('div', { text: `File logging: ${this.plugin.automodeSettings?.enableFileLogging}` });

        // Automode section
        containerEl.createEl('h3', { text: 'Automode Settings' });

        new Setting(containerEl)
            .setName('Enable Automode')
            .setDesc('Automatically commit and push changes at regular intervals')
            .addToggle(toggle => toggle
                .setValue(this.plugin.automodeSettings.enabled)
                .onChange(async (value) => {
                    this.plugin.automodeSettings.enabled = value;
                    await this.plugin.saveSettings();
                    if (value) {
                        this.plugin.automodeManager.startAutomode();
                    } else {
                        this.plugin.automodeManager.stopAutomode();
                    }
                }));

        new Setting(containerEl)
            .setName('Check Interval (seconds)')
            .setDesc('How often to check for changes (5-3600 seconds)')
            .addSlider(slider => slider
                .setLimits(5, 3600, 5)
                .setValue(this.plugin.automodeSettings.interval)
                .setDynamicTooltip()
                .onChange(async (value) => {
                    this.plugin.automodeSettings.interval = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Auto Push')
            .setDesc('Automatically push commits to remote repository')
            .addToggle(toggle => toggle
                .setValue(this.plugin.automodeSettings.autoPush)
                .onChange(async (value) => {
                    this.plugin.automodeSettings.autoPush = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Commit Message Template')
            .setDesc('Template for commit messages. Available variables: ${files}, ${fileCount}, ${repo}, ${timestamp}, ${date}, ${time}')
            .addText(text => text
                .setPlaceholder('${files}')
                .setValue(this.plugin.automodeSettings.commitMessageTemplate)
                .onChange(async (value) => {
                    this.plugin.automodeSettings.commitMessageTemplate = value || '${files}';
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Show Notifications')
            .setDesc('Show notifications when automode performs actions')
            .addToggle(toggle => toggle
                .setValue(this.plugin.automodeSettings.showNotifications)
                .onChange(async (value) => {
                    this.plugin.automodeSettings.showNotifications = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Use Separate Branch')
            .setDesc('Use a dedicated branch for automode commits')
            .addToggle(toggle => toggle
                .setValue(this.plugin.automodeSettings.useSeparateBranch)
                .onChange(async (value) => {
                    this.plugin.automodeSettings.useSeparateBranch = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Automode Branch Name')
            .setDesc('Name of the branch used for automode commits')
            .addText(text => text
                .setPlaceholder('automode')
                .setValue(this.plugin.automodeSettings.automodeBranchName)
                .onChange(async (value) => {
                    this.plugin.automodeSettings.automodeBranchName = value || 'automode';
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Auto Switch to Main')
            .setDesc('Automatically switch back to main branch when automode is disabled')
            .addToggle(toggle => toggle
                .setValue(this.plugin.automodeSettings.autoSwitchToMain)
                .onChange(async (value) => {
                    this.plugin.automodeSettings.autoSwitchToMain = value;
                    await this.plugin.saveSettings();
                }));

        // Debug section
        try {
            containerEl.createEl('h3', { text: 'Debug Settings' });

            new Setting(containerEl)
                .setName('Debug Mode')
                .setDesc('Show debug messages as notifications (for troubleshooting)')
                .addToggle(toggle => toggle
                    .setValue(this.plugin.automodeSettings.debugMode || false)
                    .onChange(async (value) => {
                        this.plugin.automodeSettings.debugMode = value;
                        await this.plugin.saveSettings();
                    }));

            new Setting(containerEl)
                .setName('Log Level')
                .setDesc('Console logging level (check Developer Console: Ctrl+Shift+I)')
                .addDropdown(dropdown => dropdown
                    .addOption('error', 'Error only')
                    .addOption('warn', 'Warning and above')
                    .addOption('info', 'Info and above')
                    .addOption('debug', 'All messages')
                    .setValue(this.plugin.automodeSettings.logLevel || 'info')
                    .onChange(async (value: 'error' | 'warn' | 'info' | 'debug') => {
                        this.plugin.automodeSettings.logLevel = value;
                        await this.plugin.saveSettings();
                    }));

            new Setting(containerEl)
                .setName('Enable File Logging')
                .setDesc('Save logs to a file in your vault directory')
                .addToggle(toggle => toggle
                    .setValue(this.plugin.automodeSettings.enableFileLogging || false)
                    .onChange(async (value) => {
                        this.plugin.automodeSettings.enableFileLogging = value;
                        await this.plugin.saveSettings();
                    }));

            new Setting(containerEl)
                .setName('Log File Path')
                .setDesc('Path to log file (relative to vault directory)')
                .addText(text => text
                    .setPlaceholder('multi-git-debug.log')
                    .setValue(this.plugin.automodeSettings.logFilePath || 'multi-git-debug.log')
                    .onChange(async (value) => {
                        this.plugin.automodeSettings.logFilePath = value || 'multi-git-debug.log';
                        await this.plugin.saveSettings();
                    }));
        } catch (error) {
            containerEl.createEl('div', { 
                text: `Error rendering debug settings: ${error}`,
                attr: { style: 'color: red; margin: 10px; padding: 10px; background: var(--background-modifier-error);' }
            });
            console.error('[Multi-Git] Settings rendering error:', error);
        }
    }
}