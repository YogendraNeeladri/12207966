export interface ShortenedUrl {
  id: string;
  originalUrl: string;
  shortcode: string;
  validityMinutes: number;
  createdAt: Date;
  expiresAt: Date;
  clickCount: number;
  clicks: ClickLog[];
}

export interface ClickLog {
  timestamp: Date;
  referrer: string;
  userAgent: string;
  location: string;
  ipAddress: string;
}

export interface UrlFormData {
  originalUrl: string;
  validityMinutes: string;
  customShortcode: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface LogEntry {
  timestamp: Date;
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
  data?: any;
}