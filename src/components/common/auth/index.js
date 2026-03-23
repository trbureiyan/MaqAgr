import { AuthProvider, AuthContext } from './AuthContext';
import { useAuth } from './UseAuth.js'; // NOTE: Keep this file name in lowercase (`UseAuth.js`) to avoid casing issues on Windows n Linux.

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