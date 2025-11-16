// src/state/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthCtx = createContext(null);
const KEY = "smc_auth_current_user_v1";

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(KEY);
    return raw || null;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (currentUser) {
      localStorage.setItem(KEY, currentUser);
    } else {
      localStorage.removeItem(KEY);
    }
  }, [currentUser]);

  const login = (username) => {
    setCurrentUser(username);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const value = useMemo(
    () => ({ currentUser, login, logout }),
    [currentUser]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
