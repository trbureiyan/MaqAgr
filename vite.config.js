import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const vitePort = Number.parseInt(env.VITE_PORT || '5173', 10);
  const devApiProxyTarget = (env.VITE_DEV_API_PROXY_TARGET || 'http://localhost:4000').replace(/\/$/, '');

  return {
    // Excluir carpetas de herramientas del escaneo de archivos
    publicDir: 'public',
    plugins: [
      react({
        fastRefresh: true,
      }),
      tailwindcss(),
    ],

    resolve: {
      alias: {
        '@': '/src',
        '@components': '/src/components',
        '@pages': '/src/pages',
      }
    },

    build: {
      chunkSizeWarningLimit: 800,
      rollupOptions: {
        output: {
          // Separar vendors en chunks independientes para mejor caché en Vercel CDN
          // (Vite 8 / Rolldown: manualChunks must be a function)
          manualChunks(rawId) {
            const id = rawId.replaceAll('\\', '/');
            if (!id.includes('/node_modules/')) return undefined;
            const inPkg = (names) => names.some((n) => id.includes(`/node_modules/${n}/`));
            if (inPkg(['react', 'react-dom'])) return 'react-vendor';
            if (inPkg(['react-router', 'react-router-dom'])) return 'router';
            if (inPkg(['lucide-react', 'class-variance-authority', 'clsx', 'tailwind-merge'])) return 'ui-vendor';
            return undefined;
          },
        },
      },
    },

    server: {
      port: Number.isNaN(vitePort) ? 5173 : vitePort,
      proxy: {
        // En desarrollo, el frontend llama /api/* y Vite lo enruta al backend real.
        '/api': {
          target: devApiProxyTarget,
          changeOrigin: true,
          secure: false,
        }
      },
      watch: {
        ignored: [
          '**/.backend/**',
          '**/.agents/**',
          '**/.skills/**',
          '**/.docs/**',
          '**/dist/**'
        ]
      },
      hmr: {
        timeout: 1000,
      }
    },
  };
})
