/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect, useCallback, useTransition, type ChangeEvent } from "react";
import { AnimatePresence } from "motion/react";
import { analyzePlantImage, DiseaseAnalysis, parseGeminiError } from "./services/gemini";

// Premium Components
import { Header } from "./components/Header";
import { SettingsModal } from "./components/SettingsModal";
import { LandingView } from "./components/LandingView";
import { PreviewView } from "./components/PreviewView";
import { AnalyzingView } from "./components/AnalyzingView";
import { ResultView } from "./components/ResultView";
import { ErrorView } from "./components/ErrorView";
import { HistoryListView } from "./components/HistoryListView";
import { HandbookView } from "./components/HandbookView";
import { ExpertChatView } from "./components/ExpertChatView";
import { getHistory, saveToHistory, clearHistory, deleteHistoryItem, HistoryEntry } from "./services/history";
import { fetchWeather, WeatherData } from "./services/weather";
import { OfflineNotice } from "./components/OfflineNotice";
import { Geolocation } from '@capacitor/geolocation';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { KeepAwake } from '@capacitor-community/keep-awake';
import { App as CapApp } from '@capacitor/app';

export default function App() {
  // App Core State
  const [appState, setAppState] = useState<"IDLE" | "PREVIEW" | "ANALYZING" | "RESULT" | "ERROR" | "HISTORY" | "HANDBOOK" | "EXPERT_CHAT">("IDLE");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>("");
  const [plantContext, setPlantContext] = useState<string>("");
  const [analysisResult, setAnalysisResult] = useState<DiseaseAnalysis | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [historyItems, setHistoryItems] = useState<HistoryEntry[]>([]);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<HistoryEntry | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [locationPermission, setLocationPermission] = useState<'unknown' | 'granted' | 'denied' | 'prompt'>('unknown');
  
  // Transition for smooth state switching
  const [isPending, startTransition] = useTransition();

  const handleReset = useCallback(() => {
    startTransition(() => {
      setAppState("IDLE");
      setImagePreview(null);
      setImageMimeType("");
      setPlantContext("");
      setAnalysisResult(null);
      setErrorMsg("");
    });
  }, []);

  const handleRequestLocation = useCallback(async () => {
    try {
      const position = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 10000 });
      setLocationPermission('granted');
      const data = await fetchWeather(position.coords.latitude, position.coords.longitude);
      setWeather(data);
    } catch (err) {
      console.warn('Location denied:', err);
      setLocationPermission('denied');
    }
  }, []);

  useEffect(() => {
    const localKey = localStorage.getItem("nongyai_gemini_key");
    if (localKey) setApiKey(localKey);
    
    // Load history
    setHistoryItems(getHistory());

    // Use Capacitor Geolocation plugin — this triggers the REAL Android OS permission dialog in APK
    const initWeather = async () => {
      // Show HCM weather immediately while waiting for location response
      const fallback = await fetchWeather();
      setWeather(fallback);

      try {
        // Step 1: Check current permission status (no dialog yet)
        let permStatus = await Geolocation.checkPermissions();

        // Step 2: If not granted, explicitly request — this triggers Android system dialog
        if (permStatus.location !== 'granted' && permStatus.coarseLocation !== 'granted') {
          permStatus = await Geolocation.requestPermissions();
        }

        // Step 3: If granted, get actual position and update weather
        if (permStatus.location === 'granted' || permStatus.coarseLocation === 'granted') {
          setLocationPermission('granted');
          const position = await Geolocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 12000
          });
          const data = await fetchWeather(position.coords.latitude, position.coords.longitude);
          setWeather(data);
        } else {
          setLocationPermission('denied');
        }
      } catch (err) {
        console.warn('Geolocation failed:', err);
        setLocationPermission('denied');
      }
    };
    initWeather();
  }, []);

  // Handle Hardware Back Button (Android)
  useEffect(() => {
    const backHandler = CapApp.addListener('backButton', ({ canGoBack }) => {
      if (showSettings) {
        setShowSettings(false);
      } else if (appState !== "IDLE") {
        handleReset();
      } else {
        // At IDLE, check if there's any browser history (rare in this single page app)
        // or just exit the app.
        if (!canGoBack) {
          CapApp.exitApp();
        }
      }
    });

    return () => {
      backHandler.then(h => h.remove());
    };
  }, [appState, showSettings, handleReset]);

  const loadWeatherWithPosition = async () => {
    try {
      const position = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 10000 });
      const data = await fetchWeather(position.coords.latitude, position.coords.longitude);
      setWeather(data);
    } catch {
      const data = await fetchWeather();
      setWeather(data);
    }
  };


  // Handlers - useCallbacks for stable props (Rule 5.11 / 5.6)
  const handleOpenSettings = useCallback(() => setShowSettings(true), []);
  const handleCloseSettings = useCallback(() => setShowSettings(false), []);

  const handleSaveApiKey = useCallback((newKey: string) => {
    if (newKey.trim() === "") {
      localStorage.removeItem("nongyai_gemini_key");
    } else {
      localStorage.setItem("nongyai_gemini_key", newKey.trim());
    }
    setApiKey(newKey.trim());
    setShowSettings(false);
    
    if (appState === "ERROR" && errorMsg.includes("API Key")) {
      handleReset();
    }
  }, [appState, errorMsg]);

  const handleClearHistory = useCallback(() => {
    clearHistory();
    setHistoryItems([]);
    setChatHistory([]);
  }, []);

  const handleDeleteHistoryItem = useCallback((id: string) => {
    deleteHistoryItem(id);
    setHistoryItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const handleOpenHistory = useCallback(() => {
    setHistoryItems(getHistory());
    setAppState("HISTORY");
  }, []);

  const handleSelectHistoryItem = useCallback((item: HistoryEntry) => {
    setSelectedHistoryItem(item);
    setAnalysisResult(item.analysis);
    setImagePreview(item.image);
    setAppState("RESULT");
  }, []);

  const handleImageSource = useCallback(async (source: CameraSource) => {
    try {
      const photo = await Camera.getPhoto({
        source,
        resultType: CameraResultType.DataUrl,
        quality: 85,
        allowEditing: false,
      });
      if (photo.dataUrl) {
        startTransition(() => {
          setImagePreview(photo.dataUrl!);
          setImageMimeType(photo.format === 'png' ? 'image/png' : 'image/jpeg');
          setAppState("PREVIEW");
        });
      }
    } catch (err: any) {
      // User cancelled — no action needed
      if (!err.message?.includes('cancelled')) {
        console.error('Camera error:', err);
      }
    }
  }, []);

  const handleStartAnalysis = useCallback(async () => {
    if (!imagePreview) return;
    setAppState("ANALYZING");

    try {
      await KeepAwake.keepAwake().catch(() => {}); // Ignore web errors
      
      const base64Data = imagePreview.split(",")[1];
      
      const { analysis, newHistory } = await analyzePlantImage(base64Data, imageMimeType, plantContext, chatHistory);

      // Save to persistent history
      const newEntry = saveToHistory(imagePreview, analysis);
      
      startTransition(() => {
        setAnalysisResult(analysis);
        setChatHistory(newHistory);
        setHistoryItems(prev => [newEntry, ...prev]);
        setAppState("RESULT");
      });
    } catch (err: any) {
      console.error("Analysis Error:", err);
      const customMsg = parseGeminiError(err);
      
      if (customMsg.includes("API Key chưa đúng")) {
        setErrorMsg(customMsg);
        setShowSettings(true);
      } else {
        setErrorMsg(customMsg);
      }
      setAppState("ERROR");
    } finally {
      await KeepAwake.allowSleep().catch(() => {});
    }
  }, [imagePreview, imageMimeType, plantContext, chatHistory]);

  return (
    <div className="min-h-screen bg-farm-base selection:bg-farm-primary/20 flex flex-col items-center">
      <div className="w-full max-w-4xl min-h-screen flex flex-col bg-white md:shadow-2xl overflow-hidden md:border-x border-farm-border relative">
        
        <Header onOpenSettings={handleOpenSettings} onLogoClick={handleReset} />

        <main className="flex-1 p-5 sm:p-8 flex flex-col">
          <AnimatePresence mode="wait">
            {appState === "IDLE" && (
              <LandingView 
                historyCount={historyItems.length}
                weather={weather}
                locationPermission={locationPermission}
                onRequestLocation={handleRequestLocation}
                onOpenHistory={handleOpenHistory}
                onOpenHandbook={() => setAppState("HANDBOOK")}
                onOpenChat={() => setAppState("EXPERT_CHAT")}
                onCameraClick={() => handleImageSource(CameraSource.Camera)}
                onUploadClick={() => handleImageSource(CameraSource.Photos)}
              />
            )}

            {appState === "HANDBOOK" && (
              <HandbookView onBack={handleReset} />
            )}

            {appState === "EXPERT_CHAT" && (
              <ExpertChatView onBack={handleReset} apiKey={apiKey} />
            )}

            {appState === "HISTORY" && (
              <HistoryListView 
                items={historyItems}
                onSelectItem={handleSelectHistoryItem}
                onDeleteItem={handleDeleteHistoryItem}
                onBack={handleReset}
                onClearAll={handleClearHistory}
              />
            )}

            {appState === "PREVIEW" && (
              <PreviewView 
                imagePreview={imagePreview}
                plantContext={plantContext}
                onPlantContextChange={setPlantContext}
                onBack={handleReset}
                onConfirm={handleStartAnalysis}
              />
            )}

            {appState === "ANALYZING" && (
              <AnalyzingView imagePreview={imagePreview} />
            )}

            {appState === "RESULT" && analysisResult && (
              <ResultView 
                analysisResult={analysisResult} 
                imagePreview={imagePreview}
                onReset={handleReset}
              />
            )}

            {appState === "ERROR" && (
              <ErrorView errorMsg={errorMsg} onReset={handleReset} />
            )}
          </AnimatePresence>
        </main>



        <SettingsModal 
          isOpen={showSettings}
          onClose={handleCloseSettings}
          initialApiKey={apiKey}
          onSave={handleSaveApiKey}
        />

        {/* Transition Overlay */}
        {isPending && (
          <div className="fixed inset-0 bg-white/20 backdrop-blur-[1px] pointer-events-none z-50 transition-opacity" />
        )}

        <OfflineNotice />
      </div>
    </div>
  );
}
