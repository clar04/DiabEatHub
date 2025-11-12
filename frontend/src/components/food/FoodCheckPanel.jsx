import { useEffect, useState } from "react";
import Card from "../ui/Card";
import Label from "../ui/Label";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import { addToLog, readLogByDate, removeFromLog, toDateKey } from "../../utils/foodLog";

// ---------- MOCK DATA (tanpa API key). Bisa diganti Nutritionix/Open Food Facts ----------
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
  const [dateKey, setDateKey] = useState(toDateKey());
  const [log, setLog] = useState([]);

  // load log saat tanggal berubah
  useEffect(() => {
    setLog(readLogByDate(dateKey));
  }, [dateKey]);

  function doSearch() {
    setResults(searchFoods(query));
  }

  function handleAdd(item) {
    addToLog(dateKey, {
      name: item.name,
      unit: item.unit,
      nutr: item.nutr,
    });
    setLog(readLogByDate(dateKey)); // refresh list
  }

  function handleRemove(idx) {
    removeFromLog(dateKey, idx);
    setLog(readLogByDate(dateKey));
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Search & Result Panel */}
      <Card className="p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <Label htmlFor="q" className="text-ink-900">
              Food Search
            </Label>
            <div className="mt-1 flex gap-2">
              <Input
                id="q"
                placeholder="ketik nama menu: nasi goreng, es teh manis, dll"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Button variant="soft" type="button" onClick={doSearch}>
                Cari
              </Button>
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

        {/* Hasil pencarian */}
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {results.map((r, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-line-200 bg-surface-100 p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-ink-900">{r.name}</p>
                  <p className="text-xs text-ink-700">Serving: {r.unit}</p>
                </div>
                <Badge
                  tone={
                    r.nutr.sugar > 10 ? "red" : r.nutr.carb > 40 ? "yellow" : "green"
                  }
                >
                  {r.nutr.sugar > 10
                    ? "High Sugar"
                    : r.nutr.carb > 40
                    ? "Watch Carbs"
                    : "OK"}
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
                <Button variant="soft" onClick={() => handleAdd(r)}>
                  + Add to log
                </Button>
              </div>
            </div>
          ))}

          {results.length === 0 && (
            <div className="sm:col-span-2 text-sm text-ink-700">
              Ketik kata kunci lalu tekan{" "}
              <span className="font-medium">Cari</span>. Hasil akan muncul di sini.
            </div>
          )}
        </div>

        {/* Log list */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-ink-900 mb-2">
            Log Makanan ({dateKey})
          </h3>
          {log.length === 0 ? (
            <p className="text-sm text-ink-700">
              Belum ada makanan untuk tanggal ini.
            </p>
          ) : (
            <div className="space-y-3">
              {log.map((it, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-line-200 bg-surface px-3 py-2 flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="text-ink-900 font-medium truncate">{it.name}</p>
                    <p className="text-xs text-ink-700">
                      {it.unit} • {it.nutr.kcal} kcal
                    </p>
                  </div>
                  <button
                    className="text-ink-700/70 hover:text-ink-900 text-sm"
                    onClick={() => handleRemove(idx)}
                    title="Hapus"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
