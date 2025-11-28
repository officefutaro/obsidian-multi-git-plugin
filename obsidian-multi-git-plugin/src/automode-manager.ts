import { Notice } from 'obsidian';
import MultiGitPlugin, { GitRepository, AutomodeSettings, GitStatus } from './main';

export class AutomodeManager {
    private plugin: MultiGitPlugin;
    private automodeTimer: NodeJS.Timer | null = null;
    private isRunning: boolean = false;
    private nextRunTime: number = 0;

    constructor(plugin: MultiGitPlugin) {
        this.plugin = plugin;
    }

    get isEnabled(): boolean {
        return this.plugin.automodeSettings.enabled;
    }

    get isActive(): boolean {
        return this.automodeTimer !== null;
    }

    get timeUntilNextRun(): number {
        if (!this.isActive) return 0;
        return Math.max(0, this.nextRunTime - Date.now());
    }

    startAutomode(): void {
        if (this.automodeTimer) {
            this.stopAutomode();
        }

        const intervalMs = this.plugin.automodeSettings.interval * 1000;
        this.automodeTimer = setInterval(() => {
            this.executeAutomodeCheck();
        }, intervalMs);

        this.nextRunTime = Date.now() + intervalMs;
        this.updateStatusBar();

        if (this.plugin.automodeSettings.showNotifications) {
            new Notice(`🤖 Automode started (${this.plugin.automodeSettings.interval}s interval)`);
        }

        this.plugin.log('info', `Automode started with ${this.plugin.automodeSettings.interval}s interval`);
    }

    stopAutomode(): void {
        if (this.automodeTimer) {
            clearInterval(this.automodeTimer);
            this.automodeTimer = null;
        }

        this.nextRunTime = 0;
        this.updateStatusBar();

        if (this.plugin.automodeSettings.showNotifications) {
            new Notice('⏸️ Automode stopped');
        }

        this.plugin.log('info', 'Automode stopped');
    }

    toggleAutomode(): void {
        this.plugin.automodeSettings.enabled = !this.plugin.automodeSettings.enabled;
        
        if (this.plugin.automodeSettings.enabled) {
            this.startAutomode();
        } else {
            this.stopAutomode();
            // Switch back to main branch if configured
            if (this.plugin.automodeSettings.autoSwitchToMain) {
                this.switchAllReposToMain();
            }
        }

        this.plugin.saveSettings();
    }

    async runNow(): Promise<void> {
        if (this.isRunning) {
            new Notice('Automode is already running...');
            return;
        }

        await this.executeAutomodeCheck();
    }

    private async executeAutomodeCheck(): Promise<void> {
        if (this.isRunning) {
            this.plugin.log('debug', 'Automode check skipped - already running');
            return;
        }

        this.isRunning = true;
        this.updateStatusBar();
        this.plugin.log('debug', 'Starting automode check...');

        try {
            let processedCount = 0;

            for (const repo of this.plugin.repositories) {
                // Skip excluded repositories
                if (this.plugin.automodeSettings.excludeRepositories.includes(repo.path)) {
                    this.plugin.log('debug', `Skipping excluded repository: ${repo.name}`);
                    continue;
                }

                this.plugin.log('debug', `Checking repository: ${repo.name} at ${repo.path}`);
                const hasChanges = await this.detectChanges(repo);
                if (hasChanges) {
                    this.plugin.log('info', `Auto-committing changes in ${repo.name}`);
                    await this.executeAutoCommit(repo);
                    processedCount++;
                }
            }

            this.plugin.log('info', `Automode check completed: ${processedCount} repositories processed`);

            if (processedCount > 0 && this.plugin.automodeSettings.showNotifications) {
                new Notice(`✅ Auto-committed changes in ${processedCount} repositories`);
            }

        } catch (error) {
            this.plugin.log('error', 'Automode execution error:', error);
            if (this.plugin.automodeSettings.showNotifications) {
                new Notice(`❌ Automode error: ${error.message}`);
            }
        } finally {
            this.isRunning = false;
            this.nextRunTime = Date.now() + (this.plugin.automodeSettings.interval * 1000);
            this.updateStatusBar();
        }
    }

    private async detectChanges(repo: GitRepository): Promise<boolean> {
        try {
            const status = await this.plugin.getGitStatus(repo.path);
            return (
                status.modified.length > 0 ||
                status.added.length > 0 ||
                status.deleted.length > 0 ||
                status.untracked.length > 0
            );
        } catch (error) {
            this.plugin.log('error', `Failed to detect changes in ${repo.path}:`, error);
            return false;
        }
    }

    private async executeAutoCommit(repo: GitRepository): Promise<void> {
        try {
            // 1. Switch to automode branch if configured
            if (this.plugin.automodeSettings.useSeparateBranch) {
                await this.ensureAutomodeBranch(repo);
            }

            // 2. Stage all changes
            await this.plugin.executeGitCommand(repo.path, 'add .');

            // 3. Generate commit message and commit
            const message = await this.generateCommitMessage(repo);
            // Properly escape message for cross-platform compatibility
            const escapedMessage = message
                .replace(/\\/g, '\\\\')  // Escape backslashes first
                .replace(/"/g, '\\"')     // Escape double quotes
                .replace(/`/g, '\\`')     // Escape backticks
                .replace(/\$/g, '\\$')    // Escape dollar signs
                .replace(/!/g, '\\!');    // Escape exclamation marks
            
            await this.plugin.executeGitCommand(repo.path, `commit -m "${escapedMessage}"`);

            // 4. Push if configured
            if (this.plugin.automodeSettings.autoPush) {
                const pushBranch = this.plugin.automodeSettings.useSeparateBranch 
                    ? this.plugin.automodeSettings.automodeBranchName 
                    : await this.getCurrentBranch(repo.path);
                await this.plugin.executeGitCommand(repo.path, `push origin ${pushBranch}`);
            }

            this.plugin.log('info', `Auto-committed changes in ${repo.name}: ${message}`);

        } catch (error) {
            this.plugin.log('error', `Failed to auto-commit in ${repo.path}:`, error);
            
            // Handle specific Git errors
            if (error.message.includes('CONFLICT')) {
                if (this.plugin.automodeSettings.showNotifications) {
                    new Notice(`🛑 Automode stopped due to conflict in ${repo.name}`);
                }
                this.stopAutomode();
            }
            
            throw error;
        }
    }

    private async ensureAutomodeBranch(repo: GitRepository): Promise<void> {
        const currentBranch = await this.getCurrentBranch(repo.path);
        const automodeBranch = this.plugin.automodeSettings.automodeBranchName;

        if (currentBranch !== automodeBranch) {
            try {
                // Check if automode branch exists
                const branches = await this.plugin.executeGitCommand(repo.path, 'branch -a');
                const branchExists = branches.includes(automodeBranch) || branches.includes(`remotes/origin/${automodeBranch}`);

                if (!branchExists) {
                    // Create new branch from current branch
                    await this.plugin.executeGitCommand(repo.path, `checkout -b ${automodeBranch}`);
                } else {
                    // Switch to existing branch
                    await this.plugin.executeGitCommand(repo.path, `checkout ${automodeBranch}`);
                }
            } catch (error) {
                console.error(`Failed to switch to automode branch in ${repo.path}:`, error);
                throw error;
            }
        }
    }

    private async switchAllReposToMain(): Promise<void> {
        for (const repo of this.plugin.repositories) {
            try {
                await this.switchToMainBranch(repo);
            } catch (error) {
                console.error(`Failed to switch ${repo.path} to main branch:`, error);
            }
        }
    }

    private async switchToMainBranch(repo: GitRepository): Promise<void> {
        try {
            const mainBranch = await this.getMainBranchName(repo.path);
            const currentBranch = await this.getCurrentBranch(repo.path);
            
            if (currentBranch !== mainBranch) {
                await this.plugin.executeGitCommand(repo.path, `checkout ${mainBranch}`);
            }
        } catch (error) {
            console.error(`Failed to switch to main branch in ${repo.path}:`, error);
            throw error;
        }
    }

    private async getCurrentBranch(repoPath: string): Promise<string> {
        const result = await this.plugin.executeGitCommand(repoPath, 'branch --show-current');
        return result.trim();
    }

    private async getMainBranchName(repoPath: string): Promise<string> {
        try {
            // Try to get default branch from remote
            const result = await this.plugin.executeGitCommand(repoPath, 'symbolic-ref refs/remotes/origin/HEAD');
            return result.replace('refs/remotes/origin/', '').trim();
        } catch {
            // Fallback to common main branch names
            try {
                await this.plugin.executeGitCommand(repoPath, 'rev-parse --verify main');
                return 'main';
            } catch {
                try {
                    await this.plugin.executeGitCommand(repoPath, 'rev-parse --verify master');
                    return 'master';
                } catch {
                    throw new Error('Could not determine main branch name');
                }
            }
        }
    }

    private async generateCommitMessage(repo: GitRepository): Promise<string> {
        const status = await this.plugin.getGitStatus(repo.path);
        const changedFiles = [
            ...status.modified,
            ...status.added,
            ...status.deleted,
            ...status.untracked
        ];

        // Extract file names from paths
        const fileNames = changedFiles.map(file => 
            file.split('/').pop() || file
        ).filter(Boolean);

        const template = this.plugin.automodeSettings.commitMessageTemplate;
        const now = new Date();

        return template
            .replace('${files}', fileNames.join(', '))
            .replace('${fileCount}', fileNames.length.toString())
            .replace('${repo}', repo.name)
            .replace('${timestamp}', now.toISOString())
            .replace('${date}', now.toISOString().split('T')[0])
            .replace('${time}', now.toTimeString().split(' ')[0]);
    }

    private updateStatusBar(): void {
        if (!this.plugin.statusBarItem) return;

        if (!this.isEnabled) {
            this.plugin.statusBarItem.setText('Git: Auto OFF');
        } else if (this.isRunning) {
            this.plugin.statusBarItem.setText('Git: Auto Running...');
        } else if (this.isActive) {
            const secondsLeft = Math.ceil(this.timeUntilNextRun / 1000);
            this.plugin.statusBarItem.setText(`Git: Auto ON (${secondsLeft}s)`);
            
            // Update every second when active
            setTimeout(() => {
                if (this.isActive && !this.isRunning) {
                    this.updateStatusBar();
                }
            }, 1000);
        } else {
            this.plugin.statusBarItem.setText('Git: Auto OFF');
        }
    }

    onSettingsChanged(): void {
        if (this.isActive && this.isEnabled) {
            // Restart with new settings
            this.stopAutomode();
            this.startAutomode();
        }
    }

    destroy(): void {
        this.stopAutomode();
    }
}