import React, { useState, useEffect } from 'react';
import Button from "../components/ui/buttons/Button";
import Pagination from "../components/common/Pagination";
import {
  SearchIcon,
  FilterIcon,
  PlusIcon,
  EditIcon,
  DeleteIcon,
  FileIcon,
  ExternalLinkIcon
} from "../components/ui/Icons";

const TractorCRUD = () => {
  // Estados para el CRUD
  const [tractores, setTractores] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [itemsPorPagina] = useState(10);
  const [busqueda, setBusqueda] = useState('');
  const [ordenamiento, setOrdenamiento] = useState('nombre_asc');
  const [filtros, setFiltros] = useState({
    marca: '',
    anio: '',
    turbo: ''
  });
  const [cargando, setCargando] = useState(false);
  const [errorCarga, setErrorCarga] = useState('');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalConfirmacionAbierto, setModalConfirmacionAbierto] = useState(false);
  const [tractorAEliminar, setTractorAEliminar] = useState(null);
  const [tractorActual, setTractorActual] = useState({
    nombre: '',
    marca: '',
    modelo: '',
    anioFabricacion: '',
    potenciaBruta: '',
    potenciaTDF: '',
    aspiracion: 'Atmosférico',
    longitud: '',
    anchura: '',
    altura: '',
    peso: '',
    fichaTecnica: ''
  });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [archivo, setArchivo] = useState(null);

  // Datos de ejemplo (en una aplicación real, estos vendrían de una API)
  useEffect(() => {
    const cargarTractores = async () => {
      setCargando(true);
      setErrorCarga('');

      try {
        // Simulación de carga de API
        const tractoresEjemplo = [
          {
            id: 1,
            nombre: 'New Holland 8670',
            marca: 'New Holland',
            modelo: '8670',
            anioFabricacion: '2023',
            potenciaBruta: '290',
            potenciaTDF: '270',
            aspiracion: 'Turboalimentado',
            longitud: '4500',
            anchura: '2100',
            altura: '3200',
            peso: '8500',
            fichaTecnica: 'https://ejemplo.com/ficha/nh8670.pdf'
          },
          {
            id: 2,
            nombre: 'John Deere 5090E',
            marca: 'John Deere',
            modelo: '5090E',
            anioFabricacion: '2022',
            potenciaBruta: '90',
            potenciaTDF: '75',
            aspiracion: 'Atmosférico',
            longitud: '3800',
            anchura: '1800',
            altura: '2600',
            peso: '3200',
            fichaTecnica: 'https://ejemplo.com/ficha/jd5090e.pdf'
          },
          {
            id: 3,
            nombre: 'Ford 4610',
            marca: 'Ford',
            modelo: '4610',
            anioFabricacion: '1995',
            potenciaBruta: '63',
            potenciaTDF: '54',
            aspiracion: 'Atmosférico',
            longitud: '3500',
            anchura: '1700',
            altura: '2400',
            peso: '2800',
            fichaTecnica: '/fichas/ford4610.pdf'
          }
        ];

        setTractores(tractoresEjemplo);
      } catch {
        setErrorCarga('No se pudieron cargar los tractores. Intenta nuevamente.');
      } finally {
        setCargando(false);
      }
    };

    cargarTractores();
  }, []);

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, filtros, ordenamiento]);

  // Funciones para el CRUD
  const abrirModal = (tractor = null) => {
    if (tractor) {
      setTractorActual(tractor);
      setModoEdicion(true);
    } else {
      setTractorActual({
        nombre: '',
        marca: '',
        modelo: '',
        anioFabricacion: '',
        potenciaBruta: '',
        potenciaTDF: '',
        aspiracion: 'Atmosférico',
        longitud: '',
        anchura: '',
        altura: '',
        peso: '',
        fichaTecnica: ''
      });
      setModoEdicion(false);
    }
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setArchivo(null);
  };

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setTractorActual({
      ...tractorActual,
      [name]: value
    });
  };

  const manejarCambioArchivo = (e) => {
    setArchivo(e.target.files[0]);
    // En una aplicación real, aquí se haría el manejo del archivo
    if (e.target.files[0]) {
      // Simulación de URL para el archivo subido
      setTractorActual({
        ...tractorActual,
        fichaTecnica: `/fichas/${e.target.files[0].name}`
      });
    }
  };

  const guardarTractor = () => {
    // Validación básica
    if (!tractorActual.nombre || !tractorActual.marca || !tractorActual.modelo) {
      alert('Los campos Nombre, Marca y Modelo son obligatorios');
      return;
    }

    if (modoEdicion) {
      // Actualizar tractor existente
      const tractoresActualizados = tractores.map(tractor => 
        tractor.id === tractorActual.id ? tractorActual : tractor
      );
      setTractores(tractoresActualizados);
    } else {
      // Crear nuevo tractor
      const nuevoTractor = {
        ...tractorActual,
        id: tractores.length > 0 ? Math.max(...tractores.map(t => t.id)) + 1 : 1
      };
      setTractores([...tractores, nuevoTractor]);
    }

    // En una aplicación real, aquí se enviarían los datos a la API
    cerrarModal();
  };

  const abrirConfirmacionEliminacion = (tractor) => {
    setTractorAEliminar(tractor);
    setModalConfirmacionAbierto(true);
  };

  const cerrarConfirmacionEliminacion = () => {
    setModalConfirmacionAbierto(false);
    setTractorAEliminar(null);
  };

  const confirmarEliminacionTractor = () => {
    if (!tractorAEliminar) {
      return;
    }

    const tractoresActualizados = tractores.filter(tractor => tractor.id !== tractorAEliminar.id);
    setTractores(tractoresActualizados);
    cerrarConfirmacionEliminacion();
    // En una aplicación real, aquí se enviaría la petición a la API
  };

  const ordenarTractores = (lista) => {
    const listaOrdenada = [...lista];

    switch (ordenamiento) {
      case 'nombre_desc':
        return listaOrdenada.sort((a, b) => b.nombre.localeCompare(a.nombre));
      case 'anio_desc':
        return listaOrdenada.sort((a, b) => Number(b.anioFabricacion || 0) - Number(a.anioFabricacion || 0));
      case 'anio_asc':
        return listaOrdenada.sort((a, b) => Number(a.anioFabricacion || 0) - Number(b.anioFabricacion || 0));
      case 'potencia_desc':
        return listaOrdenada.sort((a, b) => Number(b.potenciaBruta || 0) - Number(a.potenciaBruta || 0));
      case 'potencia_asc':
        return listaOrdenada.sort((a, b) => Number(a.potenciaBruta || 0) - Number(b.potenciaBruta || 0));
      case 'nombre_asc':
      default:
        return listaOrdenada.sort((a, b) => a.nombre.localeCompare(b.nombre));
    }
  };

  // Función para filtrar tractores
  const tractoresFiltrados = tractores.filter(tractor => {
    const coincideBusqueda = 
      tractor.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      tractor.marca.toLowerCase().includes(busqueda.toLowerCase()) ||
      tractor.modelo.toLowerCase().includes(busqueda.toLowerCase());
    
    const coincideFiltroMarca = filtros.marca ? tractor.marca === filtros.marca : true;
    const coincideFiltroAnio = filtros.anio ? tractor.anioFabricacion === filtros.anio : true;
    const coincideFiltroTurbo = filtros.turbo ? tractor.aspiracion === filtros.turbo : true;

    return coincideBusqueda && coincideFiltroMarca && coincideFiltroAnio && coincideFiltroTurbo;
  });

  const tractoresOrdenados = ordenarTractores(tractoresFiltrados);

  // Paginación
  const totalPaginas = Math.max(1, Math.ceil(tractoresOrdenados.length / itemsPorPagina));
  const indiceUltimoItem = paginaActual * itemsPorPagina;
  const indicePrimerItem = indiceUltimoItem - itemsPorPagina;
  const itemsActuales = tractoresOrdenados.slice(indicePrimerItem, indiceUltimoItem);

  const cambiarPagina = (numeroPagina) => {
    if (numeroPagina < 1 || numeroPagina > totalPaginas) {
      return;
    }
    setPaginaActual(numeroPagina);
  };

  // Opciones para selectores
  const marcasUnicas = [...new Set(tractores.map(t => t.marca))];
  const aniosUnicos = [...new Set(tractores.map(t => t.anioFabricacion))];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-red-800 mb-4 md:mb-0">Gestión de Tractores</h1>
        
        <Button
          variant="primary"
          color="#991b1b"
          onClick={() => abrirModal()}
          className="flex items-center"
        >
          <PlusIcon size="small" /> <span className="ml-2">Agregar Tractor</span>
        </Button>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon size="small" className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-red-800"
              placeholder="Buscar por nombre, marca o modelo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <div className="w-full md:w-64">
            <select
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-red-800 focus:border-red-800"
              value={ordenamiento}
              onChange={(e) => setOrdenamiento(e.target.value)}
            >
              <option value="nombre_asc">Ordenar por nombre (A-Z)</option>
              <option value="nombre_desc">Ordenar por nombre (Z-A)</option>
              <option value="anio_desc">Año más reciente</option>
              <option value="anio_asc">Año más antiguo</option>
              <option value="potencia_desc">Mayor potencia</option>
              <option value="potencia_asc">Menor potencia</option>
            </select>
          </div>
          <Button
            variant="outline"
            color="#6B7280"
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className="flex items-center"
          >
            <FilterIcon size="small" className="mr-2" /> Filtros
          </Button>
        </div>

        {/* Panel de filtros desplegable */}
        {mostrarFiltros && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
              <select
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-red-800 focus:border-red-800"
                value={filtros.marca}
                onChange={(e) => setFiltros({...filtros, marca: e.target.value})}
              >
                <option value="">Todas las marcas</option>
                {marcasUnicas.map((marca, index) => (
                  <option key={index} value={marca}>{marca}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Año de fabricación</label>
              <select
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-red-800 focus:border-red-800"
                value={filtros.anio}
                onChange={(e) => setFiltros({...filtros, anio: e.target.value})}
              >
                <option value="">Todos los años</option>
                {aniosUnicos.map((anio, index) => (
                  <option key={index} value={anio}>{anio}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Aspiración</label>
              <select
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-red-800 focus:border-red-800"
                value={filtros.turbo}
                onChange={(e) => setFiltros({...filtros, turbo: e.target.value})}
              >
                <option value="">Todas</option>
                <option value="Turboalimentado">Turboalimentado</option>
                <option value="Atmosférico">Atmosférico</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Tabla de tractores */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="overflow-x-auto">
          {cargando ? (
            <div className="px-6 py-10 text-center text-sm text-gray-500">
              Cargando tractores...
            </div>
          ) : errorCarga ? (
            <div className="px-6 py-10 text-center text-sm text-red-700">
              {errorCarga}
            </div>
          ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marca / Modelo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Año
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Potencia
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aspiración
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ficha
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {itemsActuales.length > 0 ? (
                itemsActuales.map((tractor) => (
                  <tr key={tractor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{tractor.nombre}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{tractor.marca}</div>
                      <div className="text-sm text-gray-500">{tractor.modelo}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {tractor.anioFabricacion}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{tractor.potenciaBruta} HP</div>
                      <div className="text-sm text-gray-500">TDF: {tractor.potenciaTDF} HP</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        tractor.aspiracion === 'Turboalimentado' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {tractor.aspiracion}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {tractor.fichaTecnica && (
                        <Button
                          href={tractor.fichaTecnica}
                          variant="text"
                          color="#991b1b"
                          className="flex items-center"
                          textColor="#991b1b"
                        >
                          <FileIcon size="small" className="mr-1" /> 
                          <ExternalLinkIcon size="small" className="ml-1 text-xs" />
                        </Button>
                      )}
                    </td>
                    <td className="px-1 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="text"
                          color="#2563EB"
                          onClick={() => abrirModal(tractor)}
                          title="Editar"
                        >
                          <EditIcon size="small" />
                        </Button>
                        <Button
                          variant="text"
                          color="#DC2626"
                          onClick={() => abrirConfirmacionEliminacion(tractor)}
                          title="Eliminar"
                        >
                          <DeleteIcon size="small" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                    {tractores.length === 0 ? (
                      <div className="space-y-3">
                        <p>No hay tractores registrados.</p>
                        <Button
                          variant="primary"
                          color="#991b1b"
                          onClick={() => abrirModal()}
                          className="inline-flex items-center"
                        >
                          <PlusIcon size="small" /> <span className="ml-2">Añadir Tractor</span>
                        </Button>
                      </div>
                    ) : (
                      'No se encontraron tractores con los criterios seleccionados'
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          )}
        </div>
      </div>

      {/* Paginación */}
      <Pagination
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        onCambiarPagina={cambiarPagina}
      />

      {/* Modal para crear/editar tractor */}
      {modalAbierto && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            {/* Modal content */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      {modoEdicion ? 'Editar Tractor' : 'Añadir Tractor'}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Columna izquierda */}
                      <div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre*
                          </label>
                          <input
                            type="text"
                            name="nombre"
                            value={tractorActual.nombre}
                            onChange={manejarCambio}
                            className="mt-1 focus:ring-red-800 focus:border-red-800 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            required
                          />
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Marca*
                          </label>
                          <input
                            type="text"
                            name="marca"
                            value={tractorActual.marca}
                            onChange={manejarCambio}
                            className="mt-1 focus:ring-red-800 focus:border-red-800 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            required
                          />
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Modelo*
                          </label>
                          <input
                            type="text"
                            name="modelo"
                            value={tractorActual.modelo}
                            onChange={manejarCambio}
                            className="mt-1 focus:ring-red-800 focus:border-red-800 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            required
                          />
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Año de fabricación
                          </label>
                          <input
                            type="number"
                            name="anioFabricacion"
                            value={tractorActual.anioFabricacion}
                            onChange={manejarCambio}
                            className="mt-1 focus:ring-red-800 focus:border-red-800 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Potencia bruta (HP)
                          </label>
                          <input
                            type="number"
                            name="potenciaBruta"
                            value={tractorActual.potenciaBruta}
                            onChange={manejarCambio}
                            className="mt-1 focus:ring-red-800 focus:border-red-800 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Potencia TDF (HP)
                          </label>
                          <input
                            type="number"
                            name="potenciaTDF"
                            value={tractorActual.potenciaTDF}
                            onChange={manejarCambio}
                            className="mt-1 focus:ring-red-800 focus:border-red-800 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                      
                      {/* Columna derecha */}
                      <div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Aspiración
                          </label>
                          <select
                            name="aspiracion"
                            value={tractorActual.aspiracion}
                            onChange={manejarCambio}
                            className="mt-1 focus:ring-red-800 focus:border-red-800 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          >
                            <option value="Atmosférico">Atmosférico</option>
                            <option value="Turboalimentado">Turboalimentado</option>
                          </select>
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Longitud (mm)
                          </label>
                          <input
                            type="number"
                            name="longitud"
                            value={tractorActual.longitud}
                            onChange={manejarCambio}
                            className="mt-1 focus:ring-red-800 focus:border-red-800 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Anchura (mm)
                          </label>
                          <input
                            type="number"
                            name="anchura"
                            value={tractorActual.anchura}
                            onChange={manejarCambio}
                            className="mt-1 focus:ring-red-800 focus:border-red-800 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Altura (mm)
                          </label>
                          <input
                            type="number"
                            name="altura"
                            value={tractorActual.altura}
                            onChange={manejarCambio}
                            className="mt-1 focus:ring-red-800 focus:border-red-800 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Peso (kg)
                          </label>
                          <input
                            type="number"
                            name="peso"
                            value={tractorActual.peso}
                            onChange={manejarCambio}
                            className="mt-1 focus:ring-red-800 focus:border-red-800 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ficha Técnica
                          </label>
                          <div className="flex items-center">
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={manejarCambioArchivo}
                              className="hidden"
                              id="fichaTecnica"
                            />
                            <input
                              type="text"
                              name="fichaTecnica"
                              value={tractorActual.fichaTecnica}
                              onChange={manejarCambio}
                              placeholder="URL o ruta del archivo"
                              className="mt-1 focus:ring-red-800 focus:border-red-800 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                            <label
                              htmlFor="fichaTecnica"
                              className="ml-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-800"
                            >
                              <FileIcon size="small" className="mr-2" />
                              Subir
                            </label>
                          </div>
                          {archivo && (
                            <p className="mt-1 text-sm text-gray-500">
                              Archivo seleccionado: {archivo.name}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button
                  variant="primary"
                  color="#991b1b"
                  onClick={guardarTractor}
                  className="w-full sm:w-auto sm:ml-3"
                >
                  {modoEdicion ? 'Actualizar Tractor' : 'Crear Tractor'}
                </Button>
                <Button
                  variant="outline"
                  color="#6B7280"
                  onClick={cerrarModal}
                  className="mt-3 w-full sm:mt-0 sm:ml-3 sm:w-auto"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar */}
      {modalConfirmacionAbierto && tractorAEliminar && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                  Confirmar eliminación
                </h3>
                <p className="text-sm text-gray-600">
                  ¿Está seguro de eliminar el tractor <span className="font-semibold">{tractorAEliminar.nombre}</span>?
                </p>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button
                  variant="primary"
                  color="#DC2626"
                  onClick={confirmarEliminacionTractor}
                  className="w-full sm:w-auto sm:ml-3"
                >
                  Eliminar Tractor
                </Button>
                <Button
                  variant="outline"
                  color="#6B7280"
                  onClick={cerrarConfirmacionEliminacion}
                  className="mt-3 w-full sm:mt-0 sm:w-auto"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje de resultados y total */}
      <div className="mt-4 text-gray-600 text-sm flex flex-col sm:flex-row justify-between items-center">
        <div>
          Mostrando {itemsActuales.length} de {tractoresOrdenados.length} tractores
        </div>
        <div className="mt-2 sm:mt-0">
          Total de tractores registrados: {tractores.length}
        </div>
      </div>
    </div>
  );
};

export default TractorCRUD;