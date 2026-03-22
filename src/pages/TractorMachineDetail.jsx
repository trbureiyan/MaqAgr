/**
 * @fileoverview Página de detalle de tractor o máquina agrícola.
 *
 * Muestra la información técnica completa de un equipo (tractor o máquina)
 * organizada en pestañas temáticas. Los datos se cargan de forma simulada
 * (mock) según el ID de la URL; en producción se reemplazará por una llamada
 * a la API REST.
 *
 * Pestañas disponibles:
 *  - Identificación   — datos básicos del equipo (siempre visible)
 *  - Dimensiones      — medidas y peso (siempre visible)
 *  - Motor            — solo para tractores
 *  - Especificaciones — solo para máquinas
 *
 * Responsive:
 *  - Hero: columna única en móvil → dos columnas en md+
 *  - Pestañas: scroll horizontal en móvil con `overflow-x-auto`
 *  - Grilla de datos: 1 columna en móvil → 2 columnas en md+
 *
 * @module pages/TractorMachineDetail
 */

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Button from '../components/ui/buttons/Button';

// ---------------------------------------------------------------------------
// Datos mock
// ---------------------------------------------------------------------------

/**
 * Datos de muestra para el tractor y la máquina.
 * En producción se reemplazará por una llamada a `GET /api/tractors/:id`
 * o `GET /api/machines/:id` según el tipo de equipo.
 *
 * @type {{ tractor: Object, maquina: Object }}
 */
const MOCK_DATA = {
  tractor: {
    id: '1',
    title: 'New Holland 8670',
    category: 'Tractor',
    imageSrc: '/src/assets/img/1.png',
    fichaTecnicaUrl: '/path/to/ficha-tecnica-nh8670.pdf',
    identificacion: {
      nombreComercial: 'New Holland 8670',
      marca: 'New Holland',
      modelo: '8670',
      anoFabricacion: '2020',
    },
    motor: {
      potenciaBruta: '220 HP / 164 kW',
      potenciaTDF: '198 HP / 147 kW',
      aspiracion: 'Turboalimentado con intercooler',
    },
    dimensiones: {
      longitudTotal: '5200 mm',
      anchura: '2540 mm',
      altura: '3100 mm',
      peso: '8500 kg',
    },
  },
  maquina: {
    id: '2',
    title: 'Arado de vértebras 975',
    category: 'Máquina',
    imageSrc: '/src/assets/img/2.png',
    fichaTecnicaUrl: '/path/to/ficha-tecnica-arado975.pdf',
    identificacion: {
      nombreComercial: 'Arado de vértebras 975',
      marca: 'TecnoAgro',
      modelo: '975',
      anoFabricacion: '2022',
    },
    dimensiones: {
      longitudTotal: '3500 mm',
      anchura: '2100 mm',
      altura: '1200 mm',
      peso: '1250 kg',
    },
    especificacionesTecnicas: {
      anchoDeTrabajo: '3.5 m',
      numeroDeCuerpos: '5',
      profundidadTrabajo: '30-45 cm',
      requerimientoPotencia: '90-120 HP',
    },
  },
};

/**
 * Mapeo de claves de campo a etiquetas legibles en español.
 * Cubre los campos de todas las pestañas para evitar lógica de transformación dispersa.
 *
 * @type {Record<string, string>}
 */
const FIELD_LABELS = {
  nombreComercial: 'Nombre Comercial',
  marca: 'Marca',
  modelo: 'Modelo',
  anoFabricacion: 'Año de Fabricación',
  potenciaBruta: 'Potencia Bruta (HP/kW)',
  potenciaTDF: 'Potencia en la TDF (HP/kW)',
  aspiracion: 'Aspiración',
  longitudTotal: 'Longitud Total (mm)',
  anchura: 'Anchura (mm)',
  altura: 'Altura (mm)',
  peso: 'Peso (kg)',
  anchoDeTrabajo: 'Ancho de Trabajo',
  numeroDeCuerpos: 'Número de Cuerpos',
  profundidadTrabajo: 'Profundidad de Trabajo',
  requerimientoPotencia: 'Requerimiento de Potencia',
};

/**
 * Nombres de las pestañas de detalle.
 *
 * @type {Record<string, string>}
 */
const TAB_NAMES = {
  identificacion: 'Datos de Identificación',
  motor: 'Especificaciones de Motor',
  dimensiones: 'Dimensiones y Peso',
  especificacionesTecnicas: 'Especificaciones Técnicas',
};

// ---------------------------------------------------------------------------
// Sub-componente: tabla de datos de una pestaña
// ---------------------------------------------------------------------------

/**
 * DataTable — Tabla de pares clave-valor para una sección de datos técnicos.
 *
 * Renderiza cada entrada del objeto `data` como una fila con etiqueta y valor.
 * Usa `FIELD_LABELS` para mostrar etiquetas legibles en lugar de las claves raw.
 *
 * @param {Object} props
 * @param {string} props.title  - Título de la sección.
 * @param {Object} props.data   - Objeto con los pares clave-valor a mostrar.
 *
 * @returns {JSX.Element} Sección con título y tabla de datos.
 */
const DataTable = ({ title, data }) => (
  <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
    <h2 className="text-xl sm:text-2xl font-bold text-red-800 mb-4 sm:mb-6">{title}</h2>
    <div className="grid grid-cols-1 gap-y-3 gap-x-8 md:grid-cols-2">
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="border-b border-gray-200 pb-2">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
            {/* Etiqueta del campo — legible en español */}
            <span className="font-medium text-gray-700 text-sm">
              {FIELD_LABELS[key] ?? key.replace(/([A-Z])/g, ' $1').trim()}
            </span>
            {/* Valor del campo */}
            <span className="text-gray-900 text-sm sm:text-right">{value}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

/**
 * TractorDetail — Página de detalle de tractor o máquina agrícola.
 *
 * Lee el parámetro `:id` de la URL para determinar qué equipo mostrar.
 * Simula una carga asíncrona de 800 ms antes de mostrar los datos.
 * Las pestañas disponibles varían según la categoría del equipo.
 *
 * @component
 * @returns {JSX.Element} Página de detalle con hero, pestañas y contenido técnico.
 *
 * @example
 * // Registrada en App.jsx para tractores y máquinas
 * <Route path="/tractor/:id"    element={<TractorMachineDetail />} />
 * <Route path="/maquinaria/:id" element={<TractorMachineDetail />} />
 */
const TractorDetail = () => {
  // ── Parámetros de ruta ────────────────────────────────────────────────────

  /** ID del equipo extraído de la URL (ej. '1' para tractor, '2' para máquina). */
  const { id } = useParams();

  // ── Estado local ──────────────────────────────────────────────────────────

  /** Indica si los datos están siendo cargados. */
  const [loading, setLoading] = useState(true);

  /** Datos del equipo cargado, o `null` si no se encontró. */
  const [item, setItem] = useState(null);

  /** Pestaña activa actualmente. */
  const [activeTab, setActiveTab] = useState('identificacion');

  // ── Carga de datos (simulada) ─────────────────────────────────────────────

  useEffect(() => {
    /**
     * Simula una llamada a la API con un delay de 800 ms.
     * En producción se reemplazará por `fetch` o `axios`.
     */
    const timer = setTimeout(() => {
      // Seleccionar datos según el ID: '1' → tractor, cualquier otro → máquina
      const itemData = id === '1' ? MOCK_DATA.tractor : MOCK_DATA.maquina;
      setItem(itemData);
      setLoading(false);
    }, 800);

    // Limpiar el timer si el componente se desmonta antes de que termine
    return () => clearTimeout(timer);
  }, [id]);

  // ── Estados de carga y error ──────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          {/* Spinner de carga */}
          <div
            className="w-14 h-14 sm:w-16 sm:h-16 border-4 border-red-800 border-t-transparent
                       rounded-full animate-spin mx-auto"
            role="status"
            aria-label="Cargando información del equipo"
          />
          <p className="mt-4 text-base sm:text-lg text-gray-600">Cargando información...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-xl sm:text-2xl font-bold text-red-800">Ítem no encontrado</h1>
        <Button variant="primary" color="#9f0712" to="/" className="mt-4">
          Volver al inicio
        </Button>
      </div>
    );
  }

  // ── Derivados ─────────────────────────────────────────────────────────────

  /**
   * Calcula las pestañas disponibles según la categoría del equipo.
   * Los tractores tienen pestaña de motor; las máquinas tienen especificaciones técnicas.
   *
   * @returns {string[]} Array de claves de pestaña disponibles.
   */
  const getTabs = () => {
    const tabs = ['identificacion', 'dimensiones'];
    if (item.category === 'Tractor') tabs.push('motor');
    if (item.category === 'Máquina') tabs.push('especificacionesTecnicas');
    return tabs;
  };

  const tabs = getTabs();

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="bg-gray-100 min-h-screen pb-10 sm:pb-12">

      {/* ── Hero: imagen + título + descripción + CTA ── */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/*
           * Layout hero:
           *  - móvil  : columna única (texto arriba, imagen abajo)
           *  - md+    : dos columnas (texto izquierda, imagen derecha)
           */}
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-8">

            {/* Bloque de texto */}
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-800 mb-3 sm:mb-4">
                {item.title}
              </h1>
              {/* Línea decorativa */}
              <div className="w-20 sm:w-24 h-1 bg-red-800 mb-4 sm:mb-6" aria-hidden="true" />

              {/* Descripción dinámica según categoría */}
              <p className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">
                {item.category === 'Tractor'
                  ? `Tractor ${item.identificacion.marca} ${item.identificacion.modelo}, fabricado en ${item.identificacion.anoFabricacion}.`
                  : `${item.identificacion.nombreComercial}, fabricado por ${item.identificacion.marca} en ${item.identificacion.anoFabricacion}.`}
              </p>

              {/* CTA: descargar ficha técnica */}
              <Button
                variant="primary"
                color="#9f0712"
                href={item.fichaTecnicaUrl}
                download
                className="w-full sm:w-auto"
              >
                Descargar ficha técnica
              </Button>
            </div>

            {/* Imagen del equipo */}
            <div className="flex-1">
              <div className="bg-gray-100 rounded-lg overflow-hidden shadow-lg">
                <img
                  src={item.imageSrc}
                  alt={item.title}
                  className="w-full h-auto object-contain aspect-video"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Pestañas de navegación ── */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8">

        {/* Barra de pestañas con scroll horizontal en móvil */}
        <div className="border-b border-gray-200 overflow-x-auto">
          <nav
            className="flex -mb-px min-w-max"
            role="tablist"
            aria-label="Secciones de información técnica"
          >
            {tabs.map((tab) => (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                aria-controls={`panel-${tab}`}
                onClick={() => setActiveTab(tab)}
                className={`py-3 sm:py-4 px-4 sm:px-6 text-center border-b-2 font-medium
                            text-xs sm:text-sm whitespace-nowrap transition-colors duration-200 ${
                  activeTab === tab
                    ? 'border-red-800 text-red-800'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {TAB_NAMES[tab]}
              </button>
            ))}
          </nav>
        </div>

        {/* ── Contenido de la pestaña activa ── */}
        <div className="py-4 sm:py-6">

          {/* Pestaña: Identificación */}
          {activeTab === 'identificacion' && (
            <DataTable title="Datos de Identificación" data={item.identificacion} />
          )}

          {/* Pestaña: Motor (solo tractores) */}
          {activeTab === 'motor' && item.motor && (
            <DataTable title="Especificaciones de Motor" data={item.motor} />
          )}

          {/* Pestaña: Dimensiones */}
          {activeTab === 'dimensiones' && (
            <DataTable title="Dimensiones y Peso" data={item.dimensiones} />
          )}

          {/* Pestaña: Especificaciones Técnicas (solo máquinas) */}
          {activeTab === 'especificacionesTecnicas' && item.especificacionesTecnicas && (
            <DataTable title="Especificaciones Técnicas" data={item.especificacionesTecnicas} />
          )}
        </div>
      </div>
    </div>
  );
};

export default TractorDetail;
