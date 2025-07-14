
export const getLocationFromIP = async (ip: string): Promise<string> => {
 
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const mockLocations = [
    'New York, NY, US',
    'San Francisco, CA, US',
    'London, UK',
    'Toronto, ON, CA',
    'Sydney, NSW, AU',
    'Tokyo, JP',
    'Berlin, DE',
    'Paris, FR'
  ];
  
  return mockLocations[Math.floor(Math.random() * mockLocations.length)];
};
export const getCurrentIP = (): string => {
  return `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
};