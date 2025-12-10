// src/pages/Profile.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User2, Check, LogOut } from "lucide-react";

import Card from "../components/ui/Card";
import Label from "../components/ui/Label";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

import { useProfile } from "../state/ProfileContext";
import { useGoal } from "../state/GoalContext";
import { isProfileReady } from "../utils/ensureProfile";
import { saveProfileForUser, deleteProfileForUser } from "../utils/profileStore";
import { useAuth } from "../state/AuthContext";

export default function Profile() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const { profile, setProfile, resetProfile } = useProfile();
  const { settings, setSettings, targets } = useGoal();

  const [isEditing, setIsEditing] = useState(!isProfileReady(profile));

  const [form, setForm] = useState({
    username: profile?.username || "",
    sex: profile?.sex || "female",
    age: profile?.age ?? "",
    height: profile?.height ?? "",
    weight: profile?.weight ?? "",
  });

  const handleChange = (key) => (e) => {
    setForm((s) => ({ ...s, [key]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const cleaned = {
      username: form.username.trim(),
      sex: form.sex,
      age: Number(form.age) || 0,
      height: Number(form.height) || 0,
      weight: Number(form.weight) || 0,
    };

    setProfile(cleaned);
    saveProfileForUser(cleaned);

    if (!isProfileReady(cleaned)) {
      alert("Data belum lengkap atau belum valid, cek lagi ya 🙂");
      return;
    }

    setIsEditing(false);
  };

  const handleReset = () => {
    if (
      !window.confirm(
        "Hapus seluruh data profil (jenis kelamin, usia, TB, BB) untuk user ini?"
      )
    )
      return;

    if (profile?.username) {
      deleteProfileForUser(profile.username);
    }
    resetProfile();

    setForm({
      username: "",
      sex: "female",
      age: "",
      height: "",
      weight: "",
    });
    setIsEditing(true);
  };

  const handleLogout = async () => {
    if (!window.confirm("Yakin ingin logout dari Smart Meal Checker?")) return;
    try {
      await logout();
      navigate("/", { replace: true });
    } catch (e) {
      console.error("Logout gagal:", e);
    }
  };

  const displayName = profile?.username || "User";
  const age = profile?.age || "–";
  const weight = profile?.weight || "–";
  const height = profile?.height || "–";
  const gender =
    profile?.sex === "male"
      ? "Male"
      : profile?.sex === "female"
      ? "Female"
      : "–";

  return (
    // wrapper kecil aja, card putihnya di dalam
    <section className="space-y-6">
      {/* CARD PUTIH BESAR */}
      <div className="bg-white rounded-3xl p-8 shadow">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
              <User2 className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
                Profile
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Personal data & daily nutrition targets
              </p>
            </div>
          </div>

          {!isEditing && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>

        {/* VIEW MODE */}
        {!isEditing && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <ProfileTile label="Name" value={displayName} />
              <ProfileTile
                label="Age"
                value={age !== "–" ? `${age} yrs` : "–"}
              />
              <ProfileTile label="Gender" value={gender} />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <ProfileTile
                label="Weight"
                value={weight !== "–" ? `${weight} kg` : "–"}
              />
              <ProfileTile
                label="Height"
                value={height !== "–" ? `${height} cm` : "–"}
              />
              <ProfileTile
                label="Activity Level"
                value={
                  settings.activity === "sedentary"
                    ? "Sedentary"
                    : settings.activity === "light"
                    ? "Light Activity"
                    : settings.activity === "moderate"
                    ? "Moderate Activity"
                    : settings.activity === "very"
                    ? "Very Active"
                    : "Extremely Active"
                }
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <ProfileTile
                label="Daily Calorie Target"
                value={targets.calories}
                valueClass="text-emerald-700"
              />
              <ProfileTile
                label="Daily Carbs Target"
                value={`${targets.carbs}g`}
                valueClass="text-emerald-700"
              />
              <ProfileTile
                label="Daily Sugar Target"
                value={`${targets.sugar}g`}
                valueClass="text-slate-900"
              />
            </div>

            {/* Card Health rekomendasi: bg putih + border */}
            <Card className="mt-2 border border-emerald-100 bg-[#ECF7F0]">
              <h2 className="text-sm sm:text-base font-semibold text-slate-900 mb-3">
                Health Recommendations
              </h2>
              <ul className="space-y-1 text-sm text-slate-800">
                <HealthItem text="Keep daily carbs below 200g for better blood sugar management." />
                <HealthItem text="Limit sugar intake to 50g per day for diabetes prevention." />
                <HealthItem text="Stay within 1800 calories to maintain your weight management goals." />
                <HealthItem text="Aim for at least 25g of fiber daily to support digestive health." />
              </ul>
            </Card>
          </div>
        )}

        {/* EDIT MODE */}
        {isEditing && (
          <Card className="mt-4 border-0 bg-white px-6 py-7">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">
              Edit Profile
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="username" className="text-slate-800">
                    Name
                  </Label>
                  <Input
                    id="username"
                    className="mt-1 text-slate-900 placeholder:text-slate-400 bg-white border border-slate-200 rounded-xl h-11"
                    value={form.username}
                    onChange={handleChange("username")}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="height" className="text-slate-800">
                    Height (cm)
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    min="100"
                    className="mt-1 text-slate-900 placeholder:text-slate-400 bg-white border border-slate-200 rounded-xl h-11"
                    value={form.height}
                    onChange={handleChange("height")}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="weight" className="text-slate-800">
                    Weight (kg)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    min="20"
                    className="mt-1 text-slate-900 placeholder:text-slate-400 bg-white border border-slate-200 rounded-xl h-11"
                    value={form.weight}
                    onChange={handleChange("weight")}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="age" className="text-slate-800">
                    Age
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    min="10"
                    className="mt-1 text-slate-900 placeholder:text-slate-400 bg-white border border-slate-200 rounded-xl h-11"
                    value={form.age}
                    onChange={handleChange("age")}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-slate-800">Activity Level</Label>
                  <select
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
                    value={settings.activity}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        activity: e.target.value,
                      }))
                    }
                  >
                    <option value="sedentary">Sedentary</option>
                    <option value="light">Light Activity</option>
                    <option value="moderate">Moderate Activity</option>
                    <option value="very">Very Active</option>
                    <option value="extremely">Extremely Active</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="sex" className="text-slate-800">
                    Gender
                  </Label>
                  <select
                    id="sex"
                    value={form.sex}
                    onChange={handleChange("sex")}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
                  >
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                  </select>
                </div>
              </div>

              {/* daily targets read-only dari GoalContext */}
              <div className="grid gap-4 sm:grid-cols-3 pt-2">
                <div>
                  <Label className="text-slate-800">Daily Calories</Label>
                  <Input
                    type="number"
                    className="mt-1 bg-white border border-slate-200 rounded-xl h-11 text-slate-900"
                    value={targets.calories}
                    readOnly
                  />
                </div>
                <div>
                  <Label className="text-slate-800">Daily Carbs (g)</Label>
                  <Input
                    type="number"
                    className="mt-1 bg-white border border-slate-200 rounded-xl h-11 text-slate-900"
                    value={targets.carbs}
                    readOnly
                  />
                </div>
                <div>
                  <Label className="text-slate-800">Daily Sugar (g)</Label>
                  <Input
                    type="number"
                    className="mt-1 bg-white border border-slate-200 rounded-xl h-11 text-slate-900"
                    value={targets.sugar}
                    readOnly
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="w-full sm:flex-1 rounded-full bg-emerald-700 py-3 text-sm font-semibold text-white hover:bg-emerald-800 transition shadow-sm"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  className="w-full sm:flex-1 rounded-full border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <Button
                  type="button"
                  variant="ghost"
                  className="sm:w-auto bg-red-500 text-white hover:bg-red-400"
                  onClick={handleReset}
                >
                  Hapus data profil
                </Button>
              </div>
            </form>
          </Card>
        )}
      </div>
    </section>
  );
}

/* SMALL COMPONENTS */
function ProfileTile({ label, value, valueClass = "text-slate-900" }) {
  return (
    <div className="rounded-2xl bg-[#E5F4EA] px-5 py-4">
      <p className="text-xs text-emerald-900/80 mb-1">{label}</p>
      <p className={`text-lg font-semibold ${valueClass}`}>{value}</p>
    </div>
  );
}

function HealthItem({ text }) {
  return (
    <li className="flex items-start gap-2">
      <Check className="mt-[2px] h-4 w-4 text-emerald-500" />
      <span>{text}</span>
    </li>
  );
}
