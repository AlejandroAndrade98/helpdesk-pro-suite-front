import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';
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
  const queryClient = useQueryClient();

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

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
    queryClient.clear();
  }, [queryClient]);

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await userService.getMe();
      setUser(currentUser);
      localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
    } catch {
      clearSession();
    }
  }, [clearSession]);

  useEffect(() => {
    if (token) {
      refreshUser().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [token, refreshUser]);

  const login = useCallback(
    async (data: LoginRequest) => {
      // Limpia cualquier caché de una sesión anterior
      queryClient.clear();
      localStorage.removeItem(USER_KEY);
      setUser(null);

      const res = await authService.login(data);

      localStorage.setItem(TOKEN_KEY, res.accessToken);
      setToken(res.accessToken);

      try {
        const currentUser = await userService.getMe();
        setUser(currentUser);
        localStorage.setItem(USER_KEY, JSON.stringify(currentUser));

        // Fuerza a que todo vuelva a pedirse para esta nueva sesión
        queryClient.clear();
      } catch {
        clearSession();
        throw new Error('SESSION_HYDRATION_FAILED');
      }
    },
    [clearSession, queryClient]
  );

  const register = useCallback(async (data: RegisterRequest) => {
    await authService.register(data);
  }, []);

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};