import { AuthProvider, AuthContext } from './AuthContext';
import { useAuth } from './useAuth';

export {
  AuthProvider,
  AuthContext,
  useAuth
};

// Barrel export para logica Auth y Fast Refresh de Vite

// NOTE: Keep this barrel file name in lowercase (`index.js`) and import it via
// `common/auth` or `common/auth/index` only. On Windows, mixing `Index.js` and
// `index.js` (or `UseAuth.js` and `useAuth.js`) can trigger duplicate-module
// TypeScript/jsconfig casing errors.