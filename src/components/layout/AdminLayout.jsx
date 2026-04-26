import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  BarChart3,
  TrendingUp,
  Users,
  UserCog,
  Tractor,
  Wrench,
} from "lucide-react";

const SidebarItem = ({ to, icon: Icon, label, end = false }) => {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
          isActive
            ? "bg-white shadow-sm text-blue-600"
            : "text-gray-600 hover:bg-gray-100/50 hover:text-gray-900"
        }`
      }
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </NavLink>
  );
};

export default function AdminLayout() {
  return (
    <div className="flex w-full min-h-[calc(100vh-64px)] bg-[#f3f7fb]">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-gray-200 bg-[#edf3f8] flex flex-col p-4 shadow-sm z-10">
        {/* Header / Logo del Admin Panel */}
        <div className="flex items-center gap-3 px-2 py-4 mb-6">
          <span className="text-xl font-bold text-gray-800">
            Panel Administrativo
          </span>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
          {/* Sección: Estadísticas */}
          <div>
            <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-200/60 rounded-md mb-2">
              Estadísticas
            </div>
            <div className="space-y-1">
              <SidebarItem
                to="/admin/stats/general"
                icon={BarChart3}
                label="Generales"
              />
              <SidebarItem
                to="/admin/stats/recommendations"
                icon={TrendingUp}
                label="Recomendaciones"
              />
              <SidebarItem
                to="/admin/stats/users"
                icon={Users}
                label="Métricas de Usuarios"
              />
            </div>
          </div>

          {/* Sección: Gestión */}
          <div>
            <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-200/60 rounded-md mb-2">
              Gestión
            </div>
            <div className="space-y-1">
              <SidebarItem
                to="/admin/users"
                icon={UserCog}
                label="Gestión de Usuarios"
              />
              <SidebarItem
                to="/admin/TractorForm"
                icon={Tractor}
                label="Gestión de Tractores"
              />
              <SidebarItem
                to="/admin/ImplementForm"
                icon={Wrench}
                label="Gestión de Implementos"
              />
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50/50 p-6">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
