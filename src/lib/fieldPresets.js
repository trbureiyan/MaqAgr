/**
 * @fileoverview Presets de referencia para los campos de la calculadora.
 *
 * Cada preset define:
 *  - `label`   : Texto visible al usuario.
 *  - `value`   : Valor que se inserta en el campo al seleccionar.
 *  - `hint`    : Descripción breve de cuándo aplica este preset (opcional).
 *
 * El sentinel `UNKNOWN_SENTINEL` es el valor que indica "No conozco el dato".
 * Los campos que reciben este valor enviarán `null` al backend, y el backend
 * usará sus propios defaults o lo excluirá del cálculo.
 *
 * Estrategia de campos opcionales vs. requeridos:
 *  - Campos REQUERIDOS (pb, pmax_tdp, peso, implement_type, working_width_m,
 *    working_depth_cm, weight_kg): El botón "No conozco el dato" inserta un
 *    valor típico representativo marcado como estimado, para que el cálculo
 *    siempre pueda completarse.
 *  - Campos OPCIONALES (diámetro llanta, presión, altitud, temperatura,
 *    pendiente, patinamiento): El botón inserta vacío → el backend usa defaults.
 *
 * @module lib/fieldPresets
 */

/** Sentinel para indicar "No conozco el dato" en campos opcionales. */
export const UNKNOWN_SENTINEL = '';

// ---------------------------------------------------------------------------
// Flujo "Tengo Tractor" — DatosTractor
// ---------------------------------------------------------------------------

/**
 * Presets para la Potencia Bruta del motor (HP).
 * Valores típicos de tractores medianos en Colombia según región Orinoquía.
 *
 * @type {Array<{label: string, value: string, hint: string}>}
 */
export const PB_PRESETS = [
  { label: '65 HP', value: '65', hint: 'Tractor pequeño / huerta' },
  { label: '80 HP', value: '80', hint: 'Tractor mediano típico' },
  { label: '100 HP', value: '100', hint: 'Tractor de labor pesada' },
  { label: '120 HP', value: '120', hint: 'Tractor grande / comercial' },
];

/** Valor por defecto cuando el usuario no conoce la potencia bruta. */
export const PB_UNKNOWN_DEFAULT = '80';

/**
 * Presets para la Potencia Máxima TDP (Toma de Fuerza) en HP.
 * Generalmente ~86% de la potencia bruta.
 *
 * @type {Array<{label: string, value: string, hint: string}>}
 */
export const PMAX_TDP_PRESETS = [
  { label: '56 HP', value: '56', hint: '≈ 86% de 65 HP' },
  { label: '69 HP', value: '69', hint: '≈ 86% de 80 HP' },
  { label: '86 HP', value: '86', hint: '≈ 86% de 100 HP' },
  { label: '103 HP', value: '103', hint: '≈ 86% de 120 HP' },
];

/** Valor por defecto cuando el usuario no conoce el TDP. */
export const PMAX_TDP_UNKNOWN_DEFAULT = '69';

/**
 * Presets para el Peso Operativo del tractor (kg).
 *
 * @type {Array<{label: string, value: string, hint: string}>}
 */
export const PESO_PRESETS = [
  { label: '3 000 kg', value: '3000', hint: 'Tractor compacto' },
  { label: '4 500 kg', value: '4500', hint: 'Tractor mediano estándar' },
  { label: '6 000 kg', value: '6000', hint: 'Tractor grande con lastres' },
  { label: '8 000 kg', value: '8000', hint: 'Tractor muy pesado / 4WD' },
];

/** Valor por defecto cuando el usuario no conoce el peso. */
export const PESO_UNKNOWN_DEFAULT = '4500';

// ---------------------------------------------------------------------------
// Flujo "Tengo Tractor" — DatosLlanta
// ---------------------------------------------------------------------------

/**
 * Presets para el Diámetro de la llanta (pulgadas).
 *
 * @type {Array<{label: string, value: string, hint: string}>}
 */
export const DIAMETRO_LLANTA_PRESETS = [
  { label: '24"', value: '24', hint: 'Llantas traseras pequeñas' },
  { label: '28"', value: '28', hint: 'Llantas estándar R1' },
  { label: '30"', value: '30', hint: 'Llantas mediana-alta' },
  { label: '34"', value: '34', hint: 'Llantas grandes para tierra' },
];

/** Valor por defecto cuando no se conoce el diámetro (campo opcional). */
export const DIAMETRO_LLANTA_UNKNOWN_DEFAULT = '';

/**
 * Presets para la Presión de Inflado (PSI).
 *
 * @type {Array<{label: string, value: string, hint: string}>}
 */
export const PRESION_PRESETS = [
  { label: '10 PSI', value: '10', hint: 'Suelo blando / arenoso' },
  { label: '14 PSI', value: '14', hint: 'Presión típica de campo' },
  { label: '18 PSI', value: '18', hint: 'Carretera / terreno firme' },
  { label: '22 PSI', value: '22', hint: 'Alta carga / lastres' },
];

/** Valor por defecto cuando no se conoce la presión (campo opcional). */
export const PRESION_UNKNOWN_DEFAULT = '';

// ---------------------------------------------------------------------------
// Flujo "Tengo Tractor" — DatosClimaticos
// ---------------------------------------------------------------------------

/**
 * Presets para la Altitud (msnm).
 *
 * @type {Array<{label: string, value: string, hint: string}>}
 */
export const ALTITUD_PRESETS = [
  { label: '0 msnm', value: '0', hint: 'Costa / planicie tropical' },
  { label: '300 msnm', value: '300', hint: 'Llanos / Orinoquía' },
  { label: '1 000 msnm', value: '1000', hint: 'Piedemonte / altiplano bajo' },
  { label: '2 500 msnm', value: '2500', hint: 'Zona montañosa alta' },
];

/** Valor por defecto cuando no se conoce la altitud (campo opcional → backend usa 0). */
export const ALTITUD_UNKNOWN_DEFAULT = '';

/**
 * Presets para la Temperatura Ambiente (°C).
 *
 * @type {Array<{label: string, value: string, hint: string}>}
 */
export const TEMPERATURA_PRESETS = [
  { label: '15 °C', value: '15', hint: 'Zona alta / fresca' },
  { label: '22 °C', value: '22', hint: 'Temperatura templada' },
  { label: '28 °C', value: '28', hint: 'Clima cálido típico' },
  { label: '35 °C', value: '35', hint: 'Zona muy caliente' },
];

/** Valor por defecto cuando no se conoce la temperatura (campo opcional). */
export const TEMPERATURA_UNKNOWN_DEFAULT = '';

/**
 * Presets para la Pendiente del terreno (%).
 *
 * @type {Array<{label: string, value: string, hint: string}>}
 */
export const PENDIENTE_PRESETS = [
  { label: '0%', value: '0', hint: 'Terreno plano' },
  { label: '5%', value: '5', hint: 'Ligera inclinación' },
  { label: '12%', value: '12', hint: 'Pendiente moderada' },
  { label: '20%', value: '20', hint: 'Pendiente pronunciada' },
];

/** Valor por defecto cuando no se conoce la pendiente (campo opcional → backend usa 0). */
export const PENDIENTE_UNKNOWN_DEFAULT = '';

/**
 * Presets para el Patinamiento estimado (%).
 *
 * @type {Array<{label: string, value: string, hint: string}>}
 */
export const PATINAMIENTO_PRESETS = [
  { label: '5%', value: '5', hint: 'Suelo firme, seco' },
  { label: '10%', value: '10', hint: 'Suelo normal húmedo' },
  { label: '15%', value: '15', hint: 'Valor típico recomendado' },
  { label: '25%', value: '25', hint: 'Suelo blando / arcilloso' },
];

/** Valor por defecto cuando no se conoce el patinamiento (backend usa 15). */
export const PATINAMIENTO_UNKNOWN_DEFAULT = '';

// ---------------------------------------------------------------------------
// Flujo "Tengo Maquinaria" — DatosImplemento
// ---------------------------------------------------------------------------

/**
 * Presets para el Ancho de Trabajo del implemento (m).
 *
 * @type {Array<{label: string, value: string, hint: string}>}
 */
export const ANCHO_TRABAJO_PRESETS = [
  { label: '1.2 m', value: '1.2', hint: 'Implemento angosto / huerta' },
  { label: '2.0 m', value: '2.0', hint: 'Ancho estándar de arado' },
  { label: '3.0 m', value: '3.0', hint: 'Rastra mediana' },
  { label: '4.5 m', value: '4.5', hint: 'Sembradora o rastra grande' },
];

/** Valor por defecto cuando no se conoce el ancho de trabajo. */
export const ANCHO_TRABAJO_UNKNOWN_DEFAULT = '2.0';

/**
 * Presets para la Profundidad de Trabajo del implemento (cm).
 *
 * @type {Array<{label: string, value: string, hint: string}>}
 */
export const PROFUNDIDAD_PRESETS = [
  { label: '10 cm', value: '10', hint: 'Labor superficial / cultivador' },
  { label: '20 cm', value: '20', hint: 'Labor media / rastra' },
  { label: '30 cm', value: '30', hint: 'Labor profunda / arado' },
  { label: '45 cm', value: '45', hint: 'Subsolado profundo' },
];

/** Valor por defecto cuando no se conoce la profundidad. */
export const PROFUNDIDAD_UNKNOWN_DEFAULT = '20';

/**
 * Presets para el Peso del implemento (kg).
 *
 * @type {Array<{label: string, value: string, hint: string}>}
 */
export const PESO_IMPLEMENTO_PRESETS = [
  { label: '300 kg', value: '300', hint: 'Implemento ligero' },
  { label: '700 kg', value: '700', hint: 'Implemento mediano' },
  { label: '1 500 kg', value: '1500', hint: 'Implemento pesado' },
  { label: '2 500 kg', value: '2500', hint: 'Implemento muy pesado' },
];

/** Valor por defecto cuando no se conoce el peso del implemento. */
export const PESO_IMPLEMENTO_UNKNOWN_DEFAULT = '700';

/**
 * Presets para el Requerimiento de Potencia base (HP).
 *
 * @type {Array<{label: string, value: string, hint: string}>}
 */
export const POTENCIA_REQUERIDA_PRESETS = [
  { label: '40 HP', value: '40', hint: 'Implemento pequeño / liviano' },
  { label: '70 HP', value: '70', hint: 'Implemento estándar' },
  { label: '100 HP', value: '100', hint: 'Implemento pesado' },
  { label: '150 HP', value: '150', hint: 'Implemento extra pesado / grande' },
];

/** Valor por defecto cuando no se conoce la potencia requerida. */
export const POTENCIA_REQUERIDA_UNKNOWN_DEFAULT = '70';

