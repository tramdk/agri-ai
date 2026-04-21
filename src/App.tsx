/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect, useCallback, useTransition, type ChangeEvent } from "react";
import { AnimatePresence } from "motion/react";
import { analyzePlantImage, DiseaseAnalysis } from "./services/gemini";

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
import { getHistory, saveToHistory, clearHistory, HistoryEntry } from "./services/history";
import { fetchWeather, WeatherData } from "./services/weather";

export default function App() {
  // App Core State
  const [appState, setAppState] = useState<"IDLE" | "PREVIEW" | "ANALYZING" | "RESULT" | "ERROR" | "HISTORY" | "HANDBOOK">("IDLE");
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
  
  // Transition for smooth state switching
  const [isPending, startTransition] = useTransition();

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const localKey = localStorage.getItem("nongyai_gemini_key");
    if (localKey) setApiKey(localKey);
    
    // Load history
    setHistoryItems(getHistory());

    // Fetch Weather
    const loadWeather = async () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const data = await fetchWeather(position.coords.latitude, position.coords.longitude);
            setWeather(data);
          },
          async () => {
            const data = await fetchWeather(); // Fallback to HCM
            setWeather(data);
          }
        );
      } else {
        const data = await fetchWeather();
        setWeather(data);
      }
    };
    loadWeather();
  }, []);

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

  const handleFileSelect = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Vui lòng chọn một tệp hình ảnh hợp lệ (jpg, png).");
      setAppState("ERROR");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      startTransition(() => {
        setImagePreview(event.target?.result as string);
        setImageMimeType(file.type);
        setAppState("PREVIEW");
      });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }, []);

  const handleStartAnalysis = useCallback(async () => {
    if (!imagePreview) return;
    setAppState("ANALYZING");

    try {
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
      console.error(err);
      if (err.message === "MISSING_API_KEY") {
        setErrorMsg("Gemini AI API Key chưa được cấu hình. Vui lòng thêm API Key trong phần Cài đặt.");
        setShowSettings(true);
      } else {
        setErrorMsg(err.message || "Đã xảy ra lỗi trong quá trình phân tích hình ảnh.");
      }
      setAppState("ERROR");
    }
  }, [imagePreview, imageMimeType, plantContext, chatHistory]);

  return (
    <div className="min-h-screen bg-farm-base selection:bg-farm-primary/20 flex flex-col items-center">
      <div className="w-full max-w-4xl min-h-screen flex flex-col bg-white md:shadow-2xl overflow-hidden md:border-x border-farm-border relative">
        
        <Header onOpenSettings={handleOpenSettings} />

        <main className="flex-1 p-5 sm:p-8 flex flex-col">
          <AnimatePresence mode="wait">
            {appState === "IDLE" && (
              <LandingView 
                historyCount={historyItems.length}
                weather={weather}
                onOpenHistory={handleOpenHistory}
                onOpenHandbook={() => setAppState("HANDBOOK")}
                onCameraClick={() => cameraInputRef.current?.click()}
                onUploadClick={() => fileInputRef.current?.click()}
              />
            )}

            {appState === "HANDBOOK" && (
              <HandbookView onBack={handleReset} />
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

        {/* Hidden Inputs */}
        <input type="file" accept="image/*" capture="environment" ref={cameraInputRef} onChange={handleFileSelect} className="hidden" />
        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />

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
      </div>
    </div>
  );
}
