/**
 * @fileoverview Hero section para la página de inicio (Calm-Industrial).
 *
 * @module components/common/home/HomeVideo
 */

import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Tractor, Shield, Cpu, Gauge, Compass } from 'lucide-react';
import heroImage from '@/assets/domain/branding-tractor-field-sunset-pexels-andres-alaniz.webp';

const HomeVideo = () => {
  return (
    <section className="relative w-full bg-background overflow-hidden border-b border-border/60 py-12 lg:py-20">
      {/* Elementos decorativos de fondo con gradientes suaves */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-primary/3 blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Contenido izquierdo (Texto) */}
          <div className="flex-grow flex-shrink-0 lg:w-7/12 text-left z-10">
            
            {/* Tag / Badge de Origen Premium */}
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-foreground leading-[1.05] mb-4 tracking-tight"
            >
              MAQ<span className="text-primary bg-gradient-to-r from-primary to-emerald-700 bg-clip-text text-transparent">AGR</span>
            </motion.h1>

            {/* Título disruptivo */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground leading-[1.1] mb-6 tracking-tight">
              Sincroniza la <span className="text-primary bg-gradient-to-r from-primary to-emerald-700 bg-clip-text text-transparent">potencia mecánica</span> con la física de tu suelo.
            </h2>

            {/* Pitch principal (Storytelling) */}
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
              De la academia a la frontera agrícola. Modernizamos la física de tractores mediante papers cientificos y estándares ASABE D497.7. 
              Calibramos pérdidas dinámicas de altitud, pendiente y resistencia de rodadura en tiempo real. 
              <span className="block mt-2 font-semibold text-foreground">Optimization-as-a-Service para el agro colombiano.</span>
            </p>

            {/* Botones de acción premium */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link 
                  to="/Calculadora" 
                  className="w-full sm:w-auto inline-flex items-center justify-center h-13 px-8 bg-primary text-primary-foreground text-base font-bold rounded shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all gap-2"
                >
                  <Gauge className="w-5 h-5" />
                  Iniciar Diagnóstico
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link 
                  to="/Catalogo" 
                  className="w-full sm:w-auto inline-flex items-center justify-center h-13 px-8 bg-background border-2 border-border text-foreground text-base font-semibold rounded hover:bg-muted/60 transition-all gap-2"
                >
                  <Compass className="w-5 h-5" />
                  Consultar Catálogo
                </Link>
              </motion.div>
            </div>

            {/* Quick stats en fila */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-border/50 max-w-md">
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-foreground">REC-001</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Algoritmo de Match</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-foreground">-1%</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Por 300m de Altitud</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-foreground">ASABE</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Standard D497.7</p>
              </div>
            </div>
          </div>

          {/* Contenido derecho (Imagen de dominio + Consola de Física Interactiva) */}
          <div className="flex-grow flex-shrink-0 lg:w-5/12 w-full relative z-10">
            <motion.div
              className="relative max-w-[500px] mx-auto"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              {/* Contenedor de la Imagen */}
              <div className="relative rounded-2xl overflow-hidden border border-border/60 shadow-2xl">
                <img
                  src={heroImage}
                  alt="Tractor de precisión agrícola en campo"
                  className="w-full h-[400px] object-cover filter brightness-[0.9]"
                />
                
                {/* Degradado sobre la imagen para integrar texto */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                
                {/* Badge flotante — herencia científica */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 bg-background/90 backdrop-blur-md rounded-xl p-3 border border-border/30">
                  <div className="bg-primary/10 p-2 rounded-lg text-primary">
                    <Tractor className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Calcula antes de trabajar el suelo</h4>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HomeVideo;

