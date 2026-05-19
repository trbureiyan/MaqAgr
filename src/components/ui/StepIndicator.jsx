/**
 * @fileoverview Componente visual para indicar el progreso en formularios multi-paso.
 *
 * @module components/ui/StepIndicator
 */

import React from 'react';

/**
 * StepIndicator
 *
 * @param {Object} props
 * @param {number} props.current - Paso actual (1-indexed).
 * @param {number} props.total   - Número total de pasos.
 * @param {string[]} [props.labels] - Etiquetas opcionales para cada paso.
 */
const StepIndicator = ({ current, total, labels }) => (
  <div className="flex items-center justify-center gap-0 mb-8">
    {Array.from({ length: total }).map((_, i) => {
      const step = i + 1;
      const isDone = step < current;
      const isActive = step === current;
      return (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center gap-1">
            <div
              className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold transition-colors ${
                isActive
                  ? 'bg-[#893d46] text-white ring-4 ring-[#893d46]/20'
                  : isDone
                  ? 'bg-[#893d46]/20 text-[#893d46]'
                  : 'bg-gray-100 text-gray-400'
              }`}
              aria-label={`Paso ${step} de ${total}${isActive ? ', actual' : isDone ? ', completado' : ', pendiente'}`}
            >
              {isDone ? '✓' : step}
            </div>
            {labels && (
              <span className={`text-xs hidden sm:block ${isActive ? 'text-[#893d46] font-medium' : 'text-gray-400'}`}>
                {labels[i]}
              </span>
            )}
          </div>
          {i < total - 1 && (
            <div className={`h-px w-8 sm:w-16 mx-1 mb-3 sm:mb-0 transition-colors ${isDone ? 'bg-[#893d46]/40' : 'bg-gray-200'}`} />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

export default StepIndicator;
