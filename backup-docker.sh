#!/bin/bash
# Backup PostgreSQL dari container Docker + simpan 3 backup terakhir + log
export $(grep -v '^#' /home/andi/kuliah/docker/be-tahfidz-docker-1/.env | xargs)

PROJECT_DIR="/home/andi/kuliah/docker/be-tahfidz-docker-1" # sesuaikan
BACKUP_DIR="$PROJECT_DIR/backups"
LOG_FILE="$PROJECT_DIR/backup.log"
DATE=$(date +%Y-%m-%d_%H-%M-%S)

DB_SERVICE="my_postgres"  # nama container db sesuai docker-compose.yml

BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_$DATE.sql.gz"
mkdir -p "$BACKUP_DIR"

echo "[$DATE] ⏳ Mulai backup database $DB_NAME dari container $DB_SERVICE..." | tee -a "$LOG_FILE"

# Gunakan docker exec untuk menjalankan pg_dump di dalam container
if docker exec -i "$DB_SERVICE" sh -c "PGPASSWORD='$DB_PASS' pg_dump -U '$DB_USER' '$DB_NAME'" | gzip > "$BACKUP_FILE"; then
    echo "[$DATE] ✅ Backup selesai: $BACKUP_FILE" | tee -a "$LOG_FILE"
else
    echo "[$DATE] ❌ Backup gagal!" | tee -a "$LOG_FILE"
    exit 1
fi

# Hapus backup lama, simpan 3 terakhir
cd "$BACKUP_DIR"
ls -1t | tail -n +4 | xargs -r rm --
echo "[$DATE] 🗑️ Backup lama dihapus, hanya tersisa 3 file terbaru." | tee -a "$LOG_FILE"