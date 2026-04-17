import React from 'react';

/**
 * SkeletonCard — Componente de simulación visual durante estados de carga.
 *
 * Muestra el contorno de una tarjeta genérica con animación 'pulse'.
 * Usado en Catálogos o flujos interactivos (como Busco Equipo) mientras
 * se espera la respuesta del backend.
 *
 * @component
 */
export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse border border-gray-100 flex flex-col h-full min-h-[320px]">
      {/* Contenedor de imagen */}
      <div className="h-48 bg-gray-200 w-full" />
      
      {/* Contenido / Textos infantiles */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Título y Marca */}
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
        
        {/* Chips o Badge placehoder */}
        <div className="flex gap-2 mb-4">
          <div className="h-6 w-16 bg-gray-200 rounded-full" />
          <div className="h-6 w-16 bg-gray-200 rounded-full" />
        </div>

        {/* Separador inferior y botón oculto */}
        <div className="mt-auto space-y-3">
          <div className="h-10 w-full bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}
