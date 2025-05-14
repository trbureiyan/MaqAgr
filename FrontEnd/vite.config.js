import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Configuración específica para Fast Refresh
      fastRefresh: true,
    }),
    tailwindcss(),
  ],

  // Configuración para mejorar el comportamiento de HMR
  server: {
    hmr: {
      // Intervalo más largo para evitar sobrecarga
      timeout: 1000,
    }
  },
  /* The `resolve` configuration with the `alias` property in the Vite configuration is used to create
  aliases for specific paths in your project. 
  */
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@pages': '/src/pages',
    }
  }
})
