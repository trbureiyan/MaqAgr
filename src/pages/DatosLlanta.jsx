import React from "react";
import { useNavigate } from "react-router-dom";
import Llanta from "../assets/img/LLANTAS-BKT-12-5.png";
import Button from "../components/ui/buttons/Button";

export default function DatosLlanta() {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/DatosClimaticos");
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
              {/* Botones de navegación */}
              <div className="text-right space-x-4 flex justify-end">
                <Button
                  variant="outline"
                  color="#991b1b"
                  type="button"
                  onClick={() => navigate(-1)}
                >
                  VOLVER
                </Button>
                <Button
                  variant="primary"
                  color="#991b1b"
                  type="submit"
                >
                  SIGUIENTE
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}