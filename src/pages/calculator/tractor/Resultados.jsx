import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SkeletonCard from '../../../components/ui/loaders/SkeletonCard';
import { calculateDirectPowerLoss } from '../../../services/calculationApi';

/**
 * Página de resultados del flujo "Tengo Tractor".
 *
 * Llama a /api/calculations/direct-power-loss con el payload construido en los pasos
 * anteriores (DatosTractor → DatosLlantas → DatosClimaticos) y muestra el
 * análisis de pérdida de potencia con desglose por factor.
 */
export default function Resultados() {
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tractorData = location.state?.tractorData || {};
  const payload = location.state?.payload;

  useEffect(() => {
    const fetchResult = async () => {
      setLoading(true);
      setError(null);
      try {
        // El flujo "Tengo Tractor" construye el payload completo en
        // DatosTractor → DatosLlantas → DatosClimaticos y lo pasa via navigate state.
        // El apiClient convierte camelCase → snake_case antes de enviar al backend.
        if (!payload || !payload.enginePowerHp) {
          setError('Faltan datos del tractor. Volvé al paso 1.');
          setLoading(false);
          return;
        }

        // Agregar defaults si no vienen en el payload
        const fullPayload = {
          workingSpeedKmh: 7,
          carriedObjectsWeightKg: 0,
          ...payload,
        };

        const response = await calculateDirectPowerLoss(fullPayload);
        setResult(response?.data ?? response);
      } catch (err) {
        setError(err.message || 'Error al calcular la pérdida de potencia');
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [location.state, payload]);

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
        <h2 className="text-2xl font-bold mb-4">Error de cálculo</h2>
        <p className="mb-6">{error}</p>
        <button
          onClick={() => navigate('/DatosTractor')}
          className="px-4 py-2 bg-[#991b1b] text-white rounded hover:bg-red-900 transition"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  const tractor = result?.tractor;
  const terrain = result?.terrain;
  const losses = result?.losses;
  const netPowerHp = result?.netPowerHp ?? 0;
  const enginePowerHp = result?.enginePowerHp ?? 0;
  const efficiencyPct = result?.efficiencyPercentage ?? 0;

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 py-10 min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-6xl mb-10">
        <h1 className="text-3xl font-bold text-center mb-8">Resultados: Análisis de Potencia</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Resumen del tractor */}
          <div className="w-full md:w-1/2 bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-bold text-gray-800">
                {tractor?.brand} {tractor?.model}
              </h2>
              {tractor?.hasTurbo && (
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  Turboalimentado
                </span>
              )}
            </div>
            <p className="text-gray-600">Potencia nominal: <strong>{enginePowerHp} HP</strong></p>
            {tractorData.pb && (
              <p className="text-gray-600 text-sm">Potencia al motor (Pb): <strong>{tractorData.pb} HP</strong></p>
            )}
            {tractorData.pmax_tdp && (
              <p className="text-gray-600 text-sm">Potencia TDP: <strong>{tractorData.pmax_tdp} HP</strong></p>
            )}
            {tractorData.peso && (
              <p className="text-gray-600 text-sm">Peso: <strong>{tractorData.peso} kg</strong></p>
            )}
            {terrain && (
              <p className="text-gray-600 mt-1">
                Terreno: <strong>{terrain.name}</strong> ({terrain.soilType})
              </p>
            )}
          </div>

          {/* Resultado principal */}
          <div className="w-full md:w-1/2 bg-gray-200 p-6 rounded-lg shadow-inner flex flex-col justify-center">
            <p className="text-gray-700 mb-2">
              Según el análisis de pérdida de potencia (pendiente, altitud, rodamiento, patinamiento):
            </p>
            <p className="text-gray-700 mb-4">La potencia útil real disponible a la barra de tiro es de:</p>
            <div className="flex justify-center mt-2">
              <div className="bg-[#991b1b] text-white px-6 py-3 rounded-lg text-2xl font-bold shadow-md">
                {netPowerHp} HP Reales
              </div>
            </div>
            <p className="text-center text-gray-500 text-sm mt-3">Eficiencia: {efficiencyPct}%</p>
          </div>
        </div>

        {/* Desglose de pérdidas */}
        {losses && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Desglose de pérdidas de potencia</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Pendiente', value: losses.slopeLossHp },
                { label: 'Altitud', value: losses.altitudeLossHp, zeroIfTurbo: tractor?.hasTurbo },
                { label: 'Rodamiento', value: losses.rollingResistanceLossHp },
                { label: 'Patinamiento', value: losses.slippageLossHp },
              ].map(({ label, value, zeroIfTurbo }) => (
                <div key={label} className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500 mb-1">
                    {label}
                    {zeroIfTurbo && (
                      <span className="block text-xs text-blue-600">Compensado por turbo</span>
                    )}
                  </p>
                  <p className="text-xl font-bold text-red-700">-{value ?? 0} HP</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
