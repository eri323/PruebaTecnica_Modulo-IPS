// Frontend/src/context/AuthContext.jsx
// Estado global de autenticación: token y usuario persistidos en localStorage
// (se eligió localStorage sobre memoria para que la sesión sobreviva a un refresh de página).
import { createContext, useState } from 'react';
import api from '../services/api';

// eslint-disable-next-line react-refresh/only-export-components -- el hook vive en useAuth.js, esto solo se consume desde ahí
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem('usuario');
    return guardado ? JSON.parse(guardado) : null;
  });

  // Llama a POST /auth/login y persiste token + usuario si las credenciales son válidas.
  async function login(usuarioLogin, password) {
    const { data } = await api.post('/auth/login', { usuario: usuarioLogin, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));
    setToken(data.token);
    setUsuario(data.usuario);
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setToken(null);
    setUsuario(null);
  }

  const value = { token, usuario, isAuthenticated: Boolean(token), login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
