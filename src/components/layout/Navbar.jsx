/**
 * @fileoverview Barra de navegación principal de MaqAgr.
 *
 * Implementa navegación responsive con menú hamburguesa para móviles,
 * enlaces de escritorio, y controles de autenticación (login / logout / perfil).
 *
 * Breakpoints:
 *  - < sm (< 640 px) : menú colapsable tipo drawer vertical
 *  - ≥ sm (≥ 640 px) : barra horizontal con enlaces inline
 *
 * @module components/layout/Navbar
 */

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../common/auth';
import Logo from '../ui/Icons/logo';
import { ProfileIcon } from '../ui/Icons';
import Button from '../ui/buttons/Button';
import { NotificationDropdown } from './NotificationDropdown';

// ---------------------------------------------------------------------------
// Datos estáticos
// ---------------------------------------------------------------------------

/**
 * Definición de los enlaces de navegación principal.
 * Cada entrada describe la ruta destino y la etiqueta visible al usuario.
 *
 * @type {Array<{ to: string, label: string }>}
 */
const NAV_LINKS = [
  { to: '/',             label: 'Home'          },
  { to: '/Catalogo',    label: 'Catálogo'       },
  { to: '/SobreNosotros', label: 'Sobre Nosotros' },
  { to: '/Calculadora', label: 'Calculadora'    },
];

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

/**
 * Navbar — Barra de navegación global de la aplicación.
 *
 * Gestiona el estado del menú móvil y delega la autenticación al contexto
 * `AuthContext`. Renderiza de forma condicional los controles de sesión
 * según el estado `isAuthenticated`.
 *
 * @component
 * @returns {JSX.Element} Elemento `<nav>` con navegación responsive.
 *
 * @example
 * // Uso dentro del layout principal (App.jsx)
 * <Navbar />
 */
const Navbar = () => {
  // ── Estado local ──────────────────────────────────────────────────────────

  /** Controla la visibilidad del menú móvil (hamburguesa). */
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ── Hooks de enrutamiento y autenticación ─────────────────────────────────

  /** Ruta activa para resaltar el enlace correspondiente. */
  const location = useLocation();

  /** Función de navegación programática. */
  const navigate = useNavigate();

  /** Estado de sesión y función de cierre de sesión del contexto global. */
  const { isAuthenticated, user, logout } = useAuth();

  // ── Manejadores de eventos ────────────────────────────────────────────────

  /**
   * Navega al panel de administración o al perfil.
   */
  const handleProfileClick = () => {
    const isAdmin = user?.role === 'admin' || user?.roleId === 1 || user?.role_id === 1;
    navigate(isAdmin ? '/admin' : '/perfil');
  };

  /**
   * Cierra la sesión del usuario y redirige al inicio.
   * Invoca `logout()` del contexto antes de navegar.
   */
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <nav className="bg-[#1e2939] py-3">
      {/* Contenedor centrado con padding horizontal responsive */}
      <div className="mx-auto max-w-7xl px-3 sm:px-5 lg:px-7">

        {/* Fila principal: botón hamburguesa | logo | nav + auth */}
        <div className="relative flex h-13 items-center justify-between">

          {/* ── Botón hamburguesa (solo móvil < sm) ── */}
          <div className="sm:hidden z-10 flex items-center">
            <button
              type="button"
              className="relative inline-flex items-center justify-center rounded-md p-3 text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú principal'}
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              <span className="sr-only">
                {isMenuOpen ? 'Cerrar menú principal' : 'Abrir menú principal'}
              </span>

              {/* Ícono de tres líneas (menú cerrado) */}
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} size-6`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>

              {/* Ícono de X (menú abierto) */}
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} size-6`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* ── Logo centrado en móvil, alineado a la izquierda en sm+ ── */}
          <div className="absolute left-0 right-0 flex justify-center sm:static sm:justify-start sm:flex-grow-0">
            <div className="flex-shrink-0">
              <Logo size="default" color="#909d00" link={true} />
            </div>
          </div>

          {/* ── Navegación desktop + controles de autenticación ── */}
          <div className="flex items-center">

            {/* Enlaces de navegación — visibles solo en sm+ */}
            <div className="hidden sm:flex sm:items-center sm:space-x-1 mr-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`rounded-md px-4 py-2 text-sm font-medium transition-colors duration-150 ${
                    location.pathname === link.to
                      ? 'bg-[#909d00]/20 text-[#909d00]'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Controles de sesión: perfil + notificaciones + salir / login */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {/* Botón de notificaciones */}
                <NotificationDropdown />

                {/* Botón de perfil — siempre visible cuando autenticado */}
                <Button
                  variant="primary"
                  color="#893d46"
                  onClick={handleProfileClick}
                  shape="pill"
                  className="p-2.5 z-10"
                  title="Perfil de usuario"
                >
                  <ProfileIcon size="default" color="white" />
                </Button>

                {/* Botón de salir — oculto en móvil (disponible en menú drawer) */}
                <Button
                  variant="primary"
                  color="#893d46"
                  onClick={handleLogout}
                  className="hidden sm:block z-10 text-sm"
                >
                  Salir
                </Button>
              </div>
            ) : (
              /* Botón de login — siempre visible */
              <Button variant="primary" color="#893d46" to="/login" className="z-10 text-sm">
                Login
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ── Menú móvil desplegable (drawer vertical) ── */}
      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="sm:hidden border-t border-white/10 mt-2"
          role="navigation"
          aria-label="Menú móvil"
        >
          <div className="space-y-1 px-4 pt-3 pb-4">
            {/* Enlace de navegación móvil — cierra el menú al hacer clic */}
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'bg-[#909d00]/20 text-[#909d00]'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {/* Opción de cerrar sesión — solo visible en móvil cuando autenticado */}
            {isAuthenticated && (
              <button
                type="button"
                className="block w-full text-left rounded-md px-4 py-2.5 text-sm font-medium text-gray-300 hover:bg-[#893d46]/20 hover:text-white transition-colors"
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
              >
                Cerrar Sesión
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
