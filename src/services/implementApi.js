import { apiClient } from '../lib/apiClient';
import { buildQueryString, applyFilters, paginateAndFormatMock } from '../lib/mockUtils';

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

const getMockImplements = async (query = {}) => {
  const {
    search = '',
    type = '',
    minPower = '',
    maxPower = '',
    maxWeight = '',
  } = query;

  const filtered = applyFilters(mockImplements, {
    search,
    exactMatchFields: { implement_type: type },
    minPower,
    maxPower,
    maxWeight
  });

  return paginateAndFormatMock(filtered, query, 'implement_name');
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
    maxWeight = '',
  } = query;

  const shouldUseSearchEndpoint = Boolean(search || type || minPower || maxPower || maxWeight);
  const endpoint = shouldUseSearchEndpoint ? '/implements/search' : '/implements';

  const queryString = buildQueryString({
    page,
    limit,
    sort,
    order,
    search,
    type,
    minPower,
    maxPower,
    maxWeight,
  });

  return apiClient(`${endpoint}?${queryString}`);
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

  return apiClient('/implements', {
    method: 'POST',
    body: implementPayload,
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

  return apiClient(`/implements/${implementId}`, {
    method: 'PUT',
    body: implementPayload,
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

  return apiClient(`/implements/${implementId}`, {
    method: 'DELETE',
  });
};

export const isRemoteImplementApiEnabled = () => REMOTE_IMPLEMENT_API_ENABLED;
