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
    <header className="sticky top-0 z-50 backdrop-blur-md bg-brand-900/80 border-b border-line-200/40 shadow-lg shadow-brand-900/20">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        {/* Logo with enhanced styling */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="size-8 rounded-xl bg-accent-600 flex items-center justify-center text-brand-700 font-bold shadow-md group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-accent-600/50 transition-all duration-300">
            SM
          </div>
          <span className="font-semibold text-white group-hover:text-accent-600 transition-colors duration-300">
            Meal Planner
          </span>
        </Link>

        {/* Nav with enhanced hover effects */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={
                "relative transition-all duration-300 py-1 " +
                (isActive(to)
                  ? "text-brand-100 font-medium"
                  : "text-white/80 hover:text-white hover:scale-105")
              }
            >
              <span className="relative z-10">{label}</span>
              {isActive(to) && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-600 rounded-full shadow-sm shadow-accent-600/50" />
              )}
              {!isActive(to) && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Auth area with enhanced buttons */}
        <div className="flex items-center gap-3 text-sm">
          {loggedIn ? (
            <>
              <Link
                to="/profile"
                className="rounded-xl bg-brand-700 text-white px-4 py-2 hover:bg-brand-800 hover:shadow-lg hover:shadow-brand-700/30 hover:scale-105 transition-all duration-300 font-medium"
              >
                Profile
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl border border-line-200 px-4 py-2 text-surface-100 hover:bg-line-200/20 hover:border-line-200/60 hover:scale-105 transition-all duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-xl border border-line-200 px-4 py-2 text-surface-100 hover:bg-line-200/20 hover:border-line-200/60 hover:scale-105 transition-all duration-300"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-brand-700 text-white px-4 py-2 hover:bg-brand-800 hover:shadow-lg hover:shadow-brand-700/30 hover:scale-105 transition-all duration-300 font-medium"
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