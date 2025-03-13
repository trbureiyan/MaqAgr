import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/img/Logo.svg';

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
              className="block rounded-md px-4 py-3 text-lg font-medium text-gray-100 hover:bg-[#6d7700] hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/catalogo" 
              className="block rounded-md px-4 py-3 text-lg font-medium text-gray-100 hover:bg-[#6d7700] hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Catálogo
            </Link>
            <Link 
              to="/sobre-nosotro" 
              className="block rounded-md px-4 py-3 text-lg font-medium text-gray-100 hover:bg-[#6d7700] hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Sobre Nosotros
            </Link>
            <Link 
              to="/calculadora" 
              className="block rounded-md px-4 py-3 text-lg font-medium text-gray-100 hover:bg-[#6d7700] hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Calculadora
            </Link>
            <Link 
              to="/login" 
              className="block rounded-md bg-[#df6573] px-4 py-3 text-lg font-medium text-white hover:bg-red-800"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <nav className="bg-gray-800 py-3 shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-20 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Botón del menú móvil */}
            <button 
              type="button" 
              className="relative inline-flex items-center justify-center rounded-md p-3 text-gray-100 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" 
              aria-controls="mobile-menu" 
              aria-expanded={isMenuOpen}
              onClick={toggleMenu}
            >
              <span className="absolute -inset-0.5"></span>
              <span className="sr-only">Abrir menú principal</span>
              
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
          
          {/* Contenedor central con logo y enlaces */}
          <div className="flex flex-1 items-center justify-center">
            <div className="flex shrink-0 items-center">
              <Link to="/">
                <img 
                  className="h-20 w-auto" 
                  src={Logo} 
                  alt="Logo" 
                  style={{ filter: "invert(34%) sepia(93%) saturate(1055%) hue-rotate(42deg) brightness(93%) contrast(101%)" }} 
                />
              </Link>
            </div>
            <div className="hidden sm:ml-8 sm:block">
              <div className="flex space-x-6">
                <Link 
                  to="/" 
                  className="rounded-md px-4 py-2.5 text-base font-medium text-gray-100 hover:bg-[#6d7700] hover:text-white transition duration-150"
                >
                  Home
                </Link>
                <Link 
                  to="/catalogo" 
                  className="rounded-md px-4 py-2.5 text-base font-medium text-gray-100 hover:bg-[#6d7700] hover:text-white transition duration-150"
                >
                  Catálogo
                </Link>
                <Link 
                  to="/sobre-nosotro" 
                  className="rounded-md px-4 py-2.5 text-base font-medium text-gray-100 hover:bg-[#6d7700] hover:text-white transition duration-150"
                >
                  Sobre Nosotros
                </Link>
                <Link 
                  to="/calculadora" 
                  className="rounded-md px-4 py-2.5 text-base font-medium text-gray-100 hover:bg-[#6d7700] hover:text-white transition duration-150"
                >
                  Calculadora
                </Link>
              </div>
            </div>
          </div>
          
          {/* Botón de Login en la derecha */}
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <Link 
                  to="/login" 
                  className="relative rounded-md bg-[#df6573] px-5 py-2.5 text-base font-medium text-white hover:bg-[#c55765] transition duration-150"
                >
                  Login
                </Link>
                </div>
              </div>
              </div>

              {/* Menú móvil generado por la función renderMobileMenu */}
      {renderMobileMenu()}
    </nav>
  );
};

export default Navbar;