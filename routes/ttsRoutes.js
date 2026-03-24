import express from 'express';
import { generateSpeech } from '../services/ttsService.js';

const router = express.Router();

router.post('/generate', async (req, res) => {
  const { text, voice } = req.body;

  if (!text) {
    return res.status(400).json({ success: false, message: 'Text is required' });
  }

  try {
    console.log(`Generating speech for text: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}" with voice: ${voice || 'default'}`);
    const audioData = await generateSpeech(text, voice);
    
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioData.byteLength,
    });

    res.send(Buffer.from(audioData));
  } catch (error) {
    console.error('TTS Route Error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate speech', 
      error: error.message 
    });
  }
});

export default router;
