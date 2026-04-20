import { apiClient } from '../lib/apiClient';
import { applyFilters, buildQueryString, paginateAndFormatMock } from '../lib/mockUtils';

const REMOTE_TRACTOR_API_ENABLED = import.meta.env.VITE_ENABLE_REMOTE_TRACTOR_API === 'true';

let mockTractors = [
  {
    tractorId: 1,
    name: 'John Deere 5075E',
    brand: 'John Deere',
    model: '5075E',
    enginePowerHp: 75,
    weightKg: 3200,
    tractionForceKn: 45,
    tractionType: '4x4',
    tireType: 'Radial 16.9R30',
    tireWidthMm: null,
    tireDiameterMm: null,
    tirePressurePsi: null,
    status: 'available',
  },
  {
    tractorId: 2,
    name: 'Massey Ferguson 4709',
    brand: 'Massey Ferguson',
    model: '4709',
    enginePowerHp: 90,
    weightKg: 3500,
    tractionForceKn: 52,
    tractionType: '4x4',
    tireType: 'Radial 18.4R34',
    tireWidthMm: null,
    tireDiameterMm: null,
    tirePressurePsi: null,
    status: 'available',
  },
  {
    tractorId: 3,
    name: 'New Holland TT3.55',
    brand: 'New Holland',
    model: 'TT3.55',
    enginePowerHp: 55,
    weightKg: 2800,
    tractionForceKn: 38,
    tractionType: '4x2',
    tireType: 'Diagonal 14.9-28',
    tireWidthMm: null,
    tireDiameterMm: null,
    tirePressurePsi: null,
    status: 'available',
  },
];

const getMockTractors = async (query = {}) => {
  const {
    search = '',
    brand = '',
    minPower = '',
    maxPower = '',
    maxWeight = '',
  } = query;

  const filtered = applyFilters(mockTractors, {
    search,
    exactMatchFields: { brand },
    minPower,
    maxPower,
    maxWeight
  });

  return paginateAndFormatMock(filtered, query, 'name');
};

export const getTractors = async (params = {}) => {
  if (!REMOTE_TRACTOR_API_ENABLED) {
    return getMockTractors(params);
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
    type = '',
  } = params;

  const shouldUseSearchEndpoint = Boolean(search || brand || minPower || maxPower || type);
  const endpoint = shouldUseSearchEndpoint ? '/api/tractors/search' : '/api/tractors';

  // Map frontend params to backend expected query params (q instead of search, type instead of maxWeight)
  const queryString = buildQueryString({
    page,
    limit,
    sort,
    order,
    q: search,
    brand,
    minPower,
    maxPower,
    type,
  });
};

  return apiClient(queryString ? `${endpoint}?${queryString}` : endpoint, {
    method: 'GET',
  });
};

export const getTractorById = async (id) => {
  if (!REMOTE_TRACTOR_API_ENABLED) {
    const tractor = mockTractors.find((item) => Number(item.tractorId) === Number(id));
    if (!tractor) {
      throw new Error('Tractor no encontrado');
    }
    return { success: true, data: tractor };
  }

  return apiClient(`/api/tractors/${id}`, {
    method: 'GET',
  });
};

export const createTractor = async (payload) => {
  if (!REMOTE_TRACTOR_API_ENABLED) {
    const nextId = mockTractors.length > 0
      ? Math.max(...mockTractors.map((t) => Number(t.tractorId) || 0)) + 1
      : 1;

    const item = {
      tractorId: nextId,
      ...payload,
    };
    mockTractors = [...mockTractors, item];
    // Devolver formato mapeado similar al envoltorio apiClient
    return { success: true, data: item };
  }

  return apiClient('/api/tractors', {
    method: 'POST',
    body: payload,
  });
};

export const updateTractor = async (id, payload) => {
  if (!REMOTE_TRACTOR_API_ENABLED) {
    const idNum = Number(id);
    let updated = null;

    mockTractors = mockTractors.map((item) => {
      if (Number(item.tractorId) !== idNum) {
        return item;
      }
      updated = { ...item, ...payload };
      return updated;
    });

    if (!updated) {
      throw new Error('Tractor no encontrado');
    }

    return { success: true, data: updated };
  }

  return apiClient(`/api/tractors/${id}`, {
    method: 'PUT',
    body: payload,
  });
};

export const deleteTractor = async (id) => {
  if (!REMOTE_TRACTOR_API_ENABLED) {
    const idNum = Number(id);
    const existing = mockTractors.find((item) => Number(item.tractorId) === idNum);

    if (!existing) {
      throw new Error('Tractor no encontrado');
    }

    mockTractors = mockTractors.filter((item) => Number(item.tractorId) !== idNum);
    return { success: true, data: existing };
  }

  return apiClient(`/api/tractors/${id}`, {
    method: 'DELETE',
  });
};

export const isRemoteTractorApiEnabled = () => REMOTE_TRACTOR_API_ENABLED;
