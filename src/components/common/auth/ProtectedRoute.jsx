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

  const normalizeRole = (value) => {
    if (value === undefined || value === null || value === '') {
      return null;
    }
    return String(value).toLowerCase();
  };

  const userRoles = [
    user?.role,
    user?.roleName,
    user?.roleId,
    user?.userType,
    user?.type,
    user?.isAdmin ? 'admin' : null,
  ]
    .map(normalizeRole)
    .filter(Boolean);

  const allowedRoleSet = new Set(allowedRoles.map(normalizeRole).filter(Boolean));
  const isAllowedByRole =
    allowedRoleSet.size === 0 || userRoles.some((role) => allowedRoleSet.has(role));

  if (!isAuthenticated) {
    // No autenticado -> redirigir a Login y guardar ruta original
    return <Navigate to="/Login" state={{ from: location }} replace />;
  }

  if (!isAllowedByRole) {
    // Autenticado pero sin los permisos correctos
    return <Navigate to="/forbidden" replace />;
  }

  // Autorizado -> renderiza la(s) ruta(s) hijas
  return <Outlet />;
};

export default ProtectedRoute;
