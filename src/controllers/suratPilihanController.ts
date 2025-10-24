import { Request, Response } from 'express';
import * as suratPilihanService from '../services/suratPilihanService';
import { SurahPilihanSchema } from '../validation/surahPilihanValidation';
import { AuthRequest } from '../middleware/auth';

export const create = async (req: Request, res: Response) => {
  try {
    const validation = SurahPilihanSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validation.error.flatten().fieldErrors,
      });
    }

    const result = await suratPilihanService.createSuratPilihan(validation.data);
    res.status(201).json({ message: 'Surah created', status: 201, data: result });
  } catch (err: any) {
    if (err.message.includes('Surah already exists')) {
      return res.status(400).json({ message: 'Surah already exists', status: 400 });
    }
    res.status(500).json({ message: 'Internal server error', status: 500 });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const result = await suratPilihanService.getAllSuratPilihan();
    res.status(200).json({ message: 'Surah retrieved', status: 200, data: result });
  } catch (err: any) {
    res.status(500).json({ message: 'Internal server error', status: 500 });
  }
};

export const update = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const validation = SurahPilihanSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validation.error.flatten().fieldErrors,
      });
    }

    const result = await suratPilihanService.updateSuratPilihan(id, validation.data);
    res.status(200).json({ message: 'Surah updated', status: 200, data: result });
  } catch (err: any) {
    if (err.message.includes('Surah not found')) {
      return res.status(404).json({ message: 'Surah not found', status: 404 });
    }
    res.status(500).json({ message: 'Internal server error', status: 500 });
  }
};

export const deleteSuratPilihan = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const result = await suratPilihanService.deleteSuratPilihan(id);
    res.status(200).json({ message: 'Surah deleted', status: 200, data: result });
  } catch (err: any) {
    if (err.message.includes('Surah not found')) {
      return res.status(404).json({ message: 'Surah not found', status: 404 });
    }
    res.status(500).json({ message: 'Internal server error', status: 500 });
  }
};


