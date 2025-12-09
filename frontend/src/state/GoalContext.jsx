import { createContext, useContext, useEffect, useMemo, useState } from "react";

const GoalCtx = createContext(null);
const KEY = "smc_goal_settings_v1";

// Hitung target harian dari goal + activity
function computeTargets(settings) {
  const goal = settings.goal || "maintain";
  const activity = settings.activity || "moderate";

  const baseByGoal = {
    loss: 1800,      // Weight Loss
    maintain: 2300,  // Maintenance
    gain: 2800,      // Muscle Gain
  };

  const activityFactor = {
    sedentary: 0.9,
    light: 1.0,
    moderate: 1.1,
    very: 1.2,
    // FIX: harus "extreme" biar sama dengan value di <select>
    extreme: 1.3,
  };

  const base = baseByGoal[goal] ?? baseByGoal.maintain;
  const factor = activityFactor[activity] ?? 1.0;

  const calories = Math.round(base * factor);

  // Biar proporsi mirip desain (1800 -> 200g carbs, 50g sugar)
  const carbs = Math.round((calories * 200) / 1800);
  const sugar = Math.round((calories * 50) / 1800);

  return { calories, carbs, sugar };
}

export function GoalProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : { activity: "moderate", goal: "maintain" };
    } catch {
      return { activity: "moderate", goal: "maintain" };
    }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(settings));
  }, [settings]);

  const targets = useMemo(() => computeTargets(settings), [settings]);

  const value = useMemo(
    () => ({ settings, setSettings, targets }),
    [settings, targets]
  );

  return <GoalCtx.Provider value={value}>{children}</GoalCtx.Provider>;
}

export function useGoal() {
  const ctx = useContext(GoalCtx);
  if (!ctx) throw new Error("useGoal must be used within GoalProvider");
  return ctx;
}
