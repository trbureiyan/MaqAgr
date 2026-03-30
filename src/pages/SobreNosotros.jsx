import React from 'react';
import Button from '../components/ui/buttons/Button';
import FondoAgr from '../assets/img/fondo.jpg'; // Assuming this exists based on AuthForm
import MachineImg from '../assets/img/2.png';

const VALUES = [
  {
    title: 'Innovación',
    description: 'Buscamos constantemente nuevas formas de mejorar la eficiencia en el campo a través de la tecnología.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: 'Calidad',
    description: 'Solo recomendamos equipos y maquinaria que cumplen con los más altos estándares de la industria.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
  },
  {
    title: 'Compromiso',
    description: 'Estamos comprometidos con el éxito de cada agricultor, brindando asesoría personalizada y experta.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
];

export default function SobreNosotros() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ── Hero Section ── */}
      <section className="relative w-full h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center opacity-85"
          style={{ backgroundImage: `url(${MachineImg})` }}
        />
        <div className="absolute inset-0 bg-[#1e2939]/70" /> {/* Overlay oscuro (navy) */}
        
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <p className="text-[#909d00] font-bold tracking-wider uppercase text-sm mb-3">Conoce Nuestra Historia</p>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
            Sobre Nosotros
          </h1>
          <p className="text-lg sm:text-xl text-gray-200">
            Revolucionando la forma en que el agricultor elige y administra su maquinaria.
          </p>
        </div>
      </section>

      {/* ── Misión y Visión ── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#1e2939] mb-4">Nuestra Misión</h2>
              <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                Proporcionar a los agricultores y operadores del campo las mejores recomendaciones 
                técnicas para garantizar la compatibilidad entre tractores e implementos, 
                maximizando la eficiencia, reduciendo costos operativos y prolongando la vida 
                útil de su maquinaria agrícola.
              </p>

              <h2 className="text-3xl font-bold text-[#1e2939] mb-4">Nuestra Visión</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                Ser la plataforma líder a nivel nacional e internacional en la gestión, evaluación 
                y recomendación inteligente de equipos agrícolas, promoviendo prácticas sostenibles 
                y el uso óptimo de la tecnología en el agro.
              </p>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl h-80 md:h-[500px]">
              {/* Imagen decorativa para la sección */}
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${FondoAgr})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#893d46]/40 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Valores ── */}
      <section className="py-16 sm:py-24 bg-muted/40 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1e2939] mb-12">Nuestros Valores</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {VALUES.map((val, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-border hover:shadow-md transition-shadow">
                <div className="w-16 h-16 mx-auto bg-[#909d00]/10 text-[#909d00] flex items-center justify-center rounded-2xl mb-6">
                  {val.icon}
                </div>
                <h3 className="text-xl font-bold text-[#1e2939] mb-3">{val.title}</h3>
                <p className="text-gray-600 leading-relaxed">{val.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Call To Action ── */}
      <section className="py-16 sm:py-20 bg-[#1e2939]">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl font-bold text-white mb-6">¿Listo para optimizar tu trabajo?</h2>
          <p className="text-gray-300 mb-8 text-lg">
            Descubre qué maquinaria es la ideal para tu tractor realizando un análisis de compatibilidad 
            técnica con nuestra calculadora especializada.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              to="/Calculadora" 
              variant="primary" 
              color="#909d00" 
              size="large"
              shape="pill"
            >
              Ir a la Calculadora
            </Button>
            <Button 
              to="/Catalogo" 
              variant="outline" 
              color="#ffffff" 
              size="large"
              shape="pill"
              className="border-white text-white hover:bg-white/10"
            >
              Ver Catálogo
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
