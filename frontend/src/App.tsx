import React, { useState } from 'react';

const THEMES = {
  dark: {
    bg: 'bg-slate-900',
    text: 'text-white'
  },
  light: {
    bg: 'bg-white',
    text: 'text-slate-900'
  }
};


type Language = 'en' | 'ja';
type Theme = 'dark' | 'light';

interface DailyForecast {
  date: string;
  temp: number;
  condition: string;
}

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  isDay: boolean;
  location: string;
  description: string;
  forecast?: DailyForecast[];
}

export default function App() {
  const [language] = useState<Language>('en');
  const [theme] = useState<Theme>('dark');

  const AuraAvatar = () => {
  return (
    <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center text-white">
      AI
    </div>
  );
};


  return (
  <div className={`${THEMES[theme].bg} ${THEMES[theme].text} min-h-screen`}>
    SORA
  </div>
  <main className="flex-1 p-4 flex flex-col items-center gap-4">
  <AuraAvatar />
  <p>Chat UI coming soon</p>
</main>


  
);

}
