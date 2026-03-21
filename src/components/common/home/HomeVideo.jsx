import { useState, useEffect } from "react";

const HomeVideo = ({ videoSrc, backgroundImageSrc }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % 3); // Simula un cambio de slide
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh] flex items-center justify-center overflow-hidden mb-8">
      {/* Hero media con fallback estatico cuando no hay video */}
      <div className="absolute inset-0 w-full h-full">
        {videoSrc ? (
          <video
            className="w-full h-full object-cover opacity-80"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={videoSrc} type="video/mp4" />
            Tu navegador no soporta videos HTML5.
          </video>
        ) : (
          <div
            className="w-full h-full bg-cover bg-center opacity-85"
            style={{ backgroundImage: `url(${backgroundImageSrc || ""})` }}
          />
        )}
        {/* Capa de degradado para suavizar el video */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/30 to-transparent"></div>
      </div>

      {/* Contenido sobre el video */}
      <div className="absolute bottom-16 left-0 right-0 z-10 text-left text-white px-6 opacity-80 pointer-events-none">
        <h1 className="text-xl md:text-2xl font-medium transition-opacity duration-1000 max-w-md">
          {currentIndex === 0 && "Maquinaria Agrícola de Alta Calidad"}
          {currentIndex === 1 && "Tractores y Equipos para el Campo"}
          {currentIndex === 2 && "Soluciones para la Agricultura Moderna"}
        </h1>
        <p className="text-sm md:text-base mt-1 transition-opacity duration-1000 max-w-md">
          {currentIndex === 0 && "Distribuidores oficiales de las mejores marcas."}
          {currentIndex === 1 && "Tecnología y potencia para incrementar su productividad."}
          {currentIndex === 2 && "Servicio técnico especializado y repuestos originales."}
        </p>
      </div>

      {/* Indicadores tipo carrusel */}
      <div className="absolute bottom-6 right-6 flex space-x-1">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-500 ${
              currentIndex === index ? "bg-white/80" : "bg-gray-400/50"
            }`}
          ></div>
        ))}
      </div>
    </section>
  );
};

export default HomeVideo;