// src/components/recipes/RecipeModal.jsx
import Card from "../ui/Card";
import Button from "../ui/Button";

export default function RecipeModal({ open, onClose, recipe }) {
  if (!open || !recipe) return null;

  const r = recipe;

  // Makro – pakai fallback yang lebih aman
  const kcal = r.kcal ?? r.calories ?? "-";
  // BUG FIX: utamakan r.carbs, baru r.carb
  const carbs = r.carbs ?? r.carb ?? "-";
  const sugar = r.sugar ?? "-";
  const protein = r.protein ?? "-";
  const fat = r.fat ?? "-";

  // Ingredients – ambil dari beberapa kemungkinan field
  const ingredients =
    r.ingredients ??
    r.raw?.ingredients ??
    r.raw?.extendedIngredients?.map((i) => i.original || i.name) ??
    [];

  // Instructions – ambil dari beberapa kemungkinan field
  const steps =
    r.steps ??
    r.raw?.steps ??
    r.raw?.analyzedInstructions?.[0]?.steps?.map((s) => s.step) ??
    [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto px-4 py-8">
        <Card className="relative p-6 sm:p-7 bg-surface-100 text-ink-900">
          {/* Tombol X */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 text-ink-700 hover:text-ink-900"
            aria-label="Tutup"
          >
            ✕
          </button>

          {/* Judul & info singkat */}
          <h2 className="text-2xl sm:text-3xl font-semibold text-ink-900">
            {r.title}
          </h2>
          <p className="mt-1 text-sm text-ink-800">
            Cook: {r.cookTime ?? r.cookMin ?? "-"} min • Porsi:{" "}
            {r.servings ?? "-"}
          </p>

          {/* Makro */}
          <div className="mt-4 grid gap-3 sm:grid-cols-5">
            <Macro label="Kcal" value={kcal} />
            <Macro label="Carbs" value={`${carbs} g`} />
            <Macro label="Sugar" value={`${sugar} g`} />
            <Macro label="Protein" value={`${protein} g`} />
            <Macro label="Fat" value={`${fat} g`} />
          </div>

          {/* Ingredients & Instructions */}
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <section>
              <h3 className="font-medium text-ink-900">Ingredients</h3>
              {ingredients.length === 0 ? (
                <p className="mt-2 text-sm text-ink-800">
                  Tidak ada data bahan.
                </p>
              ) : (
                <ul className="mt-2 list-disc list-inside text-sm space-y-1">
                  {ingredients.map((item, idx) => (
                    <li key={idx} className="text-ink-900">
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section>
              <h3 className="font-medium text-ink-900">Instructions</h3>
              {steps.length === 0 ? (
                <p className="mt-2 text-sm text-ink-800">
                  Tidak ada instruksi yang tercatat.
                </p>
              ) : (
                <ol className="mt-2 list-decimal list-inside text-sm space-y-2">
                  {steps.map((step, idx) => (
                    <li key={idx} className="text-ink-900">
                      {step}
                    </li>
                  ))}
                </ol>
              )}
            </section>
          </div>

          {/* Catatan (opsional) */}
          {r.notes && (
            <p className="mt-4 text-sm text-ink-800">
              <b>Notes:</b> {r.notes}
            </p>
          )}

          <div className="mt-6 flex justify-end">
            <Button variant="soft" type="button" onClick={onClose}>
              Tutup
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Macro({ label, value }) {
  return (
    <div className="rounded-xl border border-line-200 bg-surface-50 p-3 text-center">
      <p className="text-xs text-ink-700">{label}</p>
      <p className="text-lg font-semibold text-ink-900">{value}</p>
    </div>
  );
}
