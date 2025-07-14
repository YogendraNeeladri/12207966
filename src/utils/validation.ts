import { UrlFormData, ValidationError } from '../types';

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateShortcode = (shortcode: string): boolean => {
  const alphanumericRegex = /^[a-zA-Z0-9]+$/;
  return shortcode.length <= 10 && alphanumericRegex.test(shortcode);
};

export const validateValidity = (validity: string): boolean => {
  const num = parseInt(validity, 10);
  return !isNaN(num) && num > 0;
};

export const validateForm = (formData: UrlFormData): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!formData.originalUrl.trim()) {
    errors.push({ field: 'originalUrl', message: 'URL is required' });
  } else if (!validateUrl(formData.originalUrl)) {
    errors.push({ field: 'originalUrl', message: 'Please enter a valid URL' });
  }

  if (formData.validityMinutes && !validateValidity(formData.validityMinutes)) {
    errors.push({ field: 'validityMinutes', message: 'Validity must be a positive number' });
  }

  if (formData.customShortcode && !validateShortcode(formData.customShortcode)) {
    errors.push({ 
      field: 'customShortcode', 
      message: 'Shortcode must be alphanumeric and max 10 characters' 
    });
  }

  return errors;
};