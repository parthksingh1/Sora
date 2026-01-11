import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Mic,
  Send,
  Globe,
  MapPin,
  Wind,
  Droplets,
  Sun,
  Moon,
  RefreshCw,
  Sparkles,
  Volume2,
  VolumeX,
  Trash2,
  Loader2,
  Cloud,
  Square,
  Navigation,
  LocateFixed,
  ArrowRight,
  Info,
  X
} from 'lucide-react';

/**
 * CONFIGURATION
 */
// const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
const API_BASE_URL = "/api";


/**
 * TYPES
 */
type Language = 'en' | 'ja';
type Role = 'user' | 'assistant';
type AppState = 'idle' | 'listening' | 'processing' | 'speaking' | 'translating';
type Theme = 'dark' | 'light';

interface Message {
  id: string;
  role: Role;
  text: string;
  timestamp: number;
  weatherContext?: WeatherData;
  suggestions?: string[];
  isStreaming?: boolean;
  displayText?: string;
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
  isDefault?: boolean;
}

interface DailyForecast {
  date: string;
  temp: number;
  condition: string;
}

// Enhanced Theme System with Better Colors and Glassy Effects
const THEMES = {
  dark: {
    bg: 'bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950',
    card: 'bg-slate-800/60 backdrop-blur-xl',
    cardBorder: 'border-slate-700/50',
    primary: 'text-emerald-400',
    primaryBg: 'bg-emerald-500',
    secondary: 'text-slate-400',
    text: 'text-slate-100',
    textMuted: 'text-slate-400',
    userBubble: 'bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-lg backdrop-blur-sm',
    botBubble: 'bg-slate-800/70 backdrop-blur-xl border border-emerald-500/30 text-slate-100 shadow-xl',
    headerBg: 'bg-slate-900/60 backdrop-blur-xl',
    inputBg: 'bg-slate-800/60 backdrop-blur-xl',
    inputBorder: 'border-slate-600/50',
    weatherCard: 'bg-slate-800/70 backdrop-blur-xl border-slate-600/50',
    avatarBg: 'bg-gradient-to-br from-slate-800 to-emerald-900',
    avatarBorder: 'border-emerald-400',
    glowColor: 'bg-emerald-500/20',
    selection: 'selection:bg-emerald-500/30',
    suggestionBg: 'bg-slate-700/60 backdrop-blur-sm',
    suggestionBorder: 'border-slate-600/50',
    suggestionHover: 'hover:bg-emerald-500/20 hover:border-emerald-500/50',
    boldText: 'text-emerald-300',
    processingDot: 'bg-emerald-400',
    modalBg: 'bg-slate-900/95 backdrop-blur-xl',
    modalOverlay: 'bg-black/60',
  },
  light: {
    bg: 'bg-gradient-to-br from-sky-100 via-white to-emerald-100',
    card: 'bg-white/70 backdrop-blur-xl',
    cardBorder: 'border-slate-200/60',
    primary: 'text-emerald-700',
    primaryBg: 'bg-emerald-500',
    secondary: 'text-slate-600',
    text: 'text-slate-800',
    textMuted: 'text-slate-600',
    userBubble: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl backdrop-blur-sm',
    botBubble: 'bg-white/80 backdrop-blur-xl border-2 border-slate-300/60 text-slate-800 shadow-2xl',
    headerBg: 'bg-white/70 backdrop-blur-xl shadow-sm',
    inputBg: 'bg-white/60 backdrop-blur-xl',
    inputBorder: 'border-slate-300/60',
    weatherCard: 'bg-gradient-to-br from-white/80 to-emerald-50/80 backdrop-blur-xl border-emerald-300/60',
    avatarBg: 'bg-gradient-to-br from-emerald-100 to-teal-100',
    avatarBorder: 'border-emerald-500',
    glowColor: 'bg-emerald-400/20',
    selection: 'selection:bg-emerald-200',
    suggestionBg: 'bg-gradient-to-r from-emerald-100/80 to-teal-100/80 backdrop-blur-sm',
    suggestionBorder: 'border-emerald-300/60',
    suggestionHover: 'hover:bg-gradient-to-r hover:from-emerald-200/90 hover:to-teal-200/90 hover:border-emerald-400 hover:shadow-lg',
    boldText: 'text-emerald-700',
    processingDot: 'bg-emerald-500',
    modalBg: 'bg-white/95 backdrop-blur-xl',
    modalOverlay: 'bg-slate-900/40',
  }
};

// UI Translations
const UI_TEXT = {
  en: {
    localConditions: "Local Conditions",
    wind: "Wind",
    humidity: "Humidity",
    locating: "Locating...",
    retry: "Retry",
    enableLocation: "Enable Location",
    listening: "Listening...",
    recording: "Recording",
    voiceActive: "Voice Active",
    tapSpeak: "Tap to speak...",
    stopSpeaking: "Stop Speaking",
    clearHistory: "Clear History",
    weatherUnavailable: "Weather unavailable",
    locationDenied: "Location Denied",
    usingDefault: "Using Default",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    aboutTitle: "About SORA",
    aboutTagline: "Your AI Travel Companion",
    aboutDescription: "SORA is an intelligent bilingual travel assistant powered by Google Gemini AI. It provides personalized travel recommendations, real-time weather updates, and seamless voice interactions in both English and Japanese.",
    aboutFeatures: "Key Features",
    aboutFeatureVoice: "Voice Recognition",
    aboutFeatureVoiceDesc: "Speak naturally in English or Japanese",
    aboutFeatureWeather: "Real-time Weather",
    aboutFeatureWeatherDesc: "Location-based weather updates",
    aboutFeatureAI: "AI-Powered Chat",
    aboutFeatureAIDesc: "Intelligent travel recommendations",
    aboutFeatureBilingual: "Bilingual Support",
    aboutFeatureBilingualDesc: "Seamless EN/JA translation",
    aboutFeatureTheme: "Dual Themes",
    aboutFeatureThemeDesc: "Beautiful dark & light modes",
    aboutHowToUse: "How to Use",
    aboutStep1: "Voice Input",
    aboutStep1Desc: "Tap the microphone button and speak your question. SORA will automatically detect silence and process your input.",
    aboutStep2: "Language Switch",
    aboutStep2Desc: "Click the language toggle (EN/JA) to switch between English and Japanese. All messages and suggestions will be translated automatically.",
    aboutStep3: "Theme Toggle",
    aboutStep3Desc: "Use the sun/moon icon to switch between light and dark themes. Your preference will be saved.",
    aboutStep4: "Audio Control",
    aboutStep4Desc: "Toggle the speaker icon to enable/disable AI voice responses. When enabled, SORA will read responses aloud.",
    aboutStep5: "Weather Updates",
    aboutStep5Desc: "Click 'Enable Location' to get weather for your current location, or ask about any city's weather.",
    aboutClose: "Close",
    readAloud: "Read Aloud"
  },
  ja: {
    localConditions: "現地の状況",
    wind: "風速",
    humidity: "湿度",
    locating: "測位中...",
    retry: "再試行",
    enableLocation: "位置情報を有効化",
    listening: "聞いています...",
    recording: "録音中",
    voiceActive: "音声有効",
    tapSpeak: "タップして話す...",
    stopSpeaking: "読み上げ停止",
    clearHistory: "履歴を消去",
    weatherUnavailable: "天気情報なし",
    locationDenied: "位置情報拒否",
    usingDefault: "デフォルト",
    lightMode: "ライトモード",
    darkMode: "ダークモード",
    aboutTitle: "SORAについて",
    aboutTagline: "あなたのAI旅行コンパニオン",
    aboutDescription: "SORAは、Google Gemini AIを搭載したインテリジェントな二言語対応旅行アシスタントです。パーソナライズされた旅行の推奨事項、リアルタイムの天気更新、および英語と日本語でのシームレスな音声インタラクションを提供します。",
    aboutFeatures: "主な機能",
    aboutFeatureVoice: "音声認識",
    aboutFeatureVoiceDesc: "英語または日本語で自然に話す",
    aboutFeatureWeather: "リアルタイム天気",
    aboutFeatureWeatherDesc: "位置ベースの天気更新",
    aboutFeatureAI: "AI搭載チャット",
    aboutFeatureAIDesc: "インテリジェントな旅行推奨",
    aboutFeatureBilingual: "二言語対応",
    aboutFeatureBilingualDesc: "シームレスな英日翻訳",
    aboutFeatureTheme: "デュアルテーマ",
    aboutFeatureThemeDesc: "美しいダーク＆ライトモード",
    aboutHowToUse: "使い方",
    aboutStep1: "音声入力",
    aboutStep1Desc: "マイクボタンをタップして質問を話してください。SORAは自動的に無音を検出して入力を処理します。",
    aboutStep2: "言語切り替え",
    aboutStep2Desc: "言語トグル（EN/JA）をクリックして英語と日本語を切り替えます。すべてのメッセージと提案が自動的に翻訳されます。",
    aboutStep3: "テーマ切り替え",
    aboutStep3Desc: "太陽/月のアイコンを使用してライトテーマとダークテーマを切り替えます。設定は保存されます。",
    aboutStep4: "音声制御",
    aboutStep4Desc: "スピーカーアイコンを切り替えてAI音声応答を有効/無効にします。有効にすると、SORAが応答を音読します。",
    aboutStep5: "天気更新",
    aboutStep5Desc: "「位置情報を有効化」をクリックして現在地の天気を取得するか、任意の都市の天気を尋ねてください。",
    aboutClose: "閉じる",
    readAloud: "読み上げ"
  }
};

/**
 * UTILITIES
 */
const generateId = () => Math.random().toString(36).substring(2, 9);

const cleanTextForSpeech = (text: string) => {
  return text
    .replace(/###/g, '')
    .replace(/##/g, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/__/g, '')
    .replace(/`/g, '')
    .replace(/#/g, '')
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}]/gu, '');
};

const FormattedText = ({ text, theme }: { text: string, theme: Theme }) => {
  const THEME = THEMES[theme];
  const lines = text.split('\n');
  return (
    <span>
      {lines.map((line, i) => {
        let content = line;
        let isHeader = false;
        if (line.trim().startsWith('###') || line.trim().startsWith('##')) {
          content = line.replace(/^#+\s*/, '');
          isHeader = true;
        }

        const parts = content.split(/(\*\*.*?\*\*)/g);

        return (
          <span key={i} className={isHeader ? "block mt-2 mb-1" : "block mb-1"}>
            {parts.map((part, j) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={j} className={`font-bold ${THEME.boldText}`}>{part.slice(2, -2)}</strong>;
              }
              return <span key={j} className={isHeader ? `font-bold ${THEME.boldText}` : ""}>{part}</span>;
            })}
          </span>
        );
      })}
    </span>
  );
};

// --- ENHANCED AVATAR WITH THEME SUPPORT 
const AuraAvatar = ({ state, scale = 1, theme }: { state: AppState, scale?: number, theme: Theme }) => {
  const [pupilPos, setPupilPos] = useState({ x: 0, y: 0 });
  const THEME = THEMES[theme];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      const deltaX = (e.clientX - centerX) / 30;
      const deltaY = (e.clientY - centerY) / 30;

      const limit = 5;

      setPupilPos({
        x: Math.max(-limit, Math.min(limit, deltaX)),
        y: Math.max(-limit, Math.min(limit, deltaY))
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const BASE_SIZE = 128;
  const eyeColor = theme === 'light' ? 'bg-emerald-500' : 'bg-emerald-400';
  const eyeBg = theme === 'light' ? 'bg-emerald-50' : 'bg-emerald-900/50';
  const mouthColor = theme === 'light' ? 'border-emerald-500' : 'border-emerald-500/50';

  return (
    <div
      className="relative transition-all duration-500"
      style={{
        width: `${BASE_SIZE * scale}px`,
        height: `${BASE_SIZE * scale}px`
      }}
    >
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{
          width: `${BASE_SIZE}px`,
          height: `${BASE_SIZE}px`,
          transform: `scale(${scale})`
        }}
      >
          <div className={`absolute inset-0 ${THEME.glowColor} blur-3xl rounded-full transition-all duration-500 ${state === 'processing' ? 'animate-pulse scale-150' : 'scale-100'}`}></div>

          <div className={`relative w-full h-full ${THEME.avatarBg} border-2 ${THEME.avatarBorder} rounded-full flex flex-col items-center justify-center shadow-2xl shadow-emerald-500/20 overflow-hidden z-10`}>

            <div className="flex gap-[16px] items-center mb-[12px] transition-all duration-300">
               <div
                 className={`${eyeBg} rounded-full border border-emerald-500/30 flex items-center justify-center overflow-hidden relative transition-all duration-200
                 ${state === 'listening' ? 'h-[12px] w-[32px]' : 'w-[32px] h-[44px]'}
                 ${state === 'idle' ? 'animate-[blink_4s_infinite]' : ''}`}
               >
                  <div
                    className={`${eyeColor} rounded-full shadow-[0_0_10px_rgba(52,211,153,0.8)] transition-all duration-100 ease-out w-[12px] h-[12px]`}
                    style={{
                      transform: state === 'processing' ? 'scale(1.2)' : `translate(${pupilPos.x}px, ${pupilPos.y}px)`
                    }}
                  ></div>
               </div>

               <div
                 className={`${eyeBg} rounded-full border border-emerald-500/30 flex items-center justify-center overflow-hidden relative transition-all duration-200
                 ${state === 'listening' ? 'h-[12px] w-[32px]' : 'w-[32px] h-[44px]'}
                 ${state === 'idle' ? 'animate-[blink_4s_infinite]' : ''}`}
               >
                  <div
                    className={`${eyeColor} rounded-full shadow-[0_0_10px_rgba(52,211,153,0.8)] transition-all duration-100 ease-out w-[12px] h-[12px]`}
                    style={{
                      transform: state === 'processing' ? 'scale(1.2)' : `translate(${pupilPos.x}px, ${pupilPos.y}px)`
                    }}
                  ></div>
               </div>
            </div>

            <div className={`border-b-2 ${mouthColor} transition-all duration-200 rounded-b-full mt-2
              ${state === 'speaking' ? 'h-[12px] w-[40px] bg-emerald-400/20 animate-[talk_0.3s_infinite]' : 'w-[30px] h-[10px]'}
              ${state === 'listening' ? 'w-[20px] h-[4px]' : ''}
            `}></div>
          </div>

          {state === 'processing' && (
            <div className="absolute inset-0 border border-emerald-500/30 rounded-full animate-spin-slow w-full h-full scale-150 border-t-emerald-400"></div>
          )}
      </div>
    </div>
  )
}

const WeatherIcon = ({ isDay, condition, size = "w-4 h-4", theme }: { isDay: boolean, condition: string, size?: string, theme: Theme }) => {
  const iconColor = theme === 'light' ? {
    rain: 'text-blue-500',
    cloud: 'text-slate-500',
    sun: 'text-amber-500',
    moon: 'text-indigo-500',
    wind: 'text-slate-500'
  } : {
    rain: 'text-blue-400',
    cloud: 'text-slate-400',
    sun: 'text-amber-400',
    moon: 'text-indigo-400',
    wind: 'text-slate-400'
  };

  if (condition.includes('Rain')) return <Droplets className={`${size} ${iconColor.rain}`} />;
  if (condition.includes('Cloud')) return <Cloud className={`${size} ${iconColor.cloud}`} />;
  if (condition.includes('Clear')) return isDay ? <Sun className={`${size} ${iconColor.sun}`} /> : <Moon className={`${size} ${iconColor.moon}`} />;
  return <Wind className={`${size} ${iconColor.wind}`} />;
};

/**
 * MAIN COMPONENT
 */
export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<Theme>('dark');
  const [appState, setAppState] = useState<AppState>('idle');
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [currentSuggestions, setCurrentSuggestions] = useState<string[]>([]);
  const [showAbout, setShowAbout] = useState(false);

  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const THEME = THEMES[theme];

  // Streaming text effect for messages (FASTER)
  useEffect(() => {
    const streamingMsg = messages.find(m => m.isStreaming);
    if (!streamingMsg) return;

    const fullText = streamingMsg.text;
    const currentDisplay = streamingMsg.displayText || '';

    if (currentDisplay.length < fullText.length) {
      const timer = setTimeout(() => {
        setMessages(prev => prev.map(m =>
          m.id === streamingMsg.id
            ? { ...m, displayText: fullText.slice(0, currentDisplay.length + 5) } // 5 chars at a time
            : m
        ));
      }, 10); // Reduced from 20ms to 10ms
      return () => clearTimeout(timer);
    } else {
      // Streaming complete
      setMessages(prev => prev.map(m =>
        m.id === streamingMsg.id
          ? { ...m, isStreaming: false, displayText: fullText }
          : m
      ));
    }
  }, [messages]);

  // --- API CALLS ---
  const fetchWeatherFromAPI = async (query: string | { lat: number, lon: number }, lang: string = 'en'): Promise<WeatherData> => {
    try {
      const response = await fetch(`${API_BASE_URL}/weather`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, lang })
      });

      if (!response.ok) throw new Error("Weather API Error");
      return await response.json();
    } catch (error) {
      console.error("Weather fetch failed", error);
      throw new Error("Weather unavailable");
    }
  };

  const extractCityFromQuery = async (query: string): Promise<string | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/extract-city`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });

      if (!response.ok) return null;
      const data = await response.json();
      return data.city;
    } catch (e) {
      return null;
    }
  };

  const getAIResponse = async (userText: string, weatherData: WeatherData | null, history: Message[], lang: Language) => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          weather: weatherData,
          history: history,
          language: lang
        })
      });

      if (!response.ok) throw new Error("AI Service Unavailable");
      return await response.json();
    } catch (error) {
      throw new Error("Connection error");
    }
  };

  const translateMessages = async (messagesToTranslate: { id: string, text: string }[], targetLang: Language) => {
    try {
      const response = await fetch(`${API_BASE_URL}/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messagesToTranslate,
          targetLanguage: targetLang
        })
      });

      if (!response.ok) throw new Error("Translation failed");
      return await response.json();
    } catch (error) {
      throw new Error("Translation error");
    }
  };

  const translateSuggestions = async (suggestions: string[], targetLang: Language) => {
    try {
      const response = await fetch(`${API_BASE_URL}/translate-suggestions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          suggestions,
          targetLanguage: targetLang
        })
      });

      if (!response.ok) throw new Error("Translation failed");
      const data = await response.json();
      return data.translated;
    } catch (error) {
      console.error("Suggestion translation failed", error);
      return suggestions;
    }
  };

  const translateWeatherData = async (weather: WeatherData, targetLang: Language): Promise<WeatherData> => {
    try {
      const textsToTranslate = [
        { id: 'location', text: weather.location },
        { id: 'condition', text: weather.condition },
        { id: 'description', text: weather.description }
      ];

      const response = await fetch(`${API_BASE_URL}/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: textsToTranslate,
          targetLanguage: targetLang
        })
      });

      if (!response.ok) throw new Error("Weather translation failed");
      const translations = await response.json();

      return {
        ...weather,
        location: translations['location'] || weather.location,
        condition: translations['condition'] || weather.condition,
        description: translations['description'] || weather.description
      };
    } catch (error) {
      console.error("Weather translation failed", error);
      return weather; // Return original if translation fails
    }
  };

  // --- INITIALIZATION ---
  useEffect(() => {
    const savedLang = localStorage.getItem('aura_lang') as Language;
    const savedTheme = localStorage.getItem('aura_theme') as Theme;
    if (savedLang) setLanguage(savedLang);
    if (savedTheme) setTheme(savedTheme);
    if (typeof window !== 'undefined') synthRef.current = window.speechSynthesis;
    handleLocateMe(savedLang || 'en');
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, appState, currentSuggestions]);

  // --- LOCATION LOGIC ---
  const handleLocateMe = (langOverride?: string) => {
    setLoadingLocation(true);
    setError(null);
    const langToUse = langOverride || language;

    if (!navigator.geolocation) {
      setError("Geolocation not supported.");
      setLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchWeatherFromAPI({ lat: pos.coords.latitude, lon: pos.coords.longitude }, langToUse)
          .then((data) => {
            setCurrentWeather({ ...data, isDefault: false });
            setLoadingLocation(false);
          })
          .catch(() => {
            console.log('Weather fetch failed');
            setLoadingLocation(false);
          });
      },
      (err) => {
        console.warn("Geolocation denied/failed", err);
        fetchWeatherFromAPI({ lat: 35.6895, lon: 139.6917 }, langToUse).then((data) => {
          setCurrentWeather({ ...data, isDefault: true });
          setLoadingLocation(false);
          if (err.code === err.PERMISSION_DENIED) {
             setError("Location denied. Defaulting to Tokyo.");
             setTimeout(() => setError(null), 4000);
          }
        });
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // --- VOICE ---
  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window)) {
      setError("Speech recognition not supported.");
      return;
    }

    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

    const SpeechRecognition = (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = language === 'en' ? 'en-US' : 'ja-JP';

    recognitionRef.current.onstart = () => {
      setAppState('listening');
      setError(null);
    };

    recognitionRef.current.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('');

      setInput(transcript);

      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

      silenceTimerRef.current = setTimeout(() => {
        recognitionRef.current.stop();
        if (transcript.trim()) {
          handleSend(transcript);
        }
      }, 4000);
    };

    recognitionRef.current.onerror = (event: any) => {
      if (event.error !== 'no-speech') {
          setAppState('idle');
          setError(language === 'en' ? "Voice error." : "音声エラー");
      }
    };

    recognitionRef.current.onend = () => {
       if (appState === 'listening') {
         setAppState('idle');
       }
    };

    recognitionRef.current.start();
  }, [language, appState]);

  const stopListening = () => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setAppState('idle');
    }
  };

  const cancelSpeech = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      if (appState === 'speaking') {
        setAppState('idle');
      }
    }
  };

  const toggleSound = () => {
    const newSoundEnabled = !soundEnabled;
    setSoundEnabled(newSoundEnabled);

    // If turning off sound while speaking, stop the speech
    if (!newSoundEnabled && appState === 'speaking') {
      cancelSpeech();
    }
  };

  const speak = (text: string, forceLang?: Language) => {
    if (!synthRef.current || !soundEnabled) return;
    synthRef.current.cancel();

    const cleanText = cleanTextForSpeech(text);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    const targetLang = forceLang || language;
    utterance.lang = targetLang === 'en' ? 'en-US' : 'ja-JP';

    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(v =>
      v.lang.includes(targetLang === 'en' ? 'en-US' : 'JP') && v.name.includes('Google')
    );
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onstart = () => setAppState('speaking');
    utterance.onend = () => setAppState('idle');

    synthRef.current.speak(utterance);
  };

  // --- AI LOGIC ---
  const handleSend = async (textOverride?: string) => {
    const textToSend = typeof textOverride === 'string' ? textOverride : input;

    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (recognitionRef.current) recognitionRef.current.stop();

    if (!textToSend.trim()) {
      setAppState('idle');
      return;
    }

    const userMsg: Message = {
      id: generateId(),
      role: 'user',
      text: textToSend,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setCurrentSuggestions([]);
    setAppState('processing');
    setError(null);

    try {
      const targetCity = await extractCityFromQuery(textToSend);
      let activeWeather = currentWeather;

      if (targetCity) {
        try {
           const cityWeather = await fetchWeatherFromAPI(targetCity, language);
           if (cityWeather) activeWeather = cityWeather;
        } catch (e) {
           console.warn("Could not fetch for city, falling back");
        }
      } else if (!currentWeather || currentWeather.isDefault) {
        handleLocateMe();
      }

      const aiResponse = await getAIResponse(textToSend, activeWeather, messages, language);

      let aiText = aiResponse.text || "I'm having trouble connecting.";
      const foundSuggestions = aiText.match(/~([^~]+)~/g)?.map((s: string) => s.slice(1, -1)) || [];
      aiText = aiText.replace(/~[^~]+~/g, '').trim();
      setCurrentSuggestions(foundSuggestions);

      const botMsg: Message = {
        id: generateId(),
        role: 'assistant',
        text: aiText,
        timestamp: Date.now(),
        weatherContext: (textToSend.toLowerCase().includes('weather') || targetCity) ? activeWeather || undefined : undefined,
        isStreaming: true,
        displayText: ''
      };

      setMessages(prev => [...prev, botMsg]);

      // Wait for streaming to complete before speaking (adjusted for faster streaming)
      setTimeout(() => {
        speak(aiText);
      }, aiText.length * 10);

    } catch (err) {
      setError("Connection error. Please try again.");
      setAppState('idle');
    }
  };

  const handleLanguageSwitch = async () => {
    const newLang = language === 'en' ? 'ja' : 'en';

    // Update weather with new language
    if (currentWeather) {
      if (currentWeather.isDefault) {
        fetchWeatherFromAPI({ lat: 35.6895, lon: 139.6917 }, newLang).then(data => setCurrentWeather({...data, isDefault: true}));
      } else {
        handleLocateMe(newLang);
      }
    }

    if (messages.length === 0 && currentSuggestions.length === 0) {
      setLanguage(newLang);
      localStorage.setItem('aura_lang', newLang);
      return;
    }

    setAppState('translating');

    try {
      // Translate sequentially to avoid rate limiting
      let messageTranslations: { [key: string]: string } = {};
      let translatedWeatherContexts: WeatherData[] = [];
      let translatedSuggestions: string[] = [];

      // Translate messages first
      if (messages.length > 0) {
        const messagesToTranslate = messages.map(m => ({ id: m.id, text: m.text }));
        messageTranslations = await translateMessages(messagesToTranslate, newLang);

        // Collect all unique weather contexts from messages
        const weatherContexts = messages
          .map(m => m.weatherContext)
          .filter((w): w is WeatherData => w !== undefined);

        // Translate weather contexts sequentially with small delay
        for (const weather of weatherContexts) {
          const translated = await translateWeatherData(weather, newLang);
          translatedWeatherContexts.push(translated);
          // Small delay to avoid rate limiting
          if (weatherContexts.length > 1) {
            await new Promise(resolve => setTimeout(resolve, 300));
          }
        }
      }

      // Translate suggestions
      if (currentSuggestions.length > 0) {
        translatedSuggestions = await translateSuggestions(currentSuggestions, newLang);
      }

      // Update messages with translations
      if (messages.length > 0) {
        let weatherIndex = 0;
        setMessages(prev => prev.map(msg => {
          const translatedText = messageTranslations[msg.id] || msg.text;
          const translatedWeather = msg.weatherContext ? translatedWeatherContexts[weatherIndex++] : undefined;

          return {
            ...msg,
            text: translatedText,
            displayText: translatedText,
            isStreaming: false,
            weatherContext: translatedWeather
          };
        }));
      }

      // Update suggestions
      if (translatedSuggestions.length > 0) {
        setCurrentSuggestions(translatedSuggestions);
      }

      if (input) setInput('');

      setLanguage(newLang);
      localStorage.setItem('aura_lang', newLang);

    } catch (e) {
      console.error("Translation failed", e);
      setError("Translation failed. Switching language anyway.");
      setLanguage(newLang);
    } finally {
      setAppState('idle');
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('aura_theme', newTheme);
  };

  return (
    <div className={`h-screen ${THEME.bg} ${THEME.text} font-sans ${THEME.selection} flex flex-col items-center overflow-hidden transition-colors duration-500 relative`}>
      {/* Decorative Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-0 right-0 w-96 h-96 ${theme === 'dark' ? 'bg-emerald-500/5' : 'bg-emerald-400/10'} rounded-full blur-3xl`}></div>
        <div className={`absolute bottom-0 left-0 w-96 h-96 ${theme === 'dark' ? 'bg-teal-500/5' : 'bg-sky-400/10'} rounded-full blur-3xl`}></div>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 ${theme === 'dark' ? 'bg-emerald-600/5' : 'bg-emerald-300/10'} rounded-full blur-3xl`}></div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* HEADER */}
      <header className={`w-full max-w-4xl p-4 md:p-6 flex justify-between items-center z-10 backdrop-blur-md ${THEME.headerBg} border-b ${THEME.cardBorder} sticky top-0 shrink-0 transition-colors duration-500`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-light tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500 font-serif">
              SORA
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${appState === 'listening' ? 'bg-red-500 animate-ping' : 'bg-emerald-500 animate-pulse'}`}></span>
              <span className={`text-[9px] ${THEME.secondary} font-medium tracking-widest uppercase`}>
                {appState === 'listening' ? UI_TEXT[language].recording : UI_TEXT[language].voiceActive}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full ${THEME.card} border ${THEME.cardBorder} text-xs ${THEME.textMuted} transition-colors duration-500`}>
            {loadingLocation ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                <span className="hidden sm:inline">{UI_TEXT[language].locating}</span>
              </>
            ) : currentWeather ? (
              <>
                <WeatherIcon isDay={currentWeather.isDay} condition={currentWeather.condition} theme={theme} />
                <span className="hidden sm:inline font-medium">{currentWeather.location}</span>
                {currentWeather.isDefault && (
                  <button onClick={() => handleLocateMe()} className="ml-2 flex items-center gap-1 bg-emerald-500/10 hover:bg-emerald-500/20 px-2 py-0.5 rounded-md text-emerald-500 transition-colors border border-emerald-500/20">
                    <LocateFixed className="w-3 h-3" />
                    <span>{UI_TEXT[language].enableLocation}</span>
                  </button>
                )}
              </>
            ) : (
               <button onClick={() => handleLocateMe()} className={`flex items-center gap-1 ${THEME.textMuted} hover:${THEME.primary}`}>
                 <LocateFixed className="w-3 h-3" /> {UI_TEXT[language].retry}
               </button>
            )}
          </div>

          <button
            onClick={() => setShowAbout(true)}
            className={`p-2 rounded-full ${THEME.card} ${THEME.textMuted} hover:${THEME.primary} transition-colors duration-300`}
            title="About SORA"
          >
            <Info className="w-5 h-5" />
          </button>

          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full ${THEME.card} ${THEME.textMuted} hover:${THEME.primary} transition-colors duration-300`}
            title={theme === 'dark' ? UI_TEXT[language].lightMode : UI_TEXT[language].darkMode}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <button
            onClick={toggleSound}
            className={`p-2 rounded-full ${THEME.card} ${soundEnabled ? THEME.primary : THEME.textMuted} hover:${THEME.primary} transition-colors duration-300 ${soundEnabled ? 'ring-2 ring-emerald-500/30' : ''}`}
            title={soundEnabled ? 'AI Voice: ON' : 'AI Voice: OFF'}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          <button
            onClick={handleLanguageSwitch}
            disabled={appState === 'translating'}
            className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-full ${THEME.card} border ${THEME.cardBorder} hover:border-emerald-500/40 transition-all duration-300 group`}
          >
            {appState === 'translating' ? (
              <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
            ) : (
              <Globe className="w-4 h-4 text-emerald-500 group-hover:rotate-12 transition-transform" />
            )}
            <span className={`text-sm font-semibold ${THEME.text} w-6 text-center`}>
              {language.toUpperCase()}
            </span>
          </button>
        </div>
      </header>

      {/* CHAT AREA */}
      <main className="flex-1 w-full max-w-3xl p-4 overflow-y-auto scrollbar-hide flex flex-col gap-6 pb-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full opacity-100 relative">

            <div className="mb-8">
               <AuraAvatar state={appState} theme={theme} />
            </div>

            {currentWeather ? (
              <div className={`${THEME.weatherCard} border p-6 rounded-3xl mb-8 w-full max-w-sm backdrop-blur-sm animate-in zoom-in-95 duration-500 shadow-2xl ${theme === 'light' ? 'shadow-emerald-500/10' : 'shadow-black/50'} relative overflow-hidden transition-colors duration-500`}>
                 <div className={`absolute -top-10 -right-10 w-32 h-32 ${THEME.glowColor} rounded-full blur-3xl`}></div>

                 <div className="flex justify-between items-start mb-4 relative z-10">
                   <div>
                     <h3 className={`${THEME.primary} font-medium text-[10px] uppercase tracking-widest mb-1`}>
                       {UI_TEXT[language].localConditions}
                     </h3>
                     <h2 className={`text-2xl font-bold ${THEME.text} flex items-center gap-2`}>
                         <Navigation className={`w-5 h-5 ${THEME.textMuted}`} />
                         {currentWeather.location}
                     </h2>
                   </div>
                   <WeatherIcon isDay={currentWeather.isDay} condition={currentWeather.condition} size="w-10 h-10" theme={theme} />
                 </div>

                 <div className="flex items-end gap-2 mb-6 relative z-10">
                    <span className={`text-5xl font-light ${THEME.text}`}>{currentWeather.temperature}°</span>
                    <span className={`${THEME.textMuted} text-lg mb-1 capitalize`}>{currentWeather.description}</span>
                 </div>

                 <div className="grid grid-cols-2 gap-4 relative z-10">
                    <div className={`${theme === 'light' ? 'bg-emerald-50/50' : 'bg-slate-950/50'} p-3 rounded-xl flex items-center gap-3 border ${theme === 'light' ? 'border-emerald-100' : 'border-slate-800/50'} transition-colors duration-500`}>
                       <Wind className={`w-5 h-5 ${THEME.textMuted}`} />
                       <div>
                          <p className={`text-[10px] ${THEME.textMuted} uppercase`}>{UI_TEXT[language].wind}</p>
                          <p className={`font-semibold ${THEME.text}`}>{currentWeather.windSpeed} km/h</p>
                       </div>
                    </div>
                    <div className={`${theme === 'light' ? 'bg-blue-50/50' : 'bg-slate-950/50'} p-3 rounded-xl flex items-center gap-3 border ${theme === 'light' ? 'border-blue-100' : 'border-slate-800/50'} transition-colors duration-500`}>
                       <Droplets className={`w-5 h-5 ${theme === 'light' ? 'text-blue-500' : 'text-blue-400'}`} />
                       <div>
                          <p className={`text-[10px] ${THEME.textMuted} uppercase`}>{UI_TEXT[language].humidity}</p>
                          <p className={`font-semibold ${THEME.text}`}>{currentWeather.humidity}%</p>
                       </div>
                    </div>
                 </div>
              </div>
            ) : (
              <div className={`w-20 h-20 rounded-full ${THEME.card} mb-6 flex items-center justify-center border ${THEME.cardBorder} transition-colors duration-500`}>
                 <RefreshCw className={`w-8 h-8 ${THEME.textMuted} animate-spin`} />
              </div>
            )}

            <h2 className={`text-xl font-light ${THEME.textMuted} text-center font-serif animate-in fade-in slide-in-from-bottom-2`}>
              {UI_TEXT[language].tapSpeak}
            </h2>
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-4 duration-300`}
          >
            <div className={`flex items-end gap-3 max-w-[95%] md:max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>

              {msg.role === 'assistant' && (
                <div className="mb-2 shrink-0">
                  <AuraAvatar
                    state={index === messages.length - 1 && appState === 'speaking' ? 'speaking' : 'idle'}
                    scale={0.35}
                    theme={theme}
                  />
                </div>
              )}

              <div className="flex flex-col gap-1 w-full">
                <div className={`p-4 shadow-xl rounded-2xl transition-colors duration-500 ${
                  msg.role === 'user'
                    ? `${THEME.userBubble} rounded-tr-sm`
                    : `${THEME.botBubble} rounded-tl-sm`
                }`}>
                  <p className="leading-relaxed whitespace-pre-wrap">
                    <FormattedText text={msg.displayText || msg.text} theme={theme} />
                    {msg.isStreaming && <span className="inline-block w-1 h-4 bg-emerald-500 ml-1 animate-pulse"></span>}
                  </p>
                </div>

                {/* Read Aloud Button for Bot Messages */}
                {msg.role === 'assistant' && !msg.isStreaming && (
                  <button
                    onClick={() => speak(msg.text)}
                    className={`self-start ml-1 flex items-center gap-1.5 px-2 py-1 ${THEME.card} border ${THEME.cardBorder} rounded-lg text-xs ${THEME.textMuted} hover:${THEME.primary} hover:border-emerald-500/40 transition-all`}
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>{UI_TEXT[language].readAloud}</span>
                  </button>
                )}

                {msg.weatherContext && msg.role === 'assistant' && (
                  <div className={`w-full max-w-sm ${THEME.card} border ${THEME.cardBorder} rounded-xl p-3 animate-in zoom-in-95 duration-300 transition-colors duration-500`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className={`flex items-center gap-2 ${THEME.text}`}>
                         <MapPin className="w-3 h-3 text-emerald-500" />
                         <span className="text-sm font-semibold">{msg.weatherContext.location}</span>
                      </div>
                      <span className={`text-xs ${THEME.textMuted}`}>{msg.weatherContext.temperature}°C</span>
                    </div>

                    {msg.weatherContext.forecast && (
                      <div className={`grid grid-cols-5 gap-1 mt-2 border-t ${THEME.cardBorder} pt-2`}>
                        {msg.weatherContext.forecast.map((day, i) => (
                          <div key={i} className="flex flex-col items-center text-center">
                             <span className={`text-[10px] ${THEME.textMuted} mb-1`}>{day.date}</span>
                             <span className={`text-xs font-medium ${THEME.text}`}>{day.temp}°</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {msg.role === 'assistant' && appState === 'speaking' && index === messages.length - 1 && (
               <button
                 onClick={cancelSpeech}
                 className="mt-2 ml-14 flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-full text-xs text-red-500 transition-colors w-fit animate-in slide-in-from-top-1 cursor-pointer"
               >
                 <Square className="w-3 h-3 fill-current" />
                 <span>{UI_TEXT[language].stopSpeaking}</span>
               </button>
            )}
          </div>
        ))}

        {appState === 'processing' && (
           <div className="flex items-end gap-3">
             <div className="mb-2">
                <div className={`w-10 h-10 rounded-full ${THEME.card} border border-emerald-500/30 flex items-center justify-center transition-colors duration-500`}>
                   <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />
                </div>
             </div>
             <div className={`${THEME.botBubble} px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1 transition-colors duration-500`}>
               <span className={`w-2 h-2 ${THEME.processingDot} rounded-full animate-bounce delay-0`}></span>
               <span className={`w-2 h-2 ${THEME.processingDot} rounded-full animate-bounce delay-100`}></span>
               <span className={`w-2 h-2 ${THEME.processingDot} rounded-full animate-bounce delay-200`}></span>
             </div>
           </div>
        )}

        {appState === 'translating' && (
           <div className="flex justify-center my-6">
             <div className={`${THEME.card} backdrop-blur-xl px-6 py-4 rounded-2xl border ${THEME.cardBorder} shadow-2xl transition-colors duration-500`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative">
                    <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />
                    <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping"></div>
                  </div>
                  <span className={`text-sm font-medium ${THEME.primary}`}>
                    {language === 'en' ? 'Translating...' : '翻訳中...'}
                  </span>
                </div>
                <div className="flex gap-1 justify-center">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-emerald-500"
                      style={{
                        animation: 'bounce 1s infinite',
                        animationDelay: `${i * 0.1}s`
                      }}
                    ></div>
                  ))}
                </div>
             </div>
           </div>
        )}

        {error && (
          <div className="flex justify-center my-4">
             <span className={`px-3 py-1 ${theme === 'light' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-red-900/30 text-red-400 border-red-900/50'} text-xs rounded-full border`}>
               {error}
             </span>
          </div>
        )}

        <div ref={chatEndRef} />
      </main>

      {/* INPUT + SUGGESTIONS */}
      <footer className="w-full max-w-4xl p-4 shrink-0 flex flex-col gap-3">
        {currentSuggestions.length > 0 && appState === 'idle' && (
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {currentSuggestions.map((sugg, i) => (
              <button
                key={i}
                onClick={() => handleSend(sugg)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full ${THEME.suggestionBg} border ${THEME.suggestionBorder} ${THEME.suggestionHover} transition-all text-xs ${THEME.text} whitespace-nowrap animate-in slide-in-from-bottom-2 duration-500`}
              >
                <span>{sugg}</span>
                <ArrowRight className="w-3 h-3 opacity-50" />
              </button>
            ))}
          </div>
        )}

        <div className={`relative ${THEME.inputBg} backdrop-blur-xl rounded-3xl border ${THEME.inputBorder} p-2 shadow-2xl ${theme === 'light' ? 'shadow-emerald-500/10' : 'shadow-black/50'} overflow-hidden w-full transition-colors duration-500`}>

          {appState === 'listening' && (
            <div className={`absolute inset-0 flex items-center justify-center ${theme === 'light' ? 'bg-white/95' : 'bg-slate-950/95'} z-0 transition-all duration-300`}>
               <div className="flex items-center gap-2">
                 {[...Array(5)].map((_, i) => (
                   <div
                     key={i}
                     className="w-3 bg-emerald-500 rounded-full animate-pulse opacity-50"
                     style={{
                       height: `${Math.random() * 40 + 30}px`,
                       animationDuration: '0.4s',
                       animationDelay: `${i * 0.1}s`
                     }}
                   ></div>
                 ))}
               </div>
               <p className="absolute bottom-3 text-emerald-500 text-[10px] font-medium tracking-widest animate-pulse uppercase">
                 {UI_TEXT[language].listening}
               </p>
            </div>
          )}

          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center gap-2 relative z-10"
          >
            <button
              type="button"
              onClick={appState === 'listening' ? () => handleSend() : startListening}
              className={`p-4 rounded-2xl transition-all duration-300 flex-shrink-0 group ${
                appState === 'listening'
                  ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30 ring-2 ring-red-500/50 ring-offset-2 ring-offset-slate-900'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
              }`}
            >
              {appState === 'listening' ? (
                <div className="relative">
                   <div className="absolute inset-0 bg-white rounded-sm animate-ping opacity-75"></div>
                   <div className="w-6 h-6 bg-white rounded-sm"></div>
                </div>
              ) : (
                <Mic className="w-6 h-6" />
              )}
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={UI_TEXT[language].tapSpeak}
              className={`flex-1 bg-transparent border-none ${THEME.text} ${theme === 'light' ? 'placeholder-slate-400' : 'placeholder-slate-500'} focus:ring-0 text-lg px-2 transition-opacity duration-300 ${appState === 'listening' ? 'opacity-80' : 'opacity-100'}`}
              disabled={appState === 'processing' || appState === 'translating'}
            />

            {appState === 'processing' || appState === 'speaking' ? (
              <button
                type="button"
                onClick={() => {
                  if (appState === 'speaking') {
                    cancelSpeech();
                  }
                  setAppState('idle');
                }}
                className="p-3 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-all duration-300 shadow-lg"
                title="Stop"
              >
                <Square className="w-5 h-5 fill-current" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                className={`p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-lg hover:shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-slate-500 disabled:to-slate-600 transition-all duration-300`}
              >
                <Send className="w-5 h-5" />
              </button>
            )}
          </form>
        </div>

        <div className="flex justify-center items-center gap-4 text-xs">
           <button onClick={() => {setMessages([]); setCurrentSuggestions([]);}} className={`${THEME.textMuted} hover:text-red-500 flex items-center gap-1 transition-colors`}>
              <Trash2 className="w-3 h-3" /> {UI_TEXT[language].clearHistory}
           </button>
        </div>
      </footer>

      {/* ABOUT MODAL */}
      {showAbout && (
        <div className={`fixed inset-0 ${THEME.modalOverlay} backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300`} onClick={() => setShowAbout(false)}>
          <div className={`${THEME.modalBg} ${THEME.text} rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 ${THEME.cardBorder} animate-in zoom-in-95 duration-300`} onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className={`sticky top-0 ${THEME.modalBg} border-b ${THEME.cardBorder} p-6 flex items-center justify-between backdrop-blur-xl z-10`}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <Sparkles className="text-white w-7 h-7" />
                </div>
                <div>
                  <h2 className={`text-3xl font-light tracking-wider ${THEME.primary} font-serif`}>{UI_TEXT[language].aboutTitle}</h2>
                  <p className={`text-sm ${THEME.textMuted} mt-1`}>{UI_TEXT[language].aboutTagline}</p>
                </div>
              </div>
              <button onClick={() => setShowAbout(false)} className={`p-2 rounded-full ${THEME.card} ${THEME.textMuted} hover:${THEME.primary} transition-colors`}>
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-8">
              {/* Description */}
              <div>
                <p className={`text-base ${THEME.text} leading-relaxed`}>
                  {UI_TEXT[language].aboutDescription}
                </p>
              </div>

              {/* Features Grid */}
              <div>
                <h3 className={`text-xl font-semibold ${THEME.primary} mb-4 flex items-center gap-2`}>
                  <Sparkles className="w-5 h-5" />
                  {UI_TEXT[language].aboutFeatures}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className={`${THEME.card} border ${THEME.cardBorder} rounded-xl p-3 hover:border-emerald-500/40 transition-colors`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Mic className="w-4 h-4 text-emerald-500" />
                      <h4 className={`font-semibold text-sm ${THEME.text}`}>{UI_TEXT[language].aboutFeatureVoice}</h4>
                    </div>
                    <p className={`text-xs ${THEME.textMuted}`}>{UI_TEXT[language].aboutFeatureVoiceDesc}</p>
                  </div>

                  <div className={`${THEME.card} border ${THEME.cardBorder} rounded-xl p-3 hover:border-emerald-500/40 transition-colors`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Cloud className="w-4 h-4 text-blue-500" />
                      <h4 className={`font-semibold text-sm ${THEME.text}`}>{UI_TEXT[language].aboutFeatureWeather}</h4>
                    </div>
                    <p className={`text-xs ${THEME.textMuted}`}>{UI_TEXT[language].aboutFeatureWeatherDesc}</p>
                  </div>

                  <div className={`${THEME.card} border ${THEME.cardBorder} rounded-xl p-3 hover:border-emerald-500/40 transition-colors`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-4 h-4 text-purple-500" />
                      <h4 className={`font-semibold text-sm ${THEME.text}`}>{UI_TEXT[language].aboutFeatureAI}</h4>
                    </div>
                    <p className={`text-xs ${THEME.textMuted}`}>{UI_TEXT[language].aboutFeatureAIDesc}</p>
                  </div>

                  <div className={`${THEME.card} border ${THEME.cardBorder} rounded-xl p-3 hover:border-emerald-500/40 transition-colors`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Globe className="w-4 h-4 text-teal-500" />
                      <h4 className={`font-semibold text-sm ${THEME.text}`}>{UI_TEXT[language].aboutFeatureBilingual}</h4>
                    </div>
                    <p className={`text-xs ${THEME.textMuted}`}>{UI_TEXT[language].aboutFeatureBilingualDesc}</p>
                  </div>

                  <div className={`${THEME.card} border ${THEME.cardBorder} rounded-xl p-3 hover:border-emerald-500/40 transition-colors md:col-span-2`}>
                    <div className="flex items-center gap-2 mb-1">
                      {theme === 'dark' ? <Moon className="w-4 h-4 text-amber-500" /> : <Sun className="w-4 h-4 text-amber-500" />}
                      <h4 className={`font-semibold text-sm ${THEME.text}`}>{UI_TEXT[language].aboutFeatureTheme}</h4>
                    </div>
                    <p className={`text-xs ${THEME.textMuted}`}>{UI_TEXT[language].aboutFeatureThemeDesc}</p>
                  </div>
                </div>
              </div>

              {/* How to Use */}
              <div>
                <h3 className={`text-xl font-semibold ${THEME.primary} mb-4 flex items-center gap-2`}>
                  <Navigation className="w-5 h-5" />
                  {UI_TEXT[language].aboutHowToUse}
                </h3>
                <div className="space-y-3">
                  <div className={`${THEME.card} border-l-4 border-emerald-500 ${THEME.cardBorder} rounded-r-xl p-4`}>
                    <h4 className={`font-semibold ${THEME.text} mb-1 flex items-center gap-2`}>
                      <span className="w-6 h-6 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center font-bold">1</span>
                      {UI_TEXT[language].aboutStep1}
                    </h4>
                    <p className={`text-sm ${THEME.textMuted} ml-8`}>{UI_TEXT[language].aboutStep1Desc}</p>
                  </div>

                  <div className={`${THEME.card} border-l-4 border-blue-500 ${THEME.cardBorder} rounded-r-xl p-4`}>
                    <h4 className={`font-semibold ${THEME.text} mb-1 flex items-center gap-2`}>
                      <span className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold">2</span>
                      {UI_TEXT[language].aboutStep2}
                    </h4>
                    <p className={`text-sm ${THEME.textMuted} ml-8`}>{UI_TEXT[language].aboutStep2Desc}</p>
                  </div>

                  <div className={`${THEME.card} border-l-4 border-purple-500 ${THEME.cardBorder} rounded-r-xl p-4`}>
                    <h4 className={`font-semibold ${THEME.text} mb-1 flex items-center gap-2`}>
                      <span className="w-6 h-6 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center font-bold">3</span>
                      {UI_TEXT[language].aboutStep3}
                    </h4>
                    <p className={`text-sm ${THEME.textMuted} ml-8`}>{UI_TEXT[language].aboutStep3Desc}</p>
                  </div>

                  <div className={`${THEME.card} border-l-4 border-amber-500 ${THEME.cardBorder} rounded-r-xl p-4`}>
                    <h4 className={`font-semibold ${THEME.text} mb-1 flex items-center gap-2`}>
                      <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center font-bold">4</span>
                      {UI_TEXT[language].aboutStep4}
                    </h4>
                    <p className={`text-sm ${THEME.textMuted} ml-8`}>{UI_TEXT[language].aboutStep4Desc}</p>
                  </div>

                  <div className={`${THEME.card} border-l-4 border-teal-500 ${THEME.cardBorder} rounded-r-xl p-4`}>
                    <h4 className={`font-semibold ${THEME.text} mb-1 flex items-center gap-2`}>
                      <span className="w-6 h-6 rounded-full bg-teal-500 text-white text-xs flex items-center justify-center font-bold">5</span>
                      {UI_TEXT[language].aboutStep5}
                    </h4>
                    <p className={`text-sm ${THEME.textMuted} ml-8`}>{UI_TEXT[language].aboutStep5Desc}</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-center pt-4">
                <button onClick={() => setShowAbout(false)} className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full font-medium hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300">
                  {UI_TEXT[language].aboutClose}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
