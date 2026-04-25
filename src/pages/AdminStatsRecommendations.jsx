import React, { useEffect, useState } from 'react';
import { getRecommendationStats } from '../services/adminApi';
import { 
  Tractor, 
  Wrench, 
  Map, 
  Zap,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';

const SimpleBarChart = ({ data, title, colorClass }) => {
  if (!data || !data.data || data.data.length === 0) return null;
  const maxVal = Math.max(...data.data.map(d => d.value), 10);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
      <h3 className="text-lg font-bold text-gray-800 mb-6">{title}</h3>
      <div className="flex-1 flex items-end gap-2 justify-between">
        {data.data.map((item, idx) => {
          const heightPct = (item.value / maxVal) * 100;
          return (
            <div key={idx} className="flex-1 flex flex-col items-center group relative min-w-0">
              <div className="opacity-0 group-hover:opacity-100 absolute -top-10 bg-gray-800 text-white text-xs py-1 px-2 rounded pointer-events-none transition-opacity whitespace-nowrap z-10">
                {item.label}: {item.value}
              </div>
              <div 
                className={`w-full rounded-t-sm transition-colors ${colorClass}`}
                style={{ height: `${Math.max(heightPct, 2)}%` }}
              />
              <span className="text-[10px] text-gray-500 mt-2 truncate w-full text-center">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function AdminStatsRecommendations() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await getRecommendationStats();
        if (res.success && res.data) {
          setStats(res.data);
        } else if (res.topTractors) {
          setStats(res);
        }
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar las estadísticas de recomendaciones.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-6 rounded-lg flex items-center gap-3">
        <AlertCircle className="w-6 h-6" />
        <span className="font-medium">{error}</span>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Estadísticas de Recomendaciones</h1>
        <p className="text-gray-500 mt-1">Análisis de la maquinaria sugerida por el sistema a los usuarios.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between"
        >
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Promedio de Potencia Sugerida</p>
            <h3 className="text-4xl font-bold text-blue-600">{stats.averageRecommendedPowerHp || 0} HP</h3>
          </div>
          <div className="p-4 bg-blue-50 rounded-full">
            <Zap className="w-8 h-8 text-blue-500" />
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <SimpleBarChart 
            title="Distribución por Tipo de Terreno" 
            data={stats.terrainDistribution} 
            colorClass="bg-amber-200 group-hover:bg-amber-400"
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <SimpleBarChart 
            title="Distribución por Rango de Potencia" 
            data={stats.powerRangeDistribution} 
            colorClass="bg-blue-200 group-hover:bg-blue-500"
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Tractors */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="p-5 border-b border-gray-100 flex items-center gap-2">
            <Tractor className="text-orange-500 w-5 h-5" />
            <h3 className="font-bold text-gray-800">Top Tractores Recomendados</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {stats.topTractors?.data?.map((item, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 font-bold w-4 text-sm">{idx + 1}.</span>
                  <div>
                    <p className="font-semibold text-gray-800">{item.brand} {item.model}</p>
                  </div>
                </div>
                <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">
                  {item.value} recs
                </div>
              </div>
            ))}
            {(!stats.topTractors?.data || stats.topTractors.data.length === 0) && (
              <div className="p-6 text-center text-gray-500">Sin datos registrados</div>
            )}
          </div>
        </motion.div>

        {/* Top Implements */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="p-5 border-b border-gray-100 flex items-center gap-2">
            <Wrench className="text-gray-500 w-5 h-5" />
            <h3 className="font-bold text-gray-800">Top Implementos Recomendados</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {stats.topImplements?.data?.map((item, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 font-bold w-4 text-sm">{idx + 1}.</span>
                  <div>
                    <p className="font-semibold text-gray-800">{item.brand} {item.name}</p>
                    <p className="text-xs text-gray-500">{item.type}</p>
                  </div>
                </div>
                <div className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">
                  {item.value} recs
                </div>
              </div>
            ))}
            {(!stats.topImplements?.data || stats.topImplements.data.length === 0) && (
              <div className="p-6 text-center text-gray-500">Sin datos registrados</div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
