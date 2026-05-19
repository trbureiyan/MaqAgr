/**
 * @fileoverview Paso 1 del flujo "Tengo Implemento" — datos del implemento.
 *
 * @module pages/DatosImplemento
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TooltipInfo from '../../../components/ui/buttons/ToolTipInfo';
import FieldWithPresets from '../../../components/ui/FieldWithPresets';
import StepIndicator from '../../../components/ui/StepIndicator';
import { getInputClass } from '../../../lib/formUtils';
import {
  ANCHO_TRABAJO_PRESETS, ANCHO_TRABAJO_UNKNOWN_DEFAULT,
  PROFUNDIDAD_PRESETS, PROFUNDIDAD_UNKNOWN_DEFAULT,
  PESO_IMPLEMENTO_PRESETS, PESO_IMPLEMENTO_UNKNOWN_DEFAULT,
} from '../../../lib/fieldPresets';
import Maquina from '../../../assets/img/2.png';
import { getImplements } from '../../../services/implementApi';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { ChevronRight, BookOpen } from 'lucide-react';

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
      } catch (Error_parse) {
        console.error("Error parsing implemento_datos", Error_parse);
      }
    }
    return ESTADO_INICIAL;
  });

  const [errors, setErrors] = useState({});
  const [implementosCatalogo, setImplementosCatalogo] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImplementId, setSelectedImplementId] = useState(() => {
    return localStorage.getItem('implemento_id') || null;
  });
  const [selectedPowerReq, setSelectedPowerReq] = useState(() => {
    const saved = localStorage.getItem('implemento_power_req');
    return saved ? Number(saved) : null;
  });
  
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
      let implType = implemento.implementType ? implemento.implementType.toLowerCase() : "";

      setFormData({
        implement_type: implType,
        working_width_m: implemento.workingWidthM || "",
        working_depth_cm: implemento.workingDepthCm || "",
        weight_kg: implemento.weightKg || "",
      });

      const implId = implemento.implementId || implemento.implement_id || null;
      const implPowerReq = implemento.powerRequirementHp || implemento.power_requirement_hp || null;
      setSelectedImplementId(implId);
      setSelectedPowerReq(implPowerReq);
      localStorage.setItem('implemento_id', implId);
      localStorage.setItem('implemento_power_req', implPowerReq);

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
    const dataToSave = {
      implement_type: formData.implement_type,
      working_width_m: Number(formData.working_width_m) || formData.working_width_m,
      working_depth_cm: Number(formData.working_depth_cm) || formData.working_depth_cm,
      weight_kg: Number(formData.weight_kg) || formData.weight_kg,
    };
    localStorage.setItem('implemento_datos', JSON.stringify(dataToSave));
    return dataToSave;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const erroresValidacion = validar();

    if (Object.keys(erroresValidacion).length > 0) {
      setErrors(erroresValidacion);
      return;
    }

    const implementData = guardarDatos();

    navigate('/TipoSueloImplemento', {
      state: {
        implementData: {
          ...implementData,
          implementId: selectedImplementId,
          powerRequirementHp: selectedPowerReq,
        },
      },
    });
  };

  const inputClass = (field) => getInputClass(field, errors);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-4xl">

        <div className="mb-6 px-1">
          <StepIndicator
            current={1}
            total={3}
            labels={["Implemento", "Suelo", "Resultados"]}
          />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]">

            {/* ── Panel izquierdo: imagen + catálogo ── */}
            <div className="bg-gray-50 border-b md:border-b-0 md:border-r border-gray-100 p-6 flex flex-col items-center gap-5">
              <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-white border border-gray-100 flex items-center justify-center p-3">
                <img 
                  src={imagenImplemento} 
                  alt="Modelo de implemento" 
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="w-full space-y-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-lg border border-[#893d46]/30 text-[#893d46] text-sm font-medium hover:bg-[#893d46]/5 hover:border-[#893d46] transition-all"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Buscar en catálogo
                  </span>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </button>
                <p className="text-xs text-center text-gray-400">
                  Selecciona tu modelo para rellenar los datos automáticamente
                </p>
              </div>
            </div>

            {/* ── Panel derecho: formulario ── */}
            <div className="p-6 md:p-8">
              <div className="mb-6">
                <h1 className="text-xl font-semibold text-gray-900">Datos del implemento</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Ingresa las características de la máquina o encuéntrala en el catálogo.
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit} noValidate>

                {/* Tipo de implemento */}
                <div>
                  <label htmlFor="implement_type" className="text-sm font-medium text-gray-700 leading-none block mb-1.5">
                    Tipo de implemento
                    <TooltipInfo content="Categoría del implemento agrícola que posees." />
                  </label>
                  <select
                    id="implement_type"
                    name="implement_type"
                    value={formData.implement_type}
                    onChange={handleChange}
                    className={inputClass('implement_type')}
                    aria-invalid={Boolean(errors.implement_type)}
                    aria-describedby={errors.implement_type ? 'implement_type-error' : undefined}
                  >
                    <option value="">Seleccione una opción</option>
                    {TIPOS_IMPLEMENTO.map((tipo) => (
                      <option key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </option>
                    ))}
                  </select>
                  {errors.implement_type && (
                    <p id="implement_type-error" className="mt-1.5 text-xs text-red-600" role="alert">
                      {errors.implement_type}
                    </p>
                  )}
                </div>

                <FieldWithPresets
                  id="working_width_m"
                  name="working_width_m"
                  label="Ancho de trabajo"
                  tooltip="Ancho de la franja que cubre el implemento en cada pasada, en metros (m)."
                  value={formData.working_width_m}
                  onChange={handleChange}
                  error={errors.working_width_m}
                  placeholder="Valor en metros (m)"
                  step="0.1"
                  min="0"
                  presets={ANCHO_TRABAJO_PRESETS}
                  unknownDefault={ANCHO_TRABAJO_UNKNOWN_DEFAULT}
                  unknownLabel="~2 m (estándar)"
                  inputClass={inputClass('working_width_m')}
                />

                <FieldWithPresets
                  id="working_depth_cm"
                  name="working_depth_cm"
                  label="Profundidad de trabajo"
                  tooltip="Profundidad máxima a la que opera el implemento en el suelo, en centímetros (cm)."
                  value={formData.working_depth_cm}
                  onChange={handleChange}
                  error={errors.working_depth_cm}
                  placeholder="Valor en centímetros (cm)"
                  step="1"
                  min="0"
                  presets={PROFUNDIDAD_PRESETS}
                  unknownDefault={PROFUNDIDAD_UNKNOWN_DEFAULT}
                  unknownLabel="~20 cm (labor media)"
                  inputClass={inputClass('working_depth_cm')}
                />

                <FieldWithPresets
                  id="weight_kg"
                  name="weight_kg"
                  label="Peso del implemento"
                  tooltip="Peso total del implemento en kilogramos (kg)."
                  value={formData.weight_kg}
                  onChange={handleChange}
                  error={errors.weight_kg}
                  placeholder="Valor en kilogramos (kg)"
                  step="1"
                  min="0"
                  presets={PESO_IMPLEMENTO_PRESETS}
                  unknownDefault={PESO_IMPLEMENTO_UNKNOWN_DEFAULT}
                  unknownLabel="~700 kg (mediano)"
                  inputClass={inputClass('weight_kg')}
                />

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#893d46] text-white text-sm font-semibold rounded-lg hover:bg-[#7a3540] active:bg-[#6b2e38] transition-colors shadow-sm"
                  >
                    Siguiente
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modal del Catálogo */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-4xl md:max-w-5xl lg:max-w-6xl w-[95vw] max-h-[85vh] overflow-hidden flex flex-col p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Catálogo de Implementos
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500 -mt-1">
            Selecciona tu modelo para rellenar los datos automáticamente.
          </p>
          
          <div className="flex-1 overflow-y-auto mt-4 pr-1">
            {implementosCatalogo.length === 0 ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-7 h-7 border-[3px] border-[#893d46] border-t-transparent rounded-full animate-spin" aria-label="Cargando implementos" />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {implementosCatalogo.map((impl) => (
                  <button 
                    key={impl.implementId} 
                    type="button"
                    className="text-left border border-gray-200 rounded-xl p-4 hover:border-[#893d46] hover:shadow-sm transition-all flex flex-col bg-white group"
                    onClick={() => handleImplementoSelect(impl)}
                    aria-label={`Seleccionar ${impl.brand} ${impl.implementName}, ${impl.powerRequirementHp} HP requerido`}
                  >
                    <div className="h-24 w-full flex items-center justify-center bg-gray-50 rounded-lg mb-3 p-2 group-hover:bg-red-50/30 transition-colors">
                      <img 
                        src={impl.image || impl.imageUrl || impl.image_url || (impl.images && impl.images[0]) || Maquina} 
                        alt={impl.implementName} 
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <p className="font-semibold text-gray-800 text-sm leading-tight">{impl.brand}</p>
                    <p className="text-gray-500 text-xs mt-0.5 mb-2">{impl.implementName}</p>
                    <div className="mt-auto flex justify-between items-center">
                      <span className="text-xs font-semibold text-[#893d46] bg-[#893d46]/8 px-2 py-0.5 rounded">
                        {impl.powerRequirementHp} HP Req.
                      </span>
                      <span className="text-xs text-gray-400">
                        {impl.weightKg} kg
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
