
export type Language = 'en' | 'fa' | 'fr' | 'de' | 'ru' | 'tr' | 'ar' | 'zh';

export type Theme = 'noir' | 'ivory' | 'midnight' | 'forest';

export enum Category {
  PAINTING = 'Painting',
  SCULPTURE = 'Sculpture',
  DIGITAL = 'Digital Art',
  PHOTOGRAPHY = 'Photography',
  PHILOSOPHY = 'Philosophy',
  GRAPHIC_DESIGN = 'Graphic Design'
}

export interface Artwork {
  id: string;
  title: string;
  title_fa?: string;
  title_fr?: string;
  title_de?: string;
  title_ru?: string;
  title_tr?: string;
  title_ar?: string;
  title_zh?: string;
  
  description: string;
  description_fa?: string;
  description_fr?: string;
  description_de?: string;
  description_ru?: string;
  description_tr?: string;
  description_ar?: string;
  description_zh?: string;
  
  year: number;
  category: Category;
  imageUrl: string;
  featured: boolean;
  dimensions?: string;
  
  technique?: string;
  technique_fa?: string;
  technique_fr?: string;
  technique_de?: string;
  technique_ru?: string;
  technique_tr?: string;
  technique_ar?: string;
  technique_zh?: string;
}

export interface Book {
  id: string;
  title: string;
  title_fa?: string;
  title_fr?: string;
  title_de?: string;
  title_ru?: string;
  title_tr?: string;
  title_ar?: string;
  title_zh?: string;
  
  subtitle?: string;
  subtitle_fa?: string;
  subtitle_fr?: string;
  subtitle_de?: string;
  subtitle_ru?: string;
  subtitle_tr?: string;
  subtitle_ar?: string;
  subtitle_zh?: string;
  
  description: string;
  description_fa?: string;
  description_fr?: string;
  description_de?: string;
  description_ru?: string;
  description_tr?: string;
  description_ar?: string;
  description_zh?: string;
  
  price: number;
  coverUrl: string;
  pages: number;
  publishDate: string;
}

export interface JournalPost {
  id: string;
  title: string;
  title_fa?: string;
  title_fr?: string;
  title_de?: string;
  title_ru?: string;
  title_tr?: string;
  title_ar?: string;
  title_zh?: string;
  
  excerpt: string;
  excerpt_fa?: string;
  excerpt_fr?: string;
  excerpt_de?: string;
  excerpt_ru?: string;
  excerpt_tr?: string;
  excerpt_ar?: string;
  excerpt_zh?: string;
  
  content: string;
  content_fa?: string;
  // simplified for other langs in mock
  
  date: string;
  tags: string[];
}

export interface CartItem extends Book {
  quantity: number;
}

export interface SaleMetric {
  name: string;
  value: number;
}

export interface AdminLog {
  id: string;
  action: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
}

export interface ApiResponse {
  artworks: Artwork[];
  books: Book[];
  journal: JournalPost[];
}

export type GeminiResponse = string;