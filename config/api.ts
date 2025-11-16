import Constants from 'expo-constants';

// Lee la IP desde app.json (extra.apiUrl)
const API_URL = Constants.expoConfig?.extra?.apiUrl as string;

if (!API_URL) {
  throw new Error('API_URL no está configurada. Por favor configura "extra.apiUrl" en app.json');
}

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
