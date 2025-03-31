import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Button from '../components/Buttons/Button';

const TractorDetail = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState(null);
  const [activeTab, setActiveTab] = useState('identificacion');

  // En un proyecto real, esta información vendría de una API
  useEffect(() => {
    // Simulación de carga de datos
    setTimeout(() => {
      // Datos de muestra actualizados según los nuevos requerimientos
      const mockData = {
        tractor: {
          id: '1',
          title: 'New Holland 8670',
          category: 'Tractor',
          imageSrc: '/src/assets/img/1.png',
          imageGallery: [
            '/src/assets/img/1.png',
            '/src/assets/img/1.png',
            '/src/assets/img/1.png',
          ],
          fichaTecnicaUrl: '/path/to/ficha-tecnica-nh8670.pdf',
          identificacion: {
            nombreComercial: 'New Holland 8670',
            marca: 'New Holland',
            modelo: '8670',
            anoFabricacion: '2020'
          },
          motor: {
            potenciaBruta: '220 HP / 164 kW',
            potenciaTDF: '198 HP / 147 kW',
            aspiracion: 'Turboalimentado con intercooler'
          },
          dimensiones: {
            longitudTotal: '5200 mm',
            anchura: '2540 mm',
            altura: '3100 mm',
            peso: '8500 kg'
          }
        },
        maquina: {
          id: '2',
          title: 'Arado de vértebras 975',
          category: 'Máquina',
          imageSrc: '/src/assets/img/2.png',
          imageGallery: [
            '/src/assets/img/2.png',
            '/src/assets/img/2.png',
            '/src/assets/img/2.png',
          ],
          fichaTecnicaUrl: '/path/to/ficha-tecnica-arado975.pdf',
          identificacion: {
            nombreComercial: 'Arado de vértebras 975',
            marca: 'TecnoAgro',
            modelo: '975',
            anoFabricacion: '2022'
          },
          dimensiones: {
            longitudTotal: '3500 mm',
            anchura: '2100 mm',
            altura: '1200 mm',
            peso: '1250 kg'
          },
          especificacionesTecnicas: {
            anchoDeTrabajo: '3.5 m',
            numeroDeCuerpos: '5',
            profundidadTrabajo: '30-45 cm',
            requerimientoPotencia: '90-120 HP'
          }
        }
      };

      // Determinar si es un tractor o una máquina según el ID
      const itemData = id === '1' ? mockData.tractor : mockData.maquina;
      setItem(itemData);
      setLoading(false);
    }, 800);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-800 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg">Cargando información...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-800">Item no encontrado</h1>
          <Button 
            variant="primary" 
            color="#9f0712" 
            to="/"
            className="mt-4"
          >
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  // Determinar las pestañas disponibles según el tipo de equipo
  const getTabs = () => {
    const tabs = ['identificacion', 'dimensiones'];
    
    if (item.category === 'Tractor') {
      tabs.push('motor');
    } else if (item.category === 'Máquina') {
      tabs.push('especificacionesTecnicas');
    }
    
    return tabs;
  };

  const tabNames = {
    identificacion: 'Datos de Identificación',
    motor: 'Especificaciones de Motor',
    dimensiones: 'Dimensiones y Peso',
    especificacionesTecnicas: 'Especificaciones Técnicas'
  };

  return (
    <div className="bg-gray-100 min-h-screen pb-12">
      {/* Hero Section */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
              <h1 className="text-3xl md:text-4xl font-bold text-red-800 mb-4">{item.title}</h1>
              <div className="w-24 h-1 bg-red-800 mb-6"></div>
              <p className="text-gray-700 mb-6 text-lg">
                {item.category === 'Tractor' 
                  ? `Tractor ${item.identificacion.marca} ${item.identificacion.modelo}, fabricado en ${item.identificacion.anoFabricacion}.` 
                  : `${item.identificacion.nombreComercial}, fabricado por ${item.identificacion.marca} en ${item.identificacion.anoFabricacion}.`}
              </p>
              <div className="flex space-x-4">
                <Button
                  variant="primary"
                  color="#9f0712"
                  href={item.fichaTecnicaUrl}
                  download
                >
                  Descargar ficha técnica
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="bg-gray-100 rounded-lg overflow-hidden shadow-lg">
                <img 
                  src={item.imageSrc} 
                  alt={item.title} 
                  className="w-full h-auto object-contain aspect-video"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto px-4 mt-8">
        <div className="border-b border-gray-200">
          <nav className="flex flex-wrap -mb-px">
            {getTabs().map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm sm:text-base transition-colors duration-200 ${
                  activeTab === tab
                    ? 'border-red-800 text-red-800'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tabNames[tab]}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="py-6">
          {activeTab === 'identificacion' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-red-800 mb-6">Datos de Identificación</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                {Object.entries(item.identificacion).map(([key, value]) => (
                  <div key={key} className="border-b border-gray-200 pb-2">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700 capitalize">
                        {key === 'nombreComercial' ? 'Nombre Comercial' : 
                         key === 'anoFabricacion' ? 'Año de Fabricación' : 
                         key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="text-gray-900">{value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'motor' && item.motor && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-red-800 mb-6">Especificaciones de Motor</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                {Object.entries(item.motor).map(([key, value]) => (
                  <div key={key} className="border-b border-gray-200 pb-2">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700 capitalize">
                        {key === 'potenciaBruta' ? 'Potencia Bruta (HP/kW)' : 
                         key === 'potenciaTDF' ? 'Potencia en la TDF (HP/kW)' : 
                         key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="text-gray-900">{value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'dimensiones' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-red-800 mb-6">Dimensiones y Peso</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                {Object.entries(item.dimensiones).map(([key, value]) => (
                  <div key={key} className="border-b border-gray-200 pb-2">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700 capitalize">
                        {key === 'longitudTotal' ? 'Longitud Total (mm)' : 
                         key === 'anchura' ? 'Anchura (mm)' : 
                         key === 'altura' ? 'Altura (mm)' : 
                         key === 'peso' ? 'Peso (kg)' : 
                         key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="text-gray-900">{value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'especificacionesTecnicas' && item.especificacionesTecnicas && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-red-800 mb-6">Especificaciones Técnicas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                {Object.entries(item.especificacionesTecnicas).map(([key, value]) => (
                  <div key={key} className="border-b border-gray-200 pb-2">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700 capitalize">
                        {key === 'anchoDeTrabajo' ? 'Ancho de Trabajo' : 
                         key === 'numeroDeCuerpos' ? 'Número de Cuerpos' : 
                         key === 'profundidadTrabajo' ? 'Profundidad de Trabajo' :
                         key === 'requerimientoPotencia' ? 'Requerimiento de Potencia' :
                         key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="text-gray-900">{value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TractorDetail;