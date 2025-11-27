# 📚 Documentation Guidelines
## Obsidian Multi Git Manager - Multilingual Documentation Rules

### 🌐 Supported Languages

| Language | Code | Folder | README Suffix | Status |
|----------|------|--------|---------------|--------|
| English | en | `docs/en/` | (none - default) | ✅ Complete |
| Japanese | ja | `docs/ja/` | `.ja.md` | ✅ Complete |
| Simplified Chinese | zh-CN | `docs/zh-CN/` | `.zh-CN.md` | ✅ Complete |
| Traditional Chinese (Taiwan) | zh-TW | `docs/zh-TW/` | `.zh-TW.md` | ✅ Complete |

### 📁 File Structure Rules

#### 1. **README Files Structure**
```
obsidian-multi-git-plugin/
├── README.md          # English (default)
├── README.ja.md       # Japanese
├── README.zh-CN.md    # Simplified Chinese
└── README.zh-TW.md    # Traditional Chinese
```

#### 2. **Documentation Files Structure**
```
docs/
├── en/               # English documentation
│   ├── installation.md
│   ├── quick-start.md
│   └── user-guide.md
├── ja/               # Japanese documentation
│   ├── installation.md
│   ├── quick-start.md
│   └── user-guide.md
├── zh-CN/            # Simplified Chinese documentation
│   ├── installation.md
│   ├── quick-start.md
│   └── user-guide.md
├── zh-TW/            # Traditional Chinese documentation
│   ├── installation.md
│   ├── quick-start.md
│   └── user-guide.md
└── assets/           # Shared resources
    └── images/       # Common images for all languages
```

### 🎯 Content Guidelines

#### 1. **Language Navigation**
Every document must start with language selection:
```markdown
> 🌐 [English](../en/filename.md) | [日本語](../ja/filename.md) | [简体中文](../zh-CN/filename.md) | [繁體中文](../zh-TW/filename.md)
```

#### 2. **Technical Terms Policy**
- **Keep in English**: Claude Code, Obsidian, Git, GitHub, npm, TypeScript
- **Translate**: General concepts, UI descriptions, workflow explanations
- **Consistency**: Use same technical terms across all languages

#### 3. **Professional Tone Requirements**
- Emphasize **Claude Code × Obsidian integration**
- Highlight **Lean methodology** benefits
- Maintain **professional consulting** perspective
- Credit **Futaro (OfficeFutaro)** appropriately

### 📝 Content Structure Standards

#### 1. **README Structure**
1. **Header**: Title + language navigation
2. **Badges**: Technical compatibility indicators
3. **Background**: Claude Code integration emphasis
4. **Features**: Key functionality overview
5. **Installation**: Community plugin first, manual second
6. **Use Cases**: Professional scenarios with metrics
7. **Documentation**: Links to detailed guides
8. **Developer Info**: Futaro's credentials and services
9. **Support**: Contact and contribution information

#### 2. **Documentation File Structure**
1. **Language Navigation**: At the top
2. **Table of Contents**: For longer documents
3. **Main Content**: Translated appropriately
4. **Related Links**: Cross-references to other docs
5. **Support Info**: Help and contact information

### 🔄 Maintenance Rules

#### 1. **Version Control**
- **English first**: Always update English version first
- **Translation tracking**: Document which versions are translated
- **Consistency check**: Ensure all languages have equivalent content

#### 2. **Update Workflow**
1. Update English documentation
2. Mark other languages as "needs update"
3. Translate updated content
4. Update version metadata
5. Cross-check links and references

#### 3. **Quality Assurance**
- **Link validation**: Ensure all cross-references work
- **Terminology consistency**: Maintain technical term standards
- **Format consistency**: Same structure across languages

### 🏷️ Metadata Standards

#### 1. **File Header Metadata** (Optional)
```markdown
<!--
lang: ja
version: 1.0.0
last-updated: 2025-10-29
translator: Futaro
base-version: 1.0.0
-->
```

#### 2. **Language Codes**
- Use ISO 639-1 + region codes
- `en` for English (default)
- `ja` for Japanese
- `zh-CN` for Simplified Chinese (mainland China)
- `zh-TW` for Traditional Chinese (Taiwan)

### 🛠️ Tools and Automation

#### 1. **Translation Status Check**
```bash
# Check which files need translation updates
npm run check-translations
```

#### 2. **Link Validation**
```bash
# Validate all cross-references
npm run validate-docs
```

#### 3. **Deployment Preparation**
```bash
# Prepare docs for publication
npm run prepare-docs
```

### 📊 Translation Priority

#### 1. **High Priority**
- README files (all languages)
- Installation guides
- Quick start guides

#### 2. **Medium Priority**
- User guides
- Troubleshooting docs

#### 3. **Low Priority**
- Advanced configuration
- Developer documentation

### 🎨 Formatting Standards

#### 1. **Emojis Usage**
- Consistent across all languages
- Use for section headers and emphasis
- Match original English usage

#### 2. **Code Blocks**
- Keep command examples in English
- Translate comments where appropriate
- Maintain syntax highlighting

#### 3. **Links and References**
- Use relative paths for internal links
- Absolute URLs for external resources
- Language-specific external links when available

### 🔍 Review Process

#### 1. **Content Review**
- Technical accuracy
- Language fluency
- Cultural appropriateness
- Link functionality

#### 2. **Consistency Review**
- Cross-language terminology
- Structure alignment
- Feature parity

#### 3. **Publication Checklist**
- [ ] All languages updated
- [ ] Links validated
- [ ] Metadata current
- [ ] Format consistent
- [ ] Technical terms standardized

### 📞 Support for Documentation

#### Issues and Questions
- **GitHub Issues**: Technical problems with documentation
- **Discussions**: Suggestions for improvement
- **Email**: Direct contact for translation assistance

#### Contributing Translations
1. Fork the repository
2. Create language branch if new language
3. Follow structure and content guidelines
4. Submit pull request with completed translation
5. Include language metadata and version info

---

**📋 This document should be updated whenever documentation structure or translation guidelines change.**