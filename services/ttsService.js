import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export const generateSpeech = async (text, voice = process.env.ELEVENLABS_VOICE_ID || 'XgQWNZcJ8SRkxXwwhPTo') => {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  
  if (!apiKey) {
    throw new Error('ELEVENLABS_API_KEY is not defined in environment variables');
  }

  try {
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voice}`;
    
    const response = await axios.post(
      url,
      {
        text: text,
        model_id: "eleven_v3",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true
        }
      },
      {
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          'accept': 'audio/mpeg'
        },
        responseType: 'arraybuffer'
      }
    );

    return Buffer.from(response.data);
  } catch (error) {
    if (error.response && error.response.data) {
      let errorData = error.response.data;
      if (errorData instanceof ArrayBuffer || errorData instanceof Buffer) {
        errorData = JSON.parse(Buffer.from(errorData).toString());
      }
      console.error('ElevenLabs TTS Error:', JSON.stringify(errorData, null, 2));
      throw new Error(`ElevenLabs API Error: ${errorData.detail?.message || 'Unknown error'}`);
    }
    console.error('Error generating speech with ElevenLabs:', error.message);
    throw error;
  }
};
