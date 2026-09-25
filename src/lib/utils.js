import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Diccionario de traducción de tipos de suelo a español consistente.
 */
export const SOIL_LABELS = {
  clay: 'Arcilloso',
  arcilla: 'Arcilloso',
  sandy: 'Arenoso',
  arena: 'Arenoso',
  loam: 'Franco',
  franco: 'Franco',
  silt: 'Limoso',
  limo: 'Limoso',
  rocky: 'Pedregoso',
  rocoso: 'Pedregoso',
  all: 'Todo tipo de suelo',
};

/**
 * Diccionario de traducción de condiciones de suelo a español consistente.
 */
export const SOIL_CONDITION_LABELS = {
  bueno: 'Firme / Bueno',
  medio: 'Intermedio',
  malo: 'Suelto / Húmedo',
  firme: 'Firme',
  suave: 'Suelto / Blando',
};

/**
 * Retorna el nombre del suelo siempre en español.
 */
export function getSoilLabel(soil) {
  if (!soil) return 'Franco';
  const key = String(soil).toLowerCase().trim();
  return SOIL_LABELS[key] || (key.charAt(0).toUpperCase() + key.slice(1));
}

/**
 * Retorna la condición del suelo siempre en español.
 */
export function getSoilConditionLabel(cond) {
  if (!cond) return null;
  const key = String(cond).toLowerCase().trim();
  return SOIL_CONDITION_LABELS[key] || (key.charAt(0).toUpperCase() + key.slice(1));
}
