// src/components/Tabs.jsx
import { useState } from "react";
import Card from "./ui/Card";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Label from "./ui/Label";
import Badge from "./ui/Badge";
import FoodCheckPanel from "./food/FoodCheckPanel";
import SuggestedRecipesPanel from "./recipes/SuggestedRecipesPanel";


function TabButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "px-4 py-2 rounded-xl text-sm font-medium border transition " +
        (active
          ? "bg-surface border-line-200 text-ink-900 shadow-soft"
          : "bg-surface-100 border-line-200 text-ink-700 hover:bg-surface-200")
      }
    >
      {children}
    </button>
  );
}

export default function Tabs() {
  const [tab, setTab] = useState("food");

  return (
    <div className="w-full">
      <div className="flex items-center gap-2">
        <TabButton active={tab === "food"} onClick={() => setTab("food")}>
          Food Check
        </TabButton>
        <TabButton active={tab === "recipes"} onClick={() => setTab("recipes")}>
          Suggested Recipes
        </TabButton>
        <TabButton active={tab === "packaged"} onClick={() => setTab("packaged")}>
          Packaged Product
        </TabButton>
      </div>

      <div className="mt-4">
        {tab === "food" && <FoodCheckPanel />}
        {tab === "recipes" && <SuggestedRecipesPanel />}
        {tab === "packaged" && <Packaged />}
      </div>
    </div>
  );
}

/* ================== Demo panels (tetap selaras palet) ================== */
function Recipes() {
  return (
    <Card id="recipes" className="p-5">
      <div className="flex flex-col sm:flex-row sm:items-end gap-3">
        <div className="flex-1">
          <Label htmlFor="rcp" className="text-ink-900">
            Cari resep
          </Label>
          <Input id="rcp" placeholder="low carb / low sugar" className="mt-1" />
        </div>
        <Button variant="soft">Tampilkan Resep</Button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-line-200 p-4 bg-surface-100 text-ink-900"
          >
            <p className="font-medium">Chicken Veggie Bowl</p>
            <dl className="mt-2 grid grid-cols-3 gap-2 text-xs text-ink-700">
              <div>
                <dt className="font-medium text-ink-900">Carbs</dt>
                <dd>22 g</dd>
              </div>
              <div>
                <dt className="font-medium text-ink-900">Sugar</dt>
                <dd>5 g</dd>
              </div>
              <div>
                <dt className="font-medium text-ink-900">Cook</dt>
                <dd>25 min</dd>
              </div>
            </dl>
            <div className="mt-3">
              <Badge tone="green">Diabetes-Friendly</Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function Packaged() {
  return (
    <Card id="packaged" className="p-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <Label htmlFor="pkg" className="text-ink-900">
            Cari produk kemasan
          </Label>
          <div className="mt-1 flex gap-2">
            <Input id="pkg" placeholder="mis. yogurt plain, sereal, minuman botol" />
            <Button variant="soft">Cek</Button>
          </div>
          <p className="mt-2 text-xs text-ink-700">
            Tampilkan gula per 100g dan deteksi pemanis (sugar, glucose syrup, fructose).
          </p>
        </div>

        <div className="sm:col-span-1">
          <div className="rounded-xl border border-line-200 p-4 bg-surface-100 text-ink-900">
            <p className="text-sm font-medium">Rekomendasi singkat</p>
            <ul className="mt-2 text-sm list-disc pl-5 text-ink-700 space-y-1">
              <li>Pilih “plain/unsweetened” bila ada</li>
              <li>Gula &lt; 5 g / 100 g</li>
              <li>Kontrol porsi untuk produk tinggi karbo</li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
}
