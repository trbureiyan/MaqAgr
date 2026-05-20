/**
 * @fileoverview Flujo unificado e inline de "Tengo Maquinaria" — Asistente de un solo paso.
 *
 * Integra la selección del implemento (catálogo o manual), tipo de suelo
 * y muestra la potencia mínima recomendada junto a los tractores compatibles
 * en una sola página sin perder el contexto visual.
 *
 * @module pages/DatosImplemento
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sileo } from "sileo";
import { PiTractorFill as TractorImg } from "react-icons/pi";
import MachineImg from "../../../assets/icons/plow.webp";
import Suelo from "../../../assets/icons/suelo.webp";
import TooltipInfo from "@/components/ui/tooltip-info";
import FieldWithPresets from "@/features/calculator/components/FieldWithPresets";
import StepIndicator from "../../../components/ui/StepIndicator";
import TractorMachineCard from "@/features/tractors/components/TractorMachineCard";
import SkeletonCard from "@/components/ui/SkeletonCard";
import { getInputClass } from "../../../lib/formUtils";
import {
  ANCHO_TRABAJO_PRESETS, ANCHO_TRABAJO_UNKNOWN_DEFAULT,
  PROFUNDIDAD_PRESETS, PROFUNDIDAD_UNKNOWN_DEFAULT,
  PESO_IMPLEMENTO_PRESETS, PESO_IMPLEMENTO_UNKNOWN_DEFAULT,
  POTENCIA_REQUERIDA_PRESETS, POTENCIA_REQUERIDA_UNKNOWN_DEFAULT,
} from "../../../lib/fieldPresets";
import { getImplements } from "../../../services/implementApi";
import { calculateDirectMinimumPower } from "../../../services/calculationApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { ChevronRight, ChevronLeft, BookOpen, RotateCcw, Search } from "lucide-react";

const TIPOS_IMPLEMENTO = [
  { value: "plow",       label: "Arado (Plow)" },
  { value: "harrow",     label: "Rastra (Harrow)" },
  { value: "seeder",     label: "Sembradora (Seeder)" },
  { value: "sprayer",    label: "Aspersora (Sprayer)" },
  { value: "harvester",  label: "Cosechadora (Harvester)" },
  { value: "cultivator", label: "Cultivador" },
  { value: "mower",      label: "Segadora (Mower)" },
  { value: "trailer",    label: "Remolque (Trailer)" },
  { value: "other",      label: "Otro" },
];

const TIPOS_SUELO = [
  {
    value: "clay",
    label: "Arcilloso",
    descripcion: "Suelo pesado, alta retención de agua, difícil de trabajar en húmedo.",
  },
  {
    value: "sandy",
    label: "Arenoso",
    descripcion: "Suelo ligero, baja retención de agua, fácil de trabajar.",
  },
  {
    value: "loam",
    label: "Franco",
    descripcion: "Suelo equilibrado, mezcla de arena, limo y arcilla. Ideal para cultivos.",
  },
  {
    value: "silt",
    label: "Limoso",
    descripcion: "Suelo de grano fino, muy fértil pero propenso a la compactación.",
  },
  {
    value: "All",
    label: "Todo tipo de suelo",
    descripcion: "El implemento es compatible con cualquier tipo de suelo.",
  },
];

export default function DatosImplemento() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSimpleMode, setIsSimpleMode] = useState(true);
  const [errors, setErrors] = useState({});
  const [implementsCatalog, setImplementsCatalog] = useState([]);
  const [isCatalogLoading, setIsCatalogLoading] = useState(false);
  const [catalogLoadError, setCatalogLoadError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImplementId, setSelectedImplementId] = useState(null);
  const [selectedPowerReq, setSelectedPowerReq] = useState(null);
  const [implementImage, setImplementImage] = useState(MachineImg);

  // Estados de cálculo y búsqueda final
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  const [formData, setFormData] = useState({
    // Paso 1
    implement_type: "",
    working_width_m: "",
    working_depth_cm: "",
    weight_kg: "",
    working_speed_kmh: "",
    power_requirement_hp: "",

    // Paso 2
    soil_type: "",
  });

  // Carga del catálogo
  useEffect(() => {
    const fetchImplementos = async () => {
      try {
        setIsCatalogLoading(true);
        setCatalogLoadError(null);
        const response = await getImplements({ limit: 100 });
        if (response.success && response.data) {
          setImplementsCatalog(response.data);
        } else {
          setCatalogLoadError("No se pudo cargar el catálogo de implementos.");
        }
      } catch (error) {
        console.error("Error al cargar implementos:", error);
        setCatalogLoadError("Error de conexión al cargar el catálogo.");
      } finally {
        setIsCatalogLoading(false);
      }
    };
    fetchImplementos();
  }, []);

  const handleImplementoSelect = (implemento) => {
    if (implemento) {
      const implType = implemento.implementType
        ? implemento.implementType.toLowerCase()
        : "";

      const implId = implemento.implementId || implemento.implement_id || null;
      const implPowerReq =
        implemento.powerRequirementHp || implemento.power_requirement_hp || null;

      setFormData((prev) => ({
        ...prev,
        implement_type: implType,
        working_width_m: implemento.workingWidthM || "",
        working_depth_cm: implemento.workingDepthCm || "",
        weight_kg: implemento.weightKg || "",
        power_requirement_hp: implPowerReq || "",
      }));

      setSelectedImplementId(implId);
      setSelectedPowerReq(implPowerReq);

      const implImage =
        implemento.image ||
        implemento.imageUrl ||
        implemento.image_url ||
        (implemento.images && implemento.images[0]) ||
        MachineImg;
      setImplementImage(implImage);

      setErrors({});
      setIsModalOpen(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateStep1 = () => {
    const err = {};
    if (isSimpleMode) {
      if (!formData.implement_type && !selectedImplementId) {
        err.general = "Por favor busca y selecciona un implemento del catálogo.";
      }
      return err;
    }
    if (!formData.implement_type) {
      err.implement_type = "Selecciona el tipo de implemento.";
    }

    const width = Number(formData.working_width_m);
    if (!formData.working_width_m || !Number.isFinite(width) || width <= 0) {
      err.working_width_m = "Ingresa un ancho de trabajo válido (mayor a 0).";
    }

    const depth = Number(formData.working_depth_cm);
    if (!formData.working_depth_cm || !Number.isFinite(depth) || depth <= 0) {
      err.working_depth_cm = "Ingresa una profundidad de trabajo válida (mayor a 0).";
    }

    const weight = Number(formData.weight_kg);
    if (!formData.weight_kg || !Number.isFinite(weight) || weight <= 0) {
      err.weight_kg = "Ingresa el peso del implemento como un número válido.";
    }

    const power = Number(formData.power_requirement_hp);
    if (!formData.power_requirement_hp || !Number.isFinite(power) || power <= 0) {
      err.power_requirement_hp = "Ingresa el requerimiento de potencia base (HP) como un número válido.";
    }

    return err;
  };

  const validateStep2 = () => {
    const err = {};
    if (!formData.soil_type) {
      err.soil_type = "Por favor selecciona el tipo de suelo.";
    }
    return err;
  };

  const handleNext = () => {
    if (step === 1) {
      const err = validateStep1();
      if (Object.keys(err).length > 0) {
        setErrors(err);
        return;
      }
      setStep(2);
    } else if (step === 2) {
      const err = validateStep2();
      if (Object.keys(err).length > 0) {
        setErrors(err);
        return;
      }
      setStep(3);
      ejecutarCalculo();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((s) => s - 1);
    } else {
      navigate(-1);
    }
  };

  const resetWizard = () => {
    setStep(1);
    setFormData({
      implement_type: "",
      working_width_m: "",
      working_depth_cm: "",
      weight_kg: "",
      working_speed_kmh: "",
      power_requirement_hp: "",
      soil_type: "",
    });
    setSelectedImplementId(null);
    setSelectedPowerReq(null);
    setImplementImage(MachineImg);
    setResult(null);
    setErrors({});
    setBusqueda("");
  };

  const ejecutarCalculo = async () => {
    setLoading(true);
    sileo.info("Calculando potencia mínima requerida...");

    try {
      const workingDepthM = Math.min(
        (formData.working_depth_cm || 25) / 100,
        1.0
      );

      const powerReqHp = isSimpleMode
        ? (selectedPowerReq || null)
        : (Number(formData.power_requirement_hp) || null);

      if (!powerReqHp || powerReqHp <= 0) {
        throw new Error("Por favor ingresa o selecciona un requerimiento de potencia base válido.");
      }

      const payload = {
        powerRequirementHp: powerReqHp,
        workingDepthM,
        soilType: formData.soil_type || "loam",
        slopePercentage: 0,
      };

      const res = await calculateDirectMinimumPower(payload);
      setResult(res.data);
      sileo.success("Compatibilidad calculada correctamente.");
    } catch (err) {
      console.error("Error en ejecutarCalculo (TengoMaquinaria):", err);
      sileo.error(err.message || "Error de conexión. Verifica tu estado de red o el servidor.");
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Renders de los pasos del formulario
  // ---------------------------------------------------------------------------

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="mb-6 border-b border-border/40 pb-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground">Datos del implemento</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Ingresa las características de la máquina o encuéntrala en el catálogo.
        </p>
      </div>

      <div className="flex bg-secondary/30 p-1 rounded border border-border/40 w-fit mb-6">
        <button
          type="button"
          onClick={() => { setIsSimpleMode(true); setErrors({}); }}
          className={`px-4 py-2 text-sm font-medium rounded transition-all duration-200 ${isSimpleMode ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Calculadora Simple
        </button>
        <button
          type="button"
          onClick={() => { setIsSimpleMode(false); setErrors({}); }}
          className={`px-4 py-2 text-sm font-medium rounded transition-all duration-200 ${!isSimpleMode ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Calculadora Avanzada
        </button>
      </div>

      {errors.general && (
        <div className="p-3.5 bg-destructive/10 border border-destructive/20 text-destructive rounded text-sm mb-4" role="alert">
          {errors.general}
        </div>
      )}

      {isSimpleMode ? (
        <div className="p-5 border border-border/60 rounded bg-secondary/15 text-muted-foreground text-sm leading-relaxed">
          En la calculadora simple, solo necesitas buscar tu implemento desde el catálogo presionando el botón de la izquierda <strong>"Buscar en catálogo"</strong>. Nosotros rellenaremos los datos técnicos por ti.
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <label htmlFor="implement_type" className="text-sm font-medium leading-none block mb-1.5 text-foreground">
              Tipo de implemento
              <TooltipInfo content="Categoría del implemento agrícola que posees." />
            </label>
            <select
              id="implement_type"
              name="implement_type"
              value={formData.implement_type}
              onChange={handleChange}
              className={getInputClass('implement_type', errors)}
              aria-invalid={Boolean(errors.implement_type)}
              aria-describedby={errors.implement_type ? 'implement-error' : undefined}
            >
              <option value="">Seleccione una opción</option>
              {TIPOS_IMPLEMENTO.map((tipo) => (
                <option key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </option>
              ))}
            </select>
            {errors.implement_type && (
              <p id="implement-error" className="mt-1.5 text-xs text-destructive" role="alert">
                {errors.implement_type}
              </p>
            )}
          </div>

          <FieldWithPresets
            id="power_requirement_hp"
            name="power_requirement_hp"
            label="Potencia requerida base (HP)"
            tooltip="Potencia mínima recomendada por el fabricante del implemento en condiciones estándar (en HP)."
            value={formData.power_requirement_hp}
            onChange={handleChange}
            error={errors.power_requirement_hp}
            placeholder="HP"
            step="1"
            min="0"
            presets={POTENCIA_REQUERIDA_PRESETS}
            unknownDefault={POTENCIA_REQUERIDA_UNKNOWN_DEFAULT}
            unknownLabel="~70 HP (estándar)"
            inputClass={getInputClass('power_requirement_hp', errors)}
          />

          <FieldWithPresets
            id="working_width_m"
            name="working_width_m"
            label="Ancho de trabajo"
            tooltip="Ancho de la franja que cubre el implemento en cada pasada, en metros (m)."
            value={formData.working_width_m}
            onChange={handleChange}
            error={errors.working_width_m}
            placeholder="m"
            step="0.1"
            min="0"
            presets={ANCHO_TRABAJO_PRESETS}
            unknownDefault={ANCHO_TRABAJO_UNKNOWN_DEFAULT}
            unknownLabel="~2 m (estándar)"
            inputClass={getInputClass('working_width_m', errors)}
          />

          <FieldWithPresets
            id="working_depth_cm"
            name="working_depth_cm"
            label="Profundidad de trabajo"
            tooltip="Profundidad máxima a la que opera el implemento en el suelo, en centímetros (cm)."
            value={formData.working_depth_cm}
            onChange={handleChange}
            error={errors.working_depth_cm}
            placeholder="cm"
            step="1"
            min="0"
            presets={PROFUNDIDAD_PRESETS}
            unknownDefault={PROFUNDIDAD_UNKNOWN_DEFAULT}
            unknownLabel="~20 cm (labor media)"
            inputClass={getInputClass('working_depth_cm', errors)}
          />

          <FieldWithPresets
            id="weight_kg"
            name="weight_kg"
            label="Peso del implemento"
            tooltip="Peso total del implemento en kilogramos (kg)."
            value={formData.weight_kg}
            onChange={handleChange}
            error={errors.weight_kg}
            placeholder="kg"
            step="1"
            min="0"
            presets={PESO_IMPLEMENTO_PRESETS}
            unknownDefault={PESO_IMPLEMENTO_UNKNOWN_DEFAULT}
            unknownLabel="~700 kg (mediano)"
            inputClass={getInputClass('weight_kg', errors)}
          />

          <FieldWithPresets
            id="working_speed_kmh"
            name="working_speed_kmh"
            label="Velocidad de trabajo"
            tooltip="Velocidad estimada de la labor en km/h."
            value={formData.working_speed_kmh}
            onChange={handleChange}
            error={errors.working_speed_kmh}
            placeholder="km/h (opcional)"
            step="0.1"
            min="0"
            presets={[
              { label: '5 km/h', value: '5', hint: 'Labor lenta / profunda' },
              { label: '7 km/h', value: '7', hint: 'Labor típica' },
              { label: '10 km/h', value: '10', hint: 'Labor rápida / superficial' },
            ]}
            unknownDefault="7"
            unknownLabel="sistema usará 7 km/h"
            inputClass={getInputClass('working_speed_kmh', errors)}
          />
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="mb-6 border-b border-border/40 pb-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground">Condición del Terreno</h2>
        <p className="text-sm text-muted-foreground mt-1">
          ¿En qué tipo de suelo se utilizará el implemento?
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {TIPOS_SUELO.map((suelo) => (
          <label
            key={suelo.value}
            className={[
              "flex items-start gap-3 p-3.5 rounded border cursor-pointer transition-all duration-150",
              formData.soil_type === suelo.value
                ? "border-primary bg-secondary/10 shadow-sm"
                : "border-border/60 hover:border-border hover:bg-secondary/5",
            ].join(" ")}
          >
            <input
              type="radio"
              name="soil_type"
              value={suelo.value}
              checked={formData.soil_type === suelo.value}
              onChange={() => {
                setFormData((prev) => ({ ...prev, soil_type: suelo.value }));
                if (errors.soil_type) setErrors((prev) => ({ ...prev, soil_type: "" }));
              }}
              className="mt-1 h-4 w-4 accent-primary flex-shrink-0"
            />
            <div>
              <p className={`font-semibold text-sm leading-none ${formData.soil_type === suelo.value ? "text-primary" : "text-foreground"}`}>
                {suelo.label}
              </p>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                {suelo.descripcion}
              </p>
            </div>
          </label>
        ))}
      </div>

      {errors.soil_type && (
        <p className="mt-1.5 text-xs text-destructive" role="alert">
          {errors.soil_type}
        </p>
      )}
    </div>
  );

  const renderStep3 = () => {
    if (loading) {
      return (
        <div className="py-12 space-y-6 animate-pulse">
          <div className="h-6 bg-secondary/40 rounded w-1/4 mx-auto mb-4"></div>
          <div className="h-32 bg-secondary/30 rounded w-full"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      );
    }



    const { implement, powerRequirement, recommendations } = result || {};
    const hp =
      powerRequirement?.minimumPowerHp ||
      powerRequirement?.calculatedPowerHp ||
      0;
    const recommendedTractors = recommendations?.top5 || recommendations?.top_5 || [];

    const filteredTractors = recommendedTractors.filter(
      (t) =>
        !busqueda ||
        t.name?.toLowerCase().includes(busqueda.toLowerCase()) ||
        t.brand?.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
      <div className="space-y-8 animate-fadeIn">
        <div className="text-center mb-6 border-b border-border/40 pb-4">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Resultados del Análisis</h2>
          <p className="text-sm text-muted-foreground">
            Requisitos de potencia y compatibilidad de tractores recomendados.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Resumen implemento */}
          <div className="w-full md:w-1/2 bg-secondary/15 rounded border border-border/50 p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-foreground mb-3">
                {implement?.name ||
                  TIPOS_IMPLEMENTO.find((t) => t.value === formData.implement_type)?.label ||
                  "Implemento"}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Para operar este implemento de manera eficiente, optimizando la tracción y reduciendo la pérdida de potencia en el suelo seleccionado.
              </p>
            </div>
            <div className="text-xs text-muted-foreground/80 space-y-1.5 border-t border-border/30 pt-3">
              <p>Profundidad de trabajo: <strong className="text-foreground">{formData.working_depth_cm || 20} cm</strong></p>
              <p>Ancho de trabajo: <strong className="text-foreground">{formData.working_width_m || 2} m</strong></p>
              <p>Condición del suelo: <strong className="text-foreground">{TIPOS_SUELO.find(s => s.value === formData.soil_type)?.label || "Franco"}</strong></p>
            </div>
          </div>

          {/* Potencia requerida */}
          <div className="w-full md:w-1/2 bg-secondary/30 rounded border border-border/60 p-6 flex flex-col justify-center items-center text-center">
            <p className="text-sm text-muted-foreground mb-1">Potencia mínima estimada para operar</p>
            <div className="text-3xl font-extrabold text-[#909d00] my-2">
              {hp} HP
            </div>
            <p className="text-xs text-muted-foreground/80 mt-1">
              Se recomienda usar un tractor que cumpla o supere este rango.
            </p>
          </div>
        </div>

        {/* Recomendaciones de Tractores */}
        <div className="border-t border-border/40 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h3 className="text-lg font-bold text-foreground">Tractores Compatibles Recomendados</h3>
              <p className="text-xs text-muted-foreground">Tractores en catálogo con la potencia suficiente.</p>
            </div>
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Buscar tractor..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-border/60 rounded text-sm bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredTractors.length > 0 ? (
              filteredTractors.map((tractor) => (
                <TractorMachineCard
                  key={tractor.tractorId || tractor.id}
                  imageSrc={TractorImg}
                  link={`/tractor/${tractor.tractorId || tractor.id}`}
                  title={tractor.name || `${tractor.brand} ${tractor.model}`}
                  description={`Potencia: ${tractor.enginePowerHp} HP - Estado: ${tractor.suitability?.label || "Óptimo"}`}
                />
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-muted-foreground bg-secondary/10 rounded border border-dashed border-border/60">
                <p className="text-base font-semibold">No se encontraron tractores compatibles</p>
                <p className="text-xs mt-1">Prueba refinando la búsqueda o con otra potencia.</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <button
            type="button"
            onClick={resetWizard}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded hover:bg-primary/90 transition-colors shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            Nueva Búsqueda
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background flex flex-col items-center justify-start pt-10 pb-16 px-4">
      <div className={`w-full transition-all duration-300 ${step === 3 ? "max-w-5xl" : "max-w-4xl"}`}>
        
        {/* Step Indicator */}
        <div className="mb-8 px-1">
          <StepIndicator
            current={step}
            total={3}
            labels={["Implemento", "Suelo", "Resultados"]}
          />
        </div>

        {step < 3 ? (
          <div className="bg-card rounded border border-border/60 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]">

              {/* Panel Izquierdo: Imagen Descriptiva */}
              <div className="bg-secondary/30 border-b md:border-b-0 md:border-r border-border/60 p-6 flex flex-col items-center gap-5 justify-between">
                <div className="w-full aspect-[4/3] rounded overflow-hidden bg-card border border-border/60 flex items-center justify-center p-3">
                  <img
                    src={step === 1 ? implementImage : Suelo}
                    alt="Paso del implemento"
                    className="max-h-full max-w-full object-contain mix-blend-multiply"
                  />
                </div>

                {step === 1 && (
                  <div className="w-full space-y-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(true)}
                      className="w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded border border-border text-foreground text-sm font-medium hover:bg-muted/50 hover:text-primary transition-all"
                    >
                      <span className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Buscar en catálogo
                      </span>
                      <ChevronRight className="w-4 h-4 opacity-50" />
                    </button>
                    <p className="text-[11px] text-center text-muted-foreground/80">
                      Selecciona tu modelo para rellenar los datos automáticamente
                    </p>
                  </div>
                )}

                {step === 2 && (
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground/80 leading-relaxed">
                      El tipo de suelo afecta directamente la resistencia al rodamiento y la potencia de arrastre necesaria del tractor.
                    </p>
                  </div>
                )}
              </div>

              {/* Panel Derecho: Formulario */}
              <div className="p-6 md:p-8 flex flex-col justify-between">
                <div>
                  {step === 1 && renderStep1()}
                  {step === 2 && renderStep2()}
                </div>

                {/* Botones de navegación */}
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
                    {step === 2 ? "Calcular Potencia" : "Siguiente"}
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

      {/* Modal de Catálogo (para paso 1) */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-4xl md:max-w-5xl lg:max-w-6xl w-[95vw] max-h-[85vh] overflow-hidden flex flex-col p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
              Catálogo de Implementos
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground -mt-1">
            Selecciona tu modelo para rellenar los datos automáticamente.
          </p>

          <div className="flex-1 overflow-y-auto mt-4 pr-1">
            {isCatalogLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-7 h-7 border-[3px] border-primary border-t-transparent rounded-full animate-spin" aria-label="Cargando" />
              </div>
            ) : catalogLoadError ? (
              <div className="text-center py-12 text-destructive flex flex-col items-center gap-2">
                <p className="text-sm font-medium">{catalogLoadError}</p>
              </div>
            ) : implementsCatalog.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-sm">No se encontraron implementos en el catálogo.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {implementsCatalog.map((impl) => (
                  <button
                    key={impl.implementId}
                    type="button"
                    className="text-left border border-gray-200 rounded p-4 hover:border-primary hover:shadow-sm transition-all flex flex-col bg-white group"
                    onClick={() => handleImplementoSelect(impl)}
                    aria-label={`Seleccionar ${impl.brand} ${impl.implementName}, ${impl.powerRequirementHp} HP requerido`}
                  >
                    <div className="h-24 w-full flex items-center justify-center bg-gray-50 rounded mb-3 p-2 group-hover:bg-primary/5 transition-colors">
                      <img
                        src={impl.image || impl.imageUrl || impl.image_url || (impl.images && impl.images[0]) || MachineImg}
                        alt={impl.implementName}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <p className="font-semibold text-gray-800 text-sm leading-tight">{impl.brand}</p>
                    <p className="text-gray-500 text-xs mt-0.5 mb-2">{impl.implementName}</p>
                    <div className="mt-auto flex justify-between items-center">
                      <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">
                        {impl.powerRequirementHp} HP Req.
                      </span>
                      <span className="text-xs text-gray-400">{impl.weightKg} kg</span>
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
