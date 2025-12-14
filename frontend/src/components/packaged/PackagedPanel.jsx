import { useState } from "react";
import Card from "../ui/Card";
import Label from "../ui/Label";
import { searchProducts } from "../../utils/api"; // Pastikan import ini benar

export default function PackagedPanel() {
  const [q, setQ] = useState("");
  // Ubah state item (single) menjadi items (array)
  const [items, setItems] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function handleSearch() {
    if (!q.trim()) return;
    setLoading(true);
    setErr("");
    setItems([]); // Reset hasil sebelumnya

    try {
      // searchProducts sekarang mengembalikan array items sesuai perbaikan api.js
      const res = await searchProducts(q);
      
      if (!res || res.length === 0) {
        setErr("Produk tidak ditemukan.");
      } else {
        setItems(res);
      }
    } catch (e) {
      setErr(e.message || "Gagal mengambil data produk.");
    } finally {
      setLoading(false);
    }
  }

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
          placeholder="Ex: Oreo, Pepsi, Indomie"
          className="
            w-full px-5 py-3 rounded-full bg-white border border-emerald-500
            text-slate-900 placeholder:text-slate-400
            focus:outline-none focus:ring-4 focus:ring-emerald-200
          "
        />
        <button
          onClick={handleSearch}
          className="
            shrink-0 rounded-full bg-emerald-700 px-6 py-3
            font-semibold text-white hover:bg-emerald-800 transition
          "
        >
          {loading ? "..." : "Cari"}
        </button>
      </div>

      <p className="mt-2 text-xs text-slate-600">
        Menampilkan hasil pencarian dari Spoonacular.
      </p>

      {/* RESULT AREA */}
      <div className="mt-6 min-h-[100px]">
        {/* Error Message */}
        {err && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-600 mb-4">
            {err}
          </div>
        )}

        {/* Empty State */}
        {!loading && !err && items.length === 0 && (
          <div className="text-center text-sm text-slate-500 border-2 border-dashed border-emerald-200 rounded-xl py-8">
            Hasil pencarian akan muncul di sini
          </div>
        )}

        {/* Loading Skeleton (Simple) */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-emerald-100/50 rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        {/* Product List Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((product) => (
            <div 
              key={product.id} 
              className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm flex items-start gap-4 hover:shadow-md transition cursor-pointer"
              // Nanti disini bisa ditambah onClick untuk melihat detail nutrisi
              onClick={() => console.log("Lihat detail ID:", product.id)} 
            >
              {/* Image */}
              <div className="shrink-0 w-20 h-20 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center overflow-hidden">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.title} 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-xs text-gray-400">No img</span>
                )}
              </div>

              {/* Text Content */}
              <div>
                <h3 className="font-semibold text-slate-800 text-sm line-clamp-2 leading-snug">
                  {product.title}
                </h3>
                <span className="inline-block mt-2 text-[10px] uppercase tracking-wide text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  Product
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}