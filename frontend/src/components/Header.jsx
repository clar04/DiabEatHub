import Button from "./ui/Button";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-brand-900/70 border-b border-line-200/40">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-xl bg-accent-600 flex items-center justify-center text-brand-700 font-bold">
            SM
          </div>
          <span className="font-semibold text-white">Meal Planner</span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm text-white/80">
          <a href="#food" className="hover:text-white">Food Check</a>
          <a href="#recipes" className="hover:text-white">Recipes</a>
          <a href="#packaged" className="hover:text-white">Packaged</a>
        </nav>

        <Button variant="soft" className="px-3 py-2">Sign In</Button>
      </div>
    </header>
  );
}
