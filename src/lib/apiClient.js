import { toCamelCase, toSnakeCase } from './dataMappers';

const API_URL = import.meta.env.VITE_API_URL || '';

/**
 * Custom Error Class that maps to backend's AppError structure 
 * and provides Spanish translations for React Boundary handling.
 */
export class AppError extends Error {
  constructor(status, message, details = null) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.details = details;
  }
}

/**
 * Maps known backend system errors or HTTP Status codes into friendly Spanish phrasing.
 */
export function translateError(errorMsg, status) {
  if (errorMsg) {
    const lowerMsg = errorMsg.toLowerCase();
    if (lowerMsg.includes('invalid email or password') || lowerMsg.includes('credentials')) {
      return 'Correo o contraseña inválidos.';
    }
    if (lowerMsg.includes('unauthorized') || lowerMsg.includes('jwt')) {
      return 'Tu sesión ha expirado o no tienes acceso. Por favor, inicia sesión nuevamente.';
    }
    if (lowerMsg.includes('not found')) {
      return 'No hemos podido encontrar la información solicitada.';
    }
    if (lowerMsg.includes('already exists')) {
      return 'Este registro ya existe en el sistema.';
    }
    return errorMsg; // Fallback al mensaje original del backend
  }

  // Fallbacks by Status
  switch (status) {
    case 400: return 'La petición o el formulario contiene datos inválidos.';
    case 401: return 'Sesión expirada o no válida. Inicia sesión nuevamente.';
    case 403: return 'No tienes permisos para realizar esta acción.';
    case 404: return 'El recurso solicitado no existe.';
    case 429: return 'Demasiadas peticiones. Intenta de nuevo en unos segundos.';
    case 500: return 'El servidor ha experimentado un problema interno. Contacta al soporte técnico.';
    default: return 'Ocurrió un error inesperado al conectar con el servidor.';
  }
}

/**
 * Wrapper nativo de fetch para manejar automáticamente:
 * - Content-Type JSON
 * - Inyección de JWT (Authorization)
 * - Mapeo bidireccional snake_case <-> camelCase
 * - Manejo global de errores y codes 401/403
 *
 * @param {string} endpoint Rutas, ej. `/api/auth/login`
 * @param {Object} options Opciones de fetch: method, body, headers, etc.
 * @returns Promise con la data de respuesta en camelCase
 */
export async function apiClient(endpoint, { body, ...customConfig } = {}) {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    // Convierte el cuerpo de camelCase a snake_case antes de enviarlo
    config.body = JSON.stringify(toSnakeCase(body));
  }

  let response;
  try {
    const url = `${API_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
    response = await fetch(url, config);
  } catch (networkError) {
    throw new AppError(503, 'Error de conexión. Verifica tu estado de red o el servidor.', { originalError: networkError.message });
  }

  // Status 204 No Content
  if (response.status === 204) return null;

  // Manejar error 401 Globalmente
  if (response.status === 401) {
    window.dispatchEvent(new Event('auth:unauthorized'));
  }

  let data = {};
  if (response.headers.get('content-type')?.includes('application/json')) {
    data = await response.json().catch(() => ({}));
  }

  if (!response.ok) {
    const backendMessage = data.message || data.error;
    const translatedMessage = translateError(backendMessage, response.status);
    throw new AppError(response.status, translatedMessage, data);
  }

  // Retorna los datos convertidos a camelCase
  return toCamelCase(data);
}