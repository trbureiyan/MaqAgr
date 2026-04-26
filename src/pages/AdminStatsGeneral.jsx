import React, { useEffect, useState } from "react";
import { getOverviewStats } from "../services/adminApi";
import {
  Users,
  UserCheck,
  UserX,
  Tractor,
  Wrench,
  Map,
  Search,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { motion } from "motion/react";

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </motion.div>
);

const SimpleBarChart = ({ data }) => {
  if (!data || !data.data || data.data.length === 0) return null;

  // Encontramos el valor máximo para calcular la altura de las barras (mínimo 10 para que no se vea vacío si hay muy pocos)
  const maxVal = Math.max(...data.data.map((d) => d.value), 10);

  return (
    <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-6">
        Consultas en los últimos 30 días
      </h3>
      <div className="h-48 flex items-end gap-1 sm:gap-2">
        {data.data.map((item, idx) => {
          const heightPct = (item.value / maxVal) * 100;
          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center group relative"
            >
              {/* Tooltip on hover */}
              <div className="opacity-0 group-hover:opacity-100 absolute -top-10 bg-gray-800 text-white text-xs py-1 px-2 rounded pointer-events-none transition-opacity whitespace-nowrap z-10">
                {item.label}: {item.value}
              </div>
              {/* Bar */}
              <div
                className="w-full bg-blue-100 rounded-t-sm group-hover:bg-blue-400 transition-colors"
                style={{ height: `${Math.max(heightPct, 2)}%` }} // min 2% height para que siempre se vea una rayita
              />
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-2">
        <span>{data.data[0]?.label}</span>
        <span>{data.data[data.data.length - 1]?.label}</span>
      </div>
    </div>
  );
};

export default function AdminStatsGeneral() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await getOverviewStats();
        // El API cliente devuelve data dentro de res.data dependiendo de cómo esté configurado,
        // pero nuestro apiClient ya extrae el payload. Veamos si el payload tiene "data".
        // BackMaqagr devuelve { success, message, data: { totals, ... } }
        if (res.success && res.data) {
          setStats(res.data);
        } else if (res.totals) {
          // En caso de que el apiClient retorne res.data directamente
          setStats(res);
        }
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar las estadísticas.");
        console.error("Error al cargar estadísticas generales");
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

  const { totals, queriesTrend } = stats;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Estadísticas Generales
        </h1>
        <p className="text-gray-500 mt-1">
          Resumen del estado y uso de la plataforma.
        </p>
      </div>

      {/* Grid Usuarios */}
      <h2 className="text-lg font-bold text-gray-700 mb-4">Usuarios</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Usuarios Totales"
          value={totals?.users?.total || 0}
          icon={Users}
          color="bg-blue-100 text-blue-600"
          delay={0.1}
        />
        <StatCard
          title="Usuarios Activos"
          value={totals?.users?.active || 0}
          icon={UserCheck}
          color="bg-green-100 text-green-600"
          delay={0.2}
        />
        <StatCard
          title="Usuarios Inactivos"
          value={totals?.users?.inactive || 0}
          icon={UserX}
          color="bg-red-100 text-red-600"
          delay={0.3}
        />
      </div>

      {/* Grid Contenido del Sistema */}
      <h2 className="text-lg font-bold text-gray-700 mb-4">
        Catálogo y Operaciones
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tractores"
          value={totals?.tractors || 0}
          icon={Tractor}
          color="bg-orange-100 text-orange-600"
          delay={0.4}
        />
        <StatCard
          title="Implementos"
          value={totals?.implements || 0}
          icon={Wrench}
          color="bg-gray-100 text-gray-600"
          delay={0.5}
        />
        <StatCard
          title="Terrenos"
          value={totals?.terrains || 0}
          icon={Map}
          color="bg-amber-100 text-amber-600"
          delay={0.6}
        />
        <StatCard
          title="Recomendaciones"
          value={totals?.recommendations || 0}
          icon={TrendingUp}
          color="bg-purple-100 text-purple-600"
          delay={0.7}
        />
      </div>

      {/* Gráfico de barras simples para las consultas por día */}
      {queriesTrend?.byDay && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <SimpleBarChart data={queriesTrend.byDay} />
        </motion.div>
      )}
    </motion.div>
  );
}
