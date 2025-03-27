import React from "react";

const TractorMachineCard = ({ imageSrc, link, title, description }) => {
  return (
    <div className="flex flex-col h-full border border-gray-200 shadow-sm rounded-lg overflow-hidden">
      {/* Contenedor de altura fija para la imagen */}
      <div className="w-full h-64 overflow-hidden bg-gray-100">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-contain"
        />
      </div>
      
      {/* Contenedor para el texto con altura flexible */}
      <div className="flex flex-col p-4 flex-grow">
        <h2 className="text-xl font-bold text-red-900 line-clamp-2">{title}</h2>
        <div className="w-16 h-0.5 bg-red-800 my-2"></div>
        <p className="text-gray-500 mb-4 flex-grow line-clamp-3">{description}</p>
        
        {/* El botón siempre queda al final gracias al mt-auto */}
        <a
          href={link}
          className="bg-red-800 hover:bg-black text-white font-bold py-2 px-4 rounded inline-block mt-auto self-start transition-colors duration-200"
        >
          Aprender más 
        </a>
      </div>
    </div>
  );
};

export default TractorMachineCard;