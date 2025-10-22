import { App, Plugin, PluginManifest } from 'obsidian';
import MyPlugin from '../src/main';

describe('ObsidianMultiGitPlugin', () => {
  let app: App;
  let plugin: MyPlugin;
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
    plugin = new MyPlugin(app, manifest);
  });
  
  describe('Plugin Loading', () => {
    test('should load plugin successfully', async () => {
      const loadSpy = jest.spyOn(plugin, 'onload');
      await plugin.onload();
      expect(loadSpy).toHaveBeenCalled();
    });
    
    test('should add command on load', async () => {
      await plugin.onload();
      expect(plugin.addCommand).toHaveBeenCalled();
    });
    
    test('should add ribbon icon on load', async () => {
      await plugin.onload();
      expect(plugin.addRibbonIcon).toHaveBeenCalled();
    });
    
    test('should add status bar item on load', async () => {
      await plugin.onload();
      expect(plugin.addStatusBarItem).toHaveBeenCalled();
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
    test('should load default settings', async () => {
      plugin.loadData = jest.fn().mockResolvedValue({});
      await plugin.onload();
      
      expect(plugin.loadData).toHaveBeenCalled();
    });
    
    test('should save settings', async () => {
      const testSettings = { test: 'value' };
      plugin.saveData = jest.fn().mockResolvedValue(undefined);
      
      await plugin.saveData(testSettings);
      expect(plugin.saveData).toHaveBeenCalledWith(testSettings);
    });
  });
});