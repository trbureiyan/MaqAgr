import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
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
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'ui-vendor': ['lucide-react', 'class-variance-authority', 'clsx', 'tailwind-merge'],
        },
      },
    },
  },

  server: {
    port: 5173,
    proxy: {
      // Toda petición que inicie con /api será interceptada por Vite
      // y redirigida al backend local durante el desarrollo.
      '/api': {
        target: 'http://localhost:4000',
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
})
