# Body Coach

Your personal rehabilitation companion - a Progressive Web App for tracking and improving movement health.

## Features

### 🦵 Multi-Body Part Support
- **Knee** - Patellofemoral, meniscus, ligament issues
- **Achilles** - Tendinopathy, calf complex
- **Shoulder** - Rotator cuff, impingement, instability
- **Foot** - Plantar fascia, arch, forefoot

### 📊 Smart Tracking
- Daily readiness check-ins
- Pain and function tracking
- Progress trends and insights
- Milestone achievements

### 💪 Exercise Library
- 100+ exercises with original descriptions
- Progressive difficulty levels
- Detailed cues and common mistakes
- Equipment requirements

### 🚨 Safety System
- Red flag detection for concerning symptoms
- Severity-based alerts
- When-to-seek-care guidance

### 🤖 AI Features (Optional)
- Smart calibration conversations
- Exercise explanations
- Progress analysis
- Personalized modifications

Supports OpenAI (GPT-4) and Anthropic (Claude) - bring your own API key.

## Getting Started

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to [Vercel](https://vercel.com)
3. Deploy automatically

### Other Platforms

Works on any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- Self-hosted with Node.js

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: CSS (no external libraries)
- **Storage**: localStorage (client-side)
- **PWA**: Service Worker + Web Manifest

## Privacy

- All data stored locally on your device
- No server-side data collection
- API keys stored in browser only
- Works offline after first load

## Disclaimer

This app provides general movement and exercise information only. It is not medical advice and does not replace consultation with a qualified healthcare provider. Always consult a professional for diagnosis and treatment.

## License

MIT
