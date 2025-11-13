import Card from "../ui/Card";
import Button from "../ui/Button";

function StatBox({ label, value, unit }) {
  return (
    <div className="rounded-2xl bg-surface-100 border border-line-200 px-6 py-4 text-center">
      <p className="text-xs text-ink-700">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-ink-900">{value}</p>
      {unit && <p className="text-xs text-ink-700 mt-0.5">{unit}</p>}
    </div>
  );
}

export default function RecipeModal({ open, onClose, recipe, loading, error }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-900/50 px-4">
      <Card className="max-w-5xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 bg-surface-50">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-ink-900">
              {recipe?.title || "Detail Resep"}
            </h2>
            {recipe && (
              <p className="mt-1 text-sm text-ink-700">
                Cook: {recipe.cookTime} min • Porsi: {recipe.servings ?? "-"}
              </p>
            )}
          </div>
          <button
            type="button"
            className="text-2xl leading-none text-ink-700 hover:text-ink-900"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {loading && (
          <p className="mt-4 text-sm text-ink-700">
            Mengambil detail resep dari Spoonacular…
          </p>
        )}

        {error && !loading && (
          <p className="mt-4 text-sm text-red-600">Error: {error}</p>
        )}

        {!loading && !error && recipe && (
          <>
            {/* Stats */}
            <div className="mt-5 grid gap-3 sm:grid-cols-5">
              <StatBox label="Kcal" value={recipe.kcal ?? "-"} />
              <StatBox label="Carbs" value={recipe.carbs ?? "-"} unit="g" />
              <StatBox label="Sugar" value={recipe.sugar ?? "-"} unit="g" />
              <StatBox label="Protein" value={recipe.protein ?? "-"} unit="g" />
              <StatBox label="Fat" value={recipe.fat ?? "-"} unit="g" />
            </div>

            {/* Body */}
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-base font-semibold text-ink-900">
                  Ingredients
                </h3>
                {recipe.ingredients?.length ? (
                  <ul className="mt-2 list-disc pl-5 space-y-1 text-sm text-ink-800">
                    {recipe.ingredients.map((ing, idx) => (
                      <li key={idx}>{ing}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-ink-700">
                    Tidak ada data bahan.
                  </p>
                )}
              </div>

              <div>
                <h3 className="text-base font-semibold text-ink-900">
                  Instructions
                </h3>
                {recipe.steps?.length ? (
                  <ol className="mt-2 list-decimal pl-5 space-y-1 text-sm text-ink-800">
                    {recipe.steps.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                ) : (
                  <p className="mt-2 text-sm text-ink-700">
                    Tidak ada instruksi yang tercatat.
                  </p>
                )}
              </div>
            </div>
          </>
        )}

        <div className="mt-6 flex justify-end">
          <Button type="button" variant="soft" onClick={onClose}>
            Tutup
          </Button>
        </div>
      </Card>
    </div>
  );
}
