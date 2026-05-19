/**
 * @fileoverview Paso 2 del flujo "Tengo Tractor" — especificaciones de las llantas y suelo.
 *
 * @module pages/DatosLlanta
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Llanta } from '../assets/img';
import FieldWithPresets from '../components/ui/FieldWithPresets';
import StepIndicator from '../components/ui/StepIndicator';
import { getInputClass } from '../lib/formUtils';
import {
  DIAMETRO_LLANTA_PRESETS, DIAMETRO_LLANTA_UNKNOWN_DEFAULT,
  PRESION_PRESETS, PRESION_UNKNOWN_DEFAULT,
} from '../lib/fieldPresets';
import { ChevronRight, ChevronLeft } from 'lucide-react';

function DatosLlanta() {
  const navigate = useNavigate();
  const location = useLocation();
  const tractorData = location.state?.tractorData || {};

  const [formData, setFormData] = useState({
    diametroLlanta: '',
    presionInflado: '',
    tipoSuelo: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate('/DatosClimaticos', {
      state: {
        tractorData,
        llantaData: {
          diametroLlanta: Number(formData.diametroLlanta) || null,
          presionInflado: Number(formData.presionInflado) || null,
          tipoSuelo: formData.tipoSuelo || null,
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-4xl">

        <div className="mb-6 px-1">
          <StepIndicator
            current={2}
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
                  src={Llanta}
                  alt="Llantas de tractor"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <p className="text-xs text-center text-gray-400 px-2">
                Los datos de la llanta y el suelo son opcionales pero mejoran la precisión del cálculo.
              </p>
            </div>

            {/* ── Panel derecho: formulario ── */}
            <div className="p-6 md:p-8">
              <div className="mb-6">
                <h1 className="text-xl font-semibold text-gray-900">Llantas y Suelo</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Especifica las características de rodamiento y el terreno. Todos estos campos son opcionales.
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FieldWithPresets
                    id="diametroLlanta"
                    name="diametroLlanta"
                    label="Diámetro de llanta"
                    tooltip="Diámetro total de la llanta en pulgadas (in)"
                    value={formData.diametroLlanta}
                    onChange={handleChange}
                    placeholder="Pulgadas (in)"
                    presets={DIAMETRO_LLANTA_PRESETS}
                    unknownDefault={DIAMETRO_LLANTA_UNKNOWN_DEFAULT}
                    unknownLabel="dejar vacío"
                    inputClass={getInputClass('diametroLlanta', {})}
                  />

                  <FieldWithPresets
                    id="presionInflado"
                    name="presionInflado"
                    label="Presión de inflado"
                    tooltip="Presión de las llantas en PSI"
                    value={formData.presionInflado}
                    onChange={handleChange}
                    placeholder="PSI"
                    presets={PRESION_PRESETS}
                    unknownDefault={PRESION_UNKNOWN_DEFAULT}
                    unknownLabel="dejar vacío"
                    inputClass={getInputClass('presionInflado', {})}
                  />
                </div>

                <div>
                  <label htmlFor="tipoSuelo" className="text-sm font-medium text-gray-700 leading-none block mb-1.5">
                    Condición del suelo
                  </label>
                  <select
                    id="tipoSuelo"
                    name="tipoSuelo"
                    value={formData.tipoSuelo}
                    onChange={handleChange}
                    className={getInputClass('tipoSuelo', {})}
                  >
                    <option value="">Selecciona el tipo de suelo (Opcional)</option>
                    <option value="firme">Firme — Suelo seco, compactado, sin labrar</option>
                    <option value="blando">Blando — Suelo suelto, arado recientemente, arenoso</option>
                  </select>
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
                    Siguiente
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

export default DatosLlanta;