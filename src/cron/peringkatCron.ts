import cron from 'node-cron';
import { updatePeringkatSantri } from '../services/santriService';
import { prisma } from '../utils/prisma';

// 5 menit
cron.schedule('*/5 * * * *', async () => {
  await updatePeringkatSantri();
});

// cron.schedule("0 0 * * *", async () => {
//   await updatePeringkatSantri();
// }, { timezone: "Asia/Jakarta" });

cron.schedule('*/5 * * * *', async () => {
  // console.log('Running cron job to delete expired reset tokens...');
  const now = new Date();
  try {
    const { count } = await prisma.resetToken.deleteMany({
      where: {
        expiresAt: {
          lt: now,
        },
      },
    });
    // console.log(`Deleted ${count} expired reset tokens.`);
  } catch (error) {
    console.error('Error running cron job:', error);
  }
});