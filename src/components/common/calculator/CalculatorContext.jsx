import React, { createContext, useContext, useState } from 'react';

const CalculatorContext = createContext();

export const useCalculator = () => {
  const context = useContext(CalculatorContext);
  if (!context) {
    throw new Error('useCalculator debe ser usado dentro de un CalculatorProvider');
  }
  return context;
};

export const CalculatorProvider = ({ children }) => {
  const [calculatorState, setCalculatorState] = useState({
    modo: null, // 'tengoTractor', 'tengoImplemento', 'buscoEquipo'
    tractorData: null,
    implementoData: null,
    llantaData: null,
    climaData: null,
    sueloData: null,
    resultados: null,
  });

  const updateState = (key, data) => {
    setCalculatorState((prev) => ({
      ...prev,
      [key]: data,
    }));
  };

  const resetState = () => {
    setCalculatorState({
      modo: null,
      tractorData: null,
      implementoData: null,
      llantaData: null,
      climaData: null,
      sueloData: null,
      resultados: null,
    });
  };

  return (
    <CalculatorContext.Provider value={{
      state: calculatorState,
      updateState,
      resetState,
    }}>
      {children}
    </CalculatorContext.Provider>
  );
};
