/**
 * @fileoverview Utilidades compartidas para formularios de la calculadora.
 *
 * Centraliza la generación de clases CSS para inputs con estado de error,
 * evitando la duplicación del mismo patrón en DatosTractor, DatosImplemento
 * y BuscoEquipo.
 *
 * @module lib/formUtils
 */

/**
 * Clases base comunes para todos los inputs de la calculadora.
 * Separado del tema de shadcn para mantener el estilo propio del flujo.
 *
 * @type {string}
 */
export const INPUT_BASE =
  'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#991b1b] transition-colors';

/**
 * Retorna las clases CSS para un campo de formulario según su estado de error.
 *
 * @param {string}   field  - Nombre del campo a evaluar.
 * @param {Object}   errors - Objeto de errores del formulario ({ [field]: string }).
 * @returns {string} Clases CSS combinadas (base + estado de error).
 *
 * @example
 * // Campo con error
 * getInputClass('pb', { pb: 'Ingresa una potencia válida.' })
 * // → 'w-full px-4 py-2 ... border-red-500'
 *
 * @example
 * // Campo sin error
 * getInputClass('pb', {})
 * // → 'w-full px-4 py-2 ... border-gray-300'
 */
export function getInputClass(field, errors) {
  return `${INPUT_BASE} ${errors[field] ? 'border-red-500' : 'border-gray-300'}`;
}

/**
 * Retorna el valor numérico de una cadena o `null` si no es un número finito positivo.
 * Útil para normalizar inputs antes de enviar al backend.
 *
 * @param {string|number} value - Valor a parsear.
 * @returns {number|null}
 *
 * @example
 * parsePositiveNumber('120') // → 120
 * parsePositiveNumber('')    // → null
 * parsePositiveNumber('abc') // → null
 * parsePositiveNumber('-5')  // → null
 */
export function parsePositiveNumber(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

/**
 * Retorna el valor numérico de una cadena o `null` si no es un número finito.
 * Acepta cero y negativos (útil para pendiente, temperatura).
 *
 * @param {string|number} value
 * @returns {number|null}
 */
export function parseNumber(value) {
  if (value === '' || value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}
