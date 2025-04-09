import { useContext } from 'react';
import { AuthContext } from './AuthContext';

/**
 * Custom hook para acceder al Auth context -> HMR Issue
 * @returns {Object} AuthContext ^ {isAuthenticated, user, login and logout}
 */
export const useAuth = () => useContext(AuthContext);