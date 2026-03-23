import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  // Excluir carpetas de herramientas y backend del escaneo de archivos
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
    // Aumentar el límite de advertencia de chunk (el default 500kb es muy bajo para este proyecto)
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
