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
import logo from "../assets/logo.png";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { profile } = useProfile();

  const loggedIn = !!currentUser;

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
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="
      sticky top-0 z-50 
      bg-gradient-to-r from-brand-900/90 via-brand-800/90 to-brand-900/90 
      backdrop-blur-md border-b border-line-200/40
      shadow-lg shadow-brand-900/25
    ">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between gap-3">

        {/* LEFT — Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-surface-100/90 
              border border-line-200/70 overflow-hidden shadow-md 
              group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
            <img src={logo} alt="Logo" className="w-full h-full object-cover" />
          </div>

          <span className="font-semibold text-white text-base group-hover:text-accent-400 transition-colors duration-300">
            Smart Meal Checker
          </span>
        </Link>

        {/* CENTER — Navigation */}
        <nav className="hidden md:flex items-center">
          <div className="flex items-center gap-1 rounded-full bg-brand-800/70 px-2 py-1 border border-brand-700/60">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const active = isActive(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className={
                    "group flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-all duration-200 " +
                    (active
                      ? "bg-accent-500 text-brand-900 font-semibold shadow shadow-accent-500/40"
                      : "text-brand-50/80 hover:text-white hover:bg-brand-700/70")
                  }
                >
                  <Icon className="w-4 h-4 opacity-90" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* RIGHT — Auth Buttons */}
        <div className="flex items-center gap-2 text-sm">
          {loggedIn ? (
            <>
              <Link
                to="/profile"
                className="rounded-full bg-brand-700 text-white px-3 py-1.5 
                  hover:bg-brand-800 hover:shadow-lg hover:shadow-brand-700/40 
                  hover:-translate-y-[1px] transition-all duration-200 flex items-center gap-1.5"
              >
                <UserRoundPlus className="w-4 h-4" />
                <span>Profile</span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-line-200/70 px-3 py-1.5 text-surface-100 
                  hover:bg-line-200/15 hover:border-line-200 hover:shadow-md 
                  hover:-translate-y-[1px] transition-all duration-200 flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full border border-line-200/70 px-3 py-1.5 text-surface-100 
                  hover:bg-line-200/15 hover:border-line-200 hover:shadow-md 
                  hover:-translate-y-[1px] transition-all duration-200 flex items-center gap-1.5"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Link>

              <Link
                to="/register"
                className="rounded-full bg-accent-500 text-brand-900 px-3 py-1.5 
                  hover:bg-accent-400 hover:shadow-lg hover:shadow-accent-500/40 
                  hover:-translate-y-[1px] transition-all duration-200 font-semibold flex items-center gap-1.5"
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
