/**
 * @fileoverview Página de inicio (Home) de MaqAgr.
 *
 * Presenta el hero multimedia seguido de dos secciones de tarjetas destacadas:
 * tractores y maquinaria agrícola. Cada sección usa una grilla responsive
 * que va de 1 columna en móvil a 3 columnas en desktop.
 *
 * Estructura de la página:
 *  1. Hero — imagen de fondo con carrusel de mensajes
 *  2. Sección "Ciencia Detrás" — Storytelling y formulas del motor físico
 *  3. Sección "El Dilema del Campo Colombiano" — Desafíos agronómicos reales
 *  4. Sección "Tractores Destacados" — grilla de TractorMachineCard
 *  5. Sección "Máquinas Destacadas"  — grilla de TractorMachineCard (fondo muted)
 *
 * @module pages/Home
 */

import React, { useState, useEffect } from 'react';
import { PiTractorFill as TractorImg } from "react-icons/pi";
import { motion } from 'motion/react';
import { 
  Cpu, 
  Gauge, 
  ShieldAlert, 
  TrendingUp, 
  BookOpen, 
  Layers, 
  Compass, 
  Workflow, 
  FileText,
  BadgeAlert,
  AlertTriangle,
  Zap
} from 'lucide-react';
import MachineImg from '../../assets/icons/plow.webp';
import Hero from '@/components/layout/Hero';
import TractorMachineCard from '@/features/tractors/components/TractorMachineCard';
import SkeletonCard from '@/components/ui/SkeletonCard';
import { getTractors } from '../../services/tractorApi';
import { getImplements } from '../../services/implementApi';

// ---------------------------------------------------------------------------
// Datos estáticos de muestra con copywriting premium "Silicon Valley in Colombia"
// ---------------------------------------------------------------------------

const FEATURED_TRACTORS = [
  {
    imageSrc: TractorImg,
    link: '/tractor/1',
    title: 'New Holland 8670',
    description: 'Calibrado para suelos arenosos-francos de la Orinoquía. Soporta picos de fricción media con bajo patinamiento dinámico.',
  },
  {
    imageSrc: TractorImg,
    link: '/tractor/1',
    title: 'John Deere 5090E',
    description: 'Equipado con tracción asistida para laderas andinas y transporte. Compensación activa de pérdida por humedad de suelo.',
  },
  {
    imageSrc: TractorImg,
    link: '/tractor/1',
    title: 'Ford 4610',
    description: 'Un clásico de arrastre ligero para la costa Caribe, ideal para transporte e implementos de penetración superficial.',
  },
];

const FEATURED_MACHINES = [
  {
    imageSrc: MachineImg,
    link: '/maquinaria/2',
    title: 'Arado de vértebras 975',
    description: 'Demanda un torque masivo corregido por el motor Chaparro. Diseñado para corte profundo de suelos arcillosos compactados.',
  },
  {
    imageSrc: MachineImg,
    link: '/maquinaria/2',
    title: 'Rastra Mx425',
    description: 'Preparador de cama de siembra de alta eficiencia en suelos arcillosos de dureza media en el Tolima Grande.',
  },
  {
    imageSrc: MachineImg,
    link: '/maquinaria/2',
    title: 'Cultivador Mx10',
    description: 'Cultivador de alta precisión interlineal. Minimiza la resistencia lateral para cultivos en surcos estrechos.',
  },
];

// ---------------------------------------------------------------------------
// Sub-componente: encabezado de sección
// ---------------------------------------------------------------------------

const SectionHeader = ({ tag, title, description, center = false }) => (
  <div className={`mb-8 md:mb-12 ${center ? 'text-center' : 'text-left'}`}>
    <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2 justify-start">
      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
      {tag}
    </p>

    <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
      {title}
    </h2>

    <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
      {description}
    </p>
  </div>
);

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

const Home = () => {
  const [tractors, setTractors] = useState([]);
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const [tractorsRes, machinesRes] = await Promise.all([
          getTractors({ limit: 3 }),
          getImplements({ limit: 3 })
        ]);

        if (tractorsRes?.success && tractorsRes.data?.length > 0) {
          setTractors(
            tractorsRes.data.slice(0, 3).map((t) => ({
              imageSrc: t.image || t.imageUrl || t.image_url || (t.images && t.images[0]) || TractorImg,
              link: `/tractor/${t.tractorId || t.id}`,
              title: `${t.brand} ${t.name || t.model}`,
              description: `Tractor con una potencia nominal de ${t.enginePowerHp} HP y tracción ${t.tractionType || 'N/A'}. Calibrado para terrenos nacionales.`,
            }))
          );
        } else {
          setTractors(FEATURED_TRACTORS);
        }

        if (machinesRes?.success && machinesRes.data?.length > 0) {
          setMachines(
            machinesRes.data.slice(0, 3).map((m) => ({
              imageSrc: m.image || m.imageUrl || m.image_url || (m.images && m.images[0]) || MachineImg,
              link: `/maquinaria/${m.implementId || m.id}`,
              title: `${m.brand} ${m.implementName || m.name}`,
              description: `Implemento de ${m.workingWidthM || '?'} m de ancho. Requiere ${m.powerRequirementHp} HP mínimos para tracción efectiva.`,
            }))
          );
        } else {
          setMachines(FEATURED_MACHINES);
        }
      } catch (error) {
        console.error('Error fetching featured items:', error);
        setTractors(FEATURED_TRACTORS);
        setMachines(FEATURED_MACHINES);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground overflow-hidden">

      {/* ── 1. Hero principal con branding Devurity ── */}
      <Hero />

      {/* ── 2. Sección: La Ciencia Detrás (Motor de Física Chaparro-Cedeño) ── */}
      <section className="py-20 bg-background border-b border-border/50 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          <SectionHeader
            title="La ciencia que gobierna la barra de tiro"
            description="No calibres al ojo. El rendimiento de tu tractor en campo no depende solo de la ficha técnica. Nuestro núcleo físico simula variables dinámicas en tiempo real."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            
            {/* Tarjeta de Física 1: Altitud y Pérdida Volumétrica */}
            <motion.div 
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-[#fffefc] border border-[#e5e7eb] rounded-[14px] p-6 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="bg-[#e1f4df] w-12 h-12 rounded-[10px] flex items-center justify-center text-[#0f3e17] mb-5">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0f3e17] mb-3 flex items-center gap-2">
                Pérdida Atmosférica
              </h3>
              <p className="text-sm text-[#333333] leading-relaxed mb-5 font-sans">
              El aire andino reduce la eficiencia volumétrica. Calculamos la penalización del <span className="font-semibold text-foreground">1% por cada 300m</span> en motores aspirados, compensando dinámicamente si el equipo cuenta con turbocompresor.
              </p>
              
              {/* Ecuación estilo LaTeX lightweight en HTML */}
              <div className="bg-[#e1f4df]/40 py-4 px-3 rounded-[10px] text-[#0f3e17] border border-[#b1dbb8]/20 flex items-center justify-center gap-1 font-serif text-[13px] sm:text-sm select-none">
                <span className="italic font-bold">HP</span><sub className="text-[10px] -ml-0.5 font-sans font-semibold">alt</sub>
                <span className="mx-1">=</span>
                <span className="italic font-bold">HP</span><sub className="text-[10px] -ml-0.5 font-sans font-semibold">bruta</sub>
                <span className="mx-1">&times;</span>
                <span className="inline-flex flex-col items-center justify-center align-middle mx-1">
                  <span className="border-b border-[#0f3e17]/50 px-1 text-[11px] italic font-medium leading-none pb-0.5">Altitud</span>
                  <span className="text-[10px] font-sans font-bold leading-none pt-0.5">300</span>
                </span>
                <span className="mx-1">&times;</span>
                <span className="font-semibold">0.01</span>
              </div>
            </motion.div>

            {/* Tarjeta de Física 2: Resistencia a la Rodadura (ASABE D497.7) */}
            <motion.div 
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-[#fffefc] border border-[#e5e7eb] rounded-[14px] p-6 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="bg-[#e1f4df] w-12 h-12 rounded-[10px] flex items-center justify-center text-[#0f3e17] mb-5">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0f3e17] mb-3">
                Rodadura Standard ASABE
              </h3>
              <p className="text-sm text-[#333333] leading-relaxed mb-5 font-sans">
              La fricción del suelo destruye el torque. Implementamos el coeficiente <span className="font-semibold text-foreground">μ_r = 1.2/Cn + 0.04</span> basado en el Índice de Cono del suelo, prediciendo la resistencia del neumático al hundimiento.
              </p>
              
              {/* Ecuación estilo LaTeX lightweight en HTML */}
              <div className="bg-[#e1f4df]/40 py-4 px-3 rounded-[10px] text-[#0f3e17] border border-[#b1dbb8]/20 flex items-center justify-center gap-1 font-serif text-[13px] sm:text-sm select-none">
                <span className="italic font-bold">&mu;</span><sub className="text-[10px] -ml-0.5 font-sans font-semibold">r</sub>
                <span className="mx-1">=</span>
                <span className="inline-flex flex-col items-center justify-center align-middle mx-1">
                  <span className="border-b border-[#0f3e17]/50 px-2 text-[11px] font-bold leading-none pb-0.5">1.2</span>
                  <span className="text-[10px] font-medium leading-none pt-0.5 italic">C<sub className="text-[8px] -ml-0.5 font-sans font-semibold">n</sub></span>
                </span>
                <span className="mx-1">+</span>
                <span className="font-semibold">0.04</span>
              </div>
            </motion.div>

            {/* Tarjeta de Física 3: Algoritmo de Matchmaking REC-001 */}
            <motion.div 
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-[#fffefc] border border-[#e5e7eb] rounded-[14px] p-6 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="bg-[#e1f4df] w-12 h-12 rounded-[10px] flex items-center justify-center text-[#0f3e17] mb-5">
                <Workflow className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0f3e17] mb-3">
                Scoring Multicriterio REC-001
              </h3>
              <p className="text-sm text-[#333333] leading-relaxed mb-5 font-sans">
                Una matriz de 100 puntos pondera Eficiencia de Potencia (30%), Tracción (25%), Suelo (20%), Economía (15%) y Disponibilidad (10%), evitando sobredimensionamientos dañinos.
              </p>
              
              {/* Ecuación estilo LaTeX lightweight en HTML */}
              <div className="bg-[#e1f4df]/40 py-4 px-3 rounded-[10px] text-[#0f3e17] border border-[#b1dbb8]/20 flex items-center justify-center gap-0.5 font-serif text-[12px] sm:text-[13px] select-none overflow-x-auto">
                <span className="font-bold">Match</span>
                <span className="mx-1">=</span>
                <span className="italic font-bold">f</span>
                <span>(</span>
                <span className="text-[11px] font-bold px-0.5 italic font-sans">Eff</span>
                <span>,</span>
                <span className="text-[11px] font-bold px-0.5 italic font-sans">Trac</span>
                <span>,</span>
                <span className="text-[11px] font-bold px-0.5 italic font-sans">Soil</span>
                <span>,</span>
                <span className="text-[11px] font-bold px-0.5 italic font-sans">Econ</span>
                <span>,</span>
                <span className="text-[11px] font-bold px-0.5 italic font-sans">Avail</span>
                <span>)</span>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── 3. Sección: El Dilema del Campo Colombiano (Storytelling) ── */}
      <section className="py-20 bg-secondary/20 border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col lg:flex-row items-center gap-12">
            
            {/* Panel de Texto */}
            <div className="flex-1">
              <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">
                Problemática y Origen
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-6">
                El origen de MaqAgr: Rescatando la ciencia de la Universidad Surcolombiana
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-6">
              MaqAgr nace en la <span className="font-semibold text-foreground">USCO sede Neiva</span>, impulsado por profesores de Ingeniería Agrícola y el <span className="font-semibold text-foreground">Semillero de Investigación Devurity</span>. Nuestro propósito fue rescatar y rediseñar por completo un proyecto de tesis de grado estancado en electrónica obsoleta y cálculos inexactos. 
              </p>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-8">
              El resultado es una plataforma de <span className="font-semibold text-foreground">física mecánica aplicada</span>, validada académicamente y presentada formalmente en el congreso <span className="font-semibold text-foreground">AmITIC 2025</span>. Hoy, responde a las necesidades críticas del agricultor y del estudiante para erradicar las malas prácticas empíricas en el campo colombiano.
              </p>


              {/* Grid de Dilemas en tarjetas pequeñas */}
              <div className="space-y-4">
                <div className="flex gap-4 p-4 rounded-lg bg-card border border-border/50">
                  <div className="text-destructive mt-1">
                    <BadgeAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm">El Secuestro de Caballos de Fuerza (Altitud)</h4>
                    <p className="text-xs text-muted-foreground mt-1">Operar en la Sabana de Bogotá (2,600 msnm) evapora un 8.6% de la potencia del tractor. Sin cálculo dinámico, tu maquinaria sufrirá de subdimensionamiento crítico y fallas de torque.</p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 rounded-lg bg-card border border-border/50">
                  <div className="text-amber-600 mt-1">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm">Destrucción de Raíces por Compactación</h4>
                    <p className="text-xs text-muted-foreground mt-1">Los suelos arcillosos pesados del Tolima Grande y el Huila se compactan letalmente si se usan llantas inadecuadas. MaqAgr restringe tracciones 4x2 en pendientes pronunciadas para salvaguardar tu cultivo.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full">
              <div className="border border-border rounded-lg bg-background shadow-sm overflow-hidden text-sm text-foreground">
                
                {/* Header del Panel */}
                <div className="bg-muted/30 px-4 py-3 border-b border-border flex items-center justify-between">
                  <span className="font-medium">
                    Simulador Físico de Acople
                  </span>
                </div>

                {/* Contenido del Panel */}
                <div className="p-5 space-y-6">
                  
                  {/* Bloque 1: Parámetros del Suelo */}
                  <div>
                    <div className="font-medium mb-3">1. Caracterización del Terreno (Tolima Grande)</div>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                      <div>
                        <span className="text-muted-foreground block text-xs mb-1">Tipo de Suelo</span>
                        <span>Franco-Arcilloso (Clay = 1.30)</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-xs mb-1">Pendiente Máxima</span>
                        <span>12%</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-xs mb-1">Altitud</span>
                        <span>450 msnm</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-xs mb-1">Temperatura</span>
                        <span>32°C</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border" />

                  {/* Bloque 2: Configuración del Acople */}
                  <div>
                    <div className="font-medium mb-3">2. Equipos Acoplados</div>
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center text-sm">
                      <div className="flex items-center gap-3">
                        <TractorImg className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <span className="text-muted-foreground block text-xs">Tractor</span>
                          <span>John Deere 5090E</span>
                        </div>
                      </div>
                      <span className="text-muted-foreground hidden sm:block">×</span>
                      <div className="flex items-center gap-3">
                        <img src={MachineImg} alt="Arado" className="w-5 h-5 object-contain opacity-70" />
                        <div>
                          <span className="text-muted-foreground block text-xs">Implemento</span>
                          <span>Arado de vértebras 975</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border" />

                  {/* Bloque 3: Telemetría de Pérdidas y Scoring */}
                  <div>
                    <div className="font-medium mb-3 flex justify-between items-center">
                      <span>3. Telemetría y Análisis Mecánico</span>
                      <span className="text-xs text-muted-foreground font-normal">ASABE D497.7</span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Potencia Requerida Acoplada</span>
                        <span>115.4 HP</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Coeficiente de Rodadura (&mu;<sub>r</sub>)</span>
                        <span>0.147</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Pérdida por Fricción Mecánica</span>
                        <span className="text-destructive">-13.00%</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Pérdida por Alta Temperatura</span>
                        <span className="text-destructive">-3.40%</span>
                      </div>
                    </div>
                  </div>

                  {/* Resultado Final */}
                  <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                    <span className="font-medium">Scoring REC-001</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm">Recomendado Óptimo</span>
                      <span className="font-medium bg-muted px-2 py-1 rounded">89.45 / 100</span>
                    </div>
                  </div>

                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── 4. Sección: Tractores Destacados ── */}
      <section className="py-20 border-b border-border/50 relative" aria-labelledby="tractores-heading">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            tag="Catálogo Físico"
            title="Tractores Destacados"
            description="Consulta las especificaciones de tracción, potencia corregida y peso operativo de los modelos más representativos."
          />

          {/* Grilla responsive */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <SkeletonCard key={idx} />
              ))
            ) : (
              tractors.map((tractor) => (
                <TractorMachineCard
                  key={tractor.title}
                  imageSrc={tractor.imageSrc}
                  link={tractor.link}
                  title={tractor.title}
                  description={tractor.description}
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* ── 5. Sección: Máquinas Destacadas (fondo secondary para contraste) ── */}
      <section className="py-20 bg-secondary/15" aria-labelledby="maquinas-heading">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            tag="Demanda Mecánica"
            title="Implementos Destacados"
            description="Explora rastras, arados y cultivadores calibrados según su requerimiento de barra de tiro y profundidad operativa."
          />

          {/* Grilla responsive */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <SkeletonCard key={idx} />
              ))
            ) : (
              machines.map((machine) => (
                <TractorMachineCard
                  key={machine.title}
                  imageSrc={machine.imageSrc}
                  link={machine.link}
                  title={machine.title}
                  description={machine.description}
                />
              ))
            )}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
