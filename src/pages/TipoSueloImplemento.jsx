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
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/buttons/Button';
import TooltipInfo from '../components/ui/buttons/ToolTipInfo';
import SueloImg from '../assets/img/suelo.png';

// ---------------------------------------------------------------------------
// Constantes
// ---------------------------------------------------------------------------

/**
 * Opciones de tipo de suelo.
 * `value` coincide con el campo `soil_type` del backend.
 */
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

/**
 * TipoSueloImplemento — Paso 2 del flujo "Tengo Maquinaria".
 *
 * @component
 * @returns {JSX.Element}
 */
export default function TipoSueloImplemento() {
  const navigate  = useNavigate();
  const [tipoSuelo, setTipoSuelo] = useState('');
  const [error, setError]          = useState('');

  // ── Manejadores ──────────────────────────────────────────────────────────

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!tipoSuelo) {
      setError('Por favor selecciona el tipo de suelo.');
      return;
    }

    // Recuperar datos del paso 1
    const datosPrevios = JSON.parse(localStorage.getItem('implemento_datos') || '{}');

    // Combinar y guardar datos completos
    localStorage.setItem('implemento_datos', JSON.stringify({
      ...datosPrevios,
      soil_type: tipoSuelo,
    }));

    navigate('/ResultadosImplemento');
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-4xl">

        {/* ── Indicador de pasos ── */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-600 text-white text-sm font-bold">✓</span>
          <div className="w-12 h-0.5 bg-[#991b1b]" />
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#991b1b] text-white text-sm font-bold">2</span>
          <div className="w-12 h-0.5 bg-gray-300" />
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-500 text-sm font-bold">3</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-8">
          Tipo de suelo
        </h1>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8">

          {/* ── Imagen ilustrativa ── */}
          <div className="w-full md:w-1/2 flex items-center justify-center">
            <img
              src={SueloImg}
              alt="Tipo de suelo"
              className="w-full max-w-xs md:max-w-full h-auto rounded-lg object-contain"
            />
          </div>

          {/* ── Formulario ── */}
          <div className="w-full md:w-1/2">
            <form className="space-y-4" onSubmit={handleSubmit} noValidate>

              <div>
                <label className="block text-gray-700 font-medium mb-3">
                  ¿En qué tipo de suelo se utilizará el implemento?
                  <TooltipInfo content="El tipo de suelo afecta directamente la resistencia al rodamiento y la potencia necesaria del tractor." />
                </label>

                {/* ── Selector visual de tipo de suelo (cards de radio) ── */}
                <div className="grid grid-cols-1 gap-3">
                  {TIPOS_SUELO.map((suelo) => (
                    <label
                      key={suelo.value}
                      className={[
                        'flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all duration-150',
                        tipoSuelo === suelo.value
                          ? 'border-[#991b1b] bg-red-50'
                          : 'border-gray-200 hover:border-gray-400',
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
                        className="mt-0.5 h-4 w-4 accent-[#991b1b] flex-shrink-0"
                      />
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{suelo.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{suelo.descripcion}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {error && (
                  <p className="mt-2 text-sm text-red-600">{error}</p>
                )}
              </div>

              {/* ── Botones de navegación ── */}
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  color="#991b1b"
                  type="button"
                  onClick={() => navigate(-1)}
                >
                  VOLVER
                </Button>
                <Button
                  variant="primary"
                  color="#991b1b"
                  type="submit"
                >
                  SIGUIENTE
                </Button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
