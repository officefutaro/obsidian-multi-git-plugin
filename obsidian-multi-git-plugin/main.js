"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
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
  DEFAULT_AUTOMODE_SETTINGS: () => DEFAULT_AUTOMODE_SETTINGS,
  default: () => MultiGitPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian3 = require("obsidian");
var import_child_process = require("child_process");
var path = __toESM(require("path"));
var fs = __toESM(require("fs"));
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
      this.commitAllButton = new import_obsidian.ButtonComponent(globalActionsEl.createEl("div", { cls: "git-control-button" })).setButtonText("\u{1F4DD} Commit All").setTooltip("Commit changes to all repositories").onClick(() => {
        this.commitAllButton.setButtonText("\u23F3 Committing...");
        this.commitAllButton.setDisabled(true);
        this.commitAllButton.buttonEl.addClass("is-loading");
        setTimeout(() => __async(this, null, function* () {
          try {
            yield this.plugin.showCommitModal();
          } finally {
            this.commitAllButton.setButtonText("\u{1F4DD} Commit All");
            this.commitAllButton.setDisabled(false);
            this.commitAllButton.buttonEl.removeClass("is-loading");
          }
        }), 0);
      });
      this.pushAllButton = new import_obsidian.ButtonComponent(globalActionsEl.createEl("div", { cls: "git-control-button" })).setButtonText("\u2B06\uFE0F Push All").setTooltip("Push all repositories").onClick(() => {
        this.pushAllButton.setButtonText("\u23F3 Pushing...");
        this.pushAllButton.setDisabled(true);
        this.pushAllButton.buttonEl.addClass("is-loading");
        setTimeout(() => __async(this, null, function* () {
          try {
            yield this.plugin.gitPush();
          } finally {
            this.pushAllButton.setButtonText("\u2B06\uFE0F Push All");
            this.pushAllButton.setDisabled(false);
            this.pushAllButton.buttonEl.removeClass("is-loading");
          }
        }), 0);
      });
      this.pullAllButton = new import_obsidian.ButtonComponent(globalActionsEl.createEl("div", { cls: "git-control-button" })).setButtonText("\u2B07\uFE0F Pull All").setTooltip("Pull all repositories").onClick(() => {
        this.pullAllButton.setButtonText("\u23F3 Pulling...");
        this.pullAllButton.setDisabled(true);
        this.pullAllButton.buttonEl.addClass("is-loading");
        setTimeout(() => __async(this, null, function* () {
          try {
            yield this.plugin.gitPull();
          } finally {
            this.pullAllButton.setButtonText("\u2B07\uFE0F Pull All");
            this.pullAllButton.setDisabled(false);
            this.pullAllButton.buttonEl.removeClass("is-loading");
          }
        }), 0);
      });
      const automodeEl = controlsEl.createEl("div", { cls: "git-automode-section" });
      automodeEl.createEl("h3", { text: "Automode", cls: "git-automode-title" });
      this.automodeStatusEl = automodeEl.createEl("div", { cls: "git-automode-status" });
      this.updateAutomodeStatus();
      const automodeControlsEl = automodeEl.createEl("div", { cls: "git-automode-controls" });
      this.automodeToggleButton = new import_obsidian.ButtonComponent(automodeControlsEl.createEl("div", { cls: "git-control-button" })).setTooltip("Toggle Automode on/off").onClick(() => {
        this.plugin.automodeManager.toggleAutomode();
        this.updateAutomodeStatus();
      });
      this.automodeRunNowButton = new import_obsidian.ButtonComponent(automodeControlsEl.createEl("div", { cls: "git-control-button" })).setButtonText("\u26A1 Run Now").setTooltip("Run automode check immediately").onClick(() => {
        this.automodeRunNowButton.setButtonText("\u23F3 Running...");
        this.automodeRunNowButton.setDisabled(true);
        this.automodeRunNowButton.buttonEl.addClass("is-loading");
        setTimeout(() => __async(this, null, function* () {
          try {
            yield this.plugin.automodeManager.runNow();
          } finally {
            this.automodeRunNowButton.setButtonText("\u26A1 Run Now");
            this.automodeRunNowButton.setDisabled(false);
            this.automodeRunNowButton.buttonEl.removeClass("is-loading");
            this.updateAutomodeStatus();
          }
        }), 0);
      });
      this.repositoryContainer = container.createEl("div", { cls: "git-repository-container" });
      yield this.refreshView();
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
      const commitBtn = new import_obsidian.ButtonComponent(actionsEl.createEl("div", { cls: "git-action-button" })).setButtonText("\u{1F4DD} Commit").setTooltip(`Commit changes in ${repo.name}`).onClick(() => {
        commitBtn.setButtonText("\u23F3 Committing...");
        commitBtn.setDisabled(true);
        commitBtn.buttonEl.addClass("is-loading");
        setTimeout(() => __async(this, null, function* () {
          try {
            yield this.commitRepository(repo);
          } finally {
            commitBtn.setButtonText("\u{1F4DD} Commit");
            commitBtn.setDisabled(false);
            commitBtn.buttonEl.removeClass("is-loading");
          }
        }), 0);
      });
      const pushBtn = new import_obsidian.ButtonComponent(actionsEl.createEl("div", { cls: "git-action-button" })).setButtonText("\u2B06\uFE0F Push").setTooltip(`Push ${repo.name}`).onClick(() => {
        pushBtn.setButtonText("\u23F3 Pushing...");
        pushBtn.setDisabled(true);
        pushBtn.buttonEl.addClass("is-loading");
        setTimeout(() => __async(this, null, function* () {
          try {
            yield this.pushRepository(repo);
          } finally {
            pushBtn.setButtonText("\u2B06\uFE0F Push");
            pushBtn.setDisabled(false);
            pushBtn.buttonEl.removeClass("is-loading");
          }
        }), 0);
      });
      const pullBtn = new import_obsidian.ButtonComponent(actionsEl.createEl("div", { cls: "git-action-button" })).setButtonText("\u2B07\uFE0F Pull").setTooltip(`Pull ${repo.name}`).onClick(() => {
        pullBtn.setButtonText("\u23F3 Pulling...");
        pullBtn.setDisabled(true);
        pullBtn.buttonEl.addClass("is-loading");
        setTimeout(() => __async(this, null, function* () {
          try {
            yield this.pullRepository(repo);
          } finally {
            pullBtn.setButtonText("\u2B07\uFE0F Pull");
            pullBtn.setDisabled(false);
            pullBtn.buttonEl.removeClass("is-loading");
          }
        }), 0);
      });
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
  updateAutomodeStatus() {
    if (!this.automodeStatusEl || !this.automodeToggleButton) return;
    const isEnabled = this.plugin.automodeManager.isEnabled;
    const isActive = this.plugin.automodeManager.isActive;
    if (isEnabled) {
      this.automodeToggleButton.setButtonText("\u{1F916} Auto ON");
      this.automodeToggleButton.buttonEl.removeClass("automode-off");
      this.automodeToggleButton.buttonEl.addClass("automode-on");
    } else {
      this.automodeToggleButton.setButtonText("\u23F8\uFE0F Auto OFF");
      this.automodeToggleButton.buttonEl.removeClass("automode-on");
      this.automodeToggleButton.buttonEl.addClass("automode-off");
    }
    this.automodeStatusEl.empty();
    if (!isEnabled) {
      this.automodeStatusEl.createEl("div", {
        text: "Automode is disabled",
        cls: "automode-status-disabled"
      });
    } else if (isActive) {
      const timeUntilNext = this.plugin.automodeManager.timeUntilNextRun;
      const secondsLeft = Math.ceil(timeUntilNext / 1e3);
      this.automodeStatusEl.createEl("div", {
        text: `Automode active - Next run in ${secondsLeft}s`,
        cls: "automode-status-active"
      });
      const settingsText = `Interval: ${this.plugin.automodeSettings.interval}s | Branch: ${this.plugin.automodeSettings.useSeparateBranch ? this.plugin.automodeSettings.automodeBranchName : "current"} | Push: ${this.plugin.automodeSettings.autoPush ? "enabled" : "disabled"}`;
      this.automodeStatusEl.createEl("div", {
        text: settingsText,
        cls: "automode-status-details"
      });
    } else {
      this.automodeStatusEl.createEl("div", {
        text: "Automode enabled but not running",
        cls: "automode-status-waiting"
      });
    }
    if (isEnabled && isActive) {
      setTimeout(() => this.updateAutomodeStatus(), 1e3);
    }
  }
  refreshView() {
    return __async(this, null, function* () {
      this.refreshButton.setButtonText("\u{1F504} Refreshing...");
      this.refreshButton.setDisabled(true);
      try {
        yield this.plugin.detectRepositories();
        yield this.renderRepositories();
        this.updateAutomodeStatus();
      } catch (error) {
        new import_obsidian.Notice(`Error refreshing repositories: ${error}`);
      } finally {
        this.refreshButton.setButtonText("\u{1F504} Refresh");
        this.refreshButton.setDisabled(false);
      }
    });
  }
  onClose() {
    return __async(this, null, function* () {
    });
  }
};

// src/automode-manager.ts
var import_obsidian2 = require("obsidian");
var AutomodeManager = class {
  constructor(plugin) {
    this.automodeTimer = null;
    this.isRunning = false;
    this.nextRunTime = 0;
    this.plugin = plugin;
  }
  get isEnabled() {
    return this.plugin.automodeSettings.enabled;
  }
  get isActive() {
    return this.automodeTimer !== null;
  }
  get timeUntilNextRun() {
    if (!this.isActive) return 0;
    return Math.max(0, this.nextRunTime - Date.now());
  }
  startAutomode() {
    if (this.automodeTimer) {
      this.stopAutomode();
    }
    const intervalMs = this.plugin.automodeSettings.interval * 1e3;
    this.automodeTimer = setInterval(() => {
      this.executeAutomodeCheck();
    }, intervalMs);
    this.nextRunTime = Date.now() + intervalMs;
    this.updateStatusBar();
    if (this.plugin.automodeSettings.showNotifications) {
      new import_obsidian2.Notice(`\u{1F916} Automode started (${this.plugin.automodeSettings.interval}s interval)`);
    }
    this.plugin.log("info", `Automode started with ${this.plugin.automodeSettings.interval}s interval`);
  }
  stopAutomode() {
    if (this.automodeTimer) {
      clearInterval(this.automodeTimer);
      this.automodeTimer = null;
    }
    this.nextRunTime = 0;
    this.updateStatusBar();
    if (this.plugin.automodeSettings.showNotifications) {
      new import_obsidian2.Notice("\u23F8\uFE0F Automode stopped");
    }
    this.plugin.log("info", "Automode stopped");
  }
  toggleAutomode() {
    this.plugin.automodeSettings.enabled = !this.plugin.automodeSettings.enabled;
    if (this.plugin.automodeSettings.enabled) {
      this.startAutomode();
    } else {
      this.stopAutomode();
      if (this.plugin.automodeSettings.autoSwitchToMain) {
        this.switchAllReposToMain();
      }
    }
    this.plugin.saveSettings();
  }
  runNow() {
    return __async(this, null, function* () {
      if (this.isRunning) {
        new import_obsidian2.Notice("Automode is already running...");
        return;
      }
      yield this.executeAutomodeCheck();
    });
  }
  executeAutomodeCheck() {
    return __async(this, null, function* () {
      if (this.isRunning) {
        this.plugin.log("debug", "Automode check skipped - already running");
        return;
      }
      this.isRunning = true;
      this.updateStatusBar();
      this.plugin.log("debug", "Starting automode check...");
      try {
        let processedCount = 0;
        for (const repo of this.plugin.repositories) {
          if (this.plugin.automodeSettings.excludeRepositories.includes(repo.path)) {
            this.plugin.log("debug", `Skipping excluded repository: ${repo.name}`);
            continue;
          }
          this.plugin.log("debug", `Checking repository: ${repo.name} at ${repo.path}`);
          const hasChanges = yield this.detectChanges(repo);
          if (hasChanges) {
            this.plugin.log("info", `Auto-committing changes in ${repo.name}`);
            yield this.executeAutoCommit(repo);
            processedCount++;
          }
        }
        this.plugin.log("info", `Automode check completed: ${processedCount} repositories processed`);
        if (processedCount > 0 && this.plugin.automodeSettings.showNotifications) {
          new import_obsidian2.Notice(`\u2705 Auto-committed changes in ${processedCount} repositories`);
        }
      } catch (error) {
        this.plugin.log("error", "Automode execution error:", error);
        if (this.plugin.automodeSettings.showNotifications) {
          new import_obsidian2.Notice(`\u274C Automode error: ${error.message}`);
        }
      } finally {
        this.isRunning = false;
        this.nextRunTime = Date.now() + this.plugin.automodeSettings.interval * 1e3;
        this.updateStatusBar();
      }
    });
  }
  detectChanges(repo) {
    return __async(this, null, function* () {
      try {
        const status = yield this.plugin.getGitStatus(repo.path);
        return status.modified.length > 0 || status.added.length > 0 || status.deleted.length > 0 || status.untracked.length > 0;
      } catch (error) {
        this.plugin.log("error", `Failed to detect changes in ${repo.path}:`, error);
        return false;
      }
    });
  }
  executeAutoCommit(repo) {
    return __async(this, null, function* () {
      try {
        if (this.plugin.automodeSettings.useSeparateBranch) {
          yield this.ensureAutomodeBranch(repo);
        }
        yield this.plugin.executeGitCommand(repo.path, "add .");
        const message = yield this.generateCommitMessage(repo);
        yield this.plugin.executeGitCommand(repo.path, `commit -m "${message}"`);
        if (this.plugin.automodeSettings.autoPush) {
          const pushBranch = this.plugin.automodeSettings.useSeparateBranch ? this.plugin.automodeSettings.automodeBranchName : yield this.getCurrentBranch(repo.path);
          yield this.plugin.executeGitCommand(repo.path, `push origin ${pushBranch}`);
        }
        this.plugin.log("info", `Auto-committed changes in ${repo.name}: ${message}`);
      } catch (error) {
        this.plugin.log("error", `Failed to auto-commit in ${repo.path}:`, error);
        if (error.message.includes("CONFLICT")) {
          if (this.plugin.automodeSettings.showNotifications) {
            new import_obsidian2.Notice(`\u{1F6D1} Automode stopped due to conflict in ${repo.name}`);
          }
          this.stopAutomode();
        }
        throw error;
      }
    });
  }
  ensureAutomodeBranch(repo) {
    return __async(this, null, function* () {
      const currentBranch = yield this.getCurrentBranch(repo.path);
      const automodeBranch = this.plugin.automodeSettings.automodeBranchName;
      if (currentBranch !== automodeBranch) {
        try {
          const branches = yield this.plugin.executeGitCommand(repo.path, "branch -a");
          const branchExists = branches.includes(automodeBranch) || branches.includes(`remotes/origin/${automodeBranch}`);
          if (!branchExists) {
            yield this.plugin.executeGitCommand(repo.path, `checkout -b ${automodeBranch}`);
          } else {
            yield this.plugin.executeGitCommand(repo.path, `checkout ${automodeBranch}`);
          }
        } catch (error) {
          console.error(`Failed to switch to automode branch in ${repo.path}:`, error);
          throw error;
        }
      }
    });
  }
  switchAllReposToMain() {
    return __async(this, null, function* () {
      for (const repo of this.plugin.repositories) {
        try {
          yield this.switchToMainBranch(repo);
        } catch (error) {
          console.error(`Failed to switch ${repo.path} to main branch:`, error);
        }
      }
    });
  }
  switchToMainBranch(repo) {
    return __async(this, null, function* () {
      try {
        const mainBranch = yield this.getMainBranchName(repo.path);
        const currentBranch = yield this.getCurrentBranch(repo.path);
        if (currentBranch !== mainBranch) {
          yield this.plugin.executeGitCommand(repo.path, `checkout ${mainBranch}`);
        }
      } catch (error) {
        console.error(`Failed to switch to main branch in ${repo.path}:`, error);
        throw error;
      }
    });
  }
  getCurrentBranch(repoPath) {
    return __async(this, null, function* () {
      const result = yield this.plugin.executeGitCommand(repoPath, "branch --show-current");
      return result.trim();
    });
  }
  getMainBranchName(repoPath) {
    return __async(this, null, function* () {
      try {
        const result = yield this.plugin.executeGitCommand(repoPath, "symbolic-ref refs/remotes/origin/HEAD");
        return result.replace("refs/remotes/origin/", "").trim();
      } catch (e) {
        try {
          yield this.plugin.executeGitCommand(repoPath, "rev-parse --verify main");
          return "main";
        } catch (e2) {
          try {
            yield this.plugin.executeGitCommand(repoPath, "rev-parse --verify master");
            return "master";
          } catch (e3) {
            throw new Error("Could not determine main branch name");
          }
        }
      }
    });
  }
  generateCommitMessage(repo) {
    return __async(this, null, function* () {
      const status = yield this.plugin.getGitStatus(repo.path);
      const changedFiles = [
        ...status.modified,
        ...status.added,
        ...status.deleted,
        ...status.untracked
      ];
      const fileNames = changedFiles.map(
        (file) => file.split("/").pop() || file
      ).filter(Boolean);
      const template = this.plugin.automodeSettings.commitMessageTemplate;
      const now = /* @__PURE__ */ new Date();
      return template.replace("${files}", fileNames.join(", ")).replace("${fileCount}", fileNames.length.toString()).replace("${repo}", repo.name).replace("${timestamp}", now.toISOString()).replace("${date}", now.toISOString().split("T")[0]).replace("${time}", now.toTimeString().split(" ")[0]);
    });
  }
  updateStatusBar() {
    if (!this.plugin.statusBarItem) return;
    if (!this.isEnabled) {
      this.plugin.statusBarItem.setText("Git: Auto OFF");
    } else if (this.isRunning) {
      this.plugin.statusBarItem.setText("Git: Auto Running...");
    } else if (this.isActive) {
      const secondsLeft = Math.ceil(this.timeUntilNextRun / 1e3);
      this.plugin.statusBarItem.setText(`Git: Auto ON (${secondsLeft}s)`);
      setTimeout(() => {
        if (this.isActive && !this.isRunning) {
          this.updateStatusBar();
        }
      }, 1e3);
    } else {
      this.plugin.statusBarItem.setText("Git: Auto OFF");
    }
  }
  onSettingsChanged() {
    if (this.isActive && this.isEnabled) {
      this.stopAutomode();
      this.startAutomode();
    }
  }
  destroy() {
    this.stopAutomode();
  }
};

// src/main.ts
var execAsync = (0, import_util.promisify)(import_child_process.exec);
var DEFAULT_AUTOMODE_SETTINGS = {
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
  logLevel: "info",
  enableFileLogging: false,
  logFilePath: "multi-git-debug.log"
};
var MultiGitPlugin = class extends import_obsidian3.Plugin {
  constructor() {
    super(...arguments);
    this.repositories = [];
    this.automodeSettings = __spreadValues({}, DEFAULT_AUTOMODE_SETTINGS);
  }
  // Logger utility
  log(level, message, ...args) {
    const logLevels = { error: 0, warn: 1, info: 2, debug: 3 };
    const currentLevel = logLevels[this.automodeSettings.logLevel];
    const messageLevel = logLevels[level];
    if (messageLevel <= currentLevel) {
      const timestamp = (/* @__PURE__ */ new Date()).toISOString();
      const prefix = `[Multi-Git ${level.toUpperCase()}]`;
      const fullMessage = `${prefix} ${message}`;
      const argsStr = args.length > 0 ? " " + args.map(
        (arg) => typeof arg === "object" ? JSON.stringify(arg) : String(arg)
      ).join(" ") : "";
      console[level === "debug" ? "log" : level](fullMessage, ...args);
      if (this.automodeSettings.enableFileLogging) {
        this.writeToLogFile(`${timestamp} ${fullMessage}${argsStr}`);
      }
      if (this.automodeSettings.showNotifications && (level === "error" || level === "warn")) {
        new import_obsidian3.Notice(`${prefix} ${message}`);
      }
      if (this.automodeSettings.debugMode && level === "debug") {
        new import_obsidian3.Notice(`${prefix} ${message}`);
      }
    }
  }
  writeToLogFile(logEntry) {
    return __async(this, null, function* () {
      try {
        const vaultPath = this.app.vault.adapter.basePath;
        const logPath = path.join(vaultPath, this.automodeSettings.logFilePath);
        fs.appendFileSync(logPath, logEntry + "\n", "utf8");
      } catch (error) {
        console.error("[Multi-Git] Failed to write to log file:", error);
      }
    });
  }
  onload() {
    return __async(this, null, function* () {
      this.log("info", "Loading Multi Git Manager plugin v1.1.2.1");
      yield this.loadSettings();
      this.log("debug", "Settings loaded:", this.automodeSettings);
      this.automodeManager = new AutomodeManager(this);
      this.log("debug", "Automode manager initialized");
      this.registerView(
        GIT_MANAGER_VIEW_TYPE,
        (leaf) => new GitManagerView(leaf, this)
      );
      this.addSettingTab(new MultiGitSettingTab(this.app, this));
      this.statusBarItem = this.addStatusBarItem();
      this.statusBarItem.setText("Git: Initializing...");
      yield this.detectRepositories();
      if (this.automodeSettings.enabled) {
        this.log("info", "Starting automode on plugin load");
        this.automodeManager.startAutomode();
      } else {
        this.log("debug", "Automode disabled in settings");
      }
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
      this.addCommand({
        id: "toggle-automode",
        name: "Toggle Automode",
        callback: () => this.automodeManager.toggleAutomode()
      });
      this.addCommand({
        id: "run-automode-now",
        name: "Run Automode Now",
        callback: () => this.automodeManager.runNow()
      });
      this.addRibbonIcon("git-branch", "Git Manager View", () => {
        this.openGitManagerView();
      });
      this.registerInterval(
        window.setInterval(() => this.updateStatusBar(), 3e4)
      );
      yield this.updateStatusBar();
      this.log("info", "Multi Git Manager plugin loaded successfully");
    });
  }
  loadSettings() {
    return __async(this, null, function* () {
      const loadedData = yield this.loadData();
      this.automodeSettings = Object.assign({}, DEFAULT_AUTOMODE_SETTINGS, loadedData);
      if (this.automodeSettings.enableFileLogging === void 0) {
        this.automodeSettings.enableFileLogging = false;
      }
      if (!this.automodeSettings.logFilePath) {
        this.automodeSettings.logFilePath = "multi-git-debug.log";
      }
      if (this.automodeSettings.debugMode === void 0) {
        this.automodeSettings.debugMode = false;
      }
      if (!this.automodeSettings.logLevel) {
        this.automodeSettings.logLevel = "info";
      }
      this.log("debug", "Settings migration completed, current settings:", this.automodeSettings);
      yield this.saveSettings();
    });
  }
  saveSettings() {
    return __async(this, null, function* () {
      yield this.saveData(this.automodeSettings);
      if (this.automodeManager) {
        this.automodeManager.onSettingsChanged();
      }
    });
  }
  onunload() {
    return __async(this, null, function* () {
      console.log("Unloading Multi Git Manager plugin");
      if (this.automodeManager) {
        this.automodeManager.destroy();
      }
    });
  }
  detectRepositories() {
    return __async(this, null, function* () {
      this.log("debug", "Starting repository detection...");
      this.repositories = [];
      const vaultPath = this.app.vault.adapter.basePath;
      this.log("debug", "Vault path:", vaultPath);
      const checkGitRepo = (dirPath, name, isParent = false) => __async(this, null, function* () {
        try {
          this.log("debug", `Checking Git repository: ${dirPath}`);
          yield execAsync("git status", { cwd: dirPath });
          this.repositories.push({ path: dirPath, name, isParent });
          this.log("info", `Found Git repository: ${name} at ${dirPath}`);
          return true;
        } catch (error) {
          this.log("debug", `Not a Git repository: ${dirPath}`, error);
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
      this.log(
        "info",
        `Detected ${this.repositories.length} Git repositories:`,
        this.repositories.map((r) => `${r.name} (${r.path})`)
      );
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
        this.log("error", `Error getting git status for ${repoPath}`, error);
      }
      return status;
    });
  }
  updateStatusBar() {
    return __async(this, null, function* () {
      if (this.automodeManager) {
        return;
      }
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
var GitStatusModal = class extends import_obsidian3.Modal {
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
var GitCommitModal = class extends import_obsidian3.Modal {
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
          new import_obsidian3.Setting(repoSection).setName(`${repo.name} ${repo.isParent ? "(Parent)" : ""} - ${totalChanges} changes`).addToggle((toggle) => {
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
          new import_obsidian3.Notice("Please enter a commit message");
          return;
        }
        if (this.selectedRepos.size === 0) {
          new import_obsidian3.Notice("Please select at least one repository");
          return;
        }
        for (const repoPath of this.selectedRepos) {
          try {
            yield this.plugin.executeGitCommand(repoPath, "add .");
            yield this.plugin.executeGitCommand(repoPath, `commit -m "${message.replace(/"/g, '\\"')}"`);
            const repoName = ((_a = this.plugin.repositories.find((r) => r.path === repoPath)) == null ? void 0 : _a.name) || "Repository";
            new import_obsidian3.Notice(`\u2713 Committed to ${repoName}`);
          } catch (error) {
            new import_obsidian3.Notice(`\u2717 Error committing to repository: ${error}`);
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
var GitOperationModal = class extends import_obsidian3.Modal {
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
        new import_obsidian3.Setting(repoSection).setName(`${repo.name} ${repo.isParent ? "(Parent)" : ""}`).addToggle((toggle) => {
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
          new import_obsidian3.Notice("Please select at least one repository");
          return;
        }
        for (const repoPath of this.selectedRepos) {
          try {
            const result = yield this.plugin.executeGitCommand(repoPath, this.operation);
            const repoName = ((_a = this.plugin.repositories.find((r) => r.path === repoPath)) == null ? void 0 : _a.name) || "Repository";
            new import_obsidian3.Notice(`\u2713 ${this.operation} completed for ${repoName}`);
          } catch (error) {
            new import_obsidian3.Notice(`\u2717 Error during ${this.operation}: ${error}`);
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
var MultiGitSettingTab = class extends import_obsidian3.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Multi Git Manager Settings" });
    containerEl.createEl("h3", { text: "Automode Settings" });
    new import_obsidian3.Setting(containerEl).setName("Enable Automode").setDesc("Automatically commit and push changes at regular intervals").addToggle((toggle) => toggle.setValue(this.plugin.automodeSettings.enabled).onChange((value) => __async(this, null, function* () {
      this.plugin.automodeSettings.enabled = value;
      yield this.plugin.saveSettings();
      if (value) {
        this.plugin.automodeManager.startAutomode();
      } else {
        this.plugin.automodeManager.stopAutomode();
      }
    })));
    new import_obsidian3.Setting(containerEl).setName("Check Interval (seconds)").setDesc("How often to check for changes (5-3600 seconds)").addSlider((slider) => slider.setLimits(5, 3600, 5).setValue(this.plugin.automodeSettings.interval).setDynamicTooltip().onChange((value) => __async(this, null, function* () {
      this.plugin.automodeSettings.interval = value;
      yield this.plugin.saveSettings();
    })));
    new import_obsidian3.Setting(containerEl).setName("Auto Push").setDesc("Automatically push commits to remote repository").addToggle((toggle) => toggle.setValue(this.plugin.automodeSettings.autoPush).onChange((value) => __async(this, null, function* () {
      this.plugin.automodeSettings.autoPush = value;
      yield this.plugin.saveSettings();
    })));
    new import_obsidian3.Setting(containerEl).setName("Commit Message Template").setDesc("Template for commit messages. Available variables: ${files}, ${fileCount}, ${repo}, ${timestamp}, ${date}, ${time}").addText((text) => text.setPlaceholder("${files}").setValue(this.plugin.automodeSettings.commitMessageTemplate).onChange((value) => __async(this, null, function* () {
      this.plugin.automodeSettings.commitMessageTemplate = value || "${files}";
      yield this.plugin.saveSettings();
    })));
    new import_obsidian3.Setting(containerEl).setName("Show Notifications").setDesc("Show notifications when automode performs actions").addToggle((toggle) => toggle.setValue(this.plugin.automodeSettings.showNotifications).onChange((value) => __async(this, null, function* () {
      this.plugin.automodeSettings.showNotifications = value;
      yield this.plugin.saveSettings();
    })));
    new import_obsidian3.Setting(containerEl).setName("Use Separate Branch").setDesc("Use a dedicated branch for automode commits").addToggle((toggle) => toggle.setValue(this.plugin.automodeSettings.useSeparateBranch).onChange((value) => __async(this, null, function* () {
      this.plugin.automodeSettings.useSeparateBranch = value;
      yield this.plugin.saveSettings();
    })));
    new import_obsidian3.Setting(containerEl).setName("Automode Branch Name").setDesc("Name of the branch used for automode commits").addText((text) => text.setPlaceholder("automode").setValue(this.plugin.automodeSettings.automodeBranchName).onChange((value) => __async(this, null, function* () {
      this.plugin.automodeSettings.automodeBranchName = value || "automode";
      yield this.plugin.saveSettings();
    })));
    new import_obsidian3.Setting(containerEl).setName("Auto Switch to Main").setDesc("Automatically switch back to main branch when automode is disabled").addToggle((toggle) => toggle.setValue(this.plugin.automodeSettings.autoSwitchToMain).onChange((value) => __async(this, null, function* () {
      this.plugin.automodeSettings.autoSwitchToMain = value;
      yield this.plugin.saveSettings();
    })));
    containerEl.createEl("h3", { text: "Debug Settings" });
    new import_obsidian3.Setting(containerEl).setName("Debug Mode").setDesc("Show debug messages as notifications (for troubleshooting)").addToggle((toggle) => toggle.setValue(this.plugin.automodeSettings.debugMode).onChange((value) => __async(this, null, function* () {
      this.plugin.automodeSettings.debugMode = value;
      yield this.plugin.saveSettings();
    })));
    new import_obsidian3.Setting(containerEl).setName("Log Level").setDesc("Console logging level (check Developer Console: Ctrl+Shift+I)").addDropdown((dropdown) => dropdown.addOption("error", "Error only").addOption("warn", "Warning and above").addOption("info", "Info and above").addOption("debug", "All messages").setValue(this.plugin.automodeSettings.logLevel).onChange((value) => __async(this, null, function* () {
      this.plugin.automodeSettings.logLevel = value;
      yield this.plugin.saveSettings();
    })));
    new import_obsidian3.Setting(containerEl).setName("Enable File Logging").setDesc("Save logs to a file in your vault directory").addToggle((toggle) => toggle.setValue(this.plugin.automodeSettings.enableFileLogging).onChange((value) => __async(this, null, function* () {
      this.plugin.automodeSettings.enableFileLogging = value;
      yield this.plugin.saveSettings();
    })));
    new import_obsidian3.Setting(containerEl).setName("Log File Path").setDesc("Path to log file (relative to vault directory)").addText((text) => text.setPlaceholder("multi-git-debug.log").setValue(this.plugin.automodeSettings.logFilePath).onChange((value) => __async(this, null, function* () {
      this.plugin.automodeSettings.logFilePath = value || "multi-git-debug.log";
      yield this.plugin.saveSettings();
    })));
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DEFAULT_AUTOMODE_SETTINGS
});
