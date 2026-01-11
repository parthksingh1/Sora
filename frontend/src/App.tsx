import React, { useState } from 'react';

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

  return (
    <div>
      SORA
    </div>
  );
}
