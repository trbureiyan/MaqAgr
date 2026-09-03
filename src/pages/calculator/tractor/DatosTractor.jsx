/**
 * @fileoverview Flujo unificado e inline de "Tengo Tractor" — Asistente de un solo paso.
 *
 * Integra la selección del motor (catálogo o manual), llantas, terreno,
 * clima y muestra los resultados directamente sin navegación del navegador.
 *
 * @module pages/DatosTractor
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sileo } from "sileo";
import { PiTractorFill, PiTireFill } from "react-icons/pi";
import { GiSunCloud } from "react-icons/gi";
import FieldWithPresets from "@/features/calculator/components/FieldWithPresets";
import { getInputClass } from "../../../lib/formUtils";
import {
  PB_PRESETS, PB_UNKNOWN_DEFAULT,
  PMAX_TDP_PRESETS, PMAX_TDP_UNKNOWN_DEFAULT,
  PESO_PRESETS, PESO_UNKNOWN_DEFAULT,
  DIAMETRO_LLANTA_PRESETS, DIAMETRO_LLANTA_UNKNOWN_DEFAULT,
  PRESION_PRESETS, PRESION_UNKNOWN_DEFAULT,
  ALTITUD_PRESETS, ALTITUD_UNKNOWN_DEFAULT,
  TEMPERATURA_PRESETS, TEMPERATURA_UNKNOWN_DEFAULT,
  PENDIENTE_PRESETS, PENDIENTE_UNKNOWN_DEFAULT,
  PATINAMIENTO_PRESETS, PATINAMIENTO_UNKNOWN_DEFAULT,
} from "../../../lib/fieldPresets";
import { getTractors } from "../../../services/tractorApi";
import { getImplements } from "../../../services/implementApi";
import { calculateDirectPowerLoss } from "../../../services/calculationApi";
import TractorMachineCard from "@/features/tractors/components/TractorMachineCard";
import MachineImg from "../../../assets/icons/plow.webp";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { ChevronRight, ChevronLeft, BookOpen, RotateCcw, Search } from "lucide-react";
import StepIndicator from "../../../components/ui/StepIndicator";
import SkeletonCard from "@/components/ui/SkeletonCard";

export default function DatosTractor() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSimpleMode, setIsSimpleMode] = useState(true);
  const [errors, setErrors] = useState({});
  const [tractorsCatalog, setTractorsCatalog] = useState([]);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tractorImage, setTractorImage] = useState(() => PiTractorFill);

  // Estados de cálculo final
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [implementsList, setImplementsList] = useState([]);
  const [busquedaImplemento, setBusquedaImplemento] = useState("");
  const [isLoadingImplements, setIsLoadingImplements] = useState(false);

  // Estado del formulario unificado
  const [formData, setFormData] = useState({
    // Paso 1: Motor
    pb: "",
    pmax_tdp: "",
    peso: "",
    turbo: "",

    // Paso 2: Llantas
    diametroLlanta: "",
    presionInflado: "",
    soil_type: "",
    tamanoLlanta: "", // Simple Mode

    // Paso 3: Clima
    altitudeM: "",
    ambientTemperatureC: "",
    slopePercent: "",
    slippagePercent: "",
    altitudSimple: "", // Simple Mode
    temperaturaSimple: "", // Simple Mode
    workingSpeedKmh: "", // Advanced Mode speed
  });

  // Carga del catálogo de tractores
  useEffect(() => {
    const fetchTractores = async () => {
      setIsLoadingCatalog(true);
      try {
        const response = await getTractors({ limit: 100 });
        if (response.success && response.data) {
          setTractorsCatalog(response.data);
        }
      } catch (error) {
        console.error("Error al cargar tractores:", error);
      } finally {
        setIsLoadingCatalog(false);
      }
    };
    fetchTractores();
  }, []);

  const handleTractorSelect = (tractor) => {
    setFormData((prev) => ({
      ...prev,
      pb: tractor.enginePowerHp || "",
      pmax_tdp: tractor.enginePowerHp
        ? (tractor.enginePowerHp * 0.86).toFixed(1)
        : "",
      peso: tractor.weightKg || "",
      turbo:
        tractor.hasTurbo === true ? "si"
        : tractor.hasTurbo === false ? "no"
        : "",
    }));
    const img =
      tractor.image || tractor.imageUrl || tractor.image_url ||
      (tractor.images && tractor.images[0]) || PiTractorFill;
    setTractorImage(() => img);
    setErrors({});
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };

      if (name === "pb") {
        const num = Number(value);
        if (value !== "" && Number.isFinite(num) && num > 0) {
          next.pmax_tdp = String(+(num * 0.86).toFixed(1));
        } else if (value === "") {
          next.pmax_tdp = "";
        }
      } else if (name === "pmax_tdp") {
        const num = Number(value);
        if (value !== "" && Number.isFinite(num) && num > 0) {
          next.pb = String(+(num / 0.86).toFixed(1));
        } else if (value === "") {
          next.pb = "";
        }
      }

      return next;
    });

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (name === "pb" && errors.pmax_tdp) setErrors((prev) => ({ ...prev, pmax_tdp: "" }));
    if (name === "pmax_tdp" && errors.pb) setErrors((prev) => ({ ...prev, pb: "" }));
  };

  const validateStep1 = () => {
    const err = {};
    const missing = [];

    if (isSimpleMode) {
      if (!formData.pb) {
        err.general = "Por favor busca y selecciona un tractor del catálogo.";
        sileo.warning("Estás dejando vacío el tractor del catálogo.");
      }
      return err;
    }

    const pbVal = Number(formData.pb);
    if (!formData.pb || !Number.isFinite(pbVal) || pbVal <= 0) {
      err.pb = "Ingresa la potencia bruta (HP) como un número válido.";
      missing.push("Potencia Bruta");
    }
    const pmaxVal = Number(formData.pmax_tdp);
    if (!formData.pmax_tdp || !Number.isFinite(pmaxVal) || pmaxVal <= 0) {
      err.pmax_tdp = "Ingresa la potencia TDP (HP) como un número válido.";
      missing.push("Potencia Máxima TDP");
    }
    const pesoVal = Number(formData.peso);
    if (!formData.peso || !Number.isFinite(pesoVal) || pesoVal <= 0) {
      err.peso = "Ingresa el peso operativo (kg) como un número válido.";
      missing.push("Peso Operativo");
    }
    if (!formData.turbo) {
      err.turbo = "Selecciona si el motor tiene turbo.";
      missing.push("Motor turboalimentado");
    }

    if (missing.length > 0) {
      sileo.warning(`Estás dejando vacío(s) el/los campo(s): ${missing.join(", ")}.`);
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
      const emptyFields = [];
      if (isSimpleMode) {
        if (!formData.tamanoLlanta) emptyFields.push("Tamaño de llanta");
      } else {
        if (!formData.diametroLlanta) emptyFields.push("Diámetro de llanta");
        if (!formData.presionInflado) emptyFields.push("Presión de inflado");
      }
      if (!formData.soil_type) emptyFields.push("Tipo de suelo");

      if (emptyFields.length > 0) {
        sileo.warning(`Estás dejando vacío(s) el/los campo(s): ${emptyFields.join(", ")}.`);
      }
      setStep(3);
    } else if (step === 3) {
      const emptyFields = [];
      if (isSimpleMode) {
        if (!formData.altitudSimple) emptyFields.push("Altitud");
        if (!formData.temperaturaSimple) emptyFields.push("Temperatura ambiente");
      } else {
        if (!formData.altitudeM) emptyFields.push("Altitud");
        if (!formData.ambientTemperatureC) emptyFields.push("Temperatura ambiente");
        if (!formData.slopePercent) emptyFields.push("Pendiente");
        if (!formData.slippagePercent) emptyFields.push("Patinamiento");
        if (!formData.workingSpeedKmh) emptyFields.push("Velocidad de trabajo");
      }

      if (emptyFields.length > 0) {
        sileo.warning(`Estás dejando vacío(s) el/los campo(s): ${emptyFields.join(", ")}.`);
      }
      setStep(4);
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
      pb: "",
      pmax_tdp: "",
      peso: "",
      turbo: "",
      diametroLlanta: "",
      presionInflado: "",
      soil_type: "",
      tamanoLlanta: "",
      altitudeM: "",
      ambientTemperatureC: "",
      slopePercent: "",
      slippagePercent: "",
      altitudSimple: "",
      temperaturaSimple: "",
      workingSpeedKmh: "",
    });
    setTractorImage(() => PiTractorFill);
    setResult(null);
    setImplementsList([]);
    setBusquedaImplemento("");
    setErrors({});
  };

  const ejecutarCalculo = async () => {
    setLoading(true);
    sileo.info("Calculando pérdida de potencia...");

    const toNumberOrNull = (value) => {
      if (value === null || value === undefined || value === "") return null;
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : null;
    };

    // Diámetro llanta
    let diametroLlanta = null;
    if (isSimpleMode) {
      if (formData.tamanoLlanta === "pequenas") diametroLlanta = 24;
      else if (formData.tamanoLlanta === "medianas") diametroLlanta = 30;
      else if (formData.tamanoLlanta === "grandes") diametroLlanta = 38;
    } else {
      diametroLlanta = toNumberOrNull(formData.diametroLlanta);
    }

    const presionInflado = isSimpleMode ? null : toNumberOrNull(formData.presionInflado);

    // Altitud
    let altitudeM = null;
    if (isSimpleMode) {
      if (formData.altitudSimple === "mar") altitudeM = 0;
      else if (formData.altitudSimple === "optimo") altitudeM = 1000;
      else if (formData.altitudSimple === "alta") altitudeM = 2500;
    } else {
      altitudeM = toNumberOrNull(formData.altitudeM);
    }

    // Temperatura
    let ambientTemperatureC = null;
    if (isSimpleMode) {
      if (formData.temperaturaSimple === "frio") ambientTemperatureC = 15;
      else if (formData.temperaturaSimple === "templado") ambientTemperatureC = 22;
      else if (formData.temperaturaSimple === "caliente") ambientTemperatureC = 30;
    } else {
      ambientTemperatureC = toNumberOrNull(formData.ambientTemperatureC);
    }

    const slopePercent = isSimpleMode ? 0 : toNumberOrNull(formData.slopePercent);
    const slippagePercentInput = isSimpleMode ? 15 : toNumberOrNull(formData.slippagePercent);
    const slippagePercent = slippagePercentInput === null
      ? null
      : Math.min(100, Math.max(0, slippagePercentInput));

    const workingSpeedKmh = isSimpleMode ? 7 : (toNumberOrNull(formData.workingSpeedKmh) || 7);

    const hasTurbo = formData.turbo === "si";

    const payload = {
      enginePowerHp: toNumberOrNull(formData.pb),
      pmaxTdpHp: toNumberOrNull(formData.pmax_tdp),
      weightKg: toNumberOrNull(formData.peso),
      hasTurbo,
      tireDiameterIn: diametroLlanta,
      tirePressurePsi: presionInflado,
      soilType: formData.soil_type || 'loam',
      altitudeM,
      ambientTemperatureC,
      slopePercent,
      slippagePercent,
      workingSpeedKmh,
      carriedObjectsWeightKg: 0,
    };

    try {
      const response = await calculateDirectPowerLoss(payload);
      const resData = response?.data ?? response;
      setResult(resData);
      sileo.success("Cálculo completado con éxito.");

      // Cargar implementos compatibles en base a la potencia útil disponible
      try {
        setIsLoadingImplements(true);
        const netPower = resData?.netPowerHp || toNumberOrNull(formData.pb) || 100;
        const impRes = await getImplements({ limit: 100 });
        const allImplements = impRes?.data || [];

        const evaluated = allImplements.map((imp) => {
          const reqHp = Number(imp.powerRequirementHp || imp.power_requirement_hp || 0);
          let suitability = { label: "Óptimo", color: "green" };
          if (reqHp > netPower) {
            suitability = { label: "Potencia Insuficiente", color: "red" };
          } else if (reqHp < netPower * 0.5) {
            suitability = { label: "Sobredimensionado", color: "yellow" };
          } else {
            suitability = { label: "Óptimo", color: "green" };
          }
          return {
            ...imp,
            reqHp,
            suitability,
            isCompatible: reqHp <= netPower,
          };
        });

        // Priorizar los implementos compatibles
        const compatibles = evaluated
          .filter((i) => i.isCompatible)
          .sort((a, b) => b.reqHp - a.reqHp);

        setImplementsList(compatibles.length > 0 ? compatibles : evaluated);
      } catch (errImp) {
        console.error("Error al obtener implementos compatibles:", errImp);
      } finally {
        setIsLoadingImplements(false);
      }
    } catch (err) {
      console.error("Error en ejecutarCalculo (TengoTractor):", err);
      sileo.error(err.message || "Error de conexión. Verifica tu estado de red o el servidor.");
      setStep(3);
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
        <h2 className="text-xl font-bold tracking-tight text-foreground">Datos del motor</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Especificaciones técnicas del tractor. Enfoca cada campo para ver valores de referencia.
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
          En la calculadora simple, solo necesitas buscar tu tractor desde el catálogo presionando el botón de la izquierda <strong>"Buscar en catálogo"</strong>. Nosotros rellenaremos los datos mecánicos complejos por ti.
        </div>
      ) : (
        <div className="space-y-6">
          <FieldWithPresets
            id="pb"
            name="pb"
            label="Potencia Bruta"
            tooltip="Potencia bruta del motor (HP). Se encuentra en el manual o la placa del tractor."
            value={formData.pb}
            onChange={handleChange}
            error={errors.pb}
            placeholder="HP"
            min="1"
            unit="HP"
            presets={PB_PRESETS}
            unknownDefault={PB_UNKNOWN_DEFAULT}
            unknownLabel="80 HP, valor típico"
            inputClass={getInputClass('pb', errors)}
          />

          <FieldWithPresets
            id="pmax_tdp"
            name="pmax_tdp"
            label="Potencia Máxima TDP"
            tooltip="Potencia en la Toma de Fuerza (TDF). Usualmente ≈ 86% de la potencia bruta."
            value={formData.pmax_tdp}
            onChange={handleChange}
            error={errors.pmax_tdp}
            placeholder="HP"
            min="1"
            unit="HP"
            presets={PMAX_TDP_PRESETS}
            unknownDefault={PMAX_TDP_UNKNOWN_DEFAULT}
            unknownLabel="69 HP (86% de 80)"
            inputClass={getInputClass('pmax_tdp', errors)}
          />

          <FieldWithPresets
            id="peso"
            name="peso"
            label="Peso Operativo"
            tooltip="Peso del tractor con contrapesos y combustible, en kilogramos."
            value={formData.peso}
            onChange={handleChange}
            error={errors.peso}
            placeholder="kg"
            min="1"
            unit="kg"
            presets={PESO_PRESETS}
            unknownDefault={PESO_UNKNOWN_DEFAULT}
            unknownLabel="4 500 kg, estándar mediano"
            inputClass={getInputClass('peso', errors)}
          />

          <div>
            <label htmlFor="turbo" className="text-sm font-medium leading-none block mb-1.5 text-foreground">
              Motor turboalimentado
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
              <option value="">¿Tiene turbocompresor?</option>
              <option value="si">Sí — motor turboalimentado</option>
              <option value="no">No — motor atmosférico natural</option>
            </select>
            {errors.turbo && (
              <p id="turbo-error" className="mt-1.5 text-xs text-destructive" role="alert">
                {errors.turbo}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="mb-6 border-b border-border/40 pb-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground">Llantas y Suelo</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Especifica las características de rodamiento y el terreno. Todos estos campos son opcionales.
        </p>
      </div>

      {isSimpleMode ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="tamanoLlanta" className="text-sm font-medium text-foreground block mb-1.5">
              Tamaño de la llanta (Pulgadas)
            </label>
            <select
              id="tamanoLlanta"
              name="tamanoLlanta"
              value={formData.tamanoLlanta}
              onChange={handleChange}
              className={getInputClass('tamanoLlanta', {})}
            >
              <option value="">Selecciona el tamaño (Opcional)</option>
              <option value="pequenas">Pequeñas (R24)</option>
              <option value="medianas">Medianas (R30)</option>
              <option value="grandes">Grandes (R38)</option>
            </select>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FieldWithPresets
            id="diametroLlanta"
            name="diametroLlanta"
            label="Diámetro de llanta"
            tooltip="Diámetro total de la llanta en pulgadas (in)"
            value={formData.diametroLlanta}
            onChange={handleChange}
            placeholder="Pulgadas (in)"
            min="0"
            unit="in"
            presets={DIAMETRO_LLANTA_PRESETS}
            unknownDefault={DIAMETRO_LLANTA_UNKNOWN_DEFAULT}
            unknownLabel="dejar vacío"
            inputClass={getInputClass('diametroLlanta', {})}
          />

          <FieldWithPresets
            id="presionInflado"
            name="presionInflado"
            label="Presión de inflado"
            tooltip="Presión de las llantas en PSI"
            value={formData.presionInflado}
            onChange={handleChange}
            placeholder="PSI"
            min="0"
            unit="PSI"
            presets={PRESION_PRESETS}
            unknownDefault={PRESION_UNKNOWN_DEFAULT}
            unknownLabel="dejar vacío"
            inputClass={getInputClass('presionInflado', {})}
          />
        </div>
      )}

      <div>
        <label htmlFor="soil_type" className="text-sm font-medium text-foreground block mb-1.5">
          Tipo de suelo
        </label>
        <select
          id="soil_type"
          name="soil_type"
          value={formData.soil_type}
          onChange={handleChange}
          className={getInputClass('soil_type', errors)}
        >
          <option value="">Seleccione una opción</option>
          <option value="clay">Arcilloso — Suelo pesado, alta retención de agua</option>
          <option value="sandy">Arenoso — Suelo ligero, baja retención de agua</option>
          <option value="loam">Franco — Suelo equilibrado, mezcla de arena, limo y arcilla</option>
          <option value="silt">Limoso — Suelo de grano fino, propenso a compactación</option>
        </select>
        {errors.soil_type && (
          <p className="mt-1.5 text-xs text-destructive" role="alert">
            {errors.soil_type}
          </p>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="mb-6 border-b border-border/40 pb-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground">Clima y Terreno</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Todos estos campos son opcionales. El sistema usará valores estándar si los dejas vacíos.
        </p>
      </div>

      {isSimpleMode ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="altitudSimple" className="text-sm font-medium text-foreground block mb-1.5">
              Altitud
            </label>
            <select
              id="altitudSimple"
              name="altitudSimple"
              value={formData.altitudSimple}
              onChange={handleChange}
              className={getInputClass('altitudSimple', {})}
            >
              <option value="">Selecciona altitud (Opcional)</option>
              <option value="mar">Nivel del mar (0 msnm)</option>
              <option value="optimo">Nivel medio (1000 msnm)</option>
              <option value="alta">Altura elevada (2500 msnm)</option>
            </select>
          </div>

          <div>
            <label htmlFor="temperaturaSimple" className="text-sm font-medium text-foreground block mb-1.5">
              Temperatura ambiente
            </label>
            <select
              id="temperaturaSimple"
              name="temperaturaSimple"
              value={formData.temperaturaSimple}
              onChange={handleChange}
              className={getInputClass('temperaturaSimple', {})}
            >
              <option value="">Selecciona temperatura (Opcional)</option>
              <option value="frio">Frío (15 °C)</option>
              <option value="templado">Templado (22 °C)</option>
              <option value="caliente">Caliente (30 °C)</option>
            </select>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FieldWithPresets
              id="altitudeM"
              name="altitudeM"
              label="Altitud"
              tooltip="Altura sobre el nivel del mar en metros (msnm)"
              value={formData.altitudeM}
              onChange={handleChange}
              placeholder="msnm"
              min="0"
              unit="msnm"
              presets={ALTITUD_PRESETS}
              unknownDefault="0"
              unknownLabel="0 msnm (nivel del mar)"
              inputClass={getInputClass('altitudeM', {})}
            />

            <FieldWithPresets
              id="ambientTemperatureC"
              name="ambientTemperatureC"
              label="Temperatura ambiente"
              tooltip="Temperatura promedio en grados Celsius (°C)"
              value={formData.ambientTemperatureC}
              onChange={handleChange}
              placeholder="°C"
              unit="°C"
              presets={TEMPERATURA_PRESETS}
              unknownDefault="22"
              unknownLabel="22 °C (templado)"
              inputClass={getInputClass('ambientTemperatureC', {})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FieldWithPresets
              id="slopePercent"
              name="slopePercent"
              label="Pendiente"
              tooltip="Inclinación del terreno en porcentaje (%). 0% = plano."
              value={formData.slopePercent}
              onChange={handleChange}
              placeholder="%"
              min="0"
              unit="%"
              presets={PENDIENTE_PRESETS}
              unknownDefault="0"
              unknownLabel="0% (terreno plano)"
              inputClass={getInputClass('slopePercent', {})}
            />

            <FieldWithPresets
              id="slippagePercent"
              name="slippagePercent"
              label="Patinamiento"
              tooltip="Porcentaje estimado de patinamiento. Default del sistema: 15%."
              value={formData.slippagePercent}
              onChange={handleChange}
              placeholder="% (default: 15)"
              min="0"
              unit="%"
              presets={PATINAMIENTO_PRESETS}
              unknownDefault="15"
              unknownLabel="15% (estándar recomendado)"
              inputClass={getInputClass('slippagePercent', {})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FieldWithPresets
              id="workingSpeedKmh"
              name="workingSpeedKmh"
              label="Velocidad de trabajo"
              tooltip="Velocidad estimada de la labor en km/h."
              value={formData.workingSpeedKmh}
              onChange={handleChange}
              placeholder="km/h (default: 7)"
              min="0"
              unit="km/h"
              presets={[
                { label: '5 km/h', value: '5', hint: 'Labor lenta / profunda' },
                { label: '7 km/h', value: '7', hint: 'Labor típica' },
                { label: '10 km/h', value: '10', hint: 'Labor rápida / superficial' },
              ]}
              unknownDefault="7"
              unknownLabel="7 km/h (estándar)"
              inputClass={getInputClass('workingSpeedKmh', {})}
            />
          </div>
        </>
      )}
    </div>
  );

  const renderStep4 = () => {
    if (loading) {
      return (
        <div className="py-12 space-y-6 animate-pulse">
          <div className="h-6 bg-secondary/40 rounded w-1/4 mx-auto mb-4"></div>
          <div className="h-32 bg-secondary/30 rounded w-full"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      );
    }



    const tData = result?.tractor;
    const terrain = result?.terrain;
    const losses = result?.losses;
    const netPowerHp = result?.netPowerHp ?? 0;
    const enginePowerHp = result?.enginePowerHp ?? 0;
    const efficiencyPct = result?.efficiencyPercentage ?? 0;

    const filteredImplements = implementsList.filter(
      (imp) =>
        !busquedaImplemento ||
        (imp.implementName || imp.name || "").toLowerCase().includes(busquedaImplemento.toLowerCase()) ||
        (imp.brand || "").toLowerCase().includes(busquedaImplemento.toLowerCase()) ||
        (imp.implementType || imp.type || "").toLowerCase().includes(busquedaImplemento.toLowerCase())
    );

    return (
      <div className="space-y-8 animate-fadeIn">
        <div className="text-center mb-6 border-b border-border/40 pb-4">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Análisis de Potencia Útil</h2>
          <p className="text-sm text-muted-foreground">
            Resultados estimados de la pérdida de potencia del tractor por factores ambientales y mecánicos.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Resumen */}
          <div className="w-full md:w-1/2 bg-secondary/15 rounded border border-border/50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-lg font-bold text-foreground">
                {tData?.brand || "Tractor"} {tData?.model || ""}
              </h3>
              {tData?.hasTurbo && (
                <span className="bg-primary/10 text-primary border border-primary/20 text-xs font-semibold px-2 py-0.5 rounded">
                  Turboalimentado
                </span>
              )}
            </div>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>Potencia nominal: <strong className="text-foreground">{enginePowerHp} HP</strong></p>
              {formData.pb && <p>Potencia al motor (Pb): <strong className="text-foreground">{formData.pb} HP</strong></p>}
              {formData.pmax_tdp && <p>Potencia TDP: <strong className="text-foreground">{formData.pmax_tdp} HP</strong></p>}
              {formData.peso && <p>Peso operativo: <strong className="text-foreground">{formData.peso} kg</strong></p>}
              {terrain && <p>Condición del suelo: <strong className="text-foreground">{terrain.soilType || "Firme"}</strong></p>}
            </div>
          </div>

          {/* Valor Principal */}
          <div className="w-full md:w-1/2 bg-secondary/30 rounded border border-border/60 p-6 flex flex-col justify-center items-center text-center">
            <p className="text-sm text-muted-foreground mb-1">Potencia real disponible en barra de tiro</p>
            <div className="text-3xl font-extrabold text-[#909d00] my-2">
              {netPowerHp} HP
            </div>
            <div className="text-xs text-muted-foreground/80 mt-1">
              Eficiencia final del tractor: <span className="font-semibold text-foreground">{efficiencyPct}%</span>
            </div>
          </div>
        </div>

        {/* Desglose */}
        {losses && (
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Desglose de Pérdidas</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Pendiente', value: losses.slopeLossHp },
                { label: 'Altitud', value: losses.altitudeLossHp, zeroIfTurbo: tData?.hasTurbo },
                { label: 'Rodamiento', value: losses.rollingResistanceLossHp },
                { label: 'Patinamiento', value: losses.slippageLossHp },
              ].map(({ label, value, zeroIfTurbo }) => (
                <div key={label} className="bg-card border border-border/60 rounded p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1.5">
                    {label}
                    {zeroIfTurbo && (
                      <span className="block text-[10px] text-primary font-medium mt-0.5">Compensado por turbo</span>
                    )}
                  </p>
                  <p className="text-lg font-bold text-destructive">
                    {zeroIfTurbo ? "0.0" : `-${value ?? 0}`} HP
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Implementos Compatibles Recomendados */}
        <div className="border-t border-border/40 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h3 className="text-lg font-bold text-foreground">Implementos Compatibles Recomendados</h3>
              <p className="text-xs text-muted-foreground">
                Maquinaria del catálogo que puedes operar eficientemente con los {netPowerHp} HP disponibles en barra de tiro.
              </p>
            </div>
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Buscar implemento..."
                value={busquedaImplemento}
                onChange={(e) => setBusquedaImplemento(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-border/60 rounded text-sm bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
            </div>
          </div>

          {isLoadingImplements ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredImplements.length > 0 ? (
                filteredImplements.map((imp) => (
                  <TractorMachineCard
                    key={imp.implementId || imp.implement_id || imp.id}
                    imageSrc={imp.imageUrl || imp.image_url || imp.image || MachineImg}
                    link={`/maquinaria/${imp.implementId || imp.implement_id || imp.id}`}
                    title={imp.implementName || imp.name || `${imp.brand || ""} ${imp.implementType || "Implemento"}`}
                    description={`Potencia requerida: ${imp.reqHp || imp.powerRequirementHp || imp.power_requirement_hp} HP - Estado: ${imp.suitability?.label || "Óptimo"}`}
                  />
                ))
              ) : (
                <div className="col-span-full py-12 text-center text-muted-foreground bg-secondary/10 rounded border border-dashed border-border/60">
                  <p className="text-base font-semibold">No se encontraron implementos compatibles</p>
                  <p className="text-xs mt-1">Prueba refinando la búsqueda o con otra configuración de tractor.</p>
                </div>
              )}
            </div>
          )}
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
      <div className={`w-full transition-all duration-300 ${step === 4 ? "max-w-5xl" : "max-w-4xl"}`}>
        
        {/* Step Indicator */}
        <div className="mb-8 px-1">
          <StepIndicator
            current={step}
            total={4}
            labels={["Motor", "Llantas", "Clima", "Resultados"]}
          />
        </div>

        {step < 4 ? (
          <div className="bg-card rounded border border-border/60 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]">

              {/* Panel Izquierdo: Imagen Descriptiva */}
              <div className="bg-secondary/30 border-b md:border-b-0 md:border-r border-border/60 p-6 flex flex-col items-center gap-5 justify-between text-muted-foreground">
                <div className="w-full aspect-[4/3] rounded overflow-hidden bg-card border border-border/60 flex items-center justify-center p-3">
                  {step === 1 ? (
                    typeof tractorImage === 'string' ? (
                      <img
                        src={tractorImage}
                        alt="Tractor"
                        className="max-h-full max-w-full object-contain mix-blend-multiply"
                      />
                    ) : React.isValidElement(tractorImage) ? (
                      React.cloneElement(tractorImage, { className: "w-20 h-20 text-primary" })
                    ) : typeof tractorImage === 'function' || typeof tractorImage === 'object' ? (
                      React.createElement(tractorImage, { className: "w-20 h-20 text-primary" })
                    ) : null
                  ) : step === 2 ? (
                    <PiTireFill className="w-20 h-20 text-primary" />
                  ) : (
                    <GiSunCloud className="w-20 h-20 text-primary" />
                  )}
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

                {step > 1 && (
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground/80 leading-relaxed">
                      {step === 2
                        ? "Los datos de la llanta y el suelo son opcionales pero mejoran la precisión del cálculo de resistencia a la rodadura."
                        : "La altitud y temperatura ayudan a corregir la pérdida de potencia por densidad del aire."}
                    </p>
                  </div>
                )}
              </div>

              {/* Panel Derecho: Formulario */}
              <div className="p-6 md:p-8 flex flex-col justify-between">
                <div>
                  {step === 1 && renderStep1()}
                  {step === 2 && renderStep2()}
                  {step === 3 && renderStep3()}
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
                    {step === 3 ? "Ver Resultados" : "Siguiente"}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        ) : (
          <div className="bg-card rounded border border-border/60 overflow-hidden p-6 md:p-8">
            {renderStep4()}
          </div>
        )}
      </div>

      {/* Modal de Catálogo (para paso 1) */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-4xl md:max-w-5xl lg:max-w-6xl w-[95vw] max-h-[85vh] overflow-hidden flex flex-col p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
              Catálogo de Tractores
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground -mt-1">
            Selecciona tu modelo para rellenar los datos automáticamente.
          </p>

          <div className="flex-1 overflow-y-auto mt-4 pr-1">
            {isLoadingCatalog ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-7 h-7 border-[3px] border-primary border-t-transparent rounded-full animate-spin" aria-label="Cargando" />
              </div>
            ) : tractorsCatalog.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm">
                No hay tractores en el catálogo.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {tractorsCatalog.map((tractor) => (
                  <button
                    key={tractor.tractorId}
                    type="button"
                    className="text-left border border-border rounded p-4 hover:border-primary hover:shadow-sm transition-all flex flex-col bg-card group"
                    onClick={() => handleTractorSelect(tractor)}
                    aria-label={`Seleccionar ${tractor.brand} ${tractor.model}, ${tractor.enginePowerHp} HP`}
                  >
                    <div className="h-24 w-full flex items-center justify-center bg-secondary/20 rounded mb-3 p-2 group-hover:bg-primary/5 transition-colors">
                      {(() => {
                        const imgSource = tractor.image || tractor.imageUrl || tractor.image_url || (tractor.images && tractor.images[0]);
                        return imgSource ? (
                          <img
                            src={imgSource}
                            alt={`${tractor.brand} ${tractor.model}`}
                            className="max-h-full max-w-full object-contain"
                          />
                        ) : (
                          <PiTractorFill className="w-12 h-12 text-muted-foreground group-hover:text-primary transition-colors" />
                        );
                      })()}
                    </div>
                    <p className="font-semibold text-foreground text-sm leading-tight">{tractor.brand}</p>
                    <p className="text-muted-foreground text-xs mt-0.5 mb-2">{tractor.model}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">
                        {tractor.enginePowerHp} HP
                      </span>
                      <span className="text-xs text-muted-foreground/80">{tractor.weightKg} kg</span>
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
