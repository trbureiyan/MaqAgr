import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/img/Logo.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gray-700 text-white py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src={Logo} alt="Logo" className="h-10 w-auto mr-2" />
            </Link>
          </div>

          {/* Menú de navegación para pantallas medianas y grandes */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link to="/" className="hover:text-gray-300">Home</Link>
            <Link to="/catalogo" className="hover:text-gray-300">Catálogo</Link>
            <Link to="/sobre-nosotro" className="hover:text-gray-300">Sobre Nosotros</Link>
            <Link to="/calculadora" className="hover:text-gray-300">Calculadora</Link>
            <Link to="/login" className="bg-red-700 hover:bg-red-800 px-4 py-2 rounded-md">
              Login
            </Link>
          </div>

          {/* Botón de hamburguesa para móviles */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Menú móvil desplegable */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-2">
            <Link
              to="/"
              className="block py-2 px-4 hover:bg-gray-600 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/catalogo"
              className="block py-2 px-4 hover:bg-gray-600 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Catálogo
            </Link>
            <Link
              to="/sobre-nosotro"
              className="block py-2 px-4 hover:bg-gray-600 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Sobre Nosotros
            </Link>
            <Link
              to="/calculadora"
              className="block py-2 px-4 hover:bg-gray-600 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Calculadora
            </Link>
            <Link
              to="/login"
              className="block py-2 px-4 bg-red-700 hover:bg-red-800 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;