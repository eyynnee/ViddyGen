import React, { useState, useEffect, useCallback } from 'react';
import ApiKeySelector from './components/ApiKeySelector';
import VideoGenerator from './components/VideoGenerator';
import { generateVideo } from './services/geminiService';
import type { VideoConfig } from './types';

// FIX: Removed duplicate global declaration for window.aistudio.
// This is now centralized in types.ts.

function App() {
  const [isKeySelected, setIsKeySelected] = useState<boolean>(false);
  const [isCheckingKey, setIsCheckingKey] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkApiKey = useCallback(async () => {
    setIsCheckingKey(true);
    if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
      try {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setIsKeySelected(hasKey);
      } catch (e) {
        console.error("Error checking for API key:", e);
        setIsKeySelected(false);
      }
    } else {
        // Fallback for when aistudio is not available, assumes key is in env
        console.warn("aistudio not found. Relying on environment variable for API key.");
        setIsKeySelected(!!process.env.API_KEY);
    }
    setIsCheckingKey(false);
  }, []);

  useEffect(() => {
    checkApiKey();
  }, [checkApiKey]);

  const handleSelectKey = async () => {
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      try {
        await window.aistudio.openSelectKey();
        // Assume success after dialog opens to avoid race conditions.
        setIsKeySelected(true);
      } catch (e) {
        console.error("Error opening API key selection:", e);
        setError("Could not open the API key selection dialog.");
      }
    } else {
      setError("API key selection is not available in this environment.");
    }
  };

  const handleGenerate = async (prompt: string, config: VideoConfig) => {
    setIsLoading(true);
    setGeneratedVideoUrl(null);
    setError(null);
    try {
      const videoUrl = await generateVideo(prompt, config, setLoadingMessage);
      setGeneratedVideoUrl(videoUrl);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(errorMessage);
      if (errorMessage.includes("API key is invalid")) {
        // Reset key selection if the polling fails due to an invalid key
        setIsKeySelected(false);
      }
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  if (isCheckingKey) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p>Checking API key status...</p>
      </div>
    );
  }

  if (!isKeySelected) {
    return <ApiKeySelector onSelectKey={handleSelectKey} />;
  }

  return (
    <VideoGenerator
      onGenerate={handleGenerate}
      isLoading={isLoading}
      loadingMessage={loadingMessage}
      generatedVideoUrl={generatedVideoUrl}
      error={error}
    />
  );
}

export default App;
