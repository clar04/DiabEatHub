// src/pages/RecipeDetail.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge"; 
import { getRecipeDetail } from "../utils/api";
import { Salad, Timer, Flame, ChefHat } from "lucide-react";

export default function RecipeDetail() {
  const { id } = useParams();
  
  // Data akan berisi object { diabetes: {...}, raw: {...} } dari backend
  const [data, setData] = useState(null);
  
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let on = true;
    setLoading(true);

    getRecipeDetail(id)
      .then((json) => {
        if (on) {
          // Backend mengembalikan { success: true, item: { ... } }
          // Kita simpan item-nya
          setData(json.item); 
        }
      })
      .catch((e) => on && setErr(e.message || "Gagal memuat resep"))
      .finally(() => on && setLoading(false));

    return () => {
      on = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl p-6 text-center text-ink-500 animate-pulse">
        Sedang memuat detail resep...
      </div>
    );
  }

  if (err) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
           Error: {err}
        </div>
        <Link to="/recipes" className="mt-4 inline-block text-ink-700 hover:underline">
           &larr; Kembali ke daftar resep
        </Link>
      </div>
    );
  }

  if (!data || !data.diabetes) return null;

  // 'r' adalah data yang sudah dinormalisasi dan dianalisis oleh DiabetesRuleService
  const r = data.diabetes;
  const analysis = r.analysis || {};

  // Spoonacular mengembalikan HTML string untuk instruksi
  const instructionsHTML = r.instructions || "No instructions available.";
  
  // Spoonacular mengembalikan array object untuk ingredients
  const ingredients = r.extendedIngredients || [];

  return (
    <section>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Link
          to="/recipes"
          className="text-ink-500 hover:text-brand-600 hover:underline text-sm mb-4 inline-flex items-center gap-1"
        >
          &larr; Kembali ke Daftar Resep
        </Link>

        <Card className="p-6 space-y-6 animate-fade-in">
          {/* --- HEADER --- */}
          <div className="flex flex-col sm:flex-row items-start gap-5">
            {/* Gambar */}
            {r.image ? (
              <img
                src={r.image}
                alt={r.name}
                className="w-full sm:w-48 h-48 sm:h-32 object-cover rounded-xl border border-line-200 bg-surface-100"
              />
            ) : (
              <div className="w-full sm:w-48 h-32 rounded-xl border border-line-200 bg-surface-100 flex items-center justify-center">
                <Salad className="w-8 h-8 stroke-ink-400" />
              </div>
            )}

            <div className="flex-1 w-full">
              <div className="flex justify-between items-start gap-2">
                <h1 className="text-2xl font-bold text-ink-900 leading-tight">
                    {r.name}
                </h1>
                {/* Badge Kategori Diabetes */}
                {analysis.label && (
                    <Badge tone={analysis.badge_color} size="lg">
                        {analysis.label}
                    </Badge>
                )}
              </div>

              <div className="flex items-center gap-3 text-sm text-ink-600 mt-2">
                <span className="inline-flex items-center gap-1 bg-surface-100 px-2 py-1 rounded-md">
                  <Timer className="w-3.5 h-3.5" />
                  {r.ready_in_min > 0 ? `${r.ready_in_min} min` : "15 min"}
                </span>
                {analysis.score !== undefined && (
                   <span className="bg-surface-100 px-2 py-1 rounded-md">
                      Score: <b>{analysis.score}/10</b>
                   </span>
                )}
              </div>

              {/* Notes dari Analisis */}
              {analysis.notes && analysis.notes.length > 0 && (
                <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-xs font-semibold text-yellow-800 mb-1">Catatan Nutrisi:</p>
                    <ul className="list-disc list-inside text-xs text-yellow-800 space-y-0.5">
                        {analysis.notes.map((note, idx) => (
                            <li key={idx}>{note}</li>
                        ))}
                    </ul>
                </div>
              )}
            </div>
          </div>

          {/* --- MACROS --- */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-sm">
            <Macro label="Calories" value={r.calories} unit="kcal" icon={Flame} />
            <Macro label="Carbs" value={r.carbs_g} unit="g" />
            <Macro label="Sugar" value={r.sugar_g} unit="g" />
            <Macro label="Fiber" value={r.fiber_g} unit="g" />
            <Macro label="Sodium" value={r.sodium_mg} unit="mg" />
          </div>

          <div className="border-t border-line-200 my-4" />

          {/* --- CONTENT --- */}
          <div className="grid gap-8 md:grid-cols-2">
            {/* Ingredients */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                 <div className="p-1.5 bg-brand-100 rounded-lg text-brand-700">
                    <Salad className="w-4 h-4" />
                 </div>
                 <h3 className="font-semibold text-ink-900 text-lg">Ingredients</h3>
              </div>
              
              {ingredients.length === 0 ? (
                <p className="text-sm text-ink-700 italic">Tidak ada data bahan.</p>
              ) : (
                <ul className="space-y-2 text-sm text-ink-800">
                  {ingredients.map((ing, i) => (
                    <li key={i} className="flex gap-2 items-start bg-surface-50 p-2 rounded-lg border border-transparent hover:border-line-200">
                      <span className="text-brand-600 mt-0.5">•</span>
                      <span>
                        {/* Spoonacular kadang memberikan 'original' string yang lengkap */}
                        {ing.original || ing.name}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Instructions */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                 <div className="p-1.5 bg-brand-100 rounded-lg text-brand-700">
                    <ChefHat className="w-4 h-4" />
                 </div>
                 <h3 className="font-semibold text-ink-900 text-lg">Instructions</h3>
              </div>

              <div 
                className="text-sm text-ink-800 space-y-4 leading-relaxed prose prose-sm prose-p:my-2 prose-li:my-1 max-w-none"
                dangerouslySetInnerHTML={{ __html: instructionsHTML }} 
              />
            </section>
          </div>

          <div className="flex justify-end pt-4">
             <Button variant="soft" onClick={() => window.history.back()}>
                Tutup
             </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}

function Macro({ label, value, unit, icon: Icon }) {
  return (
    <div className="rounded-xl border border-line-200 bg-surface-100 p-3 text-center flex flex-col items-center justify-center gap-1 transition-transform hover:-translate-y-0.5">
      {Icon && (
        <div className="w-6 h-6 rounded-full bg-surface-200 flex items-center justify-center mb-1 text-ink-600">
          <Icon className="w-3.5 h-3.5" />
        </div>
      )}
      <p className="text-[10px] uppercase tracking-wider text-ink-500 font-medium">{label}</p>
      <p className="text-base font-bold text-ink-900">
        {value != null ? Math.round(value) : "-"} <span className="text-xs font-normal text-ink-500">{unit}</span>
      </p>
    </div>
  );
}