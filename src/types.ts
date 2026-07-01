export type LightingPreset = 'studio' | 'neon' | 'cyberpunk' | 'warm';
export type PedestalStyle = 'none' | 'glass' | 'cyber' | 'stone';
export type LayoutStyle = 'split' | 'classic' | 'fullscreen';

export interface AvatarModelPreset {
  id: string;
  name: string;
  url: string;
  scale: number;
  positionY: number;
  rotationY: number;
  description: string;
  credits?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  demoUrl?: string;
  githubUrl?: string;
  image?: string;
}

export interface Skill {
  id: string;
  name: string;
  proficiency: number; // 0 to 100
  category: 'Frontend' | 'Backend' | 'Design' | 'Other';
}

export interface Socials {
  github?: string;
  linkedin?: string;
  twitter?: string;
  email?: string;
  website?: string;
}

export interface PortfolioData {
  name: string;
  role: string;
  tagline: string;
  bio: string;
  about: string;
  skills: Skill[];
  projects: Project[];
  socials: Socials;
  themeColor: string; // Tailwind color class or hex
  layoutStyle: LayoutStyle;
  avatarConfig: {
    modelUrl: string;
    scale: number;
    positionY: number;
    rotationY: number;
    rotationSpeed: number;
    autoRotate: boolean;
    lighting: LightingPreset;
    pedestal: PedestalStyle;
    activeAnimation: string;
    posture?: 'standing' | 'typing';
    tablePosX?: number;
    tablePosY?: number;
    tablePosZ?: number;
    keyboardPosX?: number;
    keyboardPosY?: number;
    keyboardPosZ?: number;
    mousePosX?: number;
    mousePosY?: number;
    mousePosZ?: number;
    chairPosX?: number;
    chairPosY?: number;
    chairPosZ?: number;
  };
}
