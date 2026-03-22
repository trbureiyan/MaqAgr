/**
 * @fileoverview Pie de página global de MaqAgr.
 *
 * Componente estático que muestra el crédito del equipo de desarrollo
 * con un enlace a la página "Sobre Nosotros". Se adapta a cualquier
 * ancho de pantalla gracias al contenedor centrado con padding responsive.
 *
 * @module components/layout/Footer
 */

import React from 'react';
import { Link } from 'react-router-dom';

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

/**
 * Footer — Pie de página de la aplicación.
 *
 * Renderiza un bloque de copyright con un enlace interno al equipo.
 * Se posiciona al final del layout gracias a `flex-grow` en `<main>` (App.jsx).
 *
 * @component
 * @returns {JSX.Element} Elemento `<footer>` con información de autoría.
 *
 * @example
 * // Uso dentro del layout principal (App.jsx)
 * <Footer />
 */
const Footer = () => {
  return (
    <footer className="bg-[#1e2939] py-5">
      {/* Contenedor centrado con padding horizontal responsive */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Texto de copyright con enlace al equipo */}
        <p className="text-sm text-gray-400">
          © 2025{' '}
          <Link
            to="/SobreNosotros"
            className="font-medium text-[#909d00] hover:text-[#909d00]/80 transition-colors"
          >
            Equipo de Maquinaria Agrícola
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
