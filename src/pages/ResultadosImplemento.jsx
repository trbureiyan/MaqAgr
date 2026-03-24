/**
 * @fileoverview Paso 3 del flujo "Tengo Maquinaria" — Resultados.
 *
 * Lee los datos del implemento almacenados en localStorage (pasos 1 y 2),
 * calcula la potencia requerida estimada y muestra:
 *  1. Resumen del implemento con imagen y descripción calculada.
 *  2. Tractores recomendados filtrados por potencia ≥ power_requirement_hp.
 *
 * Los datos de tractores están "quemados" (mock). En el futuro se conectará
 * a GET /api/tractors con los filtros correspondientes.
 *
 * Cálculo de potencia requerida (estimación simplificada):
 *   power_hp = (working_width_m * working_depth_cm * FACTOR_TIPO) + (weight_kg * 0.01)
 *
 * @module pages/ResultadosImplemento
 */

import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import TractorMachineCard from '../components/ui/cards/TractorMachineCard';
import Button from '../components/ui/buttons/Button';
import MachineImg from '../assets/img/2.png';
import TractorImg from '../assets/img/1.png';

// ---------------------------------------------------------------------------
// Datos mock — tractores del sistema
// ---------------------------------------------------------------------------

/**
 * Lista de tractores mock.
 * Cada tractor tiene los campos del backend usados para filtrar por potencia.
 * TODO: Reemplazar por llamada a GET /api/tractors cuando se conecte el back.
 *
 * @type {Array<Object>}
 */
const TRACTORES_MOCK = [
  {
    tractor_id: 1,
    name: 'John Deere 5075E',
    brand: 'John Deere',
    model: '5075E',
    engine_power_hp: 75,
    traction_type: '4x4',
    description: 'Tractor versátil de 75 HP ideal para labores medianas en suelos arcillosos y francos. Excelente estabilidad y tracción en terrenos irregulares.',
    link: '/tractor/1',
    imageSrc: TractorImg,
  },
  {
    tractor_id: 2,
    name: 'Massey Ferguson 4709',
    brand: 'Massey Ferguson',
    model: '4709',
    engine_power_hp: 90,
    traction_type: '4x4',
    description: 'Potente tractor de 90 HP con tracción integral. Adecuado para implementos de mediana a alta demanda energética en todo tipo de suelo.',
    link: '/tractor/2',
    imageSrc: TractorImg,
  },
  {
    tractor_id: 3,
    name: 'New Holland TT3.55',
    brand: 'New Holland',
    model: 'TT3.55',
    engine_power_hp: 55,
    traction_type: '4x2',
    description: 'Tractor compacto de 55 HP, ideal para tareas livianas en suelos arenosos y francos. Bajo consumo y excelente maniobrabilidad.',
    link: '/tractor/3',
    imageSrc: TractorImg,
  },
  {
    tractor_id: 4,
    name: 'Kubota M5111',
    brand: 'Kubota',
    model: 'M5111',
    engine_power_hp: 110,
    traction_type: '4x4',
    description: 'Tractor de alta potencia (110 HP) con cabina climatizada. Apto para implementos pesados en cualquier tipo de suelo.',
    link: '/tractor/4',
    imageSrc: TractorImg,
  },
  {
    tractor_id: 5,
    name: 'Case IH Farmall 120A',
    brand: 'Case IH',
    model: 'Farmall 120A',
    engine_power_hp: 120,
    traction_type: '4x4',
    description: 'Tractor de 120 HP con transmisión automática. Máximo rendimiento para implementos de alta demanda como arados y cosechadoras.',
    link: '/tractor/5',
    imageSrc: TractorImg,
  },
  {
    tractor_id: 6,
    name: 'Deutz-Fahr Agrotron 6.180',
    brand: 'Deutz-Fahr',
    model: 'Agrotron 6.180',
    engine_power_hp: 180,
    traction_type: '4x4',
    description: 'Tractor de alta gama con 180 HP. Tecnología de punta para labores intensivas en terrenos de gran exigencia.',
    link: '/tractor/6',
    imageSrc: TractorImg,
  },
];

// ---------------------------------------------------------------------------
// Constantes de cálculo
// ---------------------------------------------------------------------------

/**
 * Factor de potencia estimado por tipo de implemento (HP por metro·cm de trabajo).
 * Valores aproximados para estimación frontend.
 * TODO: Afinar con modelo real del backend cuando se conecte.
 */
const FACTOR_POR_TIPO = {
  plow:       0.35,
  harrow:     0.20,
  seeder:     0.15,
  sprayer:    0.08,
  harvester:  0.40,
  cultivator: 0.18,
  mower:      0.12,
  trailer:    0.05,
  other:      0.20,
};

/**
 * Etiquetas legibles para los tipos de implemento.
 */
const TIPO_LABELS = {
  plow:       'Arado',
  harrow:     'Rastra',
  seeder:     'Sembradora',
  sprayer:    'Aspersora',
  harvester:  'Cosechadora',
  cultivator: 'Cultivador',
  mower:      'Segadora',
  trailer:    'Remolque',
  other:      'Otro',
};

/**
 * Etiquetas legibles para los tipos de suelo.
 */
const SUELO_LABELS = {
  clay:   'Arcilloso',
  sandy:  'Arenoso',
  loam:   'Franco',
  silt:   'Limoso',
  All:    'Todo tipo de suelo',
};

// ---------------------------------------------------------------------------
// Lógica de cálculo
// ---------------------------------------------------------------------------

/**
 * Calcula la potencia mínima estimada del tractor para un implemento dado.
 *
 * Fórmula simplificada:
 *   power = (width_m * depth_cm * factor_tipo) + (weight_kg * 0.009)
 *
 * @param {Object} datos - Datos del implemento.
 * @returns {number} Potencia mínima estimada en HP (redondeada).
 */
function calcularPotenciaRequerida(datos) {
  const { implement_type, working_width_m, working_depth_cm, weight_kg } = datos;

  const factor = FACTOR_POR_TIPO[implement_type] ?? 0.20;
  const potenciaBase   = working_width_m * working_depth_cm * factor;
  const potenciaPeso   = weight_kg * 0.009;
  const potenciaTotal  = potenciaBase + potenciaPeso;

  // Mínimo de 30 HP, redondeado al múltiplo de 5 más cercano
  return Math.max(30, Math.ceil(potenciaTotal / 5) * 5);
}

/**
 * Genera una descripción dinámica del implemento según sus características.
 *
 * @param {Object} datos - Datos del implemento.
 * @param {number} hp    - Potencia requerida calculada.
 * @returns {string[]}   Array de 3 frases descriptivas.
 */
function generarDescripcion(datos, hp) {
  const tipo  = TIPO_LABELS[datos.implement_type] ?? datos.implement_type;
  const suelo = SUELO_LABELS[datos.soil_type]     ?? datos.soil_type;

  return [
    `${tipo} con un ancho de trabajo de ${datos.working_width_m} m y una profundidad de operación de ${datos.working_depth_cm} cm. Diseñado para optimizar las labores en suelo ${suelo.toLowerCase()}.`,
    `El peso del implemento es de ${datos.weight_kg} kg, lo cual influye directamente en la fuerza de tracción necesaria y el patinamiento de las ruedas del tractor.`,
    `Para operar este implemento de manera eficiente se recomienda un tractor con una potencia mínima de ${hp} HP, preferiblemente con tracción 4x4 en suelos pesados.`,
  ];
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

/**
 * ResultadosImplemento — Paso 3 del flujo "Tengo Maquinaria".
 *
 * @component
 * @returns {JSX.Element}
 */
export default function ResultadosImplemento() {
  const navigate = useNavigate();

  // ── Estado ────────────────────────────────────────────────────────────────

  /** Datos del implemento leídos desde localStorage. */
  const [datos, setDatos] = useState(null);

  /** Texto de búsqueda para filtrar tractores recomendados. */
  const [busqueda, setBusqueda] = useState('');

  // ── Efecto: carga de datos ────────────────────────────────────────────────

  useEffect(() => {
    const guardados = localStorage.getItem('implemento_datos');
    if (guardados) {
      setDatos(JSON.parse(guardados));
    }
  }, []);

  // ── Derivados ─────────────────────────────────────────────────────────────

  /** Potencia mínima requerida calculada. */
  const potenciaHP = useMemo(
    () => (datos ? calcularPotenciaRequerida(datos) : 0),
    [datos]
  );

  /** Descripciones dinámicas del implemento. */
  const descripcion = useMemo(
    () => (datos ? generarDescripcion(datos, potenciaHP) : []),
    [datos, potenciaHP]
  );

  /**
   * Tractores filtrados:
   *  1. Potencia ≥ potenciaHP (requerimiento mínimo).
   *  2. Búsqueda por nombre o marca (opcional).
   */
  const tractoresRecomendados = useMemo(() => {
    const busquedaLower = busqueda.trim().toLowerCase();
    return TRACTORES_MOCK.filter((t) => {
      const cumplePotencia = t.engine_power_hp >= potenciaHP;
      const cumpleBusqueda = !busquedaLower
        ? true
        : t.name.toLowerCase().includes(busquedaLower) ||
          t.brand.toLowerCase().includes(busquedaLower);
      return cumplePotencia && cumpleBusqueda;
    });
  }, [potenciaHP, busqueda]);

  // ── Guard: sin datos ──────────────────────────────────────────────────────

  if (!datos) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 gap-4 p-4">
        <p className="text-gray-600 text-lg">No se encontraron datos del implemento.</p>
        <Button variant="primary" color="#991b1b" onClick={() => navigate('/TengoMaquinaria')}>
          Volver al inicio
        </Button>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 py-10 px-4">

      {/* ── Sección 1: Resultado del implemento ── */}
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-6xl mb-8">

        {/* Indicador de pasos */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-600 text-white text-sm font-bold">✓</span>
          <div className="w-12 h-0.5 bg-green-600" />
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-600 text-white text-sm font-bold">✓</span>
          <div className="w-12 h-0.5 bg-[#991b1b]" />
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#991b1b] text-white text-sm font-bold">3</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-8">
          Resultados
        </h1>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8">

          {/* Imagen del implemento */}
          <div className="w-full md:w-1/2 flex items-center justify-center">
            <img
              src={MachineImg}
              alt="Implemento agrícola"
              className="w-full max-w-xs md:max-w-full h-auto rounded-lg object-contain"
            />
          </div>

          {/* Panel de resultados */}
          <div className="w-full md:w-1/2 md:pl-4">
            <div className="bg-gray-100 p-5 sm:p-6 rounded-lg shadow-inner h-full flex flex-col justify-between">

              {/* Tipo de implemento y suelo */}
              <div className="mb-4">
                <span className="inline-block bg-[#991b1b]/10 text-[#991b1b] text-xs font-semibold px-3 py-1 rounded-full mb-3">
                  {TIPO_LABELS[datos.implement_type] ?? datos.implement_type}
                  {datos.soil_type && ` · Suelo ${SUELO_LABELS[datos.soil_type] ?? datos.soil_type}`}
                </span>
              </div>

              {/* Descripción dinámica */}
              <div className="flex flex-col gap-3 flex-1">
                {descripcion.map((parrafo, i) => (
                  <p key={i} className="text-gray-700 text-sm leading-relaxed">
                    {parrafo}
                  </p>
                ))}
              </div>

              {/* Badge de potencia requerida */}
              <div className="flex justify-center mt-6">
                <div className="bg-blue-100 text-blue-700 px-5 py-2 rounded-lg font-semibold text-base">
                  {potenciaHP} HP mínimo requerido
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Detalles técnicos en tabla compacta ── */}
        <div className="mt-6 border-t border-gray-100 pt-6">
          <h2 className="text-base font-semibold text-gray-700 mb-3">Datos ingresados</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Tipo',        value: TIPO_LABELS[datos.implement_type] ?? datos.implement_type },
              { label: 'Ancho',       value: `${datos.working_width_m} m` },
              { label: 'Profundidad', value: `${datos.working_depth_cm} cm` },
              { label: 'Peso',        value: `${datos.weight_kg} kg` },
            ].map((item) => (
              <div key={item.label} className="bg-gray-50 rounded-lg p-3 text-center border border-gray-200">
                <p className="text-xs text-gray-500 font-medium">{item.label}</p>
                <p className="text-sm font-semibold text-gray-800 mt-1">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Sección 2: Tractores recomendados ── */}
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-6xl">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-6">
          Tractores Recomendados
        </h2>

        {/* Barra de herramientas: info de potencia + buscador */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">

          {/* Indicador de potencia mínima */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 text-sm font-medium px-3 py-1.5 rounded-full">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Filtrando por ≥ {potenciaHP} HP
            </span>
            <span className="text-sm text-gray-500">
              ({tractoresRecomendados.length} tractor{tractoresRecomendados.length !== 1 ? 'es' : ''})
            </span>
          </div>

          {/* Buscador */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Buscar por nombre o marca..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#991b1b]"
            />
            <Search
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Grilla de tarjetas de tractores */}
        {tractoresRecomendados.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
            {tractoresRecomendados.map((tractor) => (
              <TractorMachineCard
                key={tractor.tractor_id}
                imageSrc={tractor.imageSrc}
                link={tractor.link}
                title={`${tractor.name} — ${tractor.engine_power_hp} HP`}
                description={tractor.description}
              />
            ))}
          </div>
        ) : (
          /* Estado vacío */
          <div className="flex flex-col items-center py-12 gap-3 text-center">
            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-500 text-sm">
              {busqueda
                ? 'No se encontraron tractores con ese nombre o marca.'
                : `No hay tractores con potencia suficiente (≥ ${potenciaHP} HP) en el catálogo actual.`}
            </p>
            {busqueda && (
              <button
                onClick={() => setBusqueda('')}
                className="text-sm text-[#991b1b] underline hover:opacity-80"
              >
                Limpiar búsqueda
              </button>
            )}
          </div>
        )}

        {/* Botón para reiniciar el flujo */}
        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            color="#991b1b"
            onClick={() => {
              localStorage.removeItem('implemento_datos');
              navigate('/TengoMaquinaria');
            }}
          >
            Realizar otra consulta
          </Button>
        </div>
      </div>
    </div>
  );
}
