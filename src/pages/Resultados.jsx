import React from 'react';
import Tractor from "../assets/img/Tractor Prueva.webp";
import demoImg from "../assets/img/1.png";

export default function Resultados() {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 py-10">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-6xl mb-10">
        <h1 className="text-3xl font-bold text-center mb-8">Resultados</h1>
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2">
            <img 
              src={Tractor}
              alt="Imagen del resultado" 
              className="w-full h-auto rounded-lg"
            />
          </div>
          <div className="w-full md:w-1/2 md:pl-8 mt-8 md:mt-0">
            <div className="bg-gray-200 p-6 rounded-lg shadow-inner">
              <p className="text-gray-700 mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.</p>
              <p className="text-gray-700 mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.</p>
              <p className="text-gray-700 mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.</p>
              <div className="flex justify-center mt-8">
                <div className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg">
                  75 HP
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-6xl">
        <h2 className="text-2xl font-bold text-center mb-8">Maquinas Recomendadas</h2>
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <svg className="w-6 h-6 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4z"></path>
            </svg>
            <span className="text-gray-600">Filtro</span>
          </div>
          <div className="relative w-full md:w-auto">
            <input 
              type="text" 
              placeholder="Buscar" 
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <svg className="w-6 h-6 text-gray-600 absolute right-2 top-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <img 
              src={demoImg}
              alt="Arado de vertebras 975" 
              className="w-full h-auto mb-4 rounded-lg"
            />
            <h3 className="text-xl font-bold mb-2">Arado de vertebras 975</h3>
            <p className="text-gray-700 mb-4">Estilo clásico combinado con innovaciones modernas. Está en nuestra herencia.</p>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300">APRENDE MÁS</button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <img 
              src={demoImg} 
              alt="Rastra Mx425" 
              className="w-full h-auto mb-4 rounded-lg"
            />
            <h3 className="text-xl font-bold mb-2">Rastra Mx425</h3>
            <p className="text-gray-700 mb-4">Peterbilt se asocia con PFC para ofrecer un programa FMV inmejorable para los camiones.</p>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300">APRENDE MÁS</button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <img 
              src={demoImg}
              alt="Cultivador Mx10" 
              className="w-full h-auto mb-4 rounded-lg"
            />
            <h3 className="text-xl font-bold mb-2">Cultivador Mx10</h3>
            <p className="text-gray-700 mb-4">Peterbilt se asocia con PFC para ofrecer un programa FMV inmejorable para los camiones.</p>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300">APRENDE MÁS</button>
          </div>
        </div>
      </div>
    </div>
  );
}