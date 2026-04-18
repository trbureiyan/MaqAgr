import React, { createContext, useState, useEffect } from 'react';
import { apiClient } from '../../../lib/apiClient';

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
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (storedAuth === 'true' && token) {
      setIsAuthenticated(true);
      try {
        setUser(storedUser && storedUser !== 'undefined' ? JSON.parse(storedUser) : null);
      } catch (err) {
        console.error("Error parsing stored user:", err);
        setUser(null);
      }
    }       /* ? ^ : -> shorthand for an if-else statement */

    // Escuchar el evento global de `apiClient` para desloguear (401)
    const handleUnauthorized = () => logout();
    window.addEventListener('auth:unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  // Función para manejar el inicio de sesión real contra el backend
  const login = async (credentials) => {
    try {
      // Invocación a ruta con apiClient. 
      // Si VITE_ENABLE_REMOTE... estuviese en true/false para auth, aquí sería condicional. 
      // Invocación a la ruta de login real
      const response = await apiClient('/api/auth/login', { body: credentials });
      
      // El backend devuelve { success: true, data: { token, user } }
      const payload = response.data || response; // Fallback por si acaso la estructura cambia
      
      setIsAuthenticated(true);
      setUser(payload.user);
      
      // Guardar de forma segura el estado local / token
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(payload.user));
      // Guardar token dependiendo de la respuesta
      localStorage.setItem('token', payload.token || payload.accessToken);
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // El componente AuthForm atrapará y mostrará este error
    }
  };

  // Función para manejar el cierre de sesión
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    
    // Limpiar localStorage/sessionStorage
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  };

  // Proporciona el contexto a los componentes hijos
  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};