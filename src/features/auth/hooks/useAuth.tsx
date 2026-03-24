import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { TOKEN_KEY, USER_KEY } from '@/constants/api';
import { authService } from '@/features/auth/services/authService';
import { userService } from '@/features/users/services/userService';
import type { User, LoginRequest, RegisterRequest } from '@/types/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate session from token on mount
  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await userService.getMe();
      setUser(currentUser);
      localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
    } catch {
      // Token invalid or expired — clear everything
      setUser(null);
      setToken(null);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  }, []);

  useEffect(() => {
    if (token) {
      refreshUser().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  const login = useCallback(async (data: LoginRequest) => {
    // Call POST /auth/login
    const res = await authService.login(data);

    // Store token
    localStorage.setItem(TOKEN_KEY, res.accessToken);
    setToken(res.accessToken);

    // Hydrate user via GET /users/me
    try {
      const currentUser = await userService.getMe();
      setUser(currentUser);
      localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
    } catch {
      // If /users/me fails, clear session
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setToken(null);
      setUser(null);
      throw new Error('SESSION_HYDRATION_FAILED');
    }
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    // Call POST /auth/register — just registers, no auto-login
    await authService.register(data);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated: !!token && !!user, isLoading, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
