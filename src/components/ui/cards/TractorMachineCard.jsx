/**
 * @fileoverview Tarjeta de presentación para tractores y maquinaria agrícola.
 *
 * Componente de UI reutilizable que muestra imagen, título, descripción
 * y un enlace de acción para cada ítem del catálogo. Diseñado con
 * enfoque mobile-first y altura de imagen fija para grillas uniformes.
 *
 * @module components/ui/cards/TractorMachineCard
 */

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

/**
 * TractorMachineCard — Tarjeta de catálogo para tractor o máquina agrícola.
 *
 * Muestra una imagen contenida en un área de altura fija, seguida de un
 * bloque de contenido con título, descripción truncada y un enlace "Aprender más".
 * El efecto `hover:-translate-y-1` proporciona retroalimentación visual al usuario.
 *
 * @component
 *
 * @param {Object} props
 * @param {string} props.imageSrc    - URL de la imagen del equipo.
 * @param {string} props.link        - Ruta interna de React Router al detalle del ítem.
 * @param {string} props.title       - Nombre comercial del tractor o máquina.
 * @param {string} props.description - Descripción breve del equipo (máx. 3 líneas visibles).
 *
 * @returns {JSX.Element} Tarjeta con imagen, texto y enlace de acción.
 *
 * @example
 * <TractorMachineCard
 *   imageSrc={TractorImg}
 *   link="/tractor/1"
 *   title="New Holland 8670"
 *   description="Tractor de alta potencia para la región Orinoquía."
 * />
 */
const TractorMachineCard = ({ imageSrc, link, title, description }) => {
  return (
    <article
      className="group flex flex-col overflow-hidden rounded-lg bg-card
                 shadow-sm hover:shadow-md
                 transition-transform duration-200 hover:-translate-y-1
                 w-full"
    >
      {/* ── Área de imagen — altura fija para uniformidad en grilla ── */}
      <div className="flex items-center justify-center bg-muted/30 p-4 h-44 sm:h-52 md:h-56">
        <img
          src={imageSrc}
          alt={title}
          className="h-full w-full object-contain"
          loading="lazy"
        />
      </div>

      {/* ── Bloque de contenido: título, descripción y enlace ── */}
      <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
        {/* Título — máximo 2 líneas con ellipsis */}
        <h3 className="line-clamp-2 text-base sm:text-lg font-semibold text-[#1e2939]">
          {title}
        </h3>

        {/* Descripción — máximo 3 líneas con ellipsis */}
        <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>

        {/* Enlace de acción con ícono de flecha */}
        <Link
          to={link}
          className="mt-2 sm:mt-3 inline-flex items-center gap-1.5
                     text-sm font-semibold text-[#893d46]
                     hover:text-[#893d46]/80 transition-colors"
          aria-label={`Ver más sobre ${title}`}
        >
          Aprender más
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
};

export default TractorMachineCard;
