import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Icons/logo';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const renderMobileMenu = () => {
    if (isMenuOpen) {
      return (
        <div className="sm:hidden" id="mobile-menu">
          <div className="space-y-1 px-4 pt-3 pb-4">
            <Link 
              to="/" 
              className="block rounded-md px-4 py-3 text-lg font-medium text-gray-100 hover:bg-[#909d00] hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/catalogo" 
              className="block rounded-md px-4 py-3 text-lg font-medium text-gray-100 hover:bg-[#909d00] hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Catálogo
            </Link>
            <Link 
              to="/sobre-nosotro" 
              className="block rounded-md px-4 py-3 text-lg font-medium text-gray-100 hover:bg-[#909d00] hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Sobre Nosotros
            </Link>
            <Link 
              to="/calculadora" 
              className="block rounded-md px-4 py-3 text-lg font-medium text-gray-100 hover:bg-[#909d00] hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Calculadora
            </Link>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <nav className="bg-gray-800 py-3 shadow-lg">
      <div className="mx-auto max-w-7xl px-3 sm:px-5 lg:px-7">
        <div className="relative flex h-13 items-center justify-between">
          {/* Área izquierda: Botón del menú móvil */}
          <div className="sm:hidden z-10 flex items-center">
            <button 
              type="button" 
              className="relative inline-flex items-center justify-center rounded-md p-3 text-gray-100 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" 
              aria-controls="mobile-menu" 
              aria-expanded={isMenuOpen}
              onClick={toggleMenu}
            >
              <span className="absolute -inset-0.5"></span>
              <span className="sr-only">Abrir menú principal</span>

              {/* # By condicional: */}
              {/* Icono cuando el menú está cerrado */}
              <svg 
                className={`${isMenuOpen ? 'hidden' : 'block'} size-7`} 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth="1.5" 
                stroke="currentColor" 
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
              
              {/* Icono cuando el menú está abierto */}
              <svg 
                className={`${isMenuOpen ? 'block' : 'hidden'} size-7`} 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth="1.5" 
                stroke="currentColor" 
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Logo - Centrado en móvil, a la izquierda en desktop */}
          <div className="absolute left-0 right-0 flex justify-center sm:static sm:justify-start sm:flex-grow-0">
            <div className="flex-shrink-0">
              <Logo size="default" color="#909d00" link={true} />
            </div>
          </div>
          
          <div className="flex items-center">
            {/* Enlaces de navegación Desktop*/}
            <div className="hidden sm:flex sm:items-center sm:space-x-6 mr-6">
              <Link 
                to="/" 
                className="rounded-md px-4 py-2.5 text-base font-medium text-gray-100 hover:bg-[#909d00] hover:text-white transition duration-150"
              >
                Home
              </Link>
              <Link 
                to="/catalogo" 
                className="rounded-md px-4 py-2.5 text-base font-medium text-gray-100 hover:bg-[#909d00] hover:text-white transition duration-150"
              >
                Catálogo
              </Link>
              <Link 
                to="/sobre-nosotro" 
                className="rounded-md px-4 py-2.5 text-base font-medium text-gray-100 hover:bg-[#909d00] hover:text-white transition duration-150"
              >
                Sobre Nosotros
              </Link>
              <Link 
                to="/calculadora" 
                className="rounded-md px-4 py-2.5 text-base font-medium text-gray-100 hover:bg-[#909d00] hover:text-white transition duration-150"
              >
                Calculadora
              </Link>
            </div>
            
            {/* Botón de login - Visible en todas las pantallas */}
            <Link 
              to="/login" 
              className="rounded-md bg-[#df6573] px-5 py-2.5 text-base font-medium text-white hover:bg-[#c55765] transition duration-150 z-10"
            >
              Login
            </Link>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      {renderMobileMenu()}
    </nav>
  );
};

export default Navbar;