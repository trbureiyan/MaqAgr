import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconMac, IconTrac } from "../assets/img";
// Reutilizamos el estilo de tarjeta del catálogo o la calculadora
import TractorCard from '../components/ui/cards/TractorCard';

/**
 * AdminDashboard — Panel Administrativo Intermedio
 *
 * Sirve como menú principal para los usuarios autenticados (admin),
 * permitiendo seleccionar qué entidad desean administrar (Tractores o Implementos).
 */
export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] bg-gray-100 flex flex-col items-center py-10 px-4 sm:px-8">
      
      <div className="max-w-3xl w-full text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
          Panel de Administración
        </h1>
        <p className="text-lg text-gray-600">
          Selecciona el módulo que deseas gestionar.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-8 justify-center max-w-4xl w-full">
        
        {/* Opción Tractores */}
        <div 
          className="w-full sm:w-[350px] transition-transform duration-300 hover:scale-105 cursor-pointer"
          onClick={() => navigate('/admin/TractorForm')}
        >
          <TractorCard
            imageSrc={IconTrac}
            title="Gestión de Tractores"
            description="Administra el catálogo de tractores. Añade, edita o elimina registros de la base de datos."
            link="/admin/TractorForm"
          />
        </div>

        {/* Opción Implementos */}
        <div 
          className="w-full sm:w-[350px] transition-transform duration-300 hover:scale-105 cursor-pointer"
          onClick={() => navigate('/admin/ImplementForm')}
        >
          <TractorCard
            imageSrc={IconMac}
            title="Gestión de Implementos"
            description="Administra la maquinaria e implementos acoplables disponibles en el sistema."
            link="/admin/ImplementForm"
          />
        </div>

      </div>

    </div>
  );
}
