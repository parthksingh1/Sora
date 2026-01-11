# SORA - AI Travel & Lifestyle Assistant

A bilingual (English/Japanese) voice-enabled AI assistant with weather integration and intelligent conversation capabilities.

## Features

- 🎤 **Voice Recognition** - Speak naturally to interact with Sora
- 🌍 **Bilingual Support** - Seamlessly switch between English and Japanese
- 🌈 **Dual Theme** - Beautiful dark and light themes with smooth transitions
- 🌤️ **Weather Integration** - Real-time weather data with 5-day forecasts (auto-translates with language)
- 🤖 **AI-Powered Chat** - Context-aware conversations using Google's Gemini AI
- 🎨 **Beautiful UI** - Modern, animated interface with an expressive avatar
- 🔊 **Text-to-Speech** - Hear responses in your preferred language
- 📍 **Location-Aware** - Automatically detects your location for personalized weather
- 💡 **Smart Suggestions** - AI-generated follow-up questions that adapt to your language

## Project Structure

```
Soraa/
├── backend/               # Express.js API server
│   ├── src/
│   │   └── server.ts     # Main server file
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/             # React + TypeScript UI
│   ├── src/
│   │   ├── App.tsx      # Main application component
│   │   ├── main.tsx     # React entry point
│   │   └── index.css    # Global styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── .env.example
│
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Gemini API Key (from Google AI Studio)
- OpenWeather API Key (optional - default provided)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from example:
```bash
cp .env.example .env
```

4. Edit `.env` and add your API keys:
```env
GEMINI_API_KEY=your_gemini_api_key_here
WEATHER_API_KEY=ea896f5d1889d8566698c36adc91613b
PORT=3000
NODE_ENV=development
```

5. Start the development server:
```bash
npm run dev
```

The backend will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from example:
```bash
cp .env.example .env
```

4. Edit `.env` if needed (default should work):
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

5. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Usage

1. Open your browser and navigate to `http://localhost:5173`
2. Allow microphone and location permissions when prompted
3. Click the microphone button or type to start chatting with Sora
4. Use the globe icon to switch between English and Japanese
5. Click the sun/moon icon to toggle between light and dark themes
6. Click the location button to refresh weather data
7. Click on suggestion chips to quickly ask follow-up questions

## API Endpoints

### Backend API

- `GET /health` - Health check endpoint
- `POST /api/weather` - Fetch weather data
  ```json
  {
    "query": "Tokyo" | { "lat": 35.6895, "lon": 139.6917 },
    "lang": "en" | "ja"
  }
  ```

- `POST /api/extract-city` - Extract city name from user query
  ```json
  {
    "query": "What's the weather in Paris?"
  }
  ```

- `POST /api/chat` - Send message to AI assistant
  ```json
  {
    "message": "User message",
    "weather": { /* weather data */ },
    "history": [ /* previous messages */ ],
    "language": "en" | "ja"
  }
  ```

- `POST /api/translate` - Translate messages
  ```json
  {
    "messages": [{ "id": "1", "text": "Hello" }],
    "targetLanguage": "ja"
  }
  ```

- `POST /api/translate-suggestions` - Translate suggestion chips
  ```json
  {
    "suggestions": ["Check weekend?", "Best food?"],
    "targetLanguage": "ja"
  }
  ```

## Technologies Used

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide React (icons)
- Web Speech API

### Backend
- Node.js
- Express
- TypeScript
- Google Gemini AI
- OpenWeather API

## Development

### Backend Development
```bash
cd backend
npm run dev      # Start with hot reload
npm run build    # Build for production
npm start        # Run production build
```

### Frontend Development
```bash
cd frontend
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Environment Variables

### Backend (.env)
- `GEMINI_API_KEY` - Your Google Gemini API key (required)
- `WEATHER_API_KEY` - OpenWeather API key (optional)
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)

### Frontend (.env)
- `VITE_API_BASE_URL` - Backend API URL (default: http://localhost:3000/api)

## Features in Detail

### Voice Recognition
- Continuous voice recognition with auto-stop on silence
- Supports English and Japanese
- Real-time transcription display

### AI Assistant
- Context-aware conversations
- Weather-based recommendations
- Intelligent follow-up suggestions
- Bilingual support with instant translation

### Weather Integration
- Current conditions
- 5-day forecast
- Wind speed and humidity
- Location-based or city search

### Avatar Animation
- Eye-tracking mouse movement
- Expressive states (idle, listening, speaking, processing)
- Smooth transitions and animations
- Adapts to light and dark themes

### Theme System
- Dark theme with deep slate colors and emerald accents
- Light theme with sky-inspired gradients and clean whites
- Smooth color transitions (500ms)
- Persistent preference (saved to localStorage)
- All UI elements adapt to the current theme

## Browser Support

- Chrome/Edge (recommended for best voice recognition)
- Firefox (limited voice support)
- Safari (limited voice support)


