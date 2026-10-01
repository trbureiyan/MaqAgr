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

import React, { useState, useEffect, useCallback } from 'react';
import TractorMachineCard from '@/features/tractors/components/TractorMachineCard';
import CatalogFilters, {
  EMPTY_CATALOG_FILTERS,
} from '@/components/ui/CatalogFilters';
import SkeletonCard from '@/components/ui/SkeletonCard';
import MaquinaImg from '../../assets/icons/plow.webp';
import { getImplements } from '../../services/implementApi';
import { IMPLEMENT_WORK_TYPE_GROUPS } from '../../lib/implementTypeLabels';
import useDebounce from '../../hooks/useDebounce';

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

/**
 * CatalogoMaquinas — Página de listado de maquinaria agrícola con filtros integrados a la API.
 */
export default function CatalogoMaquinas() {
  const [implementsList, setImplementsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for filters (panel controlado por CatalogFilters; `chip` = tipo de trabajo)
  const [filters, setFilters] = useState(EMPTY_CATALOG_FILTERS);
  const { chip: type, minPower, maxPower } = filters;

  const debouncedSearch = useDebounce(filters.search, 500);

  const fetchImplements = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getImplements({
        search: debouncedSearch,
        type,
        minPower,
        maxPower,
        limit: 12
      });
      setImplementsList(response.data || []);
    } catch (err) {
      setError(err.message || 'Error al cargar el catálogo de maquinaria');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, type, minPower, maxPower]);

  useEffect(() => {
    fetchImplements();
  }, [fetchImplements]);

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
              chipVariant="select"
              chipLabel="Tipo de Trabajo"
              chipGroups={IMPLEMENT_WORK_TYPE_GROUPS}
              selectPlaceholder="Todos los tipos"
              powerLabel="Fuerza requerida (HP)"
            />
          </aside>

          {/* ── Área principal ── */}
          <main className="flex flex-1 flex-col gap-6 min-w-0">
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

            {error && (
              <div className="p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-md">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {isLoading ? (
                // Skeletons de carga
                Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
              ) : implementsList.length > 0 ? (
                implementsList.map((machine) => (
                  <TractorMachineCard
                    key={machine.implementId || machine.id}
                    imageSrc={machine.imageUrl || MaquinaImg}
                    link={`/maquinaria/${machine.implementId || machine.id}`}
                    title={machine.implementName}
                    description={`${machine.brand} - Requerido: ${machine.powerRequirementHp} HP`}
                  />
                ))
              ) : (
                <div className="col-span-full py-10 text-center text-muted-foreground">
                  No se encontraron máquinas con estos filtros.
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
