// src/components/food/FoodCheckPanel.jsx
import { useEffect, useMemo, useState } from "react";
import Card from "../ui/Card";
import Label from "../ui/Label";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import { addItemToDate, readLogByDate, removeItem } from "../../utils/FoodLog";

// ---------- MOCK DB (tanpa API key). Nanti bisa diganti fetch Nutritionix/OpenFoodFacts ----------
const MOCK = [
  {
    name: "Nasi Goreng",
    unit: "porsi (200 g)",
    nutr: { kcal: 420, protein: 10, fat: 15, carb: 55, sugar: 5, sodium: 700 },
  },
  {
    name: "Es Teh Manis",
    unit: "gelas (240 ml)",
    nutr: { kcal: 110, protein: 0, fat: 0, carb: 28, sugar: 25, sodium: 5 },
  },
  {
    name: "Sate Ayam",
    unit: "10 tusuk (150 g)",
    nutr: { kcal: 350, protein: 28, fat: 20, carb: 10, sugar: 6, sodium: 550 },
  },
  {
    name: "Gado-gado",
    unit: "porsi (300 g)",
    nutr: { kcal: 390, protein: 17, fat: 21, carb: 34, sugar: 9, sodium: 640 },
  },
];

function searchFoods(q) {
  const s = q.trim().toLowerCase();
  if (!s) return [];
  return MOCK.filter((x) => x.name.toLowerCase().includes(s));
}

// format YYYY-MM-DD
function todayKey() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

function StatTile({ label, value }) {
  return (
    <div className="rounded-xl bg-surface-100 border border-line-200 px-3 py-2 text-center">
      <p className="text-xs text-ink-700">{label}</p>
      <p className="font-semibold text-ink-900">{value}</p>
    </div>
  );
}

export default function FoodCheckPanel() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [dateKey, setDateKey] = useState(todayKey());
  const [log, setLog] = useState([]);

  // load log saat tanggal berubah
  useEffect(() => {
    setLog(readLogByDate(dateKey));
  }, [dateKey]);

  const totals = useMemo(() => {
    return log.reduce(
      (acc, it) => {
        const m = it.nutr;
        acc.kcal += m.kcal;
        acc.protein += m.protein;
        acc.fat += m.fat;
        acc.carb += m.carb;
        acc.sugar += m.sugar;
        acc.sodium += m.sodium;
        return acc;
      },
      { kcal: 0, protein: 0, fat: 0, carb: 0, sugar: 0, sodium: 0 }
    );
  }, [log]);

  function doSearch() {
    setResults(searchFoods(query));
  }

  function addToLog(item) {
    const updated = addItemToDate(dateKey, {
      name: item.name,
      unit: item.unit,
      qty: 1,
      nutr: item.nutr,
    });
    setLog(updated);
  }

  function removeFromLog(id) {
    setLog(removeItem(dateKey, id));
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {/* Left: Search & Results */}
      <Card className="p-5 lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <Label htmlFor="q" className="text-ink-900">Food Search</Label>
            <div className="mt-1 flex gap-2">
              <Input
                id="q"
                placeholder="ketik nama menu: nasi goreng, es teh manis, dll"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Button variant="soft" type="button" onClick={doSearch}>Cari</Button>
            </div>
            <p className="mt-2 text-xs text-ink-700">
              * Contoh demo tanpa API. Bisa disambungkan ke Nutritionix / Open Food Facts nanti.
            </p>
          </div>

          <div>
            <Label className="text-ink-900">Tanggal</Label>
            <Input
              type="date"
              className="mt-1"
              value={dateKey}
              onChange={(e) => setDateKey(e.target.value)}
            />
          </div>
        </div>

        {/* Results */}
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {results.map((r, idx) => (
            <div key={idx} className="rounded-2xl border border-line-200 bg-surface-100 p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-ink-900">{r.name}</p>
                  <p className="text-xs text-ink-700">Serving: {r.unit}</p>
                </div>
                <Badge tone={r.sugar > 10 ? "red" : r.carb > 40 ? "yellow" : "green"}>
                  {r.nutr.sugar > 10 ? "High Sugar" : r.nutr.carb > 40 ? "Watch Carbs" : "OK"}
                </Badge>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
                <StatTile label="Kals" value={`${r.nutr.kcal} kcal`} />
                <StatTile label="Carb" value={`${r.nutr.carb} g`} />
                <StatTile label="Sugar" value={`${r.nutr.sugar} g`} />
                <StatTile label="Protein" value={`${r.nutr.protein} g`} />
                <StatTile label="Fat" value={`${r.nutr.fat} g`} />
                <StatTile label="Sodium" value={`${r.nutr.sodium} mg`} />
              </div>

              <div className="mt-3">
                <Button variant="soft" onClick={() => addToLog(r)}>
                  + Add to log
                </Button>
              </div>
            </div>
          ))}

          {results.length === 0 && (
            <div className="sm:col-span-2 text-sm text-ink-700">
              Ketik kata kunci lalu tekan <span className="font-medium">Cari</span>. Hasil akan muncul di sini.
            </div>
          )}
        </div>
      </Card>

      {/* Right: Summary Daily Calories */}
      <Card className="p-5">
        <p className="text-lg font-semibold text-ink-900">Summary Daily Calories</p>
        <p className="text-xs text-ink-700">Tanggal: {dateKey}</p>

        {/* Summary */}
        <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
          <StatTile label="Kals" value={`${totals.kcal} kcal`} />
          <StatTile label="Protein" value={`${totals.protein} g`} />
          <StatTile label="Carb" value={`${totals.carb} g`} />
          <StatTile label="Fat" value={`${totals.fat} g`} />
          <StatTile label="Sugar" value={`${totals.sugar} g`} />
          <StatTile label="Sodium" value={`${totals.sodium} mg`} />
        </div>

        {/* Items */}
        <div className="mt-4 space-y-3">
          {log.length === 0 && (
            <p className="text-sm text-ink-700">Belum ada makanan untuk tanggal ini.</p>
          )}
          {log.map((it) => (
            <div key={it.id} className="rounded-xl border border-line-200 bg-surface px-3 py-2 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-ink-900 font-medium truncate">{it.name}</p>
                <p className="text-xs text-ink-700">{it.unit} • {it.nutr.kcal} kcal</p>
              </div>
              <button
                className="text-ink-700/70 hover:text-ink-900 text-sm"
                onClick={() => removeFromLog(it.id)}
                title="Hapus"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
