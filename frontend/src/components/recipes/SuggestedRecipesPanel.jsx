import { useEffect, useMemo, useState } from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import RecipeModal from "./RecipeModal";
import { getDiabetesRecipes, getRecipeDetail } from "../../utils/api";
import { pushRecipeHistory } from "../../utils/recipeHistory";

function flagFromMacros(carbs, sugar) {
  if (sugar > 15 || carbs > 50) return "red";
  if (sugar > 10 || carbs > 35) return "yellow";
  return "green";
}

function flagTone(flag) {
  if (flag === "red") return "red";
  if (flag === "yellow") return "yellow";
  return "green";
}

export default function SuggestedRecipesPanel() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [q, setQ] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalRecipe, setModalRecipe] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalErr, setModalErr] = useState("");

  // load list dari Spoonacular
  useEffect(() => {
    async function load() {
      setLoading(true);
      setErr("");
      try {
        const list = await getDiabetesRecipes();
        // kasih flag di sini
        const withFlag = list.map((r) => ({
          ...r,
          flag: flagFromMacros(r.carbs, r.sugar),
        }));
        setRecipes(withFlag);
      } catch (e) {
        setErr(e.message || "Gagal memuat resep dari Spoonacular.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return recipes;
    return recipes.filter(
      (r) =>
        r.title.toLowerCase().includes(s) ||
        (r.image || "").toLowerCase().includes(s)
    );
  }, [q, recipes]);

  async function openDetail(r) {
    setModalOpen(true);
    setModalLoading(true);
    setModalErr("");
    setModalRecipe(null);

    try {
      const detail = await getRecipeDetail(r.id);
      const flag = flagFromMacros(detail.carbs, detail.sugar);
      const full = { ...detail, flag };

      setModalRecipe(full);
      pushRecipeHistory(full); // simpan ke history lokal
    } catch (e) {
      setModalErr(e.message || "Gagal memuat detail resep.");
    } finally {
      setModalLoading(false);
    }
  }

  function closeDetail() {
    setModalOpen(false);
    setModalRecipe(null);
    setModalErr("");
  }

  return (
    <>
      <Card className="p-5">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex-1 w-full">
            <p className="text-sm font-semibold text-ink-900">Cari resep</p>
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="contoh: low carb, ayam, sayur, tuna..."
              className="mt-1 w-full rounded-xl border border-line-200 bg-surface-100 px-3 py-2 text-sm text-ink-900 placeholder:text-ink-600 focus:outline-none focus:ring-4 focus:ring-brand-100 focus:border-brand-500"
            />
            <p className="mt-2 text-xs text-ink-700">
              Data diambil dari <span className="font-semibold">Spoonacular</span>,
              difilter ke gaya low carb / diabetes-friendly.
            </p>
          </div>
          <Button type="button" variant="soft" className="mt-1" onClick={() => {}}>
            Tampilkan
          </Button>
        </div>

        <div className="mt-6">
          {loading && (
            <p className="text-sm text-ink-700">
              Mengambil resep dari Spoonacular…
            </p>
          )}
          {err && !loading && (
            <p className="text-sm text-red-600">Error: {err}</p>
          )}

          {!loading && !err && filtered.length === 0 && (
            <p className="text-sm text-ink-700">
              Tidak ada resep yang cocok dengan kata kunci tersebut.
            </p>
          )}

          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((r) => (
              <article
                key={r.id}
                className="rounded-2xl border border-line-200 bg-surface-100 p-4 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-ink-900">{r.title}</h3>
                    <p className="text-xs text-ink-700">
                      Cook: {r.cookTime} min
                    </p>
                  </div>
                  <Badge tone={flagTone(r.flag)}>
                    {r.flag === "red"
                      ? "Hindari"
                      : r.flag === "yellow"
                      ? "Watch Carbs"
                      : "Diabetes-Friendly"}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="rounded-xl bg-surface border border-line-200 px-2 py-2 text-center">
                    <p className="text-ink-700">Kcal</p>
                    <p className="font-semibold text-ink-900">{r.kcal}</p>
                  </div>
                  <div className="rounded-xl bg-surface border border-line-200 px-2 py-2 text-center">
                    <p className="text-ink-700">Carbs</p>
                    <p className="font-semibold text-ink-900">
                      {r.carbs} g
                    </p>
                  </div>
                  <div className="rounded-xl bg-surface border border-line-200 px-2 py-2 text-center">
                    <p className="text-ink-700">Sugar</p>
                    <p className="font-semibold text-ink-900">
                      {r.sugar} g
                    </p>
                  </div>
                </div>

                <div className="mt-auto flex gap-2">
                  <Button
                    variant="ghost"
                    className="flex-1"
                    type="button"
                    onClick={() => openDetail(r)}
                  >
                    Lihat detail
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Card>

      <RecipeModal
        open={modalOpen}
        onClose={closeDetail}
        recipe={modalRecipe}
        loading={modalLoading}
        error={modalErr}
      />
    </>
  );
}
