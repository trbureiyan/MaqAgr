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

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import TractorMachineCard from '../components/ui/cards/TractorMachineCard';
import SkeletonCard from '../components/ui/loaders/SkeletonCard';
import MachineImg from '../assets/img/2.png';
import TractorImg from '../assets/img/1.png';
import { calculateMinimumPower } from '../services/calculationApi';
import { getWorkingDepthM, parseStoredImplementData } from '../lib/implementStorageUtils';
import { 
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction
} from '../components/ui/alert-dialog';

export default function ResultadosImplemento() {
  const navigate = useNavigate();

  const [datos, setDatos] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [calculationResult, setCalculationResult] = useState(null);

  useEffect(() => {
    const rawData = localStorage.getItem('implemento_datos');
    if (!rawData) {
      navigate('/TengoMaquinaria');
      return;
    }

    const implementData = parseStoredImplementData(rawData);
    if (!implementData) {
      localStorage.removeItem('implemento_datos');
      navigate('/TengoMaquinaria');
      return;
    }

    setDatos(implementData);

    const fetchCalculation = async () => {
      setLoading(true);
      setError(null);
      try {
        // Adapt payload to backend. En un futuro el form debe seleccionar implement_id y terrain_id del DB.
        const workingDepth = getWorkingDepthM(implementData, 0.3);
        const payload = {
          implementId: implementData.implementId ?? implementData.implement_id ?? 1,
          terrainId: implementData.terrainId ?? implementData.terrain_id ?? 1,
          // Backend validateImplementRequirement exige working_depth_m <= 1.0
          workingDepthM: Math.min(workingDepth, 1.0),
        };
        const res = await calculateMinimumPower(payload);
        setCalculationResult(res.data);
      } catch (err) {
        setError(err.message || 'Error al calcular potencia mínima');
      } finally {
        setLoading(false);
      }
    };

    fetchCalculation();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center bg-gray-100 py-10 min-h-screen">
        <div className="animate-pulse space-y-4 w-full max-w-6xl p-8">
          <div className="h-8 bg-gray-300 rounded w-1/4 mx-auto mb-8"></div>
          <div className="h-64 bg-gray-300 rounded w-full"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </div>
    );
  }

  const { implement, powerRequirement, recommendations } = calculationResult || {};
  const hp = powerRequirement?.calculatedPowerHp || powerRequirement?.minimumPowerHp || 0;
  const recommendedTractors = recommendations?.top5 || [];

  const filteredTractors = recommendedTractors.filter(t => 
    !busqueda || 
    t.name?.toLowerCase().includes(busqueda.toLowerCase()) || 
    t.brand?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <>
      <AlertDialog open={!!error}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Aviso de Validación</AlertDialogTitle>
            <AlertDialogDescription>
              {error}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => navigate(-1)}>Volver a editar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex flex-col items-center justify-center bg-gray-100 py-10 min-h-screen">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-6xl mb-10">
        <h1 className="text-3xl font-bold text-center mb-8">Resultados del Análisis</h1>
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 flex items-center justify-center">
            <img 
              src={MachineImg}
              alt="Implemento seleccionado" 
              className="w-full max-w-md h-auto rounded-lg object-contain"
            />
          </div>
          <div className="w-full md:w-1/2 md:pl-8 mt-8 md:mt-0 flex flex-col justify-center">
            <div className="bg-gray-200 p-6 rounded-lg shadow-inner h-full">
              <h3 className="text-xl font-bold mb-4">{implement?.name || datos?.implement_type}</h3>
              <p className="text-gray-700 mb-2">Para operar este implemento de manera eficiente, optimizando la tracción y reduciendo el patinamiento...</p>
              <p className="text-gray-700 mb-4">Se requiere un tractor con una potencia mínima estimada de:</p>
              <div className="flex justify-center mt-6">
                <div className="bg-[#991b1b] text-white px-6 py-3 rounded-lg text-2xl font-bold shadow-md">
                  {hp} HP
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-6xl">
        <h2 className="text-2xl font-bold text-center mb-8">Tractores Compatibles Recomendados</h2>
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center text-gray-600 font-medium">
            Tractores que cumplen o superan los {hp} HP requeridos.
          </div>
          <div className="relative w-full md:w-64">
            <input 
              type="text" 
              placeholder="Buscar tractor..." 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#991b1b]"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredTractors.length > 0 ? (
            filteredTractors.map((tractor) => (
              <TractorMachineCard 
                key={tractor.tractorId || tractor.id}
                imageSrc={TractorImg}
                link={`/tractor/${tractor.tractorId || tractor.id}`}
                title={tractor.name || `${tractor.brand} ${tractor.model}`}
                description={`Potencia: ${tractor.enginePowerHp} HP - Compatibilidad: ${tractor.suitability?.label || 'Óptimo'}`}
              />
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-lg">No se encontraron tractores compatibles con "{busqueda}"</p>
              <p className="text-sm mt-2">Intenta buscar con otro término o reduce los requerimientos.</p>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
