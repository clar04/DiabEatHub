import Header from "./components/Header";
import GoalCard from "./components/GoalCard";
import Tabs from "./components/Tabs";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-dvh flex flex-col">
      <Header />

      <section className="ring-spot">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
          <div className="grid gap-6 md:grid-cols-5 items-stretch">
            <div className="md:col-span-3">
              <h1 className="text-4xl sm:text-5xl font-semibold text-white">Smart Meal Checker</h1>
              <p className="mt-2 text-white/90">
                Manage your diet, regulate calories and get a healthy body
              </p>

              <div className="mt-6">
                <GoalCard />
              </div>
            </div>

            <div className="hidden md:block md:col-span-2">
              <div className="h-full w-full rounded-2xl bg-brand-800/30 border border-line-200/40 flex items-center justify-center overflow-hidden">
                <div className="size-[520px] rounded-full border-4 border-surface-200/50 relative">
                  <div className="absolute inset-6 rounded-full border-4 border-surface-200/40"></div>
                  <div className="absolute inset-14 rounded-full border-4 border-surface-200/30"></div>
                  <div className="absolute inset-24 rounded-full border-4 border-surface-200/20"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <Tabs />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
