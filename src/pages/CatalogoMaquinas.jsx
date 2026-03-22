/**
 * @fileoverview Página de catálogo de maquinaria agrícola de MaqAgr.
 *
 * Presenta un layout de dos columnas en desktop (sidebar de filtros + grilla
 * de tarjetas) que colapsa a una sola columna en móvil. Comparte la misma
 * estructura visual que `CatalogoTractores` pero con filtros específicos
 * para maquinaria (sin fuerza bruta, solo fuerza requerida).
 *
 * Breakpoints del layout:
 *  - móvil  (< lg) : columna única — sidebar arriba, grilla abajo
 *  - desktop (lg+) : sidebar fijo de 260 px a la izquierda, grilla a la derecha
 *
 * @module pages/CatalogoMaquinas
 */

import React from 'react';
import TractorMachineCard from '../components/ui/cards/TractorMachineCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Maquina from '../assets/img/2.png';

// ---------------------------------------------------------------------------
// Datos estáticos
// ---------------------------------------------------------------------------

/**
 * Marcas de maquinaria disponibles para filtrar.
 * Se renderizan como botones tipo chip/pill seleccionables.
 *
 * @type {string[]}
 */
const BRANDS = ['Marca 1', 'Marca 2', 'Marca 3', 'Marca 4'];

/**
 * Lista de máquinas de muestra para el catálogo.
 * En producción estos datos provendrán de la API con paginación server-side.
 *
 * @type {Array<{ imageSrc: string, link: string, title: string, description: string }>}
 */
const MACHINES = [
  { imageSrc: Maquina, link: '/maquinaria/2', title: 'Máquina Modelo 1', description: 'Descripción breve de la máquina modelo 1.' },
  { imageSrc: Maquina, link: '/maquinaria/2', title: 'Máquina Modelo 2', description: 'Descripción breve de la máquina modelo 2.' },
  { imageSrc: Maquina, link: '/maquinaria/2', title: 'Máquina Modelo 3', description: 'Descripción breve de la máquina modelo 3.' },
  { imageSrc: Maquina, link: '/maquinaria/2', title: 'Máquina Modelo 4', description: 'Descripción breve de la máquina modelo 4.' },
  { imageSrc: Maquina, link: '/maquinaria/2', title: 'Máquina Modelo 5', description: 'Descripción breve de la máquina modelo 5.' },
  { imageSrc: Maquina, link: '/maquinaria/2', title: 'Máquina Modelo 6', description: 'Descripción breve de la máquina modelo 6.' },
];

// ---------------------------------------------------------------------------
// Sub-componente: panel de filtros
// ---------------------------------------------------------------------------

/**
 * FilterSidebar — Panel lateral de filtros para el catálogo de maquinaria.
 *
 * Contiene campos de búsqueda por modelo, selección de marca (chips)
 * y rango de fuerza requerida. En móvil se muestra como un bloque
 * apilado antes de la grilla de resultados.
 *
 * @returns {JSX.Element} Aside con controles de filtrado.
 */
const FilterSidebar = () => (
  <aside className="flex flex-col gap-5 w-full lg:w-[260px] lg:flex-shrink-0">
    {/* Título del panel */}
    <h2 className="text-base font-semibold text-[#1e2939]">Filtros</h2>

    <div className="flex flex-col gap-5">
      {/* ── Filtro por modelo ── */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="machine-modelo" className="text-sm font-medium text-foreground">
          Modelo
        </label>
        <Input id="machine-modelo" placeholder="Buscar modelo" />
      </div>

      {/* ── Filtro por marca (chips seleccionables) ── */}
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-foreground">Marcas</span>
        {/* Chips en fila con wrap — se adaptan al ancho disponible */}
        <div className="flex flex-wrap gap-2">
          {BRANDS.map((marca) => (
            <button
              key={marca}
              type="button"
              className="rounded-full border border-border px-3 py-1
                         text-xs font-medium text-foreground
                         hover:border-[#893d46] hover:text-[#893d46]
                         transition-colors"
            >
              {marca}
            </button>
          ))}
        </div>
      </div>

      {/* ── Filtro por rango de fuerza requerida ── */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">
          Fuerza requerida (HP)
        </label>
        {/* Dos inputs en fila para min/max */}
        <div className="grid grid-cols-2 gap-2">
          <Input type="number" placeholder="Min" min="0" />
          <Input type="number" placeholder="Max" min="0" />
        </div>
      </div>

      {/* Botón para limpiar todos los filtros */}
      <Button variant="outline" className="w-full">
        Limpiar filtros
      </Button>
    </div>
  </aside>
);

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

/**
 * CatalogoMaquinas — Página de listado de maquinaria agrícola con filtros.
 *
 * Implementa un layout de dos columnas en desktop (sidebar + grilla)
 * que colapsa a una sola columna en móvil. La grilla de tarjetas
 * escala de 1 columna (móvil) a 2 columnas (sm) a 3 columnas (xl).
 *
 * @component
 * @returns {JSX.Element} Página de catálogo de maquinaria.
 *
 * @example
 * // Registrada en App.jsx
 * <Route path="/CatalogoMaquinas" element={<CatalogoMaquinas />} />
 */
export default function CatalogoMaquinas() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

        {/*
         * Layout principal:
         *  - móvil  : flex-col (sidebar arriba, main abajo)
         *  - desktop: flex-row con sidebar fijo y main flexible
         */}
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-8">

          {/* ── Panel de filtros ── */}
          <FilterSidebar />

          {/* ── Área principal: encabezado + grilla de tarjetas ── */}
          <main className="flex flex-1 flex-col gap-6 min-w-0">

            {/* Encabezado de la sección de resultados */}
            <div>
              <p className="mb-1 text-xs sm:text-sm font-semibold uppercase tracking-widest text-[#909d00]">
                Catálogo
              </p>
              <h1 className="text-xl sm:text-2xl font-bold text-[#1e2939]">
                Maquinaria
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Descubre equipos agrícolas con una visual homogénea y consistente.
              </p>
            </div>

            {/*
             * Grilla de tarjetas responsive:
             *  - 1 col en móvil
             *  - 2 col en sm
             *  - 3 col en xl (cuando el sidebar ocupa espacio)
             */}
            <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {MACHINES.map((machine) => (
                <TractorMachineCard
                  key={machine.title}
                  imageSrc={machine.imageSrc}
                  link={machine.link}
                  title={machine.title}
                  description={machine.description}
                />
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
