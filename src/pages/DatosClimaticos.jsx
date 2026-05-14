import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Nube from "../assets/img/nubes.png";
import Button from "../components/ui/buttons/Button";
import FieldWithPresets from "../components/ui/FieldWithPresets";
import { getInputClass } from "../lib/formUtils";
import {
  ALTITUD_PRESETS, ALTITUD_UNKNOWN_DEFAULT,
  TEMPERATURA_PRESETS, TEMPERATURA_UNKNOWN_DEFAULT,
  PENDIENTE_PRESETS, PENDIENTE_UNKNOWN_DEFAULT,
  PATINAMIENTO_PRESETS, PATINAMIENTO_UNKNOWN_DEFAULT,
} from "../lib/fieldPresets";

function DatosClimaticos() {
  const navigate = useNavigate();
  const location = useLocation();

  const tractorData = location.state?.tractorData || {};
  const llantaData = location.state?.llantaData || {};

  const [formData, setFormData] = useState({
    altitudeM: '',
    ambientTemperatureC: '',
    slopePercent: '',
    slippagePercent: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const toNumberOrNull = (value) => {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : null;
    };

    const altitudeM = toNumberOrNull(formData.altitudeM);
    const ambientTemperatureC = toNumberOrNull(formData.ambientTemperatureC);
    const slopePercent = toNumberOrNull(formData.slopePercent);
    const slippagePercentInput = toNumberOrNull(formData.slippagePercent);
    // Si no se conoce el patinamiento, el backend usará 15% como default
    const slippagePercent = slippagePercentInput === null
      ? null
      : Math.min(100, Math.max(0, slippagePercentInput));

    const hasTurbo = tractorData.turbo === 'si';

    const payload = {
      enginePowerHp: tractorData.pb || null,
      pmaxTdpHp: tractorData.pmax_tdp || null,
      weightKg: tractorData.peso || null,
      hasTurbo,
      tireDiameterIn: llantaData.diametroLlanta || null,
      tirePressurePsi: llantaData.presionInflado || null,
      soilType: llantaData.tipoSuelo || null,
      altitudeM,
      ambientTemperatureC,
      slopePercent,
      slippagePercent,
    };

    navigate("/Resultados", {
      state: {
        payload,
        tractorData,
      },
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">

        {/* ── Indicador de pasos ── */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-500 text-sm font-bold" aria-label="Paso 1 de 3, completado">1</span>
          <div className="w-8 sm:w-12 h-0.5 bg-[#991b1b]" />
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-500 text-sm font-bold" aria-label="Paso 2 de 3, completado">2</span>
          <div className="w-8 sm:w-12 h-0.5 bg-[#991b1b]" />
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#991b1b] text-white text-sm font-bold" aria-label="Paso 3 de 3, actual">3</span>
        </div>

        <h1 className="text-3xl font-bold text-center mb-2">Datos climáticos</h1>
        <p className="text-center text-gray-600 mb-8">
          Todos estos campos son <strong>opcionales</strong>. Si no conoces el valor, usa el botón
          &ldquo;No conozco el dato&rdquo; o deja el campo vacío para usar los defaults del sistema.
        </p>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2">
            <img
              src={Nube}
              alt="Referencia de condiciones climáticas para el cálculo"
              className="w-full h-auto rounded-lg"
            />
          </div>
          <div className="w-full md:w-1/2">
            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <FieldWithPresets
                  id="altitudeM"
                  name="altitudeM"
                  label="Altitud"
                  tooltip="Altura sobre el nivel del mar en metros (msnm)"
                  value={formData.altitudeM}
                  onChange={handleChange}
                  placeholder="msnm"
                  presets={ALTITUD_PRESETS}
                  unknownDefault={ALTITUD_UNKNOWN_DEFAULT}
                  unknownLabel="dejar vacío"
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
                  presets={TEMPERATURA_PRESETS}
                  unknownDefault={TEMPERATURA_UNKNOWN_DEFAULT}
                  unknownLabel="dejar vacío"
                  inputClass={getInputClass('ambientTemperatureC', {})}
                />

              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <FieldWithPresets
                  id="slopePercent"
                  name="slopePercent"
                  label="Pendiente"
                  tooltip="Inclinación del terreno en porcentaje (%). 0% = plano."
                  value={formData.slopePercent}
                  onChange={handleChange}
                  placeholder="%"
                  presets={PENDIENTE_PRESETS}
                  unknownDefault={PENDIENTE_UNKNOWN_DEFAULT}
                  unknownLabel="0% (plano)"
                  inputClass={getInputClass('slopePercent', {})}
                />

                <FieldWithPresets
                  id="slippagePercent"
                  name="slippagePercent"
                  label="Patinamiento"
                  tooltip="Porcentaje estimado de patinamiento de las ruedas. Default del sistema: 15%."
                  value={formData.slippagePercent}
                  onChange={handleChange}
                  placeholder="% (default: 15)"
                  presets={PATINAMIENTO_PRESETS}
                  unknownDefault={PATINAMIENTO_UNKNOWN_DEFAULT}
                  unknownLabel="sistema usará 15%"
                  inputClass={getInputClass('slippagePercent', {})}
                />

              </div>

              {/* Botones de navegación */}
              <div className="text-right space-x-4 flex justify-end pt-2">
                <Button
                  variant="outline"
                  color="#991b1b"
                  type="button"
                  onClick={() => navigate(-1)}
                >
                  VOLVER
                </Button>
                <Button
                  variant="primary"
                  color="#991b1b"
                  type="submit"
                >
                  VER RESULTADOS
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DatosClimaticos;