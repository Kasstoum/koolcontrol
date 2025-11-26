// src/auth/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login as apiLogin } from "../api/auth";
import { setToken as setHttpToken } from "../api/http";

type AuthContextValue = {
  token: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const TOKEN_KEY = "koolcontrol_token";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restaure le token au démarrage
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(TOKEN_KEY);
      if (saved) {
        setTokenState(saved);
        setHttpToken(saved);
      }
      setIsLoading(false);
    })();
  }, []);

  const login = async (username: string, password: string) => {
    const { access_token } = await apiLogin({ username, password });

    setTokenState(access_token);
    setHttpToken(access_token);
    await AsyncStorage.setItem(TOKEN_KEY, access_token);
  };

  const logout = async () => {
    setTokenState(null);
    setHttpToken(null);
    await AsyncStorage.removeItem(TOKEN_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};