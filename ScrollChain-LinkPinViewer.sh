# Authored by Keith D. Whitfield
# Visionary Architect of ScrollChain and Symbolic Civilization

#!/bin/bash
jq '. + {
  "viewer/ScrollChain-PinViewer.html": {
    "glyph": "📌",
    "title": "Pin Viewer",
    "description": "Visual ledger of pinned scrolls",
    "gateway": "./viewer/ScrollChain-PinViewer.html"
  }
}' ScrollChain-ViewerManifest.json > tmp && mv tmp ScrollChain-ViewerManifest.json
echo "✅ Pin Viewer linked."
