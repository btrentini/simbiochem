#!/usr/bin/env bash
#
# Deploy SIMBIOCHEM II to the Hostinger VPS.
#
#   ./deploy.sh
#
# Copies the provisioning script to the VPS and runs it. The provisioning
# script is idempotent, so this is also the "redeploy" command: it pulls the
# latest main from GitHub, reinstalls, rebuilds, restarts the service and
# renews/keeps the TLS certificate.
#
# Environment overrides:
#   VPS_HOST=root@1.2.3.4 ./deploy.sh     # target a different box
#
set -euo pipefail

VPS_HOST="${VPS_HOST:-root@187.77.176.24}"
REMOTE_DIR=/root
SCRIPT_NAME=provision-simbiochem.sh

# Resolve paths relative to this file, so ./deploy.sh works from any cwd.
HERE="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
LOCAL_SCRIPT="$HERE/.secrets/$SCRIPT_NAME"

log() { printf '\n\033[1;36m>> %s\033[0m\n' "$*"; }
die() { printf '\033[1;31merror: %s\033[0m\n' "$*" >&2; exit 1; }

[ -f "$LOCAL_SCRIPT" ] || die "provisioning script not found at $LOCAL_SCRIPT
It lives in .secrets/ (git-ignored) because it contains the admin password
hash and session secret. If this is a fresh clone, you need to recreate it."

# Catch quoting/syntax mistakes locally rather than halfway through a deploy.
log "Checking $SCRIPT_NAME syntax"
bash -n "$LOCAL_SCRIPT" || die "provisioning script has a syntax error"
echo "   ok"

log "Copying to $VPS_HOST:$REMOTE_DIR/"
scp "$LOCAL_SCRIPT" "$VPS_HOST:$REMOTE_DIR/"

log "Provisioning (this takes ~3-5 min on a clean box)"
# tee keeps a copy on the VPS at /root/provision.log for post-mortems.
# pipefail is set, so a failure inside the script still fails this script.
ssh "$VPS_HOST" "bash $REMOTE_DIR/$SCRIPT_NAME 2>&1 | tee $REMOTE_DIR/provision.log"

log "Deployed — https://simbiochem.com"
echo "   remote log:  ssh $VPS_HOST 'cat /root/provision.log'"
echo "   service:     ssh $VPS_HOST 'systemctl status simbiochem'"
echo "   tail logs:   ssh $VPS_HOST 'journalctl -u simbiochem -f'"
