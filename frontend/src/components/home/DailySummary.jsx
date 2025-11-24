// src/components/home/DailySummary.jsx
import { useEffect, useMemo, useState } from "react";
import Card from "../ui/Card";
import Separator from "../ui/Separator";
import { readLogByDate } from "../../utils/foodLog";

function todayKey() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

function Tile({ label, value }) {
  return (
    <div className="rounded-xl bg-surface-100 border border-line-200 px-3 py-2 text-center">
      <p className="text-sm text-ink-700">{label}</p>
      <p className="font-semibold text-ink-900">{value}</p>
    </div>
  );
}

export default function DailySummary({
  dateKey = todayKey(),
  targetKcal = 2000,
}) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(readLogByDate(dateKey));
  }, [dateKey]);

  const totals = useMemo(() => {
    return items.reduce(
      (acc, it) => {
        // dukung dua bentuk:
        // 1) it.nutr = { kcal, protein, fat, carb, sugar }
        // 2) it.{ kcal?, protein?, fat?, carbs, sugar }
        const m = it.nutr || {};

        const carb =
          Number(m.carb ?? it.carb ?? it.carbs ?? 0) || 0;
        const sugar =
          Number(m.sugar ?? it.sugar ?? 0) || 0;
        const protein =
          Number(m.protein ?? it.protein ?? 0) || 0;
        const fat =
          Number(m.fat ?? it.fat ?? 0) || 0;

        // jika sudah ada kcal, pakai; kalau tidak, hitung dari makro
        const kcalFromMacros =
          carb * 4 + protein * 4 + fat * 9;
        const kcal =
          Number(m.kcal ?? it.kcal ?? kcalFromMacros) || 0;

        acc.kcal += kcal;
        acc.protein += protein;
        acc.fat += fat;
        acc.carb += carb;
        acc.sugar += sugar;
        return acc;
      },
      { kcal: 0, protein: 0, fat: 0, carb: 0, sugar: 0 }
    );
  }, [items]);

  const pct = Math.min(
    100,
    targetKcal > 0
      ? Math.round((totals.kcal / targetKcal) * 100)
      : 0
  );

  return (
    <Card className="p-5">
      <p className="text-lg font-semibold text-ink-900">
        Daily Calorie Summary
      </p>
      <p className="text-xs text-ink-700">Tanggal: {dateKey}</p>

      <div className="mt-3">
        <div className="h-2 w-full rounded-full bg-surface-100 border border-line-200">
          <div
            className="h-2 rounded-full bg-accent-600"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-1 text-xs text-ink-700">
          {totals.kcal.toFixed(0)}/{targetKcal} kcal • {pct}%
        </div>
      </div>

      <Separator className="my-4" />

      <div className="grid grid-cols-5 gap-3 text-sm">
        <Tile label="Kcal" value={totals.kcal.toFixed(0)} />
        <Tile
          label="Protein"
          value={`${totals.protein.toFixed(1)} g`}
        />
        <Tile label="Fat" value={`${totals.fat.toFixed(1)} g`} />
        <Tile label="Carb" value={`${totals.carb.toFixed(1)} g`} />
        <Tile
          label="Sugar"
          value={`${totals.sugar.toFixed(1)} g`}
        />
      </div>
    </Card>
  );
}
