// src/components/Header.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext";
import { useProfile } from "../state/ProfileContext";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { profile } = useProfile();

  const loggedIn = !!currentUser;
  const displayName = profile?.username || currentUser || "Guest";

  const navLinks = [
    { to: "/", label: "About" },
    { to: "/home", label: "Home" },
    { to: "/food", label: "Food Check" },
    { to: "/recipes", label: "Suggested Recipes" },
    { to: "/packaged", label: "Packaged Product" },
    { to: "/history", label: "History" },
  ];

  const isActive = (to) => {
    if (to === "/") return location.pathname === "/";
    return location.pathname.startsWith(to);
  };

  const handleLogout = () => {
    if (!window.confirm("Logout dari akun ini?")) return;
    logout();
    // profile per-username tetap tersimpan di localStorage
    navigate("/login", { replace: true });
  };

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
                (isActive(to)
                  ? "text-brand-100 font-medium underline"
                  : "text-white/80 hover:text-white")
              }
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Auth area */}
        <div className="flex items-center gap-3 text-sm">
          {loggedIn ? (
            <>
              {/* Sapaan dipindah ke Home.jsx, jadi di header kita cukup tombol saja */}
              <Link
                to="/profile"
                className="rounded-xl bg-brand-700 text-white px-3 py-1.5 hover:bg-brand-800 transition"
              >
                Profile
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl border border-line-200 px-3 py-1.5 text-surface-100 hover:bg-line-200/20 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-xl border border-line-200 px-3 py-1.5 text-surface-100 hover:bg-line-200/20 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-brand-700 text-white px-3 py-1.5 hover:bg-brand-800 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
