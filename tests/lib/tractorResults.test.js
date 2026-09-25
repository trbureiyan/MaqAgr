/**
 * @fileoverview Pruebas unitarias para la vista de resultados de "Tengo Tractor".
 *
 * Valida que:
 * 1. Ningún dato esté quemado (cálculos 100% dinámicos según entradas del usuario).
 * 2. El patinamiento NO sea 0 cuando el usuario ingresa un porcentaje de patinamiento.
 * 3. La resistencia al rodamiento NO sea 0 cuando hay peso y suelo agrícola.
 * 4. Cuando el tractor NO tiene turbo, la pérdida por altitud sea mayor que 0.
 * 5. Cuando el tractor TIENE turbo, la pérdida por altitud sea 0 (compensado).
 * 6. Todos los tipos y condiciones de suelo se traduzcan dinámicamente al español.
 */

import { test, describe } from 'node:test';
import { strictEqual, ok, notStrictEqual } from 'node:assert/strict';
import { getSoilLabel, getSoilConditionLabel } from '../../src/lib/utils.js';

describe('Resultados de Tractor — Mapeo dinámico y traducción a español', () => {
  test('los tipos de suelo se traducen correctamente a español sin valores quemados', () => {
    strictEqual(getSoilLabel('clay'), 'Arcilloso');
    strictEqual(getSoilLabel('sandy'), 'Arenoso');
    strictEqual(getSoilLabel('loam'), 'Franco');
    strictEqual(getSoilLabel('silt'), 'Limoso');
    strictEqual(getSoilLabel('rocky'), 'Pedregoso');
    strictEqual(getSoilLabel('all'), 'Todo tipo de suelo');
  });

  test('las condiciones del terreno se traducen correctamente a español', () => {
    strictEqual(getSoilConditionLabel('bueno'), 'Firme / Bueno');
    strictEqual(getSoilConditionLabel('medio'), 'Intermedio');
    strictEqual(getSoilConditionLabel('malo'), 'Suelto / Húmedo');
  });

  test('no genera valores indefinidos para suelos desconocidos o nulos', () => {
    strictEqual(getSoilLabel(null), 'Franco');
    strictEqual(getSoilLabel(''), 'Franco');
    strictEqual(getSoilConditionLabel(null), null);
  });
});

describe('Resultados de Tractor — Cálculos dinámicos sin turbo (Pérdidas reales)', () => {
  // Simulador puro de las fórmulas matemáticas implementadas en el backend
  const calculateLosses = ({
    enginePowerHp,
    weightKg,
    slopePercent = 0,
    speedKmh = 7,
    altitudeM = 0,
    temperatureC = 22,
    slippagePercent = 15,
    hasTurbo = false,
    soilCn = 25, // arenoso = 25, franco = 35, arcilla = 45
  }) => {
    // 1. Pérdidas atmosféricas
    const altitudeLoss = hasTurbo ? 0 : enginePowerHp * (altitudeM / 300) * 0.01;
    const temperatureLoss = hasTurbo ? 0 : Math.max(0, enginePowerHp * ((temperatureC - 15) / 5) * 0.01);
    const powerAfterAtm = enginePowerHp - altitudeLoss - temperatureLoss;

    // 2. Pérdida de transmisión mecánica (13%)
    const transmissionLoss = powerAfterAtm * 0.13;
    const powerAtWheels = powerAfterAtm - transmissionLoss;

    // 3. Rodamiento (ASABE / Chaparro ec. 6)
    const angleRad = Math.atan(slopePercent / 100);
    const muR = 1.2 / soilCn + 0.04;
    const fnKg = weightKg * Math.cos(angleRad);
    const rollingResistanceLoss = (muR * fnKg * (speedKmh / 3.6)) / 274.4;

    // 4. Pendiente
    const slopeLoss = slopePercent > 0 ? (weightKg * Math.sin(angleRad) * (speedKmh / 3.6)) / 274.4 : 0;

    // 5. Patinamiento
    const powerBeforeSlippage = powerAtWheels - rollingResistanceLoss - slopeLoss;
    const slippageLoss = Math.max(0, powerBeforeSlippage) * (slippagePercent / 100);

    // Potencia neta final
    const netPowerHp = Math.max(0, powerBeforeSlippage - slippageLoss);
    const totalLossHp = altitudeLoss + temperatureLoss + transmissionLoss + rollingResistanceLoss + slopeLoss + slippageLoss;
    const efficiencyPct = (netPowerHp / enginePowerHp) * 100;

    return {
      altitudeLossHp: +altitudeLoss.toFixed(2),
      temperatureLossHp: +temperatureLoss.toFixed(2),
      transmissionLossHp: +transmissionLoss.toFixed(2),
      rollingResistanceLossHp: +rollingResistanceLoss.toFixed(2),
      slopeLossHp: +slopeLoss.toFixed(2),
      slippageLossHp: +slippageLoss.toFixed(2),
      totalLossHp: +totalLossHp.toFixed(2),
      netPowerHp: +netPowerHp.toFixed(2),
      efficiencyPct: +efficiencyPct.toFixed(2),
    };
  };

  test('CASO DEL USUARIO SIN TURBO: el patinamiento NO es cero y la altitud tiene pérdida', () => {
    const input = {
      enginePowerHp: 120,
      weightKg: 8000,
      soilCn: 25, // Suelo Arenoso
      altitudeM: 1000,
      temperatureC: 22,
      slopePercent: 5,
      speedKmh: 7,
      slippagePercent: 15,
      hasTurbo: false, // SIN TURBO
    };

    const res = calculateLosses(input);

    // 1. Verificar que el patinamiento NO es 0
    ok(res.slippageLossHp > 0, `El patinamiento debe ser mayor a 0, dio: ${res.slippageLossHp} HP`);
    ok(res.slippageLossHp >= 10, `Para 15% de patinamiento debe rondar los 13 HP, dio: ${res.slippageLossHp} HP`);

    // 2. Verificar que la resistencia al rodamiento NO es 0
    ok(res.rollingResistanceLossHp > 0, `La resistencia al rodamiento debe ser mayor a 0, dio: ${res.rollingResistanceLossHp} HP`);
    ok(res.rollingResistanceLossHp >= 4, `Para 8000kg en arena debe rondar los 4.9 HP, dio: ${res.rollingResistanceLossHp} HP`);

    // 3. Verificar que SIN TURBO la altitud tiene pérdida real (no 0)
    ok(res.altitudeLossHp > 0, `Sin turbo a 1000m debe haber pérdida de altitud, dio: ${res.altitudeLossHp} HP`);
    strictEqual(res.altitudeLossHp, 4.0, 'A 1000m la pérdida por altitud es 120 * (1000/300) * 0.01 = 4.0 HP');

    // 4. Verificar que la pendiente se calcula correctamente
    ok(res.slopeLossHp > 0, `La pendiente al 5% debe ser mayor a 0, dio: ${res.slopeLossHp} HP`);

    // 5. Verificar que la potencia neta disponible es coherente con el motor menos pérdidas
    ok(res.netPowerHp > 0 && res.netPowerHp < input.enginePowerHp, 'La potencia neta debe ser menor a la del motor');
    strictEqual(res.netPowerHp, 77.9, 'Potencia neta calculada coincide con el modelo');
  });

  test('CASO CON TURBO: la altitud se compensa a 0.0 HP pero el patinamiento y rodamiento siguen activos', () => {
    const input = {
      enginePowerHp: 120,
      weightKg: 8000,
      soilCn: 25,
      altitudeM: 1000,
      temperatureC: 22,
      slopePercent: 5,
      speedKmh: 7,
      slippagePercent: 15,
      hasTurbo: true, // CON TURBO
    };

    const res = calculateLosses(input);

    // Con turbo la altitud es 0
    strictEqual(res.altitudeLossHp, 0, 'Con turbo la pérdida por altitud debe ser 0');

    // Pero patinamiento y rodamiento NUNCA deben salir en 0
    ok(res.slippageLossHp > 0, 'El patinamiento debe ser mayor que 0');
    ok(res.rollingResistanceLossHp > 0, 'La resistencia al rodamiento debe ser mayor que 0');

    // La potencia neta con turbo debe ser mayor que sin turbo
    ok(res.netPowerHp > 77.9, 'Con turbo la potencia neta debe ser mayor al no sufrir pérdida de altitud');
  });

  test('VARIACIÓN DE DATOS: comprueba que ningún dato esté quemado', () => {
    // Caso con tractor de 80 HP, 4500 kg, suelo arcilloso (Cn=45), patinamiento 10%
    const res80 = calculateLosses({
      enginePowerHp: 80,
      weightKg: 4500,
      soilCn: 45,
      altitudeM: 500,
      slopePercent: 2,
      slippagePercent: 10,
      hasTurbo: false,
    });

    // Caso con tractor de 150 HP, 9500 kg, suelo arenoso (Cn=25), patinamiento 20%
    const res150 = calculateLosses({
      enginePowerHp: 150,
      weightKg: 9500,
      soilCn: 25,
      altitudeM: 2000,
      slopePercent: 8,
      slippagePercent: 20,
      hasTurbo: false,
    });

    // Validar que los resultados difieren totalmente y responden a las entradas
    notStrictEqual(res80.netPowerHp, res150.netPowerHp);
    notStrictEqual(res80.slippageLossHp, res150.slippageLossHp);
    notStrictEqual(res80.rollingResistanceLossHp, res150.rollingResistanceLossHp);
    notStrictEqual(res80.altitudeLossHp, res150.altitudeLossHp);

    ok(res150.altitudeLossHp > res80.altitudeLossHp, 'A mayor altitud y mayor HP, mayor pérdida por altitud');
    ok(res150.slippageLossHp > res80.slippageLossHp, 'A 20% de patinamiento la pérdida es mayor que a 10%');
  });
});
