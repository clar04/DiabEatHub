// src/pages/Home.jsx
import { useState } from "react";
import { useProfile } from "../state/ProfileContext";
import { useGoal } from "../state/GoalContext";
import { mifflinStJeor, adjustCalories } from "../utils/calorieCalc";
import { toDateKey } from "../utils/FoodLog";
import { isProfileReady } from "../utils/ensureProfile";

// Page tabs
import Food from "./Food";
import Recipes from "./Recipes";
import Packaged from "./Packaged";
import MealPlan from "./MealPlan";
import ProfilePage from "./Profile";
import History from "./History";
import About from "./About";
import { Target } from "lucide-react";

// Daily summary card
import DailySummary from "../components/home/DailySummary";

export default function Home() {
  const { profile } = useProfile();
  const { settings, setSettings } = useGoal();

  const [activeTab, setActiveTab] = useState("food");

  const todayKey = toDateKey();
  const profileOk = isProfileReady(profile);

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

  const handleGoalChange = (e) => {
    setSettings((prev) => ({
      ...prev,
      goal: e.target.value,
    }));
  };

  return (
    <section className="space-y-8">
      {/* =============== HERO =============== */}
      <div className="relative rounded-3xl bg-gradient-to-r from-brand-800 to-brand-700 p-10 text-white overflow-hidden">
        <h1 className="text-4xl font-bold">Smart Meal Checker</h1>
        <p className="mt-2 text-white/90">
          Manage your diet, regulate calories and get a healthy body
        </p>

        {/* Goal Card */}
        <div className="mt-8 bg-white rounded-2xl p-6 flex items-center justify-between shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-xl">
              <Target className="w-6 h-6 text-emerald-700" />
            </div>

            <div>
              <div className="flex items-center gap-3">
                <p className="text-sm font-medium text-ink-700">Your Goal</p>

                <select
                  value={settings.goal}
                  onChange={handleGoalChange}
                  className="
                    bg-emerald-100
                    text-emerald-900
                    px-4 py-1.5
                    rounded-full
                    text-sm
                    font-medium
                    outline-none
                    cursor-pointer
                  "
                >
                  <option value="loss">Weight Loss</option>
                  <option value="maintain">Maintain</option>
                  <option value="gain">Muscle Gain</option>
                </select>
              </div>

              <p className="mt-2 text-sm text-ink-700">
                Know your daily calories to keep your body healthy.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =============== INFO + DAILY SUMMARY =============== */}
      <div className="space-y-3">
        {/* Peringatan isi profil – text saja, tanpa card kuning */}
        {!profileOk && (
          <p className="text-xl text-white-900">
            Lengkapi data di tab <span className="font-semibold">Profile</span>{" "}
            (tinggi badan, berat badan, usia, aktivitas) supaya target kalori,
            carbs, dan sugar lebih akurat.
          </p>
        )}

        {/* Daily Summary card (otomatis pakai target dari GoalContext) */}
        <DailySummary dateKey={todayKey} />
      </div>

      {/* =============== MAIN PANEL (TABS) =============== */}
      <div className="bg-white rounded-3xl p-8 shadow">
        {/* Tabs */}
        <div className=" flex justify-center flex gap-20 border-b text-sm" >
          {[
            ["food", "Food Check"],
            ["recipes", "Recipes"],
            ["packaged", "Packaged Product"],
            ["mealplan", "Meal Plan"],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`pb-3 ${
                activeTab === key
                  ? "text-brand-800 border-b-2 border-brand-600 font-medium"
                  : "text-ink-900 hover:text-brand-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="mt-4">
          {activeTab === "food" && <Food />}
          {activeTab === "recipes" && <Recipes />}
          {activeTab === "packaged" && <Packaged />}
          {activeTab === "mealplan" && <MealPlan />}
        </div>
      </div>
    </section>
  );
}
