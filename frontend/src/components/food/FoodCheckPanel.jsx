// src/components/food/FoodCheckPanel.jsx
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
import { checkFood } from "../../utils/api";

function StatTile({ label, value }) {
  return (
    <div className="rounded-xl bg-surface-100 border border-line-200 px-3 py-2 text-center flex flex-col items-center justify-center h-full">
      <p className="text-xs text-ink-700 mb-1">{label}</p>
      <p className="font-semibold text-ink-900 text-sm">{value}</p>
    </div>
  );
}

export default function FoodCheckPanel({ onAddSuccess }) {
  const [query, setQuery] = useState("");
  const [dateKey, setDateKey] = useState(toDateKey());

  // backend mengembalikan 1 objek detail
  const [result, setResult] = useState(null);

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
    setResult(null);

    try {
      const data = await checkFood(query);

      if (!data) {
        setErr("Makanan tidak ditemukan di database Spoonacular.");
      } else {
        setResult(data);
      }
    } catch (e) {
      setErr(e.message || "Gagal mengambil data dari server.");
    } finally {
      setLoading(false);
    }
  }

  function handleAdd(item) {
    // pastikan semua numeric
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
      // nutrisi lengkap untuk DailySummary
      nutr: {
        kcal,
        protein,
        fat,
        carb,
        sugar,
      },
    });

    setLog(readLogByDate(dateKey));

    if (typeof onAddSuccess === "function") {
      onAddSuccess();
    }
  }

  function handleRemove(idx) {
    removeFromLog(dateKey, idx);
    setLog(readLogByDate(dateKey));
  }

  const renderResult = () => {
    if (!result) return null;

    const r = result;
    const analysis = r.analysis || {};

    const tone = analysis.badge_color || "gray";
    const label = analysis.label || "Check Result";

    return (
      <div className="rounded-2xl border border-line-200 bg-surface-100 p-5 animate-fade-in">
        {/* header hasil */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex gap-4">
            {r.image && (
              <img
                src={r.image}
                alt={r.name}
                className="w-16 h-16 object-cover rounded-lg border border-line-200 bg-white"
              />
            )}
            <div>
              <p className="font-bold text-ink-900 text-xl capitalize leading-tight">
                {r.name}
              </p>
              <p className="text-xs text-ink-900 mt-1">
                Kalori:{" "}
                <span className="font-semibold">{r.calories} kcal</span>
              </p>

              {/* notes dari DiabetesRuleService */}
              {analysis.notes && analysis.notes.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {analysis.notes.map((note, idx) => (
                    <li
                      key={idx}
                      className="text-xs text-ink-700 flex items-start gap-1.5"
                    >
                      <span className="text-brand-600 mt-0.5">•</span> {note}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="flex-shrink-0">
            <Badge tone={tone} size="lg">
              {label}
            </Badge>
          </div>
        </div>

        {/* grid nutrisi utama */}
        <div className="mt-5 grid grid-cols-4 gap-2">
          <StatTile label="Carbs" value={`${r.carbs_g} g`} />
          <StatTile label="Sugar" value={`${r.sugar_g} g`} />
          <StatTile label="Fiber" value={`${r.fiber_g} g`} />
          <StatTile label="Sodium" value={`${r.sodium_mg} mg`} />
        </div>

        {/* detail lemak */}
        <div className="mt-2 grid grid-cols-3 gap-2 px-1">
          <div className="text-[11px] text-center text-ink-900">
            Fat: {r.fat_g}g
          </div>
          <div className="text-[11px] text-center text-ink-900">
            Sat. Fat: {r.saturated_fat_g}g
          </div>
          <div className="text-[11px] text-center text-ink-900">
            Protein: {r.protein_g}g
          </div>
        </div>

        {/* tombol add */}
        <div className="mt-5 border-t border-line-200 pt-4 flex justify-end">
          <Button variant="soft" onClick={() => handleAdd(r)}>
            + Add to Daily Log
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto">
      <Card className="p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <Label htmlFor="q" className="text-ink-900">
              Cari Makanan (Bahan & Menu Umum)
            </Label>
            <div className="mt-1 flex gap-2">
              <Input
                id="q"
                placeholder="Ex: Nasi Goreng, Apple, Grilled Chicken"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && doSearch()}
              />
              <Button variant="soft" type="button" onClick={doSearch}>
                Cek
              </Button>
            </div>
            <p className="text-[12px] text-ink-900 mt-1.5 ml-1">
              Powered by Spoonacular. Gunakan bahasa Inggris untuk hasil terbaik
              (misal: "Fried Rice").
            </p>
          </div>

          <div>
            <Label className="text-ink-900">Tanggal Log</Label>
            <Input
              type="date"
              className="mt-1"
              value={dateKey}
              onChange={(e) => setDateKey(e.target.value)}
            />
          </div>
        </div>

        {/* area hasil pencarian */}
        <div className="mt-6 min-h-[100px]">
          {loading && (
            <div className="flex items-center justify-center py-8 text-sm text-ink-700">
              <span className="animate-pulse">
                Sedang menganalisis nutrisi...
              </span>
            </div>
          )}

          {err && !loading && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
              {err}
            </div>
          )}

          {!loading && !err && !result && (
            <div className="text-center py-8 text-sm text-ink-900 border-2 border-dashed border-line-200 rounded-xl">
              Hasil analisis nutrisi & diabetes akan muncul di sini.
            </div>
          )}

          {!loading && !err && result && renderResult()}
        </div>

        {/* list log harian */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-ink-900">
              Log Makanan ({dateKey})
            </h3>
            <span className="text-xs text-ink-900 bg-surface-100 px-2 py-1 rounded-md">
              {log.length} items
            </span>
          </div>

          {log.length === 0 ? (
            <p className="text-sm text-ink-700 italic">
              Belum ada makanan dicatat hari ini.
            </p>
          ) : (
            <div className="space-y-3">
              {log.map((it, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-line-200 bg-surface px-4 py-3 flex items-center justify-between gap-3 transition-colors hover:border-brand-200"
                >
                  <div className="min-w-0">
                    <p className="text-ink-900 font-medium truncate capitalize">
                      {it.name}
                    </p>
                    <p className="text-xs text-ink-900 mt-0.5">
                      Carbs: {it.carbs}g • Sugar: {it.sugar}g
                    </p>

                    {it.diabetesFlag && (
                      <span
                        className={`inline-block mt-1.5 text-[10px] px-1.5 py-0.5 rounded border 
                        ${
                          it.diabetesFlag === "Ramah Diabetes" ||
                          it.diabetesFlag === "Diabetes Friendly"
                            ? "bg-green-50 text-green-700 border-green-100"
                            : "bg-surface-200 text-ink-900 border-line-200"
                        }`}
                      >
                        {it.diabetesFlag}
                      </span>
                    )}
                  </div>

                  <button
                    className="w-8 h-8 flex items-center justify-center rounded-full text-ink-400 hover:text-red-600 hover:bg-red-50 transition-all"
                    onClick={() => handleRemove(idx)}
                    title="Hapus item"
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
