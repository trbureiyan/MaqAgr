const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const NOTIFICATION_BASE_URL = `${API_BASE_URL}/api/notifications`;
const REMOTE_API_ENABLED = import.meta.env.VITE_ENABLE_REMOTE_NOTIFICATION_API === 'true'; // Reusing this flag as proxy for remote env

const getAuthToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token') || '';
};

const requestJson = async (url, options = {}) => {
  const response = await fetch(url, options);
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const backendErrors = payload?.errors;
    const backendMessage = payload?.message;
    const errorMessage = Array.isArray(backendErrors)
      ? backendErrors.join(', ')
      : backendMessage || `Error HTTP ${response.status}`;

    throw new Error(errorMessage);
  }

  return payload;
};

// Mock data
let mockNotifications = [
  {
    notification_id: 1,
    type: 'SYSTEM',
    title: 'Bienvenido',
    message: 'Te damos la bienvenida a MaqAgr.',
    is_read: false,
    created_at: new Date().toISOString()
  },
  {
    notification_id: 2,
    type: 'TRACTOR_AVAILABLE',
    title: 'Tractor Disponible',
    message: 'El tractor John Deere 5075E está listo para operar.',
    is_read: true,
    created_at: new Date(Date.now() - 86400000).toISOString()
  }
];

export const getNotifications = async ({ page = 1, limit = 20, read } = {}) => {
  if (!REMOTE_API_ENABLED) {
    let filtered = [...mockNotifications];
    if (read !== undefined) {
      filtered = filtered.filter(n => n.is_read === (read === 'true' || read === true));
    }
    // Sort by desc date
    filtered.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
    return { success: true, data: filtered };
  }

  const token = getAuthToken();
  const searchParams = new URLSearchParams({ page, limit });
  if (read !== undefined) searchParams.set('read', read);

  return requestJson(`${NOTIFICATION_BASE_URL}?${searchParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  });
};

export const getUnreadCount = async () => {
  if (!REMOTE_API_ENABLED) {
    const count = mockNotifications.filter(n => !n.is_read).length;
    return { success: true, data: { count } };
  }

  const token = getAuthToken();
  return requestJson(`${NOTIFICATION_BASE_URL}/unread/count`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  });
};

export const markAsRead = async (id) => {
  if (!REMOTE_API_ENABLED) {
    const notif = mockNotifications.find(n => n.notification_id === Number(id));
    if (notif) notif.is_read = true;
    return { success: true, data: notif };
  }

  const token = getAuthToken();
  return requestJson(`${NOTIFICATION_BASE_URL}/${id}/read`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  });
};

export const markAllAsRead = async () => {
  if (!REMOTE_API_ENABLED) {
    mockNotifications.forEach(n => n.is_read = true);
    return { success: true, data: {} };
  }

  const token = getAuthToken();
  return requestJson(`${NOTIFICATION_BASE_URL}/read-all`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  });
};
