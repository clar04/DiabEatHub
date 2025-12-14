// src/components/food/FoodCheckPanel.jsx
import { useState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";

import Input from "../ui/Input";
import Badge from "../ui/Badge";
import { addToLog, toDateKey } from "../../utils/FoodLog";
import { checkFood } from "../../utils/api";

export default function FoodCheckPanel({ onAddSuccess }) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function doSearch() {
    if (!query.trim()) return;
    setLoading(true);
    setErr("");
    setResult(null);

    try {
      const data = await checkFood(query);

      if (!data) {
        setErr("Food not found in Spoonacular database.");
      } else {
        setResult(data);
      }
    } catch (e) {
      setErr(e.message || "Failed to fetch data from server.");
    } finally {
      setLoading(false);
    }
  }

  function handleAdd(item) {
    const dateKey = toDateKey();

    const carb = Number(item.carbs_g ?? 0) || 0;
    const sugar = Number(item.sugar_g ?? 0) || 0;
    const protein = Number(item.protein_g ?? 0) || 0;
    const fat = Number(item.fat_g ?? 0) || 0;
    const kcal =
      Number(item.calories ?? carb * 4 + protein * 4 + fat * 9) || 0;

    addToLog(dateKey, {
      name: item.name,
      unit: "1 serving",
      carbs: carb,
      sugar: sugar,
      diabetesFlag: item.analysis?.label || "Unknown",
      nutr: {
        kcal,
        protein,
        fat,
        carb,
        sugar,
      },
    });

    if (typeof onAddSuccess === "function") {
      onAddSuccess();
    }
  }

  const renderResult = () => {
    if (!result) return null;

    const r = result;
    const analysis = r.analysis || {};
    const label = analysis.label || "Check Result";

    const isFriendly =
      /friendly/i.test(label) ||
      /boleh/i.test(label) ||
      analysis.badge_color === "success";

    const Icon = isFriendly ? CheckCircle2 : AlertCircle;
    const iconColor = isFriendly ? "text-emerald-600" : "text-red-500";
    const statusColor = isFriendly ? "text-emerald-600" : "text-red-500";

    return (
      <div className="rounded-3xl border border-slate-200 bg-white px-8 py-6 shadow-[0_18px_40px_rgba(15,118,110,0.04)]">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            {r.image && (
              <img
                src={r.image}
                alt={r.name}
                className="w-16 h-16 rounded-xl object-cover border border-emerald-50"
              />
            )}

            <div>
              <div className="flex items-center gap-2">
                <Icon className={`w-5 h-5 ${iconColor}`} />
                <h2 className="text-xl font-semibold text-slate-900 capitalize">
                  {r.name}
                </h2>
              </div>

              <p className={`mt-1 text-sm font-medium ${statusColor}`}>
                {label}
              </p>

              {analysis.badge_color && analysis.badge_color !== "success" && (
                <div className="mt-2">
                  <Badge tone={analysis.badge_color} size="sm">
                    {analysis.badge_text || label}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {r.calories != null && (
            <div className="text-right text-sm text-slate-700">
              <p className="text-xs text-slate-500">Calories</p>
              <p className="font-semibold">{r.calories} kcal</p>
            </div>
          )}
        </div>

        {/* NUTRITION STRIP */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-6 text-center">
          <NutrStat label="Carbs" value={r.carbs_g} unit="g" highlight />
          <NutrStat label="Sugar" value={r.sugar_g} unit="g" highlight />
          <NutrStat label="Fiber" value={r.fiber_g} unit="g" highlight />
          <NutrStat label="Sat. Fat" value={r.saturated_fat_g} unit="g" />
          <NutrStat label="Sodium" value={r.sodium_mg} unit="mg" />
        </div>

        {/* ANALYSIS LIST */}
        {analysis.notes && analysis.notes.length > 0 && (
          <div className="mt-6">
            <p className="text-sm font-semibold text-slate-900 mb-1">
              Analysis:
            </p>
            <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
              {analysis.notes.map((note, idx) => (
                <li key={idx}>{note}</li>
              ))}
            </ul>
          </div>
        )}

        {/* ADD BUTTON */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => handleAdd(r)}
            className="
              h-10
              px-6
              rounded-full
              bg-[#007F6D]
              text-white
              text-sm
              font-semibold
              transition
              hover:bg-[#006458]
              shadow-sm
            "
          >
            + Add to Daily Log
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* SEARCH BAR ATAS */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <Input
          placeholder="Search food (e.g., apple, chicken breast, rice)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && doSearch()}
          className="flex-1 h-11 rounded-2xl border border-emerald-600 bg-white text-sm"
        />
        <button
          type="button"
          onClick={doSearch}
          className="
            h-11
            px-6
            rounded-full
            bg-[#007F6D]
            text-white
            text-sm
            font-semibold
            transition
            hover:bg-[#006458]
            shadow-sm
          "
        >
          Check
        </button>
      </div>

      {/* RESULT AREA */}
      <div className="mt-4 min-h-[80px]">
        {loading && (
          <div className="flex items-center justify-center py-8 text-sm text-slate-600">
            <span className="animate-pulse">
              Analyzing nutrition data...
            </span>
          </div>
        )}

        {err && !loading && (
          <div className="rounded-2xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
            {err}
          </div>
        )}

        {!loading && !err && !result && (
          <div className="text-sm text-slate-500">
            Type a food name above, then press <b>Check</b> to see nutrition
            analysis.
          </div>
        )}

        {!loading && !err && result && renderResult()}
      </div>

      {/* TIP BAR DI BAGIAN PALING BAWAH */}
      <div className="rounded-2xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-sm text-slate-800 flex items-start gap-2">
        <span className="text-lg">💡</span>
        <p>
          <span className="font-semibold">Tip:</span> Try foods like{" "}
          <b>"apple"</b>, <b>"banana"</b>, <b>"white rice"</b>,{" "}
          <b>"brown rice"</b>, <b>"chicken breast"</b>, <b>"salmon"</b>, or{" "}
          <b>"broccoli"</b> to test the checker.
        </p>
      </div>
    </div>
  );
}

/* ===== NUTRIENT COLUMN ===== */
function NutrStat({ label, value, unit, highlight = false }) {
  const num = Number(value);
  const display =
    value != null && !Number.isNaN(num)
      ? `${num.toFixed(num > 0 && num < 1 ? 2 : 0)}${unit}`
      : `0${unit}`;

  return (
    <div className="text-center">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p
        className={`text-xl font-semibold ${
          highlight ? "text-emerald-500" : "text-slate-900"
        }`}
      >
        {display}
      </p>
    </div>
  );
}
