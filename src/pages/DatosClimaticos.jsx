import React from 'react';
import { useNavigate } from 'react-router-dom';
import Nube from "../assets/img/nubes.png";
import Button from "../components/ui/buttons/Button";
import TooltipInfo from "../components/ui/buttons/ToolTipInfo";

function DatosClimativos() {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/Resultados", {
      state: {
        payload: {
          terrainId: 1,
          implementId: 2, 
          workingDepthM: 0.3,
          workType: "tillage"
        }
      }
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-8">Datos climáticos</h1>
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 mb-4 md:mb-0">
            <img 
              src={Nube}
              alt="Imagen del clima" 
              className="w-full h-auto rounded-lg"
            />
          </div>
          <div className="w-full md:w-1/2 md:pl-8">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700">
                    Altura
                    <TooltipInfo content="Altura sobre el nivel del mar en metros" />
                  </label>
                  <input 
                    type="text" 
                    placeholder="Valor en msnm" 
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">
                    Temperatura ambiente
                    <TooltipInfo content="Temperatura promedio en grados Celsius" />
                  </label>
                  <input 
                    type="text" 
                    placeholder="Valor en °C" 
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700">
                    Pendiente
                    <TooltipInfo content="Inclinación del terreno en porcentaje (%)" />
                  </label>
                  <input 
                    type="text" 
                    placeholder="Valor en %" 
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">
                    Patinamiento
                    <TooltipInfo content="Porcentaje estimado de patinamiento de las ruedas" />
                  </label>
                  <input 
                    type="text" 
                    placeholder="Valor en %" 
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
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

export default DatosClimativos;