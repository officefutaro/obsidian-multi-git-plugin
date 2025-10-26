#!/bin/bash
# Obsidian Multi Git Manager - Auto Installer for macOS/Linux
# Usage: bash install.sh

echo "====================================="
echo " Obsidian Multi Git Manager Installer"
echo "====================================="
echo ""

# Configuration
GITEA_URL="http://192.168.68.72:3000"
REPO_OWNER="futaro"
REPO_NAME="obsidian-multi-git-plugin"
PLUGIN_NAME="multi-git-manager"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Detect OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macos"
    OBSIDIAN_CONFIG="$HOME/Library/Application Support/obsidian"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
    OBSIDIAN_CONFIG="$HOME/.config/obsidian"
else
    echo -e "${RED}Unsupported OS: $OSTYPE${NC}"
    exit 1
fi

echo -e "${CYAN}Detected OS: $OS${NC}"

# Get latest release version
echo ""
echo -e "${YELLOW}[1/5] Getting latest release information...${NC}"
RELEASES_URL="$GITEA_URL/api/v1/repos/$REPO_OWNER/$REPO_NAME/releases"

# Check if curl or wget is available
if command -v curl &> /dev/null; then
    DOWNLOADER="curl"
elif command -v wget &> /dev/null; then
    DOWNLOADER="wget"
else
    echo -e "${RED}ERROR: Neither curl nor wget is installed!${NC}"
    exit 1
fi

# Try to get releases
if [ "$DOWNLOADER" = "curl" ]; then
    RELEASES=$(curl -s "$RELEASES_URL")
else
    RELEASES=$(wget -qO- "$RELEASES_URL")
fi

# Parse latest release (simple check)
if [[ $RELEASES == *"tag_name"* ]]; then
    VERSION=$(echo "$RELEASES" | grep -o '"tag_name":"[^"]*' | head -1 | cut -d'"' -f4)
    echo -e "  ${GREEN}Found version: $VERSION${NC}"
    USE_DIRECT="false"
else
    echo -e "  ${YELLOW}No releases found. Using direct file download...${NC}"
    USE_DIRECT="true"
fi

# Find Obsidian vaults
echo ""
echo -e "${YELLOW}[2/5] Select your Obsidian Vault${NC}"

VAULTS=()

# Check default Obsidian config location
if [ -d "$OBSIDIAN_CONFIG" ]; then
    for vault in "$OBSIDIAN_CONFIG"/*; do
        if [ -d "$vault/.obsidian" ]; then
            VAULTS+=("$vault")
        fi
    done
fi

# Check common locations
COMMON_PATHS=(
    "$HOME/Documents/Obsidian"
    "$HOME/OneDrive/Documents/Obsidian"
    "$HOME/Obsidian"
    "/Users/Shared/Obsidian"
)

for path in "${COMMON_PATHS[@]}"; do
    if [ -d "$path" ]; then
        for vault in "$path"/*; do
            if [ -d "$vault/.obsidian" ]; then
                # Check if not already in list
                if [[ ! " ${VAULTS[@]} " =~ " ${vault} " ]]; then
                    VAULTS+=("$vault")
                fi
            fi
        done
    fi
done

# Display found vaults
if [ ${#VAULTS[@]} -gt 0 ]; then
    echo -e "  ${CYAN}Found Obsidian Vaults:${NC}"
    for i in "${!VAULTS[@]}"; do
        echo "    [$((i+1))] ${VAULTS[$i]}"
    done
    echo "    [0] Enter custom path"
    echo ""
    
    read -p "  Select vault number: " SELECTION
    
    if [ "$SELECTION" = "0" ]; then
        read -p "  Enter your Vault path: " VAULT_PATH
    elif [[ "$SELECTION" =~ ^[0-9]+$ ]] && [ "$SELECTION" -le "${#VAULTS[@]}" ] && [ "$SELECTION" -gt 0 ]; then
        VAULT_PATH="${VAULTS[$((SELECTION-1))]}"
    else
        echo -e "${RED}Invalid selection!${NC}"
        exit 1
    fi
else
    read -p "  Enter your Vault path: " VAULT_PATH
fi

# Expand tilde in path
VAULT_PATH="${VAULT_PATH/#\~/$HOME}"

# Validate vault path
if [ ! -d "$VAULT_PATH/.obsidian" ]; then
    echo -e "  ${RED}ERROR: Not a valid Obsidian vault! (.obsidian folder not found)${NC}"
    exit 1
fi

echo -e "  ${GREEN}Using vault: $VAULT_PATH${NC}"

# Create plugin directory
echo ""
echo -e "${YELLOW}[3/5] Creating plugin directory...${NC}"
PLUGIN_DIR="$VAULT_PATH/.obsidian/plugins/$PLUGIN_NAME"

if [ ! -d "$VAULT_PATH/.obsidian/plugins" ]; then
    mkdir -p "$VAULT_PATH/.obsidian/plugins"
fi

if [ -d "$PLUGIN_DIR" ]; then
    echo -e "  ${YELLOW}Plugin directory already exists.${NC}"
    read -p "  Overwrite existing installation? (y/n): " OVERWRITE
    if [ "$OVERWRITE" != "y" ]; then
        echo -e "  ${RED}Installation cancelled.${NC}"
        exit 0
    fi
    rm -rf "$PLUGIN_DIR"
fi

mkdir -p "$PLUGIN_DIR"
echo -e "  ${GREEN}Created: $PLUGIN_DIR${NC}"

# Download files
echo ""
echo -e "${YELLOW}[4/5] Downloading plugin files...${NC}"

FILES=("main.js" "manifest.json" "styles.css")
DOWNLOAD_SUCCESS=true

for FILE in "${FILES[@]}"; do
    echo -n "  Downloading $FILE..."
    
    if [ "$USE_DIRECT" = "true" ]; then
        FILE_URL="$GITEA_URL/$REPO_OWNER/$REPO_NAME/raw/branch/master/$FILE"
    else
        FILE_URL="$GITEA_URL/$REPO_OWNER/$REPO_NAME/raw/branch/master/$FILE"
    fi
    
    OUTPUT_PATH="$PLUGIN_DIR/$FILE"
    
    # Download file
    if [ "$DOWNLOADER" = "curl" ]; then
        curl -s -o "$OUTPUT_PATH" "$FILE_URL"
    else
        wget -q -O "$OUTPUT_PATH" "$FILE_URL"
    fi
    
    # Verify file was downloaded
    if [ -f "$OUTPUT_PATH" ]; then
        FILE_SIZE=$(stat -f%z "$OUTPUT_PATH" 2>/dev/null || stat -c%s "$OUTPUT_PATH" 2>/dev/null)
        if [ "$FILE_SIZE" -gt 0 ]; then
            echo -e " ${GREEN}OK ($FILE_SIZE bytes)${NC}"
        else
            echo -e " ${RED}ERROR (empty file)${NC}"
            DOWNLOAD_SUCCESS=false
        fi
    else
        echo -e " ${RED}ERROR (file not saved)${NC}"
        DOWNLOAD_SUCCESS=false
    fi
done

if [ "$DOWNLOAD_SUCCESS" = false ]; then
    echo ""
    echo -e "${RED}ERROR: Failed to download required files!${NC}"
    echo -e "${YELLOW}Please check your network connection and Gitea server accessibility.${NC}"
    exit 1
fi

# Final instructions
echo ""
echo -e "${GREEN}[5/5] Installation complete!${NC}"
echo ""
echo -e "${CYAN}Next steps:${NC}"
echo "  1. Restart Obsidian (close and reopen)"
echo "  2. Go to Settings -> Community plugins"
echo "  3. Turn off Safe Mode if needed"
echo "  4. Enable 'Multi Git Manager'"
echo ""
echo -e "${CYAN}The plugin is installed in:${NC}"
echo "  $PLUGIN_DIR"
echo ""

# Ask if user wants to open Obsidian
read -p "Open Obsidian now? (y/n): " OPEN_OBSIDIAN
if [ "$OPEN_OBSIDIAN" = "y" ]; then
    if [ "$OS" = "macos" ]; then
        if [ -d "/Applications/Obsidian.app" ]; then
            open "/Applications/Obsidian.app"
        else
            echo -e "${YELLOW}Could not find Obsidian.app. Please open it manually.${NC}"
        fi
    elif [ "$OS" = "linux" ]; then
        if command -v obsidian &> /dev/null; then
            obsidian &
        else
            echo -e "${YELLOW}Could not find Obsidian. Please open it manually.${NC}"
        fi
    fi
fi

echo ""
echo -e "${CYAN}Thank you for installing Multi Git Manager!${NC}"
echo "====================================="