import React from 'react';
import { Button } from '@/components/ui/button';

const Pagination = ({ paginaActual, totalPaginas, onCambiarPagina }) => {
  if (totalPaginas <= 1) {
    return null;
  }

  const getPaginasVisibles = () => {
    const maxPaginasVisibles = 5;

    if (totalPaginas <= maxPaginasVisibles) {
      return [...Array(totalPaginas)].map((_, index) => index + 1);
    }

    if (paginaActual <= 3) {
      return [1, 2, 3, 4, 5];
    }

    if (paginaActual >= totalPaginas - 2) {
      return [
        totalPaginas - 4,
        totalPaginas - 3,
        totalPaginas - 2,
        totalPaginas - 1,
        totalPaginas
      ];
    }

    return [
      paginaActual - 2,
      paginaActual - 1,
      paginaActual,
      paginaActual + 1,
      paginaActual + 2
    ];
  };

  const paginasVisibles = getPaginasVisibles();

  return (
    <div className="flex justify-center mt-4">
      <nav className="inline-flex items-center gap-1" aria-label="Pagination">
        <Button
          variant="outline"
          onClick={() => onCambiarPagina(paginaActual - 1)}
          disabled={paginaActual === 1}
        >
          Anterior
        </Button>

        {paginasVisibles.map((pageNum) => (
          <Button
            key={pageNum}
            variant={paginaActual === pageNum ? 'default' : 'outline'}
            onClick={() => onCambiarPagina(pageNum)}
          >
            {pageNum}
          </Button>
        ))}

        <Button
          variant="outline"
          onClick={() => onCambiarPagina(paginaActual + 1)}
          disabled={paginaActual === totalPaginas}
        >
          Siguiente
        </Button>
      </nav>
    </div>
  );
};

export default Pagination;
