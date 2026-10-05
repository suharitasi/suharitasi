#!/bin/bash
# RESTIC-MASTER — root yedek zincirini elle tetikler (P1, 05.10.2026).
# ESKİ SÜRÜM: RESTIC_REPOSITORY'siz `restic backup` çağırıp her koşumda sahte
# "başarıyla tamamlandı" yazıyordu; cron'da 113/114 çift satır duruyordu.
# Gerçek zincir: restic-yedek.timer → restic-yedek.service
# (/root/site-tools/backup.sh; yerel + off-site + budama).
set -euo pipefail
exec sudo -n systemctl start restic-yedek.service
