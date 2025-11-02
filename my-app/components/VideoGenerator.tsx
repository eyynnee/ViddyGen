import React, { useState } from 'react';
import type { VideoConfig, AspectRatio, Resolution, VideoModel } from '../types';
import SparklesIcon from './icons/SparklesIcon';
import DownloadIcon from './icons/DownloadIcon';
import Loader from './Loader';

interface VideoGeneratorProps {
  onGenerate: (prompt: string, config: VideoConfig) => void;
  isLoading: boolean;
  loadingMessage: string;
  generatedVideoUrl: string | null;
  error: string | null;
}

// FIX: Changed `selectedValue` type from `T` to `string` to resolve type mismatch
// with union types passed from state (e.g., VideoModel). This also fixes the
// subsequent "children is missing" errors, which were a symptom of the prop mismatch.
const ConfigOption = <T extends string>({ label, value, selectedValue, onChange, children }: { label: string, value: T, selectedValue: string, onChange: (value: T) => void, children: React.ReactNode }) => (
    <label className={`relative flex flex-col items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${selectedValue === value ? 'border-brand-primary bg-brand-primary/20' : 'border-gray-700 bg-gray-800 hover:border-brand-secondary'}`}>
        <input
            type="radio"
            name={label}
            value={String(value)}
            checked={selectedValue === value}
            onChange={() => onChange(value)}
            className="sr-only"
        />
        {children}
        <span className="text-sm mt-1">{label}</span>
    </label>
);

// Helper to format duration for display
const formatDuration = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds.toString().padStart(2, '0')}s`;
  };

const VideoGenerator: React.FC<VideoGeneratorProps> = ({ onGenerate, isLoading, loadingMessage, generatedVideoUrl, error }) => {
  const [prompt, setPrompt] = useState<string>('A majestic lion wearing a crown, hyperrealistic 4k');
  const [config, setConfig] = useState<VideoConfig>({
    aspectRatio: '16:9',
    resolution: '720p',
    model: 'veo-3.1-fast-generate-preview',
    duration: 7,
  });

  const handleGenerateClick = () => {
    if (prompt.trim() && !isLoading) {
      onGenerate(prompt, config);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-screen">
      {/* Control Panel */}
      <aside className="w-full lg:w-1/3 xl:w-1/4 bg-gray-900 p-6 flex flex-col gap-6 sticky top-0 h-screen overflow-y-auto">
        <div className="flex items-center gap-3">
            <div className="bg-brand-primary p-2 rounded-lg">
                <SparklesIcon className="w-6 h-6 text-white"/>
            </div>
            <h1 className="text-2xl font-bold">Video Weaver</h1>
        </div>

        <div className="flex flex-col gap-2">
            <label htmlFor="prompt" className="text-sm font-medium text-gray-400">Your Vision</label>
            <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., An astronaut riding a horse on Mars"
                rows={5}
                className="w-full p-3 bg-gray-800 border-2 border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition"
            />
        </div>

        {/* Model Selection */}
        <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium text-gray-400">Model</h3>
            <div className="grid grid-cols-2 gap-2">
                <ConfigOption label="Fast" value="veo-3.1-fast-generate-preview" selectedValue={config.model} onChange={(v: VideoModel) => setConfig(c => ({...c, model: v}))}>
                    <span className="text-xs">Good Quality</span>
                </ConfigOption>
                <ConfigOption label="High Quality" value="veo-3.1-generate-preview" selectedValue={config.model} onChange={(v: VideoModel) => setConfig(c => ({...c, model: v}))}>
                    <span className="text-xs">Best Quality</span>
                </ConfigOption>
            </div>
        </div>

        {/* Aspect Ratio */}
        <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium text-gray-400">Aspect Ratio</h3>
            <div className="grid grid-cols-2 gap-2">
                <ConfigOption label="16:9" value="16:9" selectedValue={config.aspectRatio} onChange={(v: AspectRatio) => setConfig(c => ({...c, aspectRatio: v}))}>
                    <div className="w-12 h-7 bg-gray-600 rounded"></div>
                </ConfigOption>
                <ConfigOption label="9:16" value="9:16" selectedValue={config.aspectRatio} onChange={(v: AspectRatio) => setConfig(c => ({...c, aspectRatio: v}))}>
                    <div className="w-7 h-12 bg-gray-600 rounded"></div>
                </ConfigOption>
            </div>
        </div>

        {/* Resolution */}
        <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium text-gray-400">Resolution</h3>
            <div className="grid grid-cols-2 gap-2">
                <ConfigOption label="720p" value="720p" selectedValue={config.resolution} onChange={(v: Resolution) => setConfig(c => ({...c, resolution: v}))}>
                    <span>SD</span>
                </ConfigOption>
                <ConfigOption label="1080p" value="1080p" selectedValue={config.resolution} onChange={(v: Resolution) => setConfig(c => ({...c, resolution: v}))}>
                    <span>HD</span>
                </ConfigOption>
            </div>
        </div>

        {/* Duration */}
        <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-400">Duration</h3>
                <span className="text-sm font-mono px-2 py-1 bg-gray-800 rounded">{formatDuration(config.duration)}</span>
            </div>
            <input
                type="range"
                min="2"
                max="180"
                step="1"
                value={config.duration}
                onChange={(e) => setConfig(c => ({...c, duration: parseInt(e.target.value, 10)}))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                aria-label="Video duration in seconds"
            />
        </div>

        <button
            onClick={handleGenerateClick}
            disabled={isLoading || !prompt.trim()}
            className="w-full flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-dark text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105"
        >
            <SparklesIcon className="w-5 h-5" />
            {isLoading ? 'Generating...' : 'Generate Video'}
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="w-full lg:w-2/3 xl:w-3/4 flex-grow p-6 flex items-center justify-center bg-gray-950">
        <div className="w-full max-w-4xl h-full flex items-center justify-center animate-fade-in">
          {isLoading ? (
            <Loader message={loadingMessage} />
          ) : error ? (
            <div className="text-center p-8 bg-red-900/30 border border-red-500 rounded-lg">
                <h3 className="text-xl font-bold text-red-400 mb-2">An Error Occurred</h3>
                <p className="text-red-300">{error}</p>
            </div>
          ) : generatedVideoUrl ? (
            <div className="w-full flex flex-col items-center gap-4 animate-slide-up">
              <div className="w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl relative group">
                <video src={generatedVideoUrl} controls autoPlay loop className="w-full h-full object-contain" />
                <a
                  href={generatedVideoUrl}
                  download={`video-weaver-${Date.now()}.mp4`}
                  className="absolute bottom-4 right-4 bg-brand-primary/80 hover:bg-brand-dark text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
                  aria-label="Download video"
                >
                  <DownloadIcon className="w-6 h-6" />
                </a>
              </div>
              <a
                href={generatedVideoUrl}
                download={`video-weaver-${Date.now()}.mp4`}
                className="w-full max-w-xs flex items-center justify-center gap-2 bg-brand-secondary hover:bg-brand-dark text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
                aria-label="Download video"
              >
                <DownloadIcon className="w-5 h-5" />
                <span>Download Video</span>
              </a>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <h2 className="text-3xl font-semibold mb-2">Your Video Awaits</h2>
              <p>Describe your vision, choose your settings, and click "Generate".</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default VideoGenerator;
