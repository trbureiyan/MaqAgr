# MaqAgr — Frontend

> Interfaz web (SPA) para gestión y apoyo a la decisión en mecanización agrícola. Desarrollado como parte de un Semillero de Investigación.

![Status](https://img.shields.io/badge/status-active_development-blue) ![SPA](https://img.shields.io/badge/Architecture-SPA-orange) ![API](https://img.shields.io/badge/API-External-yellow) ![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black) ![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38B2AC?logo=tailwindcss&logoColor=white) ![Node](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)


---

## Tabla de Contenidos

- [Stack Tecnológico](#stack-tecnológico)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Inicio Rápido](#inicio-rápido)
- [Variables de Entorno](#variables-de-entorno)
- [Modo Mock vs. API Remota](#modo-mock-vs-api-remota)
- [Scripts Disponibles](#scripts-disponibles)
- [Convenciones de Código](#convenciones-de-código)
- [Performance Budget](#performance-budget)

---

## Stack Tecnológico

| Capa | Tecnología | Versión |
|------|------------|---------|
| Framework UI | React | 19.0.0 |
| Build tool | Vite | 6.2.0 |
| Routing | react-router-dom | 7.3.0 |
| Estilos | Tailwind CSS | 4.0.12 |
| Componentes UI | shadcn/ui (adaptación propia) | — |
| Compilador | @vitejs/plugin-react-swc | — |
| HTTP client | `fetch` nativo | — |
| Iconografía | lucide-react, react-icons | — |
| Utilidades CSS | clsx, tailwind-merge, class-variance-authority | — |
| Linter | ESLint | 9.21.0 |
| Despliegue | Vercel (serverless/static) | — |
| Package manager | npm | 11.6.2 |

---

## Estructura del Proyecto

```
MaqAgr/
├── public/                  # Assets públicos (favicon, etc.)
├── src/
│   ├── assets/              # Imágenes y recursos estáticos
│   ├── components/
│   │   ├── ui/              # Componentes base (shadcn/ui)
│   │   ├── layout/          # Header, Footer, wrappers de layout
│   │   └── auth/            # AuthProvider, AuthForm
│   ├── pages/               # Rutas/páginas del Router (PascalCase.jsx)
│   ├── services/
│   │   └── tractorApi.js    # Capa de integración: mock ↔ API remota
│   ├── App.jsx              # Definición del Router principal
│   └── main.jsx             # Entry point (React StrictMode)
├── vite.config.js           # Bundling, alias de imports, manualChunks
├── vercel.json              # Headers de cache, SPA rewrites
├── eslint.config.js         # Configuración de ESLint
└── package.json
```

**Alias de imports configurados en `vite.config.js`:**

```js
@/           →  src/
@components/ →  src/components/
@pages/      →  src/pages/
```

---

## Inicio Rápido

### Prerrequisitos

- Node.js 20 o superior
- npm 11+

### Instalación

```bash
git clone https://github.com/trbureiyan/MaqAgr.git
cd MaqAgr
npm install
```

### Configurar variables de entorno

```bash
cp .env.example .env
```

### Ejecutar en desarrollo

```bash
npm run dev
```

---

## Variables de Entorno

| Variable | Tipo | Descripción |
|----------|------|-------------|
| `VITE_ENABLE_REMOTE_TRACTOR_API` | `"true"` / `"false"` | Alterna entre modo mock local y API remota. Default: `"false"` |
| `VITE_API_BASE_URL` | URL | Base URL del backend (se usa solo cuando `VITE_ENABLE_REMOTE_TRACTOR_API=true`) |

**Desarrollo frontend sin backend:**

```env
VITE_ENABLE_REMOTE_TRACTOR_API=false
VITE_API_BASE_URL=
```

**Con API remota activa:**

```env
VITE_ENABLE_REMOTE_TRACTOR_API=true
VITE_API_BASE_URL=https://tu-api.com
```

---

## Modo Mock vs. API Remota

`src/services/tractorApi.js` es el único punto de integración entre el frontend y el backend. Su comportamiento se controla mediante feature-flag de entorno:

- **Modo mock (default):** los datos se sirven localmente. Permite desarrollo y pruebas de UI sin depender del backend.
- **Modo API remota:** las peticiones se envían al backend en `VITE_API_BASE_URL`. Se activa cuando el backend externo está disponible.

Este diseño permite iterar sobre el frontend de forma completamente independiente del ciclo de vida del backend.

---

## Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run build` | Build de producción (output en `dist/`) |
| `npm run preview` | Preview local del build de producción |
| `npm run lint` | Alias de `lint:frontend` — gate de calidad para releases |
| `npm run lint:frontend` | Lint del código fuente en `src/` |
| `npm run lint:backend` | Lint de referencia backend (solo entorno local) |
| `npm run lint:all` | Lint combinado |

---

## Convenciones de Código

- **Páginas:** `PascalCase.jsx` en `src/pages/`
- **Componentes:** `PascalCase.jsx` en `src/components/`
- **Servicios:** `camelCase.js` en `src/services/`
- **Imports case-sensitive:** Vercel corre en Linux. El nombre del archivo y el import deben coincidir en mayúsculas/minúsculas de forma exacta — un mismatch que funciona en Windows/macOS fallará en producción.
- **Imports por directorio:** evitar si el archivo real no se llama exactamente `index.js`.
- **JSDoc:** el proyecto usa JSDoc extensivamente en módulos clave; mantener esa consistencia al agregar nuevos módulos.

---

## Performance Budget

| Asset | Objetivo |
|-------|----------|
| JS inicial por ruta principal | < 250 kB gzip (combinado) |
| Assets críticos por ruta | < 500 kB cuando sea posible |
| Imágenes hero/fondo | Optimizar cualquier asset > 1 MB antes de producción |
| Video en hero | No usar autoplay sin lazy loading, poster y justificación explícita |

---

*Semillero de Investigación **Devurity** — Universidad Surcolombiana.*
---
Referencias y Autores

- Backend: BackMaqagr (repositorio de backend) — https://github.com/David9604/BackMaqagr
- Origen del proyecto MaqAgr: Este repositorio (https://github.com/trbureiyan/MaqAgr) es un fork del proyecto original MaqAgr de https://github.com/David9604/Maqagr.
- Autores:
  - [David9604](https://github.com/David9604)
  - [FlacoAfk](https://github.com/FlacoAfk)
  - [JercOmg](https://github.com/JercOmg)
  - [trbureiyan](https://github.com/trbureiyan)
