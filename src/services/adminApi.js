import { apiClient } from '../lib/apiClient';

/**
 * Obtiene las estadísticas generales (Overview)
 * Endpoint: GET /api/admin/stats/overview
 */
export const getOverviewStats = async () => {
  return apiClient('/api/admin/stats/overview', {
    method: 'GET',
  });
};

/**
 * Obtiene las estadísticas de recomendaciones
 * Endpoint: GET /api/admin/stats/recommendations
 */
export const getRecommendationStats = async () => {
  return apiClient('/api/admin/stats/recommendations', {
    method: 'GET',
  });
};

/**
 * Obtiene las métricas de usuarios
 * Endpoint: GET /api/admin/stats/users
 */
export const getUserStats = async () => {
  return apiClient('/api/admin/stats/users', {
    method: 'GET',
  });
};

/**
 * Obtiene todos los usuarios
 * Endpoint: GET /api/admin/users
 */
export const getAllUsers = async (query = {}) => {
  const searchParams = new URLSearchParams(query).toString();
  const url = searchParams ? `/api/admin/users?${searchParams}` : '/api/admin/users';
  return apiClient(url, {
    method: 'GET',
  });
};

/**
 * Obtiene un usuario por ID
 * Endpoint: GET /api/admin/users/:id
 */
export const getUserById = async (id) => {
  return apiClient(`/api/admin/users/${id}`, {
    method: 'GET',
  });
};

/**
 * Actualiza un usuario (rol, estado, nombre, email)
 * Endpoint: PUT /api/admin/users/:id
 */
export const updateUser = async (id, payload) => {
  return apiClient(`/api/admin/users/${id}`, {
    method: 'PUT',
    body: payload,
  });
};
