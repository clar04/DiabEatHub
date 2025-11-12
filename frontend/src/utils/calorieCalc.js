// src/utils/calorieCalc.js
export const ACTIVITY = [
  { key: "sedentary", label: "Sedentary (1–2k langkah)", factor: 1.2 },
  { key: "light", label: "Light (jalan santai 2–3x/mgg)", factor: 1.375 },
  { key: "moderate", label: "Moderate (3–5x olahraga)", factor: 1.55 },
  { key: "active", label: "Active (6–7x olahraga)", factor: 1.725 },
];

export const GOALS = [
  { key: "maintain", label: "Maintain" },
  { key: "loss_light", label: "Weight Loss (−300 kcal)" },
  { key: "loss_std", label: "Weight Loss (−500 kcal)" },
  { key: "gain_light", label: "Muscle Gain (+200 kcal)" },
  { key: "gain_std", label: "Muscle Gain (+300 kcal)" },
];

export function mifflinStJeor({ sex, weightKg, heightCm, age }) {
  return sex === "male"
    ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
    : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
}

export function adjustCalories(tdee, goal) {
  switch (goal) {
    case "loss_light": return Math.max(1200, Math.round(tdee - 300));
    case "loss_std":   return Math.max(1100, Math.round(tdee - 500));
    case "gain_light": return Math.round(tdee + 200);
    case "gain_std":   return Math.round(tdee + 300);
    default:           return Math.round(tdee);
  }
}

export function statusTitle(goal) {
  switch (goal) {
    case "loss_light":
    case "loss_std":  return "Cut it steadily";
    case "gain_light":
    case "gain_std":  return "Build gradually";
    default:          return "Keep it steady";
  }
}

export function focusAdvice(goal) {
  switch (goal) {
    case "loss_light":
    case "loss_std":
      return "Fokus: tinggi protein, karbo kompleks, sayur; defisit konsisten.";
    case "gain_light":
    case "gain_std":
      return "Fokus: protein cukup, surplus kecil, karbo untuk latihan, lemak sehat.";
    default:
      return "Fokus: seimbang (karbo kompleks, protein lean, lemak sehat).";
  }
}
