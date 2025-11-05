import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from "path";
import { prisma } from './utils/prisma';

import ustadzRoutes from './routes/ustadzRoutes';
import seedRoutes from './routes/seedRoute';
import authRoutes from './routes/authRoutes';
import ortuRoutes from './routes/ortuRoutes';
import santriRoutes from './routes/santriRoutes';
import chartRoutes from './routes/chartRoutes';
import alquranRoutes from './routes/alquranRoutes';
import hafalanRoutes from './routes/hafalanRoutes';
import './cron/peringkatCron';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
}));
app.use(express.json());

// Connect DB
(async () => {
  try {
    await prisma.$connect();
    console.log("Connected to PostgreSQL via Prisma");
  } catch (err) {
    console.error("Error connecting to DB:", err);
    process.exit(1);
  }
})();

app.use("/public", express.static(path.join(__dirname, "../public")));
app.use(
  "/audio",
  express.static(path.join(__dirname, "../public/audio"), {
    maxAge: "30d",
    immutable: true,
  })
);

// Sample route
app.get('/', (req, res) => {
  res.send('Hello, Andi from Prisma!');
});

// Seed route (just run once)
app.use('/api/seed', seedRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/ustadz', ustadzRoutes);
app.use('/api/ortu', ortuRoutes);
app.use('/api/santri', santriRoutes);

// app.use('/api/surat-pilihan', suratPilihanRoutes);
app.use('/api/chart', chartRoutes);
app.use('/api/hafalan', hafalanRoutes);

// Alquran route
app.use('/api/alquran', alquranRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
