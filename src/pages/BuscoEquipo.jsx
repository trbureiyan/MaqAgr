import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sileo } from "sileo";
import Button from "../components/ui/buttons/Button";
import TooltipInfo from "../components/ui/buttons/ToolTipInfo";
import SkeletonCard from "../components/ui/loaders/SkeletonCard";

// Asumiendo que existen tarjetas genéricas para mostrarlos
// Si no, adaptaremos el UI simple. Usaremos `TractorCard` u otro existente
// En Catálogo se usa Card, Tractores/Implementos. Usaremos layouts limpios.
import { getTractors } from "../services/tractorApi";
import { getImplements } from "../services/implementApi";

const TIPOS_SUELO = [
  { value: "Clay", label: "Arcilloso (Clay)" },
  { value: "Loam", label: "Franco (Loam)" },
  { value: "Sand", label: "Arenoso (Sand)" },
  { value: "Silt", label: "Limoso (Silt)" },
  { value: "All", label: "Mixto / Todos" },
];

const TIPOS_LABOR = [
  { value: "Plow", label: "Arado (Plow)" },
  { value: "Harrow", label: "Rastra (Harrow)" },
  { value: "Seeder", label: "Sembradora (Seeder)" },
  { value: "Sprayer", label: "Aspersora (Sprayer)" },
  { value: "Harvester", label: "Cosechadora (Harvester)" },
  { value: "Cultivator", label: "Cultivador" },
  { value: "Mower", label: "Segadora (Mower)" },
  { value: "Trailer", label: "Remolque (Trailer)" },
  { value: "Other", label: "Otro" },
];

export default function BuscoEquipo() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    soil_type: "",
    hectares: "",
    labor_type: "",
    min_power_hp: "",
    max_weight_kg: "",
  });

  const [errors, setErrors] = useState({});
  const [resultados, setResultados] = useState({
    tractores: [],
    implementos: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateStep1 = () => {
    const err = {};
    if (!formData.soil_type) err.soil_type = "Selecciona el tipo de terreno.";
    if (!formData.hectares || formData.hectares <= 0)
      err.hectares = "Ingresa una superficie válida.";
    return err;
  };

  const validateStep2 = () => {
    const err = {};
    if (!formData.labor_type)
      err.labor_type = "Selecciona el tipo de labor a realizar.";
    return err;
  };

  const handleNext = () => {
    if (step === 1) {
      const err = validateStep1();
      if (Object.keys(err).length > 0) {
        setErrors(err);
        return;
      }
    } else if (step === 2) {
      const err = validateStep2();
      if (Object.keys(err).length > 0) {
        setErrors(err);
        return;
      }
      // Proceder al matchmaking
      ejecutarMatchmaking();
    }
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((s) => s - 1);
    } else {
      navigate(-1);
    }
  };

  const ejecutarMatchmaking = async () => {
    setLoading(true);
    console.log("Buscando la mejor combinación en base a tu terreno y labor...");

    try {
      // Configuramos los filtros para la búsqueda simultánea
      // Tractores que cumplan con la potencia (si fue ingresada) y no excedan el peso
      const tractorQuery = {
        minPower: formData.min_power_hp || "",
        maxWeight: formData.max_weight_kg || "",
      };

      // Implementos del tipo seleccionado, que requieran menos o igual potencia de la indicada y peso límite
      const implementQuery = {
        type: formData.labor_type || "", // esto mapea indirectamente
        maxPower: formData.min_power_hp || "",
        maxWeight: formData.max_weight_kg || "",
      };

      const [resTractores, resImplementos] = await Promise.all([
        getTractors(tractorQuery),
        getImplements(implementQuery),
      ]);

      setResultados({
        tractores: resTractores.data || [],
        implementos: resImplementos.data || [],
      });

      console.log("¡Matchmaking completado con éxito!");
    } catch (error) {
      console.error(error);
      console.log("Ocurrió un problema buscando tus opciones.");
      // Para no dejar al usuario en la página bloqueda
      setStep((s) => s - 1);
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#991b1b] transition-colors";
  const inputClass = (field) =>
    `${inputBase} ${errors[field] ? "border-red-500" : "border-gray-300"}`;

  // --------------------------------------------------------
  // Render Step 1
  // --------------------------------------------------------
  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Datos del terreno
      </h2>
      <p className="text-gray-600 mb-6">
        Describe las características del lugar de trabajo para perfilar mejor
        las recomendaciones.
      </p>

      <div>
        <label className="block text-gray-700 font-medium mb-1">
          Tipo de suelo
          <TooltipInfo content="El tipo de suelo impacta la tracción y potencia necesaria (Arcilloso es más exigente)." />
        </label>
        <select
          name="soil_type"
          value={formData.soil_type}
          onChange={handleChange}
          className={inputClass("soil_type")}
        >
          <option value="">Seleccione un tipo de suelo</option>
          {TIPOS_SUELO.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        {errors.soil_type && (
          <p className="mt-1 text-sm text-red-600">{errors.soil_type}</p>
        )}
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-1">
          Superficie aproximada (Hectáreas)
        </label>
        <input
          name="hectares"
          type="number"
          step="0.1"
          min="0"
          value={formData.hectares}
          onChange={handleChange}
          className={inputClass("hectares")}
          placeholder="Ej: 50.5"
        />
        {errors.hectares && (
          <p className="mt-1 text-sm text-red-600">{errors.hectares}</p>
        )}
      </div>
    </div>
  );

  // --------------------------------------------------------
  // Render Step 2
  // --------------------------------------------------------
  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Parámetros Agro-Mecánicos
      </h2>
      <p className="text-gray-600 mb-6">
        Indica qué labor se hará. Puedes incluir condiciones como un peso límite
        para cuidar el terreno.
      </p>

      <div>
        <label className="block text-gray-700 font-medium mb-1">
          Tipo de Labor / Implemento
          <TooltipInfo content="La labor determina la máquina acoplada que necesitas buscar." />
        </label>
        <select
          name="labor_type"
          value={formData.labor_type}
          onChange={handleChange}
          className={inputClass("labor_type")}
        >
          <option value="">Seleccione el trabajo deseado</option>
          {TIPOS_LABOR.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        {errors.labor_type && (
          <p className="mt-1 text-sm text-red-600">{errors.labor_type}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Potencia Requerida aprox. (HP){" "}
            <span className="text-sm font-normal text-gray-400 opacity-80">
              - Opcional
            </span>
          </label>
          <input
            name="min_power_hp"
            type="number"
            min="0"
            value={formData.min_power_hp}
            onChange={handleChange}
            className={inputClass("min_power_hp")}
            placeholder="Min HP. Ej: 80"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Límite de Peso Operativo (kg){" "}
            <span className="text-sm font-normal text-gray-400 opacity-80">
              - Opcional
            </span>
            <TooltipInfo content="Establece un límite de peso si tu terreno es susceptible a la compactación." />
          </label>
          <input
            name="max_weight_kg"
            type="number"
            min="0"
            value={formData.max_weight_kg}
            onChange={handleChange}
            className={inputClass("max_weight_kg")}
            placeholder="Max kg. Ej: 4000"
          />
        </div>
      </div>
    </div>
  );

  // --------------------------------------------------------
  // Render Step 3 (Resultados)
  // --------------------------------------------------------
  const renderStep3 = () => (
    <div className="space-y-8 w-full animate-fadeIn">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Resultados de Matchmaking
        </h2>
        <p className="text-gray-600">
          Recomendaciones cruzadas basadas en tu perfil.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full transition-opacity duration-300">
          <div>
            <h3 className="font-semibold text-lg text-[#991b1b] mb-4">
              Analizando Tractores...
            </h3>
            <div className="space-y-4">
              <SkeletonCard />
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-lg text-[#991b1b] mb-4">
              Analizando Implementos...
            </h3>
            <div className="space-y-4">
              <SkeletonCard />
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full transition-opacity duration-300">
          {/* Columna Tractores */}
          <div className="bg-gray-50 rounded-xl p-4 md:p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-xl text-gray-800">
                Tractores Ideales
              </h3>
              <span className="bg-[#991b1b] text-white text-xs px-2 py-1 rounded-full">
                {resultados.tractores.length}
              </span>
            </div>
            {resultados.tractores.length === 0 ? (
              <p className="text-sm text-gray-500 italic">
                No se encontraron tractores compatibles bajo estos parámetros.
              </p>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {resultados.tractores.map((t) => (
                  <div
                    key={t.tractorId}
                    className="bg-white p-4 rounded-lg shadow border border-gray-100 hover:shadow-md transition"
                  >
                    <h4 className="font-bold text-[#991b1b]">
                      {t.brand} {t.name}
                    </h4>
                    <div className="text-sm text-gray-600 space-y-1 mt-2">
                      <p>
                        <b>Potencia:</b> {t.enginePowerHp} HP
                      </p>
                      <p>
                        <b>Tracción:</b> {t.tractionType}
                      </p>
                      <p>
                        <b>Peso:</b> {t.weightKg} kg
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Columna Implementos */}
          <div className="bg-gray-50 rounded-xl p-4 md:p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-xl text-gray-800">
                Implementos ("{formData.labor_type}")
              </h3>
              <span className="bg-[#991b1b] text-white text-xs px-2 py-1 rounded-full">
                {resultados.implementos.length}
              </span>
            </div>
            {resultados.implementos.length === 0 ? (
              <p className="text-sm text-gray-500 italic">
                No se encontraron implementos compatibles bajo estos parámetros.
              </p>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {resultados.implementos.map((i) => (
                  <div
                    key={i.implementId}
                    className="bg-white p-4 rounded-lg shadow border border-gray-100 hover:shadow-md transition"
                  >
                    <h4 className="font-bold text-[#991b1b]">
                      {i.brand} {i.implementName}
                    </h4>
                    <div className="text-sm text-gray-600 space-y-1 mt-2">
                      <p>
                        <b>Req. Potencia:</b> {i.powerRequirementHp} HP
                      </p>
                      <p>
                        <b>Ancho de trabajo:</b> {i.workingWidthM} m
                      </p>
                      <p>
                        <b>Peso:</b> {i.weightKg} kg
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Botón Reiniciar */}
      {!loading && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            color="#991b1b"
            onClick={() => {
              setStep(1);
              setResultados({ tractores: [], implementos: [] });
            }}
          >
            NUEVA BÚSQUEDA
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-8">
      <div
        className={`bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200 transition-all duration-300 w-full ${step === 3 ? "max-w-6xl" : "max-w-2xl"}`}
      >
        {step < 3 && (
          <div className="flex items-center justify-center gap-2 mb-8">
            <span
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-colors ${step >= 1 ? "bg-[#991b1b] text-white" : "bg-gray-200 text-gray-500"}`}
            >
              1
            </span>
            <div
              className={`w-12 h-0.5 transition-colors ${step >= 2 ? "bg-[#991b1b]" : "bg-gray-300"}`}
            />
            <span
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-colors ${step >= 2 ? "bg-[#991b1b] text-white" : "bg-gray-200 text-gray-500"}`}
            >
              2
            </span>
            <div
              className={`w-12 h-0.5 transition-colors ${step >= 3 ? "bg-[#991b1b]" : "bg-gray-300"}`}
            />
            <span
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-colors ${step >= 3 ? "bg-[#991b1b] text-white" : "bg-gray-200 text-gray-500"}`}
            >
              3
            </span>
          </div>
        )}

        <div className="flex flex-col gap-6">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>

        {step < 3 && (
          <div className="flex justify-between mt-8 pt-4 border-t border-gray-100">
            <Button
              variant="outline"
              color="#991b1b"
              type="button"
              onClick={handleBack}
            >
              {step === 1 ? "CANCELAR" : "VOLVER"}
            </Button>
            <Button
              variant="primary"
              color="#991b1b"
              type="button"
              onClick={handleNext}
            >
              {step === 2 ? "ENCONTRAR EQUIPO" : "SIGUIENTE"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
