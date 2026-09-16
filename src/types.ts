export type CategoryId = 'all' | 'marah' | 'lelah' | 'resah' | 'sesak' | 'lega';

export interface CategoryInfo {
  id: CategoryId;
  label: string;
  tagline: string;
  colorClass: string;
  borderClass: string;
  bgClass: string;
}

export interface Confession {
  id: string;
  pseudonym: string;
  content: string;
  category: Exclude<CategoryId, 'all'>;
  createdAt: string; // ISO date or formatted string
  relatesCount: number;
  supportsCount: number;
  userReactedRelate?: boolean;
  userReactedSupport?: boolean;
}

export interface DonationPreset {
  nominal: number;
  label: string;
  note: string;
  isPopular?: boolean;
}

export interface ToastMessage {
  id: string;
  text: string;
  type?: 'success' | 'info' | 'warning';
}
