import { useState } from "react";
import Card from "../ui/Card";
import Label from "../ui/Label";
import Input from "../ui/Input";
import Badge from "../ui/Badge";
import { searchProductsOFF } from "../../utils/api";

/* ================= Nutrient Box ================= */
function NutrientBox({ label, val, unit }) {
  return (
    <div className="rounded-2xl bg-white border border-emerald-200 px-4 py-3 text-center shadow-sm">
      <p className="text-[11px] text-slate-500 uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="text-base font-semibold text-slate-900">
        {val != null ? `${val} ${unit}` : "-"}
      </p>
    </div>
  );
}

export default function PackagedPanel() {
  const [q, setQ] = useState("");
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function handleSearch() {
    if (!q.trim()) return;
    setLoading(true);
    setErr("");
    setItem(null);

    try {
      const res = await searchProductsOFF(q);
      if (!res) {
        setErr("Produk tidak ditemukan di database Spoonacular.");
      } else {
        setItem(res);
      }
    } catch (e) {
      setErr(e.message || "Gagal mengambil data produk.");
    } finally {
      setLoading(false);
    }
  }

  const renderItem = () => {
    if (!item) return null;

    const analysis = item.analysis || {};
    const tone = analysis.badge_color || "gray";
    const label = analysis.label || "Check Result";

    return (
      <div className="rounded-3xl border border-emerald-200 bg-[#F5FBEF] p-6 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-4">
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 rounded-xl bg-white border border-emerald-200 object-contain p-1"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-white border flex items-center justify-center text-xs text-slate-400">
                No Img
              </div>
            )}

            <div>
              <h3 className="font-semibold text-lg text-slate-900">
                {item.name}
              </h3>
              {item.brand && (
                <p className="text-sm text-slate-600">{item.brand}</p>
              )}

              {analysis.notes?.length > 0 && (
                <ul className="mt-2 space-y-1 text-sm text-slate-700">
                  {analysis.notes.map((n, i) => (
                    <li key={i}>• {n}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <Badge tone={tone}>{label}</Badge>
        </div>

        {/* Nutrisi utama */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <NutrientBox label="Carbs" val={item.carbs_g} unit="g" />
          <NutrientBox label="Sugar" val={item.sugar_g} unit="g" />
          <NutrientBox label="Fiber" val={item.fiber_g} unit="g" />
          <NutrientBox label="Sodium" val={item.sodium_mg} unit="mg" />
        </div>

        {/* Info tambahan */}
        <div className="pt-3 border-t flex justify-center gap-6 text-sm text-slate-700">
          <span>Fat: {item.fat_g}g</span>
          <span>Sat. Fat: {item.saturated_fat_g}g</span>
          <span>Protein: {item.protein_g}g</span>
        </div>
      </div>
    );
  };

  return (
    <Card className="p-6 bg-emerald-50 border border-emerald-100">
      {/* SEARCH BAR */}
      <Label className="text-slate-900">
        Cari Produk Kemasan (Branded)
      </Label>

      <div className="mt-2 flex gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Ex: Oreo, Indomie, Coca Cola, Snickers"
          className="
            w-full
            px-5 py-3
            rounded-full
            bg-white
            border border-emerald-500
            text-slate-900
            placeholder:text-slate-400
            focus:outline-none
            focus:ring-4
            focus:ring-emerald-200
          "
        />

        <button
          onClick={handleSearch}
          className="
            shrink-0
            rounded-full
            bg-emerald-700
            px-6
            py-3
            font-semibold
            text-white
            hover:bg-emerald-800
            transition
          "
        >
          Cek
        </button>
      </div>

      <p className="mt-2 text-xs text-slate-600">
        Powered by <b>Spoonacular</b>. Masukkan nama merek spesifik.
      </p>

      {/* Legend */}
      <div className="mt-4 rounded-2xl bg-emerald-50 border border-emerald-100 p-4 text-sm">
        <p className="font-semibold mb-2 text-slate-600">Indikator Diabetes</p>
        <ul className="space-y-1">
          <li className="flex items-center gap-2 text-slate-600">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            Ramah Diabetes
          </li>
          <li className="flex items-center gap-2 text-slate-600">
            <span className="w-2 h-2 rounded-full bg-yellow-500" />
            Boleh (Kontrol Porsi)
          </li>
          <li className="flex items-center gap-2 text-slate-600">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            Kurang Ideal / Tinggi Gula
          </li>
        </ul>
      </div>

      {/* RESULT */}
      <div className="mt-6 min-h-[120px]">
        {loading && (
          <p className="text-center text-black text-sm animate-pulse">
            Menganalisis nutrisi produk...
          </p>
        )}

        {err && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-600">
            {err}
          </div>
        )}

        {!loading && !err && !item && (
          <div className="text-center text-sm text-slate-600 border-2 border-dashed rounded-xl py-8">
            Hasil pencarian akan muncul di sini
          </div>
        )}

        {!loading && !err && item && renderItem()}
      </div>
    </Card>
  );
}
