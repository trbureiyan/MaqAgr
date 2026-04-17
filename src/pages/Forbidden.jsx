/**
 * @fileoverview Vista para acceso denegado (403).
 */
import React from 'react';
import Button from '../components/ui/buttons/Button';

const Forbidden = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-background text-center">
      <div className="mb-6 relative">
        <h1 className="text-8xl sm:text-9xl md:text-[10rem] font-extrabold text-gray-300 tracking-tighter drop-shadow-md">
          403
        </h1>
        <div className="absolute bottom-4 left-0 w-full h-2 bg-red-600 transform -rotate-1" />
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold text-[#1e2939] mb-4">
        Acceso denegado
      </h2>
      <p className="text-base sm:text-lg text-muted-foreground max-w-md mx-auto mb-8">
        No tienes los permisos necesarios para acceder a este recurso. Si crees que esto es un error, comunícate con el administrador del sistema.
      </p>
      <Button 
        to="/" 
        variant="outline" 
        color="#1e2939" 
        size="large"
        shape="pill"
        className="font-bold border-2 text-[#1e2939] hover:bg-[#1e2939] hover:text-white transition-colors"
      >
        Regresar al Inicio
      </Button>
    </div>
  );
};

export default Forbidden;
