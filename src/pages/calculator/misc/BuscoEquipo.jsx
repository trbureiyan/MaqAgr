import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { sileo } from "sileo";
import TooltipInfo from "@/components/ui/tooltip-info";
import SkeletonCard from "@/components/ui/SkeletonCard";
import StepIndicator from "../../../components/ui/StepIndicator";
import IconCamp from "../../../assets/icons/IconCamp.png";
import { getInputClass } from "../../../lib/formUtils";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Check,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RotateCcw,
  Zap,
  Scale,
  SlidersHorizontal,
  Tractor as TractorIcon,
  Wrench,
  X,
  Layers,
  ArrowRight,
} from "lucide-react";
import FieldWithPresets from "@/features/calculator/components/FieldWithPresets";

import { getTractors } from "../../../services/tractorApi";
import { getImplements } from "../../../services/implementApi";

const TIPOS_SUELO = [
  { value: "Clay", label: "Arcilloso" },
  { value: "Loam", label: "Franco" },
  { value: "Sand", label: "Arenoso" },
  { value: "Silt", label: "Limoso" },
  { value: "All", label: "Mixto / Cualquier Suelo" },
];

const TIPOS_LABOR = [
  { value: "Plow", label: "Arado", plural: "Arados" },
  { value: "Harrow", label: "Rastra", plural: "Rastras" },
  { value: "Seeder", label: "Sembradora", plural: "Sembradoras" },
  { value: "Sprayer", label: "Pulverizadora / Aspersora", plural: "Pulverizadoras" },
  { value: "Harvester", label: "Cosechadora", plural: "Cosechadoras" },
  { value: "Cultivator", label: "Cultivador", plural: "Cultivadores" },
  { value: "Mower", label: "Segadora", plural: "Segadoras" },
  { value: "Trailer", label: "Remolque", plural: "Remolques" },
  { value: "Other", label: "Otro Implemento", plural: "Otros Implementos" },
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

  // Filtros interactivos para el paso 3 (Resultados)
  const [searchFilter, setSearchFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("all");
  const [tractionFilter, setTractionFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'tractors' | 'implements'
  const [selectedTractor, setSelectedTractor] = useState(null);
  const [onlyCompatible, setOnlyCompatible] = useState(false);

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

  const resetAll = () => {
    setStep(1);
    setResultados({ tractores: [], implementos: [] });
    setSelectedTractor(null);
    setSearchFilter("");
    setBrandFilter("all");
    setTractionFilter("all");
    setActiveTab("all");
    setOnlyCompatible(false);
  };

  const ejecutarMatchmaking = async () => {
    setLoading(true);
    setSelectedTractor(null);
    setSearchFilter("");
    setBrandFilter("all");
    setTractionFilter("all");
    setActiveTab("all");
    setOnlyCompatible(false);
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

  // Helpers de texto en español
  const laborInfo = useMemo(() => {
    return (
      TIPOS_LABOR.find((l) => l.value === formData.labor_type) || {
        label: formData.labor_type || "Implemento",
        plural: formData.labor_type || "Implementos",
      }
    );
  }, [formData.labor_type]);

  const soilLabel = useMemo(() => {
    return (
      TIPOS_SUELO.find((s) => s.value === formData.soil_type)?.label ||
      formData.soil_type ||
      "No definido"
    );
  }, [formData.soil_type]);

  // Lista de marcas únicas encontradas en resultados
  const availableBrands = useMemo(() => {
    const brands = new Set();
    resultados.tractores.forEach((t) => t.brand && brands.add(t.brand));
    resultados.implementos.forEach((i) => i.brand && brands.add(i.brand));
    return Array.from(brands).sort();
  }, [resultados]);

  // Filtrado de Tractores
  const filteredTractors = useMemo(() => {
    return resultados.tractores.filter((t) => {
      const searchTarget = `${t.brand || ""} ${t.name || ""}`.toLowerCase();
      const matchSearch =
        !searchFilter.trim() ||
        searchTarget.includes(searchFilter.toLowerCase().trim());
      const matchBrand = brandFilter === "all" || t.brand === brandFilter;
      const matchTraction =
        tractionFilter === "all" ||
        (t.tractionType &&
          t.tractionType.toLowerCase().includes(tractionFilter.toLowerCase()));
      return matchSearch && matchBrand && matchTraction;
    });
  }, [resultados.tractores, searchFilter, brandFilter, tractionFilter]);

  // Filtrado de Implementos
  const filteredImplements = useMemo(() => {
    return resultados.implementos.filter((i) => {
      const searchTarget = `${i.brand || ""} ${i.implementName || ""}`.toLowerCase();
      const matchSearch =
        !searchFilter.trim() ||
        searchTarget.includes(searchFilter.toLowerCase().trim());
      const matchBrand = brandFilter === "all" || i.brand === brandFilter;

      if (selectedTractor && onlyCompatible && i.powerRequirementHp) {
        const isCompat =
          Number(selectedTractor.enginePowerHp) >= Number(i.powerRequirementHp);
        if (!isCompat) return false;
      }

      return matchSearch && matchBrand;
    });
  }, [resultados.implementos, searchFilter, brandFilter, selectedTractor, onlyCompatible]);

  // Conteo de implementos compatibles con el tractor seleccionado
  const compatibleCount = useMemo(() => {
    if (!selectedTractor) return 0;
    return resultados.implementos.filter(
      (i) =>
        !i.powerRequirementHp ||
        Number(selectedTractor.enginePowerHp) >= Number(i.powerRequirementHp)
    ).length;
  }, [selectedTractor, resultados.implementos]);

  // Verifica si hay algún filtro activo
  const hasActiveFilters =
    Boolean(searchFilter.trim()) ||
    brandFilter !== "all" ||
    tractionFilter !== "all" ||
    onlyCompatible;

  const clearFilters = () => {
    setSearchFilter("");
    setBrandFilter("all");
    setTractionFilter("all");
    setOnlyCompatible(false);
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
            { label: "5 km/h", value: "5", hint: "Labor lenta / profunda" },
            { label: "7 km/h", value: "7", hint: "Labor típica" },
            { label: "10 km/h", value: "10", hint: "Labor rápida / superficial" },
          ]}
          inputClass={getInputClass("working_speed_kmh", errors)}
        />
      </div>
    </div>
  );

  // --------------------------------------------------------
  // Render Step 3 (Resultados con Filtros y Emparejador)
  // --------------------------------------------------------
  const renderStep3 = () => (
    <div className="space-y-6 w-full animate-fadeIn">
      {/* ── Encabezado Principal ── */}
      <div className="text-center border-b border-border/40 pb-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" /> Matchmaking Agro-Mecánico
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Resultados de Compatibilidad
        </h2>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto mt-1">
          Recomendaciones coordinadas de maquinaria según las condiciones de tu terreno y labor agrícola.
        </p>
      </div>

      {/* ── Resumen de Búsqueda (Pills de Contexto) ── */}
      <div className="bg-secondary/20 rounded-lg p-3 sm:p-4 border border-border/60 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-muted-foreground font-medium">Búsqueda actual:</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-card border border-border/60 font-semibold text-foreground">
            📍 Suelo {soilLabel}
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-card border border-border/60 font-semibold text-foreground">
            📐 {formData.hectares} Ha
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-card border border-border/60 font-semibold text-primary">
            🛠️ Labor: {laborInfo.label}
          </span>
          {formData.min_power_hp && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-card border border-border/60 text-muted-foreground">
              ⚡ Min {formData.min_power_hp} HP
            </span>
          )}
          {formData.max_weight_kg && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-card border border-border/60 text-muted-foreground">
              ⚖️ Máx {formData.max_weight_kg} kg
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setStep(2)}
          className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors underline underline-offset-4"
        >
          Modificar parámetros
        </button>
      </div>

      {/* ── Barra de Filtros Rápidos ── */}
      <div className="bg-card rounded-lg border border-border/60 p-4 space-y-3 shadow-xs">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Buscador de texto */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Buscar por marca o modelo..."
              className="w-full pl-9 pr-8 py-2 text-sm bg-background border border-border/60 rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground"
            />
            {searchFilter && (
              <button
                type="button"
                onClick={() => setSearchFilter("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filtro por Marca */}
          {availableBrands.length > 0 && (
            <div className="flex items-center gap-2">
              <label htmlFor="brand-filter" className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                Marca:
              </label>
              <select
                id="brand-filter"
                value={brandFilter}
                onChange={(e) => setBrandFilter(e.target.value)}
                className="text-sm bg-background border border-border/60 rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="all">Todas las marcas</option>
                {availableBrands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Filtro de Tracción (4x4 / 4x2) */}
          <div className="flex items-center gap-1.5 bg-secondary/30 p-1 rounded-md border border-border/50 text-xs">
            <span className="px-2 text-muted-foreground font-medium hidden sm:inline">Tracción:</span>
            {["all", "4x4", "4x2"].map((trac) => (
              <button
                key={trac}
                type="button"
                onClick={() => setTractionFilter(trac)}
                className={`px-2.5 py-1 rounded font-medium transition-all ${tractionFilter === trac
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {trac === "all" ? "Todas" : trac}
              </button>
            ))}
          </div>

          {/* Limpiar Filtros */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1 text-xs font-medium text-destructive hover:underline px-2 py-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Limpiar
            </button>
          )}
        </div>

        {/* Pestañas de Vista Rápida */}
        <div className="flex items-center justify-between border-t border-border/40 pt-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${activeTab === "all"
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "text-muted-foreground hover:bg-muted"
                }`}
            >
              Vista Completa ({filteredTractors.length + filteredImplements.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("tractors")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${activeTab === "tractors"
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "text-muted-foreground hover:bg-muted"
                }`}
            >
              Tractores ({filteredTractors.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("implements")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${activeTab === "implements"
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "text-muted-foreground hover:bg-muted"
                }`}
            >
              {laborInfo.plural} ({filteredImplements.length})
            </button>
          </div>

          <div className="text-xs text-muted-foreground">
            💡 <span className="font-medium text-foreground">Tip:</span> Selecciona un tractor para validar acople con los implementos.
          </div>
        </div>
      </div>

      {/* ── Banner de Emparejador Interactivo (Si hay un tractor seleccionado) ── */}
      {selectedTractor && (
        <div className="bg-primary/10 border-2 border-primary/40 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeIn shadow-xs">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-sm">
              <TractorIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Emparejando con tractor
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-card border border-primary/30 font-bold text-foreground">
                  ⚡ {selectedTractor.enginePowerHp} HP
                </span>
              </div>
              <h4 className="font-bold text-base text-foreground mt-0.5">
                {selectedTractor.brand} {selectedTractor.name}
              </h4>
              <p className="text-xs text-muted-foreground">
                Evaluando compatibilidad de demanda de potencia con los {laborInfo.plural.toLowerCase()}.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center">
            <label className="flex items-center gap-2 text-xs font-medium cursor-pointer text-foreground select-none bg-card px-3 py-2 rounded-md border border-border/60 hover:border-primary/50">
              <input
                type="checkbox"
                checked={onlyCompatible}
                onChange={(e) => setOnlyCompatible(e.target.checked)}
                className="rounded accent-primary w-4 h-4 cursor-pointer"
              />
              Solo 100% compatibles ({compatibleCount})
            </label>
            <button
              type="button"
              onClick={() => {
                setSelectedTractor(null);
                setOnlyCompatible(false);
              }}
              className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-md bg-secondary hover:bg-secondary/80 text-foreground transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Quitar selección
            </button>
          </div>
        </div>
      )}

      {/* ── Contenido de Resultados ── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full transition-opacity duration-300">
          <div>
            <h3 className="font-semibold text-base text-primary mb-4 flex items-center gap-2">
              <TractorIcon className="w-4 h-4" /> Analizando Tractores recomendados...
            </h3>
            <div className="space-y-4">
              <SkeletonCard />
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-base text-primary mb-4 flex items-center gap-2">
              <Wrench className="w-4 h-4" /> Analizando {laborInfo.plural}...
            </h3>
            <div className="space-y-4">
              <SkeletonCard />
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`grid gap-6 transition-all duration-300 ${activeTab === "all"
              ? "grid-cols-1 lg:grid-cols-2"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            }`}
        >
          {/* ════════════════════════════════════════════════════════════
              COLUMNA / VISTA: TRACTORES
          ════════════════════════════════════════════════════════════ */}
          {(activeTab === "all" || activeTab === "tractors") && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <TractorIcon className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-lg text-foreground">
                    Tractores Ideales
                  </h3>
                </div>
                <span className="bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full font-bold border border-primary/20">
                  {filteredTractors.length} disponibles
                </span>
              </div>

              {filteredTractors.length === 0 ? (
                <div className="bg-secondary/15 rounded-lg border border-border/60 p-8 text-center">
                  <p className="text-sm text-muted-foreground font-medium">
                    No se encontraron tractores con los filtros seleccionados.
                  </p>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="mt-3 text-xs font-semibold text-primary underline"
                    >
                      Restablecer filtros
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTractors.map((t) => {
                    const isSelected = selectedTractor?.tractorId === t.tractorId;
                    return (
                      <div
                        key={t.tractorId}
                        onClick={() =>
                          setSelectedTractor(isSelected ? null : t)
                        }
                        className={`group relative p-4 rounded-lg border transition-all duration-200 cursor-pointer ${isSelected
                            ? "bg-primary/5 border-primary shadow-md ring-1 ring-primary/40"
                            : "bg-card border-border/70 hover:border-primary/50 hover:shadow-xs"
                          }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-muted-foreground/90 bg-secondary/50 px-2 py-0.5 rounded">
                              {t.brand || "Maquinaria"}
                            </span>
                            <h4 className="font-bold text-base text-foreground mt-1 group-hover:text-primary transition-colors">
                              {t.brand} {t.name}
                            </h4>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTractor(isSelected ? null : t);
                            }}
                            className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all ${isSelected
                                ? "bg-primary text-primary-foreground shadow-xs"
                                : "bg-secondary text-secondary-foreground hover:bg-primary/10 hover:text-primary"
                              }`}
                          >
                            {isSelected ? (
                              <>
                                <Check className="w-3.5 h-3.5" /> Seleccionado
                              </>
                            ) : (
                              <>Emparejar</>
                            )}
                          </button>
                        </div>

                        {/* Métricas con iconos */}
                        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-border/40 text-xs">
                          <div className="bg-secondary/20 rounded p-2">
                            <span className="text-muted-foreground block text-[10px] font-medium flex items-center gap-1">
                              <Zap className="w-3 h-3 text-amber-500" /> Potencia
                            </span>
                            <span className="font-bold text-foreground text-sm">
                              {t.enginePowerHp} HP
                            </span>
                          </div>

                          <div className="bg-secondary/20 rounded p-2">
                            <span className="text-muted-foreground block text-[10px] font-medium flex items-center gap-1">
                              <TractorIcon className="w-3 h-3 text-primary" /> Tracción
                            </span>
                            <span className="font-bold text-foreground text-sm">
                              {t.tractionType || "Estándar"}
                            </span>
                          </div>

                          <div className="bg-secondary/20 rounded p-2">
                            <span className="text-muted-foreground block text-[10px] font-medium flex items-center gap-1">
                              <Scale className="w-3 h-3 text-blue-500" /> Peso
                            </span>
                            <span className="font-bold text-foreground text-sm">
                              {t.weightKg ? `${t.weightKg} kg` : "N/D"}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════
              COLUMNA / VISTA: IMPLEMENTOS
          ════════════════════════════════════════════════════════════ */}
          {(activeTab === "all" || activeTab === "implements") && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-lg text-foreground">
                    Implementos: {laborInfo.plural}
                  </h3>
                </div>
                <span className="bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full font-bold border border-primary/20">
                  {filteredImplements.length} compatibles
                </span>
              </div>

              {filteredImplements.length === 0 ? (
                <div className="bg-secondary/15 rounded-lg border border-border/60 p-8 text-center">
                  <p className="text-sm text-muted-foreground font-medium">
                    No se encontraron {laborInfo.plural.toLowerCase()} bajo estos criterios.
                  </p>
                  {onlyCompatible && (
                    <button
                      type="button"
                      onClick={() => setOnlyCompatible(false)}
                      className="mt-3 text-xs font-semibold text-primary underline"
                    >
                      Mostrar todos los implementos
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredImplements.map((i) => {
                    // Evaluación de compatibilidad interactiva con tractor seleccionado
                    let compatibilityStatus = null;
                    if (selectedTractor) {
                      const reqHp = Number(i.powerRequirementHp) || 0;
                      const tracHp = Number(selectedTractor.enginePowerHp) || 0;
                      const isCompatible = tracHp >= reqHp;
                      const powerRatio = reqHp > 0 ? Math.round((reqHp / tracHp) * 100) : 0;
                      const diffHp = reqHp - tracHp;

                      compatibilityStatus = {
                        isCompatible,
                        powerRatio,
                        diffHp,
                      };
                    }

                    return (
                      <div
                        key={i.implementId}
                        className={`p-4 rounded-lg border transition-all duration-200 bg-card ${compatibilityStatus?.isCompatible
                            ? "border-emerald-500/40 hover:border-emerald-500/80"
                            : compatibilityStatus && !compatibilityStatus.isCompatible
                              ? "border-amber-500/40 opacity-80"
                              : "border-border/70 hover:border-primary/50 hover:shadow-xs"
                          }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-muted-foreground/90 bg-secondary/50 px-2 py-0.5 rounded">
                              {i.brand || "Implemento"}
                            </span>
                            <h4 className="font-bold text-base text-foreground mt-1">
                              {i.brand} {i.implementName}
                            </h4>
                          </div>

                          {/* Tag de compatibilidad si hay tractor seleccionado */}
                          {compatibilityStatus && (
                            <span
                              className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold ${compatibilityStatus.isCompatible
                                  ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30"
                                  : "bg-amber-500/10 text-amber-600 border border-amber-500/30"
                                }`}
                            >
                              {compatibilityStatus.isCompatible ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Compatible ({compatibilityStatus.powerRatio}%)
                                </>
                              ) : (
                                <>
                                  <AlertCircle className="w-3.5 h-3.5" /> Faltan {compatibilityStatus.diffHp} HP
                                </>
                              )}
                            </span>
                          )}
                        </div>

                        {/* Métricas con iconos */}
                        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-border/40 text-xs">
                          <div className="bg-secondary/20 rounded p-2">
                            <span className="text-muted-foreground block text-[10px] font-medium flex items-center gap-1">
                              <Zap className="w-3 h-3 text-amber-500" /> Req. Potencia
                            </span>
                            <span className="font-bold text-foreground text-sm">
                              {i.powerRequirementHp ? `${i.powerRequirementHp} HP` : "N/D"}
                            </span>
                          </div>

                          <div className="bg-secondary/20 rounded p-2">
                            <span className="text-muted-foreground block text-[10px] font-medium flex items-center gap-1">
                              <SlidersHorizontal className="w-3 h-3 text-primary" /> Ancho
                            </span>
                            <span className="font-bold text-foreground text-sm">
                              {i.workingWidthM ? `${i.workingWidthM} m` : "N/D"}
                            </span>
                          </div>

                          <div className="bg-secondary/20 rounded p-2">
                            <span className="text-muted-foreground block text-[10px] font-medium flex items-center gap-1">
                              <Scale className="w-3 h-3 text-blue-500" /> Peso
                            </span>
                            <span className="font-bold text-foreground text-sm">
                              {i.weightKg ? `${i.weightKg} kg` : "N/D"}
                            </span>
                          </div>
                        </div>

                        {/* Mensaje detallado de emparejamiento */}
                        {compatibilityStatus && (
                          <div className="mt-2.5 pt-2 border-t border-border/30 text-[11px] text-muted-foreground">
                            {compatibilityStatus.isCompatible ? (
                              <p className="text-emerald-700 font-medium">
                                ✓ Este tractor de {selectedTractor.enginePowerHp} HP soporta con holgura los {i.powerRequirementHp} HP demandados por el implemento.
                              </p>
                            ) : (
                              <p className="text-amber-700 font-medium">
                                ⚠️ El tractor seleccionado ({selectedTractor.enginePowerHp} HP) no alcanza la potencia sugerida de {i.powerRequirementHp} HP.
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Botones de Acción al Pie ── */}
      {!loading && (
        <div className="flex flex-wrap items-center justify-center gap-4 pt-6 border-t border-border/40">
          <button
            type="button"
            onClick={() => setStep(2)}
            className="flex items-center gap-2 px-5 py-2.5 bg-background border border-border text-foreground text-sm font-semibold rounded hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Modificar Parámetros
          </button>
          <button
            type="button"
            onClick={resetAll}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded hover:bg-primary/90 transition-colors shadow-sm"
          >
            <RotateCcw className="w-4 h-4" /> Nueva Búsqueda
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background flex flex-col items-center justify-start pt-10 pb-16 px-4">
      <div className={`w-full transition-all duration-300 ${step === 3 ? "max-w-6xl" : "max-w-4xl"}`}>

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
