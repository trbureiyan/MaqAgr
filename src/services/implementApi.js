import { apiClient } from '../lib/apiClient';
import { buildQueryString, applyFilters, paginateAndFormatMock } from '../lib/mockUtils';

const REMOTE_IMPLEMENT_API_ENABLED = import.meta.env.VITE_ENABLE_REMOTE_IMPLEMENT_API === 'true';

let mockImplements = [
  {
    implementId: 1,
    implementName: 'Arado de Vertedera',
    brand: 'Kuhn',
    powerRequirementHp: 80,
    workingWidthM: 2.5,
    soilType: 'Clay',
    workingDepthCm: 30,
    weightKg: 1200,
    implementType: 'Plow',
    status: 'available',
  },
  {
    implementId: 2,
    implementName: 'Sembradora Neumatica',
    brand: 'Gaspardo',
    powerRequirementHp: 100,
    workingWidthM: 4.5,
    soilType: 'Loam',
    workingDepthCm: 15,
    weightKg: 1800,
    implementType: 'Seeder',
    status: 'available',
  },
  {
    implementId: 3,
    implementName: 'Rastra Escarificadora',
    brand: 'Baldan',
    powerRequirementHp: 65,
    workingWidthM: 3.0,
    soilType: 'All',
    workingDepthCm: 20,
    weightKg: 950,
    implementType: 'Harrow',
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
    exactMatchFields: { implementType: type },
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
  const endpoint = shouldUseSearchEndpoint ? '/api/implements/search' : '/api/implements';

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
      ? Math.max(...mockImplements.map((t) => Number(t.implementId) || 0)) + 1
      : 1;

    const item = {
      implementId: nextId,
      ...implementPayload,
    };
    mockImplements = [...mockImplements, item];
    return { success: true, data: item };
  }

  return apiClient('/api/implements', {
    method: 'POST',
    body: implementPayload,
  });
};

export const updateImplement = async (implementId, implementPayload) => {       
  if (!REMOTE_IMPLEMENT_API_ENABLED) {
    const idNum = Number(implementId);
    let updated = null;

    mockImplements = mockImplements.map((item) => {
      if (Number(item.implementId) !== idNum) {
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

  return apiClient(`/api/implements/${implementId}`, {
    method: 'PUT',
    body: implementPayload,
  });
};

export const deleteImplement = async (implementId) => {
  if (!REMOTE_IMPLEMENT_API_ENABLED) {
    const idNum = Number(implementId);
    const existing = mockImplements.find((item) => Number(item.implementId) === idNum);

    if (!existing) {
      throw new Error('Implemento no encontrado');
    }

    mockImplements = mockImplements.filter((item) => Number(item.implementId) !== idNum);
    return { success: true, data: existing };
  }

  return apiClient(`/api/implements/${implementId}`, {
    method: 'DELETE',
  });
};

export const isRemoteImplementApiEnabled = () => REMOTE_IMPLEMENT_API_ENABLED;
