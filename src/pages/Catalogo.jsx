import React from "react";
import TractorCard from "../components/ui/cards/TractorCard";
import { IconTrac as Tractor, IconMac as Maquina } from "../assets/img";

export default function Catalogo() {
  return (
    <div className="min-h-screen bg-gray-200">
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-4">
          Bienvenido al Catálogo de nuestras maquinarias existentes
        </h1>
        <br />

        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 justify-items-center">
            <TractorCard
              imageSrc={Tractor}
              link="/CatalogoTractor"
              title="Tractores"
              description="Encuentra implementos agrícolas compatibles con su tractor según su potencia disponible."
            />
            <TractorCard
              imageSrc={Maquina}
              link="/CatalogoMaquinas"
              title="Maquinaria"
              description="Encuentra implementos agrícolas compatibles con su tractor según su potencia disponible."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
