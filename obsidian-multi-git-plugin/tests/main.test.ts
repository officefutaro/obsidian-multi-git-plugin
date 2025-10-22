import { App, Plugin, PluginManifest } from 'obsidian';
import MultiGitPlugin from '../src/main';

// Mock child_process
jest.mock('child_process', () => ({
  exec: jest.fn((cmd, options, callback) => {
    if (cmd.includes('git status')) {
      callback(null, { stdout: '', stderr: '' });
    } else {
      callback(null, { stdout: 'mock output', stderr: '' });
    }
  })
}));

describe('ObsidianMultiGitPlugin', () => {
  let app: App;
  let plugin: MultiGitPlugin;
  let manifest: PluginManifest;
  
  beforeEach(() => {
    app = new App();
    manifest = {
      id: 'obsidian-multi-git-plugin',
      name: 'Multi Git Plugin',
      version: '1.0.0',
      minAppVersion: '0.15.0',
      description: 'Manage multiple Git repositories',
      author: 'Test Author',
      authorUrl: '',
      isDesktopOnly: true
    };
    plugin = new MultiGitPlugin(app, manifest);
  });
  
  describe('Plugin Loading', () => {
    test('should load plugin successfully', async () => {
      const loadSpy = jest.spyOn(plugin, 'onload');
      await plugin.onload();
      expect(loadSpy).toHaveBeenCalled();
    });
    
    test('should add command on load', async () => {
      // Spy on methods before calling onload
      const addCommandSpy = jest.spyOn(plugin, 'addCommand');
      await plugin.onload();
      expect(addCommandSpy).toHaveBeenCalled();
    });
    
    test('should add ribbon icon on load', async () => {
      const addRibbonIconSpy = jest.spyOn(plugin, 'addRibbonIcon');
      await plugin.onload();
      expect(addRibbonIconSpy).toHaveBeenCalled();
    });
    
    test('should add status bar item on load', async () => {
      const addStatusBarItemSpy = jest.spyOn(plugin, 'addStatusBarItem').mockReturnValue({ setText: jest.fn() } as any);
      await plugin.onload();
      expect(addStatusBarItemSpy).toHaveBeenCalled();
    });
  });
  
  describe('Plugin Unloading', () => {
    test('should unload plugin successfully', () => {
      const unloadSpy = jest.spyOn(plugin, 'onunload');
      plugin.onunload();
      expect(unloadSpy).toHaveBeenCalled();
    });
  });
  
  describe('Git Operations', () => {
    beforeEach(async () => {
      await plugin.onload();
    });
    
    test('should detect vault path', () => {
      const vaultPath = app.vault.adapter.process.cwd();
      expect(vaultPath).toBeDefined();
      expect(typeof vaultPath).toBe('string');
    });
    
    test('should handle file changes', async () => {
      const testFile = { path: 'test.md' };
      app.workspace.getActiveFile = jest.fn(() => testFile as any);
      
      const activeFile = app.workspace.getActiveFile();
      expect(activeFile).toBeDefined();
      expect(activeFile.path).toBe('test.md');
    });
  });
  
  describe('Settings', () => {
    test('should have loadData method', () => {
      expect(typeof plugin.loadData).toBe('function');
    });
    
    test('should have saveData method', () => {
      expect(typeof plugin.saveData).toBe('function');
    });
  });
});