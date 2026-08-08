# KumbhSarthi

**KumbhSarthi** is a comprehensive, real-time crowd management and pilgrim navigation platform built for the Nashik Kumbh Mela. It features live crowd density heatmaps, AI-powered route planning with Google Maps integration, IoT sensor streaming simulation, emergency SOS dispatching, location directory, and multilingual AI assistant support.

## Features

- **Live Crowd Density Map**: Real-time crowd heatmaps, sector capacity alerts, and interactive venue markers.
- **Smart Safe Route Planner**: Dynamic navigation route recommendations based on real-time crowd congestion and safety thresholds.
- **Google Maps Integration**: Direct Google Maps routing supporting both GPS live position and custom manual FROM/TO location selection.
- **Emergency SOS & Police Dispatch**: Rapid emergency alert system with instant broadcast to nearby police control rooms and medical posts.
- **Location & Ghat Directory**: Complete database of bathing ghats, parking sectors, medical camps, lost & found booths, and pilgrim amenities.
- **AI Sarthi Assistant**: Intelligent AI companion powered by Gemini API for instant query resolution in multiple local languages.

---

## Local Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd kumbhsarthi
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and configure your API keys:
   ```bash
   cp .env.example .env
   ```

   Key environment variables:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## Production Build

To create an optimized production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## Deployment

### Vercel / Netlify / Cloudflare Pages

1. Connect your repository to your hosting provider.
2. Build Settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Add Environment Variables in the hosting dashboard settings (`GEMINI_API_KEY`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
4. Deploy!

---

## License

All rights reserved — **KumbhSarthi**.
