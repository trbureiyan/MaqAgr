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
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar, Footer } from './components/layout';
import { AuthProvider } from './components/common/auth';
import ProtectedRoute from './components/common/auth/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import { CalculatorProvider } from './components/common/calculator/CalculatorContext';
import { Toaster } from 'sileo';
import 'sileo/styles.css';
import Home from './pages/Home';

// ---------------------------------------------------------------------------
// Lazy imports — code splitting para rutas no críticas
// ---------------------------------------------------------------------------

/*
 * Las rutas no críticas se cargan de forma diferida para reducir el bundle
 * inicial. `Home` se importa de forma estática porque es la ruta más visitada
 * y debe estar disponible inmediatamente.
 */

/** Calculadora de compatibilidad tractor-implemento. */
const AppCalculadora = lazy(() => import('./components/AppCalculadora'));

/** Formulario de datos del tractor para la calculadora. */
const DatosTractor = lazy(() => import('./pages/DatosTractor'));

/** Formulario de datos de llantas para la calculadora. */
const DatosLlantas = lazy(() => import('./pages/DatosLlanta'));

/** Formulario de datos climáticos para la calculadora. */
const DatosClimaticos = lazy(() => import('./pages/DatosClimaticos'));

/** Página de resultados de la calculadora. */
const Resultados = lazy(() => import('./pages/Resultados'));

/** Página de inicio de sesión. */
const Login = lazy(() => import('./pages/Login'));

/** Página de registro de usuario. */
const Register = lazy(() => import('./pages/Register'));

/** Página Sobre Nosotros. */
const SobreNosotros = lazy(() => import('./pages/SobreNosotros'));

/** Página principal del catálogo (selección de categoría). */
const Catalogo = lazy(() => import('./pages/Catalogo'));

/** Catálogo de tractores con filtros. */
const CatalogoTrac = lazy(() => import('./pages/CatalogoTractores'));

/** Catálogo de maquinaria con filtros. */
const CatalogoMaq = lazy(() => import('./pages/CatalogoMaquinas'));

/** Panel CRUD de administración de tractores (ruta protegida). */
const TractorForm = lazy(() => import('./pages/TractorForm'));

/** Panel CRUD de administración de implementos (ruta protegida). */
const ImplementForm = lazy(() => import('./pages/ImplementForm'));

/** Dashboard principal de administración. */
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

/** Página de detalle de tractor o máquina agrícola. */
const TractorMachineDetail = lazy(() => import('./pages/TractorMachineDetail'));

// ---------------------------------------------------------------------------
// Vistas de Error (401, 403, 404) — lazy imports
// ---------------------------------------------------------------------------
const NotFound = lazy(() => import('./pages/NotFound'));
const Unauthorized = lazy(() => import('./pages/Unauthorized'));
const Forbidden = lazy(() => import('./pages/Forbidden'));

// ---------------------------------------------------------------------------
// Flujo "Tengo Maquinaria" — lazy imports
// ---------------------------------------------------------------------------

/** Paso 1: datos técnicos del implemento. */
const DatosImplemento = lazy(() => import('./pages/DatosImplemento'));

/** Paso 2: tipo de suelo donde se usará el implemento. */
const TipoSueloImplemento = lazy(() => import('./pages/TipoSueloImplemento'));

/** Paso 3: resultados + tractores recomendados. */
const ResultadosImplemento = lazy(() => import('./pages/ResultadosImplemento'));

// ---------------------------------------------------------------------------
// Flujo "Busco Equipo" — lazy import
// ---------------------------------------------------------------------------
const BuscoEquipo = lazy(() => import('./pages/BuscoEquipo'));

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

// ---------------------------------------------------------------------------
// Componente raíz
// ---------------------------------------------------------------------------

/**
 * App — Componente raíz de la aplicación MaqAgr.
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
                      <Route path="/DatosLlantas"      element={<DatosLlantas />} />
                      <Route path="/DatosClimaticos"   element={<DatosClimaticos />} />
                      <Route path="/Resultados"        element={<Resultados />} />
                      <Route path="/Login"             element={<Login />} />
                      <Route path="/Registro"          element={<Register />} />
                      <Route path="/SobreNosotros"     element={<SobreNosotros />} />

                      {/* ── Catálogo ── */}
                      <Route path="/Catalogo"          element={<Catalogo />} />
                      <Route path="/CatalogoTractor"   element={<CatalogoTrac />} />
                      <Route path="/CatalogoMaquinas"  element={<CatalogoMaq />} />

                      {/* ── Detalle de equipo (tractor o máquina) ── */}
                      <Route path="/tractor/:id"       element={<TractorMachineDetail />} />
                      <Route path="/maquinaria/:id"    element={<TractorMachineDetail />} />

                      {/* ── Rutas protegidas: panel de administración ── */}
                      <Route element={<ProtectedRoute allowedRoles={[1, 'admin']} />}>
                        <Route path="/admin/TractorForm" element={<TractorForm />} />
                        <Route path="/admin/ImplementForm" element={<ImplementForm />} />
                      </Route>

                      {/* ── Flujo: Tengo Maquinaria (3 pasos) ── */}
                      <Route path="/TengoMaquinaria"      element={<DatosImplemento />} />
                      <Route path="/TipoSueloImplemento"  element={<TipoSueloImplemento />} />
                      <Route path="/ResultadosImplemento" element={<ResultadosImplemento />} />

                      {/* ── Flujo: Busco Equipo ── */}
                      <Route path="/BuscoEquipo"          element={<BuscoEquipo />} />

                      {/* ── Estados de Error y Fallback ── */}
                      <Route path="/unauthorized"         element={<Unauthorized />} />
                      <Route path="/forbidden"            element={<Forbidden />} />
                      <Route path="*"                     element={<NotFound />} />
                    </Routes>
                  </Suspense>
              </main>

              {/* Pie de página global */}
              <Footer />
            </div>
          </Router>
        </CalculatorProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
