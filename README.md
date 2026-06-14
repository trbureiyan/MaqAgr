<img width="50" height="50" alt="maqagr-logo" src="https://github.com/user-attachments/assets/4d1c5b7a-988c-45b9-8637-9a0fd721a3cf" />

# MaqAgr - Frontend

<img width="1376" height="768" alt="Gemini_Generated_Image_j6savkj6savkj6sa (1)" src="https://github.com/user-attachments/assets/41892393-0d8f-40ab-a130-5f7fd0ff76a3" />

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
- [Convenciones de código](#convenciones-de-código)
- [Performance budget](#performance-budget)
- [Referencias y autores](#referencias-y-autores)

---

## Resumen funcional

<div align="center">
  <a href="https://www.youtube.com/watch?v=oglxA58VsIM">
    <img src="https://img.youtube.com/vi/oglxA58VsIM/maxresdefault.jpg" alt="Ver video en YouTube" style="width:100%; max-width:600px;">
  </a>
</div>

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
| Package manager | pnpm (`pnpm-lock.yaml`) |

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

## Estructura fundamental del proyecto

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
└── pnpm-lock.yaml
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

- Node.js 22+
- Corepack habilitado o disponible en la instalación de Node.js
- pnpm 11.1.0

### 1) Clonar e instalar

```bash
git clone https://github.com/trbureiyan/MaqAgr.git
cd MaqAgr
```

En Windows, el camino recomendado para el equipo es ejecutar el bootstrap de PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\bootstrap-pnpm.ps1 -Pristine -Verify
```

Si prefieres dejar solo la instalación base sin validaciones extra:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\bootstrap-pnpm.ps1
```

Alternativa sin scripts de instalación:

```bash
pnpm run secure-install
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
pnpm run dev
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
| `pnpm run dev` | Servidor de desarrollo con HMR |
| `pnpm run build` | Build de producción (`dist/`) |
| `pnpm run preview` | Preview local del build |
| `pnpm run lint` | Alias de `lint:frontend` |
| `pnpm run lint:frontend` | Lint de `src/` |
| `pnpm run lint:backend` | Lint de referencia de `.backend/` |
| `pnpm run lint:all` | Lint global del repositorio |
| `pnpm run secure-install` | Instalación con scripts deshabilitados (`pnpm install --frozen-lockfile --ignore-scripts`) |

### Bootstrap de Windows

El script [`scripts/bootstrap-pnpm.ps1`](https://github.com/trbureiyan/MaqAgr/blob/refactor/switch-to-pnpm/scripts/bootstrap-pnpm.ps1) deja el entorno listo para trabajar en Windows, eliminando rastros de npm y fijando pnpm 11.1.0.

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
  - [David9604](https://github.com/David9604) | Juan David Yate Vargas
  - [FlacoAfk](https://github.com/FlacoAfk) | Julian Medina Monje
  - [JercOmg](https://github.com/JercOmg) | Juan Esteban Rojas
  - [trbureiyan](https://github.com/trbureiyan) | Brayan Toro Bustos

---

Semillero de Investigación Devurity - Universidad Surcolombiana.
