/**
 * @fileoverview Paso 1 del flujo "Tengo Maquinaria".
 *
 * Recopila los datos técnicos del implemento agrícola (excluyendo
 * nombre, marca y estado, que se ignorarán hasta la integración con el back).
 * Los datos se guardan en localStorage para pasarlos al paso siguiente.
 *
 * Campos:
 *  - implement_type       : Tipo de implemento (select)
 *  - working_width_m      : Ancho de trabajo en metros
 *  - working_depth_cm     : Profundidad de trabajo en cm
 *  - weight_kg            : Peso del implemento en kg
 *
 * @module pages/DatosImplemento
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/buttons/Button';
import TooltipInfo from '../components/ui/buttons/ToolTipInfo';
import Maquina from '../assets/img/2.png';

// ---------------------------------------------------------------------------
// Constantes
// ---------------------------------------------------------------------------

/**
 * Tipos de implemento disponibles en el sistema.
 * Valores coinciden con los del backend (implement_type enum).
 */
const TIPOS_IMPLEMENTO = [
  { value: 'plow',       label: 'Arado (Plow)' },
  { value: 'harrow',     label: 'Rastra (Harrow)' },
  { value: 'seeder',     label: 'Sembradora (Seeder)' },
  { value: 'sprayer',    label: 'Aspersora (Sprayer)' },
  { value: 'harvester',  label: 'Cosechadora (Harvester)' },
  { value: 'cultivator', label: 'Cultivador' },
  { value: 'mower',      label: 'Segadora (Mower)' },
  { value: 'trailer',    label: 'Remolque (Trailer)' },
  { value: 'other',      label: 'Otro' },
];

/**
 * Estado inicial del formulario de datos del implemento.
 */
const ESTADO_INICIAL = {
  implement_type:    '',
  working_width_m:   '',
  working_depth_cm:  '',
  weight_kg:         '',
};

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

/**
 * DatosImplemento — Paso 1 del flujo "Tengo Maquinaria".
 *
 * @component
 * @returns {JSX.Element}
 */
export default function DatosImplemento() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(ESTADO_INICIAL);
  const [errors, setErrors]     = useState({});

  // ── Manejadores ──────────────────────────────────────────────────────────

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validar = () => {
    const nuevosErrores = {};
    if (!formData.implement_type)
      nuevosErrores.implement_type = 'Selecciona el tipo de implemento.';
    if (!formData.working_width_m || Number(formData.working_width_m) <= 0)
      nuevosErrores.working_width_m = 'Ingresa un ancho de trabajo válido.';
    if (!formData.working_depth_cm || Number(formData.working_depth_cm) <= 0)
      nuevosErrores.working_depth_cm = 'Ingresa una profundidad de trabajo válida.';
    if (!formData.weight_kg || Number(formData.weight_kg) <= 0)
      nuevosErrores.weight_kg = 'Ingresa el peso del implemento.';
    return nuevosErrores;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const erroresValidacion = validar();

    if (Object.keys(erroresValidacion).length > 0) {
      setErrors(erroresValidacion);
      return;
    }

    // Guardar datos en localStorage para el siguiente paso
    localStorage.setItem('implemento_datos', JSON.stringify({
      implement_type:   formData.implement_type,
      working_width_m:  Number(formData.working_width_m),
      working_depth_cm: Number(formData.working_depth_cm),
      weight_kg:        Number(formData.weight_kg),
    }));

    navigate('/TipoSueloImplemento');
  };

  // ── Estilos compartidos ──────────────────────────────────────────────────

  const inputBase =
    'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#991b1b] transition-colors';

  const inputClass = (field) =>
    `${inputBase} ${errors[field] ? 'border-red-500' : 'border-gray-300'}`;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-4xl">

        {/* ── Indicador de pasos ── */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#991b1b] text-white text-sm font-bold">1</span>
          <div className="w-12 h-0.5 bg-gray-300" />
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-500 text-sm font-bold">2</span>
          <div className="w-12 h-0.5 bg-gray-300" />
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-500 text-sm font-bold">3</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-8">
          Datos del implemento
        </h1>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8">

          {/* ── Imagen ilustrativa ── */}
          <div className="w-full md:w-1/2 flex items-center justify-center">
            <img
              src={Maquina}
              alt="Implemento agrícola"
              className="w-full max-w-xs md:max-w-full h-auto rounded-lg object-contain"
            />
          </div>

          {/* ── Formulario ── */}
          <div className="w-full md:w-1/2">
            <form className="space-y-5" onSubmit={handleSubmit} noValidate>

              {/* Tipo de implemento */}
              <div>
                <label htmlFor="implement_type" className="block text-gray-700 font-medium mb-1">
                  Tipo de implemento
                  <TooltipInfo content="Categoría del implemento agrícola que posees (ej. arado, rastra, sembradora)." />
                </label>
                <select
                  id="implement_type"
                  name="implement_type"
                  value={formData.implement_type}
                  onChange={handleChange}
                  className={inputClass('implement_type')}
                >
                  <option value="">Seleccione una opción</option>
                  {TIPOS_IMPLEMENTO.map((tipo) => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </option>
                  ))}
                </select>
                {errors.implement_type && (
                  <p className="mt-1 text-sm text-red-600">{errors.implement_type}</p>
                )}
              </div>

              {/* Ancho de trabajo */}
              <div>
                <label htmlFor="working_width_m" className="block text-gray-700 font-medium mb-1">
                  Ancho de trabajo
                  <TooltipInfo content="Ancho de la franja que cubre el implemento en cada pasada, expresado en metros (m)." />
                </label>
                <input
                  id="working_width_m"
                  name="working_width_m"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="Valor en metros (m)"
                  value={formData.working_width_m}
                  onChange={handleChange}
                  className={inputClass('working_width_m')}
                />
                {errors.working_width_m && (
                  <p className="mt-1 text-sm text-red-600">{errors.working_width_m}</p>
                )}
              </div>

              {/* Profundidad de trabajo */}
              <div>
                <label htmlFor="working_depth_cm" className="block text-gray-700 font-medium mb-1">
                  Profundidad de trabajo
                  <TooltipInfo content="Profundidad máxima a la que opera el implemento en el suelo, en centímetros (cm)." />
                </label>
                <input
                  id="working_depth_cm"
                  name="working_depth_cm"
                  type="number"
                  step="1"
                  min="0"
                  placeholder="Valor en centímetros (cm)"
                  value={formData.working_depth_cm}
                  onChange={handleChange}
                  className={inputClass('working_depth_cm')}
                />
                {errors.working_depth_cm && (
                  <p className="mt-1 text-sm text-red-600">{errors.working_depth_cm}</p>
                )}
              </div>

              {/* Peso del implemento */}
              <div>
                <label htmlFor="weight_kg" className="block text-gray-700 font-medium mb-1">
                  Peso del implemento
                  <TooltipInfo content="Peso total del implemento en kilogramos (kg). Influye en el cálculo de la fuerza de tracción necesaria." />
                </label>
                <input
                  id="weight_kg"
                  name="weight_kg"
                  type="number"
                  step="1"
                  min="0"
                  placeholder="Valor en kilogramos (kg)"
                  value={formData.weight_kg}
                  onChange={handleChange}
                  className={inputClass('weight_kg')}
                />
                {errors.weight_kg && (
                  <p className="mt-1 text-sm text-red-600">{errors.weight_kg}</p>
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
