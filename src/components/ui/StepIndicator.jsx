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
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`flex items-center justify-center w-7 h-7 rounded text-xs font-bold transition-all border ${
                isActive
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                  : isDone
                  ? 'bg-primary/10 text-primary border-primary/20'
                  : 'bg-muted text-muted-foreground border-border/40'
              }`}
              aria-label={`Paso ${step} de ${total}${isActive ? ', actual' : isDone ? ', completado' : ', pendiente'}`}
            >
              {isDone ? '✓' : step}
            </div>
            {labels && (
              <span className={`text-xs hidden sm:block tracking-tight ${isActive ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                {labels[i]}
              </span>
            )}
          </div>
          {i < total - 1 && (
            <div className={`h-px w-8 sm:w-16 mx-2 sm:mb-0 mb-4 transition-colors ${isDone ? 'bg-primary/40' : 'bg-border/60'}`} />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

export default StepIndicator;
