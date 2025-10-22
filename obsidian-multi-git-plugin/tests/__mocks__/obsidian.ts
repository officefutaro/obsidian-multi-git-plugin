export class App {
  vault = {
    getAbstractFileByPath: jest.fn(),
    read: jest.fn(),
    modify: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    rename: jest.fn(),
    getFiles: jest.fn(() => []),
    getMarkdownFiles: jest.fn(() => []),
    getAllLoadedFiles: jest.fn(() => [
      { children: true, path: 'test-folder' },
      { children: false, path: 'test-file.md' }
    ]),
    adapter: {
      exists: jest.fn(),
      read: jest.fn(),
      write: jest.fn(),
      mkdir: jest.fn(),
      rmdir: jest.fn(),
      remove: jest.fn(),
      list: jest.fn(),
      stat: jest.fn(),
      getResourcePath: jest.fn(),
      basePath: '/test/vault/path',
      process: {
        cwd: jest.fn(() => '/test/vault/path')
      }
    }
  };
  
  workspace = {
    getActiveFile: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
    trigger: jest.fn(),
    getLeavesOfType: jest.fn(() => []),
    getActiveViewOfType: jest.fn()
  };
  
  metadataCache = {
    getFileCache: jest.fn(),
    on: jest.fn(),
    off: jest.fn()
  };
}

export class Plugin {
  app: App;
  manifest: any;
  
  constructor(app: App, manifest: any) {
    this.app = app;
    this.manifest = manifest;
  }
  
  onload = jest.fn();
  onunload = jest.fn();
  loadData = jest.fn();
  saveData = jest.fn();
  addCommand = jest.fn();
  addRibbonIcon = jest.fn();
  addStatusBarItem = jest.fn(() => ({
    setText: jest.fn(),
    createEl: jest.fn()
  }));
  registerView = jest.fn();
  registerExtensions = jest.fn();
  registerEvent = jest.fn();
  registerInterval = jest.fn();
  registerDomEvent = jest.fn();
}

export class TFile {
  path: string;
  name: string;
  extension: string;
  vault: any;
  parent: any;
  
  constructor(path: string) {
    this.path = path;
    this.name = path.split('/').pop() || '';
    this.extension = this.name.split('.').pop() || '';
  }
}

export class TFolder {
  path: string;
  name: string;
  parent: any;
  children: any[];
  
  constructor(path: string) {
    this.path = path;
    this.name = path.split('/').pop() || '';
    this.children = [];
  }
}

export class Notice {
  message: string;
  duration?: number;
  
  constructor(message: string, duration?: number) {
    this.message = message;
    this.duration = duration;
  }
  
  setMessage = jest.fn();
  hide = jest.fn();
}

export class Modal {
  app: App;
  
  constructor(app: App) {
    this.app = app;
  }
  
  open = jest.fn();
  close = jest.fn();
  onOpen = jest.fn();
  onClose = jest.fn();
}

export class Setting {
  containerEl: HTMLElement;
  settingEl: HTMLElement;
  nameEl: HTMLElement;
  descEl: HTMLElement;
  controlEl: HTMLElement;
  
  constructor(containerEl: HTMLElement) {
    this.containerEl = containerEl;
    this.settingEl = document.createElement('div');
    this.nameEl = document.createElement('div');
    this.descEl = document.createElement('div');
    this.controlEl = document.createElement('div');
  }
  
  setName = jest.fn().mockReturnThis();
  setDesc = jest.fn().mockReturnThis();
  addText = jest.fn((cb) => {
    cb({
      setPlaceholder: jest.fn().mockReturnThis(),
      setValue: jest.fn().mockReturnThis(),
      onChange: jest.fn().mockReturnThis()
    });
    return this;
  });
  addTextArea = jest.fn().mockReturnThis();
  addButton = jest.fn((cb) => {
    cb({
      setButtonText: jest.fn().mockReturnThis(),
      setCta: jest.fn().mockReturnThis(),
      onClick: jest.fn().mockReturnThis()
    });
    return this;
  });
  addToggle = jest.fn((cb) => {
    cb({
      setValue: jest.fn().mockReturnThis(),
      onChange: jest.fn().mockReturnThis()
    });
    return this;
  });
  addDropdown = jest.fn().mockReturnThis();
  addSlider = jest.fn().mockReturnThis();
}

export const normalizePath = jest.fn((path: string) => path);
export const requestUrl = jest.fn();
export const debounce = jest.fn((fn: Function) => fn);
export const moment = jest.fn();

export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  minAppVersion: string;
  description: string;
  author: string;
  authorUrl?: string;
  isDesktopOnly?: boolean;
}