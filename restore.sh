#!/bin/bash
# Skrip PostgreSQL Docker Auto Restore
# Fungsi: Stop backend, Drop/Create DB, Restore dari backup .sql.gz terbaru, Start backend.

# --- Konfigurasi Dasar ---
# Muat variabel lingkungan dari file .env
export $(grep -v '^#' /home/andi/kuliah/docker/be-tahfidz-docker-1/.env | xargs)

# Direktori dan Nama Layanan
PROJECT_DIR="/home/andi/kuliah/docker/be-tahfidz-docker-1"
BACKUP_DIR="$PROJECT_DIR/backups"
DB_SERVICE="my_postgres"          # Nama container/service Postgres di docker-compose
BACKEND_SERVICE="backend"         # Nama service backend di docker-compose
LOG_FILE="$PROJECT_DIR/restore.log"

# --- Ambil file backup terbaru ---
# Cari file .sql.gz terbaru
LATEST_BACKUP=$(ls -t "$BACKUP_DIR"/*.sql.gz 2>/dev/null | head -n 1)

if [ -z "$LATEST_BACKUP" ]; then
    echo "Tidak ada file backup ditemukan di $BACKUP_DIR" | tee -a "$LOG_FILE"
    exit 1
fi

DATE=$(date +%Y-%m-%d_%H-%M-%S)
echo "[$DATE] Memulai proses restore menggunakan $LATEST_BACKUP..." | tee -a "$LOG_FILE"

# --- 1. Hentikan backend ---
echo "[$DATE] Menghentikan backend untuk memutus koneksi DB..."
sudo docker compose stop "$BACKEND_SERVICE" | tee -a "$LOG_FILE"

# --- 2. Drop database lama ---
echo "[$DATE] Menghapus database lama ($POSTGRES_DB)..."
sudo docker exec -i "$DB_SERVICE" psql -U "$POSTGRES_USER" -d postgres -c "DROP DATABASE IF EXISTS $POSTGRES_DB;" | tee -a "$LOG_FILE"

# --- 3. Buat database baru ---
echo "[$DATE] Membuat database baru ($POSTGRES_DB)..."
sudo docker exec -i "$DB_SERVICE" psql -U "$POSTGRES_USER" -d postgres -c "CREATE DATABASE $POSTGRES_DB;" | tee -a "$LOG_FILE"

# --- 4. Restore dari backup ---
echo "[$DATE] Restore data dari file: $LATEST_BACKUP ..."
# Gunakan 'sh -c' untuk menjalankan gunzip dan pipe ke docker exec
sudo sh -c "gunzip -c '$LATEST_BACKUP' | docker exec -i $DB_SERVICE psql -U $POSTGRES_USER -d $POSTGRES_DB" | tee -a "$LOG_FILE"

# --- 5. Nyalakan kembali backend ---
echo "[$DATE] Menyalakan kembali backend..."
sudo docker compose start "$BACKEND_SERVICE" | tee -a "$LOG_FILE"

echo "[$DATE] Restore selesai! Database telah dipulihkan." | tee -a "$LOG_FILE"