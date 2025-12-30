import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

type AuthContextValue = {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const STORAGE_KEY = "immobilier_jwt";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setToken(stored);
    }
  }, []);

  const login = (value: string) => {
    localStorage.setItem(STORAGE_KEY, value);
    setToken(value);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};

