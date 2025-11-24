// src/pages/RecipeDetail.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { getRecipeDetail } from "../utils/api";
import { Salad, Timer, Flame } from "lucide-react";

export default function RecipeDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let on = true;
    setLoading(true);

    getRecipeDetail(id)
      .then((json) => on && setData(json))
      .catch((e) => on && setErr(e.message || "Gagal memuat resep"))
      .finally(() => on && setLoading(false));

    return () => {
      on = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl p-6 text-white">
        Loading…
      </div>
    );
  }

  if (err) {
    return (
      <div className="mx-auto max-w-4xl p-6 text-red-200">
        Error: {err}
      </div>
    );
  }

  if (!data) return null;

  const r = data;

  // fallback ingredients & steps kalau kosong
  const ingredients = r.raw?.ingredients ?? r.ingredients ?? [];
  const steps = r.raw?.steps ?? r.steps ?? [];

  return (
    <section>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Link
          to="/recipes"
          className="text-surface-200 hover:underline"
        >
          ← Kembali
        </Link>

        <Card className="mt-4 p-6 space-y-5">
          {/* Header resep */}
          <div className="flex items-start gap-4">
            {/* Icon / thumbnail */}
            {r.image ? (
              <img
                src={r.image}
                alt={r.title}
                className="w-40 h-28 object-cover rounded-xl border border-line-200"
              />
            ) : (
              <div className="w-40 h-28 rounded-xl border border-line-200 bg-accent-600/15 flex items-center justify-center">
                <Salad className="w-8 h-8 stroke-brand-800" />
              </div>
            )}

            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-ink-900">
                {r.title}
              </h1>
              <p className="text-ink-800 text-sm mt-1 flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1">
                  <Timer className="w-4 h-4 stroke-brand-800" />
                  Cook:&nbsp;
                  {r.cookMin ?? r.time ?? r.cookTime ?? "-"} min
                </span>
                <span>•</span>
                <span>{r.diabetes?.badge || "Diabetes-Friendly"}</span>
              </p>
              {r.diabetes?.note && (
                <p className="text-xs text-ink-700 mt-1">
                  {r.diabetes.note}
                </p>
              )}
            </div>
          </div>

          {/* Makro ringkas */}
          <div className="grid grid-cols-5 gap-3 text-sm">
            <Macro label="Kcal" value={r.kcal ?? "-"} icon={Flame} />
            {/* BUG FIX: gunakan r.carbs (bukan r.carb) */}
            <Macro
              label="Carbs"
              value={r.carbs != null ? `${r.carbs} g` : "- g"}
            />
            <Macro
              label="Sugar"
              value={r.sugar != null ? `${r.sugar} g` : "- g"}
            />
            <Macro
              label="Protein"
              value={r.protein != null ? `${r.protein} g` : "- g"}
            />
            <Macro
              label="Fat"
              value={r.fat != null ? `${r.fat} g` : "- g"}
            />
          </div>

          {/* Ingredients & Instructions */}
          <div className="grid gap-6 sm:grid-cols-2">
            <section>
              <h3 className="font-medium text-ink-900">Ingredients</h3>
              {ingredients.length === 0 ? (
                <p className="mt-2 text-sm text-ink-700">
                  Tidak ada data bahan.
                </p>
              ) : (
                <ul className="mt-2 list-disc list-inside text-sm space-y-1">
                  {ingredients.map((x, i) => (
                    <li key={i} className="text-ink-900">
                      {x}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section>
              <h3 className="font-medium text-ink-900">Instructions</h3>
              {steps.length === 0 ? (
                <p className="mt-2 text-sm text-ink-700">
                  Tidak ada instruksi yang tercatat.
                </p>
              ) : (
                <ol className="mt-2 list-decimal list-inside text-sm space-y-2">
                  {steps.map((s, i) => (
                    <li key={i} className="text-ink-900">
                      {s}
                    </li>
                  ))}
                </ol>
              )}
            </section>
          </div>

          {/* Notes (opsional) */}
          {r.notes && (
            <p className="text-sm text-ink-800">
              <b>Notes:</b> {r.notes}
            </p>
          )}

          <div className="flex justify-end">
            <Button variant="soft" asChild>
              <button type="button" onClick={() => window.history.back()}>
                Tutup
              </button>
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}

function Macro({ label, value, icon: Icon }) {
  return (
    <div className="rounded-xl border border-line-200 bg-surface-100 p-4 text-center flex flex-col items-center justify-center gap-1">
      {Icon && (
        <div className="w-7 h-7 rounded-full bg-accent-600/25 flex items-center justify-center mb-1">
          <Icon className="w-4 h-4 stroke-brand-800" />
        </div>
      )}
      <p className="text-xs text-ink-700">{label}</p>
      <p className="text-lg font-semibold text-ink-900">{value}</p>
    </div>
  );
}
