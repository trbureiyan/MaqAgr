import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 py-3 ">
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