import React from "react";

const TractorCard = ({ imageSrc, link, title, description }) => {
  return (
    <a href={link} className="block">
      <div className="flex flex-col items-center w-80 h-120 bg-white pb-8 pt-4 shadow-md hover:bg-gray-100 transition duration-300 overflow-hidden">
        {/* Tractor image */}
        <div className="mb-6 p-4">
          <img 
            src={imageSrc} 
            alt="Icono de tractor" 
            className="w-80 h-60"
          />
        </div>

        {/* Text content */}
        <div className="text-center px-4 py-2">
          <h2 className="text-xl font-bold mb-2">{title}</h2>
          <p className="text-center px-4 overflow-hidden">
            <span className="text-gray-500">{description}</span> 
          </p>
        </div>
      </div>
    </a>
  );
};

export default TractorCard;