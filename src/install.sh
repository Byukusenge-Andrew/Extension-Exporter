#!/bin/bash
# Installation script for Mac/Linux
# Change this variable if you want to install into a different IDE (e.g. 'code', 'cursor', 'windsurf')
CLI_CMD="antigravity"

echo "Installing extensions using '$CLI_CMD'..."

while IFS= read -r ext
do
  if [ -n "$ext" ]; then
    echo "Installing $ext..."
    $CLI_CMD --install-extension "$ext"
  fi
done < "extensions.txt"

echo "Done!"
