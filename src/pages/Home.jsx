import React from "react";
import demoVideo from "../assets/video/1.mp4";
import demoImg from "../assets/img/1.png";
import IconTrac from "../assets/img/IconTrac.png";
import IconMac from "../assets/img/IconMac.png";
import IconCamp from "../assets/img/IconCamp.png";
import TractorCard from "../components/TractorCard";
import HomeVideo from "../components/HomeVideo";
import Button from "../components/Buttons/Button";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Aqui va el video */}
      
      <HomeVideo videoSrc={demoVideo} />

      {/* Tractores Destacados Section */}
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

            {/* Tractor 2 */}
            <div className="flex flex-col">
              <h2 className="text-xl font-bold text-red-900">
                John Deere 5090E
              </h2>
              <div className="w-16 h-0.5 bg-red-800 my-2"></div>
              <p className="text-gray-500 mb-4">
                Trator marca Jhon Deere fabricado en argentina, se utiliza en la
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
          </div>
        </div>
      </section>

      {/* Maquinas Destacadas Section */}
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
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
