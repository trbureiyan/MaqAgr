import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sileo } from "sileo";
import TooltipInfo from "@/components/ui/tooltip-info";
import SkeletonCard from "@/components/ui/SkeletonCard";
import StepIndicator from "../../../components/ui/StepIndicator";
import IconCamp from "../../../assets/icons/IconCamp.png";
import { getInputClass } from "../../../lib/formUtils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FieldWithPresets from "@/features/calculator/components/FieldWithPresets";

import { getTractors } from "../../../services/tractorApi";
import { getImplements } from "../../../services/implementApi";

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
    working_speed_kmh: "",
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
    if (!formData.soil_type) err.soil_type = "Selecciona el tipo de suelo.";
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
    sileo.info("Buscando la mejor combinación en base a tu terreno y labor...");

    try {
      const tractorQuery = {
        minPower: formData.min_power_hp || "",
        maxWeight: formData.max_weight_kg || "",
      };

      const implementQuery = {
        type: formData.labor_type || "",
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

      sileo.success("¡Matchmaking completado con éxito!");
    } catch (error) {
      console.error(error);
      sileo.error("Ocurrió un problema buscando tus opciones.");
      setStep((s) => s - 1);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------------
  // Render Step 1
  // --------------------------------------------------------
  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="mb-6 border-b border-border/40 pb-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Datos del terreno
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Describe las características del lugar de trabajo para perfilar mejor las recomendaciones.
        </p>
      </div>

      <div>
        <label htmlFor="soil_type" className="text-sm font-medium leading-none block mb-1.5 text-foreground">
          Tipo de suelo
          <TooltipInfo content="El tipo de suelo impacta la tracción y potencia necesaria (Arcilloso es más exigente)." />
        </label>
        <select
          id="soil_type"
          name="soil_type"
          value={formData.soil_type}
          onChange={handleChange}
          className={getInputClass("soil_type", errors)}
        >
          <option value="">Seleccione un tipo de suelo</option>
          {TIPOS_SUELO.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        {errors.soil_type && (
          <p className="mt-1.5 text-xs text-destructive" role="alert">{errors.soil_type}</p>
        )}
      </div>

      <div>
        <label htmlFor="hectares" className="text-sm font-medium leading-none block mb-1.5 text-foreground">
          Superficie aproximada (Hectáreas)
        </label>
        <input
          id="hectares"
          name="hectares"
          type="number"
          step="0.1"
          min="0"
          value={formData.hectares}
          onChange={handleChange}
          className={getInputClass("hectares", errors)}
          placeholder="Ej: 50.5"
        />
        {errors.hectares && (
          <p className="mt-1.5 text-xs text-destructive" role="alert">{errors.hectares}</p>
        )}
      </div>
    </div>
  );

  // --------------------------------------------------------
  // Render Step 2
  // --------------------------------------------------------
  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="mb-6 border-b border-border/40 pb-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Parámetros Agro-Mecánicos
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Indica qué labor se hará. Puedes incluir condiciones como un peso límite para cuidar el terreno.
        </p>
      </div>

      <div>
        <label htmlFor="labor_type" className="text-sm font-medium leading-none block mb-1.5 text-foreground">
          Tipo de Labor / Implemento
          <TooltipInfo content="La labor determina la máquina acoplada que necesitas buscar." />
        </label>
        <select
          id="labor_type"
          name="labor_type"
          value={formData.labor_type}
          onChange={handleChange}
          className={getInputClass("labor_type", errors)}
        >
          <option value="">Seleccione el trabajo deseado</option>
          {TIPOS_LABOR.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        {errors.labor_type && (
          <p className="mt-1.5 text-xs text-destructive" role="alert">{errors.labor_type}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label htmlFor="min_power_hp" className="text-sm font-medium leading-none block mb-1.5 text-foreground">
            Potencia Requerida aprox. (HP){" "}
            <span className="text-xs font-normal text-muted-foreground">
              - Opcional
            </span>
          </label>
          <input
            id="min_power_hp"
            name="min_power_hp"
            type="number"
            min="0"
            value={formData.min_power_hp}
            onChange={handleChange}
            className={getInputClass("min_power_hp", errors)}
            placeholder="Min HP. Ej: 80"
          />
        </div>

        <div>
          <label htmlFor="max_weight_kg" className="text-sm font-medium leading-none block mb-1.5 text-foreground">
            Límite de Peso Operativo (kg){" "}
            <span className="text-xs font-normal text-muted-foreground">
              - Opcional
            </span>
            <TooltipInfo content="Establece un límite de peso si tu terreno es susceptible a la compactación." />
          </label>
          <input
            id="max_weight_kg"
            name="max_weight_kg"
            type="number"
            min="0"
            value={formData.max_weight_kg}
            onChange={handleChange}
            className={getInputClass("max_weight_kg", errors)}
            placeholder="Max kg. Ej: 4000"
          />
        </div>
      </div>

      <div className="mt-4">
        <FieldWithPresets
          id="working_speed_kmh"
          name="working_speed_kmh"
          label="Velocidad de trabajo"
          tooltip="Velocidad estimada de la labor en km/h."
          value={formData.working_speed_kmh}
          onChange={handleChange}
          error={errors.working_speed_kmh}
          placeholder="km/h (Opcional)"
          step="0.1"
          min="0"
          presets={[
            { label: '5 km/h', value: '5', hint: 'Labor lenta / profunda' },
            { label: '7 km/h', value: '7', hint: 'Labor típica' },
            { label: '10 km/h', value: '10', hint: 'Labor rápida / superficial' },
          ]}
          inputClass={getInputClass("working_speed_kmh", errors)}
        />
      </div>
    </div>
  );

  // --------------------------------------------------------
  // Render Step 3 (Resultados)
  // --------------------------------------------------------
  const renderStep3 = () => (
    <div className="space-y-8 w-full animate-fadeIn">
      <div className="text-center mb-6 border-b border-border/40 pb-4">
        <h2 className="text-2xl font-bold tracking-tight text-foreground mb-1">
          Resultados de Matchmaking
        </h2>
        <p className="text-sm text-muted-foreground">
          Recomendaciones cruzadas basadas en tu perfil de terreno y labor.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full transition-opacity duration-300">
          <div>
            <h3 className="font-semibold text-base text-primary mb-4">
              Analizando Tractores...
            </h3>
            <div className="space-y-4">
              <SkeletonCard />
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-base text-primary mb-4">
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
          <div className="bg-secondary/10 rounded border border-border/60 p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-foreground">
                Tractores Ideales
              </h3>
              <span className="bg-primary text-primary-foreground text-xs px-2.5 py-0.5 rounded-full font-semibold">
                {resultados.tractores.length}
              </span>
            </div>
            {resultados.tractores.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">
                No se encontraron tractores compatibles bajo estos parámetros.
              </p>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {resultados.tractores.map((t) => (
                  <div
                    key={t.tractorId}
                    className="bg-card p-4 rounded border border-border/60 hover:border-primary/50 hover:shadow-sm transition-all duration-200"
                  >
                    <h4 className="font-bold text-primary text-base">
                      {t.brand} {t.name}
                    </h4>
                    <div className="text-sm text-muted-foreground space-y-1 mt-2">
                      <p>
                        <b className="text-foreground">Potencia:</b> {t.enginePowerHp} HP
                      </p>
                      <p>
                        <b className="text-foreground">Tracción:</b> {t.tractionType}
                      </p>
                      <p>
                        <b className="text-foreground">Peso:</b> {t.weightKg} kg
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Columna Implementos */}
          <div className="bg-secondary/10 rounded border border-border/60 p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-foreground">
                Implementos ("{formData.labor_type}")
              </h3>
              <span className="bg-primary text-primary-foreground text-xs px-2.5 py-0.5 rounded-full font-semibold">
                {resultados.implementos.length}
              </span>
            </div>
            {resultados.implementos.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">
                No se encontraron implementos compatibles bajo estos parámetros.
              </p>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {resultados.implementos.map((i) => (
                  <div
                    key={i.implementId}
                    className="bg-card p-4 rounded border border-border/60 hover:border-primary/50 hover:shadow-sm transition-all duration-200"
                  >
                    <h4 className="font-bold text-primary text-base">
                      {i.brand} {i.implementName}
                    </h4>
                    <div className="text-sm text-muted-foreground space-y-1 mt-2">
                      <p>
                        <b className="text-foreground">Req. Potencia:</b> {i.powerRequirementHp} HP
                      </p>
                      <p>
                        <b className="text-foreground">Ancho de trabajo:</b> {i.workingWidthM} m
                      </p>
                      <p>
                        <b className="text-foreground">Peso:</b> {i.weightKg} kg
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
          <button
            type="button"
            onClick={() => {
              setStep(1);
              setResultados({ tractores: [], implementos: [] });
            }}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded hover:bg-primary/90 transition-colors shadow-sm"
          >
            Nueva Búsqueda
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background flex flex-col items-center justify-start pt-10 pb-16 px-4">
      <div className={`w-full transition-all duration-300 ${step === 3 ? "max-w-5xl" : "max-w-4xl"}`}>
        
        {/* ── Encabezado fuera de la card ── */}
        <div className="mb-8 px-1">
          <StepIndicator
            current={step}
            total={3}
            labels={["Terreno", "Parámetros", "Resultados"]}
          />
        </div>

        {step < 3 ? (
          <div className="bg-card rounded border border-border/60 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]">

              {/* ── Panel izquierdo: imagen descriptiva ── */}
              <div className="bg-secondary/30 border-b md:border-b-0 md:border-r border-border/60 p-6 flex flex-col items-center justify-center gap-5">
                <div className="w-full aspect-[4/3] rounded overflow-hidden bg-card border border-border/60 flex items-center justify-center p-3">
                  <img
                    src={IconCamp}
                    alt="Búsqueda de equipos"
                    className="max-h-full max-w-full object-contain filter grayscale opacity-85"
                  />
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground/80">
                    {step === 1 
                      ? "Define las características de tu terreno para ajustar la potencia y tracción."
                      : "Selecciona el tipo de trabajo agrícola a realizar y los límites operativos."}
                  </p>
                </div>
              </div>

              {/* ── Panel derecho: formulario ── */}
              <div className="p-6 md:p-8 flex flex-col h-full justify-between">
                <div>
                  {step === 1 && renderStep1()}
                  {step === 2 && renderStep2()}
                </div>

                <div className="pt-6 mt-8 border-t border-border/40 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex items-center gap-2 px-5 py-2.5 bg-background border border-border text-foreground text-sm font-semibold rounded hover:bg-muted transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    {step === 1 ? "Cancelar" : "Volver"}
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded hover:bg-primary/90 transition-colors shadow-sm"
                  >
                    {step === 2 ? "Encontrar equipo" : "Siguiente"}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        ) : (
          <div className="bg-card rounded border border-border/60 overflow-hidden p-6 md:p-8">
            {renderStep3()}
          </div>
        )}
      </div>
    </div>
  );
}
