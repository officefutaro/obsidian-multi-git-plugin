import { Plugin, Notice, Modal, App, Setting } from 'obsidian';
import { exec, ExecException } from 'child_process';
import * as path from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface GitRepository {
    path: string;
    name: string;
    isParent: boolean;
}

interface GitStatus {
    modified: string[];
    added: string[];
    deleted: string[];
    untracked: string[];
    branch: string;
    ahead: number;
    behind: number;
}

export default class MultiGitPlugin extends Plugin {
    repositories: GitRepository[] = [];
    statusBarItem: HTMLElement;

    async onload() {
        console.log('Loading Multi Git Manager plugin');

        this.statusBarItem = this.addStatusBarItem();
        this.statusBarItem.setText('Git: Initializing...');

        await this.detectRepositories();

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

        this.addRibbonIcon('git-branch', 'Multi Git Manager', () => {
            this.showGitStatusModal();
        });

        this.registerInterval(
            window.setInterval(() => this.updateStatusBar(), 30000)
        );

        await this.updateStatusBar();
    }

    async detectRepositories() {
        this.repositories = [];
        
        const vaultPath = (this.app.vault.adapter as any).basePath;
        
        const checkGitRepo = async (dirPath: string, name: string, isParent: boolean = false) => {
            try {
                await execAsync('git status', { cwd: dirPath });
                this.repositories.push({ path: dirPath, name, isParent });
                return true;
            } catch {
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

        console.log(`Detected ${this.repositories.length} Git repositories`);
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
            console.error(`Error getting git status for ${repoPath}:`, error);
        }

        return status;
    }

    async updateStatusBar() {
        let totalChanges = 0;
        for (const repo of this.repositories) {
            const status = await this.getGitStatus(repo.path);
            totalChanges += status.modified.length + status.added.length + 
                          status.deleted.length + status.untracked.length;
        }
        
        this.statusBarItem.setText(`Git: ${totalChanges} changes`);
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