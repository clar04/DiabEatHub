// src/components/Header.jsx
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../state/AuthContext";

export default function Header() {
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      // setelah logout balik ke landing page
      window.location.href = "/";
    }
  };

  const navLinkClass =
    "text-sm sm:text-base px-2 py-1 rounded-full transition-colors";

  return (
    <header className="border-b border-white/10 bg-[#275a4f] text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:py-4">
        {/* Brand */}
        <Link to="/" className="text-lg font-semibold tracking-tight">
          Meal Planner
        </Link>

        {/* Nav links (desktop) */}
        <nav className="hidden items-center gap-4 sm:flex">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              `${navLinkClass} ${isActive ? "bg-white/15" : "hover:bg-white/10"}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `${navLinkClass} ${isActive ? "bg-white/15" : "hover:bg-white/10"}`
            }
          >
            Profile
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) =>
              `${navLinkClass} ${isActive ? "bg-white/15" : "hover:bg-white/10"}`
            }
          >
            History
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `${navLinkClass} ${isActive ? "bg-white/15" : "hover:bg-white/10"}`
            }
          >
            About
          </NavLink>
        </nav>

        {/* Auth buttons */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <>
              <span className="hidden text-sm sm:inline">
                Hi, <span className="font-semibold">{currentUser.name}</span>
              </span>

            </>
          ) : location.pathname === "/login" ? (
            <Link
              to="/register"
              className="rounded-full bg-[#00796b] px-4 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-[#006158] transition-colors"
            >
              Register
            </Link>
          ) : (
            <Link
              to="/login"
              className="rounded-full bg-[#00796b] px-4 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-[#006158] transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
