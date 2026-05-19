/**
 * @fileoverview Hero section para la página de inicio (Calm-Industrial).
 *
 * Minimalista, sin videos de fondo pesados ni overlays oscuros. 
 * Combina tipografía grande, alto contraste y enfoque en la funcionalidad.
 *
 * @module components/common/home/HomeVideo
 */

import { Link } from 'react-router-dom';
import { Tractor, ClipboardCheck } from 'lucide-react';

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

          {/* Contenido derecho (Panel informativo) */}
          <div className="flex-1 w-full lg:w-auto relative hidden md:block">
            <div className="max-w-[520px] mx-auto space-y-4">
              <div className="bg-card border border-border/60 rounded p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded flex items-center justify-center">
                    <Tractor className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-foreground">Ruta de cálculo en 3 pasos</p>
                    <p className="text-sm text-muted-foreground">Motor, llantas y clima para un resultado confiable.</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="border border-border/50 rounded px-3 py-2 text-sm text-center text-foreground">Motor</div>
                  <div className="border border-border/50 rounded px-3 py-2 text-sm text-center text-foreground">Llantas</div>
                  <div className="border border-border/50 rounded px-3 py-2 text-sm text-center text-foreground">Clima</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary/40 border border-border/60 rounded p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <ClipboardCheck className="w-5 h-5 text-primary" />
                    <h3 className="text-base font-semibold text-foreground">Resultados claros</h3>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>Fuerza de tracción requerida y margen seguro.</li>
                    <li>Compatibilidad tractor-implemento validada.</li>
                    <li>Alertas tempranas de sobreesfuerzo mecánico.</li>
                  </ul>
                </div>
                <div className="bg-card border border-border/60 rounded p-5">
                  <h3 className="text-base font-semibold text-foreground mb-2">Decisión rápida</h3>
                  <p className="text-sm text-muted-foreground">
                    Compara equipos con el mismo suelo y elige el que exige menos tracción.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="text-xs px-2 py-1 rounded border border-border/50 text-foreground">Tracción</span>
                    <span className="text-xs px-2 py-1 rounded border border-border/50 text-foreground">Deslizamiento</span>
                    <span className="text-xs px-2 py-1 rounded border border-border/50 text-foreground">Consumo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HomeVideo;
