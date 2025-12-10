import { HeartPulse, Target, ShieldCheck, Zap } from "lucide-react";

export default function About() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      {/* WRAPPER PUTIH BESAR */}
      <div className="bg-white rounded-2xl shadow-lg p-10">
        {/* HEADER */}
        <h1 className="text-4xl font-bold text-brand-900">
          About Smart Meal Checker
        </h1>

        <p className="mt-3 text-ink-700 max-w-3xl leading-relaxed">
          Smart Meal Checker is your comprehensive companion for managing your
          diet and achieving your health goals. Whether you're looking to lose
          weight, gain muscle, or maintain a healthy lifestyle, our app provides
          the tools and guidance you need.
        </p>

        <p className="mt-4 text-ink-700 max-w-3xl leading-relaxed">
          With AI-powered meal planning, recipe databases, and smart food
          checking features, you can easily track nutrition, explore foods,
          and make informed dietary decisions every day.
        </p>

        {/* GRID FITUR */}
        <div className="grid sm:grid-cols-2 gap-6 mt-10">
          {/* Health First */}
          <div className="rounded-xl bg-[#ECF7F0] border border-line-200 p-6 flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-accent-600/20 flex items-center justify-center">
              <HeartPulse className="w-5 h-5 stroke-brand-800" />
            </div>
            <div>
              <h3 className="font-semibold text-ink-900">Health First</h3>
              <p className="text-sm text-ink-700">
                Designed to help you make better dietary choices for a
                healthier lifestyle.
              </p>
            </div>
          </div>

          {/* Goal-Oriented */}
          <div className="rounded-xl bg-[#ECF7F0] border border-line-200 p-6 flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-accent-600/20 flex items-center justify-center">
              <Target className="w-5 h-5 stroke-brand-800" />
            </div>
            <div>
              <h3 className="font-semibold text-ink-900">Goal-Oriented</h3>
              <p className="text-sm text-ink-700">
                Customize your meal plans based on weight loss,
                muscle gain, or maintenance goals.
              </p>
            </div>
          </div>

          {/* Diabetes-Friendly */}
          <div className="rounded-xl bg-[#ECF7F0] border border-line-200 p-6 flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-accent-600/20 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 stroke-brand-800" />
            </div>
            <div>
              <h3 className="font-semibold text-ink-900">Diabetes-Friendly</h3>
              <p className="text-sm text-ink-700">
                Recipes and food suggestions tailored for diabetes
                management.
              </p>
            </div>
          </div>

          {/* Easy to Use */}
          <div className="rounded-xl bg-[#ECF7F0] border border-line-200 p-6 flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-accent-600/20 flex items-center justify-center">
              <Zap className="w-5 h-5 stroke-brand-800" />
            </div>
            <div>
              <h3 className="font-semibold text-ink-900">Easy to Use</h3>
              <p className="text-sm text-ink-700">
                Simple interface to check foods, browse recipes, and
                plan your meals.
              </p>
            </div>
          </div>
        </div>

        {/* MISSION */}
        <div className="rounded-xl bg-[#ECF7F0] border border-line-200 p-6 mt-10">
          <h2 className="text-xl font-semibold text-ink-900 mb-2">
            Our Mission
          </h2>
          <p className="text-sm text-ink-700 max-w-3xl">
            We believe healthy eating should be accessible, enjoyable,
            and sustainable. Our mission is to empower people with the
            knowledge and tools they need to make better food choices,
            one meal at a time.
          </p>
        </div>
      </div>
    </section>
  );
}
