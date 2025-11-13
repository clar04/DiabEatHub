import { useEffect, useMemo, useState } from "react";
import Card from "../ui/Card";
import Separator from "../ui/Separator";
import { readLogByDate } from "../../utils/foodLog";

function todayKey() {
  const d = new Date(); const mm = String(d.getMonth() + 1).padStart(2,"0");
  const dd = String(d.getDate()).padStart(2,"0"); return `${d.getFullYear()}-${mm}-${dd}`;
}
function Tile({ label, value }) {
  return (
    <div className="rounded-xl bg-surface-100 border border-line-200 px-3 py-2 text-center">
      <p className="text-xs text-ink-700">{label}</p>
      <p className="font-semibold text-ink-900">{value}</p>
    </div>
  );
}

export default function DailySummary({ dateKey = todayKey(), targetKcal = 2000 }) {
  const [items, setItems] = useState([]);

  useEffect(() => { setItems(readLogByDate(dateKey)); }, [dateKey]);

  const totals = useMemo(() =>
    items.reduce((a, it) => {
      const m = it.nutr; a.kcal+=m.kcal; a.protein+=m.protein; a.fat+=m.fat; a.carb+=m.carb; a.sugar+=m.sugar;
      return a;
    }, { kcal:0, protein:0, fat:0, carb:0, sugar:0 }), [items]
  );

  const pct = Math.min(100, Math.round((totals.kcal / targetKcal) * 100));

  return (
    <Card className="p-5">
      <p className="text-lg font-semibold text-ink-900">Daily Calorie Summary</p>
      <p className="text-xs text-ink-700">Tanggal: {dateKey}</p>

      <div className="mt-3">
        <div className="h-2 w-full rounded-full bg-surface-100 border border-line-200">
          <div className="h-2 rounded-full bg-accent-600" style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-1 text-xs text-ink-700">{totals.kcal}/{targetKcal} kcal • {pct}%</div>
      </div>

      <Separator className="my-4" />

      <div className="grid grid-cols-5 gap-3 text-sm">
        <Tile label="Kcal" value={`${totals.kcal}`} />
        <Tile label="Protein" value={`${totals.protein} g`} />
        <Tile label="Fat" value={`${totals.fat} g`} />
        <Tile label="Carb" value={`${totals.carb} g`} />
        <Tile label="Sugar" value={`${totals.sugar} g`} />
      </div>
    </Card>
  );
}
