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

import React, { useState, useEffect } from 'react';
import TractorMachineCard from '../components/ui/cards/TractorMachineCard';
import SkeletonCard from '../components/ui/loaders/SkeletonCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import MaquinaImg from '../assets/img/2.png';
import { getImplements } from '../services/implementApi';
import useDebounce from '../hooks/useDebounce';

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

  // States for filters
  const [search, setSearch] = useState('');
  const [minPower, setMinPower] = useState('');
  const [maxPower, setMaxPower] = useState('');

  const debouncedSearch = useDebounce(search, 500);

  const fetchImplements = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getImplements({
        search: debouncedSearch,
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
  };

  useEffect(() => {
    fetchImplements();
  }, [debouncedSearch, minPower, maxPower]);

  const handleClearFilters = () => {
    setSearch('');
    setMinPower('');
    setMaxPower('');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-8">

          {/* ── Panel de filtros ── */}
          <aside className="flex flex-col gap-5 w-full lg:w-[260px] lg:flex-shrink-0">
            <h2 className="text-base font-semibold text-[#1e2939]">Filtros</h2>

            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="machine-modelo" className="text-sm font-medium text-foreground">
                  Modelo o Nombre
                </label>
                <Input 
                  id="machine-modelo" 
                  placeholder="Buscar modelo" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">
                  Fuerza requerida (HP)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <Input 
                    type="number" 
                    placeholder="Min" 
                    min="0" 
                    value={minPower}
                    onChange={(e) => setMinPower(e.target.value)}
                  />
                  <Input 
                    type="number" 
                    placeholder="Max" 
                    min="0" 
                    value={maxPower}
                    onChange={(e) => setMaxPower(e.target.value)}
                  />
                </div>
              </div>

              <Button variant="outline" className="w-full" onClick={handleClearFilters}>
                Limpiar filtros
              </Button>
            </div>
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
              <div className="p-4 bg-red-100 text-red-700 rounded-md">
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
