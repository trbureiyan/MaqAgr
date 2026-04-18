import { toCamelCase } from './dataMappers';

export const buildQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }
    searchParams.set(key, String(value));
  });

  return searchParams.toString();
};

export const applySort = (items, sort, order = 'asc') => {
  if (!sort) return items;
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

/**
 * Filtra items cruzando search text con propiedades específicas 
 * minPower/maxPower/maxWeight.
 */
export const applyFilters = (items, config) => {
  const { search = '', exactMatchFields = {}, minPower = '', maxPower = '', maxWeight = '' } = config;
  const searchLower = search.toLowerCase();

  const minPowerNum = minPower === '' || isNaN(Number(minPower)) ? null : Number(minPower);
  const maxPowerNum = maxPower === '' || isNaN(Number(maxPower)) ? null : Number(maxPower);
  const maxWeightNum = maxWeight === '' || isNaN(Number(maxWeight)) ? null : Number(maxWeight);

  return items.filter((item) => {
    // Search general iterando ciertos keys que comúnmente se mapean a nombres o marcas
    const matchesSearch = !searchLower
      ? true
      : Object.values(item).some(val => 
          typeof val === 'string' && val.toLowerCase().includes(searchLower)
        );

    // Exact matches (ej. brand exacto, status, traction_type o type)
    let matchesExact = true;
    for (const [key, value] of Object.entries(exactMatchFields)) {
      if (value) {
        if (!item[key] || !item[key].toLowerCase().includes(value.toLowerCase())) {
          matchesExact = false;
          break;
        }
      }
    }

    // Tractores engine_power_hp, implementos power_requirement_hp
    const power = item.engine_power_hp || item.power_requirement_hp || 0;
    
    const matchesMinPower = minPowerNum === null ? true : Number(power) >= minPowerNum;
    const matchesMaxPower = maxPowerNum === null ? true : Number(power) <= maxPowerNum;
    const matchesMaxWeight = maxWeightNum === null ? true : Number(item.weight_kg || 0) <= maxWeightNum;

    return matchesSearch && matchesExact && matchesMinPower && matchesMaxPower && matchesMaxWeight;
  });
};

/**
 * Empaqueta data filtrada / ordenada emulando el formato estándar de respuesta backend  
 * procesada ya a camelCase para evitar bugs visuales.
 */
export const paginateAndFormatMock = async (items, query, defaultSort) => {
  const {
    page = 1,
    limit = 10,
    sort = defaultSort,
    order = 'asc',
  } = query;

  const sorted = applySort(items, sort, order);

  const safeLimit = Number(limit) > 0 ? Number(limit) : 10;
  const safePage = Number(page) > 0 ? Number(page) : 1;
  const offset = (safePage - 1) * safeLimit;

  const data = sorted.slice(offset, offset + safeLimit);
  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / safeLimit));

  return {
    success: true,
    data: toCamelCase(data), // Forzar a camelCase para consistencia con API real
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages,
    },
  };
};
