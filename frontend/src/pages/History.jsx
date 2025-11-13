import { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { readRecipeHistory, clearRecipeHistory } from "../utils/recipeHistory";

function flagTone(flag) {
  if (flag === "red") return "red";
  if (flag === "yellow") return "yellow";
  return "green";
}

export default function History() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(readRecipeHistory());
  }, []);

  const handleRefresh = () => {
    setItems(readRecipeHistory());
  };

  const handleClear = () => {
    if (!window.confirm("Hapus semua history resep?")) return;
    clearRecipeHistory();
    setItems([]);
  };

  return (
    <section>
      <h1 className="text-3xl sm:text-4xl font-semibold text-white">
        Recipe History
      </h1>
      <p className="mt-2 text-sm text-surface-200">
        Riwayat <span className="font-semibold">10 resep terakhir</span> yang
        kamu lihat dari menu{" "}
        <span className="font-semibold">Suggested Recipes</span>.
      </p>

      <div className="mt-4 flex gap-2">
        <Button variant="ghost" type="button" onClick={handleRefresh}>
          Refresh
        </Button>
        {items.length > 0 && (
          <Button
            variant="ghost"
            type="button"
            className="text-red-700"
            onClick={handleClear}
          >
            Hapus history
          </Button>
        )}
      </div>

      <Card className="mt-4 p-5">
        {items.length === 0 ? (
          <p className="text-sm text-ink-700">
            Belum ada history resep. Buka tab{" "}
            <span className="font-semibold">Suggested Recipes</span> lalu klik{" "}
            <span className="font-semibold">Lihat detail</span> pada salah satu
            resep.
          </p>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {items.map((r) => (
              <li
                key={r.id}
                className="rounded-2xl border border-line-200 bg-surface-100 p-4 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-ink-900">{r.title}</p>
                    <p className="text-xs text-ink-700">
                      Cook: {r.cookTime} min • {r.kcal} kcal
                    </p>
                  </div>
                  <Badge tone={flagTone(r.flag)}>
                    {r.flag === "red"
                      ? "Hindari"
                      : r.flag === "yellow"
                      ? "Watch carbs"
                      : "Diabetes-Friendly"}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="rounded-xl bg-surface px-2 py-2 border border-line-200 text-center">
                    <p className="text-ink-700">Kcal</p>
                    <p className="font-semibold text-ink-900">{r.kcal}</p>
                  </div>
                  <div className="rounded-xl bg-surface px-2 py-2 border border-line-200 text-center">
                    <p className="text-ink-700">Carbs</p>
                    <p className="font-semibold text-ink-900">{r.carbs} g</p>
                  </div>
                  <div className="rounded-xl bg-surface px-2 py-2 border border-line-200 text-center">
                    <p className="text-ink-700">Sugar</p>
                    <p className="font-semibold text-ink-900">{r.sugar} g</p>
                  </div>
                </div>

                <p className="text-[11px] text-ink-700">
                  Disimpan pada:{" "}
                  {new Date(r.savedAt).toLocaleString("id-ID", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </section>
  );
}
