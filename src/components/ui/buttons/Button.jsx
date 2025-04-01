import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Componente Button - Botón personalizable y reutilizable
 * 
 * @component
 * @param {Object} props - Propiedades del componente
 * 
 * @param {string} [props.variant='primary'] - Estilo visual del botón
 *  - 'primary': Botón principal con fondo sólido
 *  - 'secondary': Botón secundario con opacidad reducida
 *  - 'outline': Botón con borde y fondo transparente
 *  - 'text': Botón tipo texto sin fondo
 * 
 * @param {string} [props.size='default'] - Tamaño del botón
 *  - 'small': Padding reducido y texto pequeño
 *  - 'default': Tamaño estándar
 *  - 'large': Padding aumentado y texto grande
 * 
 * @param {string} [props.shape='rounded'] - Forma de los bordes
 *  - 'square': Sin bordes redondeados
 *  - 'rounded': Bordes ligeramente redondeados (8px)
 *  - 'pill': Completamente redondeado
 * 
 * @param {string} [props.color='#9f0712'] - Color principal en formato HEX
 *  - Afecta el fondo en variantes primary/secondary
 *  - Afecta el borde y texto en variant outline
 *  - Afecta el texto en variant text
 * 
 * @param {string} [props.textColor] - Color del texto (HEX o nombre)
 *  - Sobrescribe el color de texto predeterminado
 *  - Si no se especifica, usa blanco para primary/secondary
 *  - Si no se especifica, usa color principal para outline/text
 * 
 * @param {boolean} [props.fullWidth=false] - Ocupar todo el ancho disponible
 * @param {string} [props.to] - Ruta para navegación interna (React Router)
 * @param {string} [props.href] - URL para enlaces externos
 * @param {string} [props.type='button'] - Tipo de botón HTML ('button', 'submit', 'reset')
 * @param {function} [props.onClick] - Función a ejecutar al hacer clic
 * @param {boolean} [props.disabled=false] - Deshabilitar interacciones
 * @param {string} [props.className=''] - Clases CSS adicionales
 * 
 * @example
 * # Botón primario básico
 * <Button>Texto del Botón</Button>
 * 
 * @example
 * # Botón de envío de formulario
 * <Button
 *   variant="primary"
 *   type="submit"
 *   color="#991b1b"
 *   size="large"
 * >
 *   Enviar
 * </Button>
 * 
 * @example
 * # Botón de navegación
 * <Button
 *   variant="outline"
 *   to="/ruta"
 *   color="#991b1b"
 *   textColor="black"
 * >
 *   Ir a página
 * </Button>
 */

const Button = ({
  variant = 'primary',
  size = 'default',
  shape = 'rounded',
  color = '#9f0712',
  fullWidth = false,
  to,
  href,
  type = 'button',
  onClick,
  disabled = false,
  textColor,
  className = '',
  children,
  ...rest
}) => {
  // Mapeo de tamaños a clases
  const sizeClasses = {
    small: 'py-1 px-3 text-sm',
    default: 'py-2 px-4 text-base',
    large: 'py-3 px-6 text-lg'
  };

  // Mapeo de variantes a clases base (sin color)
  const variantClasses = {
    primary: 'font-bold text-white transition-colors duration-200',
    secondary: 'font-bold text-white bg-opacity-80 transition-colors duration-200',
    outline: 'font-bold bg-transparent border-2 transition-colors duration-200',
    text: 'font-bold bg-transparent hover:underline transition-colors duration-200'
  };

  // Mapeo simplificado de formas a clases de borde
  const shapeClasses = {
    square: 'rounded-none',                 // Bordes rectos, sin redondeo
    rounded: 'rounded',                     // Redondeo estándar (8px en Tailwind)
    pill: 'rounded-full'                    // Forma de píldora (bordes completamente redondeados)
  };

  // Estilos dinámicos basados en el color personalizable
  const getColorStyles = () => {
    // Conversion HEX a RGB para manipulaciones - Facilidad Frontend Graphic Design
    const hexToRgb = (hex) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return { r, g, b };
    };

    // Func Oscurecer color para hover (multiplicar por 0.8)
    const darkenColor = (hex) => {
      const { r, g, b } = hexToRgb(hex);
      const darkerR = Math.floor(r * 0.8);
      const darkerG = Math.floor(g * 0.8);
      const darkerB = Math.floor(b * 0.8);
      return `#${darkerR.toString(16).padStart(2, '0')}${darkerG.toString(16).padStart(2, '0')}${darkerB.toString(16).padStart(2, '0')}`;
    };

    const hoverColor = darkenColor(color);

    switch (variant) {
      case 'primary':
        return {
          backgroundColor: color,
          hoverBgColor: hoverColor,
          textColor: textColor || 'white'  // Usar textColor si existe, sino blanco
        };
      case 'secondary':
        return {
          backgroundColor: color,
          hoverBgColor: hoverColor,
          textColor: textColor || 'white'
        };
      case 'outline':
        return {
          borderColor: color,
          color: textColor || color,  // Usar textColor si existe, sino el color base
          hoverBgColor: color,
          hoverTextColor: textColor || 'white'
        };
      case 'text':
        return {
          color: textColor || color,  // Usar textColor si existe, sino el color base
          hoverColor: darkenColor(textColor || color)
        };
      default:
        return {
          backgroundColor: color,
          hoverBgColor: hoverColor,
          textColor: textColor || 'white'
        };
    }
  };

  // Obtener estilos de color
  const colorStyles = getColorStyles();

  // Obtener la clase de forma correcta, con fallback a 'rounded' si no existe
  const shapeClass = shapeClasses[shape] || shapeClasses.rounded;

  // Construccion de clase base visual -> Conditional class composition (Fallbacks seguros, Modularidad)
  const baseClassName = `
    ${sizeClasses[size] || sizeClasses.default}
    ${variantClasses[variant] || variantClasses.primary}
    ${shapeClass}
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    focus:outline-none focus:ring-2 focus:ring-opacity-50
    ${className}
  `;

  // Clases específicas para cada variante con colores dinámicos
  let variantSpecificStyle = {};
  
  if (variant === 'primary' || variant === 'secondary') {
    variantSpecificStyle = {
      backgroundColor: colorStyles.backgroundColor,
      color: colorStyles.textColor
    };
  } else if (variant === 'outline') {
    variantSpecificStyle = {
      borderColor: colorStyles.borderColor,
      color: colorStyles.color
    };
  } else if (variant === 'text') {
    variantSpecificStyle = {
      color: colorStyles.color
    };
  }

  // Combinacion de clases (base + específicas)
  const buttonClasses = baseClassName.trim();
  
  // Manejador de hover personalizado
  const handleMouseEnter = (e) => {
    if (disabled) return;
    
    if (variant === 'primary' || variant === 'secondary') {
      e.currentTarget.style.backgroundColor = colorStyles.hoverBgColor;
    } else if (variant === 'outline') {
      e.currentTarget.style.backgroundColor = colorStyles.hoverBgColor;
      e.currentTarget.style.color = colorStyles.hoverTextColor;
    } else if (variant === 'text') {
      e.currentTarget.style.color = colorStyles.hoverColor;
    }
  };
  
  const handleMouseLeave = (e) => {
    if (disabled) return;
    
    if (variant === 'primary' || variant === 'secondary') {
      e.currentTarget.style.backgroundColor = colorStyles.backgroundColor;
    } else if (variant === 'outline') {
      e.currentTarget.style.backgroundColor = 'transparent';
      e.currentTarget.style.color = colorStyles.color;
    } else if (variant === 'text') {
      e.currentTarget.style.color = colorStyles.color;
    }
  };

  // Gestor de clics
  const handleClick = (e) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    
    if (onClick) {
      onClick(e);
    }
  };

  // Props comunes para todos los tipos de botones
  const commonProps = {
    className: buttonClasses,
    style: variantSpecificStyle,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onClick: handleClick,
    ...rest
  };

  // Tipos de renderizado según las props
  if (to) {
    // Enlace interno con React Router
    return (
      <Link
        to={to}
        {...commonProps}
      >
        {children}
      </Link>
    );
  } else if (href) {
    // Enlace externo
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        {...commonProps}
      >
        {children}
      </a>
    );
  } else {
    // Botón estándar
    return (
      <button
        type={type}
        disabled={disabled}
        {...commonProps}
      >
        {children}
      </button>
    );
  }
};

export default Button;