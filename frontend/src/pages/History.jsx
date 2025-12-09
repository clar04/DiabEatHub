import { useEffect, useMemo, useState } from "react";
import { Calendar, Activity } from "lucide-react";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { readLogByDate } from "../utils/foodLog";
import { useGoal } from "../state/GoalContext";

// ---- helper tanggal ----
function getLastNDays(n) {
  const out = [];
  const today = new Date();

  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);

    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const key = `${yyyy}-${mm}-${dd}`;

    const label = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    out.push({ key, label, date: d });
  }
  return out;
}

// hitung total per hari dari item log
function summarizeDayItems(items) {
  return items.reduce(
    (acc, it) => {
      // bentuk 1: it.nutr = { kcal, protein, fat, carb, sugar, fiber }
      // bentuk 2: it.{ kcal?, protein?, fat?, carbs, sugar, fiber }
      const m = it.nutr || {};

      const carb = Number(m.carb ?? it.carb ?? it.carbs ?? 0) || 0;
      const sugar = Number(m.sugar ?? it.sugar ?? 0) || 0;
      const protein = Number(m.protein ?? it.protein ?? 0) || 0;
      const fat = Number(m.fat ?? it.fat ?? 0) || 0;
      const fiber = Number(m.fiber ?? it.fiber ?? 0) || 0;

      const kcalFromMacros = carb * 4 + protein * 4 + fat * 9;
      const kcal = Number(m.kcal ?? it.kcal ?? kcalFromMacros) || 0;

      acc.kcal += kcal;
      acc.carb += carb;
      acc.sugar += sugar;
      acc.fiber += fiber;
      return acc;
    },
    { kcal: 0, carb: 0, sugar: 0, fiber: 0 }
  );
}

function getDayStatus(dayTotals, targets) {
  if (!targets) return { label: "On Track", tone: "green" };

  const exceeded =
    dayTotals.kcal > targets.calories ||
    dayTotals.carb > targets.carbs ||
    dayTotals.sugar > targets.sugar;

  if (exceeded) return { label: "Exceeded", tone: "red" };
  return { label: "On Track", tone: "green" };
}

export default function History() {
  const { targets } = useGoal(); // { calories, carbs, sugar }
  const [range, setRange] = useState("week"); // 'week' | 'month' | 'all'
  const [days, setDays] = useState([]);

  // muat data tiap ganti range
  useEffect(() => {
    let n = 7;
    if (range === "month") n = 30;
    if (range === "all") n = 90; // kira‑kira 3 bulan terakhir

    const dateInfos = getLastNDays(n);
    const enriched = dateInfos.map((info) => {
      const items = readLogByDate(info.key) || [];
      const totals = summarizeDayItems(items);

      const rounded = {
        calories: Math.round(totals.kcal),
        carbs: Math.round(totals.carb),
        sugar: Math.round(totals.sugar),
        fiber: Math.round(totals.fiber),
      };

      const status = getDayStatus(rounded, targets);

      return {
        ...info,
        items,
        totals: rounded,
        status,
      };
    });

    setDays(enriched);
  }, [range, targets]);

  // ---- summary stats (pakai hanya hari yang ada log-nya) ----
  const summary = useMemo(() => {
    const withData = days.filter((d) => d.totals.calories > 0);
    const count = withData.length || 1;

    const sum = withData.reduce(
      (acc, d) => {
        acc.calories += d.totals.calories;
        acc.carbs += d.totals.carbs;
        acc.sugar += d.totals.sugar;
        acc.fiber += d.totals.fiber;

        const exceeded =
          targets &&
          (d.totals.calories > targets.calories ||
            d.totals.carbs > targets.carbs ||
            d.totals.sugar > targets.sugar);

        if (exceeded) acc.daysExceeded += 1;
        return acc;
      },
      { calories: 0, carbs: 0, sugar: 0, fiber: 0, daysExceeded: 0 }
    );

    const avgCalories = Math.round(sum.calories / count) || 0;
    const avgCarbs = Math.round(sum.carbs / count) || 0;
    const avgSugar = Math.round(sum.sugar / count) || 0;
    const avgFiber = Math.round(sum.fiber / count) || 0;

    const adherence =
      count > 0 ? Math.round(((count - sum.daysExceeded) / count) * 100) : 0;

    return {
      avgCalories,
      avgCarbs,
      avgSugar,
      avgFiber,
      daysExceeded: sum.daysExceeded,
      totalDays: count,
      adherence,
    };
  }, [days, targets]);

  // untuk chart bar
  const maxCalories =
    days.reduce((m, d) => Math.max(m, d.totals.calories), 0) || 1;
  const maxCarbKcal =
    days.reduce((m, d) => Math.max(m, d.totals.carbs * 4), 0) || 1;

  // recent logs: hanya hari yg ada log, urut terbaru
  const recentLogs = [...days]
    .filter((d) => d.totals.calories > 0)
    .sort((a, b) => b.date - a.date);

  return (
    <section className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
            <Calendar className="w-4 h-4" />
          </span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
              Eating History
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Weekly overview of your calories, carbs, sugar, and fiber.
            </p>
          </div>
        </div>

        {/* Range toggle */}
        <div className="inline-flex rounded-full bg-slate-100 p-1 text-xs sm:text-sm">
          {["week", "month", "all"].map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setRange(key)}
              className={`px-3 py-1 rounded-full font-medium transition ${
                range === key
                  ? "bg-emerald-700 text-white"
                  : "text-slate-700 hover:bg-white"
              }`}
            >
              {key === "week"
                ? "Week"
                : key === "month"
                ? "Month"
                : "All"}
            </button>
          ))}
        </div>
      </div>

      {/* TOP SUMMARY CARDS */}
      <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
        <StatCard
          title="Avg Calories"
          value={summary.avgCalories}
          subtitle="per day"
        />
        <StatCard
          title="Avg Carbs"
          value={`${summary.avgCarbs}g`}
          subtitle="per day"
        />
        <StatCard
          title="Avg Sugar"
          value={`${summary.avgSugar}g`}
          subtitle="per day"
        />
        <StatCard
          title="Avg Fiber"
          value={`${summary.avgFiber}g`}
          subtitle="per day"
        />
        <StatCard
          title="Days Exceeded"
          value={summary.daysExceeded}
          subtitle={`out of ${summary.totalDays}`}
        />
        <StatCard
          title="Adherence Rate"
          value={`${summary.adherence}%`}
          subtitle="on track"
        />
      </div>

      {/* WEEKLY TRENDS CARD */}
      <Card className="mt-2 border-0 bg-[#ECF7F0]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
              <Activity className="w-4 h-4" />
            </span>
            <h2 className="text-sm sm:text-base font-semibold text-slate-900">
              Weekly Trends
            </h2>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <div className="flex items-end gap-4 min-h-[180px] px-2">
            {days.map((d) => {
              const calHeight = (d.totals.calories / maxCalories) * 100;
              const carbHeight =
                ((d.totals.carbs * 4) / maxCarbKcal) * 100 || 0;

              return (
                <div
                  key={d.key}
                  className="flex flex-col items-center justify-end gap-2 text-xs"
                >
                  <div className="flex h-40 w-10 items-end gap-1">
                    {/* Calories bar (light) */}
                    <div
                      className="flex-1 rounded-t-md bg-emerald-300"
                      style={{ height: `${calHeight}%` }}
                    />
                    {/* Carbs bar (dark) */}
                    <div
                      className="flex-1 rounded-t-md bg-slate-900"
                      style={{ height: `${carbHeight}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-slate-700">
                    {d.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* legend */}
          <div className="mt-3 flex items-center gap-4 text-[11px] text-slate-700 px-2 pb-1">
            <div className="flex items-center gap-1">
              <span className="inline-block h-2 w-4 rounded-full bg-emerald-300" />
              <span>Calories</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="inline-block h-2 w-4 rounded-full bg-slate-900" />
              <span>Carbs</span>
            </div>
          </div>
        </div>
      </Card>

      {/* RECENT LOGS */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm sm:text-base font-semibold text-slate-900">
            Recent Logs
          </h2>
        </div>

        {recentLogs.length === 0 ? (
          <Card className="p-4">
            <p className="text-sm text-slate-600">
              Belum ada log harian. Coba gunakan fitur{" "}
              <span className="font-semibold">Add to Log</span> di tab
              Food Check terlebih dulu.
            </p>
          </Card>
        ) : (
          <div className="space-y-2">
            {recentLogs.map((d) => (
              <Card
                key={d.key}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 py-3 bg-white rounded-2xl"
              >
                <div className="space-y-1">
                  <p className="text-xs text-slate-500">
                    {d.date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-slate-700">
                    <div>
                      <p className="text-slate-500">Calories</p>
                      <p className="font-semibold text-slate-900">
                        {d.totals.calories}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Carbs</p>
                      <p className="font-semibold text-slate-900">
                        {d.totals.carbs}g
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Sugar</p>
                      <p className="font-semibold text-slate-900">
                        {d.totals.sugar}g
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Fiber</p>
                      <p className="font-semibold text-slate-900">
                        {d.totals.fiber}g
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 sm:mt-0 sm:self-center">
                  <Badge tone={d.status.tone} size="lg">
                    {d.status.label}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ===== Small components ===== */

function StatCard({ title, value, subtitle }) {
  return (
    <Card className="border-0 bg-[#E8F5EC] px-4 py-3 rounded-2xl">
      <p className="text-[11px] text-slate-600 mb-1">{title}</p>
      <p className="text-lg font-semibold text-slate-900">{value}</p>
      <p className="text-[11px] text-slate-500 mt-1">{subtitle}</p>
    </Card>
  );
}
