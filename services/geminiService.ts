import { GoogleGenAI } from "@google/genai";
import { VideoConfig } from '../types';

// FIX: Removed duplicate global declaration for window.aistudio.
// This is now centralized in types.ts.

const POLLING_INTERVAL_MS = 10000; // 10 seconds

export const generateVideo = async (
  prompt: string,
  config: VideoConfig,
  setLoadingMessage: (message: string) => void
): Promise<string> => {
  // Create a new instance right before the call to ensure the latest API key is used.
  if (!process.env.API_KEY) {
    throw new Error("API key not found. Please select an API key.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  setLoadingMessage("Initiating video generation request...");
  let operation = await ai.models.generateVideos({
    model: config.model,
    prompt: prompt,
    config: {
      numberOfVideos: 1,
      resolution: config.resolution,
      aspectRatio: config.aspectRatio,
      durationSeconds: config.duration,
    },
  });

  setLoadingMessage("Request received. The model is now generating your video...");
  const reassuringMessages = [
    "Warming up the quantum video synthesizer...",
    "Teaching pixels to dance in harmony...",
    "Composing a symphony of light and motion...",
    "This can take a few minutes, good things come to those who wait...",
    "Finalizing the hyperrealistic details...",
    "Almost there! Polishing the final frames...",
  ];
  let messageIndex = 0;

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, POLLING_INTERVAL_MS));
    setLoadingMessage(reassuringMessages[messageIndex % reassuringMessages.length]);
    messageIndex++;
    try {
      operation = await ai.operations.getVideosOperation({ operation: operation });
    } catch (error) {
      console.error("Error while polling for video operation status:", error);
      if (error instanceof Error && error.message.includes("Requested entity was not found")) {
        throw new Error("API key is invalid or expired. Please select a new key.");
      }
      throw new Error("Failed to get video generation status.");
    }
  }

  setLoadingMessage("Video generated! Preparing for download...");

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) {
    throw new Error("Video generation succeeded, but no download link was found.");
  }

  const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  if (!response.ok) {
    throw new Error(`Failed to download the video. Status: ${response.statusText}`);
  }

  const videoBlob = await response.blob();
  return URL.createObjectURL(videoBlob);
};
