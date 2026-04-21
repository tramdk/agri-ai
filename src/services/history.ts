import { DiseaseAnalysis } from "./gemini";

export interface HistoryEntry {
  id: string;
  timestamp: number;
  image: string; // Base64 or URL
  analysis: DiseaseAnalysis;
}

const STORAGE_KEY = "nongyai_analysis_history";

export const getHistory = (): HistoryEntry[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to load history:", error);
    return [];
  }
};

export const saveToHistory = (image: string, analysis: DiseaseAnalysis): HistoryEntry => {
  const history = getHistory();
  const newEntry: HistoryEntry = {
    id: Math.random().toString(36).substring(2, 9),
    timestamp: Date.now(),
    image,
    analysis,
  };
  
  const updatedHistory = [newEntry, ...history];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  return newEntry;
};

export const deleteHistoryItem = (id: string) => {
  const history = getHistory();
  const updatedHistory = history.filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
};

export const clearHistory = () => {
  localStorage.removeItem(STORAGE_KEY);
};
