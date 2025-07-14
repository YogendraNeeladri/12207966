import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { ShortenedUrl } from '../types';
import { logger } from '../middleware/LoggingMiddleware';

interface AppState {
  shortenedUrls: ShortenedUrl[];
  isLoading: boolean;
  error: string | null;
}

type AppAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_URL'; payload: ShortenedUrl }
  | { type: 'LOAD_URLS'; payload: ShortenedUrl[] }
  | { type: 'UPDATE_URL'; payload: ShortenedUrl }
  | { type: 'REMOVE_EXPIRED_URLS' };

const initialState: AppState = {
  shortenedUrls: [],
  isLoading: false,
  error: null,
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'ADD_URL':
      return { 
        ...state, 
        shortenedUrls: [...state.shortenedUrls, action.payload],
        error: null 
      };
    case 'LOAD_URLS':
      return { ...state, shortenedUrls: action.payload };
    case 'UPDATE_URL':
      return {
        ...state,
        shortenedUrls: state.shortenedUrls.map(url => 
          url.id === action.payload.id ? action.payload : url
        )
      };
    case 'REMOVE_EXPIRED_URLS':
      const now = new Date();
      const activeUrls = state.shortenedUrls.filter(url => url.expiresAt > now);
      return { ...state, shortenedUrls: activeUrls };
    default:
      return state;
  }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load URLs from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('shortenedUrls');
      if (stored) {
        const urls: ShortenedUrl[] = JSON.parse(stored).map((url: any) => ({
          ...url,
          createdAt: new Date(url.createdAt),
          expiresAt: new Date(url.expiresAt),
          clicks: url.clicks.map((click: any) => ({
            ...click,
            timestamp: new Date(click.timestamp)
          }))
        }));
        dispatch({ type: 'LOAD_URLS', payload: urls });
        logger.info('Loaded URLs from localStorage', { count: urls.length });
      }
    } catch (error) {
      logger.error('Error loading URLs from localStorage', error);
    }
  }, []);

  // Save URLs to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('shortenedUrls', JSON.stringify(state.shortenedUrls));
      logger.info('Saved URLs to localStorage', { count: state.shortenedUrls.length });
    } catch (error) {
      logger.error('Error saving URLs to localStorage', error);
    }
  }, [state.shortenedUrls]);

  // Remove expired URLs every minute
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: 'REMOVE_EXPIRED_URLS' });
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};