#!/bin/bash

# Customize this block as needed
CUSTOM_CSS="
/* Custom background color for LaTeX PDF preview */
#viewerContainer::before {
  content: \"\";
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: #A7A7A7; /* You can replace this with any color of your choice */
  z-index: 1;
  mix-blend-mode: multiply;
  pointer-events: none; /* Allows mouse events to pass through this element */
}
"

# Identify the base extensions folder
EXTENSIONS_DIR="$HOME/.vscode-oss/extensions"

# Pattern to match latex-workshop extensions
LATEX_WORKSHOP_PATTERN="james-yu.latex-workshop-*"

# Find all matching latex-workshop versions
TARGET_DIRS=$(find "$EXTENSIONS_DIR" -type d -name "$LATEX_WORKSHOP_PATTERN" | sort -V)

for DIR in $TARGET_DIRS; do
  VIEWER_CSS_PATH="$DIR/viewer/viewer.css"

  if [ ! -f "$VIEWER_CSS_PATH" ]; then
    echo "viewer.css not found at $VIEWER_CSS_PATH"
    continue
  fi

  if grep -q "Custom background color for LaTeX PDF preview" "$VIEWER_CSS_PATH"; then
    echo "Custom CSS already applied to $VIEWER_CSS_PATH"
    continue
  fi

  echo "Patching viewer.css at $VIEWER_CSS_PATH"

  # Find the first non-comment line number
  INSERT_LINE=$(awk '/^[^[:space:]]*[^[:space:]]/ && $0 !~ /^\s*\/\*/ && $0 !~ /^\s*\*.*\*\// { print NR; exit }' "$VIEWER_CSS_PATH")

  if [ -z "$INSERT_LINE" ]; then
    # If no such line is found, just append
    echo "$CUSTOM_CSS" >> "$VIEWER_CSS_PATH"
  else
    awk -v insert_line="$INSERT_LINE" -v css="$CUSTOM_CSS" '
      NR == insert_line { print css }
      { print }
    ' "$VIEWER_CSS_PATH" > "$VIEWER_CSS_PATH.tmp" && mv "$VIEWER_CSS_PATH.tmp" "$VIEWER_CSS_PATH"
  fi

  echo "Patch complete for $VIEWER_CSS_PATH"
done

