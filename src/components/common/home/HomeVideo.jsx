/**
 * @fileoverview Hero section con carrusel de diapositivas para la página de inicio.
 *
 * Muestra un fondo de video o imagen estática con un carrusel automático de
 * mensajes superpuestos. El carrusel avanza cada 5 segundos y se detiene
 * al desmontar el componente para evitar fugas de memoria.
 *
 * Breakpoints de altura:
 *  - móvil  (< sm)  : 45vh — compacto para pantallas pequeñas
 *  - tablet (sm)    : 55vh
 *  - desktop (md+)  : 65vh — mayor impacto visual
 *
 * @module components/common/home/HomeVideo
 */

import { Link } from 'react-router-dom';
import Button from '../../ui/buttons/Button';

/**
 * HomeVideo — Hero section con fondo multimedia y llamadas a la acción.
 *
 * Acepta un `videoSrc` para reproducción de video en loop, o un
 * `backgroundImageSrc` como fallback estático. Muestra un mensaje principal
 * con botones de CTA para la calculadora y el catálogo.
 *
 * @component
 *
 * @param {Object}  props
 * @param {string}  [props.videoSrc]           - URL del video MP4 para el fondo.
 * @param {string}  [props.backgroundImageSrc] - URL de la imagen de fondo (fallback).
 *
 * @returns {JSX.Element} Sección hero principal.
 */
const HomeVideo = ({ videoSrc, backgroundImageSrc }) => {
  return (
    <section
      className="relative w-full flex items-center overflow-hidden mb-6 sm:mb-8
                 h-[60vh] sm:h-[70vh] md:h-[80vh]"
      aria-label="Hero principal"
    >
      {/* ── Capa de fondo: video o imagen estática ── */}
      <div className="absolute inset-0 w-full h-full">
        {videoSrc ? (
          <video
            className="w-full h-full object-cover opacity-90"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          >
            <source src={videoSrc} type="video/mp4" />
            Tu navegador no soporta videos HTML5.
          </video>
        ) : (
          <div
            className="w-full h-full bg-cover bg-center brightness-[0.6] sepia-[0.2]"
            style={{ backgroundImage: `url(${backgroundImageSrc ?? ''})` }}
            role="img"
            aria-label="Imagen de fondo del hero"
          />
        )}

        {/* Degradado para mejorar la legibilidad del texto */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#1e2939]/90 to-transparent"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-32
                     bg-gradient-to-t from-background to-transparent"
          aria-hidden="true"
        />
      </div>

      {/* ── Contenido superpuesto: Título, descripción y CTAs ── */}
      <div className="relative z-10 w-full container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl text-left pl-4 sm:pl-0">
          
          <span className="inline-block py-1 px-3 rounded text-[#909d00] font-bold tracking-widest uppercase text-xs mb-4 border border-[#909d00]/50 backdrop-blur-md bg-[#1e2939]/40">
            Plataforma de Ingeniería
          </span>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6 drop-shadow-lg tracking-tight">
            Compatibilidad agrícola <span className="text-[#909d00]">basada en datos</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-200 mb-8 max-w-xl drop-shadow-md leading-relaxed font-light">
            Calcula la fuerza de tracción exacta y los requerimientos del suelo para emparejar tu tractor con el implemento adecuado. Evita el sobreesfuerzo mecánico y maximiza el rendimiento.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              to="/Calculadora" 
              variant="primary" 
              color="#909d00" 
              size="large"
              shape="rounded"
              className="text-base font-semibold transition-all hover:bg-[#a6b500]"
            >
              Calculadora Técnica
            </Button>
            <Button 
              to="/Catalogo" 
              variant="outline" 
              color="#ffffff" 
              size="large"
              shape="rounded"
              className="text-white border-2 hover:bg-white/10 text-base font-semibold backdrop-blur-sm"
            >
              Consultar Catálogo
            </Button>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default HomeVideo;
