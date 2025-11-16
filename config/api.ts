import Constants from 'expo-constants';

// Intenta obtener la IP desde las variables de entorno, sino usa una por defecto
const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://192.168.0.44:3000';

export const API_BASE_URL = API_URL;

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  ENVIRONMENTS: `${API_BASE_URL}/api/environments`,
  ENVIRONMENTS_ALL: `${API_BASE_URL}/api/environments/all`,
  JOIN_ENVIRONMENT: `${API_BASE_URL}/api/environments/join`,
};
