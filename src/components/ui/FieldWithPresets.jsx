/**
 * @fileoverview Campo de formulario con presets y ayuda contextual bajo demanda.
 *
 * Principio de diseño: progressive disclosure.
 * El campo se ve limpio por defecto; las opciones de referencia se activan
 * sólo cuando el usuario las necesita — al hacer foco o al pedir ayuda.
 *
 * Estados del panel de ayuda:
 *  - cerrado (default): input limpio, botón "?" discreto en la esquina derecha del label
 *  - abierto por foco: el panel aparece automáticamente al enfocar el input
 *  - abierto por clic: el usuario pulsa el botón "?" para ver referencias
 *
 * El panel contiene:
 *  - Chips de presets: valores de referencia típicos seleccionables
 *  - Botón "No conozco este dato": usa el valor por defecto o deja vacío (campos opcionales)
 *
 * @module components/ui/FieldWithPresets
 */

import React, { useState, useRef, useCallback } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

// ---------------------------------------------------------------------------
// Constante interna — duración de la transición CSS
// ---------------------------------------------------------------------------

/** Delay en ms para cerrar el panel al perder foco (evita cierre inmediato al clickear chips) */
const BLUR_CLOSE_DELAY_MS = 150;

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

/**
 * FieldWithPresets — Campo de formulario con ayuda contextual bajo demanda.
 *
 * @param {Object}   props
 * @param {string}   props.id              - ID del input (para htmlFor del label).
 * @param {string}   props.name            - Nombre del campo (name del input).
 * @param {string}   props.label           - Texto de la etiqueta.
 * @param {string}   [props.tooltip]       - Descripción breve del campo (aparece en el panel).
 * @param {string}   props.value           - Valor actual del campo (controlled).
 * @param {Function} props.onChange        - Handler onChange del input.
 * @param {string}   [props.error]         - Mensaje de error (vacío = sin error).
 * @param {string}   [props.placeholder]   - Placeholder del input.
 * @param {string}   [props.type]          - Tipo de input (default: 'number').
 * @param {string}   [props.step]          - Step del input numérico.
 * @param {string}   [props.min]           - Mínimo del input numérico.
 * @param {Array<{label: string, value: string, hint: string}>} [props.presets]
 *   - Lista de valores predefinidos a mostrar como chips en el panel.
 * @param {string}   [props.unknownDefault]
 *   - Valor a insertar con "No conozco el dato". '' = dejar vacío (campo opcional).
 *   - Si es undefined, el botón "No conozco" no se renderiza.
 * @param {string}   [props.unknownLabel]
 *   - Descripción del valor que se inserta. Ejemplo: "~80 HP (estimado)".
 * @param {string}   [props.inputClass]    - Clases CSS del input (ya calculadas).
 *
 * @returns {JSX.Element}
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
  const [panelOpen, setPanelOpen] = useState(false);
  const blurTimerRef = useRef(null);
  const hasHelp = presets.length > 0 || unknownDefault !== undefined;

  /**
   * Emula un evento onChange sintético para que el handler del formulario
   * funcione sin necesidad de adaptación.
   */
  const injectValue = useCallback((newValue) => {
    onChange({ target: { name, value: newValue } });
  }, [onChange, name]);

  /** Al enfocar el input, abre el panel si hay presets disponibles. */
  const handleFocus = () => {
    if (hasHelp) {
      clearTimeout(blurTimerRef.current);
      setPanelOpen(true);
    }
  };

  /**
   * Al perder foco en el input, espera BLUR_CLOSE_DELAY_MS ms antes de cerrar.
   * El delay permite que los clics en chips y botones del panel se ejecuten antes
   * de que el panel desaparezca.
   */
  const handleBlur = () => {
    blurTimerRef.current = setTimeout(() => {
      setPanelOpen(false);
    }, BLUR_CLOSE_DELAY_MS);
  };

  /** Cancelar el timer de cierre cuando el foco entra al panel. */
  const handlePanelMouseDown = (e) => {
    // Prevenir que el panel reciba focus y que el input lo pierda
    e.preventDefault();
  };

  const togglePanel = (e) => {
    e.preventDefault();
    clearTimeout(blurTimerRef.current);
    setPanelOpen((prev) => !prev);
  };

  return (
    <div className="relative">
      {/* ── Fila de label ── */}
      <div className="flex items-center justify-between mb-1.5">
        <label htmlFor={id} className="text-sm font-medium text-gray-700 leading-none">
          {label}
        </label>

        {/* Botón de ayuda — discreto, sólo visible si hay presets o unknown */}
        {hasHelp && (
          <button
            type="button"
            onClick={togglePanel}
            aria-expanded={panelOpen}
            aria-controls={`${id}-help-panel`}
            className={`flex items-center gap-1 text-xs transition-colors rounded px-1.5 py-0.5 ${
              panelOpen
                ? 'text-[#893d46] bg-red-50'
                : 'text-gray-400 hover:text-[#893d46] hover:bg-red-50'
            }`}
            title="Ver valores de referencia"
          >
            <HelpCircle className="w-3 h-3" />
            <span>Referencias</span>
            <ChevronDown
              className={`w-3 h-3 transition-transform duration-200 ${panelOpen ? 'rotate-180' : ''}`}
            />
          </button>
        )}
      </div>

      {/* ── Input principal ── */}
      <input
        id={id}
        name={name}
        type={type}
        step={step}
        min={min}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={inputClass}
        aria-invalid={Boolean(error)}
        aria-describedby={[
          error ? `${id}-error` : null,
          panelOpen ? `${id}-help-panel` : null,
        ].filter(Boolean).join(' ') || undefined}
      />

      {/* ── Panel de ayuda — progressive disclosure ── */}
      {/*
        Usamos grid-rows para animación de altura sin JS.
        grid-rows-[0fr] → cerrado (overflow:hidden oculta el contenido)
        grid-rows-[1fr] → abierto
      */}
      <div
        id={`${id}-help-panel`}
        role="group"
        aria-label={`Referencias para ${label}`}
        aria-hidden={!panelOpen}
        onMouseDown={handlePanelMouseDown}
        className={`grid transition-[grid-template-rows] duration-200 ease-out ${
          panelOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="pt-2 pb-1 space-y-2">
            {/* Tooltip del campo */}
            {tooltip && (
              <p className="text-xs text-gray-400 leading-relaxed">{tooltip}</p>
            )}

            {/* Chips de presets */}
            {presets.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {presets.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => injectValue(preset.value)}
                    title={preset.hint}
                    className={`px-2.5 py-1 text-xs rounded-md border font-medium transition-all ${
                      value === preset.value
                        ? 'bg-[#893d46] text-white border-[#893d46] shadow-sm'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-[#893d46] hover:text-[#893d46]'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            )}

            {/* Botón "No conozco el dato" */}
            {unknownDefault !== undefined && unknownDefault !== null && (
              <button
                type="button"
                onClick={() => {
                  injectValue(unknownDefault || '');
                  // Cerrar el panel tras usar la acción
                  setTimeout(() => setPanelOpen(false), 300);
                }}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#893d46] transition-colors mt-1"
              >
                <span className="text-gray-300">→</span>
                <span>
                  No conozco el dato
                  {unknownLabel && (
                    <span className="ml-1 text-gray-400">
                      ({unknownLabel})
                    </span>
                  )}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default FieldWithPresets;
