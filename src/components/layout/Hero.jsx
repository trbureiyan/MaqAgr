/**
 * @fileoverview Hero section para la página de inicio (Calm-Industrial).
 *
 * Minimalista, sin videos de fondo pesados ni overlays oscuros. 
 * Combina tipografía grande, alto contraste y enfoque en la funcionalidad.
 *
 * @module components/common/home/HomeVideo
 */

import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Tractor } from 'lucide-react';
import heroImage from '@/assets/domain/branding-tractor-field-sunset-pexels-andres-alaniz.webp';

const HomeVideo = () => {
  return (
    <section className="relative w-full bg-background overflow-hidden border-b border-border/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-20 pb-20 sm:pt-28 sm:pb-24 lg:pt-32 lg:pb-32 flex flex-col md:flex-row items-center gap-12">
          
          {/* Contenido izquierdo (Texto) */}
          <div className="flex-1 text-left">
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-foreground leading-[1.05] mb-4 tracking-tight">
              MAQAGR
            </h1>

            <p className="text-2xl sm:text-3xl md:text-4xl font-semibold text-primary mb-6 leading-tight">
              Sistema de apoyo a decisión en mecanización agrícola
            </p>

            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-10 max-w-xl leading-relaxed">
              Aplicativo web para gestionar equipos y calcular compatibilidad tractor-implemento según suelo y clima.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/Calculadora" 
                className="inline-flex items-center justify-center h-12 px-6 bg-primary text-primary-foreground text-lg font-semibold rounded hover:bg-primary/90 transition-colors"
              >
                Iniciar cálculo
              </Link>
              <Link 
                to="/Catalogo" 
                className="inline-flex items-center justify-center h-12 px-6 bg-background border-2 border-border text-foreground text-lg font-semibold rounded hover:bg-muted transition-colors"
              >
                Consultar Catálogo
              </Link>
            </div>
          </div>

          {/* Contenido derecho (Imagen de dominio) */}
          <div className="flex-1 w-full lg:w-auto relative hidden md:block">
            <motion.div
              className="relative max-w-[520px] mx-auto"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <img
                src={heroImage}
                alt="Tractor agrícola en campo al atardecer"
                className="w-full max-h-[420px] object-cover rounded-md border border-border/40"
              />

              {/* Badge flotante — estadística mínima */}
              <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-foreground/80 text-background backdrop-blur-sm rounded-md px-3 py-1.5">
                <Tractor className="w-4 h-4" />
                <span className="text-xs font-semibold">150+ Tractores registrados</span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HomeVideo;
