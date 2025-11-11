import { useEffect, useMemo, useState } from "react";
import Card from "./ui/Card";
import Label from "./ui/Label";
import Input from "./ui/Input";
import Separator from "./ui/Separator";

/* ---------- Constants ---------- */
const ACTIVITY = [
  { key: "sedentary", label: "Sedentary (1–2k langkah)", factor: 1.2 },
  { key: "light", label: "Light (jalan santai 2–3x/mgg)", factor: 1.375 },
  { key: "moderate", label: "Moderate (3–5x olahraga)", factor: 1.55 },
  { key: "active", label: "Active (6–7x olahraga)", factor: 1.725 },
];

const GOALS = [
  { key: "maintain", label: "Maintain" },
  { key: "loss_light", label: "Weight Loss (ringan −300 kcal)" },
  { key: "loss_std", label: "Weight Loss (standar −500 kcal)" },
  { key: "gain_light", label: "Muscle Gain (ringan +200 kcal)" },
  { key: "gain_std", label: "Muscle Gain (standar +300 kcal)" },
];

/* ---------- Helpers ---------- */
const toNum = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);
const clamp = (n, min, max) => (Number.isFinite(n) ? Math.min(Math.max(n, min), max) : min);
const mifflinStJeor = ({ sex, weightKg, heightCm, age }) =>
  sex === "male"
    ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
    : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

function focusAdvice(goal) {
  switch (goal) {
    case "loss_light":
    case "loss_std":
      return "Fokus: tinggi protein (1.6–2.2 g/kg), karbo kompleks, sayur; defisit kalori konsisten.";
    case "gain_light":
    case "gain_std":
      return "Fokus: protein cukup (1.6–2.0 g/kg), surplus kecil, karbo untuk latihan, lemak sehat.";
    default:
      return "Fokus: seimbang (karbo kompleks, protein lean, lemak sehat), jaga porsi & hidrasi.";
  }
}
function statusTitle(goal) {
  switch (goal) {
    case "loss_light":
    case "loss_std":
      return "Cut it steadily";
    case "gain_light":
    case "gain_std":
      return "Build gradually";
    default:
      return "Keep it steady";
  }
}
function adjustCalories(tdee, goal) {
  switch (goal) {
    case "loss_light":
      return Math.max(1200, Math.round(tdee - 300));
    case "loss_std":
      return Math.max(1100, Math.round(tdee - 500));
    case "gain_light":
      return Math.round(tdee + 200);
    case "gain_std":
      return Math.round(tdee + 300);
    default:
      return Math.round(tdee);
  }
}

/* ---------- Component ---------- */
export default function GoalCard() {
  const [form, setForm] = useState(() => {
    const saved = localStorage.getItem("smc_goal_form");
    return (
      (saved && JSON.parse(saved)) || {
        sex: "male",
        age: 22,
        height: 168,
        weight: 60,
        activity: "light",
        goal: "maintain",
      }
    );
  });

  useEffect(() => {
    localStorage.setItem("smc_goal_form", JSON.stringify(form));
  }, [form]);

  const handle = (k) => (e) => {
    const isNum = e.target.type === "number";
    setForm((s) => ({ ...s, [k]: isNum ? toNum(e.target.value) : e.target.value }));
  };
  const clampOnBlur = (k, min, max) => (e) =>
    setForm((s) => ({ ...s, [k]: clamp(toNum(e.target.value), min, max) }));

  const { bmr, tdee, target, title, focus } = useMemo(() => {
    const bmrVal = mifflinStJeor({
      sex: form.sex,
      weightKg: clamp(toNum(form.weight), 30, 250),
      heightCm: clamp(toNum(form.height), 120, 230),
      age: clamp(toNum(form.age), 10, 90),
    });
    const factor = ACTIVITY.find((a) => a.key === form.activity)?.factor ?? 1.2;
    const tdeeVal = bmrVal * factor;
    const targetVal = adjustCalories(tdeeVal, form.goal);

    return {
      bmr: bmrVal,
      tdee: tdeeVal,
      target: targetVal,
      title: statusTitle(form.goal),
      focus: focusAdvice(form.goal),
    };
  }, [form]);

  return (
    <Card className="p-5">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Kiri: judul + form */}
        <div className="lg:col-span-2">
          <h2 className="text-base font-semibold text-ink-900">Your Goal</h2>

          <p className="mt-1 text-sm text-ink-700">
            Ketahui kebutuhan kalori harian untuk menjaga tubuh tetap sehat.
          </p>

          {/* Pemisah di antara dua paragraf */}
          <Separator className="my-3" />

          <p className="text-sm text-ink-700">
            Masukkan data dasar untuk menghitung BMR/TDEE dan target kalori otomatis.
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="sex" className="text-ink-900">Jenis kelamin</Label>
              <select
                id="sex"
                className="field mt-1 w-full px-3 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-accent-500/20 focus:border-accent-600"
                value={form.sex}
                onChange={handle("sex")}
              >
                <option value="male">Laki-laki</option>
                <option value="female">Perempuan</option>
              </select>
            </div>

            <div>
              <Label htmlFor="age" className="text-ink-900">Usia (tahun)</Label>
              <Input
                id="age"
                type="number"
                min="10"
                max="90"
                className="mt-1"
                value={form.age}
                onChange={handle("age")}
                onBlur={clampOnBlur("age", 10, 90)}
              />
            </div>

            <div>
              <Label htmlFor="height" className="text-ink-900">Tinggi (cm)</Label>
              <Input
                id="height"
                type="number"
                min="120"
                max="230"
                className="mt-1"
                value={form.height}
                onChange={handle("height")}
                onBlur={clampOnBlur("height", 120, 230)}
              />
            </div>

            <div>
              <Label htmlFor="weight" className="text-ink-900">Berat (kg)</Label>
              <Input
                id="weight"
                type="number"
                min="30"
                max="250"
                className="mt-1"
                value={form.weight}
                onChange={handle("weight")}
                onBlur={clampOnBlur("weight", 30, 250)}
              />
            </div>

            <div>
              <Label htmlFor="activity" className="text-ink-900">Aktivitas</Label>
              <select
                id="activity"
                className="field mt-1 w-full px-3 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-accent-500/20 focus:border-accent-600"
                value={form.activity}
                onChange={handle("activity")}
              >
                {ACTIVITY.map((a) => (
                  <option key={a.key} value={a.key}>{a.label}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="goal" className="text-ink-900">Tujuan</Label>
              <select
                id="goal"
                className="field mt-1 w-full px-3 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-accent-500/20 focus:border-accent-600"
                value={form.goal}
                onChange={handle("goal")}
              >
                {GOALS.map((g) => (
                  <option key={g.key} value={g.key}>{g.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick numbers */}
          <div className="mt-4 grid gap-3 sm:grid-cols-3 text-sm">
            <div className="rounded-xl bg-surface-100 border border-line-200 p-3 text-ink-700">
              <p>BMR</p>
              <p className="text-lg font-semibold text-ink-900">{Math.round(bmr).toLocaleString()} kcal</p>
            </div>
            <div className="rounded-xl bg-surface-100 border border-line-200 p-3 text-ink-700">
              <p>TDEE (maintain)</p>
              <p className="text-lg font-semibold text-ink-900">{Math.round(tdee).toLocaleString()} kcal</p>
            </div>
            <div className="rounded-xl bg-surface-100 border border-line-200 p-3 text-ink-700">
              <p>Target harian</p>
              <p className="text-lg font-semibold text-ink-900">{target.toLocaleString()} kcal</p>
            </div>
          </div>
        </div>

        {/* Kanan: kartu status */}
        <div className="lg:col-span-1">
          <div className="h-full rounded-2xl bg-surface-100 border border-line-200 p-5 text-ink-900">
            <p className="text-xs text-ink-700 font-medium">Status</p>
            <p className="mt-1 text-3xl font-semibold leading-tight text-ink-900">{title}</p>
            <p className="mt-2 text-sm text-ink-700">
              Target harian <span className="font-semibold text-ink-900">{target.toLocaleString()} kcal</span>.
              <br />
              {focus}
            </p>
            <p className="mt-3 text-xs text-ink-700/80">
              * Perkiraan umum, bukan nasihat medis. Sesuaikan dengan progres & kenyamananmu.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
