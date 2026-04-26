import React, { useEffect, useState } from 'react';
import { getUserStats } from '../services/adminApi';
import { 
  Users, 
  UserCheck, 
  UserX, 
  MapPin, 
  Search,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between"
  >
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
    </div>
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon className="w-6 h-6" />
    </div>
  </motion.div>
);

const SimpleBarChart = ({ data, title, colorClass }) => {
  if (!data || !data.data || data.data.length === 0) return null;
  const maxVal = Math.max(...data.data.map(d => d.value), 10);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
      <h3 className="text-lg font-bold text-gray-800 mb-6">{title}</h3>
      <div className="flex-1 flex items-end gap-2 justify-between min-h-[200px]">
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

export default function AdminStatsUsers() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await getUserStats();
        if (res.success && res.data) {
          setStats(res.data);
        } else if (res.users) {
          setStats(res);
        }
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar las métricas de usuarios.');
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
        <h1 className="text-3xl font-bold text-gray-800">Métricas de Usuarios</h1>
        <p className="text-gray-500 mt-1">Detalles de la interacción y crecimiento de la base de usuarios.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Usuarios Registrados" 
          value={stats.users?.total || 0} 
          icon={Users} 
          color="bg-blue-100 text-blue-600"
          delay={0.1}
        />
        <StatCard 
          title="Usuarios Activos (con consultas)" 
          value={stats.users?.active || 0} 
          icon={UserCheck} 
          color="bg-green-100 text-green-600"
          delay={0.2}
        />
        <StatCard 
          title="Usuarios Inactivos" 
          value={stats.users?.inactive || 0} 
          icon={UserX} 
          color="bg-gray-100 text-gray-600"
          delay={0.3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-amber-50 to-orange-50 border border-orange-100 rounded-xl p-6 flex items-center justify-between"
        >
          <div>
            <p className="text-orange-800 font-medium mb-1">Promedio de Terrenos / Usuario</p>
            <p className="text-4xl font-bold text-orange-600">{stats.averages?.terrainsPerUser || 0}</p>
          </div>
          <MapPin className="w-12 h-12 text-orange-200" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-purple-50 to-blue-50 border border-blue-100 rounded-xl p-6 flex items-center justify-between"
        >
          <div>
            <p className="text-blue-800 font-medium mb-1">Promedio de Consultas / Usuario</p>
            <p className="text-4xl font-bold text-blue-600">{stats.averages?.queriesPerUser || 0}</p>
          </div>
          <Search className="w-12 h-12 text-blue-200" />
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <SimpleBarChart 
          title="Nuevos Usuarios Registrados por Mes" 
          data={stats.usersRegisteredByMonth} 
          colorClass="bg-green-300 group-hover:bg-green-500"
        />
      </motion.div>

    </motion.div>
  );
}
