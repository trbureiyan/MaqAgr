import React, { createContext, useState, useEffect } from 'react';


// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(); // Advertencia -> UseAuth
/** ^
 *  |
 *  |
 * 
 * @error About error: Ocurre porque Fast Refresh tiene limitaciones para 
 * garantizar que el estado se conserve durante el desarrollo. 
 * Al separar componentes y hooks en diferentes archivos, se
 * ayuda a Fast Refresh a determinar correctamente qué refrescar 
 * y qué estado conservar cuando realizas cambios.
 * 
 * > Segun foros, es comun este problema
 */

// Proveedor del contexto que envuelve la aplicación
export const AuthProvider = ({ children }) => {
  // Estado para almacenar si el usuario está autenticado
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Cargar estado de autenticación desde localStorage al iniciar
  useEffect(() => {
    // Definiciones
    const storedAuth = localStorage.getItem('isAuthenticated');
    const storedUser = localStorage.getItem('user');
    
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
      setUser(storedUser ? JSON.parse(storedUser) : null);
    }       /* ? ^ : -> shorthand for an if-else statement */
  }, []);

  // Función para manejar el inicio de sesión
  const login = (userData) => {
    // En un caso real, aquí se verificarían credenciales con el backend
    setIsAuthenticated(true); // Simular autenticación exitosa
    setUser(userData);
    
    // Guardar en localStorage para persistencia
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Función para manejar el cierre de sesión
  const logout = () => {
    setIsAuthenticated(false); // Simular cierre de sesión
    setUser(null); // Elimina el usuario del estado
    
    // Limpiar localStorage
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
  };

  // Proporciona el contexto a los componentes hijos
  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};