import { useState } from "react";
import Card from "../ui/Card";
import Label from "../ui/Label";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import { searchProductsOFF } from "../../utils/api";

function flagTone(sugarPer100g) {
  if (sugarPer100g == null) return "yellow";
  if (sugarPer100g > 15) return "red";
  if (sugarPer100g > 5) return "yellow";
  return "green";
}

export default function PackagedPanel() {
  const [q, setQ] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function handleSearch() {
    if (!q.trim()) return;
    setLoading(true);
    setErr("");
    setItems([]);

    try {
      const res = await searchProductsOFF(q);
      setItems(res);
      if (!res.length) {
        setErr("Produk tidak ditemukan di Open Food Facts.");
      }
    } catch (e) {
      setErr(e.message || "Gagal mengambil data dari Open Food Facts.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-5">
      <div className="grid gap-4 lg:grid-cols-[2fr,1fr] items-start">
        <div>
          <Label htmlFor="q" className="text-ink-900">
            Cari produk kemasan
          </Label>
          <div className="mt-1 flex gap-2">
            <Input
              id="q"
              placeholder="mis. yogurt plain, sereal, minuman botol"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button type="button" variant="soft" onClick={handleSearch}>
              Cek
            </Button>
          </div>
          <p className="mt-2 text-xs text-ink-700">
            Data diambil dari{" "}
            <span className="font-semibold">Open Food Facts</span>. Tampilkan
            gula per 100g dan deteksi pemanis (sugar, glucose syrup, fructose).
          </p>
        </div>

        <div className="rounded-2xl bg-surface-100 border border-line-200 p-3 text-sm">
          <p className="font-semibold text-ink-900 mb-1">
            Rekomendasi singkat
          </p>
          <ul className="list-disc pl-4 text-ink-700 space-y-1 text-xs">
            <li>Pilih “plain/unsweetened” bila ada.</li>
            <li>Gula &lt; 5 g / 100 g lebih baik.</li>
            <li>Kontrol porsi untuk produk tinggi karbo.</li>
          </ul>
        </div>
      </div>

      <div className="mt-5">
        {loading && (
          <p className="text-sm text-ink-700">
            Mengambil data dari Open Food Facts…
          </p>
        )}
        {err && !loading && (
          <p className="text-sm text-red-600">Error: {err}</p>
        )}

        {!loading && !err && items.length === 0 && (
          <p className="text-sm text-ink-700">
            Masukkan kata kunci lalu tekan <span className="font-medium">Cek</span>.
          </p>
        )}

        <div className="mt-3 space-y-3">
          {items.map((p) => {
            const n = p.nutriments || {};
            const sugar = n.sugars_100g ?? n["sugars"] ?? null;
            const carbs = n.carbohydrates_100g ?? null;
            const fat = n.fat_100g ?? null;

            const tone = flagTone(sugar);
            const badgeLabel =
              sugar == null
                ? "Data gula tidak lengkap"
                : sugar > 15
                ? "High Sugar"
                : sugar > 5
                ? "Watch Carbs"
                : "OK";

            return (
              <div
                key={p.id}
                className="rounded-2xl border border-line-200 bg-surface-100 p-4 flex flex-col gap-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-ink-900">{p.name}</p>
                    {p.brand && (
                      <p className="text-xs text-ink-700">{p.brand}</p>
                    )}
                  </div>
                  <Badge tone={tone}>{badgeLabel}</Badge>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="rounded-xl bg-surface px-2 py-2 border border-line-200 text-center">
                    <p className="text-ink-700">Carb / 100g</p>
                    <p className="font-semibold text-ink-900">
                      {carbs != null ? `${carbs} g` : "-"}
                    </p>
                  </div>
                  <div className="rounded-xl bg-surface px-2 py-2 border border-line-200 text-center">
                    <p className="text-ink-700">Sugar / 100g</p>
                    <p className="font-semibold text-ink-900">
                      {sugar != null ? `${sugar} g` : "-"}
                    </p>
                  </div>
                  <div className="rounded-xl bg-surface px-2 py-2 border border-line-200 text-center">
                    <p className="text-ink-700">Fat / 100g</p>
                    <p className="font-semibold text-ink-900">
                      {fat != null ? `${fat} g` : "-"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
