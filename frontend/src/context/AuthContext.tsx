import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import axios from 'axios';
import { AuthUser } from '../types';

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  activeMode: 'personal' | 'business';
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setActiveMode: (mode: 'personal' | 'business') => void;
  updateUser: (updates: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [activeMode, setActiveModeState] = useState<'personal' | 'business'>('personal');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = sessionStorage.getItem('wg_token');
    const savedUser = sessionStorage.getItem('wg_user');
    const savedMode = sessionStorage.getItem('wg_mode') as 'personal' | 'business' | null;
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      if (savedMode) setActiveModeState(savedMode);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await axios.post(`${BASE_URL}/auth/login`, { email, password });
    setToken(data.token);
    setUser(data.user);
    sessionStorage.setItem('wg_token', data.token);
    sessionStorage.setItem('wg_user', JSON.stringify(data.user));
    sessionStorage.setItem('wg_mode', 'personal');
  };

  const register = async (name: string, email: string, password: string) => {
    const { data } = await axios.post(`${BASE_URL}/auth/register`, { name, email, password });
    setToken(data.token);
    setUser(data.user);
    sessionStorage.setItem('wg_token', data.token);
    sessionStorage.setItem('wg_user', JSON.stringify(data.user));
    sessionStorage.setItem('wg_mode', 'personal');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setActiveModeState('personal');
    sessionStorage.removeItem('wg_token');
    sessionStorage.removeItem('wg_user');
    sessionStorage.removeItem('wg_mode');
  };

  const setActiveMode = (mode: 'personal' | 'business') => {
    setActiveModeState(mode);
    sessionStorage.setItem('wg_mode', mode);
  };

  const updateUser = (updates: Partial<AuthUser>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    sessionStorage.setItem('wg_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        activeMode,
        loading,
        login,
        register,
        logout,
        setActiveMode,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};