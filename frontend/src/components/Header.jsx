// src/components/Header.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext";
import { useProfile } from "../state/ProfileContext";
import {
  Info,
  Home as HomeIcon,
  UtensilsCrossed,
  Salad,
  Package,
  History as HistoryIcon,
  LogIn,
  UserRoundPlus,
  LogOut,
} from "lucide-react";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { profile } = useProfile();

  const loggedIn = !!currentUser;
  const displayName = profile?.username || currentUser || "Guest";

  const navLinks = [
    { to: "/", label: "About", icon: Info },
    { to: "/home", label: "Home", icon: HomeIcon },
    { to: "/food", label: "Food Check", icon: UtensilsCrossed },
    { to: "/recipes", label: "Suggested Recipes", icon: Salad },
    { to: "/packaged", label: "Packaged Product", icon: Package },
    { to: "/history", label: "History", icon: HistoryIcon },
  ];

  const isActive = (to) => {
    if (to === "/") return location.pathname === "/";
    return location.pathname.startsWith(to);
  };

  const handleLogout = () => {
    if (!window.confirm("Logout dari akun ini?")) return;
    logout(); // cuma hapus session, data profile per-username tetap tersimpan
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-brand-900/80 border-b border-line-200/40 shadow-lg shadow-brand-900/20">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="size-8 rounded-xl bg-accent-600 flex items-center justify-center text-brand-700 font-bold shadow-md group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-accent-600/50 transition-all duration-300">
            SM
          </div>
          <span className="font-semibold text-white group-hover:text-accent-600 transition-colors duration-300">
            Meal Planner
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const active = isActive(to);
            return (
              <Link
                key={to}
                to={to}
                className={
                  "group relative flex items-center gap-1.5 px-1 py-1 transition-all duration-300 " +
                  (active
                    ? "text-brand-100 font-medium"
                    : "text-white/80 hover:text-white hover:scale-105")
                }
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>

                {/* underline */}
                <span
                  className={
                    "absolute bottom-0 left-0 right-0 h-0.5 rounded-full transform origin-left transition-transform duration-300 " +
                    (active
                      ? "bg-accent-600 scale-x-100 shadow-sm shadow-accent-600/50"
                      : "bg-white/30 scale-x-0 group-hover:scale-x-100")
                  }
                />
              </Link>
            );
          })}
        </nav>

        {/* Auth area */}
        <div className="flex items-center gap-3 text-sm">
          {loggedIn ? (
            <>
              <Link
                to="/profile"
                className="rounded-xl bg-brand-700 text-white px-3 py-2 hover:bg-brand-800 hover:shadow-lg hover:shadow-brand-700/30 hover:scale-105 transition-all duration-300 font-medium flex items-center gap-1.5"
              >
                <UserRoundPlus className="w-4 h-4" />
                <span>Profile</span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl border border-line-200 px-3 py-2 text-surface-100 hover:bg-line-200/20 hover:border-line-200/60 hover:scale-105 transition-all duration-300 flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-xl border border-line-200 px-3 py-2 text-surface-100 hover:bg-line-200/20 hover:border-line-200/60 hover:scale-105 transition-all duration-300 flex items-center gap-1.5"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-brand-700 text-white px-3 py-2 hover:bg-brand-800 hover:shadow-lg hover:shadow-brand-700/30 hover:scale-105 transition-all duration-300 font-medium flex items-center gap-1.5"
              >
                <UserRoundPlus className="w-4 h-4" />
                <span>Register</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
