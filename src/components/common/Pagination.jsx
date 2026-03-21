import React from 'react';
import Button from '../ui/buttons/Button';

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
      <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
        <Button
          variant="outline"
          color="#6B7280"
          onClick={() => onCambiarPagina(paginaActual - 1)}
          disabled={paginaActual === 1}
          className={paginaActual === 1 ? 'opacity-50 cursor-not-allowed' : ''}
        >
          Anterior
        </Button>

        {paginasVisibles.map((pageNum) => (
          <Button
            key={pageNum}
            variant="outline"
            color="#6B7280"
            onClick={() => onCambiarPagina(pageNum)}
            className={paginaActual === pageNum ? 'bg-red-800 text-white border-red-800 z-10' : ''}
          >
            {pageNum}
          </Button>
        ))}

        <Button
          variant="outline"
          color="#6B7280"
          onClick={() => onCambiarPagina(paginaActual + 1)}
          disabled={paginaActual === totalPaginas}
          className={paginaActual === totalPaginas ? 'opacity-50 cursor-not-allowed' : ''}
        >
          Siguiente
        </Button>
      </nav>
    </div>
  );
};

export default Pagination;
