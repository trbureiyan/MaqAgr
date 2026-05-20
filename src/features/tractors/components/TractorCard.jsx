/**
 * @fileoverview Tarjeta de categoría para la página de Catálogo principal.
 *
 * Componente de UI que actúa como enlace de navegación hacia una subcategoría
 * del catálogo (Tractores o Maquinaria). Toda la tarjeta es clickeable gracias
 * al wrapper `<Link>` de React Router.
 *
 * @module components/ui/cards/TractorCard
 */

import React from 'react';
import { Link } from 'react-router-dom';

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

/**
 * TractorCard — Tarjeta de categoría del catálogo principal.
 *
 * Renderiza una tarjeta completamente clickeable que navega a la ruta
 * especificada en `link`. Muestra una imagen representativa de la categoría,
 * un título y una descripción breve centrados.
 *
 * Diseñada para usarse en grillas de 1 columna (móvil) y 2 columnas (sm+).
 * El ancho máximo `max-w-sm` evita que la tarjeta se estire demasiado en
 * pantallas grandes cuando hay pocas columnas.
 *
 * @component
 *
 * @param {Object} props
 * @param {string} props.imageSrc    - URL de la imagen representativa de la categoría.
 * @param {string} props.link        - Ruta interna de React Router al catálogo de la categoría.
 * @param {string} props.title       - Nombre de la categoría (ej. "Tractores", "Maquinaria").
 * @param {string} props.description - Descripción breve de la categoría.
 *
 * @returns {JSX.Element} Tarjeta-enlace con imagen y texto centrado.
 *
 * @example
 * <TractorCard
 *   imageSrc={IconTrac}
 *   link="/CatalogoTractor"
 *   title="Tractores"
 *   description="Encuentra implementos agrícolas compatibles con su tractor."
 * />
 */
const TractorCard = ({ icon: Icon, imageSrc, link, title, description }) => {
  return (
    /* Toda la tarjeta es un enlace de navegación */
    <Link
      to={link}
      className="group block w-full max-w-sm h-full"
      aria-label={`Ir al catálogo de ${title}`}
    >
      <div
        className="flex flex-col h-full overflow-hidden rounded bg-card
                   border border-border/60 hover:border-[#909d00]/50
                   transition-colors duration-200"
      >
        {/* ── Área de imagen/icono — altura adaptable por breakpoint ── */}
        <div className="flex items-center justify-center bg-transparent border-b border-border/40 p-5 sm:p-6 h-36 sm:h-40">
          {Icon ? (
            <Icon className="size-20 sm:size-24 text-muted-foreground group-hover:text-primary transition-colors duration-200 stroke-[1.5]" />
          ) : (
            <img
              src={imageSrc}
              alt={`Categoría ${title}`}
              className="h-full w-full object-contain filter grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
              loading="lazy"
            />
          )}
        </div>

        {/* ── Bloque de texto centrado ── */}
        <div className="flex flex-1 flex-col p-4 sm:p-5 text-center">
          {/* Título de la categoría */}
          <h3 className="text-base sm:text-lg font-bold text-foreground">
            {title}
          </h3>

          {/* Descripción breve — limitada a ~26 caracteres por línea */}
          <p className="mx-auto mt-2 flex-1 max-w-[26ch] text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default TractorCard;
