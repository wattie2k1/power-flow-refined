#!/usr/bin/env bash
# Baut die Karte und kopiert das Bundle auf den HA-Server (SSH-Alias "ha").
set -euo pipefail
cd "$(dirname "$0")/.."
npm run build
DEST=/config/www/power-flow-refined
ssh ha "sudo mkdir -p $DEST && if [ -f $DEST/power-flow-refined.js ]; then sudo cp -p $DEST/power-flow-refined.js $DEST/power-flow-refined.js.bak; fi"
ssh ha "sudo tee $DEST/power-flow-refined.js >/dev/null" < dist/power-flow-refined.js
ssh ha "ls -l $DEST"
echo "Hinweis: danach die Ressource-URL mit hoeherem ?v= in HA aktualisieren."
