import { ItemView, WorkspaceLeaf, ButtonComponent, Modal, Notice } from 'obsidian';
import MultiGitPlugin, { GitRepository } from './main';

// Git Manager View Constants
export const GIT_MANAGER_VIEW_TYPE = 'git-manager-view';

// Git Manager View Class
export class GitManagerView extends ItemView {
    plugin: MultiGitPlugin;
    refreshButton: ButtonComponent;
    commitAllButton: ButtonComponent;
    pushAllButton: ButtonComponent;
    pullAllButton: ButtonComponent;
    automodeToggleButton: ButtonComponent;
    automodeRunNowButton: ButtonComponent;
    automodeStatusEl: HTMLElement;
    repositoryContainer: HTMLElement;

    constructor(leaf: WorkspaceLeaf, plugin: MultiGitPlugin) {
        super(leaf);
        this.plugin = plugin;
    }

    getViewType() {
        return GIT_MANAGER_VIEW_TYPE;
    }

    getDisplayText() {
        return 'Git Manager';
    }

    getIcon() {
        return 'git-branch';
    }

    async onOpen() {
        const container = this.containerEl.children[1];
        container.empty();
        container.addClass('git-manager-view');

        // Header Section
        const headerEl = container.createEl('div', { cls: 'git-manager-header' });
        headerEl.createEl('h2', { text: 'Git Repository Manager', cls: 'git-manager-title' });
        
        // FORCE VERSION DISPLAY - ALWAYS VISIBLE
        const forceVersionEl = headerEl.createEl('div', { 
            attr: { 
                style: 'font-size: 1.1em; font-weight: bold; color: var(--text-accent); margin: 10px 0; padding: 10px; background: var(--background-secondary); border-radius: 5px; border: 2px solid var(--color-accent);'
            }
        });
        forceVersionEl.createEl('div', { text: '🚨 PLUGIN VERSION CHECK v1.1.2.4 🚨' });
        
        // Get actual plugin info from app
        const pluginInstance = (this.app as any).plugins?.plugins?.['obsidian-multi-git'];
        const manifestData = pluginInstance?.manifest;
        
        const debugInfoEl = headerEl.createEl('div', { 
            attr: { 
                style: 'font-size: 0.9em; margin: 10px 0; padding: 10px; background: var(--background-modifier-form-field); border-radius: 5px;'
            }
        });
        debugInfoEl.createEl('div', { text: `Expected Version: v1.1.2.4` });
        debugInfoEl.createEl('div', { text: `Manifest Version: ${manifestData?.version || 'UNKNOWN'}` });
        debugInfoEl.createEl('div', { text: `Plugin ID: ${manifestData?.id || 'UNKNOWN'}` });
        debugInfoEl.createEl('div', { text: `Plugin Name: ${manifestData?.name || 'UNKNOWN'}` });
        debugInfoEl.createEl('div', { text: `Plugin Found: ${pluginInstance ? 'YES' : 'NO'}` });
        debugInfoEl.createEl('div', { text: `Settings Object: ${this.plugin.automodeSettings ? 'EXISTS' : 'MISSING'}` });
        debugInfoEl.createEl('div', { text: `Current Time: ${new Date().toLocaleString()}` });
        
        // Plugin location detection
        const locationInfoEl = headerEl.createEl('div', { 
            attr: { 
                style: 'font-size: 0.8em; margin: 5px 0; padding: 8px; background: var(--background-modifier-error); border-radius: 3px; color: var(--text-error);'
            }
        });
        
        // Check plugin directory
        const allPlugins = (this.app as any).plugins?.manifests || {};
        const ourPlugin = allPlugins['obsidian-multi-git'];
        locationInfoEl.createEl('div', { text: `Plugin in manifests: ${ourPlugin ? 'YES' : 'NO'}` });
        if (ourPlugin) {
            locationInfoEl.createEl('div', { text: `Manifest Name: ${ourPlugin.name}` });
            locationInfoEl.createEl('div', { text: `Manifest Version: ${ourPlugin.version}` });
        }
        
        // Check all plugins with similar names
        const similarPlugins = Object.keys(allPlugins).filter(id => id.includes('git') || allPlugins[id].name?.toLowerCase().includes('git'));
        locationInfoEl.createEl('div', { text: `Git-related plugins: ${similarPlugins.join(', ')}` });
        
        // Settings diagnostic button
        const diagButton = headerEl.createEl('button', { 
            text: '🔍 Force Plugin Reload + Settings',
            attr: { 
                style: 'margin-top: 10px; padding: 5px 10px; background: var(--color-red); color: white; border: none; border-radius: 3px; cursor: pointer;'
            }
        });
        diagButton.onclick = async () => {
            // Force reload this plugin
            try {
                const plugins = (this.app as any).plugins;
                await plugins.disablePlugin('obsidian-multi-git');
                await new Promise(r => setTimeout(r, 1000));
                await plugins.enablePlugin('obsidian-multi-git');
                await new Promise(r => setTimeout(r, 1000));
                
                this.plugin.app.setting.open();
                this.plugin.app.setting.openTabById('obsidian-multi-git');
            } catch (error) {
                console.error('Plugin reload error:', error);
            }
        };
        
        // Controls Section
        const controlsEl = container.createEl('div', { cls: 'git-manager-controls' });
        
        // Refresh Button
        const refreshBtnContainer = controlsEl.createEl('div', { cls: 'git-control-button' });
        this.refreshButton = new ButtonComponent(refreshBtnContainer)
            .setButtonText('🔄 Refresh')
            .setTooltip('Refresh repository status')
            .onClick(() => this.refreshView());

        // Global Actions
        const globalActionsEl = controlsEl.createEl('div', { cls: 'git-global-actions' });
        
        this.commitAllButton = new ButtonComponent(globalActionsEl.createEl('div', { cls: 'git-control-button' }))
            .setButtonText('📝 Commit All')
            .setTooltip('Commit changes to all repositories')
            .onClick(() => {
                // 即座にUI状態を変更（同期実行）
                this.commitAllButton.setButtonText('⏳ Committing...');
                this.commitAllButton.setDisabled(true);
                this.commitAllButton.buttonEl.addClass('is-loading');
                
                // 非同期処理を次のティックで実行
                setTimeout(async () => {
                    try {
                        await this.plugin.showCommitModal();
                    } finally {
                        this.commitAllButton.setButtonText('📝 Commit All');
                        this.commitAllButton.setDisabled(false);
                        this.commitAllButton.buttonEl.removeClass('is-loading');
                    }
                }, 0);
            });

        this.pushAllButton = new ButtonComponent(globalActionsEl.createEl('div', { cls: 'git-control-button' }))
            .setButtonText('⬆️ Push All')
            .setTooltip('Push all repositories')
            .onClick(() => {
                // 即座にUI状態を変更
                this.pushAllButton.setButtonText('⏳ Pushing...');
                this.pushAllButton.setDisabled(true);
                this.pushAllButton.buttonEl.addClass('is-loading');
                
                setTimeout(async () => {
                    try {
                        await this.plugin.gitPush();
                    } finally {
                        this.pushAllButton.setButtonText('⬆️ Push All');
                        this.pushAllButton.setDisabled(false);
                        this.pushAllButton.buttonEl.removeClass('is-loading');
                    }
                }, 0);
            });

        this.pullAllButton = new ButtonComponent(globalActionsEl.createEl('div', { cls: 'git-control-button' }))
            .setButtonText('⬇️ Pull All')
            .setTooltip('Pull all repositories')
            .onClick(() => {
                // 即座にUI状態を変更
                this.pullAllButton.setButtonText('⏳ Pulling...');
                this.pullAllButton.setDisabled(true);
                this.pullAllButton.buttonEl.addClass('is-loading');
                
                setTimeout(async () => {
                    try {
                        await this.plugin.gitPull();
                    } finally {
                        this.pullAllButton.setButtonText('⬇️ Pull All');
                        this.pullAllButton.setDisabled(false);
                        this.pullAllButton.buttonEl.removeClass('is-loading');
                    }
                }, 0);
            });

        // Automode Controls
        const automodeEl = controlsEl.createEl('div', { cls: 'git-automode-section' });
        automodeEl.createEl('h3', { text: 'Automode', cls: 'git-automode-title' });
        
        // Automode Status
        this.automodeStatusEl = automodeEl.createEl('div', { cls: 'git-automode-status' });
        this.updateAutomodeStatus();
        
        // Automode Controls
        const automodeControlsEl = automodeEl.createEl('div', { cls: 'git-automode-controls' });
        
        this.automodeToggleButton = new ButtonComponent(automodeControlsEl.createEl('div', { cls: 'git-control-button' }))
            .setTooltip('Toggle Automode on/off')
            .onClick(() => {
                this.plugin.automodeManager.toggleAutomode();
                this.updateAutomodeStatus();
            });

        this.automodeRunNowButton = new ButtonComponent(automodeControlsEl.createEl('div', { cls: 'git-control-button' }))
            .setButtonText('⚡ Run Now')
            .setTooltip('Run automode check immediately')
            .onClick(() => {
                this.automodeRunNowButton.setButtonText('⏳ Running...');
                this.automodeRunNowButton.setDisabled(true);
                this.automodeRunNowButton.buttonEl.addClass('is-loading');
                
                setTimeout(async () => {
                    try {
                        await this.plugin.automodeManager.runNow();
                    } finally {
                        this.automodeRunNowButton.setButtonText('⚡ Run Now');
                        this.automodeRunNowButton.setDisabled(false);
                        this.automodeRunNowButton.buttonEl.removeClass('is-loading');
                        this.updateAutomodeStatus();
                    }
                }, 0);
            });

        // Repository List Container
        this.repositoryContainer = container.createEl('div', { cls: 'git-repository-container' });

        // Initial load
        await this.refreshView();
    }

    async renderRepositories() {
        this.repositoryContainer.empty();

        if (this.plugin.repositories.length === 0) {
            const emptyEl = this.repositoryContainer.createEl('div', { cls: 'git-empty-state' });
            emptyEl.createEl('p', { text: 'No Git repositories found' });
            emptyEl.createEl('p', { text: 'Make sure your vault or parent directory has Git repositories', cls: 'git-empty-subtitle' });
            return;
        }

        for (const repo of this.plugin.repositories) {
            await this.renderRepository(repo);
        }
    }

    async renderRepository(repo: GitRepository) {
        const repoEl = this.repositoryContainer.createEl('div', { cls: 'git-repository-item' });
        
        // Repository Header
        const headerEl = repoEl.createEl('div', { cls: 'git-repo-header' });
        const titleEl = headerEl.createEl('div', { cls: 'git-repo-title' });
        
        titleEl.createEl('span', { 
            text: repo.name + (repo.isParent ? ' (Parent)' : ''), 
            cls: 'git-repo-name' 
        });
        
        titleEl.createEl('span', { 
            text: repo.path, 
            cls: 'git-repo-path' 
        });

        // Repository Status
        const statusEl = repoEl.createEl('div', { cls: 'git-repo-status' });
        statusEl.createEl('div', { text: 'Loading...', cls: 'git-status-loading' });

        // Repository Actions
        const actionsEl = repoEl.createEl('div', { cls: 'git-repo-actions' });
        
        const commitBtn = new ButtonComponent(actionsEl.createEl('div', { cls: 'git-action-button' }))
            .setButtonText('📝 Commit')
            .setTooltip(`Commit changes in ${repo.name}`)
            .onClick(() => {
                commitBtn.setButtonText('⏳ Committing...');
                commitBtn.setDisabled(true);
                commitBtn.buttonEl.addClass('is-loading');
                
                setTimeout(async () => {
                    try {
                        await this.commitRepository(repo);
                    } finally {
                        commitBtn.setButtonText('📝 Commit');
                        commitBtn.setDisabled(false);
                        commitBtn.buttonEl.removeClass('is-loading');
                    }
                }, 0);
            });

        const pushBtn = new ButtonComponent(actionsEl.createEl('div', { cls: 'git-action-button' }))
            .setButtonText('⬆️ Push')
            .setTooltip(`Push ${repo.name}`)
            .onClick(() => {
                pushBtn.setButtonText('⏳ Pushing...');
                pushBtn.setDisabled(true);
                pushBtn.buttonEl.addClass('is-loading');
                
                setTimeout(async () => {
                    try {
                        await this.pushRepository(repo);
                    } finally {
                        pushBtn.setButtonText('⬆️ Push');
                        pushBtn.setDisabled(false);
                        pushBtn.buttonEl.removeClass('is-loading');
                    }
                }, 0);
            });

        const pullBtn = new ButtonComponent(actionsEl.createEl('div', { cls: 'git-action-button' }))
            .setButtonText('⬇️ Pull')
            .setTooltip(`Pull ${repo.name}`)
            .onClick(() => {
                pullBtn.setButtonText('⏳ Pulling...');
                pullBtn.setDisabled(true);
                pullBtn.buttonEl.addClass('is-loading');
                
                setTimeout(async () => {
                    try {
                        await this.pullRepository(repo);
                    } finally {
                        pullBtn.setButtonText('⬇️ Pull');
                        pullBtn.setDisabled(false);
                        pullBtn.buttonEl.removeClass('is-loading');
                    }
                }, 0);
            });

        // Load repository status
        this.loadRepositoryStatus(repo, statusEl);
    }

    async loadRepositoryStatus(repo: GitRepository, statusEl: HTMLElement) {
        try {
            const status = await this.plugin.getGitStatus(repo.path);
            statusEl.empty();

            // Branch info
            const branchEl = statusEl.createEl('div', { cls: 'git-branch-info' });
            branchEl.createEl('span', { text: `🔀 ${status.branch}`, cls: 'git-branch-name' });
            
            if (status.ahead > 0) {
                branchEl.createEl('span', { text: `↑${status.ahead}`, cls: 'git-ahead' });
            }
            if (status.behind > 0) {
                branchEl.createEl('span', { text: `↓${status.behind}`, cls: 'git-behind' });
            }

            // File changes
            const changesEl = statusEl.createEl('div', { cls: 'git-changes' });
            
            if (status.modified.length > 0) {
                changesEl.createEl('span', { 
                    text: `📝 ${status.modified.length} modified`, 
                    cls: 'git-modified' 
                });
            }
            
            if (status.added.length > 0) {
                changesEl.createEl('span', { 
                    text: `➕ ${status.added.length} added`, 
                    cls: 'git-added' 
                });
            }
            
            if (status.deleted.length > 0) {
                changesEl.createEl('span', { 
                    text: `❌ ${status.deleted.length} deleted`, 
                    cls: 'git-deleted' 
                });
            }
            
            if (status.untracked.length > 0) {
                changesEl.createEl('span', { 
                    text: `❓ ${status.untracked.length} untracked`, 
                    cls: 'git-untracked' 
                });
            }

            if (status.modified.length === 0 && status.added.length === 0 && 
                status.deleted.length === 0 && status.untracked.length === 0) {
                changesEl.createEl('span', { text: '✅ No changes', cls: 'git-clean' });
            }

        } catch (error) {
            statusEl.empty();
            statusEl.createEl('div', { text: `❌ Error: ${error.message}`, cls: 'git-error' });
        }
    }

    async commitRepository(repo: GitRepository) {
        // Create a mini commit dialog
        const modal = new Modal(this.app);
        modal.setTitle(`Commit to ${repo.name}`);
        
        const { contentEl } = modal;
        
        const messageInput = contentEl.createEl('textarea', { 
            placeholder: 'Enter commit message...',
            cls: 'git-commit-input'
        });
        messageInput.style.width = '100%';
        messageInput.style.height = '100px';
        
        const buttonContainer = contentEl.createEl('div', { cls: 'git-modal-buttons' });
        
        const commitBtn = buttonContainer.createEl('button', { text: 'Commit', cls: 'mod-cta' });
        commitBtn.onclick = async () => {
            const message = messageInput.value.trim();
            if (!message) {
                new Notice('Please enter a commit message');
                return;
            }
            
            try {
                await this.plugin.executeGitCommand(repo.path, 'add .');
                await this.plugin.executeGitCommand(repo.path, `commit -m "${message.replace(/"/g, '\\"')}"`);
                new Notice(`✅ Committed to ${repo.name}`);
                modal.close();
                this.refreshView();
            } catch (error) {
                new Notice(`❌ Commit failed: ${error}`);
            }
        };
        
        const cancelBtn = buttonContainer.createEl('button', { text: 'Cancel' });
        cancelBtn.onclick = () => modal.close();
        
        modal.open();
        messageInput.focus();
    }

    async pushRepository(repo: GitRepository) {
        try {
            await this.plugin.executeGitCommand(repo.path, 'push');
            new Notice(`✅ Pushed ${repo.name}`);
            this.refreshView();
        } catch (error) {
            new Notice(`❌ Push failed: ${error}`);
        }
    }

    async pullRepository(repo: GitRepository) {
        try {
            await this.plugin.executeGitCommand(repo.path, 'pull');
            new Notice(`✅ Pulled ${repo.name}`);
            this.refreshView();
        } catch (error) {
            new Notice(`❌ Pull failed: ${error}`);
        }
    }

    updateAutomodeStatus() {
        if (!this.automodeStatusEl || !this.automodeToggleButton) return;

        const isEnabled = this.plugin.automodeManager.isEnabled;
        const isActive = this.plugin.automodeManager.isActive;
        
        // Update toggle button
        if (isEnabled) {
            this.automodeToggleButton.setButtonText('🤖 Auto ON');
            this.automodeToggleButton.buttonEl.removeClass('automode-off');
            this.automodeToggleButton.buttonEl.addClass('automode-on');
        } else {
            this.automodeToggleButton.setButtonText('⏸️ Auto OFF');
            this.automodeToggleButton.buttonEl.removeClass('automode-on');
            this.automodeToggleButton.buttonEl.addClass('automode-off');
        }

        // Update status text
        this.automodeStatusEl.empty();
        
        if (!isEnabled) {
            this.automodeStatusEl.createEl('div', { 
                text: 'Automode is disabled', 
                cls: 'automode-status-disabled' 
            });
        } else if (isActive) {
            const timeUntilNext = this.plugin.automodeManager.timeUntilNextRun;
            const secondsLeft = Math.ceil(timeUntilNext / 1000);
            
            this.automodeStatusEl.createEl('div', { 
                text: `Automode active - Next run in ${secondsLeft}s`, 
                cls: 'automode-status-active' 
            });
            
            const settingsText = `Interval: ${this.plugin.automodeSettings.interval}s | ` +
                               `Branch: ${this.plugin.automodeSettings.useSeparateBranch ? this.plugin.automodeSettings.automodeBranchName : 'current'} | ` +
                               `Push: ${this.plugin.automodeSettings.autoPush ? 'enabled' : 'disabled'}`;
            
            this.automodeStatusEl.createEl('div', { 
                text: settingsText, 
                cls: 'automode-status-details' 
            });
        } else {
            this.automodeStatusEl.createEl('div', { 
                text: 'Automode enabled but not running', 
                cls: 'automode-status-waiting' 
            });
        }

        // Schedule next update if active
        if (isEnabled && isActive) {
            setTimeout(() => this.updateAutomodeStatus(), 1000);
        }
    }

    async refreshView() {
        this.refreshButton.setButtonText('🔄 Refreshing...');
        this.refreshButton.setDisabled(true);

        try {
            await this.plugin.detectRepositories();
            await this.renderRepositories();
            this.updateAutomodeStatus(); // Update automode status when refreshing
        } catch (error) {
            new Notice(`Error refreshing repositories: ${error}`);
        } finally {
            this.refreshButton.setButtonText('🔄 Refresh');
            this.refreshButton.setDisabled(false);
        }
    }

    async onClose() {
        // Clean up any resources if needed
    }
}