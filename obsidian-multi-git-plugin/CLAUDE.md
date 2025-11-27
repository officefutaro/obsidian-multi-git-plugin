# Claude Code Instructions

Please refer to: ../docs-shared/CLAUDE-MAIN.md

## Project Configuration

### Git Remote Setup
- **Primary Release Remote**: `origin` → GitHub (git@github.com:officefutaro/obsidian-multi-git-plugin.git)
- **Development Remote**: `gitea` → Local Gitea instance
- **Backup Remote**: `github` → GitHub (duplicate for safety)

### Release Process
When pushing releases:
1. Use `git push origin` for GitHub publication
2. Use `git push origin <tag>` for version tags
3. GitHub releases are the official public distribution