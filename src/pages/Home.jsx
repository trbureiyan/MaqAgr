import React from "react";
import VideoPrueba from "../assets/video/1.mp4";
import TractorImg from "../assets/img/1.png";
import MachineImg from "../assets/img/2.png";
import HomeVideo from "../components/HomeVideo";
import Button from "../components/Buttons/Button";
import TractorMachineCard from "../components/TractorMachineCard";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Video inicio */}
      <HomeVideo videoSrc={VideoPrueba} />

      {/* Tractores Destacados */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-red-800 text-center">
            Tractores Destacados
          </h1>
          <div className="w-32 h-1 bg-red-800 mx-auto mt-2 mb-10"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Tractor 1 */}
            <TractorMachineCard
              imageSrc={TractorImg}
              link="/tractor/1"
              title="New Holland 8670"
              description="Tractor de marca New Holland fabricado en España, utilizado en la región Orinoquía."
            />
            {/* Tractor 2 */}
            <TractorMachineCard
              imageSrc={TractorImg}
              link="/tractor/1"
              title="John Deere 5090E"
              description="Tractor marca John Deere fabricado en Argentina, utilizado en la región Pacífica para transporte y preparación."
            />
            {/* Tractor 3 */}
            <TractorMachineCard
              imageSrc={TractorImg}
              link="/tractor/1"
              title="Ford 4610"
              description="Tractor marca Ford, fabricado en EEUU, utilizado en la región Caribe para labores de transporte."
            />
          </div>
        </div>
      </section>

      {/* Máquinas Destacadas */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-red-800 text-center">
            Máquinas Destacadas
          </h1>
          <div className="w-32 h-1 bg-red-800 mx-auto mt-2 mb-10"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Máquina 1 */}
            <TractorMachineCard
              imageSrc={MachineImg}
              link="/tractor/2"
              title="Arado de vértebras 975"
              description="Estilo clásico combinado con innovaciones modernas. Está en nuestra herencia."
            />
            {/* Máquina 2 */}
            <TractorMachineCard
              imageSrc={MachineImg}
              link="/tractor/2"
              title="Rastra Mx425"
              description="Peterbilt se asocia con PFC para ofrecer un programa FMV inmejorable para los camiones."
            />
            {/* Máquina 3 */}
            <TractorMachineCard
              imageSrc={MachineImg}
              link="/tractor/2"
              title="Cultivador Mx10"
              description="Peterbilt se asocia con PFC para ofrecer un programa FMV inmejorable para los camiones."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
