#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
EXPECTED_DIR="$HOME/.pi/agent"

# Verify we're in the right place
if [ "$SCRIPT_DIR" != "$EXPECTED_DIR" ]; then
  echo "Warning: This repo should be cloned to ~/.pi/agent/"
  echo "   Current location: $SCRIPT_DIR"
  echo "   Expected: $EXPECTED_DIR"
  echo ""
  echo "   Run: git clone git@github.com:HazAT/pi-config $EXPECTED_DIR"
  exit 1
fi

echo "Setting up pi-config at $EXPECTED_DIR"
echo ""

# Create settings.json if it doesn't exist
if [ ! -f "$EXPECTED_DIR/settings.json" ]; then
  echo "Creating settings.json..."
  cat > "$EXPECTED_DIR/settings.json" << 'EOF'
{
  "defaultProvider": "openai-codex",
  "defaultModel": "gpt-5.4",
  "defaultThinkingLevel": "high",
  "packages": [
    "git:github.com/nicobailon/pi-mcp-adapter",
    {
      "source": "git:github.com/HazAT/pi-smart-sessions",
      "extensions": [
        "+extensions/smart-sessions.ts"
      ]
    },
    {
      "source": "git:github.com/HazAT/pi-parallel",
      "extensions": [
        "+extension/index.ts"
      ]
    },
    "git:github.com/pasky/chrome-cdp-skill",
    "git:github.com/HazAT/glimpse",
    "npm:@tmustier/pi-agent-teams",
    "git:github.com/HazAT/pi-autoresearch"
  ],
  "hideThinkingBlock": false,
  "extensions": []
}
EOF
else
  echo "settings.json already exists — skipping creation"
  echo ""
fi

# Install packages
echo "Installing packages..."
pi install git:github.com/nicobailon/pi-mcp-adapter 2>/dev/null || echo "  pi-mcp-adapter already installed"
pi install git:github.com/HazAT/pi-smart-sessions 2>/dev/null || echo "  pi-smart-sessions already installed"
pi install git:github.com/HazAT/pi-parallel 2>/dev/null || echo "  pi-parallel already installed"
pi install git:github.com/pasky/chrome-cdp-skill 2>/dev/null || echo "  chrome-cdp-skill already installed"
pi install git:github.com/HazAT/glimpse 2>/dev/null || echo "  glimpse already installed"
pi install npm:@tmustier/pi-agent-teams 2>/dev/null || echo "  pi-agent-teams already installed"
pi install git:github.com/HazAT/pi-autoresearch 2>/dev/null || echo "  pi-autoresearch already installed"
echo ""


echo "Setup complete!"
echo ""
echo "Restart pi to pick up all changes."
