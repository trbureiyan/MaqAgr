/**
 * @fileoverview Opciones del filtro "Tipo de Trabajo" para los catálogos de
 * maquinaria (implementos).
 *
 * La lista completa replica el selector "Tipo de implemento" del asistente
 * (`DatosImplemento`): 9 tipos generales + los 9 aperos específicos de la
 * Tabla 1 de Chaparro (cálculo detallado). Los valores son los que guarda
 * `implement_type` en la BD / espera `/api/implements/search?type=...`.
 *
 * @module lib/implementTypeLabels
 */

/**
 * Grupos de opciones para el dropdown de filtro, con etiqueta en español
 * (los generales mantienen el término inglés entre paréntesis, igual que el
 * formulario).
 *
 * @type {Array<{label: string, options: Array<{value: string, label: string}>}>}
 */
export const IMPLEMENT_WORK_TYPE_GROUPS = [
  {
    label: 'Tipos generales',
    options: [
      { value: 'plow', label: 'Arado (Plow)' },
      { value: 'harrow', label: 'Rastra (Harrow)' },
      { value: 'seeder', label: 'Sembradora (Seeder)' },
      { value: 'sprayer', label: 'Aspersora (Sprayer)' },
      { value: 'harvester', label: 'Cosechadora (Harvester)' },
      { value: 'cultivator', label: 'Cultivador' },
      { value: 'mower', label: 'Segadora (Mower)' },
      { value: 'trailer', label: 'Remolque (Trailer)' },
      { value: 'other', label: 'Otro' },
    ],
  },
  {
    label: 'Tipos específicos (cálculo detallado)',
    options: [
      { value: 'arado_disco_vertedera', label: 'Arado de disco y vertedera' },
      { value: 'subsolador', label: 'Subsolador' },
      { value: 'arado_cincel', label: 'Arado cincel' },
      { value: 'implemento_rotativo', label: 'Implemento rotativo (10 cm)' },
      { value: 'rastrillo_simple_discos', label: 'Rastrillo simple de discos' },
      { value: 'rastrillo_pulidor', label: 'Rastrillo pulidor' },
      { value: 'rastrillo_californiano', label: 'Rastrillo californiano' },
      { value: 'rastra_pesada_26', label: 'Rastra pesada de discos 26"' },
      { value: 'rastra_pesada_24', label: 'Rastra pesada de discos 24"' },
    ],
  },
];
