// src/state/ProfileContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ProfileCtx = createContext(null);
const KEY = "smc_profile_last_v1";

const DEFAULT_PROFILE = {
  username: "",
  sex: "female",
  age: null,
  height: null,
  weight: null,
};

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(() => {
    if (typeof window === "undefined") return DEFAULT_PROFILE;
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_PROFILE;
    try {
      const p = JSON.parse(raw);
      return { ...DEFAULT_PROFILE, ...p };
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(KEY, JSON.stringify(profile));
  }, [profile]);

  const updateProfile = (patch) =>
    setProfile((prev) => ({ ...prev, ...patch }));

  const resetProfile = () => setProfile(DEFAULT_PROFILE);

  const value = useMemo(
    () => ({ profile, setProfile, updateProfile, resetProfile }),
    [profile]
  );

  return <ProfileCtx.Provider value={value}>{children}</ProfileCtx.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileCtx);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
}
