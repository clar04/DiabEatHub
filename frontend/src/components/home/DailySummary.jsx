// src/components/home/DailySummary.jsx
import { useEffect, useMemo, useState } from "react";
import { Calendar } from "lucide-react";
import { readLogByDate } from "../../utils/foodLog";
import { useGoal } from "../../state/GoalContext";
import { useAuth } from "../../state/AuthContext";

function todayKey() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export default function DailySummary({ dateKey = todayKey() }) {
  const [items, setItems] = useState([]);
  const { targets } = useGoal(); // { calories, carbs, sugar }
  const { currentUser } = useAuth();

  const userName = currentUser?.name || null;

  // target diambil dari GoalContext → otomatis ikut berubah kalau user ganti
  const kcalTarget = targets.calories;
  const carbsTarget = targets.carbs;
  const sugarTarget = targets.sugar;

  // baca log setiap ganti tanggal ATAU saat komponen mount
  useEffect(() => {
    const list = readLogByDate(dateKey);
    setItems(Array.isArray(list) ? list : []);
  }, [dateKey]);

  // filter log berdasarkan user yang lagi login
  const userItems = useMemo(() => {
    if (!userName) return items;
    // item lama (tanpa username) tetap ikut ditampilkan
    return items.filter(
      (it) => !it.username || it.username === userName
    );
  }, [items, userName]);

  const totals = useMemo(() => {
    return userItems.reduce(
      (acc, it) => {
        const m = it.nutr || {};

        const carb = Number(m.carb ?? it.carb ?? it.carbs ?? 0) || 0;
        const sugar = Number(m.sugar ?? it.sugar ?? 0) || 0;
        const protein = Number(m.protein ?? it.protein ?? 0) || 0;
        const fat = Number(m.fat ?? it.fat ?? 0) || 0;
        const fiber = Number(m.fiber ?? it.fiber ?? 0) || 0;

        const kcalFromMacros = carb * 4 + protein * 4 + fat * 9;
        const kcal = Number(m.kcal ?? it.kcal ?? kcalFromMacros) || 0;

        acc.kcal += kcal;
        acc.protein += protein;
        acc.fat += fat;
        acc.carb += carb;
        acc.sugar += sugar;
        acc.fiber += fiber;
        return acc;
      },
      { kcal: 0, protein: 0, fat: 0, carb: 0, sugar: 0, fiber: 0 }
    );
  }, [userItems]);

  const rounded = {
    kcal: Math.round(totals.kcal),
    carb: Math.round(totals.carb),
    sugar: Math.round(totals.sugar),
    fiber: Math.round(totals.fiber),
  };

  const pctCal = Math.min(
    100,
    kcalTarget > 0 ? (rounded.kcal / kcalTarget) * 100 : 0
  );
  const pctCarb = Math.min(
    100,
    carbsTarget > 0 ? (rounded.carb / carbsTarget) * 100 : 0
  );
  const pctSugar = Math.min(
    100,
    sugarTarget > 0 ? (rounded.sugar / sugarTarget) * 100 : 0
  );

  return (
    <div className="rounded-2xl bg-white px-8 py-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 flex items-center justify-center rounded-full bg-emerald-50">
          <Calendar className="w-4 h-4 text-emerald-600" />
        </div>
        <h3 className="text-sm font-semibold text-slate-900">
          Daily Summary
        </h3>
      </div>

      {/* 4 kolom: Calories, Carbs, Sugar, Fiber */}
      <div className="grid grid-cols-4 gap-8 text-sm items-end">
        {/* Calories */}
        <div>
          <p className="text-xs text-slate-500 mb-1">Calories</p>
          <p className="text-[22px] font-bold text-emerald-700 leading-tight">
            {rounded.kcal}
          </p>
          <p className="text-xs text-slate-400 mb-2">/ {kcalTarget}</p>
          <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{ width: `${pctCal}%` }}
            />
          </div>
        </div>

        {/* Carbs */}
        <div>
          <p className="text-xs text-slate-500 mb-1">Carbs</p>
          <p className="text-[22px] font-bold text-emerald-700 leading-tight">
            {rounded.carb}
            <span className="text-sm font-normal">g</span>
          </p>
          <p className="text-xs text-slate-400 mb-2">/ {carbsTarget}g</p>
          <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{ width: `${pctCarb}%` }}
            />
          </div>
        </div>

        {/* Sugar */}
        <div>
          <p className="text-xs text-slate-500 mb-1">Sugar</p>
          <p className="text-[22px] font-bold text-slate-900 leading-tight">
            {rounded.sugar}
            <span className="text-sm font-normal">g</span>
          </p>
          <p className="text-xs text-slate-400 mb-2">/ {sugarTarget}g</p>
          <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-yellow-400"
              style={{ width: `${pctSugar}%` }}
            />
          </div>
        </div>

        {/* Fiber */}
        <div>
          <p className="text-xs text-slate-500 mb-1">Fiber</p>
          <p className="text-[22px] font-bold text-emerald-700 leading-tight">
            {rounded.fiber}g
          </p>
          <p className="text-xs text-slate-400 mt-2">Good hydration</p>
        </div>
      </div>
    </div>
  );
}
