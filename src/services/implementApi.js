const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000').replace(/\/$/, '');
const IMPLEMENT_BASE_URL = `${API_BASE_URL}/api/implements`;
const REMOTE_IMPLEMENT_API_ENABLED = import.meta.env.VITE_ENABLE_REMOTE_IMPLEMENT_API === 'true';

let mockImplements = [
  {
    implement_id: 1,
    implement_name: 'Arado de Vertedera',
    brand: 'Kuhn',
    power_requirement_hp: 80,
    working_width_m: 2.5,
    soil_type: 'Clay',
    working_depth_cm: 30,
    weight_kg: 1200,
    implement_type: 'Plow',
    status: 'available',
  },
  {
    implement_id: 2,
    implement_name: 'Sembradora Neumática',
    brand: 'Gaspardo',
    power_requirement_hp: 100,
    working_width_m: 4.5,
    soil_type: 'Loam',
    working_depth_cm: 15,
    weight_kg: 1800,
    implement_type: 'Seeder',
    status: 'available',
  },
  {
    implement_id: 3,
    implement_name: 'Rastra Escarificadora',
    brand: 'Baldan',
    power_requirement_hp: 65,
    working_width_m: 3.0,
    soil_type: 'All',
    working_depth_cm: 20,
    weight_kg: 950,
    implement_type: 'Harrow',
    status: 'maintenance',
  },
];

const getAuthToken = () => {
  return localStorage.getItem('token') || localStorage.getItem('authToken') || '';
};

const toNumberOrNull = (value) => {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  const num = Number(value);
  return Number.isNaN(num) ? null : num;
};

const buildQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }
    searchParams.set(key, String(value));
  });

  return searchParams.toString();
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

const applySort = (items, sort = 'implement_name', order = 'asc') => {
  const list = [...items];
  list.sort((a, b) => {
    let valA = a?.[sort];
    let valB = b?.[sort];

    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();

    if (valA === undefined || valA === null) return 1;
    if (valB === undefined || valB === null) return -1;

    if (valA < valB) return order === 'desc' ? 1 : -1;
    if (valA > valB) return order === 'desc' ? -1 : 1;
    return 0;
  });
  return list;
};

const applyFilters = (items, { search = '', type = '', minPower = '', maxPower = '' }) => {
  const searchLower = search.toLowerCase();
  const typeLower = type.toLowerCase();
  const minPowerNum = toNumberOrNull(minPower);
  const maxPowerNum = toNumberOrNull(maxPower);

  return items.filter((implement) => {
    const matchesSearch = !searchLower
      ? true
      : implement.implement_name?.toLowerCase().includes(searchLower) ||
        implement.brand?.toLowerCase().includes(searchLower);

    const matchesType = !typeLower
      ? true
      : implement.implement_type?.toLowerCase().includes(typeLower);

    const matchesMinPower = minPowerNum === null
      ? true
      : Number(implement.power_requirement_hp || 0) >= minPowerNum;

    const matchesMaxPower = maxPowerNum === null
      ? true
      : Number(implement.power_requirement_hp || 0) <= maxPowerNum;

    return matchesSearch && matchesType && matchesMinPower && matchesMaxPower;
  });
};

const getMockImplements = async (query = {}) => {
  const {
    page = 1,
    limit = 10,
    sort = 'implement_name',
    order = 'asc',
    search = '',
    type = '',
    minPower = '',
    maxPower = '',
  } = query;

  const filtered = applyFilters(mockImplements, { search, type, minPower, maxPower });
  const sorted = applySort(filtered, sort, order);

  const safeLimit = Number(limit) > 0 ? Number(limit) : 10;
  const safePage = Number(page) > 0 ? Number(page) : 1;
  const offset = (safePage - 1) * safeLimit;

  const data = sorted.slice(offset, offset + safeLimit);
  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / safeLimit));

  return {
    success: true,
    data,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages,
    },
  };
};

export const getImplements = async (query = {}) => {
  if (!REMOTE_IMPLEMENT_API_ENABLED) {
    return getMockImplements(query);
  }

  const {
    page = 1,
    limit = 10,
    sort = 'implement_name',
    order = 'asc',
    search = '',
    type = '',
    minPower = '',
    maxPower = '',
  } = query;

  const shouldUseSearchEndpoint = Boolean(search || type || minPower || maxPower);
  const endpoint = shouldUseSearchEndpoint ? `${IMPLEMENT_BASE_URL}/search` : IMPLEMENT_BASE_URL;

  const queryString = buildQueryString({
    page,
    limit,
    sort,
    order,
    search,
    type,
    minPower,
    maxPower,
  });

  return requestJson(`${endpoint}?${queryString}`);
};

export const createImplement = async (implementPayload) => {
  if (!REMOTE_IMPLEMENT_API_ENABLED) {
    const nextId = mockImplements.length > 0
      ? Math.max(...mockImplements.map((t) => t.implement_id || 0)) + 1
      : 1;

    const item = {
      implement_id: nextId,
      ...implementPayload,
    };
    mockImplements = [...mockImplements, item];
    return { success: true, data: item };
  }

  const token = getAuthToken();
  return requestJson(IMPLEMENT_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(implementPayload),
  });
};

export const updateImplement = async (implementId, implementPayload) => {
  if (!REMOTE_IMPLEMENT_API_ENABLED) {
    const idNum = Number(implementId);
    let updated = null;

    mockImplements = mockImplements.map((item) => {
      if (item.implement_id !== idNum) {
        return item;
      }
      updated = { ...item, ...implementPayload };
      return updated;
    });

    if (!updated) {
      throw new Error('Implemento no encontrado');
    }

    return { success: true, data: updated };
  }

  const token = getAuthToken();
  return requestJson(`${IMPLEMENT_BASE_URL}/${implementId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(implementPayload),
  });
};

export const deleteImplement = async (implementId) => {
  if (!REMOTE_IMPLEMENT_API_ENABLED) {
    const idNum = Number(implementId);
    const existing = mockImplements.find((item) => item.implement_id === idNum);

    if (!existing) {
      throw new Error('Implemento no encontrado');
    }

    mockImplements = mockImplements.filter((item) => item.implement_id !== idNum);
    return { success: true, data: existing };
  }

  const token = getAuthToken();
  return requestJson(`${IMPLEMENT_BASE_URL}/${implementId}`, {
    method: 'DELETE',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
};

export const isRemoteImplementApiEnabled = () => REMOTE_IMPLEMENT_API_ENABLED;
