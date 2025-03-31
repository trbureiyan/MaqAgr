import React from 'react';
import TractorMachineCard from '../components/TractorMachineCard';
import Maquina from '../assets/img/2.png'

export default function CatalogoMaquinas() {
  const machines = [
    {
      imageSrc: [Maquina],
      link: '/machine1',
      title: 'Máquina Modelo 1',
      description: 'Descripción breve de la máquina modelo 1.',
    },
    {
      imageSrc: [Maquina],
      link: '/machine2',
      title: 'Máquina Modelo 2',
      description: 'Descripción breve de la máquina modelo 2.',
    },
    {
      imageSrc: [Maquina],
      link: '/machine3',
      title: 'Máquina Modelo 3',
      description: 'Descripción breve de la máquina modelo 3.',
    },
    {
        imageSrc: [Maquina],
        link: '/machine3',
        title: 'Máquina Modelo 4',
        description: 'Descripción breve de la máquina modelo 4.',
      },
      {
        imageSrc: [Maquina],
        link: '/machine3',
        title: 'Máquina Modelo 5',
        description: 'Descripción breve de la máquina modelo 5.',
      },
      {
        imageSrc: [Maquina],
        link: '/machine3',
        title: 'Máquina Modelo 6',
        description: 'Descripción breve de la máquina modelo 6.',
      },
    // Agrega más objetos según sea necesario
  ];

  return (
    <div className="flex">
      {/* Filtro lateral */}
      <aside className="w-1/4 p-4 border-r border-gray-200">
        <h2 className="text-lg font-bold mb-4">Filtros</h2>
       
        <div className="mb-4">
          <h3 className="font-semibold">Marca</h3>
          <ul>
            <li><input type="checkbox" id="marca1" /> <label htmlFor="marca1">Marca 1</label></li>
            <li><input type="checkbox" id="marca2" /> <label htmlFor="marca2">Marca 2</label></li>
            <li><input type="checkbox" id="marca3" /> <label htmlFor="marca3">Marca 3</label></li>
            <li><input type="checkbox" id="marca4" /> <label htmlFor="marca4">Marca 4</label></li>
          </ul>
        </div>
        <div className="mb-4">
          <h3 className="font-semibold">Modelo</h3>
          <input type="text" className="border border-gray-300 rounded p-2 w-full" placeholder="Buscar modelo" />
        </div>
        <div className="mb-4">
          <h3 className="font-semibold">Fuerza Requerida</h3>
          <input type="number" className="border border-gray-300 rounded p-2 w-full" placeholder="Min" />
          <input type="number" className="border border-gray-300 rounded p-2 w-full mt-2" placeholder="Max" />
        </div>
      </aside>

      {/* Contenedor de tarjetas */}
      <main className="w-3/4 p-4">
        <div className="grid grid-cols-3 gap-4">
          {machines.map((machine, index) => (
            <TractorMachineCard
              key={index}
              imageSrc={machine.imageSrc}
              link={machine.link}
              title={machine.title}
              description={machine.description}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
