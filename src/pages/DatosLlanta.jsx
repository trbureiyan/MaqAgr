/**
 * @fileoverview Paso 2 del flujo "Tengo Tractor" — especificaciones de las llantas y suelo.
 *
 * @module pages/DatosLlanta
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Llanta } from '../assets/img';
import FieldWithPresets from '../components/ui/FieldWithPresets';
import StepIndicator from '../components/ui/StepIndicator';
import { getInputClass } from '../lib/formUtils';
import {
  DIAMETRO_LLANTA_PRESETS, DIAMETRO_LLANTA_UNKNOWN_DEFAULT,
  PRESION_PRESETS, PRESION_UNKNOWN_DEFAULT,
} from '../lib/fieldPresets';
import { ChevronRight, ChevronLeft } from 'lucide-react';

function DatosLlanta() {
  const navigate = useNavigate();
  const location = useLocation();
  const tractorData = location.state?.tractorData || {};

  const [formData, setFormData] = useState({
    diametroLlanta: '',
    presionInflado: '',
    tipoSuelo: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate('/DatosClimaticos', {
      state: {
        tractorData,
        llantaData: {
          diametroLlanta: Number(formData.diametroLlanta) || null,
          presionInflado: Number(formData.presionInflado) || null,
          tipoSuelo: formData.tipoSuelo || null,
        },
      },
    });
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background flex flex-col items-center justify-start pt-10 pb-16 px-4">
      <div className="w-full max-w-4xl">

        <div className="mb-8 px-1">
          <StepIndicator
            current={2}
            total={3}
            labels={["Motor", "Llantas", "Clima"]}
          />
        </div>

        <div className="bg-card rounded border border-border/60 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]">

            {/* ── Panel izquierdo: imagen ── */}
            <div className="bg-secondary/30 border-b md:border-b-0 md:border-r border-border/60 p-6 flex flex-col items-center justify-center gap-5">
              <div className="w-full aspect-[4/3] rounded overflow-hidden bg-card border border-border/60 flex items-center justify-center p-3">
                <img
                  src={Llanta}
                  alt="Llantas de tractor"
                  className="max-h-full max-w-full object-contain mix-blend-multiply"
                />
              </div>
              <p className="text-xs text-center text-muted-foreground/80 px-2">
                Los datos de la llanta y el suelo son opcionales pero mejoran la precisión del cálculo.
              </p>
            </div>

            {/* ── Panel derecho: formulario ── */}
            <div className="p-6 md:p-8">
              <div className="mb-6 border-b border-border/40 pb-4">
                <h1 className="text-xl font-bold tracking-tight text-foreground">Llantas y Suelo</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Especifica las características de rodamiento y el terreno. Todos estos campos son opcionales.
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FieldWithPresets
                    id="diametroLlanta"
                    name="diametroLlanta"
                    label="Diámetro de llanta"
                    tooltip="Diámetro total de la llanta en pulgadas (in)"
                    value={formData.diametroLlanta}
                    onChange={handleChange}
                    placeholder="Pulgadas (in)"
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
                    presets={PRESION_PRESETS}
                    unknownDefault={PRESION_UNKNOWN_DEFAULT}
                    unknownLabel="dejar vacío"
                    inputClass={getInputClass('presionInflado', {})}
                  />
                </div>

                <div>
                  <label htmlFor="tipoSuelo" className="text-sm font-medium text-gray-700 leading-none block mb-1.5">
                    Condición del suelo
                  </label>
                  <select
                    id="tipoSuelo"
                    name="tipoSuelo"
                    value={formData.tipoSuelo}
                    onChange={handleChange}
                    className={getInputClass('tipoSuelo', {})}
                  >
                    <option value="">Selecciona el tipo de suelo (Opcional)</option>
                    <option value="firme">Firme — Suelo seco, compactado, sin labrar</option>
                    <option value="blando">Blando — Suelo suelto, arado recientemente, arenoso</option>
                  </select>
                </div>

                <div className="pt-4 mt-8 border-t border-border/40 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-background border border-border text-foreground text-sm font-semibold rounded hover:bg-muted transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Volver
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded hover:bg-primary/90 transition-colors shadow-sm"
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
    </div>
  );
}

export default DatosLlanta;