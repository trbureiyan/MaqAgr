import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Componente Logo - Renderiza el logotipo textual de MaqAgr con tipografía Geist.
 * 
 * @component Logo
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.size='default'] - Tamaño del logo ('small', 'default', 'large')
 * @param {boolean} [props.link=false] - Si el logo debe ser un enlace a la página principal
 * @param {string} [props.className=''] - Clases CSS adicionales
 */
const Logo = ({ size = 'default', link = false, className = '' }) => {
  // Mapeo de tamaños a clases de texto
  const sizeClasses = {
    small: 'text-lg',
    default: 'text-2xl',
    large: 'text-4xl'
  };
  
  const textClass = sizeClasses[size] || sizeClasses.default;
  
  // Estructura del logotipo
  const Logotype = (
    <div className={`flex items-center font-sans ${textClass} font-black tracking-tight select-none ${className}`}>
      <span className="text-white">Maq</span>
      <span className="text-[#909d00]">Agr</span>
      {/* Detalle decorativo del logotipo (un punto discreto de la marca) */}
      <span className="text-[#909d00] ml-0.5" aria-hidden="true">•</span>
    </div>
  );
  
  return link ? (
    <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
      {Logotype}
    </Link>
  ) : Logotype;
};

export default Logo;