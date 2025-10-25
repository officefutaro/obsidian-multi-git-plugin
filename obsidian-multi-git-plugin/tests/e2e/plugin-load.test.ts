import * as fs from 'fs';
import * as path from 'path';

describe('E2E: Plugin Loading', () => {
  const pluginPath = path.join(__dirname, '../..');
  const testVaultPath = path.join(__dirname, '../../../test-vault');
  const pluginDestPath = path.join(testVaultPath, '.obsidian/plugins/obsidian-multi-git-plugin');
  
  beforeAll(() => {
    if (!fs.existsSync(pluginDestPath)) {
      fs.mkdirSync(pluginDestPath, { recursive: true });
    }
  });
  
  test('should have built main.js file', () => {
    const mainJsPath = path.join(pluginPath, 'main.js');
    expect(fs.existsSync(mainJsPath)).toBe(true);
    
    const content = fs.readFileSync(mainJsPath, 'utf-8');
    expect(content).toContain('MultiGitPlugin');
  });
  
  test('should have valid manifest.json', () => {
    const manifestPath = path.join(pluginPath, 'manifest.json');
    expect(fs.existsSync(manifestPath)).toBe(true);
    
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    expect(manifest.id).toBe('obsidian-multi-git');
    expect(manifest.name).toBeDefined();
    expect(manifest.version).toBeDefined();
    expect(manifest.minAppVersion).toBeDefined();
  });
  
  test('should copy plugin files to test vault', () => {
    const filesToCopy = ['main.js', 'manifest.json', 'styles.css'];
    
    filesToCopy.forEach(file => {
      const srcPath = path.join(pluginPath, file);
      const destPath = path.join(pluginDestPath, file);
      
      if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        expect(fs.existsSync(destPath)).toBe(true);
      }
    });
  });
  
  test('test vault should have proper structure', () => {
    expect(fs.existsSync(testVaultPath)).toBe(true);
    expect(fs.existsSync(path.join(testVaultPath, '.obsidian'))).toBe(true);
    expect(fs.existsSync(path.join(testVaultPath, '.git'))).toBe(true);
  });
  
  test('test vault should have test files', () => {
    const testFiles = [
      'README-TESTING.md',
      'test-note-1.md',
      'test-folder/test-note-2.md'
    ];
    
    testFiles.forEach(file => {
      const filePath = path.join(testVaultPath, file);
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });
});