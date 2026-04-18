/**
 * Utilidades para mapear objetos entre `snake_case` (Backend) y `camelCase` (Frontend).
 */

const isObject = (o) => {
  return o === Object(o) && !isArray(o) && typeof o !== 'function';
};

const isArray = (a) => {
  return Array.isArray(a);
};

const toCamel = (s) => {
  return s.replace(/([-_][a-z])/ig, ($1) => {
    return $1.toUpperCase()
      .replace('-', '')
      .replace('_', '');
  });
};

const toSnake = (s) => {
  return s.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

/**
 * Convierte recursivamente las claves de un objeto/array de snake_case a camelCase.
 * @param {Object|Array} o Objeto o arreglo a procesar
 * @returns {Object|Array} Nuevo objeto con claves en camelCase
 */
export const toCamelCase = function(o) {
  if (isObject(o)) {
    const n = {};
    Object.keys(o)
      .forEach((k) => {
        n[toCamel(k)] = toCamelCase(o[k]);
      });
    return n;
  } else if (isArray(o)) {
    return o.map((i) => {
      return toCamelCase(i);
    });
  }
  return o;
};

/**
 * Convierte recursivamente las claves de un objeto/array de camelCase a snake_case.
 * @param {Object|Array} o Objeto o arreglo a procesar
 * @returns {Object|Array} Nuevo objeto con claves en snake_case
 */
export const toSnakeCase = function(o) {
  if (isObject(o)) {
    const n = {};
    Object.keys(o)
      .forEach((k) => {
        n[toSnake(k)] = toSnakeCase(o[k]);
      });
    return n;
  } else if (isArray(o)) {
    return o.map((i) => {
      return toSnakeCase(i);
    });
  }
  return o;
};
