import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';

const execAsync = promisify(exec);

describe('Git Operations Integration Tests', () => {
  const testRepoPath = path.join(__dirname, '../../test-vault');
  
  describe('Git Status', () => {
    test('should check git status', async () => {
      const { stdout, stderr } = await execAsync('git status --porcelain', {
        cwd: testRepoPath
      });
      
      expect(stderr).toBe('');
      expect(typeof stdout).toBe('string');
    });
    
    test('should get current branch', async () => {
      const { stdout } = await execAsync('git branch --show-current', {
        cwd: testRepoPath
      });
      
      expect(stdout.trim()).toBeDefined();
    });
  });
  
  describe('Git Configuration', () => {
    test('should have remote configured', async () => {
      const { stdout } = await execAsync('git remote -v', {
        cwd: testRepoPath
      });
      
      expect(stdout).toContain('futaro:futaro/obsidiantest.git');
    });
    
    test('should have valid git directory', async () => {
      const { stdout } = await execAsync('git rev-parse --git-dir', {
        cwd: testRepoPath
      });
      
      expect(stdout.trim()).toContain('.git');
    });
  });
  
  describe('File Operations', () => {
    test('should track markdown files', async () => {
      const { stdout } = await execAsync('git ls-files "*.md"', {
        cwd: testRepoPath
      });
      
      const files = stdout.split('\n').filter(f => f);
      expect(files.length).toBeGreaterThan(0);
      expect(files.some(f => f.endsWith('.md'))).toBe(true);
    });
    
    test('should have proper gitignore', async () => {
      const { stdout } = await execAsync('git check-ignore .obsidian/workspace.json', {
        cwd: testRepoPath
      }).catch(err => ({ stdout: '', stderr: err.stderr }));
      
      expect(stdout).toContain('.obsidian/workspace.json');
    });
  });
  
  describe('Commit History', () => {
    test('should have commit history', async () => {
      const { stdout } = await execAsync('git log --oneline -n 5', {
        cwd: testRepoPath
      });
      
      expect(stdout).toBeDefined();
      const commits = stdout.split('\n').filter(c => c);
      expect(commits.length).toBeGreaterThan(0);
    });
    
    test('should have proper author configuration', async () => {
      const { stdout: name } = await execAsync('git config user.name', {
        cwd: testRepoPath
      }).catch(() => ({ stdout: '' }));
      
      const { stdout: email } = await execAsync('git config user.email', {
        cwd: testRepoPath
      }).catch(() => ({ stdout: '' }));
      
      expect(name.trim().length + email.trim().length).toBeGreaterThan(0);
    });
  });
});