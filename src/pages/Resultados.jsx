import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TractorMachineCard from "../components/ui/cards/TractorMachineCard";
import SkeletonCard from '../components/ui/loaders/SkeletonCard';
import MachineImg from "../assets/img/2.png";
import { generateAdvancedRecommendation } from '../services/recommendationApi';

export default function Resultados() {
  const location = useLocation();
  const navigate = useNavigate();
  const [recommendationResult, setRecommendationResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendation = async () => {
      setLoading(true);
      try {
        const payload = location.state?.payload || {
          tractorId: 1,
          terrainId: 1,
          tireCondition: "new",
          ptoEfficiency: 0.85
        };
        const result = await generateAdvancedRecommendation(payload);
        setRecommendationResult(result.data);
      } catch (err) {
        setError(err.message || 'Error al generar recomendación avanzada');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecommendation();
  }, [location.state]);

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

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center bg-gray-100 py-10 min-h-screen text-red-600">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p className="mb-6">{error}</p>
        <button onClick={() => navigate(-1)} className="px-4 py-2 bg-blue-600 text-white rounded">Volver</button>
      </div>
    );
  }

  const { tractor, detailedAnalysis, recommendedImplements } = recommendationResult || {};
  const hp = detailedAnalysis?.realAvailableHp || tractor?.enginePowerHp || 0;

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 py-10 min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-6xl mb-10">
        <h1 className="text-3xl font-bold text-center mb-8">Resultados: Implementos para tu Tractor</h1>
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 rounded-lg p-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800">{tractor?.name || `${tractor?.brand} ${tractor?.model}`}</h2>
              <p className="text-gray-600 mt-2">Potencia nominal: {tractor?.enginePowerHp} HP</p>
            </div>
          </div>
          <div className="w-full md:w-1/2 md:pl-8 mt-8 md:mt-0">
            <div className="bg-gray-200 p-6 rounded-lg shadow-inner h-full flex flex-col justify-center">
              <p className="text-gray-700 mb-2">Según nuestro análisis avanzado de pérdida de potencia (por terreno, patinamiento, etc):</p>
              <p className="text-gray-700 mb-4">La potencia útil real disponible a la barra de tiro es de aproximadamente:</p>
              <div className="flex justify-center mt-4">
                <div className="bg-[#991b1b] text-white px-6 py-3 rounded-lg text-2xl font-bold shadow-md">
                  {hp} HP Reales
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-6xl">
        <h2 className="text-2xl font-bold text-center mb-8">Implementos Compatibles Recomendados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {recommendedImplements?.map((rec) => (
            <TractorMachineCard 
              key={rec.implement?.id || rec.rank}
              imageSrc={MachineImg}
              link={`/implement/${rec.implement?.id}`}
              title={rec.implement?.name || rec.implement?.implementType}
              description={`Requisito: ${rec.implement?.powerRequirementHp} HP - Tipo: ${rec.implement?.implementType} - Confianza: ${rec.score?.total}%`}
            />
          ))}
          {(!recommendedImplements || recommendedImplements.length === 0) && (
            <div className="col-span-full py-10 text-center text-muted-foreground bg-gray-50 rounded border border-dashed border-gray-300">
              <p className="text-lg">No se encontraron implementos que se ajusten a esta máquina.</p>
              <p className="text-sm mt-2">Prueba configurando diferentes tractores o condiciones.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}