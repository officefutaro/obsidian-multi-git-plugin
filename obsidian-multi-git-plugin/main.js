"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => MultiGitPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian2 = require("obsidian");
var import_child_process = require("child_process");
var path = __toESM(require("path"));
var import_util = require("util");

// src/git-manager-view.ts
var import_obsidian = require("obsidian");
var GIT_MANAGER_VIEW_TYPE = "git-manager-view";
var GitManagerView = class extends import_obsidian.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
  }
  getViewType() {
    return GIT_MANAGER_VIEW_TYPE;
  }
  getDisplayText() {
    return "Git Manager";
  }
  getIcon() {
    return "git-branch";
  }
  onOpen() {
    return __async(this, null, function* () {
      const container = this.containerEl.children[1];
      container.empty();
      container.addClass("git-manager-view");
      const headerEl = container.createEl("div", { cls: "git-manager-header" });
      headerEl.createEl("h2", { text: "Git Repository Manager", cls: "git-manager-title" });
      const controlsEl = container.createEl("div", { cls: "git-manager-controls" });
      const refreshBtnContainer = controlsEl.createEl("div", { cls: "git-control-button" });
      this.refreshButton = new import_obsidian.ButtonComponent(refreshBtnContainer).setButtonText("\u{1F504} Refresh").setTooltip("Refresh repository status").onClick(() => this.refreshView());
      const globalActionsEl = controlsEl.createEl("div", { cls: "git-global-actions" });
      this.commitAllButton = new import_obsidian.ButtonComponent(globalActionsEl.createEl("div", { cls: "git-control-button" })).setButtonText("\u{1F4DD} Commit All").setTooltip("Commit changes to all repositories").onClick(() => __async(this, null, function* () {
        this.commitAllButton.setButtonText("\u23F3 Committing...");
        this.commitAllButton.setDisabled(true);
        this.commitAllButton.buttonEl.addClass("is-loading");
        try {
          yield this.plugin.showCommitModal();
        } finally {
          this.commitAllButton.setButtonText("\u{1F4DD} Commit All");
          this.commitAllButton.setDisabled(false);
          this.commitAllButton.buttonEl.removeClass("is-loading");
        }
      }));
      this.pushAllButton = new import_obsidian.ButtonComponent(globalActionsEl.createEl("div", { cls: "git-control-button" })).setButtonText("\u2B06\uFE0F Push All").setTooltip("Push all repositories").onClick(() => __async(this, null, function* () {
        this.pushAllButton.setButtonText("\u23F3 Pushing...");
        this.pushAllButton.setDisabled(true);
        this.pushAllButton.buttonEl.addClass("is-loading");
        try {
          yield this.plugin.gitPush();
        } finally {
          this.pushAllButton.setButtonText("\u2B06\uFE0F Push All");
          this.pushAllButton.setDisabled(false);
          this.pushAllButton.buttonEl.removeClass("is-loading");
        }
      }));
      this.pullAllButton = new import_obsidian.ButtonComponent(globalActionsEl.createEl("div", { cls: "git-control-button" })).setButtonText("\u2B07\uFE0F Pull All").setTooltip("Pull all repositories").onClick(() => __async(this, null, function* () {
        this.pullAllButton.setButtonText("\u23F3 Pulling...");
        this.pullAllButton.setDisabled(true);
        this.pullAllButton.buttonEl.addClass("is-loading");
        try {
          yield this.plugin.gitPull();
        } finally {
          this.pullAllButton.setButtonText("\u2B07\uFE0F Pull All");
          this.pullAllButton.setDisabled(false);
          this.pullAllButton.buttonEl.removeClass("is-loading");
        }
      }));
      this.repositoryContainer = container.createEl("div", { cls: "git-repository-container" });
      yield this.refreshView();
    });
  }
  refreshView() {
    return __async(this, null, function* () {
      this.refreshButton.setButtonText("\u{1F504} Refreshing...");
      this.refreshButton.setDisabled(true);
      try {
        yield this.plugin.detectRepositories();
        yield this.renderRepositories();
      } catch (error) {
        new import_obsidian.Notice(`Error refreshing repositories: ${error}`);
      } finally {
        this.refreshButton.setButtonText("\u{1F504} Refresh");
        this.refreshButton.setDisabled(false);
      }
    });
  }
  renderRepositories() {
    return __async(this, null, function* () {
      this.repositoryContainer.empty();
      if (this.plugin.repositories.length === 0) {
        const emptyEl = this.repositoryContainer.createEl("div", { cls: "git-empty-state" });
        emptyEl.createEl("p", { text: "No Git repositories found" });
        emptyEl.createEl("p", { text: "Make sure your vault or parent directory has Git repositories", cls: "git-empty-subtitle" });
        return;
      }
      for (const repo of this.plugin.repositories) {
        yield this.renderRepository(repo);
      }
    });
  }
  renderRepository(repo) {
    return __async(this, null, function* () {
      const repoEl = this.repositoryContainer.createEl("div", { cls: "git-repository-item" });
      const headerEl = repoEl.createEl("div", { cls: "git-repo-header" });
      const titleEl = headerEl.createEl("div", { cls: "git-repo-title" });
      titleEl.createEl("span", {
        text: repo.name + (repo.isParent ? " (Parent)" : ""),
        cls: "git-repo-name"
      });
      titleEl.createEl("span", {
        text: repo.path,
        cls: "git-repo-path"
      });
      const statusEl = repoEl.createEl("div", { cls: "git-repo-status" });
      statusEl.createEl("div", { text: "Loading...", cls: "git-status-loading" });
      const actionsEl = repoEl.createEl("div", { cls: "git-repo-actions" });
      const commitBtn = new import_obsidian.ButtonComponent(actionsEl.createEl("div", { cls: "git-action-button" })).setButtonText("\u{1F4DD} Commit").setTooltip(`Commit changes in ${repo.name}`).onClick(() => __async(this, null, function* () {
        commitBtn.setButtonText("\u23F3 Committing...");
        commitBtn.setDisabled(true);
        commitBtn.buttonEl.addClass("is-loading");
        try {
          yield this.commitRepository(repo);
        } finally {
          commitBtn.setButtonText("\u{1F4DD} Commit");
          commitBtn.setDisabled(false);
          commitBtn.buttonEl.removeClass("is-loading");
        }
      }));
      const pushBtn = new import_obsidian.ButtonComponent(actionsEl.createEl("div", { cls: "git-action-button" })).setButtonText("\u2B06\uFE0F Push").setTooltip(`Push ${repo.name}`).onClick(() => __async(this, null, function* () {
        pushBtn.setButtonText("\u23F3 Pushing...");
        pushBtn.setDisabled(true);
        pushBtn.buttonEl.addClass("is-loading");
        try {
          yield this.pushRepository(repo);
        } finally {
          pushBtn.setButtonText("\u2B06\uFE0F Push");
          pushBtn.setDisabled(false);
          pushBtn.buttonEl.removeClass("is-loading");
        }
      }));
      const pullBtn = new import_obsidian.ButtonComponent(actionsEl.createEl("div", { cls: "git-action-button" })).setButtonText("\u2B07\uFE0F Pull").setTooltip(`Pull ${repo.name}`).onClick(() => __async(this, null, function* () {
        pullBtn.setButtonText("\u23F3 Pulling...");
        pullBtn.setDisabled(true);
        pullBtn.buttonEl.addClass("is-loading");
        try {
          yield this.pullRepository(repo);
        } finally {
          pullBtn.setButtonText("\u2B07\uFE0F Pull");
          pullBtn.setDisabled(false);
          pullBtn.buttonEl.removeClass("is-loading");
        }
      }));
      this.loadRepositoryStatus(repo, statusEl);
    });
  }
  loadRepositoryStatus(repo, statusEl) {
    return __async(this, null, function* () {
      try {
        const status = yield this.plugin.getGitStatus(repo.path);
        statusEl.empty();
        const branchEl = statusEl.createEl("div", { cls: "git-branch-info" });
        branchEl.createEl("span", { text: `\u{1F500} ${status.branch}`, cls: "git-branch-name" });
        if (status.ahead > 0) {
          branchEl.createEl("span", { text: `\u2191${status.ahead}`, cls: "git-ahead" });
        }
        if (status.behind > 0) {
          branchEl.createEl("span", { text: `\u2193${status.behind}`, cls: "git-behind" });
        }
        const changesEl = statusEl.createEl("div", { cls: "git-changes" });
        if (status.modified.length > 0) {
          changesEl.createEl("span", {
            text: `\u{1F4DD} ${status.modified.length} modified`,
            cls: "git-modified"
          });
        }
        if (status.added.length > 0) {
          changesEl.createEl("span", {
            text: `\u2795 ${status.added.length} added`,
            cls: "git-added"
          });
        }
        if (status.deleted.length > 0) {
          changesEl.createEl("span", {
            text: `\u274C ${status.deleted.length} deleted`,
            cls: "git-deleted"
          });
        }
        if (status.untracked.length > 0) {
          changesEl.createEl("span", {
            text: `\u2753 ${status.untracked.length} untracked`,
            cls: "git-untracked"
          });
        }
        if (status.modified.length === 0 && status.added.length === 0 && status.deleted.length === 0 && status.untracked.length === 0) {
          changesEl.createEl("span", { text: "\u2705 No changes", cls: "git-clean" });
        }
      } catch (error) {
        statusEl.empty();
        statusEl.createEl("div", { text: `\u274C Error: ${error.message}`, cls: "git-error" });
      }
    });
  }
  commitRepository(repo) {
    return __async(this, null, function* () {
      const modal = new import_obsidian.Modal(this.app);
      modal.setTitle(`Commit to ${repo.name}`);
      const { contentEl } = modal;
      const messageInput = contentEl.createEl("textarea", {
        placeholder: "Enter commit message...",
        cls: "git-commit-input"
      });
      messageInput.style.width = "100%";
      messageInput.style.height = "100px";
      const buttonContainer = contentEl.createEl("div", { cls: "git-modal-buttons" });
      const commitBtn = buttonContainer.createEl("button", { text: "Commit", cls: "mod-cta" });
      commitBtn.onclick = () => __async(this, null, function* () {
        const message = messageInput.value.trim();
        if (!message) {
          new import_obsidian.Notice("Please enter a commit message");
          return;
        }
        try {
          yield this.plugin.executeGitCommand(repo.path, "add .");
          yield this.plugin.executeGitCommand(repo.path, `commit -m "${message.replace(/"/g, '\\"')}"`);
          new import_obsidian.Notice(`\u2705 Committed to ${repo.name}`);
          modal.close();
          this.refreshView();
        } catch (error) {
          new import_obsidian.Notice(`\u274C Commit failed: ${error}`);
        }
      });
      const cancelBtn = buttonContainer.createEl("button", { text: "Cancel" });
      cancelBtn.onclick = () => modal.close();
      modal.open();
      messageInput.focus();
    });
  }
  pushRepository(repo) {
    return __async(this, null, function* () {
      try {
        yield this.plugin.executeGitCommand(repo.path, "push");
        new import_obsidian.Notice(`\u2705 Pushed ${repo.name}`);
        this.refreshView();
      } catch (error) {
        new import_obsidian.Notice(`\u274C Push failed: ${error}`);
      }
    });
  }
  pullRepository(repo) {
    return __async(this, null, function* () {
      try {
        yield this.plugin.executeGitCommand(repo.path, "pull");
        new import_obsidian.Notice(`\u2705 Pulled ${repo.name}`);
        this.refreshView();
      } catch (error) {
        new import_obsidian.Notice(`\u274C Pull failed: ${error}`);
      }
    });
  }
  onClose() {
    return __async(this, null, function* () {
    });
  }
};

// src/main.ts
var execAsync = (0, import_util.promisify)(import_child_process.exec);
var MultiGitPlugin = class extends import_obsidian2.Plugin {
  constructor() {
    super(...arguments);
    this.repositories = [];
  }
  onload() {
    return __async(this, null, function* () {
      console.log("Loading Multi Git Manager plugin");
      this.registerView(
        GIT_MANAGER_VIEW_TYPE,
        (leaf) => new GitManagerView(leaf, this)
      );
      this.statusBarItem = this.addStatusBarItem();
      this.statusBarItem.setText("Git: Initializing...");
      yield this.detectRepositories();
      this.addCommand({
        id: "show-git-status",
        name: "Show Git Status",
        callback: () => this.showGitStatusModal()
      });
      this.addCommand({
        id: "git-commit",
        name: "Git Commit",
        callback: () => this.showCommitModal()
      });
      this.addCommand({
        id: "git-push",
        name: "Git Push",
        callback: () => this.gitPush()
      });
      this.addCommand({
        id: "git-pull",
        name: "Git Pull",
        callback: () => this.gitPull()
      });
      this.addCommand({
        id: "open-git-manager",
        name: "Open Git Manager",
        callback: () => this.openGitManagerView()
      });
      this.addRibbonIcon("git-branch", "Git Manager View", () => {
        this.openGitManagerView();
      });
      this.registerInterval(
        window.setInterval(() => this.updateStatusBar(), 3e4)
      );
      yield this.updateStatusBar();
    });
  }
  detectRepositories() {
    return __async(this, null, function* () {
      this.repositories = [];
      const vaultPath = this.app.vault.adapter.basePath;
      const checkGitRepo = (dirPath, name, isParent = false) => __async(this, null, function* () {
        try {
          yield execAsync("git status", { cwd: dirPath });
          this.repositories.push({ path: dirPath, name, isParent });
          return true;
        } catch (e) {
          return false;
        }
      });
      yield checkGitRepo(vaultPath, "Vault", false);
      const parentPath = path.dirname(vaultPath);
      yield checkGitRepo(parentPath, "Parent (Claude Code)", true);
      const folders = this.app.vault.getAllLoadedFiles().filter((f) => f.children).map((f) => f.path);
      for (const folder of folders) {
        const fullPath = path.join(vaultPath, folder);
        yield checkGitRepo(fullPath, folder, false);
      }
      console.log(`Detected ${this.repositories.length} Git repositories`);
    });
  }
  getGitStatus(repoPath) {
    return __async(this, null, function* () {
      const status = {
        modified: [],
        added: [],
        deleted: [],
        untracked: [],
        branch: "main",
        ahead: 0,
        behind: 0
      };
      try {
        const { stdout: statusOut } = yield execAsync("git status --porcelain", { cwd: repoPath });
        const lines = statusOut.split("\n").filter((line) => line.trim());
        for (const line of lines) {
          const fileStatus = line.substring(0, 2);
          const fileName = line.substring(3);
          if (fileStatus.includes("M")) status.modified.push(fileName);
          else if (fileStatus.includes("A")) status.added.push(fileName);
          else if (fileStatus.includes("D")) status.deleted.push(fileName);
          else if (fileStatus === "??") status.untracked.push(fileName);
        }
        const { stdout: branchOut } = yield execAsync("git branch --show-current", { cwd: repoPath });
        status.branch = branchOut.trim() || "main";
        try {
          const { stdout: aheadBehind } = yield execAsync(
            `git rev-list --left-right --count origin/${status.branch}...HEAD`,
            { cwd: repoPath }
          );
          const [behind, ahead] = aheadBehind.trim().split("	").map((n) => parseInt(n) || 0);
          status.ahead = ahead;
          status.behind = behind;
        } catch (e) {
        }
      } catch (error) {
        console.error(`Error getting git status for ${repoPath}:`, error);
      }
      return status;
    });
  }
  updateStatusBar() {
    return __async(this, null, function* () {
      let totalChanges = 0;
      for (const repo of this.repositories) {
        const status = yield this.getGitStatus(repo.path);
        totalChanges += status.modified.length + status.added.length + status.deleted.length + status.untracked.length;
      }
      this.statusBarItem.setText(`Git: ${totalChanges} changes`);
    });
  }
  openGitManagerView() {
    return __async(this, null, function* () {
      const existingLeaf = this.app.workspace.getLeavesOfType(GIT_MANAGER_VIEW_TYPE)[0];
      if (existingLeaf) {
        this.app.workspace.revealLeaf(existingLeaf);
      } else {
        const leaf = this.app.workspace.getRightLeaf(false);
        yield leaf.setViewState({ type: GIT_MANAGER_VIEW_TYPE, active: true });
        this.app.workspace.revealLeaf(leaf);
      }
    });
  }
  showGitStatusModal() {
    return __async(this, null, function* () {
      const modal = new GitStatusModal(this.app, this);
      modal.open();
    });
  }
  showCommitModal() {
    return __async(this, null, function* () {
      const modal = new GitCommitModal(this.app, this);
      modal.open();
    });
  }
  gitPush() {
    return __async(this, null, function* () {
      const modal = new GitOperationModal(this.app, this, "push");
      modal.open();
    });
  }
  gitPull() {
    return __async(this, null, function* () {
      const modal = new GitOperationModal(this.app, this, "pull");
      modal.open();
    });
  }
  executeGitCommand(repoPath, command) {
    return __async(this, null, function* () {
      try {
        const { stdout, stderr } = yield execAsync(`git ${command}`, { cwd: repoPath });
        return stdout || stderr;
      } catch (error) {
        const e = error;
        throw new Error(e.message);
      }
    });
  }
};
var GitStatusModal = class extends import_obsidian2.Modal {
  constructor(app, plugin) {
    super(app);
    this.plugin = plugin;
  }
  onOpen() {
    return __async(this, null, function* () {
      const { contentEl } = this;
      contentEl.empty();
      contentEl.createEl("h2", { text: "Git Status - All Repositories" });
      for (const repo of this.plugin.repositories) {
        const repoDiv = contentEl.createDiv({ cls: "git-repo-status" });
        repoDiv.createEl("h3", { text: `${repo.name} ${repo.isParent ? "(Parent)" : ""}` });
        const status = yield this.plugin.getGitStatus(repo.path);
        const statusInfo = repoDiv.createDiv({ cls: "git-status-info" });
        statusInfo.createEl("div", { text: `Branch: ${status.branch}` });
        if (status.ahead > 0 || status.behind > 0) {
          statusInfo.createEl("div", {
            text: `\u2191${status.ahead} \u2193${status.behind}`,
            cls: "git-sync-status"
          });
        }
        if (status.modified.length > 0) {
          const modDiv = repoDiv.createDiv();
          modDiv.createEl("strong", { text: `Modified (${status.modified.length}):` });
          status.modified.forEach((f) => modDiv.createEl("div", { text: `  M ${f}`, cls: "git-file-modified" }));
        }
        if (status.added.length > 0) {
          const addDiv = repoDiv.createDiv();
          addDiv.createEl("strong", { text: `Added (${status.added.length}):` });
          status.added.forEach((f) => addDiv.createEl("div", { text: `  A ${f}`, cls: "git-file-added" }));
        }
        if (status.deleted.length > 0) {
          const delDiv = repoDiv.createDiv();
          delDiv.createEl("strong", { text: `Deleted (${status.deleted.length}):` });
          status.deleted.forEach((f) => delDiv.createEl("div", { text: `  D ${f}`, cls: "git-file-deleted" }));
        }
        if (status.untracked.length > 0) {
          const untDiv = repoDiv.createDiv();
          untDiv.createEl("strong", { text: `Untracked (${status.untracked.length}):` });
          status.untracked.forEach((f) => untDiv.createEl("div", { text: `  ? ${f}`, cls: "git-file-untracked" }));
        }
        const totalChanges = status.modified.length + status.added.length + status.deleted.length + status.untracked.length;
        if (totalChanges === 0) {
          repoDiv.createEl("div", { text: "No changes", cls: "git-no-changes" });
        }
        repoDiv.createEl("hr");
      }
      const closeBtn = contentEl.createEl("button", { text: "Close" });
      closeBtn.onclick = () => this.close();
    });
  }
};
var GitCommitModal = class extends import_obsidian2.Modal {
  constructor(app, plugin) {
    super(app);
    this.selectedRepos = /* @__PURE__ */ new Set();
    this.plugin = plugin;
  }
  onOpen() {
    return __async(this, null, function* () {
      const { contentEl } = this;
      contentEl.empty();
      contentEl.createEl("h2", { text: "Git Commit" });
      const repoSection = contentEl.createDiv({ cls: "git-repo-selection" });
      repoSection.createEl("h3", { text: "Select Repositories:" });
      for (const repo of this.plugin.repositories) {
        const status = yield this.plugin.getGitStatus(repo.path);
        const totalChanges = status.modified.length + status.added.length + status.deleted.length + status.untracked.length;
        if (totalChanges > 0) {
          new import_obsidian2.Setting(repoSection).setName(`${repo.name} ${repo.isParent ? "(Parent)" : ""} - ${totalChanges} changes`).addToggle((toggle) => {
            toggle.onChange((value) => {
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
      const messageSection = contentEl.createDiv({ cls: "git-commit-message" });
      messageSection.createEl("h3", { text: "Commit Message:" });
      const messageInput = messageSection.createEl("textarea", {
        attr: {
          placeholder: "Enter commit message...",
          rows: "4",
          style: "width: 100%;"
        }
      });
      const buttonSection = contentEl.createDiv({ cls: "git-commit-buttons" });
      const commitBtn = buttonSection.createEl("button", { text: "Commit", cls: "mod-cta" });
      commitBtn.onclick = () => __async(this, null, function* () {
        var _a;
        const message = messageInput.value.trim();
        if (!message) {
          new import_obsidian2.Notice("Please enter a commit message");
          return;
        }
        if (this.selectedRepos.size === 0) {
          new import_obsidian2.Notice("Please select at least one repository");
          return;
        }
        for (const repoPath of this.selectedRepos) {
          try {
            yield this.plugin.executeGitCommand(repoPath, "add .");
            yield this.plugin.executeGitCommand(repoPath, `commit -m "${message.replace(/"/g, '\\"')}"`);
            const repoName = ((_a = this.plugin.repositories.find((r) => r.path === repoPath)) == null ? void 0 : _a.name) || "Repository";
            new import_obsidian2.Notice(`\u2713 Committed to ${repoName}`);
          } catch (error) {
            new import_obsidian2.Notice(`\u2717 Error committing to repository: ${error}`);
          }
        }
        this.plugin.updateStatusBar();
        this.close();
      });
      const cancelBtn = buttonSection.createEl("button", { text: "Cancel" });
      cancelBtn.onclick = () => this.close();
    });
  }
};
var GitOperationModal = class extends import_obsidian2.Modal {
  constructor(app, plugin, operation) {
    super(app);
    this.selectedRepos = /* @__PURE__ */ new Set();
    this.plugin = plugin;
    this.operation = operation;
  }
  onOpen() {
    return __async(this, null, function* () {
      const { contentEl } = this;
      contentEl.empty();
      contentEl.createEl("h2", { text: `Git ${this.operation.charAt(0).toUpperCase() + this.operation.slice(1)}` });
      const repoSection = contentEl.createDiv({ cls: "git-repo-selection" });
      repoSection.createEl("h3", { text: "Select Repositories:" });
      for (const repo of this.plugin.repositories) {
        new import_obsidian2.Setting(repoSection).setName(`${repo.name} ${repo.isParent ? "(Parent)" : ""}`).addToggle((toggle) => {
          toggle.onChange((value) => {
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
      const buttonSection = contentEl.createDiv({ cls: "git-operation-buttons" });
      const executeBtn = buttonSection.createEl("button", {
        text: this.operation.charAt(0).toUpperCase() + this.operation.slice(1),
        cls: "mod-cta"
      });
      executeBtn.onclick = () => __async(this, null, function* () {
        var _a;
        if (this.selectedRepos.size === 0) {
          new import_obsidian2.Notice("Please select at least one repository");
          return;
        }
        for (const repoPath of this.selectedRepos) {
          try {
            const result = yield this.plugin.executeGitCommand(repoPath, this.operation);
            const repoName = ((_a = this.plugin.repositories.find((r) => r.path === repoPath)) == null ? void 0 : _a.name) || "Repository";
            new import_obsidian2.Notice(`\u2713 ${this.operation} completed for ${repoName}`);
          } catch (error) {
            new import_obsidian2.Notice(`\u2717 Error during ${this.operation}: ${error}`);
          }
        }
        this.plugin.updateStatusBar();
        this.close();
      });
      const cancelBtn = buttonSection.createEl("button", { text: "Cancel" });
      cancelBtn.onclick = () => this.close();
    });
  }
};
