# Gunakan base image Node.js
FROM node:20-alpine

# Tentukan direktori kerja di dalam container
WORKDIR /app

# Copy file package.json dan package-lock.json terlebih dahulu
# agar Docker bisa caching layer npm install
COPY package*.json ./

# Install dependencies (hanya production dependencies)
RUN npm install

# Copy semua source code ke dalam container
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build project (TypeScript → JavaScript) jika belum build
# RUN npm run build

# Expose port backend (ambil dari env PORT, default 5000)
EXPOSE 5000

# Jalankan server
CMD ["npm", "run", "start"]