import { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import { getFoodHistory } from "../utils/api";

export default function History() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    getFoodHistory()
      .then((json) => setItems(json?.data || json || []))
      .catch((e) => setErr(e.message || "Gagal memuat history"));
  }, []);

  return (
    <section>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
        <h1 className="text-4xl font-semibold text-white">History</h1>
        <Card className="mt-6 p-5">
          {err && <p className="text-sm text-red-600">{err}</p>}
          {items.length === 0 ? (
            <p className="text-ink-700 text-sm">Belum ada history.</p>
          ) : (
            <div className="space-y-3">
              {items.map((it, i) => (
                <div key={i} className="rounded-xl border border-line-200 bg-surface px-3 py-2 flex justify-between">
                  <div className="min-w-0">
                    <p className="text-ink-900 font-medium truncate">{it.name}</p>
                    <p className="text-xs text-ink-700">
                      {it.date ?? it.checked_at} • {it.kcal ?? it.nutr?.kcal} kcal • sugar {it.sugar ?? it.nutr?.sugar} g
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </section>
  );
}
