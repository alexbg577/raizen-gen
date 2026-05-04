#!/bin/bash
# Backup script for Raizen Gen bot and web

BACKUP_DIR="/tmp/raizen-gen-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "Creating backup in $BACKUP_DIR..."

# Backup bot
cp -r bot "$BACKUP_DIR/"
cp -r shared "$BACKUP_DIR/"

# Backup web
cp -r web "$BACKUP_DIR/"

# Backup config files
cp package.json "$BACKUP_DIR/"
cp render.yaml "$BACKUP_DIR/"
cp .env.example "$BACKUP_DIR/"
cp .gitignore "$BACKUP_DIR/"
cp README.md "$BACKUP_DIR/"

# Create archive
cd /tmp
tar -czf "raizen-gen-backup-$(date +%Y%m%d-%H%M%S).tar.gz" "$(basename $BACKUP_DIR)"
echo "Backup created: /tmp/raizen-gen-backup-*.tar.gz"

# Instructions
echo ""
echo "To restore:"
echo "1. Extract: tar -xzf <backup-file>.tar.gz"
echo "2. Copy files back to your project"
echo "3. Run: npm install"
echo "4. Create .env from .env.example"
echo "5. Deploy to Render"
