
export enum AIModel {
  FLASH = 'gemini-3-flash-preview',
  PRO = 'gemini-3-pro-preview',
  IMAGE_FLASH = 'gemini-2.5-flash-image',
  IMAGE_PRO = 'gemini-3-pro-image-preview',
  VEO_FAST = 'veo-3.1-fast-generate-preview',
  VEO_HD = 'veo-3.1-generate-preview'
}

export type ToolCategory = 'image' | 'text' | 'video' | 'history' | 'billing' | 'commerce';

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  tier: 'free' | 'pro' | 'enterprise';
  magicEnergy: number;
  isGuest: boolean;
  avatar?: string;
}

export interface Task {
  id: string;
  type: ToolCategory;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  input: string;
  output?: string;
  timestamp: number;
  model: string;
}

export interface ImageParams {
  aspectRatio: "1:1" | "3:4" | "4:3" | "9:16" | "16:9";
  imageSize: "1K" | "2K" | "4K";
  style: string;
}

export interface VideoParams {
  resolution: '720p' | '1080p';
  aspectRatio: '16:9' | '9:16';
  duration: number;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  type: 'system' | 'update' | 'feature' | 'alert';
  timestamp: string;
  read: boolean;
}
