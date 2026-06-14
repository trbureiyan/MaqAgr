/**
 * @fileoverview Tests for src/lib/formUtils.js
 *
 * Uses Node.js built-in test runner (node:test).
 * Destructured assert per project convention (AGENTS.md).
 */

import { test, describe } from 'node:test';
import { strictEqual, ok } from 'node:assert/strict';

// We import from the src dir — pure JS functions, no JSX, no browser APIs.
import { getInputClass, INPUT_BASE, parsePositiveNumber, parseNumber } from '../../src/lib/formUtils.js';

// ---------------------------------------------------------------------------
// getInputClass
// ---------------------------------------------------------------------------

describe('getInputClass', () => {
  test('returns base classes without error class when field has no error', () => {
    const result = getInputClass('pb', {});
    ok(result.includes('border-gray-300'), 'should include border-gray-300 when no error');
    ok(result.includes(INPUT_BASE), 'should include the base class string');
  });

  test('returns base classes WITH error class when field has an error', () => {
    const result = getInputClass('pb', { pb: 'Ingresa una potencia válida.' });
    ok(result.includes('border-red-500'), 'should include border-red-500 when field has error');
    ok(!result.includes('border-gray-300'), 'should NOT include border-gray-300 when there is an error');
  });

  test('does not mark field as error when a DIFFERENT field has an error', () => {
    const result = getInputClass('pb', { peso: 'Ingresa un peso válido.' });
    ok(result.includes('border-gray-300'), 'should include border-gray-300 when a different field has error');
    ok(!result.includes('border-red-500'), 'should NOT include border-red-500');
  });

  test('handles empty string error value (falsy) as no error', () => {
    const result = getInputClass('pb', { pb: '' });
    ok(result.includes('border-gray-300'), 'empty string error should behave like no error');
  });
});

// ---------------------------------------------------------------------------
// parsePositiveNumber
// ---------------------------------------------------------------------------

describe('parsePositiveNumber', () => {
  test('parses a positive integer string', () => {
    strictEqual(parsePositiveNumber('80'), 80);
  });

  test('parses a positive float string', () => {
    strictEqual(parsePositiveNumber('4500.5'), 4500.5);
  });

  test('returns null for empty string', () => {
    strictEqual(parsePositiveNumber(''), null);
  });

  test('returns null for non-numeric string', () => {
    strictEqual(parsePositiveNumber('abc'), null);
  });

  test('returns null for zero', () => {
    strictEqual(parsePositiveNumber('0'), null, 'zero is not a positive number');
  });

  test('returns null for negative number string', () => {
    strictEqual(parsePositiveNumber('-5'), null);
  });

  test('accepts numeric input directly (not just strings)', () => {
    strictEqual(parsePositiveNumber(120), 120);
  });
});

// ---------------------------------------------------------------------------
// parseNumber
// ---------------------------------------------------------------------------

describe('parseNumber', () => {
  test('parses zero as 0, not null', () => {
    strictEqual(parseNumber('0'), 0);
  });

  test('parses negative numbers', () => {
    strictEqual(parseNumber('-5'), -5);
  });

  test('parses positive float', () => {
    strictEqual(parseNumber('1000.5'), 1000.5);
  });

  test('returns null for empty string', () => {
    strictEqual(parseNumber(''), null);
  });

  test('returns null for null input', () => {
    strictEqual(parseNumber(null), null);
  });

  test('returns null for undefined input', () => {
    strictEqual(parseNumber(undefined), null);
  });

  test('returns null for non-numeric string', () => {
    strictEqual(parseNumber('abc'), null);
  });
});
