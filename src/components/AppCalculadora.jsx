import React from 'react';
import TractorCard from './TractorCard';
import IconCamp from "../assets/img/IconCamp.png";
import IconMac from "../assets/img/IconMac.png";
import IconTrac from "../assets/img/IconTrac.png";

const AppCalculadora = () => {
  return (
    <div className="min-h-screen bg-gray-200">
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-4xl font-bold text-center mb-4">
          Bienvenido al Sistema de Maquinaria Agrícola
        </h1>
        <p className="text-center mb-10">
          Seleccione la opción que mejor se adapte a sus necesidades
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Botón Tengo Tractor */}
          <TractorCard 
            imageSrc={IconTrac} 
            link ="/TengoTractor"
            title="Tengo Tractor" 
            description="Encuentra implementos agrícolas compatibles con su tractor según su potencia disponible."
          />

          {/* Botón Tengo Maquinaria */}
          <TractorCard 
            imageSrc={IconMac} 
            title="Tengo Maquinaria" 
            description="Encuentra el tractor con la potencia adecuada para tu implemento y optimiza tu trabajo en el campo"
          />

          {/* Botón Busco Equipo */}
          <TractorCard 
            imageSrc={IconCamp} 
            title="Busco Equipo" 
            description="Te guiamos en la selección del equipo ideal según tus necesidades. encuentra la mejor combinación de tractor y maquinaria."
          />
        </div>
      </div>
    </div>
  );
};

export default AppCalculadora;