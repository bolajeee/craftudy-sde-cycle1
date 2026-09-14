# 2026-09-15 — Week 1
(An example of a filled-in log. Copy TEMPLATE.md, not this one.)

- **Minutes:** 65
- **Worked on:** SSH keys to the VM, first half of backup.sh
- **Blocked on:** tar keeps including node_modules even with --exclude

## 3 sentences
1. Generated an ed25519 key and got passwordless SSH into the Ubuntu VM working.
2. Wrote the date-stamped filename with $(date +%F) and confirmed the archive is created.
3. The --exclude flag only works when it comes before the source path, which cost me 40 minutes.

## DSA
- Problem: Two Sum · Time: 25 min · Solved without help? yes
