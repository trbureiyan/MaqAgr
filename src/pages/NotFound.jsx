/**
 * @fileoverview Vista para páginas no encontradas (404).
 */
import React from 'react';
import Button from '../components/ui/buttons/Button';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-background text-center">
      <div className="mb-6 relative">
        <h1 className="text-8xl sm:text-9xl md:text-[10rem] font-extrabold text-gray-300 tracking-tighter drop-shadow-md">
          404
        </h1>
        <div className="absolute bottom-4 left-0 w-full h-2 bg-[#909d00] transform -rotate-2" />
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold text-[#1e2939] mb-4">
        Página no encontrada
      </h2>
      <p className="text-base sm:text-lg text-muted-foreground max-w-md mx-auto mb-8">
        Lo sentimos, no pudimos encontrar la página que estabas buscando. Es posible que el enlace esté roto o que la página haya sido eliminada.
      </p>
      <Button 
        to="/" 
        variant="primary" 
        color="#893d46" 
        size="large"
        shape="pill"
        className="font-bold border hover:-translate-y-0.5 transition-transform"
      >
        Volver al Inicio
      </Button>
    </div>
  );
};

export default NotFound;
