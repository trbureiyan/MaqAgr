/**
 * @fileoverview Paso 1 del flujo "Tengo Tractor" — especificaciones del motor.
 *
 * Interfaz: layout de dos columnas con panel de selección a la izquierda
 * (imagen + acceso al catálogo) y formulario controlado a la derecha.
 *
 * Progressive disclosure: los presets de cada campo se revelan al enfocar
 * el input o al pulsar el botón de referencias, no de forma permanente.
 *
 * @module pages/DatosTractor
 */

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
import { ChevronRight, BookOpen } from "lucide-react";

import StepIndicator from "../components/ui/StepIndicator";

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

export default function DatosTractor() {
  const navigate = useNavigate();

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
        console.error("Error parsing tractor_datos", e);
      }
    }
    return { pb: "", pmax_tdp: "", peso: "", turbo: "" };
  });

  const [isSimpleMode, setIsSimpleMode] = useState(true);
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
        console.error("Error al cargar tractores:", error);
      } finally {
        setIsLoadingCatalog(false);
      }
    };
    fetchTractores();
  }, []);

  const handleTractorSelect = (tractor) => {
    setFormData({
      pb: tractor.enginePowerHp || "",
      pmax_tdp: tractor.enginePowerHp
        ? (tractor.enginePowerHp * 0.86).toFixed(1)
        : "",
      peso: tractor.weightKg || "",
      turbo:
        tractor.hasTurbo === true ? "si"
        : tractor.hasTurbo === false ? "no"
        : "",
    });
    const img =
      tractor.image || tractor.imageUrl || tractor.image_url ||
      (tractor.images && tractor.images[0]) || Tractor;
    setImagenTractor(img);
    localStorage.setItem('tractor_imagen', img);
    setErrors({});
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const err = {};
    if (isSimpleMode) {
      if (!formData.pb) err.general = "Por favor busca y selecciona un tractor del catálogo.";
      return err;
    }
    if (!formData.pb || Number(formData.pb) <= 0) err.pb = "Ingresa la potencia bruta (HP).";
    if (!formData.pmax_tdp || Number(formData.pmax_tdp) <= 0) err.pmax_tdp = "Ingresa la potencia TDP (HP).";
    if (!formData.peso || Number(formData.peso) <= 0) err.peso = "Ingresa el peso operativo (kg).";
    if (!formData.turbo) err.turbo = "Selecciona si el motor tiene turbo.";
    return err;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validate();
    if (Object.keys(err).length > 0) { setErrors(err); return; }
    localStorage.setItem('tractor_datos', JSON.stringify({
      pb: Number(formData.pb),
      pmax_tdp: Number(formData.pmax_tdp),
      peso: Number(formData.peso),
      turbo: formData.turbo,
    }));
    navigate("/DatosLlantas", {
      state: {
        isSimpleMode,
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-4xl">

        {/* ── Encabezado fuera de la card ── */}
        <div className="mb-6 px-1">
          <StepIndicator
            current={1}
            total={3}
            labels={["Motor", "Llantas", "Clima"]}
          />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]">

            {/* ── Panel izquierdo: imagen + catálogo ── */}
            <div className="bg-gray-50 border-b md:border-b-0 md:border-r border-gray-100 p-6 flex flex-col items-center gap-5">
              <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-white border border-gray-100 flex items-center justify-center p-3">
                <img
                  src={imagenTractor}
                  alt="Tractor seleccionado"
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
                <h1 className="text-xl font-semibold text-gray-900">Datos del motor</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Especificaciones técnicas del tractor. Enfoca cada campo para ver valores de referencia.
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                <div className="flex bg-gray-100 p-1 rounded-lg w-fit mb-6">
                  <button 
                    type="button"
                    onClick={() => { setIsSimpleMode(true); setErrors({}); }}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${isSimpleMode ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Calculadora Simple
                  </button>
                  <button 
                    type="button"
                    onClick={() => { setIsSimpleMode(false); setErrors({}); }}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${!isSimpleMode ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Calculadora Avanzada
                  </button>
                </div>

                {errors.general && (
                  <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm mb-4">
                    {errors.general}
                  </div>
                )}

                {isSimpleMode ? (
                  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 text-sm">
                    En la calculadora simple, solo necesitas seleccionar tu tractor desde el catálogo haciendo clic en el botón "Buscar en catálogo".
                  </div>
                ) : (
                  <>
                    <FieldWithPresets
                  id="pb"
                  name="pb"
                  label="Potencia Bruta"
                  tooltip="Potencia bruta del motor (HP). Se encuentra en el manual o la placa del tractor."
                  value={formData.pb}
                  onChange={handleChange}
                  error={errors.pb}
                  placeholder="HP"
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
                  presets={PESO_PRESETS}
                  unknownDefault={PESO_UNKNOWN_DEFAULT}
                  unknownLabel="4 500 kg, estándar mediano"
                  inputClass={getInputClass('peso', errors)}
                />

                {/* Turbo — select binario, no necesita presets */}
                <div>
                  <label htmlFor="turbo" className="text-sm font-medium text-gray-700 leading-none block mb-1.5">
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
                    <p id="turbo-error" className="mt-1.5 text-xs text-red-600" role="alert">
                      {errors.turbo}
                    </p>
                  )}
                </div>
                </>
                )}

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

      {/* ── Modal de Catálogo ── */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-4xl md:max-w-5xl lg:max-w-6xl w-[95vw] max-h-[85vh] overflow-hidden flex flex-col p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Catálogo de Tractores
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500 -mt-1">
            Selecciona tu modelo para rellenar los datos automáticamente.
          </p>

          <div className="flex-1 overflow-y-auto mt-4 pr-1">
            {isLoadingCatalog ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-7 h-7 border-[3px] border-[#893d46] border-t-transparent rounded-full animate-spin" aria-label="Cargando" />
              </div>
            ) : tractoresCatalogo.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm">
                No hay tractores en el catálogo.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {tractoresCatalogo.map((tractor) => (
                  <button
                    key={tractor.tractorId}
                    type="button"
                    className="text-left border border-gray-200 rounded-xl p-4 hover:border-[#893d46] hover:shadow-sm transition-all flex flex-col bg-white group"
                    onClick={() => handleTractorSelect(tractor)}
                    aria-label={`Seleccionar ${tractor.brand} ${tractor.model}, ${tractor.enginePowerHp} HP`}
                  >
                    <div className="h-24 w-full flex items-center justify-center bg-gray-50 rounded-lg mb-3 p-2 group-hover:bg-red-50/30 transition-colors">
                      <img
                        src={tractor.image || tractor.imageUrl || tractor.image_url || (tractor.images && tractor.images[0]) || Tractor}
                        alt={`${tractor.brand} ${tractor.model}`}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <p className="font-semibold text-gray-800 text-sm leading-tight">{tractor.brand}</p>
                    <p className="text-gray-500 text-xs mt-0.5 mb-2">{tractor.model}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#893d46] bg-[#893d46]/8 px-2 py-0.5 rounded">
                        {tractor.enginePowerHp} HP
                      </span>
                      <span className="text-xs text-gray-400">{tractor.weightKg} kg</span>
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