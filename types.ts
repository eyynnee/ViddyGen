export type AspectRatio = '16:9' | '9:16';
export type Resolution = '720p' | '1080p';
export type VideoModel = 'veo-3.1-generate-preview' | 'veo-3.1-fast-generate-preview';

export interface VideoConfig {
  aspectRatio: AspectRatio;
  resolution: Resolution;
  model: VideoModel;
  duration: number;
}

// FIX: Centralize global declaration for window.aistudio to avoid conflicts.
// Removed conflicting declaration. Another declaration must exist elsewhere in the project.
