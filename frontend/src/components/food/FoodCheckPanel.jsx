import { useEffect, useState } from "react";
import Card from "../ui/Card";
import Label from "../ui/Label";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import {
  addToLog,
  readLogByDate,
  removeFromLog,
  toDateKey,
} from "../../utils/foodLog";
import { checkFoodNutritionix } from "../../utils/api";

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
  const [dateKey, setDateKey] = useState(toDateKey());

  const [results, setResults] = useState([]);
  const [log, setLog] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // load log saat tanggal berubah
  useEffect(() => {
    setLog(readLogByDate(dateKey));
  }, [dateKey]);

  async function doSearch() {
    if (!query.trim()) return;
    setLoading(true);
    setErr("");
    setResults([]);

    try {
      const foods = await checkFoodNutritionix(query);
      setResults(foods);
      if (!foods.length) {
        setErr("Makanan tidak ditemukan di Nutritionix.");
      }
    } catch (e) {
      setErr(e.message || "Gagal mengambil data dari Nutritionix.");
    } finally {
      setLoading(false);
    }
  }

  function handleAdd(item) {
    addToLog(dateKey, {
      name: item.name,
      unit: item.serving,
      nutr: item.nutr,
    });
    setLog(readLogByDate(dateKey));
  }

  function handleRemove(idx) {
    removeFromLog(dateKey, idx);
    setLog(readLogByDate(dateKey));
  }

  return (
    <div className="max-w-5xl mx-auto">
      <Card className="p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <Label htmlFor="q" className="text-ink-900">
              Food Search
            </Label>
            <div className="mt-1 flex gap-2">
              <Input
                id="q"
                placeholder="ketik nama menu: nasi goreng, sweet iced tea, dll"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && doSearch()}
              />
              <Button variant="soft" type="button" onClick={doSearch}>
                Cek
              </Button>
            </div>
            <p className="mt-2 text-xs text-ink-700">
              Data diambil dari <span className="font-semibold">Nutritionix</span>.
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
        <div className="mt-5">
          {loading && (
            <p className="text-sm text-ink-700">Mengambil data dari Nutritionix…</p>
          )}
          {err && !loading && (
            <p className="text-sm text-red-600">Error: {err}</p>
          )}

          {!loading && !err && results.length === 0 && (
            <p className="text-sm text-ink-700">
              Ketik nama makanan lalu tekan <span className="font-medium">Cek</span>.
            </p>
          )}

          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {results.map((r, idx) => {
              const sugar = r.nutr.sugar ?? 0;
              const carb = r.nutr.carb ?? 0;
              const tone = sugar > 10 ? "red" : carb > 40 ? "yellow" : "green";
              const label =
                sugar > 10 ? "High Sugar" : carb > 40 ? "Watch Carbs" : "OK";

              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-line-200 bg-surface-100 p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-ink-900">
                        {r.name}
                      </p>
                      <p className="text-xs text-ink-700">
                        Serving: {r.serving}
                      </p>
                    </div>
                    <Badge tone={tone}>{label}</Badge>
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
              );
            })}
          </div>
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
                    <p className="text-ink-900 font-medium truncate">
                      {it.name}
                    </p>
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
