# MaqAgr Frontend

Repositorio frontend de MaqAgr orientado a despliegue serverless en Vercel y consumo de API externa.

## Estructura

- `src/`: aplicacion React
- `public assets`: en `src/assets/`
- configuracion de build en `vite.config.js` y `vercel.json`

## Desarrollo local

1. Instalar dependencias
- `npm install`

2. Ejecutar en local
- `npm run dev`

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
