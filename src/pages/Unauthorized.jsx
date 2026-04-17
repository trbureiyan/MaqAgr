/**
 * @fileoverview Vista para acceso no autorizado o sesión expirada (401).
 */
import React from 'react';
import Button from '../components/ui/buttons/Button';

const Unauthorized = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-background text-center">
      <div className="mb-6 relative">
        <h1 className="text-8xl sm:text-9xl md:text-[10rem] font-extrabold text-gray-300 tracking-tighter drop-shadow-md">
          401
        </h1>
        <div className="absolute bottom-4 left-0 w-full h-2 bg-[#eab308] transform rotate-1" />
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold text-[#1e2939] mb-4">
        Acceso no autorizado
      </h2>
      <p className="text-base sm:text-lg text-muted-foreground max-w-md mx-auto mb-8">
        No tienes autorización para ver esta página o tu sesión ha expirado. Por favor, inicia sesión para continuar en la plataforma.
      </p>
      <Button 
        to="/Login" 
        variant="primary" 
        color="#EAB308"
        textColor="#000000"
        size="large"
        shape="pill"
        className="font-bold shadow-md hover:-translate-y-0.5 transition-transform"
      >
        Iniciar Sesión
      </Button>
    </div>
  );
};

export default Unauthorized;
