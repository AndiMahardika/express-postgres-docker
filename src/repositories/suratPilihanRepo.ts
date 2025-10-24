import { prisma } from '../utils/prisma';

interface SuratPilihanData {
  nameSurah: string;
}

export const createSuratPilihan = async (data: SuratPilihanData) => {
  const existingSurah = await prisma.suratPilihan.findFirst({ where: { nameSurah: data.nameSurah } });
  if (existingSurah) throw new Error('Surah already exists');

  return prisma.suratPilihan.create({
    data: {
      nameSurah: data.nameSurah,
    },
  });
};

export const getAllSuratPilihan = async () => {
  return prisma.suratPilihan.findMany();
};

export const updateSuratPilihan = async (id: number, data: SuratPilihanData) => {
  const existingSurah = await prisma.suratPilihan.findUnique({ where: { id } });
  if (!existingSurah) throw new Error('Surah not found');

  try {
    const updatedSurah = await prisma.suratPilihan.update({
      where: { id },
      data: {
        nameSurah: data.nameSurah,
      },
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const deleteSuratPilihan = async (id: number) => {
  const existingSurah = await prisma.suratPilihan.findUnique({ where: { id } });
  if (!existingSurah) throw new Error('Surah not found');

  return prisma.suratPilihan.delete({ where: { id } });
};
