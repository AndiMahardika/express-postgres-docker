import { prisma } from "../utils/prisma";
import { Request, Response } from "express";

export const getAlquran = async (req: Request, res: Response) => {
  try {
    const surah = await prisma.surah.findMany({
      orderBy: {
        nomor: 'asc'
      }
    });
    res.status(200).json({ message: `Alquran data fetched successfully ${surah.length} surah`, status: 200, data: surah });
  } catch (err: any) {
    res.status(500).json({ message: `Internal server error: ${err.message}`, status: 500 });
  }
};

export const getSurahByNumber = async (req: Request, res: Response) => {
  try {
    const surah = await prisma.surah.findUnique({ 
      where: { 
        nomor: Number(req.params.nomor) 
      },
      include: {
        ayat: {
          orderBy: { nomorAyat: 'asc' },
          select: {
            id: true,
            surahId: true,
            nomorAyat: true,
            arab: true,
            latin: true,
            terjemah: true,
            juz: true
          }
        }
      }
    });

    if (!surah) {
      return res.status(404).json({ 
        status: false,
        message: `Surah ${req.params.nomor} not found` 
      });
    }

    // Format the response
    const formattedResponse = {
      status: true,
      nomor: surah.nomor,
      nama: surah.nama,
      jumlah_ayat: surah.totalAyat,
      nama_latin: surah.namaLatin,
      arti: surah.arti,
      tempat_turun: surah.tempatTurun.toLowerCase(),
      deskripsi: surah.deskripsi,
      audio: surah.audio,
      ayat: surah.ayat.map(ayat => ({
        id: ayat.id,
        surah: ayat.surahId,
        nomor: ayat.nomorAyat,
        ar: ayat.arab,
        tr: ayat.latin,
        idn: ayat.terjemah,
        juz: ayat.juz
      }))
    };

    res.status(200).json(formattedResponse);
  } catch (err: any) {
    res.status(500).json({ 
      status: false,
      message: `Internal server error: ${err.message}` 
    });
  }
};