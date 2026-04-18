import { useState, useEffect } from 'react';

/**
 * Hook para retrasar la actualización de un valor (debounce).
 * Muy útil para barras de búsqueda, evitando enviar peticiones a la API
 * en cada pulsación de tecla.
 * 
 * @param {any} value - El valor a retrasar.
 * @param {number} delay - Tiempo en milisegundos a esperar (ej: 300).
 * @returns {any} El valor retrasado.
 */
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Establecer el temporizador para actualizar el valor debounced después del retraso
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpiar el temporizador si el valor cambia, lo que cancelará la actualización pendiente
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
