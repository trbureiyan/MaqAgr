/**
 * @fileoverview Componente de paginación reutilizable para listados de datos.
 *
 * Renderiza una barra de navegación con botones "Anterior" / "Siguiente"
 * y hasta 5 páginas visibles centradas alrededor de la página actual.
 * Se oculta automáticamente cuando el total de páginas es 1 o menos.
 *
 * Algoritmo de ventana deslizante:
 *  - Si totalPaginas ≤ 5 → muestra todas las páginas
 *  - Si paginaActual ≤ 3 → muestra páginas 1–5
 *  - Si paginaActual ≥ totalPaginas - 2 → muestra las últimas 5 páginas
 *  - En cualquier otro caso → ventana de ±2 alrededor de la página actual
 *
 * @module components/common/Pagination
 */

import React from 'react';
import { Button } from '@/components/ui/button';

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

/**
 * Pagination — Barra de paginación con ventana deslizante de páginas.
 *
 * Recibe la página actual, el total de páginas y un callback para cambiar
 * de página. Los botones "Anterior" y "Siguiente" se deshabilitan en los
 * extremos del rango para evitar navegación fuera de límites.
 *
 * @component
 *
 * @param {Object}   props
 * @param {number}   props.paginaActual    - Número de la página actualmente visible (base 1).
 * @param {number}   props.totalPaginas    - Total de páginas disponibles.
 * @param {Function} props.onCambiarPagina - Callback invocado con el número de página destino.
 *
 * @returns {JSX.Element|null} Barra de paginación, o `null` si hay una sola página.
 *
 * @example
 * <Pagination
 *   paginaActual={3}
 *   totalPaginas={10}
 *   onCambiarPagina={(page) => setPaginaActual(page)}
 * />
 */
const Pagination = ({ paginaActual, totalPaginas, onCambiarPagina }) => {
  // No renderizar si solo hay una página o ninguna
  if (totalPaginas <= 1) {
    return null;
  }

  // ── Cálculo de páginas visibles ───────────────────────────────────────────

  /**
   * Calcula el rango de páginas a mostrar usando una ventana deslizante
   * de máximo 5 elementos centrada en la página actual.
   *
   * @returns {number[]} Array de números de página a renderizar.
   */
  const getPaginasVisibles = () => {
    const MAX_VISIBLE = 5;

    // Caso 1: todas las páginas caben en la ventana
    if (totalPaginas <= MAX_VISIBLE) {
      return Array.from({ length: totalPaginas }, (_, i) => i + 1);
    }

    // Caso 2: página actual cerca del inicio → mostrar primeras 5
    if (paginaActual <= 3) {
      return [1, 2, 3, 4, 5];
    }

    // Caso 3: página actual cerca del final → mostrar últimas 5
    if (paginaActual >= totalPaginas - 2) {
      return [
        totalPaginas - 4,
        totalPaginas - 3,
        totalPaginas - 2,
        totalPaginas - 1,
        totalPaginas,
      ];
    }

    // Caso 4: ventana deslizante centrada en la página actual
    return [
      paginaActual - 2,
      paginaActual - 1,
      paginaActual,
      paginaActual + 1,
      paginaActual + 2,
    ];
  };

  const paginasVisibles = getPaginasVisibles();

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    /* Contenedor centrado con margen superior */
    <div className="flex justify-center mt-4 px-2">
      <nav
        className="inline-flex flex-wrap items-center justify-center gap-1"
        aria-label="Paginación"
        role="navigation"
      >
        {/* Botón "Anterior" — deshabilitado en la primera página */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onCambiarPagina(paginaActual - 1)}
          disabled={paginaActual === 1}
          aria-label="Página anterior"
          className="text-xs sm:text-sm"
        >
          Anterior
        </Button>

        {/* Botones de número de página */}
        {paginasVisibles.map((pageNum) => (
          <Button
            key={pageNum}
            variant={paginaActual === pageNum ? 'default' : 'outline'}
            size="sm"
            onClick={() => onCambiarPagina(pageNum)}
            aria-label={`Ir a página ${pageNum}`}
            aria-current={paginaActual === pageNum ? 'page' : undefined}
            className="min-w-[2rem] text-xs sm:text-sm"
          >
            {pageNum}
          </Button>
        ))}

        {/* Botón "Siguiente" — deshabilitado en la última página */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onCambiarPagina(paginaActual + 1)}
          disabled={paginaActual === totalPaginas}
          aria-label="Página siguiente"
          className="text-xs sm:text-sm"
        >
          Siguiente
        </Button>
      </nav>
    </div>
  );
};

export default Pagination;
