# MaqAgr - Frontend

> Interfaz web (SPA) para gestión y apoyo a la decisión en mecanización agrícola. Desarrollado como parte del Semillero de Investigación Devurity.

![Status](https://img.shields.io/badge/status-active_development-blue)
![SPA](https://img.shields.io/badge/Architecture-SPA-orange)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38B2AC?logo=tailwindcss&logoColor=white)
![Node](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)

---

## Tabla de contenidos

- [Resumen funcional](#resumen-funcional)
- [Stack tecnológico](#stack-tecnológico)
- [Arquitectura](#arquitectura)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Inicio rápido](#inicio-rápido)
- [Variables de entorno](#variables-de-entorno)
- [Modo Mock vs API remota](#modo-mock-vs-api-remota)
- [Scripts disponibles](#scripts-disponibles)
- [Pruebas](#pruebas)
- [Despliegue en Vercel](#despliegue-en-vercel)
- [Convenciones de código](#convenciones-de-código)
- [Performance budget](#performance-budget)
- [Referencias y autores](#referencias-y-autores)

---

## Resumen funcional

MaqAgr permite:

- Gestionar catálogo de tractores e implementos.
- Ejecutar flujos de recomendación y cálculo.
- Administrar autenticación y rutas protegidas por rol (`admin`, `user`, `operator`).
- Visualizar notificaciones y estados de proceso con UI reactiva.

---

## Stack tecnológico

| Capa | Tecnología |
|------|------------|
| Framework UI | React 19 |
| Build tool | Vite 6 |
| Routing | react-router-dom 7 |
| Estilos | Tailwind CSS 4 |
| UI base | shadcn/ui (adaptación interna) |
| Notificaciones UI | sileo |
| Animación | motion |
| HTTP | `fetch` nativo + wrapper interno |
| Mapeo de datos | snake_case ↔ camelCase (`src/lib/dataMappers.js`) |
| Linter | ESLint 9 |
| Deploy | Vercel |
| Package manager | npm (`package-lock.json`) |

---

## Arquitectura

### 1) SPA + Router + Code Splitting

- Entrada principal en `src/main.jsx` y enrutado en `src/App.jsx`.
- Carga diferida (`React.lazy` + `Suspense`) para rutas no críticas.

### 2) Patrón dual Mock/Remote por dominio

Cada servicio decide en tiempo de ejecución si responde con mock local o API remota usando feature flags (`VITE_ENABLE_REMOTE_*`).

### 3) Cliente HTTP unificado

`src/lib/apiClient.js` centraliza:

- Inyección automática de JWT (`Authorization: Bearer <token>`).
- Conversión de payloads/respuestas entre camelCase (frontend) y snake_case (backend).
- Traducción de errores HTTP a mensajes amigables en español.

### 4) Estrategia anti-CORS

- En desarrollo: Vite utiliza un proxy interno configurado para interceptar y redirigir las peticiones a la API.
- En producción: Se configuran reglas de reescritura (rewrites) a nivel de servidor o plataforma.

---

## Estructura del proyecto

```text
MaqAgr/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/
│   │   │   ├── auth/
│   │   │   └── calculator/
│   │   ├── layout/
│   │   └── ui/
│   ├── hooks/
│   ├── lib/                  # apiClient, dataMappers, utilidades mock/storage
│   ├── pages/
│   ├── services/             # tractorApi, implementApi, recommendationApi, etc.
│   ├── App.jsx
│   └── main.jsx
├── tests/lib/                # pruebas con node:test
├── vite.config.js
├── vercel.json
├── eslint.config.js
├── package.json
└── package-lock.json
```

Alias de imports configurados en `vite.config.js`:

```js
@/           -> src/
@components/ -> src/components/
@pages/      -> src/pages/
```

---

## Inicio rápido

### Prerrequisitos

- Node.js 20+
- npm 10+

### 1) Clonar e instalar

```bash
git clone https://github.com/trbureiyan/MaqAgr.git
cd MaqAgr
npm ci
```

Alternativa sin scripts de instalación:

```bash
npm run secure-install
```

### 2) Configurar `.env`

Bash:

```bash
cp .env.example .env
```

PowerShell:

```powershell
Copy-Item .env.example .env
```

### 3) Levantar entorno local

```bash
npm run dev
```

Vite inicia por defecto en `http://localhost:5173` (o el puerto configurado de forma local).

---

## Variables de entorno

Para configurar tu entorno de desarrollo:

1. Duplica el archivo de ejemplo (el cual contiene la estructura segura):
   ```bash
   cp .env.example .env
   ```
2. Revisa el archivo `.env.example` y asigna los valores pertinentes en tu `.env` (rutas al backend remoto, puertos locales, targets de proxy, etc).
3. **No incluyas (commit) el archivo `.env` en tu control de versiones.**

*El proyecto utiliza feature flags en las variables de entorno para alternar individualmente la fuente de datos (Backend real vs Mock) de cada dominio operativo.*

---

## Modo Mock vs API remota

Servicios y flags principales:

| Módulo | Flag | Comportamiento mock |
|--------|------|---------------------|
| `AuthContext` | `VITE_ENABLE_REMOTE_AUTH_API` | Login/registro local con usuario simulado. |
| `tractorApi.js` | `VITE_ENABLE_REMOTE_TRACTOR_API` | CRUD/listado en memoria. |
| `implementApi.js` | `VITE_ENABLE_REMOTE_IMPLEMENT_API` | CRUD/listado en memoria con guards de payload. |
| `notificationApi.js` | `VITE_ENABLE_REMOTE_NOTIFICATION_API` | Bandeja mock con estado leído/no leído. |
| `calculationApi.js` | `VITE_ENABLE_REMOTE_CALCULATION_API` | Simulación con latencia (`setTimeout`) y fallback adicional si no hay token. |
| `recommendationApi.js` | `VITE_ENABLE_REMOTE_RECOMMENDATION_API` | Recomendaciones simuladas con latencia. |

Este enfoque permite trabajar UI, validaciones y estados asíncronos sin bloquearse por disponibilidad del backend.

---

## Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run build` | Build de producción (`dist/`) |
| `npm run preview` | Preview local del build |
| `npm run lint` | Alias de `lint:frontend` |
| `npm run lint:frontend` | Lint de `src/` |
| `npm run lint:backend` | Lint de referencia de `.backend/` |
| `npm run lint:all` | Lint global del repositorio |
| `npm run secure-install` | Instalación con scripts deshabilitados (`npm install --ignore-scripts`) |

---

## Convenciones de código

- UI en español; código (variables, funciones, nombres de archivo) en inglés.
- Páginas y componentes en `PascalCase.jsx`.
- Servicios y utilidades en `camelCase.js`.
- Imports estrictamente case-sensitive (Linux en producción).
- Integración HTTP con `fetch` nativo y wrappers internos (sin axios/react-query/swr).
- Mapeo explícito snake_case ↔ camelCase antes de renderizar y antes de enviar payloads.

---

## Performance budget

| Asset | Objetivo |
|-------|----------|
| JS inicial por ruta principal | < 250 kB gzip (combinado) |
| Assets críticos por ruta | < 500 kB cuando sea posible |
| Imágenes hero/fondo | Optimizar cualquier asset > 1 MB antes de producción |

---

## Referencias y autores

- Backend: BackMaqagr (repositorio backend)
  https://github.com/David9604/BackMaqagr
- Origen del proyecto MaqAgr:
  Este repositorio (https://github.com/trbureiyan/MaqAgr) es un fork del proyecto original MaqAgr de https://github.com/David9604/Maqagr.
- Autores:
  - [David9604](https://github.com/David9604)
  - [FlacoAfk](https://github.com/FlacoAfk)
  - [JercOmg](https://github.com/JercOmg)
  - [trbureiyan](https://github.com/trbureiyan)

---

Semillero de Investigación Devurity - Universidad Surcolombiana.
