import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { getRecipeDetail } from "../utils/api";

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
    return () => (on = false);
  }, [id]);

  if (loading) return <div className="mx-auto max-w-4xl p-6 text-white">Loading…</div>;
  if (err) return <div className="mx-auto max-w-4xl p-6 text-red-200">Error: {err}</div>;
  if (!data) return null;

  const r = data; // sesuaikan dengan shape BE-mu

  return (
    <section>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Link to="/recipes" className="text-surface-200 hover:underline">← Kembali</Link>

        <Card className="mt-4 p-6 space-y-5">
          <div className="flex items-start gap-4">
            {r.image && (
              <img src={r.image} alt={r.title} className="w-40 h-28 object-cover rounded-xl border border-line-200" />
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-ink-900">{r.title}</h1>
              <p className="text-ink-700 text-sm mt-1">
                Cook: {r.cookMin ?? r.time} min • {r.diabetes?.badge || "Diabetes-Friendly"}
              </p>
              {r.diabetes?.note && <p className="text-xs text-ink-700 mt-1">{r.diabetes.note}</p>}
            </div>
          </div>

          <div className="grid grid-cols-5 gap-3 text-sm">
            <Macro label="Kcal" value={r.kcal} />
            <Macro label="Carbs" value={`${r.carb} g`} />
            <Macro label="Sugar" value={`${r.sugar} g`} />
            <Macro label="Protein" value={`${r.protein} g`} />
            <Macro label="Fat" value={`${r.fat} g`} />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <section>
              <h3 className="font-medium text-ink-900">Ingredients</h3>
              <ul className="mt-2 list-disc list-inside text-sm text-ink-900 space-y-1">
                {(r.raw?.ingredients ?? r.ingredients ?? []).map((x, i) => <li key={i}>{x}</li>)}
              </ul>
            </section>
            <section>
              <h3 className="font-medium text-ink-900">Instructions</h3>
              <ol className="mt-2 list-decimal list-inside text-sm text-ink-900 space-y-2">
                {(r.raw?.steps ?? r.steps ?? []).map((s, i) => <li key={i}>{s}</li>)}
              </ol>
            </section>
          </div>

          {r.notes && <p className="text-sm text-ink-800"><b>Notes:</b> {r.notes}</p>}

          <div className="flex justify-end">
            <Button variant="soft" asChild><a href="#top">Tutup</a></Button>
          </div>
        </Card>
      </div>
    </section>
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
