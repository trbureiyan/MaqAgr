import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Llanta from "../assets/img/Llanta.jpeg";
import Button from "../components/ui/buttons/Button";
import FieldWithPresets from "../components/ui/FieldWithPresets";
import { getInputClass } from "../lib/formUtils";
import {
  DIAMETRO_LLANTA_PRESETS, DIAMETRO_LLANTA_UNKNOWN_DEFAULT,
  PRESION_PRESETS, PRESION_UNKNOWN_DEFAULT,
} from "../lib/fieldPresets";

const TIPOS_SUELO = [
  { value: "arcilloso", label: "Arcilloso — suelo pesado, más tracción requerida" },
  { value: "arenoso", label: "Arenoso — suelo suelto, mayor patinamiento" },
  { value: "limoso", label: "Limoso — suelo intermedio" },
  { value: "franco", label: "Franco — suelo ideal balanceado" },
];

export default function DatosLlanta() {
  const navigate = useNavigate();
  const location = useLocation();
  const tractorData = location.state?.tractorData || {};

  const [formData, setFormData] = useState({
    diametro: "",
    presion: "",
    tipoSuelo: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/DatosClimaticos", {
      state: {
        tractorData,
        llantaData: {
          diametroLlanta: formData.diametro ? Number(formData.diametro) : null,
          presionInflado: formData.presion ? Number(formData.presion) : null,
          tipoSuelo: formData.tipoSuelo || null,
        },
      },
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="bg-white p-4 sm:p-8 rounded-lg shadow-lg w-full max-w-4xl">

        {/* ── Indicador de pasos ── */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-500 text-sm font-bold" aria-label="Paso 1 de 3, completado">1</span>
          <div className="w-8 sm:w-12 h-0.5 bg-[#991b1b]" />
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#991b1b] text-white text-sm font-bold" aria-label="Paso 2 de 3, actual">2</span>
          <div className="w-8 sm:w-12 h-0.5 bg-gray-300" />
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-500 text-sm font-bold" aria-label="Paso 3 de 3, pendiente">3</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-8">Datos de la llanta</h1>
        <p className="text-center text-gray-600 mb-8 -mt-4">
          Estos campos son <strong>opcionales</strong> — si no conoces el dato, puedes dejarlo vacío o usar el valor de referencia.
        </p>

        <div className="flex flex-col sm:flex-row gap-8">
          <div className="w-full sm:w-1/2">
            <img
              src={Llanta}
              alt="Referencia visual de llanta agrícola"
              className="w-full h-auto rounded-lg"
            />
          </div>
          <div className="w-full sm:w-1/2">
            <form className="space-y-5" onSubmit={handleSubmit} noValidate>

              <FieldWithPresets
                id="diametro"
                name="diametro"
                label="Diámetro de la llanta"
                tooltip="Diámetro de la llanta trasera en pulgadas"
                value={formData.diametro}
                onChange={handleChange}
                placeholder="Valor en pulgadas"
                presets={DIAMETRO_LLANTA_PRESETS}
                unknownDefault={DIAMETRO_LLANTA_UNKNOWN_DEFAULT}
                unknownLabel="dejar vacío"
                inputClass={getInputClass('diametro', {})}
              />

              <FieldWithPresets
                id="presion"
                name="presion"
                label="Presión de inflado"
                tooltip="Presión de inflado recomendada en PSI"
                value={formData.presion}
                onChange={handleChange}
                placeholder="Valor en PSI"
                presets={PRESION_PRESETS}
                unknownDefault={PRESION_UNKNOWN_DEFAULT}
                unknownLabel="dejar vacío"
                inputClass={getInputClass('presion', {})}
              />

              {/* Tipo de suelo — select con descripción por opción */}
              <div>
                <label htmlFor="tipoSuelo" className="block text-gray-700 font-medium mb-1">
                  Tipo de suelo
                </label>
                <select
                  id="tipoSuelo"
                  name="tipoSuelo"
                  value={formData.tipoSuelo}
                  onChange={handleChange}
                  className={getInputClass('tipoSuelo', {})}
                >
                  <option value="">Sin especificar (opcional)</option>
                  {TIPOS_SUELO.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              {/* Botones de navegación */}
              <div className="text-right flex justify-end gap-3 pt-2">
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
                  SIGUIENTE
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}