/**
 * @fileoverview Componente raíz de la aplicación MaqAgr.
 *
 * Configura el árbol de proveedores (AuthProvider), el enrutador (BrowserRouter)
 * y el layout global (Navbar + main + Footer). Las rutas no críticas se cargan
 * de forma diferida con `React.lazy` + `Suspense` para mejorar el tiempo de
 * carga inicial (code splitting).
 *
 * Estructura del árbol de componentes:
 * ```
 * AuthProvider
 *   └── Router
 *         └── div.min-h-screen.flex.flex-col
 *               ├── Navbar
 *               ├── main.flex-grow
 *               │     └── Suspense (fallback: PageLoader)
 *               │           └── Routes
 *               └── Footer
 * ```
 *
 * Rutas registradas:
 *  - /                         → Home
 *  - /Calculadora              → AppCalculadora
 *  - /TengoTractor             → DatosTractor
 *  - /DatosLlantas             → DatosLlantas
 *  - /DatosClimaticos          → DatosClimaticos
 *  - /Resultados               → Resultados
 *  - /Login                    → Login
 *  - /Registro                 → Register
 *  - /admin/TractorForm        → TractorForm (protegida)
 *  - /tractor/:id              → TractorMachineDetail
 *  - /maquinaria/:id           → TractorMachineDetail
 *  - /Catalogo                 → Catalogo
 *  - /CatalogoTractor          → CatalogoTractores
 *  - /CatalogoMaquinas         → CatalogoMaquinas
 *  - /TengoMaquinaria          → DatosImplemento  (flujo implemento paso 1)
 *  - /TipoSueloImplemento      → TipoSueloImplemento (flujo implemento paso 2)
 *  - /ResultadosImplemento     → ResultadosImplemento (flujo implemento paso 3)
 *
 * @module App
 */

import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar, Footer, AdminLayout } from './components/layout';
import { AuthProvider } from '@/features/auth/context/AuthContext';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import ErrorBoundary from '@/components/core/ErrorBoundary';
import { CalculatorProvider } from '@/features/calculator/context/CalculatorContext';
import { Toaster } from 'sileo';
import 'sileo/styles.css';
import { Analytics } from '@vercel/analytics/react';
import Home from './pages/home/Home';

// ---------------------------------------------------------------------------
// Lazy imports — code splitting para rutas no críticas
// ---------------------------------------------------------------------------

/*
 * Las rutas no críticas se cargan de forma diferida para reducir el bundle
 * inicial. `Home` se importa de forma estática porque es la ruta más visitada
 * y debe estar disponible inmediatamente.
 */

/** Calculadora de compatibilidad tractor-implemento. */
const AppCalculadora = lazy(() => import('@/features/calculator/components/AppCalculadora'));

/** Formulario de datos del tractor para la calculadora. */
const DatosTractor = lazy(() => import('./pages/calculator/tractor/DatosTractor'));



/** Página de inicio de sesión. */
const Login = lazy(() => import('./pages/auth/Login'));

/** Página de registro de usuario. */
const Register = lazy(() => import('./pages/auth/Register'));

/** Perfil de usuario normal. */
const Profile = lazy(() => import('./pages/misc/Profile'));

/** Recuperar contraseña. */
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));

/** Restablecer contraseña. */
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));

/** Página Sobre Nosotros. */
const SobreNosotros = lazy(() => import('./pages/misc/SobreNosotros'));

/** Página principal del catálogo (selección de categoría). */
const Catalogo = lazy(() => import('./pages/catalog/Catalogo'));

/** Catálogo de tractores con filtros. */
const CatalogoTrac = lazy(() => import('./pages/catalog/CatalogoTractores'));

/** Catálogo de maquinaria con filtros. */
const CatalogoMaq = lazy(() => import('./pages/catalog/CatalogoMaquinas'));

/** Panel CRUD de administración de tractores (ruta protegida). */
const TractorForm = lazy(() => import('./pages/admin/TractorForm'));

/** Panel CRUD de administración de implementos (ruta protegida). */
const ImplementForm = lazy(() => import('./pages/admin/ImplementForm'));

/** Dashboard principal de administración (Antiguo) */
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

/** Estadísticas Generales del Panel de Administración */
const AdminStatsGeneral = lazy(() => import('./pages/admin/AdminStatsGeneral'));
const AdminStatsRecommendations = lazy(() => import('./pages/admin/AdminStatsRecommendations'));
const AdminStatsUsers = lazy(() => import('./pages/admin/AdminStatsUsers'));

/** Gestión de Usuarios (CRUD) */
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));

/** Página de detalle de tractor o máquina agrícola. */
const TractorMachineDetail = lazy(() => import('./pages/catalog/TractorMachineDetail'));

// ---------------------------------------------------------------------------
// Vistas de Error (401, 403, 404) — lazy imports
// ---------------------------------------------------------------------------
const NotFound = lazy(() => import('./pages/misc/NotFound'));
const Unauthorized = lazy(() => import('./pages/misc/Unauthorized'));
const Forbidden = lazy(() => import('./pages/misc/Forbidden'));

// ---------------------------------------------------------------------------
// Flujo "Tengo Maquinaria" — lazy imports
// ---------------------------------------------------------------------------

/** Paso 1: datos técnicos del implemento. */
const DatosImplemento = lazy(() => import('./pages/calculator/implement/DatosImplemento'));



// ---------------------------------------------------------------------------
// Flujo "Busco Equipo" — lazy import
// ---------------------------------------------------------------------------
const BuscoEquipo = lazy(() => import('./pages/calculator/misc/BuscoEquipo'));

// ---------------------------------------------------------------------------
// Componente de carga (fallback de Suspense)
// ---------------------------------------------------------------------------

/**
 * PageLoader — Indicador de carga para rutas lazy.
 *
 * Se muestra mientras React carga el chunk de la ruta solicitada.
 * Centrado verticalmente en el área de contenido principal.
 *
 * @returns {JSX.Element} Spinner de carga centrado.
 */
const PageLoader = () => (
  <div
    className="flex items-center justify-center min-h-[60vh]"
    role="status"
    aria-label="Cargando página"
  >
    <div className="w-10 h-10 border-4 border-red-800 border-t-transparent rounded-full animate-spin" />
  </div>
);

/**
 * Componente principal de contenido de la aplicación.
 *
 * Debe ser hijo de <Router> para poder usar useLocation().
 */
function AppContent() {
  const location = useLocation();

  // Ocultar footer en páginas de inicio de sesión, registro, recuperación y restablecimiento de contraseña
  const hideFooterPaths = ['/login', '/registro', '/forgot-password', '/reset-password'];
  const showFooter = !hideFooterPaths.includes(location.pathname.toLowerCase());

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-right" />

      {/* Barra de navegación global */}
      <Navbar />

      {/* Área de contenido principal — crece para empujar el footer */}
      <main className="flex-grow">
        {/*
         * Suspense envuelve todas las rutas lazy.
         * PageLoader se muestra mientras se descarga el chunk de la ruta.
         */}
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* ── Rutas públicas ── */}
            <Route path="/"                  element={<Home />} />
            <Route path="/Calculadora"       element={<AppCalculadora />} />
            <Route path="/TengoTractor"      element={<DatosTractor />} />
            <Route path="/DatosLlantas"      element={<Navigate to="/TengoTractor" replace />} />
            <Route path="/DatosClimaticos"   element={<Navigate to="/TengoTractor" replace />} />
            <Route path="/Resultados"        element={<Navigate to="/TengoTractor" replace />} />
            <Route path="/Login"             element={<Login />} />
            <Route path="/Registro"          element={<Register />} />
            <Route path="/forgot-password"   element={<ForgotPassword />} />
            <Route path="/reset-password"    element={<ResetPassword />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/perfil" element={<Profile />} />
            </Route>
            <Route path="/SobreNosotros"     element={<SobreNosotros />} />

            {/* ── Catálogo ── */}
            <Route path="/Catalogo"          element={<Catalogo />} />
            <Route path="/CatalogoTractor"   element={<CatalogoTrac />} />
            <Route path="/CatalogoMaquinas"  element={<CatalogoMaq />} />

            {/* ── Detalle de equipo (tractor o máquina) ── */}
            <Route path="/tractor/:id"       element={<TractorMachineDetail />} />
            <Route path="/maquinaria/:id"    element={<TractorMachineDetail />} />

            {/* ── Rutas protegidas: panel de administración ── */}
            <Route element={<ProtectedRoute allowedRoles={['admin', 1]} />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<Navigate to="/admin/stats/general" replace />} />
                <Route path="/admin/TractorForm" element={<TractorForm />} />
                <Route path="/admin/ImplementForm" element={<ImplementForm />} />
                
                {/* Nuevas vistas del panel de administración */}
                <Route path="/admin/stats/general" element={<AdminStatsGeneral />} />
                <Route path="/admin/stats/recommendations" element={<AdminStatsRecommendations />} />
                <Route path="/admin/stats/users" element={<AdminStatsUsers />} />
                <Route path="/admin/users" element={<AdminUsers />} />
              </Route>
            </Route>

            {/* ── Flujo: Tengo Maquinaria (3 pasos) ── */}
            <Route path="/TengoMaquinaria"      element={<DatosImplemento />} />
            <Route path="/TipoSueloImplemento"  element={<Navigate to="/TengoMaquinaria" replace />} />
            <Route path="/ResultadosImplemento" element={<Navigate to="/TengoMaquinaria" replace />} />

            {/* ── Flujo: Busco Equipo ── */}
            <Route path="/BuscoEquipo"          element={<BuscoEquipo />} />

            {/* ── Estados de Error y Fallback ── */}
            <Route path="/unauthorized"         element={<Unauthorized />} />
            <Route path="/forbidden"            element={<Forbidden />} />
            <Route path="*"                     element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      {/* Pie de página global condicional */}
      {showFooter && <Footer />}
    </div>
  );
}

/**
 * Componente principal de la aplicación.
 *
 * Envuelve toda la aplicación en `AuthProvider` para acceso global al contexto
 * de autenticación. El layout usa `flex flex-col min-h-screen` para que el
 * footer siempre quede al final de la pantalla, independientemente del
 * contenido de la página.
 *
 * @component
 * @returns {JSX.Element} Árbol completo de la aplicación con rutas y layout.
 */
function App() {
  return (
    <ErrorBoundary>
      {/* Proveedor de autenticación - disponible en todo el árbol */}
      <AuthProvider>
        <CalculatorProvider>
          <Router>
            <AppContent />
            {/* Vercel Web Analytics */}
            <Analytics />
          </Router>
        </CalculatorProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
