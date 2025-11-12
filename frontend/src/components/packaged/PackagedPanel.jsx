import { useState } from "react";
import Card from "../ui/Card";
import Label from "../ui/Label";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Badge from "../ui/Badge";

// ---------- DUMMY DATA ----------
const MOCK_PACKAGED = [
  {
    name: "Yogurt Strawberry",
    sugarPer100g: 12,
    sweeteners: ["sugar", "glucose syrup"],
    advice: "Terlalu manis, pilih yogurt plain bila memungkinkan.",
  },
  {
    name: "Sereal Cokelat",
    sugarPer100g: 28,
    sweeteners: ["sugar", "fructose"],
    advice: "Hindari sereal manis, pilih versi gandum utuh.",
  },
  {
    name: "Air Mineral",
    sugarPer100g: 0,
    sweeteners: [],
    advice: "Aman. Tidak mengandung gula tambahan.",
  },
  {
    name: "Minuman Energi",
    sugarPer100g: 20,
    sweeteners: ["sugar", "glucose syrup", "fructose"],
    advice: "Sangat tinggi gula. Batasi konsumsi.",
  },
  {
    name: "Susu UHT Plain",
    sugarPer100g: 4,
    sweeteners: [],
    advice: "Gula alami dari laktosa, masih aman untuk konsumsi normal.",
  },
  {
    name: "Biskuit Oatmeal",
    sugarPer100g: 9,
    sweeteners: ["sugar"],
    advice: "Cukup aman, perhatikan jumlah porsi.",
  },
];

function toneBySugar(g) {
  if (typeof g !== "number") return "yellow";
  if (g > 10) return "red";
  if (g > 5) return "yellow";
  return "green";
}

export default function PackagedPanel() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null); // null: belum cari, []: tidak ditemukan

  function handleSearch() {
    const q = query.trim().toLowerCase();
    if (!q) {
      setResults([]);
      return;
    }
    const list = MOCK_PACKAGED.filter((p) =>
      p.name.toLowerCase().includes(q)
    );
    setResults(list);
  }

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Search */}
      <Card className="p-6 flex flex-col lg:flex-row gap-6 justify-between">
        <div className="flex-1">
          <Label className="text-ink-900">Cari produk kemasan</Label>
          <div className="mt-2 flex gap-2">
            <Input
              placeholder="mis. yogurt plain, sereal, minuman botol"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button onClick={handleSearch}>Cek</Button>
          </div>
          <p className="text-sm text-ink-700 mt-2">
            Tampilkan gula per 100g dan deteksi pemanis (sugar, glucose syrup, fructose).
          </p>
        </div>

        <div className="rounded-2xl border border-line-200 bg-surface-100 p-4 lg:w-1/3">
          <p className="text-sm font-semibold text-ink-900 mb-2">
            Rekomendasi singkat
          </p>
          <ul className="list-disc list-inside text-sm text-ink-700 space-y-1">
            <li>Pilih “plain/unsweetened” bila ada</li>
            <li>Gula &lt; 5 g / 100 g</li>
            <li>Kontrol porsi untuk produk tinggi karbo</li>
          </ul>
        </div>
      </Card>

      {/* Results */}
      {results !== null && (
        <div className="space-y-4">
          {results.length === 0 ? (
            <Card className="p-6 text-sm text-ink-700">
              Tidak ditemukan di dummy data. Coba kata kunci lain (contoh: <em>sereal</em>,{" "}
              <em>biskuit</em>, <em>minuman energi</em>, <em>yogurt</em>, <em>air</em>).
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {results.map((r, i) => (
                <Card key={i} className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-ink-900">{r.name}</p>
                      <p className="text-sm text-ink-700 mt-1">
                        Pemanis:{" "}
                        {r.sweeteners.length ? r.sweeteners.join(", ") : "—"}
                      </p>
                    </div>
                    <Badge tone={toneBySugar(r.sugarPer100g)}>
                      {r.sugarPer100g > 10
                        ? "Tinggi gula"
                        : r.sugarPer100g > 5
                        ? "Sedang"
                        : "Rendah gula"}
                    </Badge>
                  </div>

                  <div className="mt-3 grid sm:grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl border border-line-200 bg-surface-100 p-4">
                      <p className="text-ink-700">Gula per 100 g</p>
                      <p className="text-lg font-semibold text-ink-900">
                        {r.sugarPer100g} g
                      </p>
                    </div>
                    <div className="rounded-xl border border-line-200 bg-surface-100 p-4">
                      <p className="text-ink-700">Catatan</p>
                      <p className="text-ink-900">{r.advice}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
