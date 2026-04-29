import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Tractor from "../assets/img/Tractor Prueva.webp";
import Button from "../components/ui/buttons/Button";
import TooltipInfo from "../components/ui/buttons/ToolTipInfo";
import { getTractors } from "../services/tractorApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";

export default function DatosTractor() {
  const navigate = useNavigate();

  // Inicializar el estado desde localStorage para que no se pierdan al volver
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('tractor_datos');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          pb: parsed.pb || "",
          pmax_tdp: parsed.pmax_tdp || "",
          peso: parsed.peso || "",
          turbo: parsed.turbo || "",
        };
      } catch (e) {
        // Fallback si hay error al parsear
      }
    }
    return {
      pb: "",
      pmax_tdp: "",
      peso: "",
      turbo: "",
    };
  });

  const [errors, setErrors] = useState({});
  const [tractoresCatalogo, setTractoresCatalogo] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Inicializar la imagen desde localStorage si existe
  const [imagenTractor, setImagenTractor] = useState(() => {
    return localStorage.getItem('tractor_imagen') || Tractor;
  });

  useEffect(() => {
    const fetchTractores = async () => {
      try {
        const response = await getTractors({ limit: 100 });
        if (response.success && response.data) {
          setTractoresCatalogo(response.data);
        }
      } catch (error) {
        console.error("Error al cargar tractores del catálogo:", error);
      }
    };
    fetchTractores();
  }, []);

  const handleTractorSelect = (tractor) => {
    if (tractor) {
      setFormData({
        pb: tractor.enginePowerHp || "",
        pmax_tdp: tractor.enginePowerHp ? (tractor.enginePowerHp * 0.86).toFixed(1) : "",
        peso: tractor.weightKg || "",
        turbo: "si", // Asumimos por defecto
      });
      
      const tractorImage = tractor.image || tractor.imageUrl || tractor.image_url || (tractor.images && tractor.images[0]) || Tractor;
      setImagenTractor(tractorImage);
      localStorage.setItem('tractor_imagen', tractorImage); // Guardar imagen
      
      setErrors({});
      setIsModalOpen(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const err = {};
    if (!formData.pb || formData.pb <= 0) err.pb = "Ingresa una potencia bruta válida (HP).";
    if (!formData.pmax_tdp || formData.pmax_tdp <= 0) err.pmax_tdp = "Ingresa una potencia máxima TDP válida (HP).";
    if (!formData.peso || formData.peso <= 0) err.peso = "Ingresa un peso válido (kg).";
    if (!formData.turbo) err.turbo = "Selecciona si cuenta con turbo.";
    return err;
  };

  const guardarDatos = () => {
    localStorage.setItem('tractor_datos', JSON.stringify({
      pb: Number(formData.pb) || formData.pb,
      pmax_tdp: Number(formData.pmax_tdp) || formData.pmax_tdp,
      peso: Number(formData.peso) || formData.peso,
      turbo: formData.turbo
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const err = validate();
    if (Object.keys(err).length > 0) {
      setErrors(err);
      return;
    }
    
    guardarDatos();
    navigate("/DatosLlantas");
  };

  const inputBase =
    "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#991b1b] transition-colors";
  const inputClass = (field) =>
    `${inputBase} ${errors[field] ? "border-red-500" : "border-gray-300"}`;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        
        {/* ── Indicador de pasos ── */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#991b1b] text-white text-sm font-bold">1</span>
          <div className="w-8 sm:w-12 h-0.5 bg-gray-300" />
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-500 text-sm font-bold">2</span>
          <div className="w-8 sm:w-12 h-0.5 bg-gray-300" />
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-500 text-sm font-bold">3</span>
          <div className="w-8 sm:w-12 h-0.5 bg-gray-300" />
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-500 text-sm font-bold">4</span>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Datos del tractor</h1>
          <p className="text-gray-600 mt-2">
            Ingresa las especificaciones técnicas de tu tractor para calcular su rendimiento.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row items-start">
          {/* Lado izquierdo: Imagen y Botón del Catálogo */}
          <div className="w-full md:w-1/2 flex flex-col items-center">
            <img 
              src={imagenTractor} 
              alt="Modelo de tractor" 
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

          {/* Lado derecho: Formulario */}
          <div className="w-full md:w-1/2 md:pl-8 mt-8 md:mt-0">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Pb
                  <TooltipInfo content="Potencia bruta del tractor expresada en caballos de fuerza (HP)" />
                </label>
                <input 
                  type="number"
                  name="pb"
                  value={formData.pb}
                  onChange={handleChange}
                  placeholder="Ingrese valor en HP" 
                  className={inputClass("pb")}
                />
                {errors.pb && <p className="mt-1 text-sm text-red-600">{errors.pb}</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Pmax(tdp)
                  <TooltipInfo content="Potencia máxima en la toma de fuerza (TDF) expresada en HP" />
                </label>
                <input 
                  type="number"
                  name="pmax_tdp"
                  value={formData.pmax_tdp}
                  onChange={handleChange}
                  placeholder="Ingrese valor en HP" 
                  className={inputClass("pmax_tdp")}
                />
                {errors.pmax_tdp && <p className="mt-1 text-sm text-red-600">{errors.pmax_tdp}</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Peso Operativo
                  <TooltipInfo content="Peso del tractor con contrapesos en kilogramos (kg)" />
                </label>
                <input 
                  type="number"
                  name="peso"
                  value={formData.peso}
                  onChange={handleChange}
                  placeholder="Ingrese valor en kg" 
                  className={inputClass("peso")}
                />
                {errors.peso && <p className="mt-1 text-sm text-red-600">{errors.peso}</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Turbo
                  <TooltipInfo content="Indica si el motor de tu tractor cuenta con un turbocompresor" />
                </label>
                <select 
                  name="turbo"
                  value={formData.turbo}
                  onChange={handleChange}
                  className={inputClass("turbo")}
                >
                  <option value="">Seleccione una opción</option>
                  <option value="si">Sí</option>
                  <option value="no">No</option>
                </select>
                {errors.turbo && <p className="mt-1 text-sm text-red-600">{errors.turbo}</p>}
              </div>

              {/* Botones de navegación */}
              <div className="pt-4 flex justify-end space-x-4">
                <Button
                  variant="primary"
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
            <DialogTitle className="text-2xl font-bold text-gray-800">Catálogo de Tractores</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto mt-4 pr-2">
            {tractoresCatalogo.length === 0 ? (
              <div className="text-center py-8 text-gray-500">Cargando tractores...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {tractoresCatalogo.map((tractor) => (
                  <div 
                    key={tractor.tractorId} 
                    className="border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-[#991b1b] hover:shadow-md transition-all flex flex-col bg-white"
                    onClick={() => handleTractorSelect(tractor)}
                  >
                    <div className="h-32 mb-4 w-full flex items-center justify-center bg-gray-50 rounded-lg p-2">
                      <img 
                        src={tractor.image || tractor.imageUrl || tractor.image_url || (tractor.images && tractor.images[0]) || Tractor} 
                        alt={tractor.name} 
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1">{tractor.brand}</h3>
                      <p className="text-gray-600 font-medium">{tractor.model}</p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                      <span className="bg-red-50 text-[#991b1b] text-sm font-semibold px-2 py-1 rounded">
                        {tractor.enginePowerHp} HP
                      </span>
                      <span className="text-gray-500 text-sm">
                        {tractor.weightKg} kg
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