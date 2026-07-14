// Frontend/src/context/useAuth.js
// Hook de acceso al contexto de autenticación (separado de AuthContext.jsx por react-refresh).
import { useContext } from 'react';
import { AuthContext } from './AuthContext';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
