import React from "react";
import { useNavigate } from "react-router-dom";
import Llanta from "../assets/img/Llanta.jpeg";
import Button from "../components/ui/buttons/Button";
import TooltipInfo from "../components/ui/buttons/ToolTipInfo";

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
                <label htmlFor="diametro-llanta" className="block text-gray-700">
                  Diámetro de la llanta
                  <TooltipInfo content="Diámetro de la llanta en pulgadas" />
                </label>
                <input 
                  id="diametro-llanta"
                  type="text" 
                  placeholder="Valor en pulgadas" 
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label htmlFor="presion-inflado" className="block text-gray-700">
                  Presión de inflado
                  <TooltipInfo content="Presión de inflado recomendada en PSI" />
                </label>
                <input 
                  id="presion-inflado"
                  type="text" 
                  placeholder="Valor en PSI" 
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label htmlFor="tipo-suelo" className="block text-gray-700">
                  Tipo de suelo
                  <TooltipInfo content="Tipo de terreno donde se utilizará el tractor" />
                </label>
                <select 
                  id="tipo-suelo"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">Seleccione una opción</option>
                  <option value="arcilloso">Arcilloso</option>
                  <option value="arenoso">Arenoso</option>
                  <option value="limoso">Limoso</option>
                  <option value="franco">Franco</option>
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