/**
 * @fileoverview Componente de campo de formulario con presets y botón "No conozco el dato".
 *
 * Encapsula el patrón recurrente de:
 *  1. `<label>` + tooltip opcional
 *  2. Botón "No conozco el dato" que inserta un valor por defecto
 *  3. Chips de presets seleccionables que rellenan el campo
 *  4. `<input>` con estilo de error
 *  5. Mensaje de error
 *
 * Diseño visual: chips pequeños alineados en fila, sin glassmorphism.
 * Inspirado en el estilo de Linear / GitHub — funcional, sin decoración.
 *
 * @module components/ui/FieldWithPresets
 */

import React from 'react';
import TooltipInfo from './buttons/ToolTipInfo';
import { HelpCircle } from 'lucide-react';

/**
 * FieldWithPresets — Campo numérico con presets de valores comunes.
 *
 * @param {Object}   props
 * @param {string}   props.id            - ID del input (para htmlFor del label).
 * @param {string}   props.name          - Nombre del campo (name del input).
 * @param {string}   props.label         - Texto de la etiqueta.
 * @param {string}   [props.tooltip]     - Texto del tooltip informativo.
 * @param {string}   props.value         - Valor actual del campo.
 * @param {Function} props.onChange      - Handler onChange del input.
 * @param {string}   [props.error]       - Mensaje de error (vacío = sin error).
 * @param {string}   [props.placeholder] - Placeholder del input.
 * @param {string}   [props.type]        - Tipo de input (default: 'number').
 * @param {string}   [props.step]        - Step del input numérico.
 * @param {string}   [props.min]         - Mínimo del input numérico.
 * @param {Array<{label: string, value: string, hint: string}>} props.presets
 *   - Lista de valores predefinidos a mostrar como chips.
 * @param {string}   [props.unknownDefault]
 *   - Valor a insertar cuando el usuario pulsa "No conozco el dato".
 *   - Si está vacío o undefined, el botón no se renderiza.
 * @param {string}   [props.unknownLabel]
 *   - Etiqueta del valor que se inserta (se muestra en el botón).
 *   - Ejemplo: "~80 HP (estimado)".
 * @param {string}   [props.inputClass]  - Clases CSS del input (ya calculadas).
 *
 * @returns {JSX.Element}
 *
 * @example
 * <FieldWithPresets
 *   id="pb"
 *   name="pb"
 *   label="Potencia Bruta"
 *   tooltip="Potencia bruta del tractor en HP"
 *   value={formData.pb}
 *   onChange={handleChange}
 *   error={errors.pb}
 *   placeholder="Valor en HP"
 *   presets={PB_PRESETS}
 *   unknownDefault={PB_UNKNOWN_DEFAULT}
 *   unknownLabel="~80 HP"
 *   inputClass={getInputClass('pb', errors)}
 * />
 */
const FieldWithPresets = ({
  id,
  name,
  label,
  tooltip,
  value,
  onChange,
  error,
  placeholder,
  type = 'number',
  step,
  min,
  presets = [],
  unknownDefault,
  unknownLabel,
  inputClass,
}) => {
  /**
   * Emula un evento onChange sintético para que el handler del formulario
   * funcione sin necesidad de adaptación.
   *
   * @param {string} newValue - Valor a insertar.
   */
  const injectValue = (newValue) => {
    onChange({ target: { name, value: newValue } });
  };

  return (
    <div>
      {/* Fila superior: label + botón "No conozco el dato" */}
      <div className="flex items-center justify-between mb-1 gap-2 flex-wrap">
        <label
          htmlFor={id}
          className="block text-gray-700 font-medium"
        >
          {label}
          {tooltip && <TooltipInfo content={tooltip} />}
        </label>

        {unknownDefault !== undefined && unknownDefault !== null && (
          <button
            type="button"
            onClick={() => injectValue(unknownDefault || '')}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#991b1b] transition-colors shrink-0"
            title={`Usar valor típico: ${unknownLabel || unknownDefault || 'vacío'}`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            No conozco el dato
          </button>
        )}
      </div>

      {/* Chips de presets */}
      {presets.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2" role="group" aria-label={`Valores de referencia para ${label}`}>
          {presets.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => injectValue(preset.value)}
              title={preset.hint}
              className={`px-2.5 py-1 text-xs rounded border font-medium transition-colors ${
                value === preset.value
                  ? 'bg-[#991b1b] text-white border-[#991b1b]'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-[#991b1b] hover:text-[#991b1b]'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}

      {/* Input principal */}
      <input
        id={id}
        name={name}
        type={type}
        step={step}
        min={min}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={inputClass}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      />

      {/* Mensaje de error */}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default FieldWithPresets;
