export const generateShortcode = (length: number = 6): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
};

export const isShortcodeUnique = (shortcode: string, existingShortcodes: string[]): boolean => {
  return !existingShortcodes.includes(shortcode);
};