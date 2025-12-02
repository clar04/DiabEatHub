import { useState } from "react";
import Card from "../ui/Card";
import Label from "../ui/Label";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import { searchProductsOFF } from "../../utils/api"; 
// Note: Kita tetap pakai nama fungsi import yang sama dari api.js, 
// meskipun internal-nya sekarang memanggil Spoonacular.

function NutrientBox({ label, val, unit }) {
  return (
      <div className="rounded-xl bg-surface px-2 py-2 border border-line-200 text-center flex flex-col items-center justify-center">
          <p className="text-[10px] text-ink-500 mb-0.5 uppercase tracking-wider">{label}</p>
          <p className="font-semibold text-ink-900 text-sm">
              {val != null ? `${val} ${unit}` : "-"}
          </p>
      </div>
  )
}

export default function PackagedPanel() {
  const [q, setQ] = useState("");
  
  // Backend sekarang mengembalikan 1 object "best match", bukan array
  const [item, setItem] = useState(null); 
  
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function handleSearch() {
    if (!q.trim()) return;
    setLoading(true);
    setErr("");
    setItem(null);

    try {
      // Fungsi ini sekarang return object data tunggal (atau null) dari Spoonacular
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

  // Helper untuk render hasil
  const renderItem = () => {
    if (!item) return null;

    // Ambil data analisis dari backend
    const analysis = item.analysis || {};
    const tone = analysis.badge_color || "gray";
    const label = analysis.label || "Check Result";
    
    return (
      <div className="rounded-2xl border border-line-200 bg-surface-100 p-5 flex flex-col gap-4 animate-fade-in">
        {/* Header: Gambar, Nama, Brand */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex gap-4">
              {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-16 h-16 object-contain bg-white rounded-lg border border-line-200 p-1" 
                  />
              ) : (
                <div className="w-16 h-16 bg-surface-200 rounded-lg flex items-center justify-center text-xs text-ink-400">
                   No Img
                </div>
              )}
              
              <div>
                  <h3 className="font-bold text-ink-900 text-lg leading-tight">{item.name}</h3>
                  {item.brand && (
                    <p className="text-sm text-ink-600 font-medium">{item.brand}</p>
                  )}
                  {/* Tampilkan Notes jika ada */}
                  {analysis.notes && analysis.notes.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {analysis.notes.map((note, idx) => (
                           <li key={idx} className="text-xs text-ink-700 flex items-start gap-1">
                             <span className="text-brand-600">•</span> {note}
                           </li>
                        ))}
                      </ul>
                  )}
              </div>
          </div>
          
          {/* Badge Status Diabetes */}
          <div className="flex-shrink-0">
             <Badge tone={tone} size="lg">{label}</Badge>
          </div>
        </div>

        {/* Grid Nutrisi */}
        <div className="grid grid-cols-4 gap-2">
          {/* Perhatikan nama key sekarang ada suffix _g atau _mg */}
          <NutrientBox label="Carbs" val={item.carbs_g} unit="g" />
          <NutrientBox label="Sugar" val={item.sugar_g} unit="g" />
          <NutrientBox label="Fiber" val={item.fiber_g} unit="g" />
          <NutrientBox label="Sodium" val={item.sodium_mg} unit="mg" />
        </div>

        {/* Info Tambahan */}
        <div className="text-[10px] text-ink-400 text-center flex justify-center gap-4 border-t border-line-200 pt-2 mt-1">
            <span>Fat: {item.fat_g}g</span>
            <span>Sat. Fat: {item.saturated_fat_g}g</span>
            <span>Protein: {item.protein_g}g</span>
        </div>
      </div>
    );
  };

  return (
    <Card className="p-5">
      <div className="grid gap-4 lg:grid-cols-[2fr,1fr] items-start">
        <div>
          <Label htmlFor="q" className="text-ink-900">
            Cari Produk Kemasan (Branded)
          </Label>
          <div className="mt-1 flex gap-2">
            <Input
              id="q"
              placeholder="Ex: Oreo, Indomie, Coca Cola, Snickers"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button type="button" variant="soft" onClick={handleSearch}>
              Cek
            </Button>
          </div>
          <p className="mt-2 text-[11px] text-ink-500">
            Powered by <span className="font-semibold">Spoonacular</span>. Masukkan nama merek spesifik untuk hasil terbaik.
          </p>
        </div>

        {/* Legend / Info Box */}
        <div className="rounded-2xl bg-surface-100 border border-line-200 p-3 text-sm">
          <p className="font-semibold text-ink-900 mb-1 text-xs uppercase tracking-wide">
            Indikator Diabetes
          </p>
          <ul className="pl-0 space-y-1.5 text-xs">
            <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className="text-ink-700">Ramah Diabetes</span>
            </li>
            <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                <span className="text-ink-700">Boleh (Kontrol Porsi)</span>
            </li>
            <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span className="text-ink-700">Kurang Ideal / Tinggi Gula</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-6 min-h-[120px]">
        {loading && (
          <div className="flex items-center justify-center py-8 text-sm text-ink-700 animate-pulse">
            Menganalisis nutrisi produk...
          </div>
        )}
        
        {err && !loading && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
             {err}
          </div>
        )}

        {!loading && !err && !item && (
          <div className="text-center py-8 text-sm text-ink-400 border-2 border-dashed border-line-200 rounded-xl">
             Hasil pencarian produk akan muncul di sini.
          </div>
        )}

        {!loading && !err && item && renderItem()}
      </div>
    </Card>
  );
}