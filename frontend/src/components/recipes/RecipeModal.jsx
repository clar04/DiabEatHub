// src/components/recipes/RecipeModal.jsx
import Card from "../ui/Card";
import Button from "../ui/Button";

/**
 * Modal untuk menampilkan resep lengkap.
 * props:
 * - recipe: {
 *     id, title, tags[], cookMin, servings,
 *     kcal, carb, sugar, protein, fat,
 *     ingredients[], steps[], notes?
 *   }
 * - onClose: () => void
 */
export default function RecipeModal({ recipe, onClose }) {
  if (!recipe) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
    >
      <Card className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-ink-900">{recipe.title}</h3>
            <p className="text-sm text-ink-700 mt-1">
              Cook: {recipe.cookMin} min • Porsi: {recipe.servings}
            </p>
            {recipe.tags?.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {recipe.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-line-200 bg-surface-100 px-2.5 py-1 text-xs text-ink-700"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-ink-700/80 hover:text-ink-900 text-xl leading-none"
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>

        {/* Makro ringkas */}
        <div className="mt-4 grid grid-cols-5 gap-3 text-sm">
          <Macro label="Kcal" value={recipe.kcal} />
          <Macro label="Carbs" value={`${recipe.carb} g`} />
          <Macro label="Sugar" value={`${recipe.sugar} g`} />
          <Macro label="Protein" value={`${recipe.protein} g`} />
          <Macro label="Fat" value={`${recipe.fat} g`} />
        </div>

        {/* Bahan & Langkah */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <section>
            <h4 className="font-medium text-ink-900">Ingredients</h4>
            <ul className="mt-2 list-disc list-inside text-sm text-ink-900 space-y-1">
              {recipe.ingredients.map((x, i) => (
                <li key={i}>{x}</li>
              ))}
            </ul>
          </section>

          <section>
            <h4 className="font-medium text-ink-900">Instructions</h4>
            <ol className="mt-2 list-decimal list-inside text-sm text-ink-900 space-y-2">
              {recipe.steps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          </section>
        </div>

        {recipe.notes && (
          <p className="mt-6 text-sm text-ink-800">
            <span className="font-medium">Notes:</span> {recipe.notes}
          </p>
        )}

        <div className="mt-6 flex justify-end">
          <Button variant="soft" onClick={onClose}>
            Tutup
          </Button>
        </div>
      </Card>
    </div>
  );
}

function Macro({ label, value }) {
  return (
    <div className="rounded-xl border border-line-200 bg-surface-100 p-4 text-center">
      <p className="text-xs text-ink-700">{label}</p>
      <p className="text-lg font-semibold text-ink-900">{value}</p>
    </div>
  );
}
