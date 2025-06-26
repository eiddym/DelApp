"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { MesaDetails, VoteData } from "@/lib/types";

interface AppContextType {
  mesaDetails: MesaDetails | null;
  setMesaDetails: (details: MesaDetails | null) => void;
  photoUri: string | null;
  setPhotoUri: (uri: string | null) => void;
  extractedText: string | null;
  setExtractedText: (text: string | null) => void;
  voteData: VoteData | null;
  setVoteData: (data: VoteData | null) => void;
  resetState: () => void;
  isInitialized: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper to get initial state from localStorage
const getInitialState = <T,>(key: string, defaultValue: T): T => {
  if (typeof window === "undefined") {
    return defaultValue;
  }
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};


export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [mesaDetails, setMesaDetails] = useState<MesaDetails | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [voteData, setVoteData] = useState<VoteData | null>(null);

  useEffect(() => {
    setMesaDetails(getInitialState('mesaDetails', null));
    setPhotoUri(getInitialState('photoUri', null));
    setExtractedText(getInitialState('extractedText', null));
    setVoteData(getInitialState('voteData', null));
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("mesaDetails", JSON.stringify(mesaDetails));
    }
  }, [mesaDetails, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("photoUri", JSON.stringify(photoUri));
    }
  }, [photoUri, isInitialized]);
  
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("extractedText", JSON.stringify(extractedText));
    }
  }, [extractedText, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("voteData", JSON.stringify(voteData));
    }
  }, [voteData, isInitialized]);

  const resetState = () => {
    setMesaDetails(null);
    setPhotoUri(null);
    setExtractedText(null);
    setVoteData(null);
    localStorage.removeItem('mesaDetails');
    localStorage.removeItem('photoUri');
    localStorage.removeItem('extractedText');
    localStorage.removeItem('voteData');
  };
  
  const value = {
    mesaDetails,
    setMesaDetails,
    photoUri,
    setPhotoUri,
    extractedText,
    setExtractedText,
    voteData,
    setVoteData,
    resetState,
    isInitialized
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
