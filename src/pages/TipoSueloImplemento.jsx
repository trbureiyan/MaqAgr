/**
 * @fileoverview Paso 2 del flujo "Tengo Maquinaria".
 *
 * Pregunta al usuario el tipo de suelo donde se usará el implemento.
 * Lee los datos del Paso 1 desde localStorage y los combina con el
 * tipo de suelo antes de navegar a los resultados.
 *
 * Tipos de suelo disponibles (coinciden con el backend):
 *  clay (Arcilloso) | sandy (Arenoso) | loam (Franco) |
 *  silt (Limoso)    | All (Todos)
 *
 * @module pages/TipoSueloImplemento
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import StepIndicator from '../components/ui/StepIndicator';
import SueloImg from '../assets/img/suelo.png';
import { ChevronRight, ChevronLeft } from 'lucide-react';

// ---------------------------------------------------------------------------
// Constantes
// ---------------------------------------------------------------------------

const TIPOS_SUELO = [
  {
    value: 'clay',
    label: 'Arcilloso',
    descripcion: 'Suelo pesado, alta retención de agua, difícil de trabajar en húmedo.',
  },
  {
    value: 'sandy',
    label: 'Arenoso',
    descripcion: 'Suelo ligero, baja retención de agua, fácil de trabajar.',
  },
  {
    value: 'loam',
    label: 'Franco',
    descripcion: 'Suelo equilibrado, mezcla de arena, limo y arcilla. Ideal para cultivos.',
  },
  {
    value: 'silt',
    label: 'Limoso',
    descripcion: 'Suelo de grano fino, muy fértil pero propenso a la compactación.',
  },
  {
    value: 'All',
    label: 'Todo tipo de suelo',
    descripcion: 'El implemento es compatible con cualquier tipo de suelo.',
  },
];

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

export default function TipoSueloImplemento() {
  const navigate = useNavigate();
  const location = useLocation();
  const [tipoSuelo, setTipoSuelo] = useState('');
  const [error, setError] = useState('');

  // Recibir datos del paso 1 vía navigate state (fallback a localStorage para compatibilidad)
  const implementData = location.state?.implementData || (() => {
    try { return JSON.parse(localStorage.getItem('implemento_datos') || '{}'); } catch { return {}; }
  })();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!tipoSuelo) {
      setError('Por favor selecciona el tipo de suelo.');
      return;
    }

    // También actualizar localStorage para compatibilidad
    const datosPrevios = implementData;
    localStorage.setItem('implemento_datos', JSON.stringify({
      ...datosPrevios,
      soil_type: tipoSuelo,
    }));

    // Navegar con state completo (como el flujo Tengo Tractor)
    navigate('/ResultadosImplemento', {
      state: {
        implementData: {
          ...datosPrevios,
          soilType: tipoSuelo,
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
            labels={["Implemento", "Suelo", "Resultados"]}
          />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]">

            {/* ── Panel izquierdo: imagen ── */}
            <div className="bg-gray-50 border-b md:border-b-0 md:border-r border-gray-100 p-6 flex flex-col items-center justify-center gap-5">
              <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-white border border-gray-100 flex items-center justify-center p-3">
                <img
                  src={SueloImg}
                  alt="Tipo de suelo"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <p className="text-xs text-center text-gray-400 px-2">
                El tipo de suelo afecta directamente la resistencia al rodamiento y la potencia necesaria del tractor.
              </p>
            </div>

            {/* ── Panel derecho: formulario ── */}
            <div className="p-6 md:p-8">
              <div className="mb-6">
                <h1 className="text-xl font-semibold text-gray-900">Condición del Terreno</h1>
                <p className="text-sm text-gray-500 mt-1">
                  ¿En qué tipo de suelo se utilizará el implemento?
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit} noValidate>

                <div className="grid grid-cols-1 gap-3">
                  {TIPOS_SUELO.map((suelo) => (
                    <label
                      key={suelo.value}
                      className={[
                        'flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all duration-150',
                        tipoSuelo === suelo.value
                          ? 'border-[#893d46] bg-[#893d46]/5 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50/50',
                      ].join(' ')}
                    >
                      <input
                        type="radio"
                        name="soil_type"
                        value={suelo.value}
                        checked={tipoSuelo === suelo.value}
                        onChange={() => {
                          setTipoSuelo(suelo.value);
                          setError('');
                        }}
                        className="mt-1 h-4 w-4 accent-[#893d46] flex-shrink-0"
                      />
                      <div>
                        <p className={`font-medium text-sm leading-none ${tipoSuelo === suelo.value ? 'text-[#893d46]' : 'text-gray-900'}`}>
                          {suelo.label}
                        </p>
                        <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{suelo.descripcion}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {error && (
                  <p className="mt-1.5 text-xs text-red-600" role="alert">
                    {error}
                  </p>
                )}

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
