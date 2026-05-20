/**
 * @component TooltipInfo
 * @description Componente reutilizable que muestra información contextual cuando el usuario
 * coloca el cursor sobre un elemento. Incluye animaciones, tiempo de gracia y persistencia en hover.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode|string} props.content - Contenido a mostrar dentro del tooltip
 * @param {React.ReactNode} [props.children] - Elemento que activa el tooltip (opcional, por defecto usa icono de información)
 * 
 * @example
 * - Uso básico con icono por defecto
 * <TooltipInfo content="Información adicional" />
 * 
 * @example
 * - Uso con elemento personalizado como trigger
 * <TooltipInfo content="Información sobre potencia">
 *   <span className="underline">Potencia</span>
 * </TooltipInfo>
 */


import React, { useState, useRef } from "react";
import InfoIcon from "../Icons/InfoIcon";

const TooltipInfo = ({ content, children }) => {
  // Estado que controla la visibilidad del tooltip
  const [isVisible, setIsVisible] = useState(false);
  
  // Referencia para gestionar el temporizador de cierre del tooltip
  const hideTimeoutRef = useRef(null);
  
  // Tiempo de espera antes de ocultar el tooltip cuando el cursor sale
  const GRACE_PERIOD = 300; // ms

  /**
   * Muestra el tooltip y cancela cualquier temporizador de ocultación pendiente
   */
  const showTooltip = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setIsVisible(true);
  };

  /**
   * Establece un temporizador para ocultar el tooltip con un retraso,
   * permitiendo al usuario mover el cursor al contenido del tooltip
   */
  const hideTooltip = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
      hideTimeoutRef.current = null;
    }, GRACE_PERIOD);
  };

  return (
    <div className="relative inline-block">
      {/* Elemento activador del tooltip */}
      <span 
        className="inline-flex items-center cursor-help ml-1.5 text-gray-500 hover:text-gray-700"
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
      >
        {children || <InfoIcon size="small" />}
      </span>
      
      {/* Contenedor del tooltip con animaciones */}
      <div 
        className={`
          absolute z-10 bottom-full mb-2 left-1/2 transform -translate-x-1/2
          transition-all duration-300 ease-in-out
          ${isVisible 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 translate-y-4 scale-95 pointer-events-none'}
        `}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
      >
        {/* Caja de contenido del tooltip */}
        <div className="bg-gray-700 px-4 py-2 rounded-md text-white text-sm max-w-xs shadow-lg">
          {content}
          {/* Flecha triangular que apunta al elemento activador */}
          <div className="absolute w-2 h-2 bg-gray-700 transform rotate-45 left-1/2 -translate-x-1/2 -bottom-1"></div>
        </div>
      </div>
    </div>
  );
};

export default TooltipInfo;