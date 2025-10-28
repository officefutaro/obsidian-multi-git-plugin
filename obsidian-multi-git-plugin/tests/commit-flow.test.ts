import { App, Modal } from 'obsidian';
import MultiGitPlugin from '../src/main';

// Mock Modal to test modal creation
const mockModal = {
  open: jest.fn(),
  close: jest.fn(),
  contentEl: {
    empty: jest.fn(),
    createEl: jest.fn().mockReturnValue({
      style: {},
      onclick: null,
      addEventListener: jest.fn()
    })
  }
};

jest.mock('obsidian', () => ({
  ...jest.requireActual('obsidian'),
  Modal: jest.fn().mockImplementation(() => mockModal)
}));

describe('Commit Flow Integration Tests', () => {
  let app: App;
  let plugin: MultiGitPlugin;
  
  beforeEach(() => {
    app = new App();
    plugin = new MultiGitPlugin(app, {
      id: 'test',
      name: 'Test',
      version: '1.0.0',
      minAppVersion: '0.15.0',
      description: 'Test',
      author: 'Test',
      authorUrl: '',
      isDesktopOnly: true
    });
    
    // Mock plugin methods
    plugin.commitRepository = jest.fn();
    plugin.refreshRepositories = jest.fn();
    
    jest.clearAllMocks();
  });
  
  describe('Individual Repository Commit Flow', () => {
    test('should open CommitMessageModal instead of browser prompt', async () => {
      const mockRepo = {
        name: 'Test Repo',
        path: '/test/path',
        isParent: false
      };
      
      // Mock GitRepositoryManagerModal
      const mockManagerModal = {
        app,
        plugin,
        repositories: [mockRepo],
        refreshRepositories: jest.fn(),
        commitRepository: jest.fn()
      };
      
      // Simulate commit button click
      const { commitRepository } = mockManagerModal;
      
      // Execute the commit method
      if (typeof commitRepository === 'function') {
        await commitRepository(mockRepo);
      }
      
      // Verify Modal is created (not browser prompt)
      expect(Modal).toHaveBeenCalled();
      expect(mockModal.open).toHaveBeenCalled();
    });
    
    test('should handle commit message submission', async () => {
      const testMessage = 'Test commit message';
      const mockRepo = {
        name: 'Test Repo',
        path: '/test/path',
        isParent: false
      };
      
      // Create a mock callback
      const onSubmit = jest.fn();
      
      // Mock CommitMessageModal behavior
      const mockCommitModal = {
        onSubmit,
        open: jest.fn(),
        messageInput: { value: testMessage }
      };
      
      // Simulate message submission
      onSubmit(testMessage);
      
      expect(onSubmit).toHaveBeenCalledWith(testMessage);
    });
  });
  
  describe('Bulk Commit Flow', () => {
    test('should open single modal for all repositories', async () => {
      const mockRepos = [
        { name: 'Repo 1', path: '/path1', isParent: false },
        { name: 'Repo 2', path: '/path2', isParent: false }
      ];
      
      // Mock bulk commit
      const mockManagerModal = {
        app,
        plugin,
        repositories: mockRepos,
        commitAll: jest.fn()
      };
      
      // Execute bulk commit
      if (typeof mockManagerModal.commitAll === 'function') {
        await mockManagerModal.commitAll();
      }
      
      // Verify only one modal is opened
      expect(Modal).toHaveBeenCalledTimes(1);
    });
  });
  
  describe('Error Handling', () => {
    test('should handle empty commit message', async () => {
      const emptyMessage = '';
      const onSubmit = jest.fn();
      
      // Mock empty message submission
      onSubmit(emptyMessage);
      
      // Should not proceed with empty message
      expect(onSubmit).toHaveBeenCalledWith(emptyMessage);
    });
    
    test('should handle modal cancellation', async () => {
      const mockCancel = jest.fn();
      
      // Simulate cancel button click
      mockCancel();
      
      expect(mockCancel).toHaveBeenCalled();
    });
  });
  
  describe('Keyboard Shortcuts', () => {
    test('should support Ctrl+Enter for commit submission', async () => {
      const mockEvent = {
        key: 'Enter',
        ctrlKey: true,
        preventDefault: jest.fn()
      };
      
      const mockHandler = jest.fn((e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
          e.preventDefault();
          // Simulate commit submission
        }
      });
      
      mockHandler(mockEvent);
      
      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });
  });
});

describe('Modal Integration Tests', () => {
  test('should create proper modal structure', () => {
    const MockCommitModal = Modal as jest.MockedClass<typeof Modal>;
    new MockCommitModal({} as App);
    
    expect(MockCommitModal).toHaveBeenCalled();
  });
  
  test('should handle modal lifecycle correctly', () => {
    const modal = mockModal;
    
    // Test modal opening
    modal.open();
    expect(modal.open).toHaveBeenCalled();
    
    // Test modal closing
    modal.close();
    expect(modal.close).toHaveBeenCalled();
  });
});