import { useState } from 'react';
import { ShortenedUrl, UrlFormData, ValidationError, ClickLog } from '../types';
import { validateForm } from '../utils/validation';
import { generateShortcode, isShortcodeUnique } from '../utils/shortcode';
import { getLocationFromIP, getCurrentIP } from '../utils/geolocation';
import { logger } from '../middleware/LoggingMiddleware';
import { useApp } from '../context/AppContext';

export const useUrlShortener = () => {
  const { state, dispatch } = useApp();
  const [formErrors, setFormErrors] = useState<ValidationError[]>([]);

  const shortenUrl = async (formData: UrlFormData): Promise<boolean> => {
    logger.info('Attempting to shorten URL', formData);
    
  
    const errors = validateForm(formData);
    if (errors.length > 0) {
      setFormErrors(errors);
      logger.warn('Form validation failed', errors);
      return false;
    }

    if (state.shortenedUrls.length >= 5) {
      const error = 'Maximum of 5 URLs allowed. Please delete some before adding new ones.';
      dispatch({ type: 'SET_ERROR', payload: error });
      logger.error('URL limit reached', { currentCount: state.shortenedUrls.length });
      return false;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    setFormErrors([]);

    try {
     
      let shortcode = formData.customShortcode || generateShortcode();
      const existingShortcodes = state.shortenedUrls.map(url => url.shortcode);

      if (!isShortcodeUnique(shortcode, existingShortcodes)) {
        if (formData.customShortcode) {
          dispatch({ type: 'SET_ERROR', payload: 'This shortcode is already in use. Please choose a different one.' });
          logger.error('Shortcode collision', { shortcode });
          return false;
        } else {
         
          let attempts = 0;
          while (!isShortcodeUnique(shortcode, existingShortcodes) && attempts < 10) {
            shortcode = generateShortcode();
            attempts++;
          }
          
          if (attempts >= 10) {
            dispatch({ type: 'SET_ERROR', payload: 'Unable to generate unique shortcode. Please try again.' });
            logger.error('Failed to generate unique shortcode after 10 attempts');
            return false;
          }
        }
      }

     
      const validityMinutes = formData.validityMinutes ? parseInt(formData.validityMinutes, 10) : 30;
      const now = new Date();
      const expiresAt = new Date(now.getTime() + validityMinutes * 60000);

      const newUrl: ShortenedUrl = {
        id: Date.now().toString(),
        originalUrl: formData.originalUrl,
        shortcode,
        validityMinutes,
        createdAt: now,
        expiresAt,
        clickCount: 0,
        clicks: []
      };

      dispatch({ type: 'ADD_URL', payload: newUrl });
      logger.info('URL shortened successfully', newUrl);
      return true;

    } catch (error) {
      const errorMessage = 'Failed to shorten URL. Please try again.';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      logger.error('Error shortening URL', error);
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleRedirect = async (shortcode: string): Promise<string | null> => {
    logger.info('Handling redirect', { shortcode });
    
    const url = state.shortenedUrls.find(u => u.shortcode === shortcode);
    
    if (!url) {
      logger.warn('Shortcode not found', { shortcode });
      return null;
    }

   
    if (url.expiresAt < new Date()) {
      logger.warn('URL has expired', { shortcode, expiresAt: url.expiresAt });
      return null;
    }

   
    try {
      const ip = getCurrentIP();
      const location = await getLocationFromIP(ip);
      
      const clickLog: ClickLog = {
        timestamp: new Date(),
        referrer: document.referrer || 'Direct',
        userAgent: navigator.userAgent,
        location,
        ipAddress: ip
      };

      const updatedUrl: ShortenedUrl = {
        ...url,
        clickCount: url.clickCount + 1,
        clicks: [...url.clicks, clickLog]
      };

      dispatch({ type: 'UPDATE_URL', payload: updatedUrl });
      logger.info('Click logged', { shortcode, clickCount: updatedUrl.clickCount });
      
      return url.originalUrl;
    } catch (error) {
      logger.error('Error logging click', error);
     
      return url.originalUrl;
    }
  };

  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  return {
    shortenedUrls: state.shortenedUrls,
    isLoading: state.isLoading,
    error: state.error,
    formErrors,
    shortenUrl,
    handleRedirect,
    clearError,
    setFormErrors
  };
};