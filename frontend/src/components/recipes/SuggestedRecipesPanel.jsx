// src/components/recipes/SuggestedRecipesPanel.jsx
import { useMemo, useState } from "react";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Label from "../ui/Label";
import Button from "../ui/Button";
import Badge from "../ui/Badge";

/* -------- MOCK DATA (bisa diganti API: Spoonacular / Edamam) -------- */
const RECIPES = [
  {
    id: "r1",
    title: "Chicken Veggie Bowl",
    time: 25,
    kcal: 410,
    carbs: 32,
    sugar: 6,
    fat: 15,
    protein: 36,
    ingredients: ["ayam", "brokoli", "wortel", "nasi", "bawang putih", "minyak zaitun"],
  },
  {
    id: "r2",
    title: "Greek Salad with Tuna",
    time: 15,
    kcal: 320,
    carbs: 18,
    sugar: 7,
    fat: 17,
    protein: 26,
    ingredients: ["tuna", "timun", "tomat", "zaitun", "keju feta", "selada", "minyak zaitun"],
  },
  {
    id: "r3",
    title: "Stir-fry Tofu & Green Beans",
    time: 20,
    kcal: 350,
    carbs: 28,
    sugar: 8,
    fat: 18,
    protein: 22,
    ingredients: ["tahu", "buncis", "saus tiram low sugar", "bawang putih", "minyak"],
  },
  {
    id: "r4",
    title: "Oat Yogurt Parfait",
    time: 10,
    kcal: 290,
    carbs: 44,
    sugar: 14,
    fat: 7,
    protein: 14,
    ingredients: ["oat", "yogurt plain", "stroberi", "madu"],
  },
  {
    id: "r5",
    title: "Spicy Shrimp Zoodle",
    time: 18,
    kcal: 330,
    carbs: 22,
    sugar: 5,
    fat: 12,
    protein: 28,
    ingredients: ["udang", "zucchini", "cabai", "bawang putih", "minyak zaitun", "jeruk nipis"],
  },
];

function diabetesFriendly(r) {
  // aturan sederhana; ubah sesuka kamu
  return r.carbs <= 40 && r.sugar <= 10;
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl bg-surface-100 border border-line-200 px-3 py-2 text-center">
      <p className="text-xs text-ink-700">{label}</p>
      <p className="font-semibold text-ink-900">{value}</p>
    </div>
  );
}

export default function SuggestedRecipesPanel() {
  const [q, setQ] = useState("");

  const { results, chips } = useMemo(() => {
    const raw = q.trim().toLowerCase();
    const wantsLowCarb = raw.includes("low carb");
    const wantsLowSugar = raw.includes("low sugar");

    // ekstrak bahan (pisahkan dengan koma)
    const tokens = raw
      .replace(/low carb|low sugar/g, "")
      .split(/[,\s]+/)
      .map((t) => t.trim())
      .filter(Boolean);

    const matchIngredient = (recipe) =>
      tokens.length === 0 || tokens.every((t) => recipe.ingredients.some((ing) => ing.includes(t)));

    const matchTitle = (recipe) => raw && recipe.title.toLowerCase().includes(raw);

    const filtered = RECIPES.filter((r) => {
      // filter oleh low carb/sugar jika diminta
      if (wantsLowCarb && r.carbs > 40) return false;
      if (wantsLowSugar && r.sugar > 10) return false;

      // cocokkan bahan ATAU judul; kalau input kosong, tampilkan semua
      if (raw.length === 0) return true;
      return matchIngredient(r) || matchTitle(r);
    });

    const chips = [];
    if (wantsLowCarb) chips.push("Low carb");
    if (wantsLowSugar) chips.push("Low sugar");
    tokens.forEach((t) => chips.push(t));

    return { results: filtered, chips };
  }, [q]);

  return (
    <Card className="p-5">
      <div className="flex flex-col sm:flex-row sm:items-end gap-3">
        <div className="flex-1">
          <Label htmlFor="srch" className="text-ink-900">Cari resep</Label>
          <Input
            id="srch"
            placeholder="contoh: low carb, low sugar, atau bahan: ayam, brokoli"
            className="mt-1"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          {chips.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {chips.map((c, i) => (
                <span key={i} className="rounded-full bg-surface-100 border border-line-200 px-2.5 py-1 text-xs text-ink-700">
                  {c}
                </span>
              ))}
            </div>
          )}
        </div>
        <Button variant="soft" type="button" onClick={() => { /* no-op; live filter */ }}>
          Tampilkan
        </Button>
      </div>

      {/* Results */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((r) => (
          <div key={r.id} className="rounded-2xl border border-line-200 p-4 bg-surface-100 text-ink-900">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{r.title}</p>
                <p className="text-xs text-ink-700">Cook: {r.time} min</p>
              </div>
              {diabetesFriendly(r) ? (
                <Badge tone="green">Diabetes-Friendly</Badge>
              ) : (
                <Badge tone="yellow">Perhatikan gula/karbo</Badge>
              )}
            </div>

            <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
              <Stat label="Kcal" value={`${r.kcal} kcal`} />
              <Stat label="Carbs" value={`${r.carbs} g`} />
              <Stat label="Sugar" value={`${r.sugar} g`} />
              <Stat label="Protein" value={`${r.protein} g`} />
              <Stat label="Fat" value={`${r.fat} g`} />
            </div>

            <div className="mt-3">
              <p className="text-xs font-medium text-ink-700">Ingredients</p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {r.ingredients.map((ing, i) => (
                  <span key={i} className="rounded-lg bg-surface border border-line-200 px-2 py-0.5 text-xs text-ink-700">
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            {/* placeholder untuk aksi lanjutan (lihat detail / simpan) */}
            <div className="mt-3 flex gap-2">
              <Button variant="soft" className="px-3 py-1 text-xs">Lihat detail</Button>
              <Button className="px-3 py-1 text-xs">Simpan</Button>
            </div>
          </div>
        ))}

        {results.length === 0 && (
          <div className="sm:col-span-2 text-sm text-ink-700">
            Ketik <span className="font-medium">low carb</span>, <span className="font-medium">low sugar</span>,
            atau bahan (pisahkan dengan koma) — misal: <em>ayam, brokoli</em>.
          </div>
        )}
      </div>
    </Card>
  );
}
