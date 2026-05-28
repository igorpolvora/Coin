import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const user = { id: 1, name: 'Administrador', email: 'admin@coin.com' };
  const token = 'fake-token';
  const isAuthenticated = true;

  const login = async () => { return { success: true }; };
  const register = async () => { return { success: true }; };
  const logout = () => { window.location.href = '/dashboard'; };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
