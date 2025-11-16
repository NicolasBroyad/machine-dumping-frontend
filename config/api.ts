import Constants from 'expo-constants';

// Intenta obtener la URL desde app.json extra, si no, detecta automáticamente
const getApiUrl = () => {
  // Si hay una URL configurada en app.json extra, úsala
  const configuredUrl = Constants.expoConfig?.extra?.apiUrl;
  if (configuredUrl && configuredUrl !== 'http://192.168.0.208:3000') {
    return configuredUrl;
  }

  // Si no, detecta automáticamente la IP local desde Expo
  if (__DEV__) {
    const hostUri = Constants.expoConfig?.hostUri;
    if (hostUri) {
      const localIp = hostUri.split(':').shift();
      return `http://${localIp}:3000`;
    }
  }

  // Fallback para producción
  return 'http://localhost:3000';
};

export const API_URL = getApiUrl();

console.log('🔗 API URL configurada:', API_URL);

export const API_BASE_URL = API_URL;

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  ENVIRONMENTS: `${API_BASE_URL}/api/environments`,
  ENVIRONMENTS_ALL: `${API_BASE_URL}/api/environments/all`,
  ENVIRONMENTS_MINE: `${API_BASE_URL}/api/environments/mine`,
  ENVIRONMENTS_JOINED: `${API_BASE_URL}/api/environments/joined`,
  JOIN_ENVIRONMENT: `${API_BASE_URL}/api/environments/join`,
  PRODUCTS: `${API_BASE_URL}/api/products`,
  PRODUCTS_SCAN: (barcode: string) => `${API_BASE_URL}/api/products/scan/${barcode}`,
  PRODUCT_BY_ID: (id: number) => `${API_BASE_URL}/api/products/${id}`,
  PRODUCTS_BY_ENVIRONMENT: (environmentId: number) => `${API_BASE_URL}/api/products/${environmentId}`,
  REGISTERS: `${API_BASE_URL}/api/registers`,
  REGISTERS_MINE: `${API_BASE_URL}/api/registers/mine`,
  REGISTERS_COMPANY: `${API_BASE_URL}/api/registers/company`,
};
