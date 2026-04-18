import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Tractor from "../assets/img/Tractor Prueva.webp";
import Button from "../components/ui/buttons/Button";
import TooltipInfo from "../components/ui/buttons/ToolTipInfo";

export default function DatosTractor() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    pb: "",
    pmax_tdp: "",
    peso: "",
    turbo: "",
  });

  const [errors, setErrors] = useState({});

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

  const handleSubmit = (event) => {
    event.preventDefault();
    const err = validate();
    if (Object.keys(err).length > 0) {
      setErrors(err);
      return;
    }
    // Si la validación es correcta, guardamos el contexto (ej: en state manager o sessionStorage) 
    // y navegamos a la siguiente vista
    navigate("/DatosLlantas");
  };

  const inputBase =
    "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#991b1b] transition-colors";
  const inputClass = (field) =>
    `${inputBase} ${errors[field] ? "border-red-500" : "border-gray-300"}`;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Datos del tractor</h1>
          <p className="text-gray-600 mt-2">
            Ingresa las especificaciones técnicas de tu tractor para calcular su rendimiento.
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-start">
          <div className="w-full md:w-1/2">
            <img 
              src={Tractor} 
              alt="Modelo referencial de tractor" 
              className="w-full h-auto rounded-lg shadow-sm border border-gray-100"
            />
          </div>
          <div className="w-full md:w-1/2 md:pl-8 mt-8 md:mt-0">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Pb
                  <TooltipInfo content="Potencia bruta del tractor expresada en caballos de fuerza (HP)" />
                </label>
                <input 
                  type="number"
                  name="pb"
                  value={formData.pb}
                  onChange={handleChange}
                  placeholder="Ingrese valor en HP" 
                  className={inputClass("pb")}
                />
                {errors.pb && <p className="mt-1 text-sm text-red-600">{errors.pb}</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Pmax(tdp)
                  <TooltipInfo content="Potencia máxima en la toma de fuerza (TDF) expresada en HP" />
                </label>
                <input 
                  type="number"
                  name="pmax_tdp"
                  value={formData.pmax_tdp}
                  onChange={handleChange}
                  placeholder="Ingrese valor en HP" 
                  className={inputClass("pmax_tdp")}
                />
                {errors.pmax_tdp && <p className="mt-1 text-sm text-red-600">{errors.pmax_tdp}</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Peso Operativo
                  <TooltipInfo content="Peso del tractor con contrapesos en kilogramos (kg)" />
                </label>
                <input 
                  type="number"
                  name="peso"
                  value={formData.peso}
                  onChange={handleChange}
                  placeholder="Ingrese valor en kg" 
                  className={inputClass("peso")}
                />
                {errors.peso && <p className="mt-1 text-sm text-red-600">{errors.peso}</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Turbo
                  <TooltipInfo content="Indica si el motor de tu tractor cuenta con un turbocompresor" />
                </label>
                <select 
                  name="turbo"
                  value={formData.turbo}
                  onChange={handleChange}
                  className={inputClass("turbo")}
                >
                  <option value="">Seleccione una opción</option>
                  <option value="si">Sí</option>
                  <option value="no">No</option>
                </select>
                {errors.turbo && <p className="mt-1 text-sm text-red-600">{errors.turbo}</p>}
              </div>

              {/* Botones de navegación */}
              <div className="pt-4 flex justify-end space-x-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => navigate(-1)}
                >
                  VOLVER
                </Button>
                <Button
                  variant="primary"
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