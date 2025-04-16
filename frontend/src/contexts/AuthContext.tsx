import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types';

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('hatchling-auth');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed.user);
      setToken(parsed.token);
    }
  }, []);

  const login = (user: User, token: string) => {
    setUser(user);
    setToken(token);
    localStorage.setItem('hatchling-auth', JSON.stringify({ user, token }));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('hatchling-auth');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
