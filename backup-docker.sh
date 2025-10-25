#!/bin/bash
# ==========================================================
# 🚀 PostgreSQL Docker Backup Script
# ----------------------------------------------------------
# Fungsi:
# - Melakukan backup database PostgreSQL yang berjalan di Docker
# - Menyimpan hasil backup dalam format .sql.gz (terkompres)
# - Menyimpan log setiap aktivitas backup di backup.log
# - Hanya menyimpan 3 backup terbaru untuk hemat ruang
# ==========================================================

# 📦 Muat semua variabel dari file .env (tanpa baris komentar)
export $(grep -v '^#' /home/andi/kuliah/docker/be-tahfidz-docker-1/.env | xargs)

# 📂 Lokasi proyek dan direktori backup
PROJECT_DIR="/home/andi/kuliah/docker/be-tahfidz-docker-1"
BACKUP_DIR="$PROJECT_DIR/backups"
LOG_FILE="$PROJECT_DIR/backup.log"
DATE=$(date +%Y-%m-%d_%H-%M-%S)

# 🐘 Nama container PostgreSQL sesuai dengan docker-compose.yml
DB_SERVICE="my_postgres"

# 📄 Nama file backup hasil ekspor
BACKUP_FILE="$BACKUP_DIR/${POSTGRES_DB}_$DATE.sql.gz"

# Pastikan folder backup ada
mkdir -p "$BACKUP_DIR"

echo "[$DATE] ⏳ Mulai backup database ${POSTGRES_DB} dari container ${DB_SERVICE}..." | tee -a "$LOG_FILE"

# 🧠Jalankan pg_dump di dalam container dan kompres hasilnya
if docker exec -i "$DB_SERVICE" sh -c "PGPASSWORD='$POSTGRES_PASSWORD' pg_dump -U '$POSTGRES_USER' '$POSTGRES_DB'" | gzip > "$BACKUP_FILE"; then
    echo "[$DATE] ✅ Backup selesai: $BACKUP_FILE" | tee -a "$LOG_FILE"
else
    echo "[$DATE] ❌ Backup gagal!" | tee -a "$LOG_FILE"
    exit 1
fi

# 🗑️ Hapus backup lama, hanya simpan 3 file terbaru
cd "$BACKUP_DIR"
ls -1t | tail -n +4 | xargs -r rm --
echo "[$DATE] 🧹 Backup lama dihapus, hanya tersisa 3 file terbaru." | tee -a "$LOG_FILE"