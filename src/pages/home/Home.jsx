/**
 * @fileoverview Página de inicio (Home) de MaqAgr.
 *
 * Presenta el hero multimedia seguido de dos secciones de tarjetas destacadas:
 * tractores y maquinaria agrícola. Cada sección usa una grilla responsive
 * que va de 1 columna en móvil a 3 columnas en desktop.
 *
 * Estructura de la página:
 *  1. Hero — imagen de fondo con carrusel de mensajes
 *  2. Sección "Tractores Destacados" — grilla de TractorMachineCard
 *  3. Sección "Máquinas Destacadas"  — grilla de TractorMachineCard (fondo muted)
 *
 * @module pages/Home
 */

import React from 'react';
import TractorImg from '../../assets/img/1.png';
import MachineImg from '../../assets/img/2.png';
import Hero from '../../components/common/home/Hero';
import TractorMachineCard from '../../components/ui/cards/TractorMachineCard';

// ---------------------------------------------------------------------------
// Datos estáticos de muestra
// ---------------------------------------------------------------------------

/**
 * Tractores destacados que se muestran en la sección principal.
 * En producción estos datos provendrán de la API de tractores.
 *
 * @type {Array<{ imageSrc: string, link: string, title: string, description: string }>}
 */
const FEATURED_TRACTORS = [
  {
    imageSrc: TractorImg,
    link: '/tractor/1',
    title: 'New Holland 8670',
    description: 'Tractor de marca New Holland fabricado en España, utilizado en la región Orinoquía.',
  },
  {
    imageSrc: TractorImg,
    link: '/tractor/1',
    title: 'John Deere 5090E',
    description: 'Tractor marca John Deere fabricado en Argentina, utilizado en la región Pacífica para transporte y preparación.',
  },
  {
    imageSrc: TractorImg,
    link: '/tractor/1',
    title: 'Ford 4610',
    description: 'Tractor marca Ford, fabricado en EEUU, utilizado en la región Caribe para labores de transporte.',
  },
];

/**
 * Máquinas agrícolas destacadas que se muestran en la sección secundaria.
 * En producción estos datos provendrán de la API de maquinaria.
 *
 * @type {Array<{ imageSrc: string, link: string, title: string, description: string }>}
 */
const FEATURED_MACHINES = [
  {
    imageSrc: MachineImg,
    link: '/maquinaria/2',
    title: 'Arado de vértebras 975',
    description: 'Estilo clásico combinado con innovaciones modernas. Está en nuestra herencia.',
  },
  {
    imageSrc: MachineImg,
    link: '/maquinaria/2',
    title: 'Rastra Mx425',
    description: 'Equipo de preparación de suelos con alta eficiencia para terrenos de mediana dureza.',
  },
  {
    imageSrc: MachineImg,
    link: '/maquinaria/2',
    title: 'Cultivador Mx10',
    description: 'Cultivador de alta precisión para mantenimiento de cultivos en surcos estrechos.',
  },
];

// ---------------------------------------------------------------------------
// Sub-componente: encabezado de sección
// ---------------------------------------------------------------------------

/**
 * SectionHeader — Encabezado reutilizable para las secciones de la Home.
 *
 * Muestra una etiqueta de categoría en color oliva, un título principal
 * y un párrafo descriptivo, todos centrados.
 *
 * @param {Object} props
 * @param {string} props.tag         - Etiqueta de categoría en mayúsculas (ej. "Destacados").
 * @param {string} props.title       - Título principal de la sección.
 * @param {string} props.description - Descripción breve de la sección.
 *
 * @returns {JSX.Element} Bloque de encabezado centrado.
 */
const SectionHeader = ({ tag, title, description }) => (
  <div className="mb-8 md:mb-12 text-center md:text-left">
    {/* Etiqueta de categoría — pequeña, en mayúsculas, color oliva */}
    <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">
      {tag}
    </p>

    {/* Título principal — escala tipográfica mobile-first */}
    <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
      {title}
    </h2>

    {/* Descripción */}
    <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl">
      {description}
    </p>
  </div>
);

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

/**
 * Home — Página de inicio de MaqAgr.
 *
 * Compone el hero con las dos secciones de equipos destacados.
 * Utiliza `SectionHeader` para los encabezados y `TractorMachineCard`
 * para cada ítem de la grilla.
 *
 * @component
 * @returns {JSX.Element} Página completa de inicio.
 *
 * @example
 * // Registrada en App.jsx como ruta raíz
 * <Route path="/" element={<Home />} />
 */
const Home = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">

      {/* ── 1. Hero principal ── */}
      <Hero />

      {/* ── 2. Sección: Tractores Destacados ── */}
      <section className="py-16 sm:py-24 border-b border-border" aria-labelledby="tractores-heading">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            tag="Maquinaria"
            title="Tractores Destacados"
            description="Consulta las especificaciones de tracción, potencia y peso de los equipos más utilizados a nivel nacional."
          />

          {/* Grilla responsive: 1 col móvil → 2 col sm → 3 col md */}
          <div className="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 md:grid-cols-3">
            {FEATURED_TRACTORS.map((tractor) => (
              <TractorMachineCard
                key={tractor.title}
                imageSrc={tractor.imageSrc}
                link={tractor.link}
                title={tractor.title}
                description={tractor.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Sección: Máquinas Destacadas (fondo secondary para contraste) ── */}
      <section className="py-16 sm:py-24 bg-secondary/50" aria-labelledby="maquinas-heading">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            tag="Implementos"
            title="Catálogo de Implementos"
            description="Explora rastras, arados y cultivadores con sus requerimientos de suelo y demanda de potencia."
          />

          {/* Grilla responsive: 1 col móvil → 2 col sm → 3 col md */}
          <div className="grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 md:grid-cols-3">
            {FEATURED_MACHINES.map((machine) => (
              <TractorMachineCard
                key={machine.title}
                imageSrc={machine.imageSrc}
                link={machine.link}
                title={machine.title}
                description={machine.description}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
