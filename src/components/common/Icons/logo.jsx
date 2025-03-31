import React from 'react';
import { Link } from 'react-router-dom';
import LogoSVG from '../../../assets/svg/logo.svg';

/**
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.size='default'] - Tamaño del logo ('small', 'default', 'large') // Default: default
 * @param {string} [props.color='#909d00'] - Color del logo (en formato HEX) // Default: color primario, contraste navbar 
 * @param {boolean} [props.link=false] - Si el logo debe ser un enlace a la página principal // Default: sin link
 * @param {string} [props.className=''] - Clases CSS adicionales // Permite agregar clases personalizadas al componente
 */

const Logo = ({ size = 'default', color = '#909d00', link = false, className = '' }) => {
  // Mapeo de tamaños a clases de altura
  const sizeClasses = {
    small: 'h-10',
    default: 'h-14',
    large: 'h-20'
  };
  
const heightClass = sizeClasses[size] || sizeClasses.default;

// Filtro para los colores más comunes
const filterPresets = {
  '#6d7700': "invert(39%) sepia(72%) saturate(765%) hue-rotate(30deg) brightness(90%) contrast(101%)",
  '#5a9203': "invert(50%) sepia(40%) saturate(5453%) hue-rotate(55deg) brightness(94%) contrast(98%)",
  '#909d00': "invert(53%) sepia(19%) saturate(5305%) hue-rotate(37deg) brightness(98%) contrast(101%)"
};

const filterStyle = filterPresets[color] || filterPresets['#909d00'];
  
  // Componente de imagen del logo
  const LogoImage = (
    <img 
      src={LogoSVG} 
      alt="Logo MaqAgr" 
      className={`${heightClass} w-auto ${className}`}
      style={{ filter: filterStyle }}
    />
  );
  
  // Renderizar con o sin enlace según la prop 'link'
  return link ? (
    <Link to="/" className="flex items-center">
      {LogoImage}
    </Link>
  ) : LogoImage;
};

export default Logo;