import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/buttons/Button';
import TooltipInfo from '../components/ui/buttons/ToolTipInfo';
import Maquina from '../assets/img/2.png';
import { getImplements } from '../services/implementApi';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";

// ---------------------------------------------------------------------------
// Constantes
// ---------------------------------------------------------------------------

const TIPOS_IMPLEMENTO = [
  { value: 'plow',       label: 'Arado (Plow)' },
  { value: 'harrow',     label: 'Rastra (Harrow)' },
  { value: 'seeder',     label: 'Sembradora (Seeder)' },
  { value: 'sprayer',    label: 'Aspersora (Sprayer)' },
  { value: 'harvester',  label: 'Cosechadora (Harvester)' },
  { value: 'cultivator', label: 'Cultivador' },
  { value: 'mower',      label: 'Segadora (Mower)' },
  { value: 'trailer',    label: 'Remolque (Trailer)' },
  { value: 'other',      label: 'Otro' },
];

const ESTADO_INICIAL = {
  implement_type:    '',
  working_width_m:   '',
  working_depth_cm:  '',
  weight_kg:         '',
};

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

export default function DatosImplemento() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('implemento_datos');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          implement_type: parsed.implement_type || '',
          working_width_m: parsed.working_width_m || '',
          working_depth_cm: parsed.working_depth_cm || '',
          weight_kg: parsed.weight_kg || '',
        };
      } catch (e) {
        // Fallback en caso de error
      }
    }
    return ESTADO_INICIAL;
  });

  const [errors, setErrors] = useState({});
  const [implementosCatalogo, setImplementosCatalogo] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [imagenImplemento, setImagenImplemento] = useState(() => {
    return localStorage.getItem('implemento_imagen') || Maquina;
  });

  useEffect(() => {
    const fetchImplementos = async () => {
      try {
        const response = await getImplements({ limit: 100 });
        if (response.success && response.data) {
          setImplementosCatalogo(response.data);
        }
      } catch (error) {
        console.error("Error al cargar implementos del catálogo:", error);
      }
    };
    fetchImplementos();
  }, []);

  const handleImplementoSelect = (implemento) => {
    if (implemento) {
      // Normalizamos el tipo de implemento para que coincida con las opciones del select
      let implType = implemento.implementType ? implemento.implementType.toLowerCase() : "";
      
      setFormData({
        implement_type: implType,
        working_width_m: implemento.workingWidthM || "",
        working_depth_cm: implemento.workingDepthCm || "",
        weight_kg: implemento.weightKg || "",
      });
      
      const implImage = implemento.image || implemento.imageUrl || implemento.image_url || (implemento.images && implemento.images[0]) || Maquina;
      setImagenImplemento(implImage);
      localStorage.setItem('implemento_imagen', implImage);
      
      setErrors({});
      setIsModalOpen(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validar = () => {
    const nuevosErrores = {};
    if (!formData.implement_type)
      nuevosErrores.implement_type = 'Selecciona el tipo de implemento.';
    if (!formData.working_width_m || Number(formData.working_width_m) <= 0)
      nuevosErrores.working_width_m = 'Ingresa un ancho de trabajo válido.';
    if (!formData.working_depth_cm || Number(formData.working_depth_cm) <= 0)
      nuevosErrores.working_depth_cm = 'Ingresa una profundidad de trabajo válida.';
    if (!formData.weight_kg || Number(formData.weight_kg) <= 0)
      nuevosErrores.weight_kg = 'Ingresa el peso del implemento.';
    return nuevosErrores;
  };

  const guardarDatos = () => {
    localStorage.setItem('implemento_datos', JSON.stringify({
      implement_type:   formData.implement_type,
      working_width_m:  Number(formData.working_width_m) || formData.working_width_m,
      working_depth_cm: Number(formData.working_depth_cm) || formData.working_depth_cm,
      weight_kg:        Number(formData.weight_kg) || formData.weight_kg,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const erroresValidacion = validar();

    if (Object.keys(erroresValidacion).length > 0) {
      setErrors(erroresValidacion);
      return;
    }

    guardarDatos();
    navigate('/TipoSueloImplemento');
  };

  const inputBase =
    'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#991b1b] transition-colors';

  const inputClass = (field) =>
    `${inputBase} ${errors[field] ? 'border-red-500' : 'border-gray-300'}`;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-4xl">

        {/* ── Indicador de pasos ── */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#991b1b] text-white text-sm font-bold">1</span>
          <div className="w-12 h-0.5 bg-gray-300" />
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-500 text-sm font-bold">2</span>
          <div className="w-12 h-0.5 bg-gray-300" />
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-500 text-sm font-bold">3</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-gray-800">
          Datos del implemento
        </h1>

        <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8">

          {/* ── Lado izquierdo: Imagen y Botón del Catálogo ── */}
          <div className="w-full md:w-1/2 flex flex-col items-center">
            <img 
              src={imagenImplemento} 
              alt="Modelo de implemento" 
              className="w-full max-w-[350px] h-auto rounded-lg shadow-sm border border-gray-100 object-contain bg-white"
            />
            <div className="mt-6 w-full flex justify-center">
              <Button
                type="button"
                variant="outline"
                color="#991b1b"
                className="w-full max-w-[300px] border-[#991b1b] text-[#991b1b] hover:bg-red-50 font-semibold"
                onClick={() => setIsModalOpen(true)}
              >
                Buscar en Catálogo
              </Button>
            </div>
          </div>

          {/* ── Lado derecho: Formulario ── */}
          <div className="w-full md:w-1/2">
            <form className="space-y-5" onSubmit={handleSubmit} noValidate>

              {/* Tipo de implemento */}
              <div>
                <label htmlFor="implement_type" className="block text-gray-700 font-medium mb-1">
                  Tipo de implemento
                  <TooltipInfo content="Categoría del implemento agrícola que posees (ej. arado, rastra, sembradora)." />
                </label>
                <select
                  id="implement_type"
                  name="implement_type"
                  value={formData.implement_type}
                  onChange={handleChange}
                  className={inputClass('implement_type')}
                >
                  <option value="">Seleccione una opción</option>
                  {TIPOS_IMPLEMENTO.map((tipo) => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </option>
                  ))}
                </select>
                {errors.implement_type && (
                  <p className="mt-1 text-sm text-red-600">{errors.implement_type}</p>
                )}
              </div>

              {/* Ancho de trabajo */}
              <div>
                <label htmlFor="working_width_m" className="block text-gray-700 font-medium mb-1">
                  Ancho de trabajo
                  <TooltipInfo content="Ancho de la franja que cubre el implemento en cada pasada, expresado en metros (m)." />
                </label>
                <input
                  id="working_width_m"
                  name="working_width_m"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="Valor en metros (m)"
                  value={formData.working_width_m}
                  onChange={handleChange}
                  className={inputClass('working_width_m')}
                />
                {errors.working_width_m && (
                  <p className="mt-1 text-sm text-red-600">{errors.working_width_m}</p>
                )}
              </div>

              {/* Profundidad de trabajo */}
              <div>
                <label htmlFor="working_depth_cm" className="block text-gray-700 font-medium mb-1">
                  Profundidad de trabajo
                  <TooltipInfo content="Profundidad máxima a la que opera el implemento en el suelo, en centímetros (cm)." />
                </label>
                <input
                  id="working_depth_cm"
                  name="working_depth_cm"
                  type="number"
                  step="1"
                  min="0"
                  placeholder="Valor en centímetros (cm)"
                  value={formData.working_depth_cm}
                  onChange={handleChange}
                  className={inputClass('working_depth_cm')}
                />
                {errors.working_depth_cm && (
                  <p className="mt-1 text-sm text-red-600">{errors.working_depth_cm}</p>
                )}
              </div>

              {/* Peso del implemento */}
              <div>
                <label htmlFor="weight_kg" className="block text-gray-700 font-medium mb-1">
                  Peso del implemento
                  <TooltipInfo content="Peso total del implemento en kilogramos (kg). Influye en el cálculo de la fuerza de tracción necesaria." />
                </label>
                <input
                  id="weight_kg"
                  name="weight_kg"
                  type="number"
                  step="1"
                  min="0"
                  placeholder="Valor en kilogramos (kg)"
                  value={formData.weight_kg}
                  onChange={handleChange}
                  className={inputClass('weight_kg')}
                />
                {errors.weight_kg && (
                  <p className="mt-1 text-sm text-red-600">{errors.weight_kg}</p>
                )}
              </div>

              {/* ── Botones de navegación ── */}
              <div className="flex justify-end gap-3 pt-4">
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

      {/* Modal del Catálogo */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-4xl md:max-w-5xl lg:max-w-6xl w-[95vw] max-h-[85vh] overflow-hidden flex flex-col p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">Catálogo de Implementos</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto mt-4 pr-2">
            {implementosCatalogo.length === 0 ? (
              <div className="text-center py-8 text-gray-500">Cargando implementos...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {implementosCatalogo.map((impl) => (
                  <div 
                    key={impl.implementId} 
                    className="border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-[#991b1b] hover:shadow-md transition-all flex flex-col bg-white"
                    onClick={() => handleImplementoSelect(impl)}
                  >
                    <div className="h-32 mb-4 w-full flex items-center justify-center bg-gray-50 rounded-lg p-2">
                      <img 
                        src={impl.image || impl.imageUrl || impl.image_url || (impl.images && impl.images[0]) || Maquina} 
                        alt={impl.implementName} 
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1">{impl.brand}</h3>
                      <p className="text-gray-600 font-medium">{impl.implementName}</p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                      <span className="bg-red-50 text-[#991b1b] text-sm font-semibold px-2 py-1 rounded">
                        {impl.powerRequirementHp} HP Req.
                      </span>
                      <span className="text-gray-500 text-sm">
                        {impl.weightKg} kg
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
