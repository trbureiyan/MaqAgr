import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 py-3 ">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Columna 1: Información */}
          <div>
            <h5 className="text-xl font-medium text-gray-100 mb-4">Maquinaria Agrícola</h5>
            <p className="text-gray-100">
              Lorem impsum xd
            </p>
          </div>

          {/* Columna 2: Enlaces rápidos */}
          <div className="lg:pl-8">
            <h5 className="text-xl font-medium text-gray-100 mb-4">Enlaces rápidos</h5>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Link 
                  to="/"
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-100 hover:bg-[#6d7700] hover:text-white transition duration-150"
                >
                  Home
                </Link>
                <Link 
                  to="/catalogo"
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-100 hover:bg-[#6d7700] hover:text-white transition duration-150"
                >
                  Catálogo
                </Link>
              </div>
              <div>
                <Link 
                  to="/sobre-nosotro"
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-100 hover:bg-[#6d7700] hover:text-white transition duration-150"
                >
                  Sobre Nosotros
                </Link>
                <Link 
                  to="/calculadora"
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-100 hover:bg-[#6d7700] hover:text-white transition duration-150"
                >
                  Calculadora
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright section */}
      <div className="w-full bg-gray-800 py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-100">
            © 2025 Copyright: 
            <Link to="/sobre-nosotro" className="ml-1 text-[#97b55d] font-medium hover:underline">
              Equipo de Maquinaria Agrícola
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;