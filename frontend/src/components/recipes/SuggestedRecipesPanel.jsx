import { useMemo, useState } from "react";
import Card from "../ui/Card";
import Label from "../ui/Label";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import RecipeModal from "./RecipeModal";

/* ---------- DUMMY RECIPE DB ---------- */
const RECIPES = [
  {
    id: "veg-bowl",
    title: "Chicken Veggie Bowl",
    tags: ["Diabetes-Friendly", "low sugar", "high protein"],
    cookMin: 25,
    servings: 2,
    kcal: 410,
    carb: 32,
    sugar: 6,
    protein: 36,
    fat: 15,
    ingredients: [
      "200 g dada ayam, potong dadu",
      "1 sdm minyak zaitun",
      "1 porsi nasi (100 g) / quinoa",
      "1 wortel, iris",
      "100 g brokoli",
      "1 siung bawang putih",
      "Garam, lada",
    ],
    steps: [
      "Tumis bawang putih dengan minyak hingga harum.",
      "Masukkan ayam, bumbui garam & lada; masak hingga matang.",
      "Tambahkan wortel & brokoli, tumis 2–3 menit.",
      "Sajikan di atas nasi/quinoa.",
    ],
    notes: "Untuk karbo lebih rendah, ganti nasi dengan cauliflower rice.",
  },
  {
    id: "greek-salad-tuna",
    title: "Greek Salad with Tuna",
    tags: ["Diabetes-Friendly", "low carb"],
    cookMin: 15,
    servings: 2,
    kcal: 320,
    carb: 18,
    sugar: 7,
    protein: 26,
    fat: 17,
    ingredients: [
      "1 kaleng tuna (air), tiriskan",
      "1 buah timun, potong dadu",
      "8 buah tomat cherry",
      "1/2 bawang merah, iris tipis",
      "30 g keju feta (opsional)",
      "1 sdm olive oil, 1 sdt air jeruk lemon",
      "Sejumput garam & lada",
    ],
    steps: [
      "Campur semua bahan di mangkuk besar.",
      "Beri olive oil, perasan lemon, garam & lada; aduk rata.",
    ],
  },
  {
    id: "tofu-greenbeans",
    title: "Stir-fry Tofu & Green Beans",
    tags: ["Diabetes-Friendly", "plant-based"],
    cookMin: 20,
    servings: 2,
    kcal: 350,
    carb: 28,
    sugar: 8,
    protein: 22,
    fat: 18,
    ingredients: [
      "250 g tahu, potong dadu",
      "150 g buncis, potong 3 cm",
      "1 siung bawang putih",
      "1 sdm minyak",
      "1 sdm saus tiram low-sugar / light soy",
    ],
    steps: [
      "Tumis bawang putih, masukkan tahu hingga kecokelatan.",
      "Tambahkan buncis & saus; tumis sampai buncis empuk renyah.",
    ],
  },
  {
    id: "oat-parfait",
    title: "Oat Yogurt Parfait",
    tags: ["Perhatikan gula/karbo"],
    cookMin: 10,
    servings: 1,
    kcal: 290,
    carb: 44,
    sugar: 14,
    protein: 14,
    fat: 7,
    ingredients: [
      "40 g oat",
      "150 g yogurt plain",
      "Strawberry/blueberry secukupnya",
      "1 sdt madu (opsional)",
    ],
    steps: [
      "Susun oat, yogurt, dan buah dalam gelas.",
      "Tambahkan madu bila perlu (opsional).",
    ],
    notes: "Gunakan yogurt plain untuk menekan gula.",
  },
  {
    id: "shrimp-zoodle",
    title: "Spicy Shrimp Zoodle",
    tags: ["Diabetes-Friendly", "low carb", "high protein"],
    cookMin: 18,
    servings: 2,
    kcal: 330,
    carb: 22,
    sugar: 5,
    protein: 28,
    fat: 12,
    ingredients: [
      "200 g udang kupas",
      "2 buah zucchini, spiral (zoodle)",
      "1 siung bawang putih, cincang",
      "1 sdt cabai bubuk",
      "1 sdm olive oil, garam, lada",
      "Air jeruk nipis sedikit",
    ],
    steps: [
      "Tumis bawang putih & cabai dengan olive oil.",
      "Masukkan udang hingga berubah warna.",
      "Tambahkan zoodle, aduk cepat 1–2 menit. Bumbui garam & lada.",
      "Angkat, beri perasan jeruk nipis.",
    ],
  },
];

/* ---------- Panel ---------- */
export default function SuggestedRecipesPanel() {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(null);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return RECIPES;
    return RECIPES.filter(
      (r) =>
        r.title.toLowerCase().includes(s) ||
        r.tags.some((t) => t.toLowerCase().includes(s)) ||
        r.ingredients.some((ing) => ing.toLowerCase().includes(s))
    );
  }, [q]);

  return (
    <>
      {/* Search bar */}
      <Card className="p-5">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <Label className="text-ink-900">Cari resep</Label>
            <Input
              placeholder="contoh: low carb, low sugar, atau bahan: ayam, brokoli"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && setQ((v) => v)}
              className="mt-1"
            />
          </div>
          <Button onClick={() => setQ((v) => v)}>Tampilkan</Button>
        </div>
      </Card>

      {/* Cards */}
      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {list.map((r) => (
          <Card key={r.id} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-ink-900">{r.title}</p>
                <p className="text-xs text-ink-700">Cook: {r.cookMin} min</p>
              </div>
              {r.tags?.[0] && (
                <Badge tone={r.tags[0].includes("Perhatikan") ? "yellow" : "green"}>
                  {r.tags[0]}
                </Badge>
              )}
            </div>

            {/* macros */}
            <div className="mt-3 grid grid-cols-4 gap-3 text-sm">
              <Macro label="Kcal" value={`${r.kcal} kcal`} />
              <Macro label="Carbs" value={`${r.carb} g`} />
              <Macro label="Sugar" value={`${r.sugar} g`} />
              <Macro label="Protein" value={`${r.protein} g`} />
              <Macro label="Fat" value={`${r.fat} g`} />
            </div>

            {/* tags ingredients */}
            <div className="mt-3">
              <p className="text-xs text-ink-700 mb-1">Ingredients</p>
              <div className="flex flex-wrap gap-2">
                {r.ingredients.slice(0, 8).map((x, i) => (
                  <span
                    key={i}
                    className="rounded-full border border-line-200 bg-surface-100 px-2.5 py-1 text-xs text-ink-700"
                  >
                    {x}
                  </span>
                ))}
              </div>
            </div>

            {/* actions */}
            <div className="mt-4 flex gap-2">
              <Button variant="soft" onClick={() => setSelected(r)}>
                Lihat detail
              </Button>
              <Button variant="soft">Simpan</Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal detail */}
      <RecipeModal recipe={selected} onClose={() => setSelected(null)} />
    </>
  );
}

function Macro({ label, value }) {
  return (
    <div className="rounded-xl border border-line-200 bg-surface-100 p-3 text-center">
      <p className="text-xs text-ink-700">{label}</p>
      <p className="font-semibold text-ink-900">{value}</p>
    </div>
  );
}
