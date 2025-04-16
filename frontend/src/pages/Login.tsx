import React, { createContext, useContext } from 'react';
import { User } from '@/types';

const demoUser: User = {
  user_id: 'demo_user',
  phone_number: '+10000000000',
  role: 'admin',
};

type AuthContextType = {
  user: User;
  token: string;
  login: (user: User, token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: demoUser,
  token: 'fake-token',
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthContext.Provider
      value={{
        user: demoUser,
        token: 'fake-token',
        login: () => {},
        logout: () => {},
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export default Login;
