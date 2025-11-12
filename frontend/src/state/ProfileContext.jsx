// src/state/ProfileContext.jsx
import { createContext, useContext, useMemo, useState, useEffect } from "react";

const ProfileCtx = createContext(null);
const KEY = "smc_profile_v1";

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(() => {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : { sex: "male", age: null, height: null, weight: null };
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(profile));
  }, [profile]);

  const value = useMemo(() => ({ profile, setProfile }), [profile]);
  return <ProfileCtx.Provider value={value}>{children}</ProfileCtx.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileCtx);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
}
