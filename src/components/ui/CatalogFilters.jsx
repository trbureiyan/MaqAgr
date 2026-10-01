/**
 * @fileoverview Panel de filtros reutilizable para catálogos (tractores y
 * maquinaria) de MaqAgr.
 *
 * Componente controlado que replica el patrón de filtrado de los catálogos
 * públicos: búsqueda por modelo o nombre, un grupo de chips de selección
 * única (toggle) configurable —marcas en tractores, tipos de trabajo en
 * maquinaria—, rango de potencia en HP y el botón para limpiar.
 *
 * No posee estado propio ni llama a la API: el padre dueña de los datos
 * le pasa los valores vigentes y recibe los cambios vía callbacks, lo que
 * permite montarlo tanto en las páginas del catálogo como dentro de modales.
 *
 * @module components/ui/CatalogFilters
 */

import React, { useId } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

/**
 * Filtros vacíos; exportado para que los padres reinicien con la misma forma.
 *
 * @type {{search: string, chip: string, minPower: string, maxPower: string}}
 */
export const EMPTY_CATALOG_FILTERS = { search: '', chip: '', minPower: '', maxPower: '' };

/**
 * CatalogFilters — Sidebar de filtros para un listado del catálogo.
 *
 * @component
 *
 * @param {Object} props
 * @param {{search: string, chip: string, minPower: string, maxPower: string}} props.filters
 *     Valores vigentes de los filtros (objeto controlado por el padre). El
 *     campo `chip` guarda el valor seleccionado del grupo de chips/dropdown
 *     (marca o tipo de trabajo según el catálogo) y '' cuando no hay selección.
 * @param {(patch: Partial<{search: string, chip: string, minPower: string, maxPower: string}>) => void} props.onFiltersChange
 *     Callback con los campos modificados (patch parcial sobre `filters`).
 * @param {() => void} props.onClearFilters
 *     Callback del botón "Limpiar filtros".
 * @param {'chips'|'select'} [props.chipVariant="chips"]
 *     Render del filtro: chips seleccionables o dropdown nativo (útil para
 *     listas largas, p. ej. los tipos de trabajo de la maquinaria).
 * @param {Array<{value: string, label: string}>} [props.chipOptions=[]]
 *     Chips a renderizar con `chipVariant="chips"`. Con lista vacía se omite
 *     la sección.
 * @param {Array<{label: string, options: Array<{value: string, label: string}>}>} [props.chipGroups=[]]
 *     Grupos de opciones del dropdown con `chipVariant="select"`. Con lista
 *     vacía se omite la sección.
 * @param {string} [props.chipLabel="Marcas"]         - Encabezado del grupo de chips/dropdown.
 * @param {string} [props.selectPlaceholder="Todos los tipos"] - Opción vacía del dropdown.
 * @param {string} [props.title="Filtros"]            - Encabezado del panel.
 * @param {string} [props.powerLabel="Potencia de Motor (HP)"] - Etiqueta del rango de potencia.
 * @param {string} [props.searchPlaceholder="Buscar modelo"]   - Placeholder del input de búsqueda.
 *
 * @returns {JSX.Element} Panel de filtros.
 *
 * @example
 * // Tractores: chips de marcas
 * <CatalogFilters
 *   filters={filters}
 *   onFiltersChange={handleFiltersChange}
 *   onClearFilters={handleClearFilters}
 *   chipLabel="Marcas"
 *   chipOptions={BRANDS.map((b) => ({ value: b, label: b }))}
 * />
 *
 * @example
 * // Maquinaria: dropdown agrupado de tipos de trabajo
 * <CatalogFilters
 *   filters={filters}
 *   onFiltersChange={handleFiltersChange}
 *   onClearFilters={handleClearFilters}
 *   chipVariant="select"
 *   chipLabel="Tipo de Trabajo"
 *   chipGroups={IMPLEMENT_WORK_TYPE_GROUPS}
 *   powerLabel="Fuerza requerida (HP)"
 * />
 */
export default function CatalogFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  chipVariant = 'chips',
  chipOptions = [],
  chipGroups = [],
  chipLabel = 'Marcas',
  selectPlaceholder = 'Todos los tipos',
  title = 'Filtros',
  powerLabel = 'Potencia de Motor (HP)',
  searchPlaceholder = 'Buscar modelo',
}) {
  const searchId = useId();
  const chipSelectId = useId();

  const handleFieldChange = (name, value) => {
    onFiltersChange({ ...filters, [name]: value });
  };

  const handleChipToggle = (chipValue) => {
    onFiltersChange({ ...filters, chip: filters.chip === chipValue ? '' : chipValue });
  };

  const showChipSection =
    chipVariant === 'select' ? chipGroups.length > 0 : chipOptions.length > 0;

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-base font-semibold text-[#1e2939]">{title}</h2>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={searchId} className="text-sm font-medium text-foreground">
            Modelo o Nombre
          </label>
          <Input
            id={searchId}
            placeholder={searchPlaceholder}
            value={filters.search}
            onChange={(e) => handleFieldChange('search', e.target.value)}
          />
        </div>

        {showChipSection && chipVariant === 'chips' && (
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-foreground">{chipLabel}</span>
            <div className="flex flex-wrap gap-2">
              {chipOptions.map((chip) => (
                <button
                  key={chip.value}
                  type="button"
                  onClick={() => handleChipToggle(chip.value)}
                  aria-pressed={filters.chip === chip.value}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    filters.chip === chip.value
                      ? 'border-[#893d46] bg-[#893d46] text-white'
                      : 'border-border text-foreground hover:border-[#893d46] hover:text-[#893d46]'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {showChipSection && chipVariant === 'select' && (
          <div className="flex flex-col gap-1.5">
            <label htmlFor={chipSelectId} className="text-sm font-medium text-foreground">
              {chipLabel}
            </label>
            <select
              id={chipSelectId}
              value={filters.chip}
              onChange={(e) => handleFieldChange('chip', e.target.value)}
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="">{selectPlaceholder}</option>
              {chipGroups.map((group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">{powerLabel}</label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Min"
              min="0"
              aria-label="Potencia mínima (HP)"
              value={filters.minPower}
              onChange={(e) => handleFieldChange('minPower', e.target.value)}
            />
            <Input
              type="number"
              placeholder="Max"
              min="0"
              aria-label="Potencia máxima (HP)"
              value={filters.maxPower}
              onChange={(e) => handleFieldChange('maxPower', e.target.value)}
            />
          </div>
        </div>

        <Button variant="outline" className="w-full" onClick={onClearFilters}>
          Limpiar filtros
        </Button>
      </div>
    </div>
  );
}
