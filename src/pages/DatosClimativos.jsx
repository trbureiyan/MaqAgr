import React from 'react';
import { useNavigate } from 'react-router-dom';
import nube from "../assets/img/nubes.png";

function DatosClimativos() {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    // Aquí puedes agregar cualquier lógica adicional antes de la navegación
    navigate("/Resultados"); // Reemplaza "/ruta-destino" con la ruta a la que quieres navegar
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-8">Datos climáticos</h1>
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 mb-4 md:mb-0">
            <img 
              src={nube}
              alt="Imagen del clima" 
              className="w-full h-auto rounded-lg"
            />
          </div>
          <div className="w-full md:w-1/2 md:pl-8">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700">Altura</label>
                  <input 
                    type="text" 
                    placeholder="Ingrese la altura sobre el nivel del mar" 
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Temperatura ambiente</label>
                  <input 
                    type="text" 
                    placeholder="Ingrese la temperatura" 
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700">Pendiente</label>
                  <input 
                    type="text" 
                    placeholder="Ingrese la pendiente" 
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Patinamiento</label>
                  <input 
                    type="text" 
                    placeholder="Ingrese el patinamiento" 
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
              <div className="text-center mt-8">
                <button 
                  type="submit" 
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
                >
                  CALCULAR
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DatosClimativos;