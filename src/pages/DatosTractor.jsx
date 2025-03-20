import React from "react";
import { useNavigate } from "react-router-dom";
import Tractor from "../assets/img/Tractor Prueva.webp";

export default function DatosTractor() {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    // Aquí puedes agregar cualquier lógica adicional antes de la navegación
    navigate("/DatosLlantas"); // Reemplaza "/ruta-destino" con la ruta a la que quieres navegar
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-8">Datos del tractor</h1>
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2">
            <img 
              src={Tractor} 
              alt="Imagen del tractor" 
              className="w-full h-auto rounded-lg"
            />
          </div>
          <div className="w-full md:w-1/2 md:pl-8 mt-8 md:mt-0">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-gray-700">Pb</label>
                <input 
                  type="text" 
                  placeholder="Ingrese el Pb" 
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-gray-700">Pmax(tdp)</label>
                <input 
                  type="text" 
                  placeholder="Ingrese el Pmax" 
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-gray-700">Peso</label>
                <input 
                  type="text" 
                  placeholder="Ingrese el peso del tractor" 
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-gray-700">Turbo</label>
                <select 
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">Seleccione una opción</option>
                  <option value="si">Sí</option>
                  <option value="no">No</option>
                </select>
              </div>
              <div className="text-right">
                <button 
                  type="submit" 
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
                >
                  SIGUIENTE
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}