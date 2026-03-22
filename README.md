# MaqAgr Frontend

Repositorio frontend para el proyecto de investigación agrícola **MaqAgr**, orientado a la gestión y optimización de maquinaria pesada. Este componente está diseñado para ser desplegado de forma independiente (serverless) en Vercel, consumiendo servicios de una API externa alojada en un VPS.

## Propósito y Objetivos

Este proyecto forma parte de un **Semillero de Investigación** y busca:
- **Estandarizar** la gestión de activos agrícolas (tractores, implementos y terrenos).
- **Facilitar** la toma de decisiones mediante una interfaz moderna y eficiente basada en React y shadcn/ui.
- **Garantizar** la portabilidad del frontend, permitiendo pruebas con datos locales antes de la conexión final con el backend productivo.

## Estructura

- `src/`: aplicación React con lógica de componentes y servicios.
- `src/components/ui/`: componentes de interfaz basados en shadcn/ui.
- `src/services/`: capa de integración con datos (Soporta modo Mock y API Remota).
- `public assets`: en `src/assets/`.
- Configuración de build en `vite.config.js` y `vercel.json`.

## Desarrollo local

1. Instalar dependencias
- `npm install`

2. Ejecutar en local
- `npm run dev`

## Modo API (Frontend-First)

Este repositorio mantiene enfoque frontend y despliegue serverless en Vercel.

- Por defecto, el CRUD de tractores trabaja en modo local/mock.
- La API remota se activa solo por bandera de entorno cuando el VPS/backend externo esté disponible.

Variables:

- `VITE_ENABLE_REMOTE_TRACTOR_API=false` (default recomendado en desarrollo frontend)
- `VITE_API_BASE_URL=https://api.tu-dominio.com` (se usa cuando `VITE_ENABLE_REMOTE_TRACTOR_API=true`)

Ejemplo para pruebas con API remota:

- `VITE_ENABLE_REMOTE_TRACTOR_API=true`
- `VITE_API_BASE_URL=https://tu-vps-o-api-gateway.com`

## Scripts

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`

## Cambios Recientes

- Migracion de estructura desde subcarpeta a jerarquia monolitica en la raiz del repositorio.
- Estandarizacion de configuracion de despliegue para Vercel usando `vercel.json`.
- Rewrite SPA para rutas de React Router hacia `index.html`.
- Optimizacion de cache para assets estaticos en Vercel (`immutable`, 1 anio).
- Eliminacion del video pesado del hero de inicio para reducir peso de build y tiempo de carga.
- Hero de inicio actualizado para usar fondo estatico sin romper experiencia visual.
