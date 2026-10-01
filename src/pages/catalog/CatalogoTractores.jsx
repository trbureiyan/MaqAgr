/**
 * @fileoverview Página de catálogo de tractores de MaqAgr.
 *
 * Presenta un layout de dos columnas en desktop (sidebar de filtros + grilla
 * de tarjetas) que colapsa a una sola columna en móvil. El sidebar se muestra
 * primero en el flujo del documento para facilitar el filtrado antes de ver
 * los resultados.
 *
 * Breakpoints del layout:
 *  - móvil  (< lg) : columna única — sidebar arriba, grilla abajo
 *  - desktop (lg+) : sidebar fijo de 260 px a la izquierda, grilla a la derecha
 *
 * @module pages/CatalogoTractores
 */

import React, { useState, useEffect, useCallback } from 'react';
import TractorMachineCard from '@/features/tractors/components/TractorMachineCard';
import CatalogFilters, {
  EMPTY_CATALOG_FILTERS,
} from '@/components/ui/CatalogFilters';
import SkeletonCard from '@/components/ui/SkeletonCard';
import { PiTractorFill as TractorImg } from "react-icons/pi";
import { getTractors } from '../../services/tractorApi';
import useDebounce from '../../hooks/useDebounce';

// ---------------------------------------------------------------------------
// Datos estáticos
// ---------------------------------------------------------------------------

/**
 * Marcas disponibles para filtrar en el catálogo de tractores.
 * Se renderizan como botones tipo chip/pill seleccionables.
 *
 * @type {string[]}
 */
const BRANDS = ['John Deere', 'New Holland', 'Massey Ferguson', 'Kubota'];

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

/**
 * CatalogoTractores — Página de listado de tractores con filtros integrados a la API.
 */
export default function CatalogoTractores() {
  const [tractors, setTractors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for filters (panel controlado por CatalogFilters)
  const [filters, setFilters] = useState(EMPTY_CATALOG_FILTERS);
  const { chip: brand, minPower, maxPower } = filters;

  const debouncedSearch = useDebounce(filters.search, 500);

  const fetchTractors = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getTractors({
        search: debouncedSearch,
        brand,
        minPower,
        maxPower,
        limit: 12
      });
      setTractors(response.data || []);
    } catch (err) {
      setError(err.message || 'Error al cargar el catálogo de tractores');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, brand, minPower, maxPower]);

  useEffect(() => {
    fetchTractors();
  }, [fetchTractors]);

  const handleFiltersChange = (patch) => setFilters((prev) => ({ ...prev, ...patch }));

  const handleClearFilters = () => setFilters(EMPTY_CATALOG_FILTERS);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-8">

          {/* ── Panel de filtros ── */}
          <aside className="flex flex-col gap-5 w-full lg:w-[260px] lg:flex-shrink-0">
            <CatalogFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
              chipLabel="Marcas"
              chipOptions={BRANDS.map((b) => ({ value: b, label: b }))}
            />
          </aside>

          {/* ── Área principal ── */}
          <main className="flex flex-1 flex-col gap-6 min-w-0">
            <div>
              <p className="mb-1 text-xs sm:text-sm font-semibold uppercase tracking-widest text-[#909d00]">
                Catálogo
              </p>
              <h1 className="text-xl sm:text-2xl font-bold text-[#1e2939]">
                Tractores
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Visualiza referencias destacadas con una presentación uniforme.
              </p>
            </div>

            {error && (
              <div className="p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-md">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {isLoading ? (
                // Skeletons de carga
                Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
              ) : tractors.length > 0 ? (
                tractors.map((tractor) => (
                  <TractorMachineCard
                    key={tractor.tractorId || tractor.id}
                    imageSrc={tractor.imageUrl || TractorImg}
                    link={`/tractor/${tractor.tractorId || tractor.id}`}
                    title={tractor.name}
                    description={`${tractor.brand} - ${tractor.enginePowerHp} HP. Modelo: ${tractor.model}`}
                  />
                ))
              ) : (
                <div className="col-span-full py-10 text-center text-muted-foreground">
                  No se encontraron tractores con estos filtros.
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
