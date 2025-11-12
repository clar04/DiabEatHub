import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();

  const navLinks = [
    { to: "/food", label: "Food Check" },
    { to: "/recipes", label: "Suggested Recipes" },
    { to: "/packaged", label: "Packaged Product" },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-brand-900/70 border-b border-line-200/40">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="size-8 rounded-xl bg-accent-600 flex items-center justify-center text-brand-700 font-bold">
            SM
          </div>
          <span className="font-semibold text-white">Meal Planner</span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={
                "transition " +
                (location.pathname === to
                  ? "text-brand-100 font-medium underline"
                  : "text-white/80 hover:text-white")
              }
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Button Profile */}
        <Link
          to="/profile"
          className="ml-4 rounded-xl bg-brand-700 text-white px-4 py-2 text-sm font-medium hover:bg-brand-800 transition"
        >
          Profile
        </Link>
      </div>
    </header>
  );
}
