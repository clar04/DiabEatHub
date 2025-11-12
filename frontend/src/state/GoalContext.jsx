import { createContext, useContext, useEffect, useMemo, useState } from "react";

const GoalCtx = createContext(null);
const KEY = "smc_goal_settings_v1";

export function GoalProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : { activity: "light", goal: "maintain" };
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(settings));
  }, [settings]);

  const value = useMemo(() => ({ settings, setSettings }), [settings]);
  return <GoalCtx.Provider value={value}>{children}</GoalCtx.Provider>;
}

export function useGoal() {
  const v = useContext(GoalCtx);
  if (!v) throw new Error("useGoal must be used within GoalProvider");
  return v;
}
