import React, { useState, useEffect } from 'react';
import TractorCard from './ui/cards/TractorCard';
import { IconCamp, IconMac, IconTrac } from "../assets/img";

const AppCalculadora = () => {
  const [scale, setScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  // Detector de dispositivo móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640); // breakpoint 'sm' de Tailwind
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Función para calcular escala basada en el ancho de la ventana
  useEffect(() => {
    const calculateScale = () => {
      const baseWidth = 1200; // Ancho base para desktop
      const minScale = 0.6;   // Escala mínima (60% del tamaño original)
      const currentWidth = window.innerWidth;
      
      // Solo escalar si estamos por debajo del ancho base
      if (currentWidth < baseWidth) {
        const newScale = Math.max(minScale, currentWidth / baseWidth); // Funcion para calcular la nueva escala a base de medidas actuales y otras medidas
        setScale(newScale);
      } else {
        setScale(1); // Update de escala a 1 si la ventana es mayor
      }
    };

    calculateScale();
    window.addEventListener('resize', calculateScale); // Escucha cambios de tamaño de ventana para recalcular la escala
    // Ejecuta la función al cargar el componente y cambios de escala // seria dinamico, pero optimizado
    // Limpieza del evento al desmontar el componente
    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  const options = [
    {
      id: 'tractor',
      imageSrc: IconTrac,
      link: "/TengoTractor",
      title: "Tengo Tractor",
      description: "Encuentra implementos agrícolas compatibles con su tractor según su potencia disponible."
    },
    {
      id: 'maquinaria',
      imageSrc: IconMac,
      link: "/TengoMaquinaria", 
      title: "Tengo Maquinaria",
      description: "Encuentra el tractor con la potencia adecuada para tu implemento y optimiza tu trabajo en el campo."
    },
    {
      id: 'equipo',
      imageSrc: IconCamp,
      link: "/BuscoEquipo",
      title: "Busco Equipo",
      description: "Te guiamos en la selección del equipo ideal según tus necesidades. Encuentra la mejor combinación de tractor y maquinaria."
    }
  ];

  // Renderizado condicional de tarjetas
  const renderCards = () => {
    if (isMobile) {
      return (
        <div className="flex flex-col space-y-6">
          {options.map(option => (
            <div 
              key={option.id} 
              className="w-full transition-all duration-300 hover:scale-[1.02]"
            >
              <TractorCard 
                imageSrc={option.imageSrc}
                link={option.link}
                title={option.title}
                description={option.description}
              />
            </div>
          ))}
        </div>
      );
    }

    // Vista desktop con transformación de escala
    return (
      <div 
        className="flex flex-row justify-center gap-6 max-w-6xl mx-auto transition-transform duration-300"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center top'
        }}
      >
        {options.map(option => (
          <div 
            key={option.id} 
            className="w-[350px] transition-all duration-300 hover:scale-[1.02]"
          >
            <TractorCard 
              imageSrc={option.imageSrc}
              link={option.link}
              title={option.title}
              description={option.description}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 overflow-hidden">
      <div className="container mx-auto py-8 sm:py-10 md:py-16 px-4 sm:px-6">
        {/* Encabezado con tamaños de texto responsive */}
        <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-10 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-3 sm:mb-4">
            Bienvenido al Sistema de Maquinaria Agrícola
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Seleccione la opción que mejor se adapte a sus necesidades
          </p>
        </div>
        
        {/* Renderizado condicional de tarjetas */}
        {renderCards()}
      </div>
    </div>
  );
};

export default AppCalculadora;