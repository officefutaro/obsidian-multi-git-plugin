# Obsidian Multi Git Manager

An Obsidian plugin for managing multiple Git repositories within your vault, including parent directories.

## Features

- **Multi-Repository Support**: Automatically detects and manages multiple Git repositories in your vault
- **Parent Directory Support**: Can manage Git repositories in parent directories (e.g., for Claude Code projects)
- **Manual Commit Messages**: Full control over commit messages with Japanese language support
- **Visual Status Display**: See changes across all repositories at a glance
- **Windows Optimized**: Built and tested specifically for Windows environments

## Installation

1. Download the latest release from the Releases page
2. Extract the files to your `.obsidian/plugins/obsidian-multi-git/` folder
3. Enable the plugin in Obsidian Settings

### Manual Installation from Source

```bash
git clone https://github.com/yourusername/obsidian-multi-git-plugin.git
cd obsidian-multi-git-plugin
npm install
npm run build
```

Then copy `main.js`, `manifest.json`, and `styles.css` to your vault's `.obsidian/plugins/obsidian-multi-git/` folder.

## Usage

### Commands

- **Show Git Status** - Display the status of all Git repositories
- **Git Commit** - Stage and commit changes with a custom message
- **Git Push** - Push changes to remote repositories
- **Git Pull** - Pull changes from remote repositories

### Status Bar

The plugin adds a status indicator showing the total number of changes across all repositories.

### Ribbon Icon

Click the Git branch icon in the left ribbon to quickly access the status modal.

## Configuration

Currently, the plugin automatically detects Git repositories. Future versions will include:
- Custom repository paths
- Ignore patterns
- Default commit message templates
- Auto-commit options

## Requirements

- Git must be installed and accessible from the command line
- Obsidian desktop version (mobile not supported)
- Windows, macOS, or Linux

## Development

```bash
# Install dependencies
npm install

# Build in watch mode for development
npm run dev

# Build for production
npm run build
```

## License

MIT

## Support

If you encounter any issues or have suggestions, please file an issue on the GitHub repository.