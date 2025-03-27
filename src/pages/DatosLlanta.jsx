import React from "react";
import { useNavigate } from "react-router-dom";
import Llanta from "../assets/img/LLANTAS-BKT-12-5.png";

export default function DatosLlanta() {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    // Aquí puedes agregar cualquier lógica adicional antes de la navegación
    navigate("/DatosClimaticos"); // Reemplaza "/ruta-destino" con la ruta a la que quieres navegar
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="bg-white p-4 sm:p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-8">Datos de la llanta</h1>
        <div className="flex flex-col sm:flex-row">
          <div className="w-full sm:w-1/2 mb-4 sm:mb-0">
            <img 
              src={Llanta}
              alt="Imagen de la llanta" 
              className="w-full h-auto rounded-lg"
            />
          </div>
          <div className="w-full sm:w-1/2 sm:pl-8">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-gray-700">Diámetro de la llanta</label>
                <input 
                  type="text" 
                  placeholder="Ingrese el diámetro" 
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-gray-700">Presión de inflado</label>
                <input 
                  type="text" 
                  placeholder="Ingrese la presión" 
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-gray-700">Tipo de suelo</label>
                <select 
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">Seleccione una opción</option>
                  <option value="item1">Item 1</option>
                  <option value="item2">Item 2</option>
                  <option value="item3">Item 3</option>
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