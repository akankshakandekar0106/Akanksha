import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route 1: Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'KUMBH SARTHI Backend API',
      timestamp: new Date().toISOString(),
      iot_ready: true,
      ai_ready: !!process.env.GEMINI_API_KEY,
    });
  });

  // API Route 2: ESP32 IoT Sensor Telemetry Receiver
  app.post('/api/iot/telemetry', (req, res) => {
    try {
      const { device_id, sensor_type, people_count, location_id, battery_level } = req.body;

      if (!device_id || people_count === undefined) {
        return res.status(400).json({
          error: 'Missing required IoT parameters: device_id and people_count are required.',
        });
      }

      console.log(`[ESP32 IoT] Telemetry received from ${device_id}: ${people_count} people detected`);

      res.json({
        success: true,
        message: 'Telemetry recorded successfully',
        device_id,
        people_count,
        location_id: location_id || 'loc_ramkund',
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error('[ESP32 IoT Error]', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  });

  // API Route 3: Gemini AI Pilgrim Assistant ("AI Sarthi")
  app.post('/api/ai/guide', async (req, res) => {
    try {
      const { prompt, language = 'en', userLocation } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        // Fallback response if GEMINI_API_KEY is not set
        return res.json({
          reply:
            language === 'hi'
              ? 'नमस्ते! मैं कुम्भ सारथी एआई सहायक हूँ। रामकुंड में अभी अधिक भीड़ है, कृपया लक्ष्मण रेखा घाट का उपयोग करें। किसी भी आपात स्थिति के लिए रेड SOS बटन दबाएँ।'
              : language === 'mr'
              ? 'नमस्कार! मी कुंभ सारथी AI सहाय्यक आहे. रामकुंडावर सध्या गर्दी जास्त आहे, कृपया लक्ष्मण रेखा घाटाचा वापर करा. आपत्कालीन मदतीसाठी SOS बटण दाबा.'
              : 'Greetings! I am Kumbh Sarthi AI Assistant. Ramkund currently has high crowd density; please prefer Laxman Rekha Ghat for a safe bath. For emergencies, press the red SOS button.',
          source: 'System Local Rules Engine',
        });
      }

      const ai = new GoogleGenAI({ apiKey });

      const systemInstruction = `
You are "Kumbh Sarthi AI Assistant", an expert, empathetic, and ultra-helpful pilgrim guide for Nashik Kumbh Mela.
Language requested: ${language} (en = English, hi = Hindi, mr = Marathi).
Always answer in the requested language using polite and respectful terms (e.g. Jai Shree Ram, Har Har Gange, Namaste).
Provide clear, practical, and safety-focused advice on:
- Shahi Snan timings & auspicious dates in Nashik Godavari Ramkund.
- Safe routes avoiding crowded choke points.
- Free Annachatras (food), water stations, mobile toilets, medical posts, and parking.
- Emergency contacts (Police 112, Medical 108).
Keep answers structured with bullet points or brief paragraphs under 150 words.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.3,
        },
      });

      const replyText = response.text || 'I am Kumbh Sarthi. How can I assist your holy pilgrimage today?';

      res.json({
        reply: replyText,
        source: 'Gemini 2.5 Flash',
      });
    } catch (error: any) {
      console.error('[AI Guide Error]', error);
      res.status(500).json({
        reply:
          'Kumbh Sarthi Assistant is currently operating in offline help mode. Ramkund and Panchavati medical & police posts are open 24/7. Dial 112 or 108 for emergency support.',
        error: error.message,
      });
    }
  });

  // Vite development middleware vs Static Production serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[KUMBH SARTHI] Server running at http://localhost:${PORT}`);
  });
}

startServer();
