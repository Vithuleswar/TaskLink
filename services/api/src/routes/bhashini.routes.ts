import { Router, Request, Response } from 'express';
import { bhashiniService } from '../services/bhashini.adapter.js';

const router = Router();

/**
 * GET /api/bhashini/languages
 * Returns list of 12 supported Indic languages and their ASR/NMT/TTS capability flags
 */
router.get('/languages', (req: Request, res: Response) => {
  const languages = bhashiniService.getLanguages();
  return res.json({
    success: true,
    languages,
  });
});

/**
 * POST /api/bhashini/translate
 * Runtime dynamic text translation (chat messages, reviews, worker bios) (PPT Requirement F4)
 */
router.post('/translate', async (req: Request, res: Response) => {
  const { text, sourceLang = 'en', targetLang = 'ta' } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Text string is required for translation' });
  }

  try {
    const result = await bhashiniService.translate(text, sourceLang, targetLang);
    return res.json({
      success: true,
      ...result,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Translation failed' });
  }
});

/**
 * POST /api/bhashini/tts
 * Synthesize speech from text
 */
router.post('/tts', async (req: Request, res: Response) => {
  const { text, targetLang = 'ta', gender = 'female' } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required for TTS synthesis' });
  }

  const result = await bhashiniService.textToSpeech(text, targetLang, gender);
  return res.json({
    success: true,
    ...result,
  });
});

export default router;
