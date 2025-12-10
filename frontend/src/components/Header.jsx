// src/components/Header.jsx
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../state/AuthContext";
import logo from "../assets/logo.png"; // ✅ import logo

export default function Header() {
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      window.location.href = "/";
    }
  };

  const navLinkClass =
    "text-sm sm:text-base px-2 py-1 rounded-full transition-colors";

  return (
    <header className="border-b border-white/10 bg-[#275a4f] text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:py-4">
        
        {/* ✅ BRAND + LOGO */}
        <Link
          to="/"
          className="flex items-center gap-3 text-xl font-semibold tracking-tight"
        >
          <img
            src={logo}
            alt="Logo"
            className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover bg-white"
          />
          <span>Meal Planner</span>
        </Link>
        {/* Nav links */}
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

        {/* Auth button */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <span className="hidden text-sm sm:inline">
              Hi, <span className="font-semibold">{currentUser.name}</span>
            </span>
          ) : location.pathname === "/login" ? (
            <Link
              to="/register"
              className="rounded-full bg-[#00796b] px-4 py-1.5 text-sm font-semibold text-white hover:bg-[#006158]"
            >
              Register
            </Link>
          ) : (
            <Link
              to="/login"
              className="rounded-full bg-[#00796b] px-4 py-1.5 text-sm font-semibold text-white hover:bg-[#006158]"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
