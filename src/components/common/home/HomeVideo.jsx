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

import { useState, useEffect } from 'react';

// ---------------------------------------------------------------------------
// Datos estáticos del carrusel
// ---------------------------------------------------------------------------

/**
 * Diapositivas del carrusel hero.
 * Cada entrada contiene un identificador único, un título principal
 * y un subtítulo descriptivo.
 *
 * @type {Array<{ id: string, title: string, subtitle: string }>}
 */
const SLIDES = [
  {
    id: 'calidad',
    title: 'Maquinaria Agrícola de Alta Calidad',
    subtitle: 'Distribuidores oficiales de las mejores marcas.',
  },
  {
    id: 'tractores',
    title: 'Tractores y Equipos para el Campo',
    subtitle: 'Tecnología y potencia para incrementar su productividad.',
  },
  {
    id: 'soluciones',
    title: 'Soluciones para la Agricultura Moderna',
    subtitle: 'Servicio técnico especializado y repuestos originales.',
  },
];

/** Intervalo en milisegundos entre cambios de diapositiva. */
const SLIDE_INTERVAL_MS = 5000;

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

/**
 * HomeVideo — Hero section con fondo multimedia y carrusel de mensajes.
 *
 * Acepta un `videoSrc` para reproducción de video en loop, o un
 * `backgroundImageSrc` como fallback estático. Sobre el fondo se superpone
 * un carrusel automático con título y subtítulo que cambia cada 5 segundos.
 *
 * @component
 *
 * @param {Object}  props
 * @param {string}  [props.videoSrc]           - URL del video MP4 para el fondo.
 *                                               Si se omite, se usa la imagen estática.
 * @param {string}  [props.backgroundImageSrc] - URL de la imagen de fondo (fallback).
 *                                               Se usa cuando no hay `videoSrc`.
 *
 * @returns {JSX.Element} Sección hero con fondo multimedia y carrusel superpuesto.
 *
 * @example
 * // Con imagen estática (caso más común en la app actual)
 * <HomeVideo backgroundImageSrc={MachineImg} />
 *
 * @example
 * // Con video (cuando esté disponible)
 * <HomeVideo videoSrc="/hero.mp4" backgroundImageSrc={MachineImg} />
 */
const HomeVideo = ({ videoSrc, backgroundImageSrc }) => {
  // ── Estado del carrusel ───────────────────────────────────────────────────

  /**
   * Índice de la diapositiva actualmente visible.
   * Cicla entre 0 y SLIDES.length - 1.
   */
  const [currentIndex, setCurrentIndex] = useState(0);

  // ── Efecto: avance automático del carrusel ────────────────────────────────

  useEffect(() => {
    /**
     * Intervalo que avanza el índice de forma circular.
     * Se limpia al desmontar el componente para evitar fugas de memoria.
     */
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % SLIDES.length);
    }, SLIDE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <section
      className="relative w-full flex items-center justify-center overflow-hidden mb-6 sm:mb-8
                 h-[45vh] sm:h-[55vh] md:h-[65vh]"
      aria-label="Hero principal"
    >
      {/* ── Capa de fondo: video o imagen estática ── */}
      <div className="absolute inset-0 w-full h-full">
        {videoSrc ? (
          /*
           * Video en loop con reproducción automática y silenciado.
           * `playsInline` es necesario para iOS (evita pantalla completa).
           */
          <video
            className="w-full h-full object-cover opacity-80"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          >
            <source src={videoSrc} type="video/mp4" />
            {/* Mensaje de fallback para navegadores sin soporte de video HTML5 */}
            Tu navegador no soporta videos HTML5.
          </video>
        ) : (
          /*
           * Imagen estática como fondo cuando no hay video disponible.
           * `bg-cover bg-center` garantiza cobertura total sin distorsión.
           */
          <div
            className="w-full h-full bg-cover bg-center opacity-85"
            style={{ backgroundImage: `url(${backgroundImageSrc ?? ''})` }}
            role="img"
            aria-label="Imagen de fondo del hero"
          />
        )}

        {/* Degradado inferior para suavizar la transición con el contenido */}
        <div
          className="absolute bottom-0 left-0 right-0 h-20 sm:h-24
                     bg-gradient-to-t from-black/30 to-transparent"
          aria-hidden="true"
        />
      </div>

      {/* ── Contenido superpuesto: título y subtítulo del carrusel ── */}
      <div
        className="absolute bottom-12 sm:bottom-16 left-0 right-0 z-10
                   text-left text-white px-4 sm:px-6 lg:px-8
                   opacity-90 pointer-events-none"
      >
        {/* Título principal — escala tipográfica mobile-first */}
        <h1
          className="text-lg sm:text-xl md:text-2xl font-medium
                     transition-opacity duration-1000 max-w-xs sm:max-w-md"
        >
          {SLIDES[currentIndex].title}
        </h1>

        {/* Subtítulo descriptivo */}
        <p
          className="text-sm sm:text-base mt-1
                     transition-opacity duration-1000 max-w-xs sm:max-w-md"
        >
          {SLIDES[currentIndex].subtitle}
        </p>
      </div>

      {/* ── Indicadores de posición del carrusel ── */}
      <div
        className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 flex space-x-1.5"
        role="tablist"
        aria-label="Indicadores del carrusel"
      >
        {SLIDES.map((slide, i) => (
          <div
            key={slide.id}
            role="tab"
            aria-selected={currentIndex === i}
            aria-label={`Diapositiva ${i + 1}: ${slide.title}`}
            className={`rounded-full transition-all duration-500 ${
              currentIndex === i
                ? 'w-2.5 h-2.5 bg-white/80'
                : 'w-2 h-2 bg-gray-400/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HomeVideo;
