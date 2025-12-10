// src/App.jsx
import { Outlet, useLocation, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useAuth } from "./state/AuthContext";

export default function App() {
  const location = useLocation();
  const { currentUser } = useAuth();

  const loggedIn = !!currentUser;
  const path = location.pathname;

  const publicPaths = ["/", "/about", "/login", "/register"];
  const isPublic = publicPaths.includes(path);

  // Kalau belum login dan akses halaman non-public → lempar ke login
  if (!loggedIn && !isPublic) {
    return <Navigate to="/login" replace />;
  }

  // Kalau SUDAH login tapi masih ke /login atau /register → lempar ke /home
  // (tidak peduli profil sudah lengkap atau belum)
  if (loggedIn && (path === "/login" || path === "/register")) {
    return <Navigate to="/home" replace />;
  }

  return (
    // BG web disamakan dengan header (dark green)
    <div className="min-h-screen bg-[#275a4f]">
      <div className="min-h-dvh flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}