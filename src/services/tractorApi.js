import { apiClient } from '../lib/apiClient';
import { applyFilters, paginateAndFormatMock } from '../lib/mockUtils';

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

  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      queryParams.append(key, value);
    }
  });

  return apiClient(`/api/tractors?${queryParams.toString()}`, {
    method: 'GET',
  });
};

export const getTractorById = async (id) => {
  if (!REMOTE_TRACTOR_API_ENABLED) {
    // ...
  }

  return apiClient(`/api/tractors/${id}`, {
    method: 'GET',
  });
};

export const createTractor = async (payload) => {
  if (!REMOTE_TRACTOR_API_ENABLED) {
    const nextId = mockTractors.length > 0
      ? Math.max(...mockTractors.map((t) => t.tractor_id || 0)) + 1
      : 1;

    const item = {
      tractor_id: nextId,
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
      if (item.tractor_id !== idNum) {
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
    const existing = mockTractors.find((item) => item.tractor_id === idNum);

    if (!existing) {
      throw new Error('Tractor no encontrado');
    }

    mockTractors = mockTractors.filter((item) => item.tractor_id !== idNum);
    return { success: true, data: existing };
  }

  return apiClient(`/api/tractors/${id}`, {
    method: 'DELETE',
  });
};

export const isRemoteTractorApiEnabled = () => REMOTE_TRACTOR_API_ENABLED;
