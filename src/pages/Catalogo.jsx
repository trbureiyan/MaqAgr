/**
 * @fileoverview Página principal del Catálogo de MaqAgr.
 *
 * Punto de entrada al catálogo que presenta dos categorías principales:
 * Tractores y Maquinaria. Cada categoría se muestra como una `TractorCard`
 * que navega al subcatálogo correspondiente.
 *
 * La grilla pasa de 1 columna en móvil a 2 columnas en sm+,
 * con las tarjetas centradas horizontalmente.
 *
 * @module pages/Catalogo
 */

import React from 'react';
import TractorCard from '../components/ui/cards/TractorCard';
import { IconTrac as Tractor, IconMac as Maquina } from '../assets/img';

// ---------------------------------------------------------------------------
// Datos estáticos de categorías
// ---------------------------------------------------------------------------

/**
 * Categorías del catálogo disponibles en la plataforma.
 * Cada entrada define la imagen, ruta, título y descripción de la categoría.
 *
 * @type {Array<{ imageSrc: string, link: string, title: string, description: string }>}
 */
const CATALOG_CATEGORIES = [
  {
    imageSrc: Tractor,
    link: '/CatalogoTractor',
    title: 'Tractores',
    description: 'Encuentra implementos agrícolas compatibles con su tractor según su potencia disponible.',
  },
  {
    imageSrc: Maquina,
    link: '/CatalogoMaquinas',
    title: 'Maquinaria',
    description: 'Consulta equipos y soluciones para fortalecer la productividad en campo.',
  },
];

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

/**
 * Catalogo — Página de selección de categoría del catálogo.
 *
 * Muestra un encabezado descriptivo y una grilla de dos tarjetas de categoría.
 * Actúa como hub de navegación hacia `CatalogoTractores` y `CatalogoMaquinas`.
 *
 * @component
 * @returns {JSX.Element} Página de catálogo con grilla de categorías.
 *
 * @example
 * // Registrada en App.jsx
 * <Route path="/Catalogo" element={<Catalogo />} />
 */
export default function Catalogo() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">

        {/* ── Encabezado de la página ── */}
        <header className="mb-10 sm:mb-12 text-center">
          {/* Etiqueta de sección en color oliva */}
          <p className="mb-2 text-xs sm:text-sm font-semibold uppercase tracking-widest text-[#909d00]">
            Explorar
          </p>

          {/* Título principal — escala tipográfica mobile-first */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1e2939]">
            Catálogo MaqAgr
          </h1>

          {/* Descripción — ancho máximo para legibilidad en pantallas anchas */}
          <p className="mx-auto mt-3 max-w-xl sm:max-w-2xl text-sm sm:text-base text-muted-foreground px-2">
            Explora tractores y maquinaria agrícola disponibles en nuestra plataforma.
          </p>
        </header>

        {/* ── Grilla de categorías ── */}
        {/*
         * 1 columna en móvil, 2 columnas en sm+.
         * `justify-items-center` centra las tarjetas que tienen max-w-sm.
         */}
        <div className="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 justify-items-center">
          {CATALOG_CATEGORIES.map((category) => (
            <TractorCard
              key={category.title}
              imageSrc={category.imageSrc}
              link={category.link}
              title={category.title}
              description={category.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
