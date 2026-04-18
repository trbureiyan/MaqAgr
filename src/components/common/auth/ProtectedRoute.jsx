import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './index';

/**
 * Guardia de rutas para vistas privadas.
 * @param {Array<string>} allowedRoles Roles permitidos (ej. ['admin', 'operator']). Si está vacío, solo valida que esté logueado.
 */
const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // No autenticado -> redirigir a Login y guardar ruta original
    return <Navigate to="/Login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && (!user || (!allowedRoles.includes(user.role) && !allowedRoles.includes(user.roleId)))) {
    // Autenticado pero sin los permisos correctos
    return <Navigate to="/unauthorized" replace />; // o /Forbidden
  }

  // Autorizado -> renderiza la(s) ruta(s) hijas
  return <Outlet />;
};

export default ProtectedRoute;
