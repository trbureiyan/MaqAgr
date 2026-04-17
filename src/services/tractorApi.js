const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000').replace(/\/$/, '');
const TRACTOR_BASE_URL = `${API_BASE_URL}/api/tractors`;
const REMOTE_TRACTOR_API_ENABLED = import.meta.env.VITE_ENABLE_REMOTE_TRACTOR_API === 'true';

let mockTractors = [
  {
    tractor_id: 1,
    name: 'John Deere 5075E',
    brand: 'John Deere',
    model: '5075E',
    engine_power_hp: 75,
    weight_kg: 3200,
    traction_force_kn: 45,
    traction_type: '4x4',
    tire_type: 'Radial 16.9R30',
    tire_width_mm: null,
    tire_diameter_mm: null,
    tire_pressure_psi: null,
    status: 'available',
  },
  {
    tractor_id: 2,
    name: 'Massey Ferguson 4709',
    brand: 'Massey Ferguson',
    model: '4709',
    engine_power_hp: 90,
    weight_kg: 3500,
    traction_force_kn: 52,
    traction_type: '4x4',
    tire_type: 'Radial 18.4R34',
    tire_width_mm: null,
    tire_diameter_mm: null,
    tire_pressure_psi: null,
    status: 'available',
  },
  {
    tractor_id: 3,
    name: 'New Holland TT3.55',
    brand: 'New Holland',
    model: 'TT3.55',
    engine_power_hp: 55,
    weight_kg: 2800,
    traction_force_kn: 38,
    traction_type: '4x2',
    tire_type: 'Diagonal 14.9-28',
    tire_width_mm: null,
    tire_diameter_mm: null,
    tire_pressure_psi: null,
    status: 'available',
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

const applySort = (items, sort = 'name', order = 'asc') => {
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

const applyFilters = (items, { search = '', brand = '', minPower = '', maxPower = '', maxWeight = '' }) => {
  const searchLower = search.toLowerCase();
  const brandLower = brand.toLowerCase();
  const minPowerNum = toNumberOrNull(minPower);
  const maxPowerNum = toNumberOrNull(maxPower);
  const maxWeightNum = toNumberOrNull(maxWeight);

  return items.filter((tractor) => {
    const matchesSearch = !searchLower
      ? true
      : tractor.name?.toLowerCase().includes(searchLower) ||
        tractor.brand?.toLowerCase().includes(searchLower);

    const matchesBrand = !brandLower
      ? true
      : tractor.brand?.toLowerCase().includes(brandLower);

    const matchesMinPower = minPowerNum === null
      ? true
      : Number(tractor.engine_power_hp || 0) >= minPowerNum;

    const matchesMaxPower = maxPowerNum === null
      ? true
      : Number(tractor.engine_power_hp || 0) <= maxPowerNum;

    const matchesMaxWeight = maxWeightNum === null
      ? true
      : Number(tractor.weight_kg || 0) <= maxWeightNum;

    return matchesSearch && matchesBrand && matchesMinPower && matchesMaxPower && matchesMaxWeight;
  });
};

const getMockTractors = async (query = {}) => {
  const {
    page = 1,
    limit = 10,
    sort = 'name',
    order = 'asc',
    search = '',
    brand = '',
    minPower = '',
    maxPower = '',
    maxWeight = '',
  } = query;

  const filtered = applyFilters(mockTractors, { search, brand, minPower, maxPower, maxWeight });
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

export const getTractors = async (query = {}) => {
  if (!REMOTE_TRACTOR_API_ENABLED) {
    return getMockTractors(query);
  }

  const {
    page = 1,
    limit = 10,
    sort = 'name',
    order = 'asc',
    search = '',
    brand = '',
    minPower = '',
    maxPower = '',
    maxWeight = '',
  } = query;

  const shouldUseSearchEndpoint = Boolean(search || brand || minPower || maxPower || maxWeight);
  const endpoint = shouldUseSearchEndpoint ? `${TRACTOR_BASE_URL}/search` : TRACTOR_BASE_URL;

  const queryString = buildQueryString({
    page,
    limit,
    sort,
    order,
    search,
    brand,
    minPower,
    maxPower,
    maxWeight,
  });

  return requestJson(`${endpoint}?${queryString}`);
};

export const createTractor = async (tractorPayload) => {
  if (!REMOTE_TRACTOR_API_ENABLED) {
    const nextId = mockTractors.length > 0
      ? Math.max(...mockTractors.map((t) => t.tractor_id || 0)) + 1
      : 1;

    const item = {
      tractor_id: nextId,
      ...tractorPayload,
    };
    mockTractors = [...mockTractors, item];
    return { success: true, data: item };
  }

  const token = getAuthToken();
  return requestJson(TRACTOR_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(tractorPayload),
  });
};

export const updateTractor = async (tractorId, tractorPayload) => {
  if (!REMOTE_TRACTOR_API_ENABLED) {
    const idNum = Number(tractorId);
    let updated = null;

    mockTractors = mockTractors.map((item) => {
      if (item.tractor_id !== idNum) {
        return item;
      }
      updated = { ...item, ...tractorPayload };
      return updated;
    });

    if (!updated) {
      throw new Error('Tractor no encontrado');
    }

    return { success: true, data: updated };
  }

  const token = getAuthToken();
  return requestJson(`${TRACTOR_BASE_URL}/${tractorId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(tractorPayload),
  });
};

export const deleteTractor = async (tractorId) => {
  if (!REMOTE_TRACTOR_API_ENABLED) {
    const idNum = Number(tractorId);
    const existing = mockTractors.find((item) => item.tractor_id === idNum);

    if (!existing) {
      throw new Error('Tractor no encontrado');
    }

    mockTractors = mockTractors.filter((item) => item.tractor_id !== idNum);
    return { success: true, data: existing };
  }

  const token = getAuthToken();
  return requestJson(`${TRACTOR_BASE_URL}/${tractorId}`, {
    method: 'DELETE',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
};

export const isRemoteTractorApiEnabled = () => REMOTE_TRACTOR_API_ENABLED;
