import React from 'react';
import TractorMachineCard from '../components/TractorMachineCard';
import Tractor from '../assets/img/Tractor Prueva.webp';

export default function CatalogoTractores() {
  const tractors = [
    {
      imageSrc: [Tractor],
      link: '/tractor1',
      title: 'Tractor Modelo 1',
      description: 'Descripción breve del tractor modelo 1.',
    },
    {
      imageSrc: [Tractor],
      link: '/tractor2',
      title: 'Tractor Modelo 2',
      description: 'Descripción breve del tractor modelo 2.',
    },
    {
      imageSrc: [Tractor],
      link: '/tractor3',
      title: 'Tractor Modelo 3',
      description: 'Descripción breve del tractor modelo 3.',
    },
    {
      imageSrc: [Tractor],
      link: '/tractor4',
      title: 'Tractor Modelo 4',
      description: 'Descripción breve del tractor modelo 4.',
    },
    {
      imageSrc: [Tractor],
      link: '/tractor5',
      title: 'Tractor Modelo 5',
      description: 'Descripción breve del tractor modelo 5.',
    },
    {
      imageSrc: [Tractor],
      link: '/tractor6',
      title: 'Tractor Modelo 6',
      description: 'Descripción breve del tractor modelo 6.',
    },
    // Agrega más objetos según sea necesario
  ];

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Filtro lateral */}
      <aside className="w-full lg:w-1/4 p-4 border-b lg:border-b-0 lg:border-r border-gray-200">
        <h2 className="text-lg font-bold mb-4">Filtros</h2>
        <div className="mb-4">
          <h3 className="font-semibold">Marca</h3>
          <ul>
            <li><input type="checkbox" id="marca1" /> <label htmlFor="marca1">John Deere</label></li>
            <li><input type="checkbox" id="marca2" /> <label htmlFor="marca2">New Holland</label></li>
            <li><input type="checkbox" id="marca3" /> <label htmlFor="marca3">Massey Ferguson</label></li>
            <li><input type="checkbox" id="marca4" /> <label htmlFor="marca4">Kubota</label></li>
          </ul>
        </div>
        <div className="mb-4">
          <h3 className="font-semibold">Modelo</h3>
          <input type="text" className="border border-gray-300 rounded p-2 w-full" placeholder="Buscar modelo" />
        </div>
        <div className="mb-4">
          <h3 className="font-semibold">Fuerza Bruta</h3>
          <input type="number" className="border border-gray-300 rounded p-2 w-full" placeholder="Min" />
          <input type="number" className="border border-gray-300 rounded p-2 w-full mt-2" placeholder="Max" />
        </div>
        <div className="mb-4">
          <h3 className="font-semibold">Fuerza Requerida</h3>
          <input type="number" className="border border-gray-300 rounded p-2 w-full" placeholder="Min" />
          <input type="number" className="border border-gray-300 rounded p-2 w-full mt-2" placeholder="Max" />
        </div>
      </aside>

      {/* Contenedor de tarjetas */}
      <main className="w-full lg:w-3/4 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {tractors.map((tractor, index) => (
            <TractorMachineCard
              key={index}
              imageSrc={tractor.imageSrc}
              link={tractor.link}
              title={tractor.title}
              description={tractor.description}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
