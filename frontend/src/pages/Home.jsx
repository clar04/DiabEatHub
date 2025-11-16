import Card from "../components/ui/Card";
import { useProfile } from "../state/ProfileContext";
import { useGoal } from "../state/GoalContext";
import {
  mifflinStJeor,
  adjustCalories,
  statusTitle,
  focusAdvice,
} from "../utils/calorieCalc";
import { Link } from "react-router-dom";
import { isProfileReady } from "../utils/ensureProfile";
import DailySummary from "../components/home/DailySummary";
import { toDateKey } from "../utils/foodLog";

export default function Home() {
  const { profile } = useProfile();
  const { settings, setSettings } = useGoal();

  // nama buat sapaan
  const displayName = profile?.username || "there";

  const safe = {
    sex: profile?.sex ?? "male",
    weight: Number(profile?.weight ?? 60),
    height: Number(profile?.height ?? 170),
    age: Number(profile?.age ?? 25),
  };

  const bmr = Math.round(
    mifflinStJeor({
      sex: safe.sex,
      weightKg: safe.weight,
      heightCm: safe.height,
      age: safe.age,
    })
  );

  const factor =
    settings.activity === "sedentary"
      ? 1.2
      : settings.activity === "light"
      ? 1.375
      : settings.activity === "moderate"
      ? 1.55
      : 1.725;

  const tdee = Math.round(bmr * factor);
  const target = Math.round(adjustCalories(tdee, settings.goal));
  const title = statusTitle(settings.goal);
  const focus = focusAdvice(settings.goal);

  const todayKey = toDateKey();

  return (
    <section>
      {/* Sapaan pindahan dari navbar */}
      <h1 className="text-2xl sm:text-3xl font-semibold text-white mb-4">
        Hi, {displayName}
      </h1>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-6">
          <h2 className="text-base font-semibold text-ink-900">Your Goal</h2>
          <p className="mt-1 text-sm text-ink-700">
            Atur aktivitas & tujuan. Data profil (jenis kelamin, usia, tinggi,
            berat) di halaman{" "}
            <Link to="/profile" className="underline">
              Profile
            </Link>
            .
          </p>
          <hr className="my-4 border-line-200" />

          {!isProfileReady(profile) && (
            <div className="mb-4 rounded-xl border border-line-200 bg-surface-100 p-3 text-sm text-ink-700">
              Lengkapi profil untuk hasil yang akurat. Buka{" "}
              <Link to="/profile" className="underline">
                halaman Profile
              </Link>
              .
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="activity"
                className="text-sm font-medium text-ink-900"
              >
                Aktivitas
              </label>
              <select
                id="activity"
                className="mt-1 w-full rounded-xl border border-line-200 bg-surface-100 px-3 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-brand-100 focus:border-brand-500 text-ink-900"
                value={settings.activity}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, activity: e.target.value }))
                }
              >
                <option value="sedentary">Sedentary (1–2k langkah)</option>
                <option value="light">Light (jalan santai 2–3×/mgg)</option>
                <option value="moderate">Moderate (3–5× olahraga)</option>
                <option value="active">Active (6–7× olahraga)</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="goal"
                className="text-sm font-medium text-ink-900"
              >
                Tujuan
              </label>
              <select
                id="goal"
                className="mt-1 w-full rounded-xl border border-line-200 bg-surface-100 px-3 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-brand-100 focus:border-brand-500 text-ink-900"
                value={settings.goal}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, goal: e.target.value }))
                }
              >
                <option value="maintain">Maintain</option>
                <option value="loss_light">Weight Loss (−300 kcal)</option>
                <option value="loss_std">Weight Loss (−500 kcal)</option>
                <option value="gain_light">Muscle Gain (+200 kcal)</option>
                <option value="gain_std">Muscle Gain (+300 kcal)</option>
              </select>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3 text-sm">
            <div className="rounded-xl border border-line-200 bg-surface-100 p-3">
              <p className="text-ink-700">BMR</p>
              <p className="text-lg font-semibold text-ink-900">
                {bmr.toLocaleString()} kcal
              </p>
            </div>
            <div className="rounded-xl border border-line-200 bg-surface-100 p-3">
              <p className="text-ink-700">TDEE (maintain)</p>
              <p className="text-lg font-semibold text-ink-900">
                {tdee.toLocaleString()} kcal
              </p>
            </div>
            <div className="rounded-xl border border-line-200 bg-surface-100 p-3">
              <p className="text-ink-700">Target harian</p>
              <p className="text-lg font-semibold text-ink-900">
                {target.toLocaleString()} kcal
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 flex flex-col justify-center">
          <p className="text-xs text-ink-700 font-medium">Status</p>
          <p className="mt-1 text-3xl font-semibold leading-tight text-ink-900">
            {title}
          </p>
          <p className="mt-2 text-sm text-ink-700">
            Target harian{" "}
            <span className="font-semibold text-ink-900">
              {target.toLocaleString()} kcal
            </span>
            .<br />
            {focus}
          </p>
          <p className="mt-3 text-xs text-ink-700">
            * Perkiraan umum, bukan nasihat medis.
          </p>
        </Card>
      </div>

      {/* Daily summary */}
      <div className="mt-6">
        <DailySummary dateKey={todayKey} targetKcal={target || 2000} />
      </div>
    </section>
  );
}
