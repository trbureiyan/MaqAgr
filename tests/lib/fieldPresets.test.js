/**
 * @fileoverview Tests for src/lib/fieldPresets.js
 *
 * Validates that all preset arrays are well-formed and that
 * unknown defaults are the correct type.
 */

import { test, describe } from 'node:test';
import { strictEqual, ok, deepStrictEqual } from 'node:assert/strict';

import {
  PB_PRESETS, PB_UNKNOWN_DEFAULT,
  PMAX_TDP_PRESETS, PMAX_TDP_UNKNOWN_DEFAULT,
  PESO_PRESETS, PESO_UNKNOWN_DEFAULT,
  DIAMETRO_LLANTA_PRESETS, DIAMETRO_LLANTA_UNKNOWN_DEFAULT,
  PRESION_PRESETS, PRESION_UNKNOWN_DEFAULT,
  ALTITUD_PRESETS, ALTITUD_UNKNOWN_DEFAULT,
  TEMPERATURA_PRESETS, TEMPERATURA_UNKNOWN_DEFAULT,
  PENDIENTE_PRESETS, PENDIENTE_UNKNOWN_DEFAULT,
  PATINAMIENTO_PRESETS, PATINAMIENTO_UNKNOWN_DEFAULT,
  ANCHO_TRABAJO_PRESETS, ANCHO_TRABAJO_UNKNOWN_DEFAULT,
  PROFUNDIDAD_PRESETS, PROFUNDIDAD_UNKNOWN_DEFAULT,
  PESO_IMPLEMENTO_PRESETS, PESO_IMPLEMENTO_UNKNOWN_DEFAULT,
  POTENCIA_REQUERIDA_PRESETS, POTENCIA_REQUERIDA_UNKNOWN_DEFAULT,
} from '../../src/lib/fieldPresets.js';

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

/**
 * Validates that a preset array is well-formed:
 * - is an Array
 * - each item has string label, string value, and string hint
 * - each value can be parsed to a finite number OR is a valid non-empty string for select fields
 *
 * @param {Array} presets
 * @param {string} name - name for error messages
 */
function assertValidPresets(presets, name) {
  ok(Array.isArray(presets), `${name} should be an array`);
  ok(presets.length > 0, `${name} should not be empty`);

  for (const preset of presets) {
    ok(typeof preset.label === 'string' && preset.label.length > 0, `${name}: each preset needs a non-empty label`);
    ok(typeof preset.value === 'string', `${name}: each preset value should be a string`);
    ok(typeof preset.hint === 'string', `${name}: each preset needs a hint`);
  }
}

// ---------------------------------------------------------------------------
// Preset structure tests
// ---------------------------------------------------------------------------

describe('fieldPresets — structure', () => {
  const allPresets = [
    ['PB_PRESETS', PB_PRESETS],
    ['PMAX_TDP_PRESETS', PMAX_TDP_PRESETS],
    ['PESO_PRESETS', PESO_PRESETS],
    ['DIAMETRO_LLANTA_PRESETS', DIAMETRO_LLANTA_PRESETS],
    ['PRESION_PRESETS', PRESION_PRESETS],
    ['ALTITUD_PRESETS', ALTITUD_PRESETS],
    ['TEMPERATURA_PRESETS', TEMPERATURA_PRESETS],
    ['PENDIENTE_PRESETS', PENDIENTE_PRESETS],
    ['PATINAMIENTO_PRESETS', PATINAMIENTO_PRESETS],
    ['ANCHO_TRABAJO_PRESETS', ANCHO_TRABAJO_PRESETS],
    ['PROFUNDIDAD_PRESETS', PROFUNDIDAD_PRESETS],
    ['PESO_IMPLEMENTO_PRESETS', PESO_IMPLEMENTO_PRESETS],
    ['POTENCIA_REQUERIDA_PRESETS', POTENCIA_REQUERIDA_PRESETS],
  ];

  for (const [name, presets] of allPresets) {
    test(`${name} is a valid preset array`, () => {
      assertValidPresets(presets, name);
    });
  }
});

// ---------------------------------------------------------------------------
// Preset value sanity tests (numeric presets must parse correctly)
// ---------------------------------------------------------------------------

describe('fieldPresets — numeric values', () => {
  const numericPresets = [
    ['PB_PRESETS', PB_PRESETS],
    ['PMAX_TDP_PRESETS', PMAX_TDP_PRESETS],
    ['PESO_PRESETS', PESO_PRESETS],
    ['DIAMETRO_LLANTA_PRESETS', DIAMETRO_LLANTA_PRESETS],
    ['PRESION_PRESETS', PRESION_PRESETS],
    ['ALTITUD_PRESETS', ALTITUD_PRESETS],
    ['TEMPERATURA_PRESETS', TEMPERATURA_PRESETS],
    ['PENDIENTE_PRESETS', PENDIENTE_PRESETS],
    ['PATINAMIENTO_PRESETS', PATINAMIENTO_PRESETS],
    ['ANCHO_TRABAJO_PRESETS', ANCHO_TRABAJO_PRESETS],
    ['PROFUNDIDAD_PRESETS', PROFUNDIDAD_PRESETS],
    ['PESO_IMPLEMENTO_PRESETS', PESO_IMPLEMENTO_PRESETS],
    ['POTENCIA_REQUERIDA_PRESETS', POTENCIA_REQUERIDA_PRESETS],
  ];

  for (const [name, presets] of numericPresets) {
    test(`${name} all values parse to finite numbers`, () => {
      for (const preset of presets) {
        const n = Number(preset.value);
        ok(Number.isFinite(n), `${name}: value "${preset.value}" should parse to a finite number`);
      }
    });
  }
});

// ---------------------------------------------------------------------------
// Unknown defaults
// ---------------------------------------------------------------------------

describe('fieldPresets — unknown defaults', () => {
  test('PB_UNKNOWN_DEFAULT is a non-empty string parseable as positive number', () => {
    strictEqual(typeof PB_UNKNOWN_DEFAULT, 'string');
    ok(Number(PB_UNKNOWN_DEFAULT) > 0);
  });

  test('PMAX_TDP_UNKNOWN_DEFAULT is a non-empty string parseable as positive number', () => {
    strictEqual(typeof PMAX_TDP_UNKNOWN_DEFAULT, 'string');
    ok(Number(PMAX_TDP_UNKNOWN_DEFAULT) > 0);
  });

  test('PESO_UNKNOWN_DEFAULT is a non-empty string parseable as positive number', () => {
    strictEqual(typeof PESO_UNKNOWN_DEFAULT, 'string');
    ok(Number(PESO_UNKNOWN_DEFAULT) > 0);
  });

  test('Optional field defaults are empty strings (fields are truly optional)', () => {
    // These fields are optional — unknown default = '' → backend uses its own defaults
    strictEqual(DIAMETRO_LLANTA_UNKNOWN_DEFAULT, '');
    strictEqual(PRESION_UNKNOWN_DEFAULT, '');
    strictEqual(ALTITUD_UNKNOWN_DEFAULT, '');
    strictEqual(TEMPERATURA_UNKNOWN_DEFAULT, '');
    strictEqual(PENDIENTE_UNKNOWN_DEFAULT, '');
    strictEqual(PATINAMIENTO_UNKNOWN_DEFAULT, '');
  });

  test('ANCHO_TRABAJO_UNKNOWN_DEFAULT is parseable as positive number', () => {
    strictEqual(typeof ANCHO_TRABAJO_UNKNOWN_DEFAULT, 'string');
    ok(Number(ANCHO_TRABAJO_UNKNOWN_DEFAULT) > 0);
  });

  test('PROFUNDIDAD_UNKNOWN_DEFAULT is parseable as positive number', () => {
    strictEqual(typeof PROFUNDIDAD_UNKNOWN_DEFAULT, 'string');
    ok(Number(PROFUNDIDAD_UNKNOWN_DEFAULT) > 0);
  });

  test('PESO_IMPLEMENTO_UNKNOWN_DEFAULT is parseable as positive number', () => {
    strictEqual(typeof PESO_IMPLEMENTO_UNKNOWN_DEFAULT, 'string');
    ok(Number(PESO_IMPLEMENTO_UNKNOWN_DEFAULT) > 0);
  });

  test('POTENCIA_REQUERIDA_UNKNOWN_DEFAULT is parseable as positive number', () => {
    strictEqual(typeof POTENCIA_REQUERIDA_UNKNOWN_DEFAULT, 'string');
    ok(Number(POTENCIA_REQUERIDA_UNKNOWN_DEFAULT) > 0);
  });
});

// ---------------------------------------------------------------------------
// Business logic: PB presets are within a sane HP range for farm tractors
// ---------------------------------------------------------------------------

describe('PB_PRESETS — domain sanity', () => {
  test('all PB presets are between 40 and 300 HP (sane range for agricultural tractors)', () => {
    for (const preset of PB_PRESETS) {
      const hp = Number(preset.value);
      ok(hp >= 40, `${preset.label} HP (${hp}) is below minimum 40 HP`);
      ok(hp <= 300, `${preset.label} HP (${hp}) is above maximum 300 HP`);
    }
  });

  test('PMAX_TDP values are less than corresponding PB values (TDP <= Pb)', () => {
    // The 4 PMAX presets correspond to 86% of the 4 PB presets
    for (let i = 0; i < Math.min(PB_PRESETS.length, PMAX_TDP_PRESETS.length); i++) {
      const pb = Number(PB_PRESETS[i].value);
      const tdp = Number(PMAX_TDP_PRESETS[i].value);
      ok(tdp < pb, `PMAX TDP (${tdp}) should be less than PB (${pb}) for index ${i}`);
    }
  });
});
