import React from "react";
import VideoPrueba from "../assets/video/1.mp4";
import TractorImg from "../assets/img/1.png";
import MachineImg from "../assets/img/2.png";
import HomeVideo from "../components/HomeVideo";
import TractorMachineCard from "../components/TractorMachineCard";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Video inicio */}
      <HomeVideo videoSrc={VideoPrueba} />

      {/* Tractores  */}
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
              link="/Home"
              title="New Holland 8670"
              description="Tractor de marca new holland fabricado en españa se utiliza en
                la región orinoquia"
            />
            {/* Tractor 2 */}
            <TractorMachineCard 
              imageSrc={TractorImg}
              link="/Home"
              title="John Deere 5090E"
              description="Trator marca Jhon Deere fabricado en argentina, se utiliza en la
                región pacifica generalmente paralabores de transporte y
                preparacion"
            />
            {/* Tractor 3 */}
            <TractorMachineCard 
              imageSrc={TractorImg}
              link="/Home"
              title="Ford 4610"
              description="Tractor marca Ford, fabricado en EEUU, se utiliza en la región
                Caribe. Generalmente para labores de transporte"
            />
          </div>
        </div>
      </section>

      {/* Maquinas seccion destacados */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-red-800 text-center">
            Maquinas destacadas
          </h1>
          <div className="w-32 h-1 bg-red-800 mx-auto mt-2 mb-10"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Maquina 1 */}
            <TractorMachineCard 
              imageSrc={MachineImg}
              link="/Home"
              title="Arado de vertebras 975"
              description="Estilo clásico combinado con innovaciones modernas. Está en
                nuestra herencia."
            />
            {/* Maquina 2 */}
            <TractorMachineCard 
              imageSrc={MachineImg}
              link="/Home"
              title="Rastra Mx425"
              description="Peterbilt se asocia con PFC para ofrecer un programa FMV
                inmejorable para los camiones"
            />
            {/* Maquina 3 */}
            <TractorMachineCard 
              imageSrc={MachineImg}
              link="/Home"
              title="Cultivador Mx10"
              description="Peterbilt se asocia con PFC para ofrecer un programa FMV
                inmejorable para los camiones"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
