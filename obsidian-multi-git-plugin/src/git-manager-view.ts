import { ItemView, WorkspaceLeaf, ButtonComponent, Modal, Notice } from 'obsidian';
import MultiGitPlugin, { GitRepository } from './main';

// Git Manager View Constants
export const GIT_MANAGER_VIEW_TYPE = 'git-manager-view';

// Git Manager View Class
export class GitManagerView extends ItemView {
    plugin: MultiGitPlugin;
    refreshButton: ButtonComponent;
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
        
        new ButtonComponent(globalActionsEl.createEl('div', { cls: 'git-control-button' }))
            .setButtonText('📝 Commit All')
            .setTooltip('Commit changes to all repositories')
            .onClick(() => this.plugin.showCommitModal());

        new ButtonComponent(globalActionsEl.createEl('div', { cls: 'git-control-button' }))
            .setButtonText('⬆️ Push All')
            .setTooltip('Push all repositories')
            .onClick(() => this.plugin.gitPush());

        new ButtonComponent(globalActionsEl.createEl('div', { cls: 'git-control-button' }))
            .setButtonText('⬇️ Pull All')
            .setTooltip('Pull all repositories')
            .onClick(() => this.plugin.gitPull());

        // Repository List Container
        this.repositoryContainer = container.createEl('div', { cls: 'git-repository-container' });

        // Initial load
        await this.refreshView();
    }

    async refreshView() {
        this.refreshButton.setButtonText('🔄 Refreshing...');
        this.refreshButton.setDisabled(true);

        try {
            await this.plugin.detectRepositories();
            await this.renderRepositories();
        } catch (error) {
            new Notice(`Error refreshing repositories: ${error}`);
        } finally {
            this.refreshButton.setButtonText('🔄 Refresh');
            this.refreshButton.setDisabled(false);
        }
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
        
        new ButtonComponent(actionsEl.createEl('div', { cls: 'git-action-button' }))
            .setButtonText('📝 Commit')
            .setTooltip(`Commit changes in ${repo.name}`)
            .onClick(() => this.commitRepository(repo));

        new ButtonComponent(actionsEl.createEl('div', { cls: 'git-action-button' }))
            .setButtonText('⬆️ Push')
            .setTooltip(`Push ${repo.name}`)
            .onClick(() => this.pushRepository(repo));

        new ButtonComponent(actionsEl.createEl('div', { cls: 'git-action-button' }))
            .setButtonText('⬇️ Pull')
            .setTooltip(`Pull ${repo.name}`)
            .onClick(() => this.pullRepository(repo));

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

    async onClose() {
        // Clean up any resources if needed
    }
}