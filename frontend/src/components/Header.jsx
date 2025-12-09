export default function Header() {
  return (
    <header className="w-full bg-brand-700">
      <div className="mx-auto max-w-6xl px-6 h-20 flex items-center justify-between">
        {/* Left */}
        <h1 className="text-white text-xl font-bold">
          Meal Planner
        </h1>

        {/* Right */}
        <a
          href="/login"
          className="bg-white text-brand-700 px-6 py-2 rounded-full text-sm font-semibold hover:bg-gray-100 transition"
        >
          Sign In
        </a>
      </div>
    </header>
  );
}
