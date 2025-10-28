import * as fs from 'fs';
import * as path from 'path';

describe('Browser API Usage Detection', () => {
  const mainJsPath = path.join(__dirname, '..', 'main.js');
  const sourceMainPath = path.join(__dirname, '..', 'src', 'main.ts');
  const rootMainPath = path.join(__dirname, '..', '..', 'main.js');
  
  test('compiled main.js should not use browser prompt()', () => {
    if (fs.existsSync(mainJsPath)) {
      const content = fs.readFileSync(mainJsPath, 'utf8');
      expect(content).not.toMatch(/prompt\s*\(/);
    }
  });
  
  test('root main.js should not use browser prompt()', () => {
    if (fs.existsSync(rootMainPath)) {
      const content = fs.readFileSync(rootMainPath, 'utf8');
      expect(content).not.toMatch(/prompt\s*\(/);
    }
  });
  
  test('should not use browser alert()', () => {
    if (fs.existsSync(rootMainPath)) {
      const content = fs.readFileSync(rootMainPath, 'utf8');
      expect(content).not.toMatch(/alert\s*\(/);
    }
  });
  
  test('should not use browser confirm()', () => {
    if (fs.existsSync(rootMainPath)) {
      const content = fs.readFileSync(rootMainPath, 'utf8');
      expect(content).not.toMatch(/confirm\s*\(/);
    }
  });
  
  test('source TypeScript should not use browser APIs', () => {
    if (fs.existsSync(sourceMainPath)) {
      const content = fs.readFileSync(sourceMainPath, 'utf8');
      expect(content).not.toMatch(/prompt\s*\(/);
      expect(content).not.toMatch(/alert\s*\(/);
      expect(content).not.toMatch(/confirm\s*\(/);
    }
  });
  
  test('should use CommitMessageModal instead of browser APIs', () => {
    if (fs.existsSync(rootMainPath)) {
      const content = fs.readFileSync(rootMainPath, 'utf8');
      // CommitMessageModal の使用を確認
      expect(content).toMatch(/CommitMessageModal/);
    }
  });
  
  test('should use Obsidian Modal class', () => {
    if (fs.existsSync(rootMainPath)) {
      const content = fs.readFileSync(rootMainPath, 'utf8');
      expect(content).toMatch(/Modal/);
    }
  });
});

describe('Obsidian API Usage Validation', () => {
  const rootMainPath = path.join(__dirname, '..', '..', 'main.js');
  
  test('should use Obsidian Notice for user feedback', () => {
    if (fs.existsSync(rootMainPath)) {
      const content = fs.readFileSync(rootMainPath, 'utf8');
      expect(content).toMatch(/new\s+Notice\s*\(/);
    }
  });
  
  test('should extend Obsidian Plugin class', () => {
    if (fs.existsSync(rootMainPath)) {
      const content = fs.readFileSync(rootMainPath, 'utf8');
      expect(content).toMatch(/extends\s+Plugin/);
    }
  });
  
  test('should use Obsidian Modal for user input', () => {
    if (fs.existsSync(rootMainPath)) {
      const content = fs.readFileSync(rootMainPath, 'utf8');
      expect(content).toMatch(/extends\s+Modal/);
    }
  });
});