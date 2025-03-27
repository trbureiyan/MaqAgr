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

      {/* Tractores  */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-red-800 text-center">
            Tractores Destacados
          </h1>
          <div className="w-32 h-1 bg-red-800 mx-auto mt-2 mb-10"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Tractor 1 */}
            <div className="flex flex-col">
              <h2 className="text-xl font-bold text-red-900">
                New Holland 8670
              </h2>
              <div className="w-16 h-0.5 bg-red-800 my-2"></div>
              <p className="text-gray-500 mb-4">
                Tractor de marca new holland fabricado en españa se utiliza en
                la región orinoquia
              </p>
              <img
                src={demoImg}
                alt="New Holland 8670"
                className="w-full h-64 object-contain mb-4"
              />
              <Button 
                variant="primary" 
                color="#9f0712" 
                shape="rounded"
                className="mt-auto self-start"
              >
                aprende más
              </Button>
            </div>
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
                preparacion
              </p>
              <img
                src={demoImg}
                alt="John Deere 5090E"
                className="w-full h-64 object-contain mb-4"
              />
              <Button 
                variant="primary" 
                color="#9f0712" 
                shape="rounded"
                href="#" 
                className="mt-auto self-start"
              >
                aprende más
              </Button>
            </div>

            {/* Tractor 3 */}
            <div className="flex flex-col">
              <h2 className="text-xl font-bold text-red-900">Ford 4610</h2>
              <div className="w-16 h-0.5 bg-red-800 my-2"></div>
              <p className="text-gray-500 mb-4">
                Tractor marca Ford, fabricado en EEUU, se utiliza en la región
                Caribe. Generalmente para labores de transporte
              </p>
              <img
                src={demoImg}
                alt="Ford 4610"
                className="w-full h-64 object-contain mb-4"
              />
              <Button 
                variant="primary" 
                color="#9f0712" 
                shape="rounded"
                href="#" 
                className="mt-auto self-start"
              >
                aprende más
              </Button>
            </div>
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
            <div className="flex flex-col">
              <h2 className="text-xl font-bold text-red-900">
                Arado de vertebras 975
              </h2>
              <div className="w-16 h-0.5 bg-red-800 my-2"></div>
              <p className="text-gray-500 mb-4">
                Estilo clásico combinado con innovaciones modernas. Está en
                nuestra herencia.
              </p>
              <img
                src={demoImg}
                alt="Arado de vertebras 975"
                className="w-full h-64 object-contain mb-4"
              />
              <Button 
                variant="primary" 
                color="#9f0712" 
                shape="rounded"
                href="#" 
                className="mt-auto self-start"
              >
                aprende más
              </Button>
            </div>

            {/* Maquina 2 */}
            <div className="flex flex-col">
              <h2 className="text-xl font-bold text-red-900">Rastra Mx425</h2>
              <div className="w-16 h-0.5 bg-red-800 my-2"></div>
              <p className="text-gray-500 mb-4">
                Peterbilt se asocia con PFC para ofrecer un programa FMV
                inmejorable para los camiones
              </p>
              <img
                src={demoImg}
                alt="Rastra Mx425"
                className="w-full h-64 object-contain mb-4"
              />
              <Button 
                variant="primary" 
                color="#9f0712" 
                shape="rounded"
                href="#" 
                className="mt-auto self-start"
              >
                aprende más
              </Button>
            </div>

            {/* Maquina 3 */}
            <div className="flex flex-col">
              <h2 className="text-xl font-bold text-red-900">
                Cultivador Mx10
              </h2>
              <div className="w-16 h-0.5 bg-red-800 my-2"></div>
              <p className="text-gray-500 mb-4">
                Peterbilt se asocia con PFC para ofrecer un programa FMV
                inmejorable para los camiones
              </p>
              <img
                src={demoImg}
                alt="Cultivador Mx10"
                className="w-full h-64 object-contain mb-4"
              />
              <Button 
                variant="primary" 
                color="#9f0712" 
                shape="rounded"
                href="#" 
                className="mt-auto self-start"
              >
                aprende más
              </Button>
            </div>

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
