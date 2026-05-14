import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Tractor from "../assets/img/Tractor Prueva.webp";
import Button from "../components/ui/buttons/Button";
import FieldWithPresets from "../components/ui/FieldWithPresets";
import { getInputClass } from "../lib/formUtils";
import {
  PB_PRESETS, PB_UNKNOWN_DEFAULT,
  PMAX_TDP_PRESETS, PMAX_TDP_UNKNOWN_DEFAULT,
  PESO_PRESETS, PESO_UNKNOWN_DEFAULT,
} from "../lib/fieldPresets";
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
      } catch (Error_parse) {
        console.error("Error parsing tractor_datos", Error_parse);
      }
    }
    return { pb: "", pmax_tdp: "", peso: "", turbo: "" };
  });

  const [errors, setErrors] = useState({});
  const [tractoresCatalogo, setTractoresCatalogo] = useState([]);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [imagenTractor, setImagenTractor] = useState(() =>
    localStorage.getItem('tractor_imagen') || Tractor
  );

  useEffect(() => {
    const fetchTractores = async () => {
      setIsLoadingCatalog(true);
      try {
        const response = await getTractors({ limit: 100 });
        if (response.success && response.data) {
          setTractoresCatalogo(response.data);
        }
      } catch (error) {
        console.error("Error al cargar tractores del catálogo:", error);
      } finally {
        setIsLoadingCatalog(false);
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
        // Si el catálogo provee hasTurbo lo usamos; si no, dejamos vacío para que el usuario confirme
        turbo: tractor.hasTurbo === true ? "si" : tractor.hasTurbo === false ? "no" : "",
      });

      const tractorImage =
        tractor.image ||
        tractor.imageUrl ||
        tractor.image_url ||
        (tractor.images && tractor.images[0]) ||
        Tractor;
      setImagenTractor(tractorImage);
      localStorage.setItem('tractor_imagen', tractorImage);

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
      turbo: formData.turbo,
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
    navigate("/DatosLlantas", {
      state: {
        tractorData: {
          pb: Number(formData.pb),
          pmax_tdp: Number(formData.pmax_tdp),
          peso: Number(formData.peso),
          turbo: formData.turbo,
        },
      },
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">

        {/* ── Indicador de pasos (3 pasos de formulario) ── */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#991b1b] text-white text-sm font-bold" aria-label="Paso 1 de 3, actual">1</span>
          <div className="w-8 sm:w-12 h-0.5 bg-gray-300" />
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-500 text-sm font-bold" aria-label="Paso 2 de 3, pendiente">2</span>
          <div className="w-8 sm:w-12 h-0.5 bg-gray-300" />
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-500 text-sm font-bold" aria-label="Paso 3 de 3, pendiente">3</span>
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
              alt="Modelo de tractor seleccionado"
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
            <form className="space-y-5" onSubmit={handleSubmit} noValidate>

              <FieldWithPresets
                id="pb"
                name="pb"
                label="Potencia Bruta (Pb)"
                tooltip="Potencia bruta del tractor expresada en caballos de fuerza (HP)"
                value={formData.pb}
                onChange={handleChange}
                error={errors.pb}
                placeholder="Ingrese valor en HP"
                presets={PB_PRESETS}
                unknownDefault={PB_UNKNOWN_DEFAULT}
                unknownLabel="~80 HP (típico)"
                inputClass={getInputClass('pb', errors)}
              />

              <FieldWithPresets
                id="pmax_tdp"
                name="pmax_tdp"
                label="Potencia Máxima TDP"
                tooltip="Potencia máxima en la toma de fuerza (TDF) expresada en HP"
                value={formData.pmax_tdp}
                onChange={handleChange}
                error={errors.pmax_tdp}
                placeholder="Ingrese valor en HP"
                presets={PMAX_TDP_PRESETS}
                unknownDefault={PMAX_TDP_UNKNOWN_DEFAULT}
                unknownLabel="~69 HP (≈ 86% de 80 HP)"
                inputClass={getInputClass('pmax_tdp', errors)}
              />

              <FieldWithPresets
                id="peso"
                name="peso"
                label="Peso Operativo"
                tooltip="Peso del tractor con contrapesos en kilogramos (kg)"
                value={formData.peso}
                onChange={handleChange}
                error={errors.peso}
                placeholder="Ingrese valor en kg"
                presets={PESO_PRESETS}
                unknownDefault={PESO_UNKNOWN_DEFAULT}
                unknownLabel="~4 500 kg (estándar)"
                inputClass={getInputClass('peso', errors)}
              />

              {/* Turbo — campo select, sin presets numéricos */}
              <div>
                <label htmlFor="turbo" className="block text-gray-700 font-medium mb-1">
                  Turbo
                  {/* No hay botón "No conozco" porque el campo es binario y obligatorio */}
                </label>
                <select
                  id="turbo"
                  name="turbo"
                  value={formData.turbo}
                  onChange={handleChange}
                  className={getInputClass('turbo', errors)}
                  aria-invalid={Boolean(errors.turbo)}
                  aria-describedby={errors.turbo ? 'turbo-error' : undefined}
                >
                  <option value="">¿Tu motor tiene turbocompresor?</option>
                  <option value="si">Sí — motor turboalimentado</option>
                  <option value="no">No — motor atmosférico</option>
                </select>
                {errors.turbo && (
                  <p id="turbo-error" className="mt-1 text-sm text-red-600" role="alert">
                    {errors.turbo}
                  </p>
                )}
              </div>

              {/* Botones de navegación */}
              <div className="pt-4 flex justify-end">
                <Button variant="primary" type="submit">
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
            {isLoadingCatalog ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-[#991b1b] border-t-transparent rounded-full animate-spin" aria-label="Cargando tractores" />
              </div>
            ) : tractoresCatalogo.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No hay tractores disponibles en el catálogo.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {tractoresCatalogo.map((tractor) => (
                  <div
                    key={tractor.tractorId}
                    className="border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-[#991b1b] hover:shadow-md transition-all flex flex-col bg-white"
                    onClick={() => handleTractorSelect(tractor)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleTractorSelect(tractor)}
                    aria-label={`Seleccionar ${tractor.brand} ${tractor.model}, ${tractor.enginePowerHp} HP`}
                  >
                    <div className="h-32 mb-4 w-full flex items-center justify-center bg-gray-50 rounded-lg p-2">
                      <img
                        src={tractor.image || tractor.imageUrl || tractor.image_url || (tractor.images && tractor.images[0]) || Tractor}
                        alt={`${tractor.brand} ${tractor.model}`}
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
                      <span className="text-gray-500 text-sm">{tractor.weightKg} kg</span>
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