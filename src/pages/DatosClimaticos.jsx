/**
 * @fileoverview Paso 3 del flujo "Tengo Tractor" — especificaciones climáticas y de terreno.
 *
 * @module pages/DatosClimaticos
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Nube from '../assets/img/nubes.png';
import FieldWithPresets from '../components/ui/FieldWithPresets';
import StepIndicator from '../components/ui/StepIndicator';
import { getInputClass } from '../lib/formUtils';
import {
  ALTITUD_PRESETS, ALTITUD_UNKNOWN_DEFAULT,
  TEMPERATURA_PRESETS, TEMPERATURA_UNKNOWN_DEFAULT,
  PENDIENTE_PRESETS, PENDIENTE_UNKNOWN_DEFAULT,
  PATINAMIENTO_PRESETS, PATINAMIENTO_UNKNOWN_DEFAULT,
} from '../lib/fieldPresets';
import { ChevronRight, ChevronLeft } from 'lucide-react';

function DatosClimaticos() {
  const navigate = useNavigate();
  const location = useLocation();

  const tractorData = location.state?.tractorData || {};
  const llantaData = location.state?.llantaData || {};

  const [formData, setFormData] = useState({
    altitudeM: '',
    ambientTemperatureC: '',
    slopePercent: '',
    slippagePercent: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const toNumberOrNull = (value) => {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : null;
    };

    const altitudeM = toNumberOrNull(formData.altitudeM);
    const ambientTemperatureC = toNumberOrNull(formData.ambientTemperatureC);
    const slopePercent = toNumberOrNull(formData.slopePercent);
    const slippagePercentInput = toNumberOrNull(formData.slippagePercent);
    
    // Si no se conoce el patinamiento, el backend usará 15% como default
    const slippagePercent = slippagePercentInput === null
      ? null
      : Math.min(100, Math.max(0, slippagePercentInput));

    const hasTurbo = tractorData.turbo === 'si';

    const payload = {
      enginePowerHp: tractorData.pb || null,
      pmaxTdpHp: tractorData.pmax_tdp || null,
      weightKg: tractorData.peso || null,
      hasTurbo,
      tireDiameterIn: llantaData.diametroLlanta || null,
      tirePressurePsi: llantaData.presionInflado || null,
      soilType: llantaData.tipoSuelo || null,
      altitudeM,
      ambientTemperatureC,
      slopePercent,
      slippagePercent,
    };

    navigate("/Resultados", {
      state: {
        payload,
        tractorData,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-4xl">

        <div className="mb-6 px-1">
          <StepIndicator
            current={3}
            total={3}
            labels={["Motor", "Llantas", "Clima"]}
          />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]">

            {/* ── Panel izquierdo: imagen ── */}
            <div className="bg-gray-50 border-b md:border-b-0 md:border-r border-gray-100 p-6 flex flex-col items-center justify-center gap-5">
              <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-white border border-gray-100 flex items-center justify-center p-3">
                <img
                  src={Nube}
                  alt="Referencia climática"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <p className="text-xs text-center text-gray-400 px-2">
                Estos valores ayudan a corregir la pérdida de potencia por factores ambientales.
              </p>
            </div>

            {/* ── Panel derecho: formulario ── */}
            <div className="p-6 md:p-8">
              <div className="mb-6">
                <h1 className="text-xl font-semibold text-gray-900">Clima y Terreno</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Todos estos campos son opcionales. El sistema usará valores estándar si los dejas vacíos.
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FieldWithPresets
                    id="altitudeM"
                    name="altitudeM"
                    label="Altitud"
                    tooltip="Altura sobre el nivel del mar en metros (msnm)"
                    value={formData.altitudeM}
                    onChange={handleChange}
                    placeholder="msnm"
                    presets={ALTITUD_PRESETS}
                    unknownDefault={ALTITUD_UNKNOWN_DEFAULT}
                    unknownLabel="dejar vacío"
                    inputClass={getInputClass('altitudeM', {})}
                  />

                  <FieldWithPresets
                    id="ambientTemperatureC"
                    name="ambientTemperatureC"
                    label="Temperatura ambiente"
                    tooltip="Temperatura promedio en grados Celsius (°C)"
                    value={formData.ambientTemperatureC}
                    onChange={handleChange}
                    placeholder="°C"
                    presets={TEMPERATURA_PRESETS}
                    unknownDefault={TEMPERATURA_UNKNOWN_DEFAULT}
                    unknownLabel="dejar vacío"
                    inputClass={getInputClass('ambientTemperatureC', {})}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FieldWithPresets
                    id="slopePercent"
                    name="slopePercent"
                    label="Pendiente"
                    tooltip="Inclinación del terreno en porcentaje (%). 0% = plano."
                    value={formData.slopePercent}
                    onChange={handleChange}
                    placeholder="%"
                    presets={PENDIENTE_PRESETS}
                    unknownDefault={PENDIENTE_UNKNOWN_DEFAULT}
                    unknownLabel="0% (plano)"
                    inputClass={getInputClass('slopePercent', {})}
                  />

                  <FieldWithPresets
                    id="slippagePercent"
                    name="slippagePercent"
                    label="Patinamiento"
                    tooltip="Porcentaje estimado de patinamiento. Default del sistema: 15%."
                    value={formData.slippagePercent}
                    onChange={handleChange}
                    placeholder="% (default: 15)"
                    presets={PATINAMIENTO_PRESETS}
                    unknownDefault={PATINAMIENTO_UNKNOWN_DEFAULT}
                    unknownLabel="sistema usará 15%"
                    inputClass={getInputClass('slippagePercent', {})}
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Volver
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#893d46] text-white text-sm font-semibold rounded-lg hover:bg-[#7a3540] active:bg-[#6b2e38] transition-colors shadow-sm"
                  >
                    Ver Resultados
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DatosClimaticos;