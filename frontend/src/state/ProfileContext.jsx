import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ProfileCtx = createContext(null);
const KEY = "smc_profile_v2";

const EMPTY = {
  username: "",
  sex: "",
  age: 0,
  height: 0,
  weight: 0,
};

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(() => {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    try {
      const parsed = JSON.parse(raw);
      return { ...EMPTY, ...parsed };
    } catch {
      return EMPTY;
    }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(profile));
  }, [profile]);

  const updateProfile = (partial) => {
    setProfile((prev) => ({ ...prev, ...partial }));
  };

  const resetProfile = () => setProfile(EMPTY);

  const value = useMemo(
    () => ({ profile, updateProfile, resetProfile }),
    [profile]
  );

  return <ProfileCtx.Provider value={value}>{children}</ProfileCtx.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileCtx);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
}
