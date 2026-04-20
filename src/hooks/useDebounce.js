import { useState, useEffect } from 'react';

/**
 * Hook para retrasar la actualización de un valor por un tiempo determinado.
 * Utilizado para optimizar las peticiones de búsquedas en inputs.
 */
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Exportar tanto como nombrado o como default para compatibilidad
export default useDebounce;
